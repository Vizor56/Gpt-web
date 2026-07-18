# Yaroslav Tutor Academy

Сайт подготовлен к деплою на Render и Neon PostgreSQL.

В проекте теперь есть два режима:

- `server.mjs` - production-сервер на Node.js для Render + Neon.
- `server.ps1` - старая локальная версия под PowerShell + SQL Server, оставлена как запасной вариант.

## Запуск на Render + Neon

1. Создайте новый проект Neon PostgreSQL.
2. Скопируйте строку подключения Neon в формате `postgresql://...?...sslmode=require`.
3. Загрузите проект в GitHub.
4. В Render создайте Web Service из GitHub-репозитория.
5. Так как проект лежит в подпапке репозитория, укажите Root Directory:

```text
Сайт с помощью гпт
```

6. Укажите команды:
   - Build Command: `npm install`
   - Start Command: `npm start`
7. В Environment Variables на Render добавьте:
   - `DATABASE_URL` - строка подключения Neon.
   - `NODE_ENV` - `production`.
   - `AUTO_MIGRATE` - `true`.

Если Root Directory не задавать, команды должны быть такими:

```bash
cd "Сайт с помощью гпт" && npm install
cd "Сайт с помощью гпт" && npm start
```

Используйте `npm`, не `yarn`: в проекте есть `package.json` под npm-команды.

При первом старте сервер сам применит `database/neon-schema.sql` и добавит стартовые курсы, уроки, ДЗ, трансляции, магазин, ученика, преподавателей и кураторов.

## Локальный запуск Node-версии

Нужен Node.js 20+.

```powershell
npm install
Copy-Item .env.example .env
# В .env вставьте DATABASE_URL из Neon
npm start
```

После запуска сайт откроется на:

```text
http://127.0.0.1:8765/
```

Если открыть `index.html` напрямую, фронтенд по-прежнему будет обращаться к API на `http://127.0.0.1:8765`.

## Тестовые аккаунты

Ученик:

```text
student / student123
```

Преподаватели:

```text
teacher / teacher123
teacher_russian / teacher123
teacher_it / teacher123
teacher_physics / teacher123
```

Кураторы:

```text
curator / curator123
curator_maria / curator123
curator_ivan / curator123
```

## Что хранится в Neon

В PostgreSQL создаются таблицы для:

- учеников, аккаунтов и сессий;
- преподавателей и кураторов;
- курсов, уроков, конспектов, ДЗ и трансляций;
- сдачи и проверки домашних заданий;
- прогресса курса и баллов;
- магазина за баллы;
- заявок, поддержки и сообщений;
- оценок материалов кураторами.

Секреты не коммитятся: `.env` добавлен в `.gitignore`.

эта надпись, чтобы рендер задиплоил сайт после изменения
