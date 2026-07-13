import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";
import express from "express";
import pg from "pg";

const { Pool } = pg;
const rootDir = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(rootDir, ".env") });

const port = Number(process.env.PORT || 8765);
const databaseUrl = process.env.DATABASE_URL || "";
const shouldUseSsl = /sslmode=require|neon\.tech/i.test(databaseUrl) || process.env.NODE_ENV === "production";
const pool = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
      max: Number(process.env.PG_POOL_SIZE || 5),
      ssl: shouldUseSsl ? { rejectUnauthorized: false } : undefined,
    })
  : null;
let databaseBootstrapError = null;

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, X-Student-Id, X-Auth-Token, X-Staff-Id, X-Staff-Role, X-Staff-Auth-Token",
  );

  if (request.method === "OPTIONS") {
    response.sendStatus(204);
    return;
  }

  next();
});

const teacherPassword = hashPassword("teacher123");
const curatorPassword = hashPassword("curator123");
const adminPassword = hashPassword("admin123");
const studentPassword = hashPassword("student123");

function asyncRoute(handler) {
  return (request, response, next) => {
    Promise.resolve(handler(request, response, next)).catch(next);
  };
}

function createHttpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function requireDatabase() {
  if (!pool) {
    throw createHttpError(503, "DATABASE_URL is not configured. Add the Neon connection string in Render environment variables.");
  }

  return pool;
}

async function dbQuery(text, params = []) {
  return requireDatabase().query(text, params);
}

async function dbOne(text, params = []) {
  const result = await dbQuery(text, params);
  return result.rows[0] || null;
}

function hashPassword(value) {
  return crypto.createHash("sha256").update(String(value || "")).digest("hex");
}

function createToken() {
  return crypto.randomBytes(32).toString("hex");
}

function normalizeLogin(value) {
  return String(value || "").trim().toLowerCase();
}

function cleanText(value, maxLength = 1000) {
  const text = String(value ?? "").trim();
  return text.length > maxLength ? text.slice(0, maxLength) : text;
}

function toInt(value, fallback = null) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toDateText(value) {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function normalizeLink(value) {
  const trimmed = String(value || "").trim();

  if (!trimmed) {
    return "";
  }

  if (/^http:\/\//i.test(trimmed)) {
    return trimmed.replace(/^http:\/\//i, "https://");
  }

  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }

  return trimmed;
}

function isGoogleDriveLikeUrl(value) {
  try {
    const url = new URL(normalizeLink(value));
    const host = url.hostname.toLowerCase();
    return url.protocol === "https:" && (host === "google.com" || host.endsWith(".google.com"));
  } catch {
    return false;
  }
}

function splitStudentName(name) {
  const parts = cleanText(name, 150).split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || "Ученик",
    lastName: parts.slice(1).join(" ") || "",
  };
}

function staffPublic(row) {
  return {
    staffAccountId: row.staffAccountId,
    role: row.role,
    staffId: row.staffId,
    teacherId: row.teacherId,
    curatorId: row.curatorId,
    adminId: row.adminId,
    login: row.login,
    name: row.name,
    authToken: row.authToken || "",
  };
}

async function getStudentByToken(request, { required = true } = {}) {
  const studentId = toInt(request.get("X-Student-Id"), 0);
  const authToken = cleanText(request.get("X-Auth-Token"), 200);

  if (!studentId || !authToken) {
    if (required) {
      throw createHttpError(401, "Войдите в аккаунт ученика.");
    }
    return null;
  }

  const row = await dbOne(
    `
      SELECT
        s.id AS "studentId",
        s.first_name AS "firstName",
        s.last_name AS "lastName",
        s.phone,
        s.email,
        s.grade,
        sa.login,
        sa.auth_token AS "authToken"
      FROM student_accounts sa
      JOIN students s ON s.id = sa.student_id
      WHERE s.id = $1
        AND sa.auth_token = $2
        AND sa.auth_expires_at > NOW()
    `,
    [studentId, authToken],
  );

  if (!row && required) {
    throw createHttpError(401, "Сессия ученика истекла. Войдите заново.");
  }

  return row;
}

async function getStaffByToken(request, { required = true } = {}) {
  const staffId = toInt(request.get("X-Staff-Id"), 0);
  const role = cleanText(request.get("X-Staff-Role"), 30);
  const authToken = cleanText(request.get("X-Staff-Auth-Token"), 200);

  if (!staffId || !role || !authToken) {
    if (required) {
      throw createHttpError(401, "Войдите в кабинет команды.");
    }
    return null;
  }

  if (role === "Admin") {
    const admin = await dbOne(
      `
        SELECT
          id AS "staffAccountId",
          'Admin' AS role,
          id AS "staffId",
          id AS "adminId",
          NULL::integer AS "teacherId",
          NULL::integer AS "curatorId",
          login,
          auth_token AS "authToken",
          CONCAT(first_name, ' ', last_name) AS name
        FROM admin_accounts
        WHERE id = $1
          AND auth_token = $2
          AND auth_expires_at > NOW()
      `,
      [staffId, authToken],
    );

    if (!admin && required) {
      throw createHttpError(401, "Сессия администратора истекла. Войдите заново.");
    }

    return admin ? staffPublic(admin) : null;
  }

  const row = await dbOne(
    `
      SELECT
        sa.id AS "staffAccountId",
        sa.role,
        sa.teacher_id AS "teacherId",
        sa.curator_id AS "curatorId",
        CASE WHEN sa.role = 'Teacher' THEN sa.teacher_id ELSE sa.curator_id END AS "staffId",
        sa.login,
        sa.auth_token AS "authToken",
        CASE
          WHEN sa.role = 'Teacher' THEN CONCAT(t.first_name, ' ', t.last_name)
          ELSE CONCAT(cu.first_name, ' ', cu.last_name)
        END AS "name"
      FROM staff_accounts sa
      LEFT JOIN teachers t ON t.id = sa.teacher_id
      LEFT JOIN curators cu ON cu.id = sa.curator_id
      WHERE sa.role = $1
        AND sa.auth_token = $2
        AND sa.auth_expires_at > NOW()
        AND CASE WHEN sa.role = 'Teacher' THEN sa.teacher_id ELSE sa.curator_id END = $3
    `,
    [role, authToken, staffId],
  );

  if (!row && required) {
    throw createHttpError(401, "Сессия команды истекла. Войдите заново.");
  }

  return row ? staffPublic(row) : null;
}

function courseScopeWhere(staff, alias = "c", firstParamIndex = 1) {
  const column = staff.role === "Teacher" ? "teacher_id" : "curator_id";
  return `${alias}.${column} = $${firstParamIndex}`;
}

function staffScopeId(staff) {
  return staff.role === "Teacher" ? staff.teacherId : staff.curatorId;
}

async function requireAdmin(request) {
  const staff = await getStaffByToken(request);

  if (staff.role !== "Admin" || !staff.adminId) {
    throw createHttpError(403, "Only administrators can perform this action.");
  }

  return staff;
}

async function runSchemaAndSeed() {
  if (!pool) {
    console.warn("DATABASE_URL is empty. Static files will work, API routes will return 503.");
    return;
  }

  if (String(process.env.AUTO_MIGRATE || "true").toLowerCase() === "false") {
    console.log("AUTO_MIGRATE=false, skipping database schema and seed step.");
    return;
  }

  const schemaPath = path.join(rootDir, "database", "neon-schema.sql");
  const schema = await fs.readFile(schemaPath, "utf8");
  await dbQuery(schema);
  await runRuntimeMigrations();
  await seedDatabase();
}

async function runRuntimeMigrations() {
  await dbQuery(`
    ALTER TABLE chats ALTER COLUMN student_id DROP NOT NULL;
    ALTER TABLE chats ADD COLUMN IF NOT EXISTS admin_id INTEGER REFERENCES admin_accounts(id) ON DELETE SET NULL;
    ALTER TABLE chats ADD COLUMN IF NOT EXISTS chat_type TEXT NOT NULL DEFAULT 'Legacy';
    ALTER TABLE chats ADD COLUMN IF NOT EXISTS target_role TEXT;

    CREATE TABLE IF NOT EXISTS curator_teachers (
      curator_id INTEGER NOT NULL REFERENCES curators(id) ON DELETE CASCADE,
      teacher_id INTEGER NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (curator_id, teacher_id)
    );

    ALTER TABLE support_requests ADD COLUMN IF NOT EXISTS processed_at TIMESTAMPTZ;
    ALTER TABLE support_requests ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
    ALTER TABLE support_requests ADD COLUMN IF NOT EXISTS admin_note TEXT;

    CREATE TABLE IF NOT EXISTS student_calls (
      id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
      curator_id INTEGER NOT NULL REFERENCES curators(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      call_link TEXT,
      starts_at TIMESTAMPTZ NOT NULL,
      status TEXT NOT NULL DEFAULT 'Planned' CHECK (status IN ('Planned', 'Done', 'Cancelled')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS student_call_participants (
      call_id INTEGER NOT NULL REFERENCES student_calls(id) ON DELETE CASCADE,
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (call_id, student_id)
    );

    CREATE INDEX IF NOT EXISTS idx_student_calls_curator ON student_calls(curator_id, starts_at);
    CREATE INDEX IF NOT EXISTS idx_student_call_participants_student ON student_call_participants(student_id);

    DO $$
    BEGIN
      ALTER TABLE chat_messages DROP CONSTRAINT IF EXISTS chat_messages_sender_role_check;
      ALTER TABLE chat_messages
        ADD CONSTRAINT chat_messages_sender_role_check
        CHECK (sender_role IN ('Student', 'Teacher', 'Curator', 'Admin', 'System'));
    END $$;
  `);
}

async function seedDatabase() {
  const client = await requireDatabase().connect();

  try {
    await client.query("BEGIN");

    const teachers = [
      [1, "Ярослав", "Иванов", "+7 900 100-10-10", "teacher@example.com", "https://t.me/teacher_math", 4.9],
      [2, "Анна", "Смирнова", "+7 900 100-10-11", "teacher_russian@example.com", "https://t.me/teacher_russian", 4.8],
      [3, "Дмитрий", "Кузнецов", "+7 900 100-10-12", "teacher_it@example.com", "https://t.me/teacher_it", 4.7],
      [4, "Мария", "Волкова", "+7 900 100-10-13", "teacher_physics@example.com", "https://t.me/teacher_physics", 4.8],
    ];

    for (const teacher of teachers) {
      await client.query(
        `
          INSERT INTO teachers (id, first_name, last_name, phone, email, telegram_link, average_rating)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (id) DO UPDATE SET
            first_name = EXCLUDED.first_name,
            last_name = EXCLUDED.last_name,
            phone = EXCLUDED.phone,
            email = EXCLUDED.email,
            telegram_link = EXCLUDED.telegram_link,
            average_rating = EXCLUDED.average_rating,
            active = TRUE
        `,
        teacher,
      );
    }

    const curators = [
      [1, "Елена", "Орлова", "+7 900 200-20-10", "curator@example.com", "https://t.me/curator_main", 4.9],
      [2, "Мария", "Соколова", "+7 900 200-20-11", "curator_maria@example.com", "https://t.me/curator_maria", 4.8],
      [3, "Иван", "Павлов", "+7 900 200-20-12", "curator_ivan@example.com", "https://t.me/curator_ivan", 4.7],
    ];

    for (const curator of curators) {
      await client.query(
        `
          INSERT INTO curators (id, first_name, last_name, phone, email, telegram_link, average_rating)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (id) DO UPDATE SET
            first_name = EXCLUDED.first_name,
            last_name = EXCLUDED.last_name,
            phone = EXCLUDED.phone,
            email = EXCLUDED.email,
            telegram_link = EXCLUDED.telegram_link,
            average_rating = EXCLUDED.average_rating,
            active = TRUE
        `,
        curator,
      );
    }

    const staffAccounts = [
      ["Teacher", 1, null, "teacher", teacherPassword],
      ["Teacher", 2, null, "teacher_russian", teacherPassword],
      ["Teacher", 3, null, "teacher_it", teacherPassword],
      ["Teacher", 4, null, "teacher_physics", teacherPassword],
      ["Curator", null, 1, "curator", curatorPassword],
      ["Curator", null, 2, "curator_maria", curatorPassword],
      ["Curator", null, 3, "curator_ivan", curatorPassword],
    ];

    for (const account of staffAccounts) {
      await client.query(
        `
          INSERT INTO staff_accounts (role, teacher_id, curator_id, login, password_hash)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (login) DO UPDATE SET
            role = EXCLUDED.role,
            teacher_id = EXCLUDED.teacher_id,
            curator_id = EXCLUDED.curator_id,
            password_hash = EXCLUDED.password_hash
        `,
        account,
      );
    }

    const adminAccounts = [
      [1, "Алексей", "Админов", "admin", adminPassword],
      [2, "Ольга", "Управляющая", "admin_olga", adminPassword],
      [3, "Никита", "Координатор", "admin_nikita", adminPassword],
      [4, "Виктор", "Администратор", "vizor_admin", adminPassword],
    ];

    for (const admin of adminAccounts) {
      await client.query(
        `
          INSERT INTO admin_accounts (id, first_name, last_name, login, password_hash)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (login) DO UPDATE SET
            first_name = EXCLUDED.first_name,
            last_name = EXCLUDED.last_name,
            password_hash = EXCLUDED.password_hash
        `,
        admin,
      );
    }

    const courses = [
      [1, "math", "ЕГЭ Математика", "Производные, параметры, планиметрия и ДЗ", "Уроки, записи, конспекты и домашние задания по профильной математике.", "Математика", 1, 1],
      [2, "russian", "ЕГЭ Русский язык", "Орфоэпия, сочинение, практика и ДЗ", "Подготовка к русскому языку: теория, конспекты и проверка работ.", "Русский язык", 2, 1],
      [3, "informatics", "ЕГЭ Информатика", "Алгоритмы, Python, логика и практика", "Курс по информатике с видеоуроками, конспектами и домашними заданиями.", "Информатика", 3, 2],
      [4, "physics", "ЕГЭ Физика", "Механика, электростатика, оптика", "Подготовка к физике с домашними заданиями и трансляциями.", "Физика", 4, 2],
      [5, "english", "ЕГЭ Английский язык", "Грамматика, письмо и аудирование", "Демо-курс английского языка для каталога.", "Английский язык", 2, 3],
      [6, "ogeMath", "ОГЭ Математика", "Проценты, уравнения и геометрия", "Курс ОГЭ по математике с понятной практикой.", "Математика ОГЭ", 1, 3],
    ];

    for (const course of courses) {
      await client.query(
        `
          INSERT INTO courses (id, slug, title, short_description, description, subject, teacher_id, curator_id, total_lessons, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 0, 'Active')
          ON CONFLICT (id) DO UPDATE SET
            slug = EXCLUDED.slug,
            title = EXCLUDED.title,
            short_description = EXCLUDED.short_description,
            description = EXCLUDED.description,
            subject = EXCLUDED.subject,
            teacher_id = EXCLUDED.teacher_id,
            curator_id = EXCLUDED.curator_id,
            status = 'Active'
        `,
        course,
      );
    }

    await client.query(
      `
        INSERT INTO curator_teachers (curator_id, teacher_id)
        SELECT DISTINCT curator_id, teacher_id
        FROM courses
        WHERE curator_id IS NOT NULL
          AND teacher_id IS NOT NULL
        ON CONFLICT (curator_id, teacher_id) DO NOTHING
      `,
    );

    const lessons = createSeedLessons();

    for (const lesson of lessons) {
      await client.query(
        `
          INSERT INTO lessons (id, course_id, lesson_number, title, topic, video_url, notes_url, homework_url, duration_minutes, is_open, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 90, TRUE, $9)
          ON CONFLICT (id) DO UPDATE SET
            course_id = EXCLUDED.course_id,
            lesson_number = EXCLUDED.lesson_number,
            title = EXCLUDED.title,
            topic = EXCLUDED.topic,
            video_url = EXCLUDED.video_url,
            notes_url = EXCLUDED.notes_url,
            homework_url = EXCLUDED.homework_url,
            status = EXCLUDED.status,
            updated_at = NOW()
        `,
        [
          lesson.id,
          lesson.courseId,
          lesson.lessonNumber,
          lesson.title,
          lesson.topic,
          lesson.videoUrl,
          lesson.notesUrl,
          lesson.homeworkUrl,
          lesson.status,
        ],
      );

      if (lesson.notesUrl) {
        await client.query(
          `
            INSERT INTO notes (id, course_id, lesson_id, title, material_type, author, file_url, active)
            VALUES ($1, $2, $3, $4, 'Конспект', 'Онлайн-школа', $5, TRUE)
            ON CONFLICT (id) DO UPDATE SET
              title = EXCLUDED.title,
              file_url = EXCLUDED.file_url,
              active = TRUE
          `,
          [lesson.id, lesson.courseId, lesson.id, `Конспект: ${lesson.title}`, lesson.notesUrl],
        );
      }

      if (lesson.homeworkUrl) {
        const teacherId = courses.find((course) => course[0] === lesson.courseId)?.[6] || 1;
        await client.query(
          `
            INSERT INTO homework_templates (id, course_id, lesson_id, teacher_id, title, description, file_url, max_score, active)
            VALUES ($1, $2, $3, $4, $5, $6, $7, 10, TRUE)
            ON CONFLICT (id) DO UPDATE SET
              title = EXCLUDED.title,
              description = EXCLUDED.description,
              file_url = EXCLUDED.file_url,
              max_score = 10,
              active = TRUE
          `,
          [lesson.id, lesson.courseId, lesson.id, teacherId, `ДЗ: ${lesson.title}`, lesson.topic, lesson.homeworkUrl],
        );
      }
    }

    await client.query(
      `
        UPDATE courses c
        SET total_lessons = sub.lesson_count
        FROM (
          SELECT course_id, COUNT(*)::integer AS lesson_count
          FROM lessons
          GROUP BY course_id
        ) sub
        WHERE sub.course_id = c.id
      `,
    );

    const streams = [
      [1, 1, 103, "Разбор задач с параметром", 5, "https://meet.google.com/math-parameters-demo"],
      [2, 2, 203, "Практикум по сочинению", 28, "https://meet.google.com/russian-essay-demo"],
      [3, 3, 303, "Python: разбор типовых задач", 52, "https://meet.google.com/python-demo"],
      [4, 4, 403, "Электростатика: задачи второй части", 76, "https://meet.google.com/physics-demo"],
    ];

    for (const stream of streams) {
      await client.query(
        `
          INSERT INTO live_streams (id, course_id, lesson_id, title, starts_at, ends_at, stream_link, status, created_at)
          VALUES ($1, $2, $3, $4, NOW() + ($5::integer::text || ' hours')::interval, NOW() + (($5::integer + 2)::text || ' hours')::interval, $6, 'Planned', NOW())
          ON CONFLICT (id) DO UPDATE SET
            course_id = EXCLUDED.course_id,
            lesson_id = EXCLUDED.lesson_id,
            title = EXCLUDED.title,
            starts_at = EXCLUDED.starts_at,
            ends_at = EXCLUDED.ends_at,
            stream_link = EXCLUDED.stream_link,
            status = 'Planned'
        `,
        stream,
      );
    }

    const shopItems = [
      [1, "blue_scarf", "Голубой шарф", "neck", 120, "blue-scarf", "Мягкий пиксельный шарф для учебных марафонов."],
      [2, "green_hoodie", "Зелёная худи", "outfit", 240, "green-hoodie", "Уютная худи для длинных разборов задач."],
      [3, "round_glasses", "Круглые очки", "face", 180, "round-glasses", "Очки для мудрого пиксельного питомца."],
      [4, "gold_crown", "Золотая корона", "head", 420, "gold-crown", "Награда за стабильную работу."],
      [5, "pet_cat", "Пиксельный кот", "animal", 160, "cat", "Можно заменить капибару на кота с серьёзным учебным взглядом."],
      [6, "pet_fox", "Пиксельная лиса", "animal", 220, "fox", "Лиса для тех, кто быстро щёлкает варианты."],
      [7, "pet_panda", "Пиксельная панда", "animal", 260, "panda", "Спокойная панда для аккуратного прогресса."],
      [8, "fur_choco", "Шоколадная шерсть", "fur", 90, "fur-choco", "Глубокий тёплый цвет шерсти."],
      [9, "fur_cream", "Кремовая шерсть", "fur", 110, "fur-cream", "Светлая шерсть в мягком пиксельном стиле."],
      [10, "fur_gray", "Серая шерсть", "fur", 130, "fur-gray", "Строгий серый цвет для рабочего настроя."],
      [11, "eyes_green", "Зелёные глаза", "eyes", 80, "eyes-green", "Яркий взгляд перед контрольной."],
      [12, "eyes_blue", "Синие глаза", "eyes", 80, "eyes-blue", "Синие глаза для спокойного фокуса."],
      [13, "eyes_star", "Звёздные глаза", "eyes", 180, "eyes-star", "Глаза, когда задача наконец сошлась."],
      [14, "scene_room", "Учебная комната", "scene", 100, "scene-room", "Фон с полкой, столом и уютным светом."],
      [15, "scene_night", "Ночной город", "scene", 140, "scene-night", "Фон для поздних повторений."],
      [16, "scene_space", "Космос", "scene", 220, "scene-space", "Пиксельный космос для больших целей."],
      [17, "wizard_hat", "Шляпа мага", "head", 260, "wizard-hat", "Для заклинаний над сложными темами."],
      [18, "red_cap", "Красная кепка", "head", 150, "red-cap", "Простая кепка для ежедневной практики."],
      [19, "lab_coat", "Белый халат", "outfit", 280, "lab-coat", "Для экспериментов с формулами и графиками."],
      [20, "purple_cape", "Фиолетовый плащ", "outfit", 320, "purple-cape", "Плащ героя домашек."],
      [21, "notebook", "Блокнот", "hand", 130, "notebook", "Мини-блокнот для важных идей."],
      [22, "pencil", "Карандаш", "hand", 90, "pencil", "Карандаш для быстрых заметок."],
      [23, "medal", "Медаль", "neck", 300, "medal", "Медаль за регулярность."],
      [24, "pixel_headphones", "Наушники", "face", 210, "headphones", "Для трансляций и разборов."],
    ];

    for (const item of shopItems) {
      await client.query(
        `
          INSERT INTO shop_items (id, item_code, item_name, item_type, price_points, css_class, description, active)
          VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE)
          ON CONFLICT (item_code) DO UPDATE SET
            item_name = EXCLUDED.item_name,
            item_type = EXCLUDED.item_type,
            price_points = EXCLUDED.price_points,
            css_class = EXCLUDED.css_class,
            description = EXCLUDED.description,
            active = TRUE
        `,
        item,
      );
    }

    await client.query(
      `
        INSERT INTO students (id, first_name, last_name, phone, email, grade)
        VALUES (1, 'Иван', 'Петров', '+7 900 000-00-00', 'student@example.com', 11)
        ON CONFLICT (id) DO UPDATE SET
          first_name = EXCLUDED.first_name,
          last_name = EXCLUDED.last_name,
          phone = EXCLUDED.phone,
          email = EXCLUDED.email,
          grade = EXCLUDED.grade
      `,
    );

    const parents = [
      [1, "Светлана", "Петрова", "+7 900 300-30-10", "parent@example.com", "https://t.me/parent_petrov", "https://vk.com/parent_petrov", "Заявка с сайта", "Мама демо-ученика"],
      [2, "Андрей", "Смирнов", "+7 900 300-30-11", "andrey.parent@example.com", "https://t.me/andrey_parent", "", "Рекомендация", "Родитель для проверки админки"],
      [3, "Екатерина", "Иванова", "+7 900 300-30-12", "ekaterina.parent@example.com", "", "https://vk.com/ekaterina_parent", "Telegram", "Пока без закрепленного ученика"],
    ];

    for (const parent of parents) {
      await client.query(
        `
          INSERT INTO parents (id, first_name, last_name, phone, email, telegram_link, vk_link, source_platform, comment_text)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (id) DO UPDATE SET
            first_name = EXCLUDED.first_name,
            last_name = EXCLUDED.last_name,
            phone = EXCLUDED.phone,
            email = EXCLUDED.email,
            telegram_link = EXCLUDED.telegram_link,
            vk_link = EXCLUDED.vk_link,
            source_platform = EXCLUDED.source_platform,
            comment_text = EXCLUDED.comment_text,
            updated_at = NOW()
        `,
        parent,
      );
    }

    await client.query(
      `
        INSERT INTO student_parents (student_id, parent_id, relation_type)
        VALUES (1, 1, 'Мама')
        ON CONFLICT (student_id, parent_id) DO UPDATE SET relation_type = EXCLUDED.relation_type
      `,
    );

    await client.query(
      `
        INSERT INTO student_accounts (student_id, login, password_hash)
        VALUES (1, 'student', $1)
        ON CONFLICT (login) DO UPDATE SET password_hash = EXCLUDED.password_hash
      `,
      [studentPassword],
    );

    await enrollStudentInActiveCourses(client, 1);
    await assignHomeworksForStudent(client, 1);
    await createDemoSubmissions(client, 1);
    await ensureChatsForStudent(client, 1);
    await resetSequences(client);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

function createSeedLessons() {
  const drive = (code) => `https://drive.google.com/file/d/${code}/view`;
  const video = (query) => `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  const lesson = (courseId, lessonNumber, title, topic, status = "Open") => ({
    id: courseId * 100 + lessonNumber,
    courseId,
    lessonNumber,
    title,
    topic,
    status,
    videoUrl: video(`${title} урок ЕГЭ`),
    notesUrl: drive(`notes-${courseId}-${lessonNumber}`),
    homeworkUrl: lessonNumber <= 4 ? drive(`homework-${courseId}-${lessonNumber}`) : null,
  });

  return [
    lesson(1, 1, "Производная", "Понятие производной и правила дифференцирования", "Done"),
    lesson(1, 2, "Первообразная", "Неопределенный интеграл и таблица интегралов", "Homework_Check"),
    lesson(1, 3, "Задачи с параметром", "Методы решения задач с параметром"),
    lesson(1, 4, "Планиметрия", "Треугольники, четырехугольники и окружности"),
    lesson(2, 1, "Орфоэпия и ударения", "Словник ФИПИ и типичные ловушки задания 4", "Done"),
    lesson(2, 2, "Паронимы", "Различение значений и работа со словарем", "Homework_Check"),
    lesson(2, 3, "Сочинение ЕГЭ", "Проблема, комментарий и позиция автора"),
    lesson(2, 4, "Пунктуация в сложном предложении", "СПП, БСП и сложные случаи знаков"),
    lesson(3, 1, "Кодирование информации", "Алфавитный подход и объем сообщения", "Done"),
    lesson(3, 2, "Логические выражения", "Таблицы истинности и преобразования", "Homework_Check"),
    lesson(3, 3, "Python: циклы и условия", "Базовые конструкции для задач ЕГЭ"),
    lesson(3, 4, "Динамическое программирование", "Разбор идеи и первые задачи"),
    lesson(4, 1, "Кинематика", "Равноускоренное движение и графики", "Done"),
    lesson(4, 2, "Законы Ньютона", "Силы, ускорение и движение по окружности", "Homework_Check"),
    lesson(4, 3, "Электростатика", "Закон Кулона, напряженность и потенциал"),
    lesson(4, 4, "Оптика", "Линзы, зеркала и ход лучей"),
    lesson(5, 1, "Tenses", "Времена английского языка в заданиях ЕГЭ", "Done"),
    lesson(5, 2, "Письмо другу", "Структура письма и типичные ошибки"),
    lesson(5, 3, "Аудирование", "Стратегии работы с аудио"),
    lesson(5, 4, "Словообразование", "Суффиксы, приставки и части речи"),
    lesson(6, 1, "Проценты и доли", "Задачи на проценты, скидки и смеси", "Done"),
    lesson(6, 2, "Уравнения", "Линейные и квадратные уравнения"),
    lesson(6, 3, "Геометрия ОГЭ", "Треугольники и окружности"),
    lesson(6, 4, "Текстовые задачи", "Движение, работа и проценты"),
  ];
}

async function enrollStudentInActiveCourses(client, studentId) {
  await client.query(
    `
      INSERT INTO course_enrollments (course_id, student_id, status, teacher_id, curator_id)
      SELECT id, $1, 'Active', teacher_id, curator_id
      FROM courses
      WHERE status = 'Active'
      ON CONFLICT (course_id, student_id) DO UPDATE SET
        status = 'Active',
        teacher_id = COALESCE(course_enrollments.teacher_id, EXCLUDED.teacher_id),
        curator_id = COALESCE(course_enrollments.curator_id, EXCLUDED.curator_id)
    `,
    [studentId],
  );
}

async function assignHomeworksForStudent(client, studentId) {
  await client.query(
    `
      INSERT INTO homework_assignments (template_id, student_id, enrollment_id, teacher_id, due_at, status)
      SELECT ht.id, ce.student_id, ce.id, COALESCE(ce.teacher_id, ht.teacher_id), NOW() + INTERVAL '7 days', 'Assigned'
      FROM course_enrollments ce
      JOIN homework_templates ht ON ht.course_id = ce.course_id AND ht.active = TRUE
      WHERE ce.student_id = $1
        AND ce.status = 'Active'
      ON CONFLICT (template_id, student_id) DO NOTHING
    `,
    [studentId],
  );
}

async function assignHomeworksForEnrollment(client, enrollmentId) {
  await client.query(
    `
      INSERT INTO homework_assignments (template_id, student_id, enrollment_id, teacher_id, due_at, status)
      SELECT ht.id, ce.student_id, ce.id, COALESCE(ce.teacher_id, ht.teacher_id), NOW() + INTERVAL '7 days', 'Assigned'
      FROM course_enrollments ce
      JOIN homework_templates ht ON ht.course_id = ce.course_id AND ht.active = TRUE
      WHERE ce.id = $1
        AND ce.status = 'Active'
      ON CONFLICT (template_id, student_id) DO UPDATE SET
        enrollment_id = EXCLUDED.enrollment_id,
        teacher_id = COALESCE(EXCLUDED.teacher_id, homework_assignments.teacher_id),
        status = CASE WHEN homework_assignments.status = 'Cancelled' THEN 'Assigned' ELSE homework_assignments.status END
    `,
    [enrollmentId],
  );
}

async function ensureChatsForStudent(client, studentId) {
  await client.query("SELECT $1::integer", [studentId]);
  return;

  await client.query(
    `
      INSERT INTO chats (student_id, teacher_id, curator_id, title)
      SELECT DISTINCT ce.student_id, c.teacher_id, c.curator_id, CONCAT('Чат: ', c.title)
      FROM course_enrollments ce
      JOIN courses c ON c.id = ce.course_id
      WHERE ce.student_id = $1
        AND c.status = 'Active'
        AND NOT EXISTS (
          SELECT 1
          FROM chats ch
          WHERE ch.student_id = ce.student_id
            AND ch.teacher_id IS NOT DISTINCT FROM c.teacher_id
            AND ch.curator_id IS NOT DISTINCT FROM c.curator_id
        )
    `,
    [studentId],
  );

  await client.query(
    `
      INSERT INTO chats (student_id, teacher_id, curator_id, title)
      SELECT DISTINCT ce.student_id, COALESCE(ce.teacher_id, c.teacher_id), COALESCE(ce.curator_id, c.curator_id), CONCAT('Chat: ', c.title)
      FROM course_enrollments ce
      JOIN courses c ON c.id = ce.course_id
      WHERE ce.student_id = $1
        AND ce.status = 'Active'
        AND c.status = 'Active'
        AND (COALESCE(ce.teacher_id, c.teacher_id) IS NOT NULL OR COALESCE(ce.curator_id, c.curator_id) IS NOT NULL)
        AND NOT EXISTS (
          SELECT 1
          FROM chats ch
          WHERE ch.student_id = ce.student_id
            AND ch.teacher_id IS NOT DISTINCT FROM COALESCE(ce.teacher_id, c.teacher_id)
            AND ch.curator_id IS NOT DISTINCT FROM COALESCE(ce.curator_id, c.curator_id)
        )
    `,
    [studentId],
  );

  await client.query(
    `
      INSERT INTO chat_messages (chat_id, sender_role, sender_name, message_text)
      SELECT ch.id, 'System', 'Онлайн-школа', 'Чат создан. Здесь можно написать вопрос по курсу.'
      FROM chats ch
      WHERE ch.student_id = $1
        AND NOT EXISTS (SELECT 1 FROM chat_messages cm WHERE cm.chat_id = ch.id)
    `,
    [studentId],
  );
}

async function createDemoSubmissions(client, studentId) {
  const firstLessonRows = await client.query(
    `
      SELECT ha.id AS assignment_id, ha.enrollment_id
      FROM homework_assignments ha
      JOIN homework_templates ht ON ht.id = ha.template_id
      JOIN lessons l ON l.id = ht.lesson_id
      WHERE ha.student_id = $1
        AND l.lesson_number = 1
    `,
    [studentId],
  );

  for (const row of firstLessonRows.rows) {
    await client.query(
      `
        UPDATE homework_assignments
        SET status = 'Checked'
        WHERE id = $1
          AND NOT EXISTS (SELECT 1 FROM homework_submissions WHERE assignment_id = $1)
      `,
      [row.assignment_id],
    );
    await client.query(
      `
        INSERT INTO homework_submissions (assignment_id, student_text, file_url, status, submitted_at, checked_by_teacher_id, checked_at, score, feedback_text)
        SELECT ha.id, 'Демо-ссылка на работу.', 'https://drive.google.com/file/d/demo-submitted-homework/view', 'Checked', NOW() - INTERVAL '3 days', ha.teacher_id, NOW() - INTERVAL '1 day', 9, 'Хорошая работа, можно двигаться дальше.'
        FROM homework_assignments ha
        WHERE ha.id = $1
        ON CONFLICT (assignment_id) DO NOTHING
      `,
      [row.assignment_id],
    );
    await insertHomeworkPoints(client, row.assignment_id, studentId);
  }

  const secondLessonRows = await client.query(
    `
      SELECT ha.id AS assignment_id
      FROM homework_assignments ha
      JOIN homework_templates ht ON ht.id = ha.template_id
      JOIN lessons l ON l.id = ht.lesson_id
      WHERE ha.student_id = $1
        AND l.lesson_number = 2
    `,
    [studentId],
  );

  for (const row of secondLessonRows.rows) {
    await client.query("UPDATE homework_assignments SET status = 'Submitted' WHERE id = $1 AND status <> 'Checked'", [row.assignment_id]);
    await client.query(
      `
        INSERT INTO homework_submissions (assignment_id, student_text, file_url, status, submitted_at)
        VALUES ($1, 'Демо-ссылка на работу.', 'https://drive.google.com/file/d/demo-submitted-homework/view', 'Submitted', NOW() - INTERVAL '6 hours')
        ON CONFLICT (assignment_id) DO NOTHING
      `,
      [row.assignment_id],
    );
    await insertHomeworkPoints(client, row.assignment_id, studentId);
  }

  await refreshAllProgress(client);
}

async function insertHomeworkPoints(client, assignmentId, studentId) {
  await client.query(
    `
      INSERT INTO point_transactions (student_id, enrollment_id, homework_assignment_id, points, reason)
      SELECT ha.student_id, ha.enrollment_id, ha.id, 100, 'Баллы за сданное ДЗ'
      FROM homework_assignments ha
      WHERE ha.id = $1
        AND ha.student_id = $2
        AND NOT EXISTS (
          SELECT 1
          FROM point_transactions pt
          WHERE pt.homework_assignment_id = ha.id
            AND pt.student_id = ha.student_id
            AND pt.reason = 'Баллы за сданное ДЗ'
        )
    `,
    [assignmentId, studentId],
  );
}

async function refreshEnrollmentProgress(client, enrollmentId) {
  await client.query(
    `
      UPDATE course_enrollments ce
      SET progress_percent = COALESCE(stats.progress_percent, 0)
      FROM (
        SELECT
          enrollment_id,
          CASE
            WHEN COUNT(*) = 0 THEN 0
            ELSE ROUND(100.0 * SUM(CASE WHEN status = 'Checked' THEN 1 ELSE 0 END) / COUNT(*), 2)
          END AS progress_percent
        FROM homework_assignments
        WHERE enrollment_id = $1
          AND status <> 'Cancelled'
        GROUP BY enrollment_id
      ) stats
      WHERE ce.id = stats.enrollment_id
    `,
    [enrollmentId],
  );
}

async function refreshAllProgress(client) {
  await client.query(
    `
      UPDATE course_enrollments ce
      SET progress_percent = COALESCE(stats.progress_percent, 0)
      FROM (
        SELECT
          enrollment_id,
          CASE
            WHEN COUNT(*) = 0 THEN 0
            ELSE ROUND(100.0 * SUM(CASE WHEN status = 'Checked' THEN 1 ELSE 0 END) / COUNT(*), 2)
          END AS progress_percent
        FROM homework_assignments
        WHERE status <> 'Cancelled'
        GROUP BY enrollment_id
      ) stats
      WHERE ce.id = stats.enrollment_id
    `,
  );
}

async function resetSequences(client) {
  const tables = [
    "teachers",
    "curators",
    "students",
    "courses",
    "lessons",
    "notes",
    "homework_templates",
    "live_streams",
    "shop_items",
  ];

  for (const table of tables) {
    await client.query(`SELECT setval(pg_get_serial_sequence('${table}', 'id'), COALESCE((SELECT MAX(id) FROM ${table}), 1), TRUE)`);
  }
}

async function buildAccountPayload(studentId, authToken = "") {
  const student = await dbOne(
    `
      SELECT
        s.id AS "studentId",
        s.first_name AS "firstName",
        s.last_name AS "lastName",
        s.phone,
        s.email,
        s.grade,
        sa.login,
        COALESCE(SUM(pt.points), 0)::integer AS "pointsTotal"
      FROM students s
      LEFT JOIN student_accounts sa ON sa.student_id = s.id
      LEFT JOIN point_transactions pt ON pt.student_id = s.id
      WHERE s.id = $1
      GROUP BY s.id, sa.login
    `,
    [studentId],
  );

  if (!student) {
    throw createHttpError(404, "Ученик не найден.");
  }

  const courseRows = await dbQuery(
    `
      SELECT
        c.id AS "courseId",
        c.slug AS "courseSlug",
        c.title AS "courseTitle",
        c.short_description AS "courseDescription",
        c.total_lessons AS "totalLessons",
        COUNT(DISTINCT l.id)::integer AS "lessonsTotal",
        COUNT(DISTINCT CASE WHEN ha.status = 'Checked' THEN l.id END)::integer AS "lessonsCompleted",
        ce.id AS "enrollmentId",
        ce.status AS "enrollmentStatus",
        (ce.id IS NOT NULL) AS "isOwned",
        COUNT(DISTINCT ha.id)::integer AS "homeworkTotal",
        COUNT(DISTINCT CASE WHEN ha.status IN ('Submitted', 'Checked') THEN ha.id END)::integer AS "homeworkSubmitted",
        COUNT(DISTINCT CASE WHEN ha.status = 'Checked' THEN ha.id END)::integer AS "homeworkChecked",
        COALESCE(ce.progress_percent, 0) AS "progressPercent",
        COALESCE((
          SELECT SUM(course_points.points)
          FROM point_transactions course_points
          WHERE course_points.enrollment_id = ce.id
            AND course_points.student_id = $1
        ), 0)::integer AS "pointsEarned"
      FROM courses c
      LEFT JOIN lessons l ON l.course_id = c.id
      LEFT JOIN course_enrollments ce ON ce.course_id = c.id AND ce.student_id = $1 AND ce.status = 'Active'
      LEFT JOIN homework_assignments ha ON ha.enrollment_id = ce.id AND ha.status <> 'Cancelled'
      WHERE c.status = 'Active'
      GROUP BY c.id, ce.id
      ORDER BY c.id
    `,
    [studentId],
  );

  const lessonRows = await dbQuery(
    `
      SELECT
        c.slug AS "courseSlug",
        l.id AS "lessonId",
        l.lesson_number AS "lessonNumber",
        l.title AS "lessonTitle",
        l.status AS "lessonStatus",
        COALESCE(lp.watch_percent, 0) AS "watchPercent",
        COALESCE(lp.is_completed, ha.status = 'Checked', FALSE) AS "isCompleted",
        lp.completed_at AS "completedAt"
      FROM course_enrollments ce
      JOIN courses c ON c.id = ce.course_id
      JOIN lessons l ON l.course_id = c.id
      LEFT JOIN lesson_progress lp ON lp.course_enrollment_id = ce.id AND lp.lesson_id = l.id
      LEFT JOIN homework_templates ht ON ht.lesson_id = l.id AND ht.course_id = c.id AND ht.active = TRUE
      LEFT JOIN homework_assignments ha ON ha.template_id = ht.id AND ha.student_id = ce.student_id
      WHERE ce.student_id = $1
        AND ce.status = 'Active'
        AND c.status = 'Active'
      ORDER BY c.id, l.lesson_number
    `,
    [studentId],
  );

  const lessonGroups = new Map();
  for (const row of lessonRows.rows) {
    if (!lessonGroups.has(row.courseSlug)) {
      lessonGroups.set(row.courseSlug, []);
    }
    lessonGroups.get(row.courseSlug).push({
      lessonId: row.lessonId,
      lessonNumber: row.lessonNumber,
      lessonTitle: row.lessonTitle,
      lessonStatus: row.lessonStatus,
      watchPercent: Number(row.watchPercent || 0),
      isCompleted: Boolean(row.isCompleted),
      completedAt: toDateText(row.completedAt),
    });
  }

  const notifications = await getStudentNotifications(studentId);

  return {
    source: "database",
    student: {
      studentId: student.studentId,
      firstName: student.firstName,
      lastName: student.lastName,
      phone: student.phone,
      email: student.email,
      grade: student.grade,
    },
    account: {
      login: student.login,
      authToken,
    },
    pointsTotal: student.pointsTotal,
    courses: courseRows.rows.map((course) => ({
      ...course,
      isOwned: Boolean(course.isOwned),
      progressPercent: Number(course.progressPercent || 0),
      lessons: lessonGroups.get(course.courseSlug) || [],
    })),
    notifications,
  };
}

async function getStudentNotifications(studentId) {
  const result = await dbQuery(
    `
      SELECT *
      FROM (
        SELECT
          CONCAT('homework-', hs.id) AS "notificationId",
          'ДЗ проверено' AS title,
          CONCAT(c.title, ' · Урок ', l.lesson_number, '. ', ht.title, ' · ', hs.score, '/10 баллов') AS text,
          'Homework' AS type,
          CONCAT('#course-', c.slug) AS link,
          hs.checked_at AS "createdAt",
          'success' AS tone
        FROM homework_assignments ha
        JOIN homework_templates ht ON ht.id = ha.template_id
        JOIN courses c ON c.id = ht.course_id
        LEFT JOIN lessons l ON l.id = ht.lesson_id
        JOIN homework_submissions hs ON hs.assignment_id = ha.id
        WHERE ha.student_id = $1
          AND hs.status = 'Checked'
          AND hs.checked_at IS NOT NULL

        UNION ALL

        SELECT
          CONCAT('stream-', ls.id) AS "notificationId",
          'Новая трансляция' AS title,
          CONCAT(c.title, ' · ', ls.title, COALESCE(CONCAT(' · Урок ', l.lesson_number), '')) AS text,
          'Live_Stream' AS type,
          COALESCE(ls.stream_link, CONCAT('#course-', c.slug)) AS link,
          ls.created_at AS "createdAt",
          'info' AS tone
        FROM live_streams ls
        JOIN courses c ON c.id = ls.course_id
        JOIN course_enrollments ce ON ce.course_id = c.id AND ce.student_id = $1 AND ce.status = 'Active'
        LEFT JOIN lessons l ON l.id = ls.lesson_id
        WHERE ls.status IN ('Planned', 'Live')
      ) events
      ORDER BY "createdAt" DESC NULLS LAST, "notificationId" DESC
      LIMIT 8
    `,
    [studentId],
  );

  return result.rows.map((item) => ({ ...item, createdAt: toDateText(item.createdAt), isRead: false }));
}

app.get(
  "/api/health",
  asyncRoute(async (_request, response) => {
    if (!pool) {
      response.json({ ok: true, source: "node", database: "missing", message: "Set DATABASE_URL to enable API data." });
      return;
    }

    await dbQuery("SELECT 1");
    response.json({
      ok: !databaseBootstrapError,
      source: "node",
      database: "postgres",
      bootstrapError: databaseBootstrapError,
    });
  }),
);

app.post(
  "/api/auth/register",
  asyncRoute(async (request, response) => {
    const login = normalizeLogin(request.body.login);
    const password = String(request.body.password || "");
    const studentName = cleanText(request.body.studentName, 150);

    if (login.length < 3 || password.length < 6 || !studentName) {
      throw createHttpError(400, "Укажите имя, логин и пароль не короче 6 символов.");
    }

    const { firstName, lastName } = splitStudentName(studentName);
    const token = createToken();
    const client = await requireDatabase().connect();

    try {
      await client.query("BEGIN");
      const exists = await client.query("SELECT 1 FROM student_accounts WHERE login = $1", [login]);
      if (exists.rowCount > 0) {
        throw createHttpError(409, "Аккаунт с таким логином уже существует.");
      }

      const studentRow = await client.query(
        `
          INSERT INTO students (first_name, last_name, phone, email, grade)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id
        `,
        [firstName, lastName, cleanText(request.body.phone, 50), cleanText(request.body.email, 150), toInt(request.body.grade, null)],
      );
      const studentId = studentRow.rows[0].id;

      await client.query(
        `
          INSERT INTO student_accounts (student_id, login, password_hash, auth_token, auth_expires_at, last_login_at)
          VALUES ($1, $2, $3, $4, NOW() + INTERVAL '30 days', NOW())
        `,
        [studentId, login, hashPassword(password), token],
      );

      await ensureChatsForStudent(client, studentId);
      await client.query("COMMIT");

      response.status(201).json(await buildAccountPayload(studentId, token));
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }),
);

app.post(
  "/api/auth/login",
  asyncRoute(async (request, response) => {
    const login = normalizeLogin(request.body.login);
    const passwordHash = hashPassword(request.body.password);
    const account = await dbOne(
      `
        SELECT student_id AS "studentId"
        FROM student_accounts
        WHERE login = $1 AND password_hash = $2
      `,
      [login, passwordHash],
    );

    if (!account) {
      throw createHttpError(401, "Неверный логин или пароль.");
    }

    const token = createToken();
    await dbQuery(
      `
        UPDATE student_accounts
        SET auth_token = $1,
            auth_expires_at = NOW() + INTERVAL '30 days',
            last_login_at = NOW()
        WHERE student_id = $2
      `,
      [token, account.studentId],
    );

    response.json(await buildAccountPayload(account.studentId, token));
  }),
);

app.get(
  "/api/account",
  asyncRoute(async (request, response) => {
    const student = await getStudentByToken(request);
    response.json(await buildAccountPayload(student.studentId, student.authToken));
  }),
);

app.get(
  "/api/courses/:slug/lessons",
  asyncRoute(async (request, response) => {
    const student = await getStudentByToken(request, { required: false });
    if (student) {
      await dbQuery("SELECT 1");
    }
    const payload = await getCourseLessons(request.params.slug, student?.studentId || 0);
    response.json(payload);
  }),
);

async function getCourseLessons(slug, studentId = 0) {
  const rows = await dbQuery(
    `
      SELECT
        c.id AS "courseId",
        c.slug AS "courseSlug",
        c.title AS "courseTitle",
        c.description AS "courseDescription",
        c.total_lessons AS "totalLessons",
        COUNT(l.id) OVER (PARTITION BY c.id)::integer AS "lessonsTotal",
        ce.id AS "enrollmentId",
        ce.progress_percent AS "progressPercent",
        l.id AS "lessonId",
        l.lesson_number AS "lessonNumber",
        l.title AS "lessonTitle",
        l.topic,
        l.video_url AS "videoUrl",
        l.notes_url AS "notesUrl",
        l.homework_url AS "homeworkUrl",
        l.status AS "lessonStatus",
        ht.id AS "homeworkTemplateId",
        ht.title AS "homeworkTitle",
        ht.description AS "homeworkDescription",
        ht.file_url AS "homeworkTaskUrl",
        ha.id AS "homeworkAssignmentId",
        ha.status AS "homeworkStatus",
        ha.due_at AS "homeworkDueAt",
        ha.upload_folder_link AS "homeworkUploadUrl",
        hs.id AS "homeworkSubmissionId",
        hs.file_url AS "submittedHomeworkUrl",
        hs.status AS "submissionStatus",
        hs.feedback_url AS "feedbackUrl",
        hs.feedback_text AS "feedbackText",
        hs.score AS "homeworkScore",
        hs.checked_at AS "checkedAt"
      FROM courses c
      JOIN lessons l ON l.course_id = c.id
      LEFT JOIN course_enrollments ce ON ce.course_id = c.id AND ce.student_id = $2 AND ce.status = 'Active'
      LEFT JOIN homework_templates ht ON ht.lesson_id = l.id AND ht.course_id = c.id AND ht.active = TRUE
      LEFT JOIN homework_assignments ha ON ha.template_id = ht.id AND ha.student_id = $2 AND ha.enrollment_id = ce.id
      LEFT JOIN homework_submissions hs ON hs.assignment_id = ha.id
      WHERE c.slug = $1
        AND c.status = 'Active'
      ORDER BY l.lesson_number
    `,
    [slug, studentId],
  );

  if (rows.rowCount === 0) {
    throw createHttpError(404, "Курс не найден.");
  }

  const first = rows.rows[0];
  const isOwned = Boolean(first.enrollmentId);
  const rawLessons = rows.rows.map((row) => ({
    lessonId: row.lessonId,
    lessonNumber: row.lessonNumber,
    lessonTitle: row.lessonTitle,
    topic: row.topic,
    lessonStatus: row.lessonStatus,
    videoUrl: row.videoUrl,
    notesUrl: row.notesUrl,
    homeworkUrl: row.homeworkTaskUrl || row.homeworkUrl,
    homeworkTemplateId: row.homeworkTemplateId,
    homeworkTitle: row.homeworkTitle,
    homeworkDescription: row.homeworkDescription,
    homeworkTaskUrl: row.homeworkTaskUrl,
    homeworkAssignmentId: row.homeworkAssignmentId,
    homeworkStatus: row.homeworkStatus,
    homeworkDueAt: toDateText(row.homeworkDueAt),
    homeworkUploadUrl: row.homeworkUploadUrl,
    homeworkSubmissionId: row.homeworkSubmissionId,
    submittedHomeworkUrl: row.submittedHomeworkUrl,
    submissionStatus: row.submissionStatus,
    feedbackUrl: row.feedbackUrl,
    feedbackText: row.feedbackText,
    homeworkScore: row.homeworkScore,
    checkedAt: toDateText(row.checkedAt),
  }));
  const lessons = isOwned
    ? rawLessons
    : rawLessons.map((lesson, index) => ({
        ...lesson,
        isPreviewLesson: index === 0,
        isPreviewLocked: index > 0,
        videoUrl: index === 0 ? lesson.videoUrl : null,
        notesUrl: index === 0 ? lesson.notesUrl : null,
        homeworkUrl: null,
        homeworkTemplateId: null,
        homeworkTitle: null,
        homeworkDescription: null,
        homeworkTaskUrl: null,
        homeworkAssignmentId: null,
        homeworkStatus: "Assigned",
        homeworkDueAt: null,
        homeworkUploadUrl: null,
        homeworkSubmissionId: null,
        submittedHomeworkUrl: null,
        submissionStatus: null,
        feedbackUrl: null,
        feedbackText: null,
        homeworkScore: null,
        checkedAt: null,
      }));

  const homeworkTotal = lessons.filter((lesson) => lesson.homeworkTemplateId || lesson.homeworkAssignmentId).length;
  const homeworkSubmitted = lessons.filter((lesson) => ["Submitted", "Checked"].includes(lesson.homeworkStatus) || ["Submitted", "Checked"].includes(lesson.submissionStatus)).length;
  const homeworkChecked = lessons.filter((lesson) => lesson.homeworkStatus === "Checked" || lesson.submissionStatus === "Checked").length;

  return {
    source: "database",
    course: {
      courseId: first.courseId,
      courseSlug: first.courseSlug,
      courseTitle: first.courseTitle,
      courseDescription: first.courseDescription,
      totalLessons: first.totalLessons,
      lessonsTotal: first.lessonsTotal,
      isOwned,
      progressPercent: homeworkTotal > 0 ? Math.round((homeworkChecked * 10000) / homeworkTotal) / 100 : 0,
      homeworkTotal,
      homeworkSubmitted,
      homeworkChecked,
    },
    lessons,
  };
}

app.get(
  "/api/homeworks",
  asyncRoute(async (request, response) => {
    const student = await getStudentByToken(request, { required: false });
    response.json(await getHomeworks("", student?.studentId || 0));
  }),
);

app.get(
  "/api/courses/:slug/homeworks",
  asyncRoute(async (request, response) => {
    const student = await getStudentByToken(request, { required: false });
    response.json(await getHomeworks(request.params.slug, student?.studentId || 0));
  }),
);

async function getHomeworks(slug = "", studentId = 0) {
  const result = await dbQuery(
    `
      SELECT
        c.id AS "courseId",
        c.slug AS "courseSlug",
        c.title AS "courseTitle",
        l.id AS "lessonId",
        l.lesson_number AS "lessonNumber",
        l.title AS "lessonTitle",
        ht.id AS "homeworkTemplateId",
        ht.title AS "homeworkTitle",
        ht.description AS "homeworkDescription",
        ht.file_url AS "homeworkTaskUrl",
        ha.id AS "homeworkAssignmentId",
        ha.status AS "homeworkStatus",
        ha.due_at AS "homeworkDueAt",
        ha.upload_folder_link AS "homeworkUploadUrl",
        hs.id AS "homeworkSubmissionId",
        hs.file_url AS "submittedHomeworkUrl",
        hs.status AS "submissionStatus",
        hs.feedback_url AS "feedbackUrl",
        hs.feedback_text AS "feedbackText",
        hs.score AS "homeworkScore",
        hs.checked_at AS "checkedAt"
      FROM homework_templates ht
      JOIN courses c ON c.id = ht.course_id
      LEFT JOIN lessons l ON l.id = ht.lesson_id
      LEFT JOIN course_enrollments ce ON ce.course_id = c.id AND ce.student_id = $2 AND ce.status = 'Active'
      LEFT JOIN homework_assignments ha ON ha.template_id = ht.id AND ha.student_id = $2 AND ha.enrollment_id = ce.id
      LEFT JOIN homework_submissions hs ON hs.assignment_id = ha.id
      WHERE ht.active = TRUE
        AND c.status = 'Active'
        AND ($1 = '' OR c.slug = $1)
      ORDER BY c.id, l.lesson_number
    `,
    [slug, studentId],
  );

  return {
    source: "database",
    items: result.rows.map((row) => ({ ...row, homeworkDueAt: toDateText(row.homeworkDueAt), checkedAt: toDateText(row.checkedAt) })),
  };
}

app.post(
  "/api/homeworks/:id/submit",
  asyncRoute(async (request, response) => {
    const student = await getStudentByToken(request);
    const assignmentId = toInt(request.params.id, 0);
    const homeworkLink = normalizeLink(request.body.homeworkLink);

    if (!assignmentId) {
      throw createHttpError(400, "Некорректный ID домашнего задания.");
    }

    if (!isGoogleDriveLikeUrl(homeworkLink)) {
      throw createHttpError(400, "Нужна ссылка на Google Drive.");
    }

    const client = await requireDatabase().connect();

    try {
      await client.query("BEGIN");
      const assignment = await client.query(
        `
          SELECT ha.id, ha.student_id, ha.enrollment_id, ha.status, hs.status AS submission_status
          FROM homework_assignments ha
          LEFT JOIN homework_submissions hs ON hs.assignment_id = ha.id
          WHERE ha.id = $1
            AND ha.student_id = $2
          FOR UPDATE OF ha
        `,
        [assignmentId, student.studentId],
      );

      if (assignment.rowCount === 0) {
        throw createHttpError(404, "Домашнее задание не найдено для этого ученика.");
      }

      const row = assignment.rows[0];
      if (row.status === "Checked" || row.submission_status === "Checked") {
        throw createHttpError(409, "Проверенное ДЗ нельзя заменить.");
      }

      await client.query("UPDATE homework_assignments SET status = 'Submitted' WHERE id = $1", [assignmentId]);
      const submission = await client.query(
        `
          INSERT INTO homework_submissions (assignment_id, student_text, file_url, status, submitted_at, checked_by_teacher_id, checked_at, score, feedback_text, feedback_url)
          VALUES ($1, 'Ссылка на сданную работу прикреплена с сайта.', $2, 'Submitted', NOW(), NULL, NULL, NULL, NULL, NULL)
          ON CONFLICT (assignment_id) DO UPDATE SET
            student_text = EXCLUDED.student_text,
            file_url = EXCLUDED.file_url,
            status = 'Submitted',
            submitted_at = NOW(),
            checked_by_teacher_id = NULL,
            checked_at = NULL,
            score = NULL,
            feedback_text = NULL,
            feedback_url = NULL
          RETURNING id, submitted_at
        `,
        [assignmentId, homeworkLink],
      );

      await insertHomeworkPoints(client, assignmentId, student.studentId);
      if (row.enrollment_id) {
        await refreshEnrollmentProgress(client, row.enrollment_id);
      }
      await client.query("COMMIT");

      response.json({
        source: "database",
        homeworkAssignmentId: assignmentId,
        homeworkStatus: "Submitted",
        homeworkSubmissionId: submission.rows[0].id,
        submittedHomeworkUrl: homeworkLink,
        submissionStatus: "Submitted",
        submittedAt: toDateText(submission.rows[0].submitted_at),
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }),
);

app.get(
  "/api/notes",
  asyncRoute(async (request, response) => {
    const student = await getStudentByToken(request, { required: false });
    response.json(await getNotes("", student?.studentId || 0));
  }),
);

app.get(
  "/api/courses/:slug/notes",
  asyncRoute(async (request, response) => {
    const student = await getStudentByToken(request, { required: false });
    response.json(await getNotes(request.params.slug, student?.studentId || 0));
  }),
);

async function getNotes(slug = "", studentId = 0) {
  const result = await dbQuery(
    `
      SELECT
        n.id AS "noteId",
        c.id AS "courseId",
        c.slug AS "courseSlug",
        c.title AS "courseTitle",
        l.id AS "lessonId",
        l.lesson_number AS "lessonNumber",
        l.title AS "lessonTitle",
        n.title AS "materialTitle",
        n.material_type AS "materialType",
        n.author AS "authorName",
        n.file_url AS "fileUrl",
        (ce.id IS NOT NULL) AS "isOwned"
      FROM notes n
      JOIN courses c ON c.id = n.course_id
      LEFT JOIN lessons l ON l.id = n.lesson_id
      LEFT JOIN course_enrollments ce
        ON ce.course_id = c.id
       AND ce.student_id = $2
       AND ce.status = 'Active'
      WHERE n.active = TRUE
        AND ($1 = '' OR c.slug = $1)
        AND c.status = 'Active'
        AND (ce.id IS NOT NULL OR l.lesson_number = 1)
      ORDER BY c.id, l.lesson_number, n.id
    `,
    [slug, studentId],
  );

  return { source: "database", items: result.rows };
}

app.get(
  "/api/streams",
  asyncRoute(async (_request, response) => {
    response.json(await getStreams(""));
  }),
);

app.get(
  "/api/courses/:slug/streams",
  asyncRoute(async (request, response) => {
    response.json(await getStreams(request.params.slug));
  }),
);

app.get(
  "/api/student/calls",
  asyncRoute(async (request, response) => {
    const student = await getStudentByToken(request);
    response.json(await getStudentCalls(student.studentId));
  }),
);

async function getStreams(slug = "") {
  const result = await dbQuery(
    `
      SELECT
        ls.id AS "streamId",
        c.slug AS "courseSlug",
        c.title AS "courseTitle",
        l.lesson_number AS "lessonNumber",
        l.title AS "lessonTitle",
        ls.title AS "streamTitle",
        ls.starts_at AS "startsAt",
        ls.ends_at AS "endsAt",
        ls.stream_link AS "streamLink",
        ls.record_link AS "recordLink",
        ls.status
      FROM live_streams ls
      JOIN courses c ON c.id = ls.course_id
      LEFT JOIN lessons l ON l.id = ls.lesson_id
      WHERE ls.status IN ('Planned', 'Live')
        AND c.status = 'Active'
        AND ls.starts_at >= NOW()
        AND ($1 = '' OR c.slug = $1)
      ORDER BY ls.starts_at, ls.id
    `,
    [slug],
  );

  return {
    source: "database",
    items: result.rows.map((row) => ({ ...row, startsAt: toDateText(row.startsAt), endsAt: toDateText(row.endsAt) })),
  };
}

async function getStudentCalls(studentId) {
  const result = await dbQuery(
    `
      SELECT
        sc.id AS "callId",
        sc.title AS "callTitle",
        sc.call_link AS "callLink",
        sc.starts_at AS "startsAt",
        sc.status,
        cu.id AS "curatorId",
        CONCAT(cu.first_name, ' ', cu.last_name) AS "curatorName"
      FROM student_calls sc
      JOIN student_call_participants scp ON scp.call_id = sc.id
      LEFT JOIN curators cu ON cu.id = sc.curator_id
      WHERE scp.student_id = $1
        AND sc.status = 'Planned'
        AND sc.starts_at >= NOW()
      ORDER BY sc.starts_at, sc.id
    `,
    [studentId],
  );

  return {
    source: "database",
    items: result.rows.map((row) => ({ ...row, startsAt: toDateText(row.startsAt) })),
  };
}

app.post(
  "/api/applications",
  asyncRoute(async (request, response) => {
    const studentName = cleanText(request.body.studentName, 150);
    const phone = cleanText(request.body.phone, 50);
    const preferredSubject = cleanText(request.body.preferredSubject, 100);

    if (!studentName || !phone || !preferredSubject) {
      throw createHttpError(400, "Заполните имя, телефон и предмет.");
    }

    const result = await dbQuery(
      `
        INSERT INTO course_applications (student_name, phone, email, preferred_subject, grade, comment_text, source_page)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, created_at
      `,
      [
        studentName,
        phone,
        cleanText(request.body.email, 150),
        preferredSubject,
        toInt(request.body.grade, null),
        cleanText(request.body.comment, 1000),
        cleanText(request.body.sourcePage, 100) || "Главная",
      ],
    );

    response.status(201).json({ ok: true, source: "database", applicationId: result.rows[0].id, createdAt: toDateText(result.rows[0].created_at) });
  }),
);

app.post(
  "/api/support",
  asyncRoute(async (request, response) => {
    const student = await getStudentByToken(request, { required: false });
    const topic = cleanText(request.body.topic, 100) || "Другое";
    const message = cleanText(request.body.message || request.body.messageText, 2000);

    if (!message) {
      throw createHttpError(400, "Опишите вопрос для поддержки.");
    }

    const result = await dbQuery(
      `
        INSERT INTO support_requests (student_id, topic, message_text)
        VALUES ($1, $2, $3)
        RETURNING id, created_at
      `,
      [student?.studentId || null, topic, message],
    );

    response.status(201).json({
      ok: true,
      source: "database",
      supportId: result.rows[0].id,
      supportRequestId: result.rows[0].id,
      createdAt: toDateText(result.rows[0].created_at),
    });
  }),
);

app.get(
  "/api/shop",
  asyncRoute(async (request, response) => {
    const student = await getStudentByToken(request);
    response.json(await getShopPayload(student.studentId));
  }),
);

app.post(
  "/api/shop/purchase",
  asyncRoute(async (request, response) => {
    const student = await getStudentByToken(request);
    const itemCode = cleanText(request.body.itemCode, 80);
    const client = await requireDatabase().connect();

    try {
      await client.query("BEGIN");
      const item = await client.query("SELECT * FROM shop_items WHERE item_code = $1 AND active = TRUE", [itemCode]);
      if (item.rowCount === 0) {
        throw createHttpError(404, "Предмет не найден.");
      }

      const owned = await client.query("SELECT 1 FROM student_shop_items WHERE student_id = $1 AND item_id = $2", [student.studentId, item.rows[0].id]);
      if (owned.rowCount > 0) {
        throw createHttpError(409, "Этот предмет уже куплен.");
      }

      const balance = await getStudentPoints(client, student.studentId);
      if (balance < item.rows[0].price_points) {
        throw createHttpError(400, "Недостаточно баллов.");
      }

      await client.query("INSERT INTO student_shop_items (student_id, item_id, is_equipped) VALUES ($1, $2, FALSE)", [student.studentId, item.rows[0].id]);
      await client.query(
        "INSERT INTO point_transactions (student_id, points, reason) VALUES ($1, $2, $3)",
        [student.studentId, -Number(item.rows[0].price_points), `Покупка: ${item.rows[0].item_name}`],
      );
      await client.query("COMMIT");
      response.json(await getShopPayload(student.studentId));
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }),
);

app.post(
  "/api/shop/equip",
  asyncRoute(async (request, response) => {
    const student = await getStudentByToken(request);
    const itemCode = cleanText(request.body.itemCode, 80);
    const unequip = Boolean(request.body.unequip);
    const item = await dbOne("SELECT id, item_type AS \"itemType\" FROM shop_items WHERE item_code = $1 AND active = TRUE", [itemCode]);

    if (!item) {
      throw createHttpError(404, "Предмет не найден.");
    }

    const owned = await dbOne("SELECT 1 FROM student_shop_items WHERE student_id = $1 AND item_id = $2", [student.studentId, item.id]);
    if (!owned) {
      throw createHttpError(400, "Сначала купите предмет.");
    }

    if (unequip) {
      await dbQuery(
        `
          UPDATE student_shop_items
          SET is_equipped = FALSE
          WHERE student_id = $1
            AND item_id = $2
        `,
        [student.studentId, item.id],
      );
    } else {
      await dbQuery(
        `
          UPDATE student_shop_items ssi
          SET is_equipped = CASE WHEN ssi.item_id = $2 THEN TRUE ELSE FALSE END
          FROM shop_items i
          WHERE ssi.item_id = i.id
            AND ssi.student_id = $1
            AND i.item_type = $3
        `,
        [student.studentId, item.id, item.itemType],
      );
    }

    response.json(await getShopPayload(student.studentId));
  }),
);

async function getStudentPoints(client, studentId) {
  const result = await client.query("SELECT COALESCE(SUM(points), 0)::integer AS points FROM point_transactions WHERE student_id = $1", [studentId]);
  return Number(result.rows[0]?.points || 0);
}

async function getShopPayload(studentId) {
  const result = await dbQuery(
    `
      SELECT
        i.item_code AS "itemCode",
        i.item_name AS "itemName",
        i.item_type AS "itemType",
        i.price_points AS "pricePoints",
        i.css_class AS "cssClass",
        i.description,
        (ssi.id IS NOT NULL) AS "isOwned",
        COALESCE(ssi.is_equipped, FALSE) AS "isEquipped"
      FROM shop_items i
      LEFT JOIN student_shop_items ssi ON ssi.item_id = i.id AND ssi.student_id = $1
      WHERE i.active = TRUE
      ORDER BY i.price_points, i.id
    `,
    [studentId],
  );
  const points = await dbOne("SELECT COALESCE(SUM(points), 0)::integer AS points FROM point_transactions WHERE student_id = $1", [studentId]);
  return { source: "database", pointsTotal: points?.points || 0, items: result.rows.map((item) => ({ ...item, isOwned: Boolean(item.isOwned), isEquipped: Boolean(item.isEquipped) })) };
}

app.post(
  "/api/staff/login",
  asyncRoute(async (request, response) => {
    const role = cleanText(request.body.role, 30);
    const login = normalizeLogin(request.body.login);
    const passwordHash = hashPassword(request.body.password);
    const token = createToken();

    if (role === "Admin") {
      const admin = await dbOne(
        `
          SELECT id
          FROM admin_accounts
          WHERE login = $1
            AND password_hash = $2
        `,
        [login, passwordHash],
      );

      if (!admin) {
        throw createHttpError(401, "Неверный логин, пароль или роль.");
      }

      await dbQuery(
        `
          UPDATE admin_accounts
          SET auth_token = $1,
              auth_expires_at = NOW() + INTERVAL '30 days',
              last_login_at = NOW()
          WHERE id = $2
        `,
        [token, admin.id],
      );

      const profile = await dbOne(
        `
          SELECT
            id AS "staffAccountId",
            'Admin' AS role,
            id AS "staffId",
            id AS "adminId",
            NULL::integer AS "teacherId",
            NULL::integer AS "curatorId",
            login,
            auth_token AS "authToken",
            CONCAT(first_name, ' ', last_name) AS name
          FROM admin_accounts
          WHERE id = $1
        `,
        [admin.id],
      );

      response.json({ source: "database", staff: staffPublic(profile) });
      return;
    }

    const row = await dbOne(
      `
        SELECT id
        FROM staff_accounts
        WHERE role = $1
          AND login = $2
          AND password_hash = $3
      `,
      [role, login, passwordHash],
    );

    if (!row) {
      throw createHttpError(401, "Неверный логин, пароль или роль.");
    }

    await dbQuery(
      `
        UPDATE staff_accounts
        SET auth_token = $1,
            auth_expires_at = NOW() + INTERVAL '30 days',
            last_login_at = NOW()
        WHERE id = $2
      `,
      [token, row.id],
    );

    const staff = await dbOne(
      `
        SELECT
          sa.id AS "staffAccountId",
          sa.role,
          sa.teacher_id AS "teacherId",
          sa.curator_id AS "curatorId",
          CASE WHEN sa.role = 'Teacher' THEN sa.teacher_id ELSE sa.curator_id END AS "staffId",
          sa.login,
          sa.auth_token AS "authToken",
          CASE
            WHEN sa.role = 'Teacher' THEN CONCAT(t.first_name, ' ', t.last_name)
            ELSE CONCAT(cu.first_name, ' ', cu.last_name)
          END AS "name"
        FROM staff_accounts sa
        LEFT JOIN teachers t ON t.id = sa.teacher_id
        LEFT JOIN curators cu ON cu.id = sa.curator_id
        WHERE sa.id = $1
      `,
      [row.id],
    );

    response.json({ source: "database", staff: staffPublic(staff) });
  }),
);

app.get(
  "/api/staff/me",
  asyncRoute(async (request, response) => {
    const staff = await getStaffByToken(request);
    response.json({ source: "database", staff });
  }),
);

app.get(
  "/api/staff/workspace",
  asyncRoute(async (request, response) => {
    const staff = await getStaffByToken(request);
    response.json(await buildStaffWorkspace(staff));
  }),
);

const applicationStatuses = new Set(["New", "Contacted", "Enrolled", "Rejected"]);
const supportStatuses = new Set(["New", "In_Progress", "Resolved"]);
const enrollmentStatuses = new Set(["Active", "Paused", "Finished", "Cancelled"]);
const studentStatuses = new Set(["Student", "Graduate"]);

function optionalInt(value) {
  const parsed = toInt(value, null);
  return parsed && parsed > 0 ? parsed : null;
}

function cleanNullableText(value, maxLength = 1000) {
  const text = cleanText(value, maxLength);
  return text || null;
}

app.post(
  "/api/admin/applications/:id",
  asyncRoute(async (request, response) => {
    await requireAdmin(request);
    const applicationId = toInt(request.params.id, 0);
    const studentName = cleanText(request.body.studentName || request.body.student_name, 150);
    const phone = cleanText(request.body.phone, 80);
    const email = cleanNullableText(request.body.email, 160);
    const preferredSubject = cleanText(request.body.preferredSubject || request.body.preferred_subject, 160);
    const grade = optionalInt(request.body.grade);
    const commentText = cleanNullableText(request.body.commentText || request.body.comment_text, 2000);
    const sourcePage = cleanNullableText(request.body.sourcePage || request.body.source_page, 200);
    const adminNote = cleanNullableText(request.body.adminNote || request.body.admin_note, 2000);
    const requestedStatus = cleanText(request.body.status, 30) || "New";
    const status = applicationStatuses.has(requestedStatus) ? requestedStatus : "New";

    if (!applicationId || !studentName || !phone || !preferredSubject) {
      throw createHttpError(400, "Application, student name, phone and subject are required.");
    }

    const result = await dbQuery(
      `
        UPDATE course_applications
        SET student_name = $2,
            phone = $3,
            email = $4,
            preferred_subject = $5,
            grade = $6,
            comment_text = $7,
            source_page = $8,
            status = $9,
            admin_note = $10,
            processed_at = CASE WHEN $9 = 'New' THEN NULL ELSE COALESCE(processed_at, NOW()) END,
            updated_at = NOW()
        WHERE id = $1
        RETURNING id AS "applicationId", status, processed_at AS "processedAt", updated_at AS "updatedAt"
      `,
      [applicationId, studentName, phone, email, preferredSubject, grade, commentText, sourcePage, status, adminNote],
    );

    if (result.rowCount === 0) {
      throw createHttpError(404, "Application not found.");
    }

    response.json({
      ok: true,
      source: "database",
      ...result.rows[0],
      processedAt: toDateText(result.rows[0].processedAt),
      updatedAt: toDateText(result.rows[0].updatedAt),
    });
  }),
);

app.post(
  "/api/admin/support/:id",
  asyncRoute(async (request, response) => {
    await requireAdmin(request);
    const supportRequestId = toInt(request.params.id, 0);
    const topic = cleanNullableText(request.body.topic, 160);
    const messageText = cleanNullableText(request.body.messageText || request.body.message_text, 3000);
    const adminNote = cleanNullableText(request.body.adminNote || request.body.admin_note, 2000);
    const requestedStatus = cleanText(request.body.status, 30) || "New";
    const status = supportStatuses.has(requestedStatus) ? requestedStatus : "New";

    if (!supportRequestId) {
      throw createHttpError(400, "Support request is required.");
    }

    const result = await dbQuery(
      `
        UPDATE support_requests
        SET topic = COALESCE($2, topic),
            message_text = COALESCE($3, message_text),
            status = $4,
            admin_note = $5,
            processed_at = CASE WHEN $4 = 'New' THEN NULL ELSE COALESCE(processed_at, NOW()) END,
            updated_at = NOW()
        WHERE id = $1
        RETURNING id AS "supportRequestId", status, processed_at AS "processedAt", updated_at AS "updatedAt"
      `,
      [supportRequestId, topic, messageText, status, adminNote],
    );

    if (result.rowCount === 0) {
      throw createHttpError(404, "Support request not found.");
    }

    response.json({
      ok: true,
      source: "database",
      ...result.rows[0],
      processedAt: toDateText(result.rows[0].processedAt),
      updatedAt: toDateText(result.rows[0].updatedAt),
    });
  }),
);

app.post(
  "/api/admin/parents",
  asyncRoute(async (request, response) => {
    await requireAdmin(request);
    const parentId = toInt(request.body.parentId, 0);
    const firstName = cleanText(request.body.firstName || request.body.first_name, 100);
    const lastName = cleanText(request.body.lastName || request.body.last_name, 100);
    const phone = cleanNullableText(request.body.phone, 80);
    const email = cleanNullableText(request.body.email, 160);
    const telegramLink = cleanNullableText(request.body.telegramLink || request.body.telegram_link, 300);
    const vkLink = cleanNullableText(request.body.vkLink || request.body.vk_link, 300);
    const sourcePlatform = cleanNullableText(request.body.sourcePlatform || request.body.source_platform, 200);
    const commentText = cleanNullableText(request.body.commentText || request.body.comment_text, 2000);
    const childFieldPresent = Object.prototype.hasOwnProperty.call(request.body, "childIds");
    const childIds = (Array.isArray(request.body.childIds) ? request.body.childIds : [request.body.childIds])
      .map((value) => optionalInt(value))
      .filter(Boolean);

    if (!firstName || !lastName) {
      throw createHttpError(400, "Parent first and last name are required.");
    }

    const result = parentId
      ? await dbQuery(
          `
            UPDATE parents
            SET first_name = $2,
                last_name = $3,
                phone = $4,
                email = $5,
                telegram_link = $6,
                vk_link = $7,
                source_platform = $8,
                comment_text = $9,
                updated_at = NOW()
            WHERE id = $1
            RETURNING id AS "parentId"
          `,
          [parentId, firstName, lastName, phone, email, telegramLink, vkLink, sourcePlatform, commentText],
        )
      : await dbQuery(
          `
            INSERT INTO parents (first_name, last_name, phone, email, telegram_link, vk_link, source_platform, comment_text)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id AS "parentId"
          `,
          [firstName, lastName, phone, email, telegramLink, vkLink, sourcePlatform, commentText],
        );

    if (result.rowCount === 0) {
      throw createHttpError(404, "Parent not found.");
    }

    const savedParentId = result.rows[0].parentId;

    if (childFieldPresent) {
      await dbQuery("DELETE FROM student_parents WHERE parent_id = $1", [savedParentId]);

      for (const childId of childIds) {
        await dbQuery(
          `
            INSERT INTO student_parents (student_id, parent_id, relation_type)
            VALUES ($1, $2, 'Parent')
            ON CONFLICT (student_id, parent_id) DO UPDATE SET relation_type = student_parents.relation_type
          `,
          [childId, savedParentId],
        );
      }
    }

    response.status(parentId ? 200 : 201).json({ ok: true, source: "database", parentId: savedParentId });
  }),
);

app.post(
  "/api/admin/students",
  asyncRoute(async (request, response) => {
    await requireAdmin(request);
    const studentId = toInt(request.body.studentId, 0);
    const firstName = cleanText(request.body.firstName || request.body.first_name, 100);
    const lastName = cleanText(request.body.lastName || request.body.last_name, 100);
    const phone = cleanNullableText(request.body.phone, 80);
    const email = cleanNullableText(request.body.email, 160);
    const grade = optionalInt(request.body.grade);
    const telegramLink = cleanNullableText(request.body.telegramLink || request.body.telegram_link, 300);
    const vkLink = cleanNullableText(request.body.vkLink || request.body.vk_link, 300);
    const sourcePlatform = cleanNullableText(request.body.sourcePlatform || request.body.source_platform, 200);
    const login = normalizeLogin(request.body.login);
    const password = cleanText(request.body.password, 200);
    const requestedStatus = cleanText(request.body.studentStatus || request.body.student_status, 30) || "Student";
    const studentStatus = studentStatuses.has(requestedStatus) ? requestedStatus : "Student";
    const parentFieldPresent = Object.prototype.hasOwnProperty.call(request.body, "parentId");
    const parentId = optionalInt(request.body.parentId);
    const relationType = cleanText(request.body.relationType || request.body.relation_type, 80) || "Parent";

    if (!firstName || !lastName) {
      throw createHttpError(400, "Student first and last name are required.");
    }

    const client = await requireDatabase().connect();

    try {
      await client.query("BEGIN");
      const result = studentId
        ? await client.query(
            `
              UPDATE students
              SET first_name = $2,
                  last_name = $3,
                  phone = $4,
                  email = $5,
                  grade = $6,
                  telegram_link = $7,
                  vk_link = $8,
                  source_platform = $9,
                  student_status = $10
              WHERE id = $1
              RETURNING id AS "studentId"
            `,
            [studentId, firstName, lastName, phone, email, grade, telegramLink, vkLink, sourcePlatform, studentStatus],
          )
        : await client.query(
            `
              INSERT INTO students (first_name, last_name, phone, email, grade, telegram_link, vk_link, source_platform, student_status)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
              RETURNING id AS "studentId"
            `,
            [firstName, lastName, phone, email, grade, telegramLink, vkLink, sourcePlatform, studentStatus],
          );

      if (result.rowCount === 0) {
        throw createHttpError(404, "Student not found.");
      }

      const savedStudentId = result.rows[0].studentId;

      if (login) {
        const existingLogin = await client.query("SELECT student_id FROM student_accounts WHERE login = $1 AND student_id <> $2", [login, savedStudentId]);

        if (existingLogin.rowCount > 0) {
          throw createHttpError(409, "This student login is already used.");
        }

        const existingAccount = await client.query("SELECT id FROM student_accounts WHERE student_id = $1", [savedStudentId]);
        const passwordHash = password.length >= 6 ? hashPassword(password) : studentPassword;

        if (existingAccount.rowCount > 0) {
          await client.query(
            `
              UPDATE student_accounts
              SET login = $2,
                  password_hash = CASE WHEN $3::boolean THEN $4 ELSE password_hash END,
                  auth_token = NULL,
                  auth_expires_at = NULL
              WHERE student_id = $1
            `,
            [savedStudentId, login, password.length >= 6, passwordHash],
          );
        } else {
          if (password.length < 6) {
            throw createHttpError(400, "Student password must be at least 6 characters.");
          }

          await client.query(
            `
              INSERT INTO student_accounts (student_id, login, password_hash)
              VALUES ($1, $2, $3)
            `,
            [savedStudentId, login, passwordHash],
          );
        }
      } else if (!studentId && password) {
        throw createHttpError(400, "Student login is required when setting a password.");
      }

      if (parentFieldPresent) {
        await client.query("DELETE FROM student_parents WHERE student_id = $1", [savedStudentId]);

        if (parentId) {
          await client.query(
            `
              INSERT INTO student_parents (student_id, parent_id, relation_type)
              VALUES ($1, $2, $3)
              ON CONFLICT (student_id, parent_id) DO UPDATE SET relation_type = EXCLUDED.relation_type
            `,
            [savedStudentId, parentId, relationType],
          );
        }
      }

      await client.query("COMMIT");
      response.status(studentId ? 200 : 201).json({ ok: true, source: "database", studentId: savedStudentId });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }),
);

app.post(
  "/api/admin/students/:id/enrollment",
  asyncRoute(async (request, response) => {
    await requireAdmin(request);
    const studentId = toInt(request.params.id, 0);
    const courseId = toInt(request.body.courseId, 0);
    const teacherId = optionalInt(request.body.teacherId);
    const curatorId = optionalInt(request.body.curatorId);
    const action = cleanText(request.body.action, 30);
    const requestedStatus = action === "remove" ? "Cancelled" : cleanText(request.body.enrollmentStatus || request.body.status, 30) || "Active";
    const status = enrollmentStatuses.has(requestedStatus) ? requestedStatus : "Active";

    if (!studentId || !courseId) {
      throw createHttpError(400, "Student and course are required.");
    }

    const client = await requireDatabase().connect();

    try {
      await client.query("BEGIN");
      const student = await client.query("SELECT id FROM students WHERE id = $1 FOR UPDATE", [studentId]);
      const course = await client.query("SELECT id FROM courses WHERE id = $1 AND status = 'Active'", [courseId]);

      if (student.rowCount === 0 || course.rowCount === 0) {
        throw createHttpError(404, "Student or active course not found.");
      }

      let enrollmentId = null;

      if (status === "Cancelled") {
        const cancelled = await client.query(
          `
            UPDATE course_enrollments
            SET status = 'Cancelled',
                teacher_id = $3,
                curator_id = $4
            WHERE student_id = $1
              AND course_id = $2
            RETURNING id
          `,
          [studentId, courseId, teacherId, curatorId],
        );
        enrollmentId = cancelled.rows[0]?.id || null;
        await client.query(
          `
            UPDATE homework_assignments ha
            SET status = 'Cancelled'
            FROM homework_templates ht
            WHERE ht.id = ha.template_id
              AND ha.student_id = $1
              AND ht.course_id = $2
              AND ha.status <> 'Checked'
          `,
          [studentId, courseId],
        );
      } else {
        const upsert = await client.query(
          `
            INSERT INTO course_enrollments (course_id, student_id, status, teacher_id, curator_id)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (course_id, student_id) DO UPDATE SET
              status = EXCLUDED.status,
              teacher_id = EXCLUDED.teacher_id,
              curator_id = EXCLUDED.curator_id
            RETURNING id
          `,
          [courseId, studentId, status, teacherId, curatorId],
        );
        enrollmentId = upsert.rows[0].id;

        if (status === "Active") {
          await assignHomeworksForEnrollment(client, enrollmentId);
          await client.query(
            `
              UPDATE homework_assignments ha
              SET teacher_id = COALESCE(ce.teacher_id, ht.teacher_id),
                  status = CASE WHEN ha.status = 'Cancelled' THEN 'Assigned' ELSE ha.status END
              FROM course_enrollments ce
              JOIN homework_templates ht ON ht.course_id = ce.course_id
              WHERE ha.enrollment_id = ce.id
                AND ha.template_id = ht.id
                AND ce.id = $1
            `,
            [enrollmentId],
          );
          await ensureChatsForStudent(client, studentId);
        }
      }

      if (enrollmentId) {
        await refreshEnrollmentProgress(client, enrollmentId);
      }

      await client.query("COMMIT");
      response.json({ ok: true, source: "database", studentId, courseId, enrollmentId, enrollmentStatus: status });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }),
);

app.post(
  "/api/admin/parents/:id/children",
  asyncRoute(async (request, response) => {
    await requireAdmin(request);
    const parentId = toInt(request.params.id, 0);
    const studentId = toInt(request.body.studentId, 0);
    const originalStudentId = toInt(request.body.originalStudentId, 0);
    const action = cleanText(request.body.action, 30) || "save";
    const relationType = cleanText(request.body.relationType || request.body.relation_type, 80) || "Parent";

    if (!parentId || !studentId) {
      throw createHttpError(400, "Parent and student are required.");
    }

    const client = await requireDatabase().connect();

    try {
      await client.query("BEGIN");

      const parent = await client.query("SELECT id FROM parents WHERE id = $1", [parentId]);
      const student = await client.query("SELECT id FROM students WHERE id = $1", [studentId]);

      if (parent.rowCount === 0 || student.rowCount === 0) {
        throw createHttpError(404, "Parent or student not found.");
      }

      if (action === "remove") {
        await client.query("DELETE FROM student_parents WHERE parent_id = $1 AND student_id = $2", [parentId, studentId]);
      } else {
        if (originalStudentId && originalStudentId !== studentId) {
          await client.query("DELETE FROM student_parents WHERE parent_id = $1 AND student_id = $2", [parentId, originalStudentId]);
        }

        await client.query(
          `
            INSERT INTO student_parents (student_id, parent_id, relation_type)
            VALUES ($1, $2, $3)
            ON CONFLICT (student_id, parent_id) DO UPDATE SET relation_type = EXCLUDED.relation_type
          `,
          [studentId, parentId, relationType],
        );
      }

      await client.query("COMMIT");
      response.json({ ok: true, source: "database", parentId, studentId, action });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }),
);

app.post(
  "/api/admin/courses/:id/staff",
  asyncRoute(async (request, response) => {
    await requireAdmin(request);
    const courseId = toInt(request.params.id, 0);
    const teacherId = optionalInt(request.body.teacherId);
    const curatorId = optionalInt(request.body.curatorId);

    if (!courseId) {
      throw createHttpError(400, "Course is required.");
    }

    const client = await requireDatabase().connect();

    try {
      await client.query("BEGIN");

      const courseResult = await client.query(
        "SELECT id, teacher_id AS \"teacherId\", curator_id AS \"curatorId\" FROM courses WHERE id = $1 AND status = 'Active' FOR UPDATE",
        [courseId],
      );

      if (courseResult.rowCount === 0) {
        throw createHttpError(404, "Active course not found.");
      }

      if (teacherId) {
        const teacher = await client.query("SELECT id FROM teachers WHERE id = $1 AND active = TRUE", [teacherId]);
        if (teacher.rowCount === 0) {
          throw createHttpError(404, "Teacher not found.");
        }
      }

      if (curatorId) {
        const curator = await client.query("SELECT id FROM curators WHERE id = $1 AND active = TRUE", [curatorId]);
        if (curator.rowCount === 0) {
          throw createHttpError(404, "Curator not found.");
        }
      }

      const previousTeacherId = courseResult.rows[0].teacherId || null;
      const previousCuratorId = courseResult.rows[0].curatorId || null;

      await client.query(
        `
          UPDATE courses
          SET teacher_id = $2,
              curator_id = $3
          WHERE id = $1
        `,
        [courseId, teacherId, curatorId],
      );

      await client.query(
        `
          UPDATE course_enrollments
          SET teacher_id = CASE
                WHEN teacher_id IS NULL OR teacher_id IS NOT DISTINCT FROM $3 THEN $2
                ELSE teacher_id
              END,
              curator_id = CASE
                WHEN curator_id IS NULL OR curator_id IS NOT DISTINCT FROM $5 THEN $4
                ELSE curator_id
              END
          WHERE course_id = $1
            AND status <> 'Cancelled'
        `,
        [courseId, teacherId, previousTeacherId, curatorId, previousCuratorId],
      );

      await client.query(
        `
          UPDATE homework_assignments ha
          SET teacher_id = COALESCE(ce.teacher_id, c.teacher_id)
          FROM course_enrollments ce
          JOIN courses c ON c.id = ce.course_id
          WHERE ha.enrollment_id = ce.id
            AND ce.course_id = $1
            AND ha.status <> 'Checked'
        `,
        [courseId],
      );

      const affectedStudents = await client.query(
        `
          SELECT DISTINCT student_id AS "studentId"
          FROM course_enrollments
          WHERE course_id = $1
            AND status = 'Active'
        `,
        [courseId],
      );

      for (const row of affectedStudents.rows) {
        await ensureChatsForStudent(client, row.studentId);
      }

      await client.query("COMMIT");
      response.json({ ok: true, source: "database", courseId, teacherId, curatorId });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }),
);

async function upsertStaffAccountForPerson(client, { role, teacherId = null, curatorId = null, login, password }) {
  const cleanLogin = normalizeLogin(login);

  if (!cleanLogin) {
    return;
  }

  const personColumn = role === "Teacher" ? "teacher_id" : "curator_id";
  const personId = role === "Teacher" ? teacherId : curatorId;
  const defaultHash = role === "Teacher" ? teacherPassword : curatorPassword;
  const hasNewPassword = cleanText(password, 200).length >= 6;
  const passwordHash = hasNewPassword ? hashPassword(password) : defaultHash;
  const existing = await client.query(`SELECT id FROM staff_accounts WHERE role = $1 AND ${personColumn} = $2`, [role, personId]);

  if (existing.rowCount > 0) {
    await client.query(
      `
        UPDATE staff_accounts
        SET login = $1,
            password_hash = CASE WHEN $2::boolean THEN $3 ELSE password_hash END,
            auth_token = NULL,
            auth_expires_at = NULL
        WHERE id = $4
      `,
      [cleanLogin, hasNewPassword, passwordHash, existing.rows[0].id],
    );
    return;
  }

  await client.query(
    `
      INSERT INTO staff_accounts (role, teacher_id, curator_id, login, password_hash)
      VALUES ($1, $2, $3, $4, $5)
    `,
    [role, teacherId, curatorId, cleanLogin, passwordHash],
  );
}

app.post(
  "/api/admin/teachers",
  asyncRoute(async (request, response) => {
    await requireAdmin(request);
    const teacherId = toInt(request.body.teacherId, 0);
    const firstName = cleanText(request.body.firstName || request.body.first_name, 100) || "Пока";
    const lastName = cleanText(request.body.lastName || request.body.last_name, 100) || "неизвестно";
    const phone = cleanNullableText(request.body.phone, 80);
    const email = cleanNullableText(request.body.email, 160);
    const telegramLink = cleanNullableText(request.body.telegramLink || request.body.telegram_link || request.body.telegram, 300);
    const login = normalizeLogin(request.body.login);
    const password = cleanText(request.body.password, 200);

    const client = await requireDatabase().connect();

    try {
      await client.query("BEGIN");
      const result = teacherId
        ? await client.query(
            `
              UPDATE teachers
              SET first_name = $2,
                  last_name = $3,
                  phone = $4,
                  email = $5,
                  telegram_link = $6,
                  active = TRUE
              WHERE id = $1
              RETURNING id AS "teacherId"
            `,
            [teacherId, firstName, lastName, phone, email, telegramLink],
          )
        : await client.query(
            `
              INSERT INTO teachers (first_name, last_name, phone, email, telegram_link, active)
              VALUES ($1, $2, $3, $4, $5, TRUE)
              RETURNING id AS "teacherId"
            `,
            [firstName, lastName, phone, email, telegramLink],
          );

      if (result.rowCount === 0) {
        throw createHttpError(404, "Teacher not found.");
      }

      const savedTeacherId = result.rows[0].teacherId;
      await upsertStaffAccountForPerson(client, { role: "Teacher", teacherId: savedTeacherId, login, password });
      await client.query("COMMIT");
      response.status(teacherId ? 200 : 201).json({ ok: true, source: "database", teacherId: savedTeacherId });
    } catch (error) {
      await client.query("ROLLBACK");
      if (error?.code === "23505") {
        throw createHttpError(409, "This login is already used by another team account.");
      }
      throw error;
    } finally {
      client.release();
    }
  }),
);

function parseIdList(value) {
  return [...new Set((Array.isArray(value) ? value : [value]).map((item) => optionalInt(item)).filter(Boolean))];
}

async function syncCuratorTeachers(client, curatorId, teacherIds) {
  await client.query("DELETE FROM curator_teachers WHERE curator_id = $1", [curatorId]);

  for (const teacherId of teacherIds) {
    const teacher = await client.query("SELECT id FROM teachers WHERE id = $1 AND active = TRUE", [teacherId]);

    if (teacher.rowCount === 0) {
      throw createHttpError(404, "Teacher not found.");
    }

    await client.query(
      `
        INSERT INTO curator_teachers (curator_id, teacher_id)
        VALUES ($1, $2)
        ON CONFLICT (curator_id, teacher_id) DO NOTHING
      `,
      [curatorId, teacherId],
    );
  }
}

app.post(
  "/api/admin/curators",
  asyncRoute(async (request, response) => {
    await requireAdmin(request);
    const curatorId = toInt(request.body.curatorId, 0);
    const firstName = cleanText(request.body.firstName || request.body.first_name, 100) || "Пока";
    const lastName = cleanText(request.body.lastName || request.body.last_name, 100) || "неизвестно";
    const phone = cleanNullableText(request.body.phone, 80);
    const email = cleanNullableText(request.body.email, 160);
    const telegramLink = cleanNullableText(request.body.telegramLink || request.body.telegram_link || request.body.telegram, 300);
    const login = normalizeLogin(request.body.login);
    const password = cleanText(request.body.password, 200);
    const teacherFieldPresent = Object.prototype.hasOwnProperty.call(request.body, "teacherIds");
    const teacherIds = parseIdList(request.body.teacherIds);

    const client = await requireDatabase().connect();

    try {
      await client.query("BEGIN");
      const result = curatorId
        ? await client.query(
            `
              UPDATE curators
              SET first_name = $2,
                  last_name = $3,
                  phone = $4,
                  email = $5,
                  telegram_link = $6,
                  active = TRUE
              WHERE id = $1
              RETURNING id AS "curatorId"
            `,
            [curatorId, firstName, lastName, phone, email, telegramLink],
          )
        : await client.query(
            `
              INSERT INTO curators (first_name, last_name, phone, email, telegram_link, active)
              VALUES ($1, $2, $3, $4, $5, TRUE)
              RETURNING id AS "curatorId"
            `,
            [firstName, lastName, phone, email, telegramLink],
          );

      if (result.rowCount === 0) {
        throw createHttpError(404, "Curator not found.");
      }

      const savedCuratorId = result.rows[0].curatorId;
      await upsertStaffAccountForPerson(client, { role: "Curator", curatorId: savedCuratorId, login, password });
      if (teacherFieldPresent) {
        await syncCuratorTeachers(client, savedCuratorId, teacherIds);
      }
      await client.query("COMMIT");
      response.status(curatorId ? 200 : 201).json({ ok: true, source: "database", curatorId: savedCuratorId });
    } catch (error) {
      await client.query("ROLLBACK");
      if (error?.code === "23505") {
        throw createHttpError(409, "This login is already used by another team account.");
      }
      throw error;
    } finally {
      client.release();
    }
  }),
);

app.post(
  "/api/admin/curators/:id/teachers",
  asyncRoute(async (request, response) => {
    await requireAdmin(request);
    const curatorId = toInt(request.params.id, 0);
    const teacherIds = parseIdList(request.body.teacherIds);

    if (!curatorId) {
      throw createHttpError(400, "Curator is required.");
    }

    const client = await requireDatabase().connect();

    try {
      await client.query("BEGIN");
      const curator = await client.query("SELECT id FROM curators WHERE id = $1 AND active = TRUE", [curatorId]);

      if (curator.rowCount === 0) {
        throw createHttpError(404, "Curator not found.");
      }

      await syncCuratorTeachers(client, curatorId, teacherIds);
      await client.query("COMMIT");
      response.json({ ok: true, source: "database", curatorId, teacherIds });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }),
);

function formatAgeText(value) {
  const date = value instanceof Date ? value : new Date(value);

  if (!value || Number.isNaN(date.getTime())) {
    return "недавно";
  }

  const minutes = Math.max(1, Math.floor((Date.now() - date.getTime()) / 60000));

  if (minutes < 60) {
    return `${minutes} мин`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 48) {
    return `${hours} ч`;
  }

  return `${Math.floor(hours / 24)} дн`;
}

function buildAdminNotifications(applications = [], supportRequests = []) {
  const pending = applications.filter((application) => application.status === "New");
  const pendingSupport = supportRequests.filter((request) => request.status === "New");
  const notifications = [];

  if (pending.length > 0) {
    const oldest = pending.reduce((left, right) => (new Date(left.createdAt) <= new Date(right.createdAt) ? left : right), pending[0]);
    const newest = pending.reduce((left, right) => (new Date(left.createdAt) >= new Date(right.createdAt) ? left : right), pending[0]);

    notifications.push({
      notificationId: `admin-applications-${pending.length}-${oldest.applicationId}`,
      type: "ApplicationsPending",
      tone: "warning",
      title: "Пришла новая заявка",
      text: `Необработанных: ${pending.length}. Самая старая ждёт ${formatAgeText(oldest.createdAt)}.`,
      createdAt: toDateText(newest.createdAt),
      link: "#staff-applications",
      applicationsTotal: pending.length,
      oldestPendingAt: toDateText(oldest.createdAt),
    });
  }

  if (pendingSupport.length > 0) {
    const oldest = pendingSupport.reduce((left, right) => (new Date(left.createdAt) <= new Date(right.createdAt) ? left : right), pendingSupport[0]);
    const newest = pendingSupport.reduce((left, right) => (new Date(left.createdAt) >= new Date(right.createdAt) ? left : right), pendingSupport[0]);

    notifications.push({
      notificationId: `admin-support-${pendingSupport.length}-${oldest.supportRequestId}`,
      type: "SupportPending",
      tone: "info",
      title: "Новое обращение",
      text: `Необработанных обращений: ${pendingSupport.length}. Самое старое ждёт ${formatAgeText(oldest.createdAt)}.`,
      createdAt: toDateText(newest.createdAt),
      link: "#staff-support",
      supportTotal: pendingSupport.length,
      oldestPendingAt: toDateText(oldest.createdAt),
    });
  }

  return notifications.sort((left, right) => new Date(right.createdAt || 0) - new Date(left.createdAt || 0));
}

async function buildAdminWorkspace(staff) {
  const applications = await dbQuery(
    `
      SELECT
        id AS "applicationId",
        student_name AS "studentName",
        phone,
        email,
        preferred_subject AS "preferredSubject",
        grade,
        comment_text AS "commentText",
        source_page AS "sourcePage",
        status,
        created_at AS "createdAt",
        processed_at AS "processedAt",
        updated_at AS "updatedAt",
        admin_note AS "adminNote"
      FROM course_applications
      ORDER BY created_at DESC, id DESC
    `,
  );

  const supportRequests = await dbQuery(
    `
      SELECT
        sr.id AS "supportRequestId",
        sr.student_id AS "studentId",
        CONCAT(s.first_name, ' ', s.last_name) AS "studentName",
        s.phone,
        s.email,
        sr.topic,
        sr.message_text AS "messageText",
        sr.status,
        sr.created_at AS "createdAt",
        sr.processed_at AS "processedAt",
        sr.updated_at AS "updatedAt",
        sr.admin_note AS "adminNote"
      FROM support_requests sr
      LEFT JOIN students s ON s.id = sr.student_id
      ORDER BY sr.created_at DESC, sr.id DESC
    `,
  );

  const courses = await dbQuery(
    `
      SELECT
        c.id AS "courseId",
        c.slug AS "courseSlug",
        c.title AS "courseTitle",
        c.subject,
        c.teacher_id AS "teacherId",
        c.curator_id AS "curatorId",
        CONCAT(t.first_name, ' ', t.last_name) AS "teacherName",
        CONCAT(cu.first_name, ' ', cu.last_name) AS "curatorName",
        COUNT(DISTINCT CASE WHEN ce.status = 'Active' THEN ce.student_id END)::integer AS "studentsCount"
      FROM courses c
      LEFT JOIN teachers t ON t.id = c.teacher_id
      LEFT JOIN curators cu ON cu.id = c.curator_id
      LEFT JOIN course_enrollments ce ON ce.course_id = c.id
      WHERE c.status = 'Active'
      GROUP BY c.id, t.id, cu.id
      ORDER BY c.id
    `,
  );

  const teachers = await dbQuery(
    `
      SELECT
        t.id AS "teacherId",
        t.first_name AS "firstName",
        t.last_name AS "lastName",
        CONCAT(t.first_name, ' ', t.last_name) AS "teacherName",
        t.phone,
        t.email,
        t.telegram_link AS telegram,
        sa.login,
        (
          SELECT COUNT(DISTINCT c.id)::integer
          FROM courses c
          WHERE c.status = 'Active'
            AND (
              c.teacher_id = t.id
              OR EXISTS (
                SELECT 1 FROM course_enrollments ce_scope
                WHERE ce_scope.course_id = c.id
                  AND ce_scope.status <> 'Cancelled'
                  AND ce_scope.teacher_id = t.id
              )
            )
        ) AS "coursesCount",
        (
          SELECT COUNT(DISTINCT ce.student_id)::integer
          FROM course_enrollments ce
          JOIN courses c ON c.id = ce.course_id
          WHERE ce.status = 'Active'
            AND COALESCE(ce.teacher_id, c.teacher_id) = t.id
        ) AS "studentsCount",
        (
          SELECT COUNT(DISTINCT COALESCE(ce.curator_id, c.curator_id))::integer
          FROM course_enrollments ce
          JOIN courses c ON c.id = ce.course_id
          WHERE ce.status = 'Active'
            AND COALESCE(ce.teacher_id, c.teacher_id) = t.id
            AND COALESCE(ce.curator_id, c.curator_id) IS NOT NULL
        ) AS "curatorsCount",
        (
          SELECT COUNT(DISTINCT ha.id)::integer
          FROM homework_assignments ha
          JOIN homework_templates ht ON ht.id = ha.template_id
          JOIN courses c ON c.id = ht.course_id
          LEFT JOIN course_enrollments ce ON ce.id = ha.enrollment_id
          LEFT JOIN homework_submissions hs ON hs.assignment_id = ha.id
          WHERE ha.status <> 'Cancelled'
            AND COALESCE(ha.teacher_id, ce.teacher_id, c.teacher_id) = t.id
            AND (ha.status IN ('Submitted', 'Checked') OR hs.status IN ('Submitted', 'Checked'))
        ) AS "homeworkSubmitted",
        (
          SELECT COUNT(DISTINCT ha.id)::integer
          FROM homework_assignments ha
          JOIN homework_templates ht ON ht.id = ha.template_id
          JOIN courses c ON c.id = ht.course_id
          LEFT JOIN course_enrollments ce ON ce.id = ha.enrollment_id
          LEFT JOIN homework_submissions hs ON hs.assignment_id = ha.id
          WHERE ha.status <> 'Cancelled'
            AND COALESCE(ha.teacher_id, ce.teacher_id, c.teacher_id) = t.id
            AND (ha.status = 'Checked' OR hs.status = 'Checked')
        ) AS "homeworkChecked",
        COALESCE((
          SELECT AVG(hs.score)
          FROM homework_assignments ha
          JOIN homework_templates ht ON ht.id = ha.template_id
          JOIN courses c ON c.id = ht.course_id
          LEFT JOIN course_enrollments ce ON ce.id = ha.enrollment_id
          JOIN homework_submissions hs ON hs.assignment_id = ha.id
          WHERE COALESCE(ha.teacher_id, ce.teacher_id, c.teacher_id) = t.id
            AND hs.status = 'Checked'
            AND hs.score IS NOT NULL
        ), 0) AS "averageHomeworkScore",
        COALESCE((
          SELECT AVG(review_rating)
          FROM (
            SELECT r.rating AS review_rating
            FROM staff_resource_reviews r
            JOIN lessons l ON r.resource_type = 'Lesson' AND r.resource_id = l.id
            JOIN courses c ON c.id = l.course_id
            WHERE r.staff_role = 'Curator' AND r.rating IS NOT NULL AND c.teacher_id = t.id
            UNION ALL
            SELECT r.rating
            FROM staff_resource_reviews r
            JOIN notes n ON r.resource_type = 'Note' AND r.resource_id = n.id
            JOIN courses c ON c.id = n.course_id
            WHERE r.staff_role = 'Curator' AND r.rating IS NOT NULL AND c.teacher_id = t.id
            UNION ALL
            SELECT r.rating
            FROM staff_resource_reviews r
            JOIN live_streams ls ON r.resource_type = 'Stream' AND r.resource_id = ls.id
            JOIN courses c ON c.id = ls.course_id
            WHERE r.staff_role = 'Curator' AND r.rating IS NOT NULL AND c.teacher_id = t.id
            UNION ALL
            SELECT r.rating
            FROM staff_resource_reviews r
            JOIN homework_assignments ha ON r.resource_type = 'Homework' AND r.resource_id = ha.id
            JOIN homework_templates ht ON ht.id = ha.template_id
            JOIN courses c ON c.id = ht.course_id
            WHERE r.staff_role = 'Curator' AND r.rating IS NOT NULL AND c.teacher_id = t.id
          ) ratings
        ), t.average_rating, 0) AS rating
      FROM teachers t
      LEFT JOIN staff_accounts sa ON sa.role = 'Teacher' AND sa.teacher_id = t.id
      WHERE t.active = TRUE
      ORDER BY t.id
    `,
  );

  const curators = await dbQuery(
    `
      SELECT
        cu.id AS "curatorId",
        cu.first_name AS "firstName",
        cu.last_name AS "lastName",
        CONCAT(cu.first_name, ' ', cu.last_name) AS "curatorName",
        cu.phone,
        cu.email,
        cu.telegram_link AS telegram,
        sa.login,
        (
          SELECT COUNT(DISTINCT c.id)::integer
          FROM courses c
          WHERE c.status = 'Active'
            AND (
              c.curator_id = cu.id
              OR EXISTS (
                SELECT 1 FROM course_enrollments ce_scope
                WHERE ce_scope.course_id = c.id
                  AND ce_scope.status <> 'Cancelled'
                  AND ce_scope.curator_id = cu.id
              )
            )
        ) AS "coursesCount",
        (
          SELECT COUNT(DISTINCT ce.student_id)::integer
          FROM course_enrollments ce
          JOIN courses c ON c.id = ce.course_id
          WHERE ce.status = 'Active'
            AND COALESCE(ce.curator_id, c.curator_id) = cu.id
        ) AS "studentsCount",
        (
          SELECT COUNT(DISTINCT teacher_id)::integer
          FROM (
            SELECT COALESCE(ce.teacher_id, c.teacher_id) AS teacher_id
            FROM course_enrollments ce
            JOIN courses c ON c.id = ce.course_id
            WHERE ce.status = 'Active'
              AND COALESCE(ce.curator_id, c.curator_id) = cu.id
              AND COALESCE(ce.teacher_id, c.teacher_id) IS NOT NULL
            UNION
            SELECT ct.teacher_id
            FROM curator_teachers ct
            WHERE ct.curator_id = cu.id
          ) curator_teacher_scope
        ) AS "teachersCount",
        (
          SELECT COUNT(DISTINCT ha.id)::integer
          FROM homework_assignments ha
          JOIN homework_templates ht ON ht.id = ha.template_id
          JOIN courses c ON c.id = ht.course_id
          LEFT JOIN course_enrollments ce ON ce.id = ha.enrollment_id
          LEFT JOIN homework_submissions hs ON hs.assignment_id = ha.id
          WHERE ha.status <> 'Cancelled'
            AND COALESCE(ce.curator_id, c.curator_id) = cu.id
            AND (ha.status = 'Checked' OR hs.status = 'Checked')
        ) AS "homeworkCheckedByTeachers",
        (
          SELECT COUNT(DISTINCT r.id)::integer
          FROM staff_resource_reviews r
          JOIN homework_assignments ha ON r.resource_type = 'Homework' AND r.resource_id = ha.id
          JOIN homework_templates ht ON ht.id = ha.template_id
          JOIN courses c ON c.id = ht.course_id
          LEFT JOIN course_enrollments ce ON ce.id = ha.enrollment_id
          WHERE r.staff_role = 'Curator'
            AND r.staff_id = cu.id
            AND COALESCE(ce.curator_id, c.curator_id) = cu.id
        ) AS "curatorFeedbackTotal",
        COALESCE((
          SELECT AVG(r.rating)
          FROM staff_resource_reviews r
          WHERE r.staff_role = 'Curator'
            AND r.staff_id = cu.id
            AND r.rating IS NOT NULL
        ), cu.average_rating, 0) AS rating
      FROM curators cu
      LEFT JOIN staff_accounts sa ON sa.role = 'Curator' AND sa.curator_id = cu.id
      WHERE cu.active = TRUE
      ORDER BY cu.id
    `,
  );

  const students = await dbQuery(
    `
      SELECT
        s.id AS "studentId",
        s.first_name AS "firstName",
        s.last_name AS "lastName",
        CONCAT(s.first_name, ' ', s.last_name) AS "studentName",
        s.phone,
        s.email,
        s.grade,
        s.telegram_link AS "telegramLink",
        s.vk_link AS "vkLink",
        s.source_platform AS "sourcePlatform",
        s.student_status AS "studentStatus",
        sa.login,
        s.created_at AS "createdAt",
        COALESCE(AVG(hs.score) FILTER (WHERE hs.status = 'Checked' AND hs.score IS NOT NULL), 0) AS "averageScore",
        COUNT(DISTINCT ha.id)::integer AS "homeworkTotal",
        COUNT(DISTINCT CASE WHEN ha.status IN ('Submitted', 'Checked') THEN ha.id END)::integer AS "homeworkSubmitted",
        COUNT(DISTINCT CASE WHEN ha.status = 'Checked' THEN ha.id END)::integer AS "homeworkChecked"
      FROM students s
      LEFT JOIN course_enrollments ce ON ce.student_id = s.id AND ce.status <> 'Cancelled'
      LEFT JOIN student_accounts sa ON sa.student_id = s.id
      LEFT JOIN homework_assignments ha ON ha.student_id = s.id AND ha.status <> 'Cancelled'
      LEFT JOIN homework_submissions hs ON hs.assignment_id = ha.id
      GROUP BY s.id, sa.login
      ORDER BY s.last_name, s.first_name, s.id
    `,
  );

  const enrollments = await dbQuery(
    `
      SELECT
        ce.id AS "enrollmentId",
        ce.student_id AS "studentId",
        ce.course_id AS "courseId",
        c.slug AS "courseSlug",
        c.title AS "courseTitle",
        ce.status AS "enrollmentStatus",
        COALESCE(ce.teacher_id, c.teacher_id) AS "teacherId",
        COALESCE(ce.curator_id, c.curator_id) AS "curatorId",
        CONCAT(t.first_name, ' ', t.last_name) AS "teacherName",
        CONCAT(cu.first_name, ' ', cu.last_name) AS "curatorName",
        ce.progress_percent AS "progressPercent",
        COUNT(DISTINCT ha.id)::integer AS "homeworkTotal",
        COUNT(DISTINCT CASE WHEN ha.status IN ('Submitted', 'Checked') THEN ha.id END)::integer AS "homeworkSubmitted",
        COUNT(DISTINCT CASE WHEN ha.status = 'Checked' THEN ha.id END)::integer AS "homeworkChecked",
        COALESCE(AVG(hs.score) FILTER (WHERE hs.status = 'Checked' AND hs.score IS NOT NULL), 0) AS "averageScore"
      FROM course_enrollments ce
      JOIN courses c ON c.id = ce.course_id
      LEFT JOIN teachers t ON t.id = COALESCE(ce.teacher_id, c.teacher_id)
      LEFT JOIN curators cu ON cu.id = COALESCE(ce.curator_id, c.curator_id)
      LEFT JOIN homework_assignments ha ON ha.enrollment_id = ce.id AND ha.status <> 'Cancelled'
      LEFT JOIN homework_submissions hs ON hs.assignment_id = ha.id
      WHERE ce.status <> 'Cancelled'
      GROUP BY ce.id, c.id, t.id, cu.id
      ORDER BY c.id
    `,
  );

  const studentParents = await dbQuery(
    `
      SELECT
        sp.student_id AS "studentId",
        p.id AS "parentId",
        CONCAT(p.first_name, ' ', p.last_name) AS "parentName",
        p.phone,
        p.email,
        p.telegram_link AS "telegramLink",
        p.vk_link AS "vkLink",
        p.source_platform AS "sourcePlatform",
        sp.relation_type AS "relationType"
      FROM student_parents sp
      JOIN parents p ON p.id = sp.parent_id
      ORDER BY p.last_name, p.first_name
    `,
  );

  const comments = await dbQuery(
    `
      SELECT
        sc.student_id AS "studentId",
        sc.id AS "commentId",
        sc.staff_role AS "staffRole",
        sc.staff_id AS "staffId",
        sc.comment_text AS "commentText",
        sc.created_at AS "createdAt",
        COALESCE(CONCAT(t.first_name, ' ', t.last_name), CONCAT(cu.first_name, ' ', cu.last_name), 'Команда') AS "authorName"
      FROM student_staff_comments sc
      LEFT JOIN teachers t ON sc.staff_role = 'Teacher' AND t.id = sc.staff_id
      LEFT JOIN curators cu ON sc.staff_role = 'Curator' AND cu.id = sc.staff_id
      ORDER BY sc.created_at DESC
    `,
  );

  const parents = await dbQuery(
    `
      SELECT
        p.id AS "parentId",
        p.first_name AS "firstName",
        p.last_name AS "lastName",
        CONCAT(p.first_name, ' ', p.last_name) AS "parentName",
        p.phone,
        p.email,
        p.telegram_link AS "telegramLink",
        p.vk_link AS "vkLink",
        p.source_platform AS "sourcePlatform",
        p.comment_text AS "commentText",
        p.created_at AS "createdAt",
        p.updated_at AS "updatedAt"
      FROM parents p
      ORDER BY p.last_name, p.first_name, p.id
    `,
  );

  const parentChildren = await dbQuery(
    `
      SELECT
        sp.parent_id AS "parentId",
        s.id AS "studentId",
        CONCAT(s.first_name, ' ', s.last_name) AS "studentName",
        s.student_status AS "studentStatus",
        sp.relation_type AS "relationType"
      FROM student_parents sp
      JOIN students s ON s.id = sp.student_id
      ORDER BY s.last_name, s.first_name
    `,
  );

  const teacherCourses = await dbQuery(
    `
      SELECT
        COALESCE(ce.teacher_id, c.teacher_id) AS "teacherId",
        c.id AS "courseId",
        c.title AS "courseTitle",
        c.subject,
        c.teacher_id AS "courseTeacherId",
        c.curator_id AS "courseCuratorId",
        COUNT(DISTINCT CASE WHEN ce.status = 'Active' THEN ce.student_id END)::integer AS "studentsCount",
        STRING_AGG(DISTINCT CONCAT(cu.first_name, ' ', cu.last_name), ', ') FILTER (WHERE cu.id IS NOT NULL) AS "curatorNames"
      FROM courses c
      LEFT JOIN course_enrollments ce ON ce.course_id = c.id AND ce.status = 'Active'
      LEFT JOIN curators cu ON cu.id = COALESCE(ce.curator_id, c.curator_id)
      WHERE c.status = 'Active'
        AND COALESCE(ce.teacher_id, c.teacher_id) IS NOT NULL
      GROUP BY COALESCE(ce.teacher_id, c.teacher_id), c.id
      ORDER BY c.id
    `,
  );

  const teacherStudents = await dbQuery(
    `
      SELECT DISTINCT
        COALESCE(ce.teacher_id, c.teacher_id) AS "teacherId",
        s.id AS "studentId",
        CONCAT(s.first_name, ' ', s.last_name) AS "studentName",
        s.grade,
        c.id AS "courseId",
        c.title AS "courseTitle",
        ce.status AS "enrollmentStatus",
        COALESCE(ce.curator_id, c.curator_id) AS "curatorId",
        CONCAT(cu.first_name, ' ', cu.last_name) AS "curatorName"
      FROM course_enrollments ce
      JOIN courses c ON c.id = ce.course_id
      JOIN students s ON s.id = ce.student_id
      LEFT JOIN curators cu ON cu.id = COALESCE(ce.curator_id, c.curator_id)
      WHERE ce.status = 'Active'
        AND COALESCE(ce.teacher_id, c.teacher_id) IS NOT NULL
      ORDER BY "studentName", c.id
    `,
  );

  const teacherCurators = await dbQuery(
    `
      SELECT
        COALESCE(ce.teacher_id, c.teacher_id) AS "teacherId",
        COALESCE(ce.curator_id, c.curator_id) AS "curatorId",
        CONCAT(cu.first_name, ' ', cu.last_name) AS "curatorName",
        COUNT(DISTINCT c.id)::integer AS "coursesCount",
        COUNT(DISTINCT ce.student_id)::integer AS "studentsCount"
      FROM course_enrollments ce
      JOIN courses c ON c.id = ce.course_id
      JOIN curators cu ON cu.id = COALESCE(ce.curator_id, c.curator_id)
      WHERE ce.status = 'Active'
        AND COALESCE(ce.teacher_id, c.teacher_id) IS NOT NULL
        AND COALESCE(ce.curator_id, c.curator_id) IS NOT NULL
      GROUP BY COALESCE(ce.teacher_id, c.teacher_id), COALESCE(ce.curator_id, c.curator_id), cu.id
      ORDER BY "curatorName"
    `,
  );

  const curatorCourses = await dbQuery(
    `
      SELECT
        COALESCE(ce.curator_id, c.curator_id) AS "curatorId",
        c.id AS "courseId",
        c.title AS "courseTitle",
        c.subject,
        c.teacher_id AS "courseTeacherId",
        c.curator_id AS "courseCuratorId",
        COUNT(DISTINCT CASE WHEN ce.status = 'Active' THEN ce.student_id END)::integer AS "studentsCount",
        STRING_AGG(DISTINCT CONCAT(t.first_name, ' ', t.last_name), ', ') FILTER (WHERE t.id IS NOT NULL) AS "teacherNames"
      FROM courses c
      LEFT JOIN course_enrollments ce ON ce.course_id = c.id AND ce.status = 'Active'
      LEFT JOIN teachers t ON t.id = COALESCE(ce.teacher_id, c.teacher_id)
      WHERE c.status = 'Active'
        AND COALESCE(ce.curator_id, c.curator_id) IS NOT NULL
      GROUP BY COALESCE(ce.curator_id, c.curator_id), c.id
      ORDER BY c.id
    `,
  );

  const curatorStudents = await dbQuery(
    `
      SELECT DISTINCT
        COALESCE(ce.curator_id, c.curator_id) AS "curatorId",
        s.id AS "studentId",
        CONCAT(s.first_name, ' ', s.last_name) AS "studentName",
        s.grade,
        c.id AS "courseId",
        c.title AS "courseTitle",
        ce.status AS "enrollmentStatus",
        COALESCE(ce.teacher_id, c.teacher_id) AS "teacherId",
        CONCAT(t.first_name, ' ', t.last_name) AS "teacherName"
      FROM course_enrollments ce
      JOIN courses c ON c.id = ce.course_id
      JOIN students s ON s.id = ce.student_id
      LEFT JOIN teachers t ON t.id = COALESCE(ce.teacher_id, c.teacher_id)
      WHERE ce.status = 'Active'
        AND COALESCE(ce.curator_id, c.curator_id) IS NOT NULL
      ORDER BY "studentName", c.id
    `,
  );

  const curatorTeachers = await dbQuery(
    `
      SELECT
        COALESCE(ce.curator_id, c.curator_id) AS "curatorId",
        COALESCE(ce.teacher_id, c.teacher_id) AS "teacherId",
        CONCAT(t.first_name, ' ', t.last_name) AS "teacherName",
        COUNT(DISTINCT c.id)::integer AS "coursesCount",
        COUNT(DISTINCT ce.student_id)::integer AS "studentsCount"
      FROM course_enrollments ce
      JOIN courses c ON c.id = ce.course_id
      JOIN teachers t ON t.id = COALESCE(ce.teacher_id, c.teacher_id)
      WHERE ce.status = 'Active'
        AND COALESCE(ce.curator_id, c.curator_id) IS NOT NULL
        AND COALESCE(ce.teacher_id, c.teacher_id) IS NOT NULL
      GROUP BY COALESCE(ce.curator_id, c.curator_id), COALESCE(ce.teacher_id, c.teacher_id), t.id
      ORDER BY "teacherName"
    `,
  );

  const curatorTeacherLinks = await dbQuery(
    `
      SELECT
        ct.curator_id AS "curatorId",
        ct.teacher_id AS "teacherId",
        CONCAT(t.first_name, ' ', t.last_name) AS "teacherName",
        0::integer AS "coursesCount",
        COUNT(DISTINCT ce.student_id)::integer AS "studentsCount"
      FROM curator_teachers ct
      JOIN teachers t ON t.id = ct.teacher_id
      LEFT JOIN course_enrollments ce ON ce.teacher_id = ct.teacher_id AND ce.curator_id = ct.curator_id AND ce.status = 'Active'
      WHERE t.active = TRUE
      GROUP BY ct.curator_id, ct.teacher_id, t.id
      ORDER BY "teacherName"
    `,
  );

  const teacherCuratorLinks = await dbQuery(
    `
      SELECT
        ct.teacher_id AS "teacherId",
        ct.curator_id AS "curatorId",
        CONCAT(cu.first_name, ' ', cu.last_name) AS "curatorName",
        0::integer AS "coursesCount",
        COUNT(DISTINCT ce.student_id)::integer AS "studentsCount"
      FROM curator_teachers ct
      JOIN curators cu ON cu.id = ct.curator_id
      LEFT JOIN course_enrollments ce ON ce.teacher_id = ct.teacher_id AND ce.curator_id = ct.curator_id AND ce.status = 'Active'
      WHERE cu.active = TRUE
      GROUP BY ct.teacher_id, ct.curator_id, cu.id
      ORDER BY "curatorName"
    `,
  );

  const groupedEnrollments = groupRowsBy(enrollments.rows, "studentId");
  const groupedParents = groupRowsBy(studentParents.rows, "studentId");
  const groupedComments = groupRowsBy(comments.rows.map((row) => ({ ...row, createdAt: toDateText(row.createdAt) })), "studentId");
  const groupedChildren = groupRowsBy(parentChildren.rows, "parentId");
  const groupedTeacherCourses = groupRowsBy(teacherCourses.rows, "teacherId");
  const groupedTeacherStudents = groupRowsBy(teacherStudents.rows, "teacherId");
  const groupedTeacherCurators = groupRowsBy([...teacherCurators.rows, ...teacherCuratorLinks.rows], "teacherId");
  const groupedCuratorCourses = groupRowsBy(curatorCourses.rows, "curatorId");
  const groupedCuratorStudents = groupRowsBy(curatorStudents.rows, "curatorId");
  const groupedCuratorTeachers = groupRowsBy([...curatorTeachers.rows, ...curatorTeacherLinks.rows], "curatorId");

  return {
    source: "database",
    staff,
    applications: applications.rows.map((row) => ({
      ...row,
      createdAt: toDateText(row.createdAt),
      processedAt: toDateText(row.processedAt),
      updatedAt: toDateText(row.updatedAt),
    })),
    supportRequests: supportRequests.rows.map((row) => ({
      ...row,
      createdAt: toDateText(row.createdAt),
      processedAt: toDateText(row.processedAt),
      updatedAt: toDateText(row.updatedAt),
    })),
    students: students.rows.map((student) => ({
      ...student,
      createdAt: toDateText(student.createdAt),
      averageScore: Number(student.averageScore || 0),
      courses: groupedEnrollments.get(Number(student.studentId)) || [],
      parents: groupedParents.get(Number(student.studentId)) || [],
      comments: groupedComments.get(Number(student.studentId)) || [],
    })),
    parents: parents.rows.map((parent) => {
      const children = groupedChildren.get(Number(parent.parentId)) || [];
      const hasActiveStudent = children.some((child) => child.studentStatus !== "Graduate");
      return {
        ...parent,
        createdAt: toDateText(parent.createdAt),
        updatedAt: toDateText(parent.updatedAt),
        children,
        parentStatus: hasActiveStudent ? "Parent_Student" : "Parent_Graduate",
      };
    }),
    courses: courses.rows,
    teachers: teachers.rows.map((teacher) => ({
      ...teacher,
      rating: Number(teacher.rating || 0),
      averageHomeworkScore: Number(teacher.averageHomeworkScore || 0),
      courses: groupedTeacherCourses.get(Number(teacher.teacherId)) || [],
      students: groupedTeacherStudents.get(Number(teacher.teacherId)) || [],
      curators: groupedTeacherCurators.get(Number(teacher.teacherId)) || [],
    })),
    curators: curators.rows.map((curator) => ({
      ...curator,
      rating: Number(curator.rating || 0),
      courses: groupedCuratorCourses.get(Number(curator.curatorId)) || [],
      students: groupedCuratorStudents.get(Number(curator.curatorId)) || [],
      teachers: groupedCuratorTeachers.get(Number(curator.curatorId)) || [],
    })),
    homeworks: [],
    streams: [],
    homeworkStats: [],
    notifications: buildAdminNotifications(applications.rows, supportRequests.rows),
  };
}

function groupRowsBy(rows, key) {
  const result = new Map();

  for (const row of rows || []) {
    const value = Number(row[key]);
    if (!result.has(value)) {
      result.set(value, []);
    }
    result.get(value).push(row);
  }

  return result;
}

async function buildStaffWorkspace(staff) {
  if (staff.role === "Admin") {
    return buildAdminWorkspace(staff);
  }

  const scopeId = staffScopeId(staff);
  const scope = courseScopeWhere(staff, "c", 1);
  const courseVisibleScope =
    staff.role === "Teacher"
      ? "(c.teacher_id = $1 OR EXISTS (SELECT 1 FROM course_enrollments ce_scope WHERE ce_scope.course_id = c.id AND ce_scope.status = 'Active' AND ce_scope.teacher_id = $1))"
      : "(c.curator_id = $1 OR EXISTS (SELECT 1 FROM course_enrollments ce_scope WHERE ce_scope.course_id = c.id AND ce_scope.status = 'Active' AND ce_scope.curator_id = $1))";
  const enrollmentScope = staff.role === "Teacher" ? "COALESCE(ce.teacher_id, c.teacher_id) = $1" : "COALESCE(ce.curator_id, c.curator_id) = $1";
  const homeworkScope =
    staff.role === "Teacher" ? "COALESCE(ha.teacher_id, ce.teacher_id, c.teacher_id) = $1" : "COALESCE(ce.curator_id, c.curator_id) = $1";
  const reviewParams = [scopeId, staff.role, staff.staffId];

  const courses = await dbQuery(
    `
      SELECT
        c.id AS "courseId",
        c.slug AS "courseSlug",
        c.title AS "courseTitle",
        c.teacher_id AS "teacherId",
        c.curator_id AS "curatorId",
        c.short_description AS description,
        c.total_lessons AS "totalLessons",
        CONCAT(t.first_name, ' ', t.last_name) AS "teacherName",
        CONCAT(cu.first_name, ' ', cu.last_name) AS "curatorName",
        COUNT(DISTINCT ce.student_id)::integer AS "studentsCount",
        COUNT(DISTINCT l.id)::integer AS "lessonsCount",
        COUNT(DISTINCT ha.id)::integer AS "homeworksCount",
        COUNT(DISTINCT ls.id)::integer AS "streamsCount"
      FROM courses c
      LEFT JOIN teachers t ON t.id = c.teacher_id
      LEFT JOIN curators cu ON cu.id = c.curator_id
      LEFT JOIN course_enrollments ce ON ce.course_id = c.id AND ce.status = 'Active'
      LEFT JOIN lessons l ON l.course_id = c.id
      LEFT JOIN homework_assignments ha ON ha.enrollment_id = ce.id AND ha.status <> 'Cancelled'
      LEFT JOIN live_streams ls ON ls.course_id = c.id AND ls.status IN ('Planned', 'Live')
      WHERE c.status = 'Active' AND ${courseVisibleScope}
      GROUP BY c.id, c.teacher_id, c.curator_id, t.first_name, t.last_name, cu.first_name, cu.last_name
      ORDER BY c.id
    `,
    [scopeId],
  );

  const students = await dbQuery(
    `
      SELECT
        s.id AS "studentId",
        CONCAT(s.first_name, ' ', s.last_name) AS "studentName",
        s.phone,
        s.email,
        s.grade,
        c.id AS "courseId",
        c.slug AS "courseSlug",
        c.title AS "courseTitle",
        COALESCE(ce.teacher_id, c.teacher_id) AS "teacherId",
        CONCAT(t.first_name, ' ', t.last_name) AS "teacherName",
        COALESCE(ce.curator_id, c.curator_id) AS "curatorId",
        CONCAT(cu.first_name, ' ', cu.last_name) AS "curatorName",
        ce.progress_percent AS "progressPercent",
        ce.status AS "enrollmentStatus",
        COALESCE((SELECT SUM(pt.points) FROM point_transactions pt WHERE pt.student_id = s.id), 0)::integer AS "pointsTotal",
        (SELECT sc.comment_text FROM student_staff_comments sc WHERE sc.student_id = s.id ORDER BY sc.created_at DESC LIMIT 1) AS "lastComment",
        (SELECT sc.created_at FROM student_staff_comments sc WHERE sc.student_id = s.id ORDER BY sc.created_at DESC LIMIT 1) AS "lastCommentAt"
      FROM course_enrollments ce
      JOIN students s ON s.id = ce.student_id
      JOIN courses c ON c.id = ce.course_id
      LEFT JOIN teachers t ON t.id = COALESCE(ce.teacher_id, c.teacher_id)
      LEFT JOIN curators cu ON cu.id = COALESCE(ce.curator_id, c.curator_id)
      WHERE ce.status = 'Active' AND c.status = 'Active' AND ${enrollmentScope}
      ORDER BY c.id, s.last_name, s.first_name
    `,
    [scopeId],
  );

  const teachers = await dbQuery(
    `
      SELECT
        t.id AS "teacherId",
        CONCAT(t.first_name, ' ', t.last_name) AS "teacherName",
        t.phone,
        t.email,
        t.telegram_link AS telegram,
        t.average_rating AS rating,
        COUNT(DISTINCT c.id)::integer AS "coursesCount",
        COUNT(DISTINCT ce.student_id)::integer AS "studentsCount"
      FROM courses c
      JOIN teachers t ON t.id = c.teacher_id
      LEFT JOIN course_enrollments ce ON ce.course_id = c.id AND ce.status = 'Active'
      WHERE c.status = 'Active' AND ${courseVisibleScope}
      GROUP BY t.id
      ORDER BY t.id
    `,
    [scopeId],
  );

  const lessons = await dbQuery(
    `
      SELECT
        l.id AS "lessonId",
        c.id AS "courseId",
        c.slug AS "courseSlug",
        c.title AS "courseTitle",
        c.teacher_id AS "teacherId",
        c.curator_id AS "curatorId",
        CONCAT(t.first_name, ' ', t.last_name) AS "teacherName",
        l.lesson_number AS "lessonNumber",
        l.title AS "lessonTitle",
        l.topic,
        l.video_url AS "videoUrl",
        l.notes_url AS "notesUrl",
        l.homework_url AS "homeworkUrl",
        l.duration_minutes AS "durationMinutes",
        l.status AS "lessonStatus",
        r.id AS "curatorReviewId",
        r.rating AS "curatorRating",
        r.comment_text AS "curatorComment",
        r.created_at AS "curatorReviewCreatedAt",
        r.updated_at AS "curatorReviewUpdatedAt"
      FROM lessons l
      JOIN courses c ON c.id = l.course_id
      LEFT JOIN teachers t ON t.id = c.teacher_id
      LEFT JOIN staff_resource_reviews r
        ON r.resource_type = 'Lesson'
       AND r.resource_id = l.id
       AND r.staff_role = $2
       AND r.staff_id = $3
      WHERE c.status = 'Active' AND ${courseVisibleScope}
      ORDER BY c.id, l.lesson_number
    `,
    reviewParams,
  );

  const notes = await dbQuery(
    `
      SELECT
        n.id AS "noteId",
        c.id AS "courseId",
        c.slug AS "courseSlug",
        c.title AS "courseTitle",
        c.teacher_id AS "teacherId",
        c.curator_id AS "curatorId",
        CONCAT(t.first_name, ' ', t.last_name) AS "teacherName",
        l.id AS "lessonId",
        l.lesson_number AS "lessonNumber",
        l.title AS "lessonTitle",
        n.title AS "materialTitle",
        n.material_type AS "materialType",
        n.file_url AS "fileUrl",
        r.id AS "curatorReviewId",
        r.rating AS "curatorRating",
        r.comment_text AS "curatorComment",
        r.created_at AS "curatorReviewCreatedAt",
        r.updated_at AS "curatorReviewUpdatedAt"
      FROM notes n
      JOIN courses c ON c.id = n.course_id
      LEFT JOIN lessons l ON l.id = n.lesson_id
      LEFT JOIN teachers t ON t.id = c.teacher_id
      LEFT JOIN staff_resource_reviews r
        ON r.resource_type = 'Note'
       AND r.resource_id = n.id
       AND r.staff_role = $2
       AND r.staff_id = $3
      WHERE n.active = TRUE AND c.status = 'Active' AND ${courseVisibleScope}
      ORDER BY c.id, l.lesson_number, n.id
    `,
    reviewParams,
  );

  const homeworks = await dbQuery(
    `
      SELECT
        ha.id AS "homeworkAssignmentId",
        ht.id AS "homeworkTemplateId",
        c.id AS "courseId",
        c.slug AS "courseSlug",
        c.title AS "courseTitle",
        c.teacher_id AS "teacherId",
        c.curator_id AS "curatorId",
        CONCAT(t.first_name, ' ', t.last_name) AS "teacherName",
        s.id AS "studentId",
        CONCAT(s.first_name, ' ', s.last_name) AS "studentName",
        s.grade,
        l.id AS "lessonId",
        l.lesson_number AS "lessonNumber",
        l.title AS "lessonTitle",
        ht.title AS "homeworkTitle",
        ht.description AS "homeworkDescription",
        ht.file_url AS "taskLink",
        ha.due_at AS "dueAt",
        ha.status AS "homeworkStatus",
        hs.id AS "homeworkSubmissionId",
        hs.file_url AS "submissionLink",
        hs.status AS "submissionStatus",
        hs.submitted_at AS "submittedAt",
        hs.score,
        hs.feedback_text AS "feedbackText",
        ha.teacher_comment AS "teacherComment",
        hs.checked_by_teacher_id AS "checkedByTeacherId",
        hs.checked_at AS "checkedAt",
        r.id AS "curatorReviewId",
        r.rating AS "curatorRating",
        r.comment_text AS "curatorComment",
        r.created_at AS "curatorReviewCreatedAt",
        r.updated_at AS "curatorReviewUpdatedAt"
      FROM homework_assignments ha
      JOIN homework_templates ht ON ht.id = ha.template_id
      JOIN students s ON s.id = ha.student_id
      LEFT JOIN course_enrollments ce ON ce.id = ha.enrollment_id
      LEFT JOIN courses c ON c.id = COALESCE(ce.course_id, ht.course_id)
      LEFT JOIN teachers t ON t.id = c.teacher_id
      LEFT JOIN lessons l ON l.id = ht.lesson_id
      LEFT JOIN homework_submissions hs ON hs.assignment_id = ha.id
      LEFT JOIN staff_resource_reviews r
        ON r.resource_type = 'Homework'
       AND r.resource_id = ha.id
       AND r.staff_role = $2
       AND r.staff_id = $3
      WHERE c.status = 'Active' AND ha.status <> 'Cancelled' AND ${homeworkScope}
      ORDER BY c.id, s.last_name, s.first_name, l.lesson_number, ha.id
    `,
    reviewParams,
  );

  const streams = await dbQuery(
    `
      SELECT
        ls.id AS "streamId",
        c.id AS "courseId",
        c.slug AS "courseSlug",
        c.title AS "courseTitle",
        c.teacher_id AS "teacherId",
        c.curator_id AS "curatorId",
        CONCAT(t.first_name, ' ', t.last_name) AS "teacherName",
        l.id AS "lessonId",
        l.lesson_number AS "lessonNumber",
        l.title AS "lessonTitle",
        ls.title AS "streamTitle",
        ls.starts_at AS "startsAt",
        ls.ends_at AS "endsAt",
        ls.stream_link AS "streamLink",
        ls.status,
        r.id AS "curatorReviewId",
        r.rating AS "curatorRating",
        r.comment_text AS "curatorComment",
        r.created_at AS "curatorReviewCreatedAt",
        r.updated_at AS "curatorReviewUpdatedAt"
      FROM live_streams ls
      JOIN courses c ON c.id = ls.course_id
      LEFT JOIN lessons l ON l.id = ls.lesson_id
      LEFT JOIN teachers t ON t.id = c.teacher_id
      LEFT JOIN staff_resource_reviews r
        ON r.resource_type = 'Stream'
       AND r.resource_id = ls.id
       AND r.staff_role = $2
       AND r.staff_id = $3
      WHERE c.status = 'Active' AND ${courseVisibleScope}
      ORDER BY ls.starts_at DESC, ls.id DESC
    `,
    reviewParams,
  );

  const calls =
    staff.role === "Curator"
      ? await dbQuery(
          `
            SELECT
              sc.id AS "callId",
              sc.curator_id AS "curatorId",
              sc.title AS "callTitle",
              sc.call_link AS "callLink",
              sc.starts_at AS "startsAt",
              sc.status,
              sc.created_at AS "createdAt",
              sc.updated_at AS "updatedAt",
              COALESCE(
                JSON_AGG(
                  JSON_BUILD_OBJECT(
                    'studentId', s.id,
                    'studentName', CONCAT(s.first_name, ' ', s.last_name),
                    'grade', s.grade
                  )
                  ORDER BY s.last_name, s.first_name
                ) FILTER (WHERE s.id IS NOT NULL),
                '[]'::json
              ) AS students
            FROM student_calls sc
            LEFT JOIN student_call_participants scp ON scp.call_id = sc.id
            LEFT JOIN students s ON s.id = scp.student_id
            WHERE sc.curator_id = $1
            GROUP BY sc.id
            ORDER BY sc.starts_at DESC, sc.id DESC
          `,
          [scopeId],
        )
      : { rows: [] };

  const homeworkStats = await dbQuery(
    `
      SELECT
        c.id AS "courseId",
        c.slug AS "courseSlug",
        c.title AS "courseTitle",
        c.teacher_id AS "teacherId",
        c.curator_id AS "curatorId",
        CONCAT(t.first_name, ' ', t.last_name) AS "teacherName",
        l.id AS "lessonId",
        l.lesson_number AS "lessonNumber",
        l.title AS "lessonTitle",
        ht.id AS "homeworkTemplateId",
        ht.title AS "homeworkTitle",
        COUNT(ha.id)::integer AS "homeworkTotal",
        COUNT(DISTINCT ha.student_id)::integer AS "studentsTotal",
        SUM(CASE WHEN ha.status IN ('Submitted', 'Checked') OR hs.status IN ('Submitted', 'Checked') THEN 1 ELSE 0 END)::integer AS "submittedTotal",
        SUM(CASE WHEN ha.status = 'Checked' OR hs.status = 'Checked' THEN 1 ELSE 0 END)::integer AS "checkedTotal",
        SUM(CASE WHEN r.id IS NOT NULL AND ha.id IS NOT NULL THEN 1 ELSE 0 END)::integer AS "curatorReviewedTotal",
        MAX(r.id) AS "curatorReviewId",
        MAX(r.rating) AS "curatorRating",
        MAX(r.comment_text) AS "curatorComment"
      FROM homework_templates ht
      JOIN courses c ON c.id = ht.course_id
      LEFT JOIN teachers t ON t.id = c.teacher_id
      LEFT JOIN lessons l ON l.id = ht.lesson_id
      LEFT JOIN homework_assignments ha ON ha.template_id = ht.id AND ha.status <> 'Cancelled'
      LEFT JOIN course_enrollments ce ON ce.id = ha.enrollment_id
      LEFT JOIN homework_submissions hs ON hs.assignment_id = ha.id
      LEFT JOIN staff_resource_reviews r
        ON r.resource_type = 'Homework'
       AND r.resource_id = ha.id
       AND r.staff_role = $2
       AND r.staff_id = $3
      WHERE ht.active = TRUE AND c.status = 'Active' AND ${homeworkScope}
      GROUP BY c.id, c.teacher_id, c.curator_id, t.first_name, t.last_name, l.id, ht.id
      ORDER BY c.id, l.lesson_number, ht.id
    `,
    reviewParams,
  );

  const mappedHomeworks = homeworks.rows.map(mapStaffHomeworkDates);
  const mappedStats = homeworkStats.rows.map(mapHomeworkStat);

  return {
    source: "database",
    staff,
    courses: courses.rows,
    students: students.rows.map((row) => ({ ...row, lastCommentAt: toDateText(row.lastCommentAt) })),
    teachers: teachers.rows,
    lessons: lessons.rows.map(mapReviewDates),
    notes: notes.rows.map(mapReviewDates),
    homeworks: mappedHomeworks,
    streams: streams.rows.map((row) => ({ ...mapReviewDates(row), startsAt: toDateText(row.startsAt), endsAt: toDateText(row.endsAt) })),
    calls: calls.rows.map((row) => ({
      ...row,
      startsAt: toDateText(row.startsAt),
      createdAt: toDateText(row.createdAt),
      updatedAt: toDateText(row.updatedAt),
      students: Array.isArray(row.students) ? row.students : [],
    })),
    homeworkStats: mappedStats,
    notifications: buildStaffNotifications(staff, mappedHomeworks, mappedStats),
  };
}

function mapReviewDates(row) {
  return {
    ...row,
    curatorReviewCreatedAt: toDateText(row.curatorReviewCreatedAt),
    curatorReviewUpdatedAt: toDateText(row.curatorReviewUpdatedAt),
  };
}

function mapStaffHomeworkDates(row) {
  return {
    ...mapReviewDates(row),
    dueAt: toDateText(row.dueAt),
    submittedAt: toDateText(row.submittedAt),
    checkedAt: toDateText(row.checkedAt),
  };
}

function mapHomeworkStat(row) {
  const total = Number(row.homeworkTotal || 0);
  const submitted = Number(row.submittedTotal || 0);
  const checked = Number(row.checkedTotal || 0);
  const reviewed = Number(row.curatorReviewedTotal || 0);
  return {
    ...row,
    submittedPercent: total > 0 ? Math.round((submitted * 100) / total) : 0,
    checkedPercent: total > 0 ? Math.round((checked * 100) / total) : 0,
    curatorReviewedPercent: total > 0 ? Math.round((reviewed * 100) / total) : 0,
  };
}

function buildStaffNotifications(staff, homeworks, stats) {
  const byTemplate = new Map(stats.map((stat) => [Number(stat.homeworkTemplateId), stat]));

  if (staff.role === "Teacher") {
    return homeworks
      .filter((homework) => homework.submittedAt)
      .sort((a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0))
      .slice(0, 8)
      .map((homework) => {
        const stat = byTemplate.get(Number(homework.homeworkTemplateId)) || {};
        return {
          notificationId: `teacher-submission-${homework.homeworkSubmissionId}`,
          type: "HomeworkSubmitted",
          tone: homework.submissionStatus === "Checked" || homework.homeworkStatus === "Checked" ? "success" : "warning",
          title: `${homework.studentName} сдал ДЗ`,
          text: `${homework.courseTitle} · Урок ${homework.lessonNumber}. ${homework.homeworkTitle}`,
          createdAt: homework.submittedAt,
          link: "#staff-homework",
          actorName: homework.studentName,
          homeworkAssignmentId: homework.homeworkAssignmentId,
          homeworkSubmissionId: homework.homeworkSubmissionId,
          homeworkTemplateId: homework.homeworkTemplateId,
          courseTitle: homework.courseTitle,
          courseSlug: homework.courseSlug,
          courseId: homework.courseId,
          lessonId: homework.lessonId,
          lessonNumber: homework.lessonNumber,
          lessonTitle: homework.lessonTitle,
          homeworkTitle: homework.homeworkTitle,
          homeworkTotal: stat.homeworkTotal || 0,
          submittedTotal: stat.submittedTotal || 0,
          checkedTotal: stat.checkedTotal || 0,
          submittedPercent: stat.submittedPercent || 0,
          checkedPercent: stat.checkedPercent || 0,
        };
      });
  }

  return homeworks
    .filter((homework) => homework.checkedAt)
    .sort((a, b) => new Date(b.checkedAt || 0) - new Date(a.checkedAt || 0))
    .slice(0, 8)
    .map((homework) => {
      const stat = byTemplate.get(Number(homework.homeworkTemplateId)) || {};
      return {
        notificationId: `curator-checked-${homework.homeworkSubmissionId}`,
        type: "HomeworkChecked",
        tone: homework.curatorReviewId ? "success" : "warning",
        title: `${homework.teacherName} проверил ДЗ`,
        text: `${homework.courseTitle} · Урок ${homework.lessonNumber}. ${homework.homeworkTitle}`,
        createdAt: homework.checkedAt,
        link: "#staff-homework",
        actorName: homework.teacherName,
        homeworkAssignmentId: homework.homeworkAssignmentId,
        homeworkSubmissionId: homework.homeworkSubmissionId,
        homeworkTemplateId: homework.homeworkTemplateId,
        courseTitle: homework.courseTitle,
        courseSlug: homework.courseSlug,
        courseId: homework.courseId,
        lessonId: homework.lessonId,
        lessonNumber: homework.lessonNumber,
        lessonTitle: homework.lessonTitle,
        homeworkTitle: homework.homeworkTitle,
        homeworkTotal: stat.homeworkTotal || 0,
        submittedTotal: stat.submittedTotal || 0,
        checkedTotal: stat.checkedTotal || 0,
        curatorReviewedTotal: stat.curatorReviewedTotal || 0,
        submittedPercent: stat.submittedPercent || 0,
        checkedPercent: stat.checkedPercent || 0,
        curatorReviewedPercent: stat.curatorReviewedPercent || 0,
      };
    });
}

app.post(
  "/api/staff/homeworks/:id/review",
  asyncRoute(async (request, response) => {
    const staff = await getStaffByToken(request);
    if (staff.role !== "Teacher" || !staff.teacherId) {
      throw createHttpError(403, "Проверять ДЗ может только преподаватель.");
    }

    const assignmentId = toInt(request.params.id, 0);
    const score = toInt(request.body.score, 0);
    const feedbackText = cleanText(request.body.feedbackText || request.body.comment, 2000) || "Проверено.";

    if (!assignmentId || score < 1 || score > 10) {
      throw createHttpError(400, "Оценка должна быть от 1 до 10.");
    }

    const client = await requireDatabase().connect();

    try {
      await client.query("BEGIN");
      const assignment = await client.query(
        `
          SELECT ha.id, ha.enrollment_id, ha.status, hs.id AS submission_id, hs.status AS submission_status
          FROM homework_assignments ha
          JOIN homework_templates ht ON ht.id = ha.template_id
          JOIN courses c ON c.id = ht.course_id
          LEFT JOIN course_enrollments ce ON ce.id = ha.enrollment_id
          LEFT JOIN homework_submissions hs ON hs.assignment_id = ha.id
          WHERE ha.id = $1
            AND COALESCE(ha.teacher_id, ce.teacher_id, c.teacher_id) = $2
          FOR UPDATE OF ha
        `,
        [assignmentId, staff.teacherId],
      );

      if (assignment.rowCount === 0) {
        throw createHttpError(404, "ДЗ недоступно этому преподавателю.");
      }

      const row = assignment.rows[0];
      if (row.status === "Checked" || row.submission_status === "Checked") {
        throw createHttpError(409, "Это ДЗ уже проверено.");
      }

      if (!row.submission_id || row.submission_status !== "Submitted") {
        throw createHttpError(400, "Ученик еще не прикрепил ссылку на ДЗ.");
      }

      await client.query(
        `
          UPDATE homework_submissions
          SET checked_by_teacher_id = $1,
              checked_at = NOW(),
              score = $2,
              feedback_text = $3,
              status = 'Checked'
          WHERE id = $4
        `,
        [staff.teacherId, score, feedbackText, row.submission_id],
      );

      await client.query("UPDATE homework_assignments SET status = 'Checked', teacher_comment = $2 WHERE id = $1", [assignmentId, feedbackText]);
      if (row.enrollment_id) {
        await refreshEnrollmentProgress(client, row.enrollment_id);
      }
      await client.query("COMMIT");
      response.json({ ok: true, source: "database", homeworkAssignmentId: assignmentId, homeworkSubmissionId: row.submission_id, score, feedbackText });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }),
);

app.post(
  "/api/staff/lessons",
  asyncRoute(async (request, response) => {
    const staff = await getStaffByToken(request);
    if (staff.role !== "Teacher" || !staff.teacherId) {
      throw createHttpError(403, "Редактировать уроки может только преподаватель.");
    }

    const lessonId = toInt(request.body.lessonId, 0);
    const courseId = toInt(request.body.courseId, 0);
    let lessonNumber = toInt(request.body.lessonNumber, 0);
    const lessonTitle = cleanText(request.body.lessonTitle, 200);
    const topic = cleanText(request.body.topic, 500);
    const videoUrl = normalizeLink(request.body.videoUrl);
    const notesUrl = normalizeLink(request.body.notesUrl);
    const homeworkUrl = normalizeLink(request.body.homeworkUrl);

    if (!courseId || !lessonTitle) {
      throw createHttpError(400, "Укажите курс и название урока.");
    }

    const client = await requireDatabase().connect();

    try {
      await client.query("BEGIN");
      const course = await client.query("SELECT id FROM courses WHERE id = $1 AND teacher_id = $2 AND status = 'Active'", [courseId, staff.teacherId]);
      if (course.rowCount === 0) {
        throw createHttpError(403, "Курс недоступен этому преподавателю.");
      }

      if (!lessonNumber) {
        const next = await client.query("SELECT COALESCE(MAX(lesson_number), 0) + 1 AS next_number FROM lessons WHERE course_id = $1", [courseId]);
        lessonNumber = Number(next.rows[0].next_number || 1);
      }

      let savedLessonId = lessonId;
      if (lessonId) {
        const updated = await client.query(
          `
            UPDATE lessons
            SET lesson_number = $1,
                title = $2,
                topic = $3,
                video_url = $4,
                notes_url = $5,
                homework_url = $6,
                status = 'Open',
                is_open = TRUE,
                updated_at = NOW()
            WHERE id = $7
              AND course_id = $8
            RETURNING id
          `,
          [lessonNumber, lessonTitle, topic, videoUrl, notesUrl, homeworkUrl, lessonId, courseId],
        );
        if (updated.rowCount === 0) {
          throw createHttpError(404, "Урок не найден.");
        }
      } else {
        const inserted = await client.query(
          `
            INSERT INTO lessons (course_id, lesson_number, title, topic, video_url, notes_url, homework_url, status, is_open)
            VALUES ($1, $2, $3, $4, $5, $6, $7, 'Open', TRUE)
            RETURNING id
          `,
          [courseId, lessonNumber, lessonTitle, topic, videoUrl, notesUrl, homeworkUrl],
        );
        savedLessonId = inserted.rows[0].id;
      }

      if (notesUrl) {
        await client.query(
          `
            INSERT INTO notes (course_id, lesson_id, title, material_type, author, file_url, active)
            VALUES ($1, $2, $3, 'Конспект', 'Преподаватель', $4, TRUE)
            ON CONFLICT (course_id, lesson_id, material_type) DO UPDATE SET
                title = EXCLUDED.title,
                file_url = EXCLUDED.file_url,
                active = TRUE
          `,
          [courseId, savedLessonId, `Конспект: ${lessonTitle}`, notesUrl],
        );
      }

      if (homeworkUrl) {
        const template = await client.query(
          `
            INSERT INTO homework_templates (course_id, lesson_id, teacher_id, title, description, file_url, max_score, active)
            VALUES ($1, $2, $3, $4, $5, $6, 10, TRUE)
            ON CONFLICT (course_id, lesson_id) DO UPDATE SET
              teacher_id = EXCLUDED.teacher_id,
              title = EXCLUDED.title,
              description = EXCLUDED.description,
              file_url = EXCLUDED.file_url,
              max_score = 10,
              active = TRUE
            RETURNING id
          `,
          [courseId, savedLessonId, staff.teacherId, `ДЗ: ${lessonTitle}`, topic, homeworkUrl],
        );
        await client.query(
          `
            INSERT INTO homework_assignments (template_id, student_id, enrollment_id, teacher_id, due_at, status)
            SELECT $1, ce.student_id, ce.id, $2, NOW() + INTERVAL '7 days', 'Assigned'
            FROM course_enrollments ce
            WHERE ce.course_id = $3
              AND ce.status = 'Active'
            ON CONFLICT (template_id, student_id) DO NOTHING
          `,
          [template.rows[0].id, staff.teacherId, courseId],
        );
      }

      await client.query("UPDATE courses SET total_lessons = (SELECT COUNT(*) FROM lessons WHERE course_id = $1) WHERE id = $1", [courseId]);
      await client.query("COMMIT");
      response.json({ ok: true, source: "database", lessonId: savedLessonId });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }),
);

app.post(
  "/api/staff/streams",
  asyncRoute(async (request, response) => {
    const staff = await getStaffByToken(request);
    if (staff.role !== "Teacher" || !staff.teacherId) {
      throw createHttpError(403, "Создавать трансляции может только преподаватель.");
    }

    const courseId = toInt(request.body.courseId, 0);
    const streamId = toInt(request.body.streamId, 0);
    const lessonId = toInt(request.body.lessonId, null);
    const streamTitle = cleanText(request.body.streamTitle, 200);
    const streamLink = normalizeLink(request.body.streamLink);
    const requestedStatus = cleanText(request.body.status, 30) || "Planned";
    const status = ["Planned", "Live", "Done", "Cancelled"].includes(requestedStatus) ? requestedStatus : "Planned";
    const startsAt = request.body.startsAt ? new Date(request.body.startsAt) : new Date(Date.now() + 24 * 60 * 60 * 1000);

    if (!courseId || !streamTitle || !streamLink) {
      throw createHttpError(400, "Укажите курс, название и ссылку.");
    }

    if (Number.isNaN(startsAt.getTime())) {
      throw createHttpError(400, "Некорректная дата трансляции.");
    }

    const result = streamId
      ? await dbQuery(
          `
            UPDATE live_streams ls
            SET lesson_id = $2,
                title = $3,
                starts_at = $4,
                ends_at = $4::timestamptz + INTERVAL '2 hours',
                stream_link = $5,
                status = $6
            FROM courses c
            WHERE ls.id = $7
              AND ls.course_id = c.id
              AND c.id = $1
              AND c.teacher_id = $8
              AND c.status = 'Active'
            RETURNING ls.id
          `,
          [courseId, lessonId, streamTitle, startsAt.toISOString(), streamLink, status, streamId, staff.teacherId],
        )
      : await dbQuery(
          `
            INSERT INTO live_streams (course_id, lesson_id, title, starts_at, ends_at, stream_link, status)
            SELECT $1, $2, $3, $4, $4::timestamptz + INTERVAL '2 hours', $5, $6
            WHERE EXISTS (SELECT 1 FROM courses WHERE id = $1 AND teacher_id = $7 AND status = 'Active')
            RETURNING id
          `,
          [courseId, lessonId, streamTitle, startsAt.toISOString(), streamLink, status, staff.teacherId],
        );

    if (result.rowCount === 0) {
      throw createHttpError(403, "Курс недоступен этому преподавателю.");
    }

    response.status(streamId ? 200 : 201).json({ ok: true, source: "database", streamId: result.rows[0].id });
  }),
);

app.post(
  "/api/staff/calls",
  asyncRoute(async (request, response) => {
    const staff = await getStaffByToken(request);
    if (staff.role !== "Curator" || !staff.curatorId) {
      throw createHttpError(403, "Созвоны с учениками может создавать только куратор.");
    }

    const callId = toInt(request.body.callId, 0);
    const callTitle = cleanText(request.body.callTitle || request.body.title, 200);
    const callLink = normalizeLink(request.body.callLink);
    const startsAt = request.body.startsAt ? new Date(request.body.startsAt) : null;
    const studentIds = parseIdList(request.body.studentIds);
    const requestedStatus = cleanText(request.body.status, 30) || "Planned";
    const status = ["Planned", "Done", "Cancelled"].includes(requestedStatus) ? requestedStatus : "Planned";

    if (!callTitle || !startsAt || Number.isNaN(startsAt.getTime()) || studentIds.length === 0) {
      throw createHttpError(400, "Укажите название, дату и хотя бы одного ученика для созвона.");
    }

    const client = await requireDatabase().connect();

    try {
      await client.query("BEGIN");
      const visibleStudents = await client.query(
        `
          SELECT DISTINCT s.id
          FROM course_enrollments ce
          JOIN courses c ON c.id = ce.course_id
          JOIN students s ON s.id = ce.student_id
          WHERE ce.status = 'Active'
            AND c.status = 'Active'
            AND COALESCE(ce.curator_id, c.curator_id) = $1
            AND s.id = ANY($2::integer[])
        `,
        [staff.curatorId, studentIds],
      );
      const visibleIds = new Set(visibleStudents.rows.map((row) => Number(row.id)));

      if (studentIds.some((studentId) => !visibleIds.has(studentId))) {
        throw createHttpError(403, "Один или несколько учеников не закреплены за этим куратором.");
      }

      const call = callId
        ? await client.query(
            `
              UPDATE student_calls
              SET title = $2,
                  call_link = $3,
                  starts_at = $4,
                  status = $5,
                  updated_at = NOW()
              WHERE id = $1
                AND curator_id = $6
              RETURNING id
            `,
            [callId, callTitle, callLink || null, startsAt.toISOString(), status, staff.curatorId],
          )
        : await client.query(
            `
              INSERT INTO student_calls (curator_id, title, call_link, starts_at, status)
              VALUES ($1, $2, $3, $4, $5)
              RETURNING id
            `,
            [staff.curatorId, callTitle, callLink || null, startsAt.toISOString(), status],
          );
      const savedCallId = call.rows[0]?.id;

      if (!savedCallId) {
        throw createHttpError(404, "Созвон не найден.");
      }

      if (callId) {
        await client.query("DELETE FROM student_call_participants WHERE call_id = $1", [savedCallId]);
      }

      for (const studentId of studentIds) {
        await client.query(
          `
            INSERT INTO student_call_participants (call_id, student_id)
            VALUES ($1, $2)
            ON CONFLICT (call_id, student_id) DO NOTHING
          `,
          [savedCallId, studentId],
        );
      }

      await client.query("COMMIT");
      response.status(callId ? 200 : 201).json({ ok: true, source: "database", callId: savedCallId });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }),
);

app.post(
  "/api/staff/reviews",
  asyncRoute(async (request, response) => {
    const staff = await getStaffByToken(request);
    const resourceType = cleanText(request.body.resourceType, 30);
    const resourceId = toInt(request.body.resourceId, 0);
    const rating = toInt(request.body.rating, null);
    const commentText = cleanText(request.body.commentText, 1000);

    if (!["Lesson", "Note", "Homework", "Stream"].includes(resourceType) || !resourceId || !rating || rating < 1 || rating > 10) {
      throw createHttpError(400, "Оценка должна быть от 1 до 10.");
    }

    await assertReviewResourceVisible(staff, resourceType, resourceId);

    const result = await dbQuery(
      `
        INSERT INTO staff_resource_reviews (staff_role, staff_id, resource_type, resource_id, rating, comment_text)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (staff_role, staff_id, resource_type, resource_id) DO NOTHING
        RETURNING id
      `,
      [staff.role, staff.staffId, resourceType, resourceId, rating, commentText],
    );

    if (result.rowCount === 0) {
      throw createHttpError(409, "Оценка уже выставлена и находится в архиве.");
    }

    response.status(201).json({ ok: true, source: "database", reviewId: result.rows[0].id });
  }),
);

async function assertReviewResourceVisible(staff, resourceType, resourceId) {
  const scopeId = staffScopeId(staff);
  const scope = courseScopeWhere(staff, "c", 2);
  const courseVisibleScope =
    staff.role === "Teacher"
      ? "(c.teacher_id = $2 OR EXISTS (SELECT 1 FROM course_enrollments ce_scope WHERE ce_scope.course_id = c.id AND ce_scope.status = 'Active' AND ce_scope.teacher_id = $2))"
      : "(c.curator_id = $2 OR EXISTS (SELECT 1 FROM course_enrollments ce_scope WHERE ce_scope.course_id = c.id AND ce_scope.status = 'Active' AND ce_scope.curator_id = $2))";
  const homeworkReviewScope =
    staff.role === "Teacher" ? "COALESCE(ha.teacher_id, ce.teacher_id, c.teacher_id) = $2" : "COALESCE(ce.curator_id, c.curator_id) = $2";
  let query = "";

  if (resourceType === "Lesson") {
    query = `SELECT 1 FROM lessons l JOIN courses c ON c.id = l.course_id WHERE l.id = $1 AND ${courseVisibleScope}`;
  } else if (resourceType === "Note") {
    query = `SELECT 1 FROM notes n JOIN courses c ON c.id = n.course_id WHERE n.id = $1 AND ${courseVisibleScope}`;
  } else if (resourceType === "Stream") {
    query = `SELECT 1 FROM live_streams ls JOIN courses c ON c.id = ls.course_id WHERE ls.id = $1 AND ${courseVisibleScope}`;
  } else {
    query = `
      SELECT 1
      FROM homework_assignments ha
      JOIN homework_templates ht ON ht.id = ha.template_id
      LEFT JOIN course_enrollments ce ON ce.id = ha.enrollment_id
      JOIN courses c ON c.id = ht.course_id
      JOIN homework_submissions hs ON hs.assignment_id = ha.id
      WHERE ha.id = $1
        AND ${homeworkReviewScope}
        AND ha.status = 'Checked'
        AND hs.status = 'Checked'
    `;
  }

  const visible = await dbOne(query, [resourceId, scopeId]);
  if (!visible) {
    throw createHttpError(403, "Материал недоступен для оценки или еще не готов.");
  }
}

app.post(
  "/api/staff/students/:id/comment",
  asyncRoute(async (request, response) => {
    const staff = await getStaffByToken(request);
    const studentId = toInt(request.params.id, 0);
    const commentText = cleanText(request.body.commentText || request.body.comment, 1000);

    if (!studentId || !commentText) {
      throw createHttpError(400, "Нужен комментарий к ученику.");
    }

    const scopeId = staffScopeId(staff);
    const commentScope = staff.role === "Teacher" ? "COALESCE(ce.teacher_id, c.teacher_id) = $2" : "COALESCE(ce.curator_id, c.curator_id) = $2";
    const visible = await dbOne(
      `
        SELECT 1
        FROM course_enrollments ce
        JOIN courses c ON c.id = ce.course_id
        WHERE ce.student_id = $1
          AND ce.status = 'Active'
          AND ${commentScope}
        LIMIT 1
      `,
      [studentId, scopeId],
    );

    if (!visible) {
      throw createHttpError(403, "Ученик не закреплен за этой ролью.");
    }

    const result = await dbQuery(
      `
        INSERT INTO student_staff_comments (student_id, staff_role, staff_id, comment_text)
        VALUES ($1, $2, $3, $4)
        RETURNING id, created_at
      `,
      [studentId, staff.role, staff.staffId, commentText],
    );

    response.status(201).json({ ok: true, source: "database", commentId: result.rows[0].id, createdAt: toDateText(result.rows[0].created_at) });
  }),
);

app.get(
  "/api/messages",
  asyncRoute(async (request, response) => {
    const actor = await getMessageActorFromRequest(request);
    const conversationId = toInt(request.query.conversationId, 0);
    response.json(await getMessagesPayload(actor, conversationId));
  }),
);

app.get(
  "/api/messages/recipients",
  asyncRoute(async (request, response) => {
    const actor = await getMessageActorFromRequest(request);
    response.json({ source: "database", recipients: await getMessageRecipients(actor) });
  }),
);

app.post(
  "/api/messages/start",
  asyncRoute(async (request, response) => {
    const actor = await getMessageActorFromRequest(request);
    const targetRole = cleanText(request.body.targetRole, 30);
    const targetId = toInt(request.body.targetId, 0);

    if (!targetRole || !targetId) {
      throw createHttpError(400, "Выберите, кому написать.");
    }

    const conversation = await findOrCreateConversation(actor, targetRole, targetId);
    response.status(201).json({ ok: true, source: "database", activeConversationId: conversation.conversationId });
  }),
);

app.post(
  "/api/messages",
  asyncRoute(async (request, response) => {
    const actor = await getMessageActorFromRequest(request);
    const conversationId = toInt(request.body.conversationId, 0);
    const messageText = cleanText(request.body.messageText, 2000);

    if (!conversationId || !messageText) {
      throw createHttpError(400, "Выберите чат и введите сообщение.");
    }

    await assertConversationAllowed(actor, conversationId);
    await dbQuery(
      `
        INSERT INTO chat_messages (chat_id, sender_role, sender_name, message_text)
        VALUES ($1, $2, $3, $4)
      `,
      [conversationId, actor.role, actor.name, messageText],
    );

    response.status(201).json({ ok: true, source: "database", activeConversationId: conversationId });
  }),
);

async function getMessageActorFromRequest(request) {
  const staff = await getStaffByToken(request, { required: false });
  if (staff) {
    return { role: staff.role, id: staff.staffId, name: staff.name, staff };
  }

  const student = await getStudentByToken(request, { required: true });
  return { role: "Student", id: student.studentId, name: `${student.firstName} ${student.lastName}`.trim() || student.login, student };
}

async function getMessageRecipients(actor) {
  if (actor.role === "Admin") {
    const result = await dbQuery(
      `
        SELECT 'Teacher' AS "targetRole", id AS "targetId", CONCAT(first_name, ' ', last_name) AS "targetName", 'Преподаватель' AS "recipientGroup", email AS subtitle
        FROM teachers
        WHERE active = TRUE
        UNION ALL
        SELECT 'Curator' AS "targetRole", id AS "targetId", CONCAT(first_name, ' ', last_name) AS "targetName", 'Куратор' AS "recipientGroup", email AS subtitle
        FROM curators
        WHERE active = TRUE
        UNION ALL
        SELECT 'Student' AS "targetRole", id AS "targetId", CONCAT(first_name, ' ', last_name) AS "targetName", 'Ученики' AS "recipientGroup", COALESCE(email, phone, grade::text || ' класс') AS subtitle
        FROM students
        ORDER BY "recipientGroup", "targetName"
      `,
    );
    return result.rows;
  }

  if (actor.role === "Teacher") {
    const result = await dbQuery(
      `
        SELECT 'Admin' AS "targetRole", id AS "targetId", CONCAT(first_name, ' ', last_name) AS "targetName", 'Администратор' AS "recipientGroup", login AS subtitle
        FROM admin_accounts
        UNION ALL
        SELECT DISTINCT 'Student' AS "targetRole", s.id AS "targetId", CONCAT(s.first_name, ' ', s.last_name) AS "targetName", 'Ученики' AS "recipientGroup", c.title AS subtitle
        FROM course_enrollments ce
        JOIN courses c ON c.id = ce.course_id
        JOIN students s ON s.id = ce.student_id
        WHERE ce.status = 'Active'
          AND COALESCE(ce.teacher_id, c.teacher_id) = $1
        ORDER BY "recipientGroup", "targetName"
      `,
      [actor.id],
    );
    return result.rows;
  }

  if (actor.role === "Curator") {
    const result = await dbQuery(
      `
        SELECT 'Admin' AS "targetRole", id AS "targetId", CONCAT(first_name, ' ', last_name) AS "targetName", 'Администратор' AS "recipientGroup", login AS subtitle
        FROM admin_accounts
        UNION ALL
        SELECT DISTINCT 'Student' AS "targetRole", s.id AS "targetId", CONCAT(s.first_name, ' ', s.last_name) AS "targetName", 'Ученики' AS "recipientGroup", c.title AS subtitle
        FROM course_enrollments ce
        JOIN courses c ON c.id = ce.course_id
        JOIN students s ON s.id = ce.student_id
        WHERE ce.status = 'Active'
          AND COALESCE(ce.curator_id, c.curator_id) = $1
        ORDER BY "recipientGroup", "targetName"
      `,
      [actor.id],
    );
    return result.rows;
  }

  const result = await dbQuery(
    `
      SELECT DISTINCT 'Teacher' AS "targetRole", COALESCE(ce.teacher_id, c.teacher_id) AS "targetId", CONCAT(t.first_name, ' ', t.last_name) AS "targetName", 'Преподаватели' AS "recipientGroup", c.title AS subtitle
      FROM course_enrollments ce
      JOIN courses c ON c.id = ce.course_id
      JOIN teachers t ON t.id = COALESCE(ce.teacher_id, c.teacher_id)
      WHERE ce.student_id = $1
        AND ce.status = 'Active'
      UNION ALL
      SELECT DISTINCT 'Curator' AS "targetRole", COALESCE(ce.curator_id, c.curator_id) AS "targetId", CONCAT(cu.first_name, ' ', cu.last_name) AS "targetName", 'Кураторы' AS "recipientGroup", c.title AS subtitle
      FROM course_enrollments ce
      JOIN courses c ON c.id = ce.course_id
      JOIN curators cu ON cu.id = COALESCE(ce.curator_id, c.curator_id)
      WHERE ce.student_id = $1
        AND ce.status = 'Active'
      ORDER BY "recipientGroup", "targetName"
    `,
    [actor.id],
  );
  return result.rows;
}

function getChatShape(actor, targetRole, targetId) {
  if (actor.role === "Admin" && targetRole === "Teacher") {
    return { chatType: "TeacherAdmin", studentId: null, teacherId: targetId, curatorId: null, adminId: actor.id, targetRole };
  }

  if (actor.role === "Admin" && targetRole === "Curator") {
    return { chatType: "CuratorAdmin", studentId: null, teacherId: null, curatorId: targetId, adminId: actor.id, targetRole };
  }

  if (actor.role === "Admin" && targetRole === "Student") {
    return { chatType: "StudentAdmin", studentId: targetId, teacherId: null, curatorId: null, adminId: actor.id, targetRole };
  }

  if (actor.role === "Student" && targetRole === "Admin") {
    return { chatType: "StudentAdmin", studentId: actor.id, teacherId: null, curatorId: null, adminId: targetId, targetRole };
  }

  if (actor.role === "Teacher" && targetRole === "Admin") {
    return { chatType: "TeacherAdmin", studentId: null, teacherId: actor.id, curatorId: null, adminId: targetId, targetRole };
  }

  if (actor.role === "Curator" && targetRole === "Admin") {
    return { chatType: "CuratorAdmin", studentId: null, teacherId: null, curatorId: actor.id, adminId: targetId, targetRole };
  }

  if (actor.role === "Student" && targetRole === "Teacher") {
    return { chatType: "StudentTeacher", studentId: actor.id, teacherId: targetId, curatorId: null, adminId: null, targetRole };
  }

  if (actor.role === "Student" && targetRole === "Curator") {
    return { chatType: "StudentCurator", studentId: actor.id, teacherId: null, curatorId: targetId, adminId: null, targetRole };
  }

  if (actor.role === "Teacher" && targetRole === "Student") {
    return { chatType: "StudentTeacher", studentId: targetId, teacherId: actor.id, curatorId: null, adminId: null, targetRole };
  }

  if (actor.role === "Curator" && targetRole === "Student") {
    return { chatType: "StudentCurator", studentId: targetId, teacherId: null, curatorId: actor.id, adminId: null, targetRole };
  }

  return null;
}

async function getRecipientDetails(actor, targetRole, targetId) {
  const allowed = await getMessageRecipients(actor);
  return allowed.find((item) => item.targetRole === targetRole && Number(item.targetId) === Number(targetId)) || null;
}

async function findOrCreateConversation(actor, targetRole, targetId) {
  const shape = getChatShape(actor, targetRole, targetId);
  const recipient = shape ? await getRecipientDetails(actor, targetRole, targetId) : null;

  if (!shape || !recipient) {
    throw createHttpError(403, "Этот адресат недоступен для чата.");
  }

  const existing = await dbOne(
    `
      SELECT id AS "conversationId"
      FROM chats
      WHERE chat_type = $1
        AND student_id IS NOT DISTINCT FROM $2
        AND teacher_id IS NOT DISTINCT FROM $3
        AND curator_id IS NOT DISTINCT FROM $4
        AND admin_id IS NOT DISTINCT FROM $5
      ORDER BY id
      LIMIT 1
    `,
    [shape.chatType, shape.studentId, shape.teacherId, shape.curatorId, shape.adminId],
  );

  if (existing) {
    return existing;
  }

  const title = `${actor.name || actor.role} · ${recipient.targetName}`;
  const created = await dbOne(
    `
      INSERT INTO chats (student_id, teacher_id, curator_id, admin_id, chat_type, target_role, title)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id AS "conversationId"
    `,
    [shape.studentId, shape.teacherId, shape.curatorId, shape.adminId, shape.chatType, shape.targetRole, title],
  );

  await dbQuery(
    `
      INSERT INTO chat_messages (chat_id, sender_role, sender_name, message_text)
      VALUES ($1, 'System', 'Онлайн-школа', $2)
    `,
    [created.conversationId, `Чат создан: ${actor.name || actor.role} и ${recipient.targetName}.`],
  );

  return created;
}

async function assertConversationAllowed(actor, conversationId) {
  const where =
    actor.role === "Student"
      ? "student_id = $2 AND chat_type IN ('StudentTeacher', 'StudentCurator', 'StudentAdmin')"
      : actor.role === "Teacher"
        ? "teacher_id = $2 AND chat_type IN ('StudentTeacher', 'TeacherAdmin')"
        : actor.role === "Curator"
          ? "curator_id = $2 AND chat_type IN ('StudentCurator', 'CuratorAdmin')"
          : "admin_id = $2 AND chat_type IN ('TeacherAdmin', 'CuratorAdmin', 'StudentAdmin')";
  const row = await dbOne(`SELECT 1 FROM chats WHERE id = $1 AND ${where}`, [conversationId, actor.id]);

  if (!row) {
    throw createHttpError(403, "Чат недоступен.");
  }
}

async function getMessagesPayload(actor, requestedConversationId = 0) {
  const where =
    actor.role === "Student"
      ? "ch.student_id = $1 AND ch.chat_type IN ('StudentTeacher', 'StudentCurator', 'StudentAdmin')"
      : actor.role === "Teacher"
        ? "ch.teacher_id = $1 AND ch.chat_type IN ('StudentTeacher', 'TeacherAdmin')"
        : actor.role === "Curator"
          ? "ch.curator_id = $1 AND ch.chat_type IN ('StudentCurator', 'CuratorAdmin')"
          : "ch.admin_id = $1 AND ch.chat_type IN ('TeacherAdmin', 'CuratorAdmin', 'StudentAdmin')";

  const conversations = await dbQuery(
    `
      SELECT
        ch.id AS "conversationId",
        ch.title,
        ch.chat_type AS "chatType",
        ch.target_role AS "targetRole",
        CONCAT(s.first_name, ' ', s.last_name) AS "studentName",
        CONCAT(t.first_name, ' ', t.last_name) AS "teacherName",
        CONCAT(cu.first_name, ' ', cu.last_name) AS "curatorName",
        CONCAT(a.first_name, ' ', a.last_name) AS "adminName",
        COALESCE(CONCAT(t.first_name, ' ', t.last_name), CONCAT(cu.first_name, ' ', cu.last_name), CONCAT(a.first_name, ' ', a.last_name), CONCAT(s.first_name, ' ', s.last_name)) AS "staffName",
        ch.created_at AS "createdAt",
        MAX(cm.sent_at) AS "lastMessageAt"
      FROM chats ch
      LEFT JOIN students s ON s.id = ch.student_id
      LEFT JOIN teachers t ON t.id = ch.teacher_id
      LEFT JOIN curators cu ON cu.id = ch.curator_id
      LEFT JOIN admin_accounts a ON a.id = ch.admin_id
      LEFT JOIN chat_messages cm ON cm.chat_id = ch.id
      WHERE ${where}
      GROUP BY ch.id, s.id, t.id, cu.id, a.id
      ORDER BY
        CASE ch.chat_type
          WHEN 'TeacherAdmin' THEN 1
          WHEN 'CuratorAdmin' THEN 2
          WHEN 'StudentAdmin' THEN 3
          WHEN 'StudentTeacher' THEN 4
          WHEN 'StudentCurator' THEN 5
          ELSE 5
        END,
        "lastMessageAt" DESC NULLS LAST,
        ch.created_at DESC
    `,
    [actor.id],
  );

  const allowedIds = new Set(conversations.rows.map((row) => Number(row.conversationId)));
  const activeConversationId = allowedIds.has(requestedConversationId) ? requestedConversationId : conversations.rows[0]?.conversationId || null;
  const messages = activeConversationId
    ? await dbQuery(
        `
          SELECT
            id AS "messageId",
            sender_role AS "senderRole",
            sender_name AS "senderName",
            message_text AS "messageText",
            sent_at AS "sentAt"
          FROM chat_messages
          WHERE chat_id = $1
          ORDER BY sent_at, id
        `,
        [activeConversationId],
      )
    : { rows: [] };

  return {
    source: "database",
    activeConversationId,
    recipients: await getMessageRecipients(actor),
    conversations: conversations.rows.map((row) => ({
      ...row,
      createdAt: toDateText(row.createdAt),
      lastMessageAt: toDateText(row.lastMessageAt),
    })),
    messages: messages.rows.map((row) => ({
      ...row,
      sentAt: toDateText(row.sentAt),
      isOwn: row.senderRole === actor.role,
    })),
  };
}

app.use("/api", (_request, response) => {
  response.status(404).json({ ok: false, error: "API route not found", message: "API route not found" });
});

app.use("/assets", express.static(path.join(rootDir, "assets")));
app.get(["/", "/index.html"], (_request, response) => {
  response.sendFile(path.join(rootDir, "index.html"));
});
app.get("/script.js", (_request, response) => {
  response.type("text/javascript").sendFile(path.join(rootDir, "script.js"));
});
app.get("/styles.css", (_request, response) => {
  response.type("text/css").sendFile(path.join(rootDir, "styles.css"));
});
app.get("*", (_request, response) => {
  response.sendFile(path.join(rootDir, "index.html"));
});

app.use((error, _request, response, _next) => {
  const status = Number(error.status || error.statusCode || 500);
  if (status >= 500) {
    console.error(error);
  }
  response.status(status).json({
    ok: false,
    error: error.message || "Server error",
    message: error.message || "Server error",
  });
});

runSchemaAndSeed()
  .catch((error) => {
    databaseBootstrapError = error.message || "Database bootstrap failed.";
    console.error("Database bootstrap failed. The web service will still start; check /api/health and Render environment variables.", error);

    if (String(process.env.STRICT_DB_STARTUP || "false").toLowerCase() === "true") {
      throw error;
    }
  })
  .then(() => {
    app.listen(port, "0.0.0.0", () => {
      console.log(`Yaroslav Tutor School is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Startup failed:", error);
    process.exitCode = 1;
  });
