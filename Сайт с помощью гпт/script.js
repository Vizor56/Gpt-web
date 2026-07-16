const courseData = {
  math: {
    title: "ЕГЭ Математика",
    description: "Уроки, записи, конспекты и домашние задания",
    breadcrumb: "ЕГЭ Математика",
    iconClass: "illustration-math",
    iconSymbol: "#course-math",
    lessonsText: "4 урока",
    progressText: "Прогресс после входа",
    donut: 33,
  },
  russian: {
    title: "ЕГЭ Русский язык",
    description: "Уроки, сочинения, конспекты и домашние задания",
    breadcrumb: "ЕГЭ Русский язык",
    iconClass: "illustration-russian",
    iconSymbol: "#course-russian",
    lessonsText: "4 урока",
    progressText: "Прогресс после входа",
    donut: 38,
  },
  informatics: {
    title: "ЕГЭ Информатика",
    description: "Алгоритмы, программирование, записи и домашние задания",
    breadcrumb: "ЕГЭ Информатика",
    iconClass: "illustration-code",
    iconSymbol: "#course-code",
    lessonsText: "4 урока",
    progressText: "Прогресс после входа",
    donut: 29,
  },
  physics: {
    title: "ЕГЭ Физика",
    description: "Теория, задачи, конспекты и домашние задания",
    breadcrumb: "ЕГЭ Физика",
    iconClass: "illustration-physics",
    iconSymbol: "#course-physics",
    lessonsText: "4 урока",
    progressText: "Прогресс после входа",
    donut: 21,
  },
  english: {
    title: "ЕГЭ Английский язык",
    description: "Грамматика, письмо, аудирование, конспекты и домашние задания",
    breadcrumb: "ЕГЭ Английский язык",
    iconClass: "illustration-russian",
    iconSymbol: "#course-russian",
    lessonsText: "4 урока",
    progressText: "Прогресс после входа",
    donut: 17,
  },
  ogeMath: {
    title: "ОГЭ Математика",
    description: "Алгебра, геометрия, практика задач и домашние задания",
    breadcrumb: "ОГЭ Математика",
    iconClass: "illustration-math",
    iconSymbol: "#course-math",
    lessonsText: "4 урока",
    progressText: "Прогресс после входа",
    donut: 30,
  },
};

const fallbackLessons = {
  math: [
    {
      lessonNumber: 1,
      lessonTitle: "Производная",
      topic: "Понятие производной, правила дифференцирования",
      lessonStatus: "Done",
      videoUrl: null,
      notesUrl: "https://drive.google.com/file/d/1LaFegJ29E7PYwXq1QA4R6mCJtyK70mRo",
      homeworkUrl: "https://example.com/homework/math-derivative.pdf",
      homeworkAssignmentId: 1001,
      homeworkStatus: "Checked",
      homeworkTitle: "ДЗ: Производная",
      submittedHomeworkUrl: "https://drive.google.com/file/d/1t-o_WwgJSQILFXRXWk7w3KZz4uPU1Oew",
      submissionStatus: "Checked",
      homeworkScore: 86,
    },
    {
      lessonNumber: 2,
      lessonTitle: "Первообразная",
      topic: "Неопределенный интеграл, таблица интегралов",
      lessonStatus: "Homework_Check",
      videoUrl: null,
      notesUrl: "https://drive.google.com/file/d/1ADdDBQ22c0DtLXORv-xzJ-yzzqP9R81I",
      homeworkUrl: "https://example.com/homework/math-integral.pdf",
      homeworkAssignmentId: 1002,
      homeworkStatus: "Submitted",
      homeworkTitle: "ДЗ: Первообразная",
      submittedHomeworkUrl: "https://drive.google.com/file/d/1t-o_WwgJSQILFXRXWk7w3KZz4uPU1Oew",
      submissionStatus: "Submitted",
    },
    {
      lessonNumber: 3,
      lessonTitle: "Задачи с параметром",
      topic: "Основные методы решения задач с параметром",
      lessonStatus: "Open",
      videoUrl: null,
      notesUrl: "https://drive.google.com/file/d/1VXR7RgKc0wSFlkqqpOB4MY2mqzo993Zm",
      homeworkUrl: "https://example.com/homework/math-parameters.pdf",
      homeworkAssignmentId: 1003,
      homeworkStatus: "Assigned",
      homeworkTitle: "ДЗ: Задачи с параметром",
    },
    {
      lessonNumber: 4,
      lessonTitle: "Планиметрия",
      topic: "Треугольники, четырехугольники, окружности",
      lessonStatus: "Open",
      videoUrl: null,
      notesUrl: "https://drive.google.com/file/d/1yDKrMTfyM0PbZ3SC2RGo8hVtO-U8i9R1",
      homeworkUrl: null,
    },
  ],
  russian: [
    {
      lessonNumber: 1,
      lessonTitle: "Орфоэпия и ударения",
      topic: "Словник ФИПИ, типичные ловушки задания 4",
      lessonStatus: "Done",
      videoUrl: "https://www.youtube.com/results?search_query=ЕГЭ+русский+орфоэпия+урок",
      notesUrl: "https://drive.google.com/file/d/1aaFkBsvU-IPPm_Z8mFluYvf9CvTfnAxw",
      homeworkUrl: "https://example.com/homework/russian-orthoepy.pdf",
      homeworkAssignmentId: 2001,
      homeworkStatus: "Checked",
      homeworkTitle: "ДЗ: Орфоэпия и ударения",
      submittedHomeworkUrl: "https://drive.google.com/file/d/1t-o_WwgJSQILFXRXWk7w3KZz4uPU1Oew",
      submissionStatus: "Checked",
      homeworkScore: 92,
    },
    {
      lessonNumber: 2,
      lessonTitle: "Паронимы",
      topic: "Различение значений и работа со словарём паронимов",
      lessonStatus: "Homework_Check",
      videoUrl: "https://www.youtube.com/results?search_query=ЕГЭ+русский+паронимы+урок",
      notesUrl: "https://drive.google.com/file/d/1riOofik3Pg38MfSuvP38UEe-gzxGAZzg",
      homeworkUrl: "https://example.com/homework/russian-paronyms.pdf",
      homeworkAssignmentId: 2002,
      homeworkStatus: "Submitted",
      homeworkTitle: "ДЗ: Паронимы",
      submittedHomeworkUrl: "https://drive.google.com/file/d/1t-o_WwgJSQILFXRXWk7w3KZz4uPU1Oew",
      submissionStatus: "Submitted",
    },
    {
      lessonNumber: 3,
      lessonTitle: "Сочинение ЕГЭ",
      topic: "Проблема, комментарий, позиция автора и аргументация",
      lessonStatus: "Open",
      videoUrl: "https://www.youtube.com/results?search_query=ЕГЭ+русский+сочинение+урок",
      notesUrl: "https://drive.google.com/file/d/1xG46l0vexVAfSS2Ora-VIhnkta4W55VB",
      homeworkUrl: "https://example.com/homework/russian-essay.pdf",
      homeworkAssignmentId: 2003,
      homeworkStatus: "Assigned",
      homeworkTitle: "ДЗ: Сочинение ЕГЭ",
    },
    {
      lessonNumber: 4,
      lessonTitle: "Пунктуация в сложном предложении",
      topic: "СПП, БСП и сложные случаи постановки знаков",
      lessonStatus: "Announcement",
      videoUrl: null,
      notesUrl: "https://drive.google.com/file/d/1GQbihWtR5JhrzyvIN2OXPwJNpgYaZVq-",
      homeworkUrl: null,
    },
  ],
  informatics: [
    {
      lessonNumber: 1,
      lessonTitle: "Кодирование информации",
      topic: "Алфавитный подход, объём сообщения, единицы измерения",
      lessonStatus: "Done",
      videoUrl: "https://www.youtube.com/results?search_query=ЕГЭ+информатика+кодирование+информации",
      notesUrl: "https://drive.google.com/file/d/14DJwCAEpiEqjPNsr6sDTTDMxBVI-X8j2",
      homeworkUrl: "https://example.com/homework/it-coding.pdf",
      homeworkAssignmentId: 3001,
      homeworkStatus: "Checked",
      homeworkTitle: "ДЗ: Кодирование информации",
      submittedHomeworkUrl: "https://drive.google.com/file/d/1t-o_WwgJSQILFXRXWk7w3KZz4uPU1Oew",
      submissionStatus: "Checked",
      homeworkScore: 88,
    },
    {
      lessonNumber: 2,
      lessonTitle: "Логические выражения",
      topic: "Таблицы истинности и преобразование логических выражений",
      lessonStatus: "Homework_Check",
      videoUrl: "https://www.youtube.com/results?search_query=ЕГЭ+информатика+логика+урок",
      notesUrl: "https://drive.google.com/file/d/1OWMHfQNNgjC8z-FbY2s0ProsYWVMhWCD",
      homeworkUrl: "https://example.com/homework/it-logic.pdf",
      homeworkAssignmentId: 3002,
      homeworkStatus: "Submitted",
      homeworkTitle: "ДЗ: Логические выражения",
      submittedHomeworkUrl: "https://drive.google.com/file/d/1t-o_WwgJSQILFXRXWk7w3KZz4uPU1Oew",
      submissionStatus: "Submitted",
    },
    {
      lessonNumber: 3,
      lessonTitle: "Python: циклы и условия",
      topic: "Базовые конструкции для задач ЕГЭ",
      lessonStatus: "Open",
      videoUrl: "https://www.youtube.com/results?search_query=ЕГЭ+информатика+Python+циклы+условия",
      notesUrl: "https://drive.google.com/file/d/12VWLzqM_8VF3ak0xGbyNrwmjOWLEJgPy",
      homeworkUrl: "https://example.com/homework/it-python.pdf",
      homeworkAssignmentId: 3003,
      homeworkStatus: "Assigned",
      homeworkTitle: "ДЗ: Python",
    },
    {
      lessonNumber: 4,
      lessonTitle: "Динамическое программирование",
      topic: "Разбор идеи и первые задачи",
      lessonStatus: "Announcement",
      videoUrl: null,
      notesUrl: "https://drive.google.com/file/d/1eCsAogLgzZS_T39AZQNqXxeSXfBYFS3c",
      homeworkUrl: null,
    },
  ],
  physics: [
    {
      lessonNumber: 1,
      lessonTitle: "Кинематика",
      topic: "Равномерное и равноускоренное движение",
      lessonStatus: "Done",
      videoUrl: "https://www.youtube.com/results?search_query=ЕГЭ+физика+кинематика+урок",
      notesUrl: "https://drive.google.com/file/d/1LaFegJ29E7PYwXq1QA4R6mCJtyK70mRo",
      homeworkUrl: "https://example.com/homework/physics-kinematics.pdf",
      homeworkAssignmentId: 4001,
      homeworkStatus: "Checked",
      homeworkTitle: "ДЗ: Кинематика",
      submittedHomeworkUrl: "https://drive.google.com/file/d/1t-o_WwgJSQILFXRXWk7w3KZz4uPU1Oew",
      submissionStatus: "Checked",
      homeworkScore: 84,
    },
    {
      lessonNumber: 2,
      lessonTitle: "Законы Ньютона",
      topic: "Силы, ускорение, движение по окружности",
      lessonStatus: "Homework_Check",
      videoUrl: "https://www.youtube.com/results?search_query=ЕГЭ+физика+законы+Ньютона+урок",
      notesUrl: "https://drive.google.com/file/d/1ADdDBQ22c0DtLXORv-xzJ-yzzqP9R81I",
      homeworkUrl: "https://example.com/homework/physics-newton.pdf",
      homeworkAssignmentId: 4002,
      homeworkStatus: "Submitted",
      homeworkTitle: "ДЗ: Законы Ньютона",
      submittedHomeworkUrl: "https://drive.google.com/file/d/1t-o_WwgJSQILFXRXWk7w3KZz4uPU1Oew",
      submissionStatus: "Submitted",
    },
    {
      lessonNumber: 3,
      lessonTitle: "Электростатика",
      topic: "Закон Кулона, напряжённость, потенциал",
      lessonStatus: "Open",
      videoUrl: "https://www.youtube.com/results?search_query=ЕГЭ+физика+электростатика+урок",
      notesUrl: "https://drive.google.com/file/d/1aaFkBsvU-IPPm_Z8mFluYvf9CvTfnAxw",
      homeworkUrl: "https://example.com/homework/physics-electrostatics.pdf",
      homeworkAssignmentId: 4003,
      homeworkStatus: "Assigned",
      homeworkTitle: "ДЗ: Электростатика",
    },
    {
      lessonNumber: 4,
      lessonTitle: "Оптика",
      topic: "Линзы, зеркала и ход лучей",
      lessonStatus: "Announcement",
      videoUrl: null,
      notesUrl: "https://drive.google.com/file/d/1VXR7RgKc0wSFlkqqpOB4MY2mqzo993Zm",
      homeworkUrl: null,
    },
  ],
  english: [
    {
      lessonNumber: 1,
      lessonTitle: "Tenses",
      topic: "Времена английского языка в заданиях ЕГЭ",
      lessonStatus: "Done",
      videoUrl: "https://www.youtube.com/results?search_query=ЕГЭ+английский+tenses+урок",
      notesUrl: "https://drive.google.com/file/d/1ADdDBQ22c0DtLXORv-xzJ-yzzqP9R81I",
      homeworkUrl: "https://example.com/homework/english-tenses.pdf",
      homeworkAssignmentId: 5001,
      homeworkStatus: "Submitted",
      homeworkTitle: "ДЗ: Tenses",
      submittedHomeworkUrl: "https://drive.google.com/file/d/1t-o_WwgJSQILFXRXWk7w3KZz4uPU1Oew",
      submissionStatus: "Submitted",
    },
    {
      lessonNumber: 2,
      lessonTitle: "Письмо другу",
      topic: "Структура письма, клише и типичные ошибки",
      lessonStatus: "Open",
      videoUrl: "https://www.youtube.com/results?search_query=ЕГЭ+английский+письмо+урок",
      notesUrl: "https://drive.google.com/file/d/1aaFkBsvU-IPPm_Z8mFluYvf9CvTfnAxw",
      homeworkUrl: "https://example.com/homework/english-letter.pdf",
      homeworkAssignmentId: 5002,
      homeworkStatus: "Assigned",
      homeworkTitle: "ДЗ: Письмо другу",
    },
    {
      lessonNumber: 3,
      lessonTitle: "Аудирование",
      topic: "Стратегии работы с аудио и ключевыми словами",
      lessonStatus: "Announcement",
      videoUrl: null,
      notesUrl: "https://drive.google.com/file/d/1xG46l0vexVAfSS2Ora-VIhnkta4W55VB",
      homeworkUrl: null,
    },
  ],
  ogeMath: [
    {
      lessonNumber: 1,
      lessonTitle: "Проценты и доли",
      topic: "Задачи на проценты, скидки и смеси",
      lessonStatus: "Done",
      videoUrl: "https://www.youtube.com/results?search_query=ОГЭ+математика+проценты+урок",
      notesUrl: "https://drive.google.com/file/d/1LaFegJ29E7PYwXq1QA4R6mCJtyK70mRo",
      homeworkUrl: "https://example.com/homework/oge-math-percent.pdf",
      homeworkAssignmentId: 6001,
      homeworkStatus: "Checked",
      homeworkTitle: "ДЗ: Проценты и доли",
      submittedHomeworkUrl: "https://drive.google.com/file/d/1t-o_WwgJSQILFXRXWk7w3KZz4uPU1Oew",
      submissionStatus: "Checked",
      homeworkScore: 90,
    },
    {
      lessonNumber: 2,
      lessonTitle: "Уравнения",
      topic: "Линейные и квадратные уравнения",
      lessonStatus: "Open",
      videoUrl: "https://www.youtube.com/results?search_query=ОГЭ+математика+уравнения+урок",
      notesUrl: "https://drive.google.com/file/d/1riOofik3Pg38MfSuvP38UEe-gzxGAZzg",
      homeworkUrl: "https://example.com/homework/oge-math-equations.pdf",
      homeworkAssignmentId: 6002,
      homeworkStatus: "Assigned",
      homeworkTitle: "ДЗ: Уравнения",
    },
    {
      lessonNumber: 3,
      lessonTitle: "Геометрия: треугольники",
      topic: "Признаки равенства, площади и углы",
      lessonStatus: "Open",
      videoUrl: null,
      notesUrl: "https://drive.google.com/file/d/1GQbihWtR5JhrzyvIN2OXPwJNpgYaZVq-",
      homeworkUrl: null,
    },
  ],
};

const fallbackStreams = [
  {
    streamId: "fallback-math-1",
    courseSlug: "math",
    courseTitle: "ЕГЭ Математика",
    lessonNumber: 3,
    streamTitle: "Разбор задач с параметром",
    startsAt: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(),
    streamLink: "https://example.com/live/math-parameters",
    status: "Planned",
  },
  {
    streamId: "fallback-russian-1",
    courseSlug: "russian",
    courseTitle: "ЕГЭ Русский язык",
    lessonNumber: 3,
    streamTitle: "Практикум по сочинению",
    startsAt: new Date(Date.now() + 1000 * 60 * 60 * 28).toISOString(),
    streamLink: "https://example.com/live/russian-essay",
    status: "Planned",
  },
  {
    streamId: "fallback-informatics-1",
    courseSlug: "informatics",
    courseTitle: "ЕГЭ Информатика",
    lessonNumber: 3,
    streamTitle: "Python: разбор типовых задач",
    startsAt: new Date(Date.now() + 1000 * 60 * 60 * 52).toISOString(),
    streamLink: "https://example.com/live/python",
    status: "Planned",
  },
];

const statusMeta = {
  Done: { label: "Пройден", className: "status-done", icon: "#icon-clock" },
  Homework_Check: { label: "ДЗ на проверке", className: "status-check", icon: "#icon-clock" },
  Open: { label: "Открыт", className: "status-open", icon: "#icon-play" },
  Announcement: { label: "Анонс", className: "status-soon", icon: "#icon-megaphone" },
  Soon: { label: "Скоро", className: "status-soon", icon: "#icon-clock" },
};

const pages = document.querySelectorAll("[data-page]");
const openHomeControls = document.querySelectorAll("[data-open-home]");
const openStudyControls = document.querySelectorAll("[data-open-study]");
const openLibraryControls = document.querySelectorAll("[data-open-library]");
const openSupportControls = document.querySelectorAll("[data-open-support]");
const openAccountControls = document.querySelectorAll("[data-open-account]");
const openPointsControls = document.querySelectorAll("[data-open-points]");
const openMessagesControls = document.querySelectorAll("[data-open-messages]");
const courseCards = document.querySelectorAll("[data-course]");
const studyCourseCards = document.querySelectorAll("#course-grid [data-course]");
const courseGrid = document.querySelector("#course-grid");
const courseActionButtons = document.querySelectorAll("[data-course-action]");
const courseViewButtons = document.querySelectorAll("[data-course-view]");
const coursePanels = document.querySelectorAll("[data-course-panel]");
const tabs = document.querySelectorAll(".tab");
const sideLinks = document.querySelectorAll(".side-link");
const profileName = document.querySelector("#profile-name");
const profileAvatar = document.querySelector(".profile-button .avatar--student");
const profilePetPreview = document.querySelector("#profile-pet-preview");
const notificationButton = document.querySelector(".notification-button");
const detailIcon = document.querySelector("#detail-icon");
const detailTitle = document.querySelector("#detail-title");
const detailDescription = document.querySelector("#detail-description");
const detailLessons = document.querySelector("#detail-lessons");
const detailProgressText = document.querySelector("#detail-progress-text");
const breadcrumbCourse = document.querySelector("#breadcrumb-course");
const donut = document.querySelector(".donut");
const lessonList = document.querySelector("#lesson-list");
const homeworkList = document.querySelector("#homework-list");
const notesList = document.querySelector("#notes-list");
const courseStreamList = document.querySelector("#course-stream-list");
const homeStreamList = document.querySelector("#home-stream-list");
const studyStreamList = document.querySelector("#study-stream-list");
const detailNextStream = document.querySelector("#detail-next-stream");
const detailCuratorName = document.querySelector("#detail-curator-name");
const detailCuratorButton = document.querySelector("#detail-curator-message");
const libraryNotesList = document.querySelector("#library-notes-list");
const libraryCount = document.querySelector("#library-count");
const applicationForm = document.querySelector("#application-form");
const applicationStatus = document.querySelector("#application-status");
const supportForm = document.querySelector("#support-form");
const supportStatus = document.querySelector("#support-status");
const homeworkModal = document.querySelector("#homework-modal");
const homeworkModalStatus = document.querySelector("#homework-modal-status");
const homeworkModalTitle = document.querySelector("#homework-modal-title");
const homeworkModalDescription = document.querySelector("#homework-modal-description");
const homeworkModalMeta = document.querySelector("#homework-modal-meta");
const homeworkModalActions = document.querySelector("#homework-modal-actions");
const closeHomeworkButtons = document.querySelectorAll("[data-close-homework]");
const accountStudentName = document.querySelector("#account-student-name");
const accountStudentMeta = document.querySelector("#account-student-meta");
const accountPointsTotal = document.querySelector("#account-points-total");
const accountPageTitle = document.querySelector("#account-page-title");
const accountPageDescription = document.querySelector("#account-page-description");
const accountProgressSummary = document.querySelector("#account-progress-summary");
const accountCourseProgressList = document.querySelector("#account-course-progress-list");
const accountFriendsList = document.querySelector("#account-friends-list");
const accountProfileSections = document.querySelectorAll("[data-account-profile-section]");
const authStatus = document.querySelector("#auth-status");
const accountSideColumn = document.querySelector(".account-page .right-column");
const accountSummaryPanel = document.querySelector(".account-summary-panel");
const accountSessionStatus = document.querySelector("#account-session-status");
const accountProfileStatus = document.querySelector("#account-profile-status");
const accountTabs = document.querySelectorAll("[data-account-tab]");
const accountPanels = document.querySelectorAll("[data-account-panel]");
const accountAchievementsSummary = document.querySelector("#account-achievements-summary");
const accountAchievementsList = document.querySelector("#account-achievements-list");
const loginForm = document.querySelector("#login-form");
const registerForm = document.querySelector("#register-form");
const authDivider = document.querySelector(".auth-divider");
const logoutButton = document.querySelector("#logout-button");
const studyPointsBalance = document.querySelector("#study-points-balance");
const studyPointsToNext = document.querySelector("#study-points-to-next");
const shopBalance = document.querySelector("#shop-balance");
const shopItemsList = document.querySelector("#shop-items-list");
const capybaraPreview = document.querySelector("#capybara-preview");
const staffLoginForm = document.querySelector("#staff-login-form");
const staffLogoutButton = document.querySelector("#staff-logout-button");
const staffAuthStatus = document.querySelector("#staff-auth-status");
const staffSessionStatus = document.querySelector("#staff-session-status");
const conversationList = document.querySelector("#conversation-list");
const messageList = document.querySelector("#message-list");
const messageForm = document.querySelector("#message-form");
const messageStatus = document.querySelector("#message-status");
const messagesRefreshButton = document.querySelector("#messages-refresh-button");
const messageThreadTitle = document.querySelector("#message-thread-title");
const messageThreadRole = document.querySelector("#message-thread-role");

let currentCourseKey = "math";
let currentCourseView = "lessons";
let currentCourseAccess = null;
let currentLessons = getFallbackLessons("math");
let libraryLoaded = false;
let libraryAccessKey = "";
let currentAccount = readStoredAccount();
let currentStaff = readStoredStaff();
let latestAccount = null;
let latestShop = null;
let latestMessages = null;
let latestStaffWorkspace = null;
let currentConversationId = null;
let currentMessageFilter = "all";
let activeStreamChatId = null;
let streamsLoaded = false;
let latestGlobalStreams = [];
let latestCourseStreams = [];
let latestStudentCalls = [];
let currentStaffPage = "messages";
let staffFilters = {};
let staffDrilldownState = {};
let latestNotificationItems = [];
let notificationPanelOpen = false;
let currentAccountTab = "progress";
let currentAccountMode = "profile";
let currentShopSection = "all";
let currentStaffShopSection = "all";

function readAccountCookie() {
  let cookie = "";

  try {
    cookie = document.cookie
      .split("; ")
      .find((item) => item.startsWith("tutor-current-account="));
  } catch (error) {
    return null;
  }

  if (!cookie) {
    return null;
  }

  try {
    return JSON.parse(decodeURIComponent(cookie.split("=").slice(1).join("=")));
  } catch (error) {
    return null;
  }
}

function writeAccountCookie(account) {
  try {
    const compactAccount = {
      student: account?.student || null,
      account: account?.account || null,
      pointsTotal: account?.pointsTotal || 0,
    };
    const value = encodeURIComponent(JSON.stringify(compactAccount));
    document.cookie = `tutor-current-account=${value}; max-age=${60 * 60 * 24 * 30}; path=/; SameSite=Lax`;
  } catch (error) {
  }
}

function clearAccountCookie() {
  try {
    document.cookie = "tutor-current-account=; max-age=0; path=/; SameSite=Lax";
  } catch (error) {
  }
}

function readStoredAccount() {
  try {
    const raw = localStorage.getItem("tutor-current-account");
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (error) {
  }

  return readAccountCookie();
}

function saveStoredAccount(account) {
  currentAccount = account;
  writeAccountCookie(account);

  try {
    localStorage.setItem("tutor-current-account", JSON.stringify(account));
  } catch (error) {
    console.info("Не удалось сохранить аккаунт локально.", error);
  }
}

function clearStoredAccount() {
  currentAccount = null;
  clearAccountCookie();

  try {
    localStorage.removeItem("tutor-current-account");
  } catch (error) {
    console.info("Не удалось очистить аккаунт локально.", error);
  }
}

function readStoredStaff() {
  try {
    const raw = localStorage.getItem("tutor-current-staff");
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function saveStoredStaff(staff) {
  currentStaff = staff;

  try {
    localStorage.setItem("tutor-current-staff", JSON.stringify(staff));
  } catch (error) {
    console.info("Не удалось сохранить вход команды локально.", error);
  }
}

function clearStoredStaff() {
  currentStaff = null;

  try {
    localStorage.removeItem("tutor-current-staff");
  } catch (error) {
    console.info("Не удалось очистить вход команды локально.", error);
  }
}

function getCurrentStudentId() {
  const studentId = Number(currentAccount?.student?.studentId);
  return hasAuthenticatedAccount() && Number.isFinite(studentId) && studentId > 0 ? studentId : 0;
}

function getCurrentAuthToken() {
  return currentAccount?.account?.authToken || currentAccount?.authToken || "";
}

function getCurrentLogin(account = latestAccount || currentAccount) {
  return account?.account?.login || account?.login || "";
}

function hasAuthenticatedStaff(staff = currentStaff) {
  const staffId = Number(staff?.staff?.staffId);
  const authToken = staff?.staff?.authToken || "";
  const role = staff?.staff?.role || staff?.role || "";
  return Number.isFinite(staffId) && staffId > 0 && Boolean(authToken) && Boolean(role);
}

function hasAuthenticatedAccount(account = currentAccount) {
  const studentId = Number(account?.student?.studentId);
  const authToken = account?.account?.authToken || account?.authToken || "";
  return Number.isFinite(studentId) && studentId > 0 && Boolean(authToken);
}

function getStudentFullName(student) {
  const fullName = [student?.firstName, student?.lastName].filter(Boolean).join(" ").trim();
  return fullName || "";
}

function formatNumber(value) {
  return new Intl.NumberFormat("ru-RU").format(Number(value) || 0);
}

function formatPercent(value) {
  const percent = Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
  return `${percent}%`;
}

function getLessonWord(count) {
  const normalized = Math.abs(Number(count) || 0) % 100;
  const lastDigit = normalized % 10;

  if (normalized > 10 && normalized < 20) {
    return "уроков";
  }

  if (lastDigit === 1) {
    return "урок";
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return "урока";
  }

  return "уроков";
}

function getLessonGenitiveWord(count) {
  const normalized = Math.abs(Number(count) || 0) % 100;
  const lastDigit = normalized % 10;

  if (normalized > 10 && normalized < 20) {
    return "уроков";
  }

  if (lastDigit === 1) {
    return "урока";
  }

  return "уроков";
}

function getFallbackLessonCount(courseKey) {
  return (fallbackLessons[courseKey] || fallbackLessons.math).length;
}

function updateCourseCardLessonCount(card, count) {
  const lessonButton = card.querySelector("[data-course-action='lessons']");
  const lessonCount = Number(count) || getFallbackLessonCount(card.dataset.course);

  if (lessonButton) {
    lessonButton.innerHTML = `<svg><use href="#icon-play" /></svg>${lessonCount} ${getLessonWord(lessonCount)}`;
  }

  document.querySelectorAll(`.home-course-list [data-course="${card.dataset.course}"] small`).forEach((label) => {
    label.textContent = `${lessonCount} ${getLessonWord(lessonCount)}`;
  });
}

function createApiHeaders(headers = {}) {
  const result = new Headers(headers);
  const studentId = getCurrentStudentId();

  if (studentId > 0) {
    result.set("X-Student-Id", String(studentId));
  }

  const authToken = getCurrentAuthToken();

  if (authToken) {
    result.set("X-Auth-Token", authToken);
  }

  if (hasAuthenticatedStaff()) {
    result.set("X-Staff-Id", String(currentStaff.staff.staffId));
    result.set("X-Staff-Role", currentStaff.staff.role);
    result.set("X-Staff-Auth-Token", currentStaff.staff.authToken);
  }

  return result;
}

function buildApiUrl(url) {
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  const apiOrigin = window.location.protocol === "file:" ? "http://127.0.0.1:8765" : "";

  if (!apiOrigin) {
    return url;
  }

  return url.startsWith("/") ? `${apiOrigin}${url}` : `${apiOrigin}/${url}`;
}

function apiFetch(url, options = {}) {
  return fetch(buildApiUrl(url), {
    ...options,
    headers: createApiHeaders(options.headers),
  });
}

function showPage(pageName) {
  document.querySelectorAll("[data-page]").forEach((page) => {
    const isCurrent = page.dataset.page === pageName;
    page.classList.toggle("is-hidden", !isCurrent);
    page.setAttribute("aria-hidden", String(!isCurrent));
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setActiveNav(pageName) {
  sideLinks.forEach((link) => {
    const isHome = pageName === "home" && Boolean(link.dataset.openHome);
    const isStudy = pageName === "study" && Boolean(link.dataset.openStudy);
    const isMessages = pageName === "messages" && Boolean(link.dataset.openMessages);
    const isLibrary = pageName === "library" && Boolean(link.dataset.openLibrary);
    const isSupport = pageName === "support" && Boolean(link.dataset.openSupport);
    const isAccount = pageName === "account" && Boolean(link.dataset.openAccount);
    const isPoints = pageName === "points" && Boolean(link.dataset.openPoints);
    link.classList.toggle("is-active", isHome || isStudy || isMessages || isLibrary || isSupport || isAccount || isPoints);
  });
}

function setApplicationStatus(message, type = "") {
  if (!applicationStatus) {
    return;
  }

  applicationStatus.textContent = message;
  applicationStatus.className = `application-status${type ? ` is-${type}` : ""}`;
}

function setSupportStatus(message, type = "") {
  if (!supportStatus) {
    return;
  }

  supportStatus.textContent = message;
  supportStatus.className = `application-status${type ? ` is-${type}` : ""}`;
}

function openHome() {
  showPage("home");
  setActiveNav("home");
  history.replaceState(null, "", "#home");
  loadStreams();
}

function setActiveStudyNav() {
  setActiveNav("study");
}

function openLibrary() {
  showPage("library");
  setActiveNav("library");
  history.replaceState(null, "", "#library");
  loadNotesLibrary();
}

function openSupport() {
  showPage("support");
  setActiveNav("support");
  history.replaceState(null, "", "#support");
}

function openMessages() {
  if (hasAuthenticatedStaff()) {
    openStaffPage("messages");
    return;
  }

  showPage("messages");
  setActiveNav("messages");
  history.replaceState(null, "", "#messages");
  loadMessages();
}

function openAccount() {
  if (isStaffMode()) {
    openStaffPage("account");
    return;
  }

  showPage("account");
  setAccountMode("profile");
  setActiveNav("account");
  history.replaceState(null, "", "#account");
  loadAccount();
  loadAccountFriends();
}

function openPoints() {
  if (isStaffMode()) {
    openStaffPage("points");
    return;
  }

  showPage("account");
  setAccountMode("points");
  setActiveNav("points");
  history.replaceState(null, "", "#points");
  loadAccount();
  loadShop();
}

function setStudyTab(tabName = "owned") {
  if (!hasAuthenticatedAccount() && tabName === "owned") {
    tabName = "all";
  }

  courseGrid?.setAttribute("data-active-tab", tabName);

  tabs.forEach((item) => {
    const isActive = item.dataset.tab === tabName;
    item.classList.toggle("is-active", isActive);
    item.setAttribute("aria-selected", String(isActive));
  });

  studyCourseCards.forEach((card) => {
    const isCatalogOnly = card.dataset.catalog === "true";
    const isNotOwned = card.dataset.owned === "false";
    const isHidden = tabName !== "all" && (isCatalogOnly || isNotOwned);
    card.classList.toggle("is-hidden", isHidden);
    card.setAttribute("aria-hidden", String(isHidden));
  });
}

function setAccountMode(mode = "profile") {
  currentAccountMode = mode === "points" ? "points" : "profile";
  const isPointsMode = currentAccountMode === "points";
  document.querySelector('[data-page="account"]')?.classList.toggle("is-points-mode", isPointsMode);

  if (accountPageTitle) {
    accountPageTitle.textContent = isPointsMode ? "Баллы" : "Аккаунт";
  }

  if (accountPageDescription) {
    accountPageDescription.textContent = isPointsMode ? "Магазин профиля и достижения" : "Профиль, прогресс, статус и друзья";
  }

  if (accountSummaryPanel) {
    accountSummaryPanel.classList.toggle("is-hidden", isPointsMode);
  }

  if (accountSideColumn) {
    accountSideColumn.classList.toggle("is-hidden", isPointsMode);
  }

  accountProfileSections.forEach((section) => {
    section.classList.toggle("is-hidden", isPointsMode);
    section.setAttribute("aria-hidden", String(isPointsMode));
  });

  const visibleTabs = isPointsMode ? new Set(["shop", "achievements"]) : new Set();
  accountTabs.forEach((tab) => {
    const visible = visibleTabs.has(tab.dataset.accountTab || "");
    tab.classList.toggle("is-hidden", !visible);
    tab.setAttribute("aria-hidden", String(!visible));
  });

  document.querySelector(".account-tabs")?.classList.toggle("is-hidden", !isPointsMode);

  if (isPointsMode) {
    setAccountTab(currentAccountTab === "achievements" ? "achievements" : "shop");
    return;
  }

  accountPanels.forEach((panel) => {
    const isProgress = panel.dataset.accountPanel === "progress";
    panel.classList.toggle("is-hidden", !isProgress);
    panel.setAttribute("aria-hidden", String(!isProgress));
  });
  currentAccountTab = "progress";
}

function setAccountTab(tabName = "progress") {
  if (currentAccountMode === "profile") {
    tabName = "progress";
  } else if (!["shop", "achievements"].includes(tabName)) {
    tabName = "shop";
  }

  currentAccountTab = tabName;

  accountTabs.forEach((item) => {
    const isActive = item.dataset.accountTab === tabName;
    item.classList.toggle("is-active", isActive);
    item.setAttribute("aria-selected", String(isActive));
  });

  accountPanels.forEach((panel) => {
    const isActive = panel.dataset.accountPanel === tabName;
    panel.classList.toggle("is-hidden", !isActive);
    panel.setAttribute("aria-hidden", String(!isActive));
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function looksLikeMojibake(value) {
  const text = String(value || "");

  if (!text) {
    return false;
  }

  const suspiciousPairs = text.match(/[РС][\u00a0-\u00bf\u0400-\u045f]/g) || [];
  return suspiciousPairs.length >= 3 || /(?:Рџ|Р”|РЈ|Рќ|РЎ|СЂ|СЃ|С‚|СЊ|в„–)/.test(text);
}

function cleanDisplayText(value, fallback = "") {
  const text = String(value || "").trim();

  if (!text || looksLikeMojibake(text)) {
    return fallback;
  }

  return text;
}

function getHomeworkDisplayTitle(item = {}, fallback = "Домашнее задание") {
  const lessonTitle = cleanDisplayText(item.lessonTitle, "");
  const fallbackTitle = lessonTitle ? `ДЗ: ${lessonTitle}` : fallback;
  return cleanDisplayText(item.homeworkTitle || item.homeworkName, fallbackTitle);
}

function getHomeworkDisplayDescription(item = {}, fallback = "") {
  return cleanDisplayText(item.homeworkDescription, cleanDisplayText(item.topic || item.lessonTitle, fallback));
}

function normalizeAccountCourse(course) {
  const courseSlug = course.courseSlug || course.Course_Slug;
  const fallback = courseData[courseSlug] || {};
  const homeworkTotal = Number(course.homeworkTotal ?? 0);
  const homeworkSubmitted = Number(course.homeworkSubmitted ?? 0);
  const homeworkChecked = Number(course.homeworkChecked ?? 0);
  const progressPercent = Number(course.progressPercent ?? 0);
  const lessons = (course.lessons || [])
    .filter(Boolean)
    .map((lesson) => ({
      lessonId: lesson.lessonId ?? null,
      lessonNumber: Number(lesson.lessonNumber ?? 0),
      lessonTitle: lesson.lessonTitle || "Урок",
      lessonStatus: lesson.lessonStatus || "Open",
      watchPercent: Number(lesson.watchPercent ?? 0),
      isCompleted: Boolean(lesson.isCompleted),
      completedAt: lesson.completedAt || null,
    }));
  const lessonsTotal = Number(course.lessonsTotal ?? course.totalLessons ?? fallback.totalLessons ?? lessons.length ?? 0);
  const lessonsCompleted = Number(course.lessonsCompleted ?? lessons.filter((lesson) => lesson.isCompleted).length);

  return {
    ...course,
    courseSlug,
    courseTitle: course.courseTitle || course.courseName || fallback.title || "Курс",
    curatorId: course.curatorId ?? course.courseCuratorId ?? null,
    curatorName: course.curatorName ?? course.courseCuratorName ?? "",
    totalLessons: Number(course.totalLessons ?? fallback.totalLessons ?? lessonsTotal),
    lessonsTotal,
    lessonsCompleted,
    lessons,
    isOwned: Boolean(course.isOwned),
    homeworkTotal,
    homeworkSubmitted,
    homeworkChecked,
    progressPercent: Math.max(0, Math.min(100, progressPercent)),
    pointsEarned: Number(course.pointsEarned ?? 0),
  };
}

function getAccountCourses(account = latestAccount || currentAccount) {
  return (account?.courses || []).map(normalizeAccountCourse);
}

function getAccountCourse(courseKey) {
  return getAccountCourses().find((course) => course.courseSlug === courseKey);
}

function updateProfileSummary(account = latestAccount) {
  const name = getStudentFullName(account?.student);
  const login = getCurrentLogin(account);
  const hasSession = Boolean(account?.account?.authToken);

  if (profileName && !isStaffMode()) {
    profileName.textContent = name;
  }

  if (profileAvatar && hasSession && !isStaffMode()) {
    profileAvatar.classList.add("has-pet-avatar");
  }

  if (accountStudentName) {
    accountStudentName.textContent = name;
  }

  if (accountStudentMeta) {
    const grade = account?.student?.grade ? `${account.student.grade} класс` : "Класс не указан";
    const phone = account?.student?.phone ? ` · ${account.student.phone}` : "";
    const loginText = login ? ` · логин: ${login}` : "";
    accountStudentMeta.textContent = `${grade}${phone}${loginText}`;
  }

  if (accountSessionStatus) {
    accountSessionStatus.classList.toggle("is-active", hasSession);
    accountSessionStatus.innerHTML = hasSession
      ? `<span>Вы вошли как <strong>${escapeHtml(login || name)}</strong></span>`
      : `<span>Вы пока не вошли. Первый урок каждого курса открыт для просмотра.</span>`;
  }

  if (accountProfileStatus) {
    const activeBadge = account?.student?.activeBadge || null;
    const activeBadgeMarkup = renderProfileBadgeMarkup(activeBadge, "profile-status-badge");
    accountProfileStatus.innerHTML = hasSession
      ? `
        <div class="profile-status-card">
          <span>Статус: <strong>${escapeHtml(getProfileStatusLabel(account?.student?.profileStatus))}</strong></span>
          ${activeBadgeMarkup || `<span class="resource-chip is-muted">Плашка не выбрана</span>`}
        </div>
        ${renderProfileStatusForm(account?.student?.profileStatus || "focused")}
      `
      : "";
  }

  if (logoutButton) {
    logoutButton.classList.toggle("is-hidden", !hasSession);
  }

  if (loginForm) {
    loginForm.classList.toggle("is-hidden", hasSession);
  }

  if (registerForm) {
    registerForm.classList.toggle("is-hidden", hasSession);
  }

  if (authDivider) {
    authDivider.classList.toggle("is-hidden", hasSession);
  }
}

function updatePointsPanels(account = latestAccount) {
  const points = Number(account?.pointsTotal ?? 0);
  const nextLevel = Math.ceil((points + 1) / 500) * 500;
  const toNext = Math.max(0, nextLevel - points);
  const levelProgress = Math.max(8, Math.min(100, Math.round(((points % 500) / 500) * 100)));

  if (accountPointsTotal) {
    accountPointsTotal.textContent = formatNumber(points);
  }

  if (studyPointsBalance) {
    studyPointsBalance.textContent = formatNumber(points);
  }

  if (studyPointsToNext) {
    studyPointsToNext.textContent = `${formatNumber(toNext)} баллов`;
  }

  document.querySelectorAll(".level-track span").forEach((track) => {
    track.style.width = `${levelProgress}%`;
  });
}

function applyGuestUi(message = "Войдите или создайте аккаунт, чтобы видеть личный прогресс.") {
  latestAccount = null;

  if (profileName && !isStaffMode()) {
    profileName.textContent = "Гость";
  }

  resetProfilePetAvatar();

  if (accountStudentName) {
    accountStudentName.textContent = "Войдите в аккаунт";
  }

  if (accountStudentMeta) {
    accountStudentMeta.textContent = "После входа здесь появятся имя, класс, купленные курсы и прогресс.";
  }

  if (accountPointsTotal) {
    accountPointsTotal.textContent = "—";
  }

  if (studyPointsBalance) {
    studyPointsBalance.textContent = "—";
  }

  if (studyPointsToNext) {
    studyPointsToNext.textContent = "после входа";
  }

  document.querySelectorAll(".level-track span").forEach((track) => {
    track.style.width = "0%";
  });

  if (accountProgressSummary) {
    accountProgressSummary.textContent = "Личный прогресс доступен после входа.";
  }

  if (accountCourseProgressList) {
    accountCourseProgressList.innerHTML = `<div class="resource-empty">${escapeHtml(message)}</div>`;
  }

  renderAccountFriends(null);

  if (accountSessionStatus) {
    accountSessionStatus.classList.remove("is-active");
    accountSessionStatus.innerHTML = `<span>Вы пока не вошли. Первый урок каждого курса открыт для просмотра.</span>`;
  }

  if (accountProfileStatus) {
    accountProfileStatus.innerHTML = "";
  }

  if (logoutButton) {
    logoutButton.classList.add("is-hidden");
  }

  if (loginForm) {
    loginForm.classList.remove("is-hidden");
  }

  if (registerForm) {
    registerForm.classList.remove("is-hidden");
  }

  if (authDivider) {
    authDivider.classList.remove("is-hidden");
  }

  renderShopEmpty("Войдите в аккаунт, чтобы покупать одежду для капибары.");

  applyAccountToCourseCards(null);
  renderGlobalNotifications();
}

function ensureOwnedBadge(card, isOwned, isPreview = false) {
  let badge = card.querySelector(".course-badge--owned");
  let lockedBadge = card.querySelector(".course-badge--locked");
  let previewBadge = card.querySelector(".course-badge--preview");

  if (isOwned && !badge) {
    badge = document.createElement("span");
    badge.className = "course-badge course-badge--owned";
    badge.textContent = "Куплен";
    card.prepend(badge);
  }

  if (badge) {
    badge.classList.toggle("is-hidden", !isOwned);
  }

  if (isPreview && !previewBadge) {
    previewBadge = document.createElement("span");
    previewBadge.className = "course-badge course-badge--preview";
    previewBadge.textContent = "1 урок открыт";
    card.prepend(previewBadge);
  }

  if (previewBadge) {
    previewBadge.classList.toggle("is-hidden", !isPreview);
  }

  if (!isOwned && !isPreview && !lockedBadge) {
    lockedBadge = document.createElement("span");
    lockedBadge.className = "course-badge course-badge--locked";
    lockedBadge.textContent = "Не куплен";
    card.prepend(lockedBadge);
  }

  if (lockedBadge) {
    lockedBadge.classList.toggle("is-hidden", isOwned || isPreview);
  }
}

function applyAccountToCourseCards(account = latestAccount) {
  const courses = new Map(getAccountCourses(account).map((course) => [course.courseSlug, course]));
  const hasSession = hasAuthenticatedAccount(account);

  studyCourseCards.forEach((card) => {
    const courseKey = card.dataset.course;
    const accountCourse = courses.get(courseKey);
    const isOwned = hasSession && Boolean(accountCourse?.isOwned);
    const isPreview = !isOwned;
    const lessonCount = accountCourse?.lessonsTotal || getFallbackLessonCount(courseKey);

    card.dataset.owned = isOwned ? "true" : "false";
    card.classList.toggle("course-card--locked", !isOwned);
    card.setAttribute(
      "aria-label",
      isOwned || isPreview ? `Открыть курс ${courseData[courseKey]?.title || courseKey}` : `Курс ${courseData[courseKey]?.title || courseKey} не куплен`,
    );
    card.querySelectorAll(".course-actions button").forEach((button) => {
      const isLessonsButton = button.dataset.courseAction === "lessons";
      button.disabled = !isOwned && !isLessonsButton;
      button.title = isOwned ? "" : hasSession ? "Открыт первый урок, остальные после покупки курса" : "До входа открыт первый урок курса";
    });
    ensureOwnedBadge(card, isOwned, isPreview);
    updateCourseCardLessonCount(card, lessonCount);

    if (!accountCourse) {
      if (isPreview) {
        const percent = lessonCount > 0 ? Math.round(100 / lessonCount) : 0;
        card.querySelector(".progress-text").textContent = `1 из ${lessonCount} ${getLessonGenitiveWord(lessonCount)} открыт`;
        card.querySelector(".progress-track span").style.width = `${percent}%`;
        card.querySelector(".progress-percent").textContent = hasSession ? "превью" : "гость";
      } else {
        card.querySelector(".progress-text").textContent = "Курс не куплен";
        card.querySelector(".progress-track span").style.width = "0%";
        card.querySelector(".progress-percent").textContent = "0%";
      }
      return;
    }

    const progress = formatPercent(accountCourse.progressPercent);
    const progressText =
      accountCourse.homeworkTotal > 0
        ? `${accountCourse.homeworkSubmitted} из ${accountCourse.homeworkTotal} ДЗ отправлено`
        : "ДЗ пока нет";

    card.querySelector(".progress-text").textContent = progressText;
    card.querySelector(".progress-track span").style.width = progress;
    card.querySelector(".progress-percent").textContent = progress;
  });
}

function applyCourseDetailProgress(courseKey = currentCourseKey, accountCourse = getAccountCourse(courseKey)) {
  if (!accountCourse || currentCourseKey !== courseKey) {
    return;
  }

  const progress = formatPercent(accountCourse.progressPercent);
  const homeworkTotal = accountCourse.homeworkTotal || 0;
  const submittedText = homeworkTotal > 0 ? `${accountCourse.homeworkSubmitted} из ${homeworkTotal} ДЗ отправлено` : "ДЗ пока нет";
  const checkedText = homeworkTotal > 0 ? `${accountCourse.homeworkChecked} проверено из ${homeworkTotal}` : "Пока нет проверок";

  if (detailLessons) {
    detailLessons.textContent = submittedText;
  }

  if (detailProgressText) {
    detailProgressText.textContent = checkedText;
  }

  if (donut) {
    donut.style.setProperty("--value", String(Math.round(accountCourse.progressPercent)));
    donut.querySelector("span").textContent = progress;
  }

  const earnedPanelValue = document.querySelector("#detail-points-earned");
  if (earnedPanelValue) {
    earnedPanelValue.innerHTML = `<svg><use href="#icon-star" /></svg>${formatNumber(accountCourse.pointsEarned)}`;
  }
}

function renderAccountProgress(account = latestAccount) {
  if (!accountCourseProgressList) {
    return;
  }

  const ownedCourses = getAccountCourses(account).filter((course) => course.isOwned);

  if (accountProgressSummary) {
    const submitted = ownedCourses.reduce((sum, course) => sum + course.homeworkSubmitted, 0);
    const total = ownedCourses.reduce((sum, course) => sum + course.homeworkTotal, 0);
    accountProgressSummary.textContent = total > 0 ? `${submitted} из ${total} ДЗ отправлено или проверено` : "Пока нет назначенных ДЗ";
  }

  if (ownedCourses.length === 0) {
    accountCourseProgressList.innerHTML = `<div class="resource-empty">Купленные курсы пока не найдены в базе.</div>`;
    return;
  }

  accountCourseProgressList.innerHTML = ownedCourses
        .map((course) => {
      const progress = formatPercent(course.progressPercent);
      const lessonSummary = course.lessonsTotal > 0 ? `${course.lessonsCompleted} из ${course.lessonsTotal} уроков пройдено` : "Уроки пока не найдены";
      const visibleLessons = course.lessons.length > 0 ? course.lessons : [];
      const completedLessons = visibleLessons.filter((lesson) => lesson.isCompleted);
      const lessonChips = visibleLessons
        .slice(0, 8)
        .map((lesson) => {
          const isCompleted = lesson.isCompleted;
          return `<span class="lesson-chip ${isCompleted ? "is-green" : "is-muted"}">Урок ${escapeHtml(lesson.lessonNumber)} · ${escapeHtml(lesson.lessonTitle)} · ${isCompleted ? "пройден" : "в работе"}</span>`;
        })
        .join("");
      const emptyLessonText = completedLessons.length === 0 ? "Проверенные и пройденные уроки появятся здесь после работы с курсом." : "";

      return `
        <article class="account-course-row">
          <div class="account-course-row__main">
            <div>
              <span class="resource-chip is-blue">${escapeHtml(course.isOwned ? "Куплен" : "Каталог")}</span>
              <h3>${escapeHtml(course.courseTitle)}</h3>
            </div>
            <strong>${progress}</strong>
          </div>
          <div class="account-progress-meter" aria-hidden="true">
            <span style="width: ${progress}"></span>
          </div>
          <div class="account-course-row__stats">
            <span>${escapeHtml(course.homeworkSubmitted)} из ${escapeHtml(course.homeworkTotal)} ДЗ отправлено</span>
            <span>${escapeHtml(course.homeworkChecked)} проверено</span>
            <span>${escapeHtml(lessonSummary)}</span>
            <span>${escapeHtml(formatNumber(course.pointsEarned))} баллов</span>
          </div>
          <div class="account-course-lessons">
            ${lessonChips || `<span class="lesson-chip is-muted">${escapeHtml(emptyLessonText || "Список уроков загрузится из базы.")}</span>`}
          </div>
        </article>
      `;
    })
    .join("");
}

function getBestCourseProgress(account = latestAccount) {
  const courses = getAccountCourses(account).filter((course) => course.isOwned);
  return courses.reduce((best, course) => Math.max(best, Number(course.progressPercent || 0)), 0);
}

function getAchievementBadges(shop = latestShop) {
  return (shop?.badges || [])
    .filter((badge) => badge.badgeType === "achievement")
    .sort((left, right) => Number(left.unlockPercent || 0) - Number(right.unlockPercent || 0));
}

function renderAccountAchievementsEmpty(message) {
  if (accountAchievementsSummary) {
    accountAchievementsSummary.textContent = message;
  }

  if (accountAchievementsList) {
    accountAchievementsList.innerHTML = `<div class="resource-empty">${escapeHtml(message)}</div>`;
  }
}

function getCurrentCourseCurator() {
  const accountCourse = getAccountCourse(currentCourseKey);
  const source = currentCourseAccess || accountCourse || {};

  return {
    curatorId: source.curatorId ?? accountCourse?.curatorId ?? "",
    curatorName: source.curatorName || accountCourse?.curatorName || "Куратор курса",
  };
}

function updateCourseCuratorPanel(courseAccess = currentCourseAccess) {
  if (courseAccess) {
    currentCourseAccess = courseAccess;
  }

  const accountCourse = getAccountCourse(currentCourseKey);
  const curator = getCurrentCourseCurator();
  const hasCourseAccess = Boolean(currentCourseAccess?.isOwned || accountCourse?.isOwned);

  if (detailCuratorName) {
    detailCuratorName.textContent = curator.curatorName || "Куратор курса";
  }

  if (detailCuratorButton) {
    detailCuratorButton.disabled = !curator.curatorId || !hasCourseAccess;
    detailCuratorButton.title = !hasCourseAccess
      ? "Чат с куратором откроется после покупки курса"
      : curator.curatorId
        ? "Открыть чат с куратором курса"
        : "Куратор курса пока не указан в базе";
  }
}

function renderAccountAchievements(shop = latestShop) {
  if (!accountAchievementsList) {
    return;
  }

  if (!hasAuthenticatedAccount()) {
    renderAccountAchievementsEmpty("Достижения появятся после входа.");
    return;
  }

  const badges = getAchievementBadges(shop);
  const bestProgress = getBestCourseProgress();

  if (!badges.length) {
    renderAccountAchievementsEmpty("Список достижений загрузится вместе с магазином.");
    return;
  }

  const opened = badges.filter((badge) => badge.isOwned).length;

  if (accountAchievementsSummary) {
    accountAchievementsSummary.textContent = `Открыто ${opened} из ${badges.length}. Лучший прогресс курса: ${formatPercent(bestProgress)}.`;
  }

  accountAchievementsList.innerHTML = badges
    .map((badge) => {
      const requiredPercent = Number(badge.unlockPercent || 0);
      const currentPercent = Math.min(100, Math.max(0, bestProgress));
      const progress = badge.isOwned ? 100 : Math.min(100, requiredPercent > 0 ? Math.round((currentPercent / requiredPercent) * 100) : 0);
      const statusText = badge.isOwned ? "Открыто" : `Нужно ${formatPercent(requiredPercent)} курса`;

      return `
        <article class="achievement-card ${badge.isOwned ? "is-owned" : ""}">
          <div class="achievement-card__badge">
            <span class="profile-badge ${escapeHtml(badge.cssClass || "")}">${escapeHtml(badge.badgeName)}</span>
          </div>
          <div class="achievement-card__body">
            <div class="achievement-card__title">
              <h3>${escapeHtml(badge.badgeName)}</h3>
              <span class="resource-chip ${badge.isOwned ? "is-green" : "is-yellow"}">${escapeHtml(statusText)}</span>
            </div>
            <p>${escapeHtml(badge.description || "Достижение за прогресс по курсу.")}</p>
            <div class="account-progress-meter" aria-label="Прогресс достижения">
              <span style="width: ${progress}%"></span>
            </div>
            <small>Сейчас: ${escapeHtml(formatPercent(currentPercent))}${badge.isOwned ? " · можно надеть как плашку" : ""}</small>
          </div>
        </article>
      `;
    })
    .join("");
}

function applyAccountToUi(account = latestAccount) {
  if (!account) {
    return;
  }

  latestAccount = account;
  updateProfileSummary(account);
  updatePointsPanels(account);
  applyAccountToCourseCards(account);
  renderAccountProgress(account);
  renderAccountAchievements(latestShop);
  if (currentAccountMode === "profile") {
    loadAccountFriends();
  }
  applyCourseDetailProgress(currentCourseKey, getAccountCourse(currentCourseKey));
  renderGlobalNotifications();
}

function renderShopEmpty(message) {
  latestShop = null;

  if (shopBalance) {
    shopBalance.textContent = hasAuthenticatedAccount() ? "Загружаю баланс..." : "Баланс появится после входа";
  }

  if (shopItemsList) {
    shopItemsList.innerHTML = `<div class="resource-empty">${escapeHtml(message)}</div>`;
  }

  renderAccountAchievementsEmpty(hasAuthenticatedAccount() ? "Достижения загрузятся вместе с магазином." : "Достижения появятся после входа.");

  if (capybaraPreview) {
    clearPixelPetPreview();
  }
}

function getShopSlot(type = "") {
  const normalized = String(type || "").trim().toLowerCase();
  const aliases = {
    "одежда": "outfit",
    "аксессуар": "face",
    background: "scene",
    environment: "scene",
    color: "fur",
  };

  return aliases[normalized] || normalized || "outfit";
}

function getShopTypeLabel(type = "") {
  const labels = {
    animal: "Питомец",
    fur: "Шерсть",
    eyes: "Глаза",
    scene: "Окружение",
    animation: "Анимация",
    outfit: "Одежда",
    head: "Голова",
    face: "Лицо",
    neck: "Шея",
    hand: "Предмет",
  };

  return labels[getShopSlot(type)] || type || "Предмет";
}

function getShopSectionOrder(slot = "") {
  const order = ["animal", "fur", "eyes", "scene", "animation", "outfit", "head", "face", "neck", "hand"];
  const index = order.indexOf(getShopSlot(slot));
  return index === -1 ? order.length : index;
}

function getShopDisplaySection(type = "") {
  const slot = getShopSlot(type);

  if (slot === "fur" || slot === "eyes") {
    return "appearance";
  }

  if (slot === "head" || slot === "face" || slot === "neck" || slot === "hand") {
    return "accessory";
  }

  return slot;
}

function getShopSectionTabs() {
  return [
    ["all", "Все"],
    ["animal", "Питомцы"],
    ["appearance", "Внешность"],
    ["scene", "Окружение"],
    ["animation", "Анимации"],
    ["outfit", "Одежда"],
    ["accessory", "Аксессуары"],
    ["badge", "Плашки"],
  ];
}

function renderShopSectionTabs(activeSection = currentShopSection, dataAttribute = "data-shop-section", { includeBadges = true } = {}) {
  return `
    <div class="shop-section-tabs" role="tablist" aria-label="Разделы магазина">
      ${getShopSectionTabs()
        .filter(([section]) => includeBadges || section !== "badge")
        .map(([section, label]) => {
          const active = activeSection === section;
          return `<button class="${active ? "is-active" : ""}" type="button" ${dataAttribute}="${escapeHtml(section)}" aria-selected="${String(active)}">${escapeHtml(label)}</button>`;
        })
        .join("")}
    </div>
  `;
}

function getProfileStatusLabel(value = "") {
  return (
    {
      focused: "В фокусе",
      chill: "Спокойный режим",
      grinding: "Учусь без пауз",
      on_fire: "Горю учебой",
      need_coffee: "Нужен чай",
      ready_exam: "Готов к экзамену",
      resting: "Восстанавливаюсь",
    }[value] || "В фокусе"
  );
}

function renderProfileStatusForm(selected = "focused") {
  const options = ["focused", "chill", "grinding", "on_fire", "need_coffee", "ready_exam", "resting"];
  return `
    <form class="profile-status-form" data-profile-status-form>
      <div class="profile-status-options" role="radiogroup" aria-label="Статус профиля">
        ${options
          .map(
            (option) => `
              <label class="profile-status-option ${option === selected ? "is-selected" : ""}">
                <input type="radio" name="profileStatus" value="${escapeHtml(option)}" ${option === selected ? "checked" : ""} />
                <span>${escapeHtml(getProfileStatusLabel(option))}</span>
              </label>
            `,
          )
          .join("")}
      </div>
      <button type="submit">Сохранить</button>
      <p class="staff-form-status" aria-live="polite"></p>
    </form>
  `;
}

function getPixelPetSceneTarget(petElement) {
  return petElement?.closest(".capybara-stage") || petElement?.closest(".avatar--student") || null;
}

function getPixelPetAttributes(items = []) {
  const attrs = {};
  let scene = "";

  (items || [])
    .filter((item) => item?.isEquipped !== false && item?.cssClass)
    .forEach((item) => {
      const slot = getShopSlot(item.itemType);

      if (slot === "scene") {
        scene = item.cssClass;
        return;
      }

      attrs[slot] = item.cssClass;
    });

  return { attrs, scene };
}

function renderPixelPetMarkup(items = [], { wrapperClass = "profile-pet-chip", petClass = "profile-pet-chip__pet", asButton = false, buttonAttrs = "" } = {}) {
  const { attrs, scene } = getPixelPetAttributes(items);
  const attrsText = Object.entries(attrs)
    .map(([key, value]) => `data-${escapeHtml(key)}="${escapeHtml(value)}"`)
    .join(" ");
  const tag = asButton ? "button" : "span";
  const typeAttr = asButton ? "type=\"button\"" : "";

  return `
    <${tag} class="${escapeHtml(wrapperClass)}" ${typeAttr} ${buttonAttrs} data-scene="${escapeHtml(scene)}" aria-label="Профильный питомец">
      <span class="capybara ${escapeHtml(petClass)}" ${attrsText}>
        <span class="capybara__shadow"></span>
        <span class="capybara__tail"></span>
        <span class="capybara__body"></span>
        <span class="capybara__head"></span>
        <span class="capybara__ear capybara__ear--left"></span>
        <span class="capybara__ear capybara__ear--right"></span>
        <span class="capybara__eye capybara__eye--left"></span>
        <span class="capybara__eye capybara__eye--right"></span>
        <span class="capybara__nose"></span>
        <span class="capybara__clothes"></span>
        <span class="capybara__neckwear"></span>
        <span class="capybara__face-item"></span>
        <span class="capybara__headwear"></span>
        <span class="capybara__hand-item"></span>
      </span>
    </${tag}>
  `;
}

function renderProfileBadgeMarkup(badge = null, extraClass = "") {
  const badgeName = badge?.badgeName || badge?.activeBadgeName || "";
  const badgeClass = badge?.badgeClass || badge?.cssClass || badge?.activeBadgeClass || "";

  if (!badgeName) {
    return "";
  }

  return `<span class="profile-badge ${escapeHtml(badgeClass)} ${escapeHtml(extraClass)}">${escapeHtml(badgeName)}</span>`;
}

function getShopPreviewItems(item, equippedItems = []) {
  const previewSlot = getShopSlot(item?.itemType);
  const baseItems = (equippedItems || []).filter((equippedItem) => getShopSlot(equippedItem?.itemType) !== previewSlot);
  return [...baseItems, { ...item, isEquipped: true }];
}

function renderShopItemPreview(item, equippedItems = []) {
  return `
    <div class="shop-item__preview" aria-hidden="true">
      ${renderPixelPetMarkup(getShopPreviewItems(item, equippedItems), {
        wrapperClass: "shop-preview-pet",
        petClass: "shop-preview-pet__pet",
      })}
    </div>
  `;
}

function clearPixelPetElement(petElement) {
  if (!petElement) {
    return;
  }

  ["animal", "fur", "eyes", "animation", "outfit", "head", "face", "neck", "hand"].forEach((key) => {
    delete petElement.dataset[key];
  });
  getPixelPetSceneTarget(petElement)?.removeAttribute("data-scene");
}

function applyPixelPetOutfit(petElement, items = []) {
  if (!petElement) {
    return;
  }

  clearPixelPetElement(petElement);

  items
    .filter((item) => item.isEquipped && item.cssClass)
    .forEach((item) => {
      const slot = getShopSlot(item.itemType);

      if (slot === "scene") {
        getPixelPetSceneTarget(petElement)?.setAttribute("data-scene", item.cssClass);
        return;
      }

      petElement.dataset[slot] = item.cssClass;
    });
}

function clearPixelPetPreview() {
  clearPixelPetElement(capybaraPreview);
}

function resetProfilePetAvatar() {
  clearPixelPetElement(profilePetPreview);
  profileAvatar?.classList.remove("has-pet-avatar");
}

function applyCapybaraOutfit(items = []) {
  applyPixelPetOutfit(capybaraPreview, items);
  applyPixelPetOutfit(profilePetPreview, items);

  if (profileAvatar && hasAuthenticatedAccount() && !isStaffMode()) {
    profileAvatar.classList.add("has-pet-avatar");
  }
}

function renderBadgeShopSection(shop) {
  const badges = shop.badges || [];

  if (!badges.length) {
    return "";
  }

  return `
    <section class="shop-section badge-shop-section">
      <h3>Плашки профиля</h3>
      ${badges
        .map((badge) => {
          const canBuy = badge.badgeType === "shop" && !badge.isOwned && Number(shop.pointsTotal) >= Number(badge.pricePoints || 0);
          const action = badge.isOwned
            ? badge.isEquipped
              ? `<button type="button" data-badge-unequip="${escapeHtml(badge.badgeCode)}">Снять</button>`
              : `<button type="button" data-badge-equip="${escapeHtml(badge.badgeCode)}">Надеть</button>`
            : badge.badgeType === "shop"
              ? `<button type="button" data-badge-buy="${escapeHtml(badge.badgeCode)}" ${canBuy ? "" : "disabled"}>Купить</button>`
              : `<button type="button" disabled>Откроется</button>`;
          const lockText = badge.badgeType === "achievement" && !badge.isOwned ? `Нужно ${formatNumber(badge.unlockPercent || 0)}% курса` : "";

          return `
            <article class="shop-item badge-shop-item">
              <div>
                <h3><span class="profile-badge ${escapeHtml(badge.cssClass || "")}">${escapeHtml(badge.badgeName)}</span></h3>
                <p>${escapeHtml(badge.description || lockText || "Плашка для профиля и чата трансляций.")}</p>
                <div class="shop-item__meta">
                  <span class="resource-chip ${badge.badgeType === "achievement" ? "is-green" : "is-blue"}">${badge.badgeType === "achievement" ? "Достижение" : "Покупная"}</span>
                  ${badge.badgeType === "shop" ? `<span class="resource-chip is-yellow">${escapeHtml(formatNumber(badge.pricePoints))} баллов</span>` : ""}
                  ${lockText ? `<span class="resource-chip is-yellow">${escapeHtml(lockText)}</span>` : ""}
                  ${badge.isEquipped ? `<span class="resource-chip is-green">Активна</span>` : badge.isOwned ? `<span class="resource-chip is-green">Открыта</span>` : ""}
                </div>
              </div>
              <div class="shop-item__actions">${action}</div>
            </article>
          `;
        })
        .join("")}
    </section>
  `;
}

function renderShop(shop) {
  latestShop = shop;

  if (shopBalance) {
    shopBalance.textContent = `${formatNumber(shop.pointsTotal)} баллов`;
  }

  applyCapybaraOutfit(shop.items || []);

  if (!shopItemsList) {
    return;
  }

  const items = shop.items || [];
  const equippedItems = items.filter((item) => item.isEquipped);
  const filteredItems = currentShopSection === "all" ? items : items.filter((item) => getShopDisplaySection(item.itemType) === currentShopSection);
  const groupedItems = groupBy(
    [...filteredItems].sort((left, right) => getShopSectionOrder(left.itemType) - getShopSectionOrder(right.itemType) || Number(left.pricePoints || 0) - Number(right.pricePoints || 0)),
    (item) => getShopSlot(item.itemType),
  );

  const itemSections =
    currentShopSection === "badge"
      ? ""
      : Object.entries(groupedItems)
    .sort(([left], [right]) => getShopSectionOrder(left) - getShopSectionOrder(right))
    .map(([slot, sectionItems]) => {
      return `
        <section class="shop-section">
          <h3>${escapeHtml(getShopTypeLabel(slot))}</h3>
          ${sectionItems
            .map((item) => {
              const canBuy = !item.isOwned && Number(shop.pointsTotal) >= Number(item.pricePoints);
              const action = item.isOwned
                ? item.isEquipped
                  ? `<button type="button" data-shop-unequip="${escapeHtml(item.itemCode)}">Снять</button>`
                  : `<button type="button" data-shop-equip="${escapeHtml(item.itemCode)}">Надеть</button>`
                : `<button type="button" data-shop-buy="${escapeHtml(item.itemCode)}" ${canBuy ? "" : "disabled"}>Купить</button>`;

              return `
                <article class="shop-item">
                  ${renderShopItemPreview(item, equippedItems)}
                  <div>
                    <h3>${escapeHtml(item.itemName)}</h3>
                    <p>${escapeHtml(item.description || "Пиксельный предмет для питомца")}</p>
                    <div class="shop-item__meta">
                      <span class="resource-chip is-blue">${escapeHtml(getShopTypeLabel(item.itemType))}</span>
                      <span class="resource-chip is-yellow">${escapeHtml(formatNumber(item.pricePoints))} баллов</span>
                      ${item.isOwned ? `<span class="resource-chip is-green">${item.isEquipped ? "Надето" : "Куплено"}</span>` : ""}
                    </div>
                  </div>
                  <div class="shop-item__actions">
                    ${action}
                  </div>
                </article>
              `;
            })
            .join("")}
        </section>
      `;
    })
    .join("");

  const badgeSection = currentShopSection === "all" || currentShopSection === "badge" ? renderBadgeShopSection(shop) : "";
  const emptyText = currentShopSection === "badge" ? "Плашки пока не найдены." : "В этом разделе пока нет предметов.";
  const content = itemSections || badgeSection ? `${itemSections}${badgeSection}` : `<div class="resource-empty">${escapeHtml(emptyText)}</div>`;
  shopItemsList.innerHTML = `${renderShopSectionTabs()}${content}`;
  renderAccountAchievements(shop);
}

async function loadShop() {
  if (!hasAuthenticatedAccount()) {
    renderShopEmpty("Войдите в аккаунт, чтобы покупать одежду для капибары.");
    return null;
  }

  renderShopEmpty("Загружаю магазин из базы...");

  try {
    const response = await apiFetch("/api/shop", { cache: "no-store" });
    const shop = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(shop.message || shop.error || "Не удалось загрузить магазин");
    }

    renderShop(shop);
    return shop;
  } catch (error) {
    renderShopEmpty(error.message || "Магазин не загрузился. Проверьте сервер.");
    return null;
  }
}

async function refreshVisibleProfileSurfaces() {
  const tasks = [];

  if (currentConversationId) {
    tasks.push(loadMessages(currentConversationId));
  }

  if (activeStreamChatId) {
    tasks.push(openStreamChat(activeStreamChatId));
  }

  if (tasks.length) {
    await Promise.allSettled(tasks);
  }
}

async function sendShopAction(endpoint, itemCode, extraPayload = {}) {
  if (!hasAuthenticatedAccount()) {
    renderShopEmpty("Войдите в аккаунт, чтобы покупать одежду для капибары.");
    return;
  }

  try {
    const response = await apiFetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemCode, ...extraPayload }),
    });
    const shop = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(shop.message || shop.error || "Не удалось обновить магазин");
    }

    renderShop(shop);
    await loadAccount({ silent: true });
    await refreshVisibleProfileSurfaces();
  } catch (error) {
    if (shopItemsList) {
      shopItemsList.insertAdjacentHTML("afterbegin", `<div class="resource-empty">${escapeHtml(error.message || "Действие не выполнено.")}</div>`);
    }
  }
}

async function sendBadgeAction(endpoint, badgeCode, extraPayload = {}) {
  if (!hasAuthenticatedAccount()) {
    renderShopEmpty("Войдите в аккаунт, чтобы управлять плашками.");
    return;
  }

  try {
    const response = await apiFetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ badgeCode, ...extraPayload }),
    });
    const shop = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(shop.message || shop.error || "Не удалось обновить плашку");
    }

    renderShop(shop);
    await loadAccount({ silent: true });
    await refreshVisibleProfileSurfaces();
  } catch (error) {
    if (shopItemsList) {
      shopItemsList.insertAdjacentHTML("afterbegin", `<div class="resource-empty">${escapeHtml(error.message || "Действие с плашкой не выполнено.")}</div>`);
    }
  }
}

async function sendStaffShopAction(endpoint, itemCode, extraPayload = {}) {
  if (!hasAuthenticatedStaff()) {
    setStaffWorkspaceStatus("Войдите в аккаунт команды.", "error");
    return;
  }

  setStaffWorkspaceStatus("Обновляю магазин команды...", "pending");

  try {
    const response = await apiFetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemCode, ...extraPayload }),
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || result.error || "Не удалось обновить магазин команды.");
    }

    await loadStaffWorkspace();
    await refreshVisibleProfileSurfaces();
    setStaffWorkspaceStatus("Магазин команды обновлен.", "success");
  } catch (error) {
    setStaffWorkspaceStatus(error.message || "Не удалось обновить магазин команды.", "error");
  }
}

function setAuthStatus(message, type = "") {
  if (!authStatus) {
    return;
  }

  authStatus.textContent = message;
  authStatus.className = `auth-status${type ? ` is-${type}` : ""}`;
}

async function loadAccount({ silent = false } = {}) {
  if (!hasAuthenticatedAccount()) {
    applyGuestUi();
    return null;
  }

  if (!silent && accountProgressSummary) {
    accountProgressSummary.textContent = "Загружаю данные из базы...";
  }

  try {
    const response = await apiFetch("/api/account", { cache: "no-store" });
    const account = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(account.message || account.error || "Не удалось загрузить аккаунт");
    }

    saveStoredAccount(account);
    applyAccountToUi(account);
    return account;
  } catch (error) {
    clearStoredAccount();
    applyGuestUi("Сессия истекла. Войдите заново, чтобы увидеть личный прогресс.");

    if (!silent) {
      if (accountProgressSummary) {
        accountProgressSummary.textContent = "Войдите заново, чтобы загрузить прогресс.";
      }

      if (accountCourseProgressList) {
        accountCourseProgressList.innerHTML = `<div class="resource-empty">Не удалось загрузить аккаунт. Проверьте вход и работу API-сервера.</div>`;
      }
    }

    console.info("Аккаунт не загрузился.", error);
    return null;
  }
}

async function submitAuthForm(event, endpoint, pendingText, successText) {
  event.preventDefault();

  const form = event.currentTarget;
  const submitButton = form.querySelector("button[type='submit']");
  const payload = Object.fromEntries(new FormData(form).entries());
  const login = String(payload.login || "").trim();
  const password = String(payload.password || "");

  if (login.length < 3) {
    setAuthStatus("Логин должен быть не короче 3 символов.", "error");
    form.querySelector("[name='login']")?.focus();
    return;
  }

  if (password.length < 6) {
    setAuthStatus("Пароль должен быть не короче 6 символов.", "error");
    form.querySelector("[name='password']")?.focus();
    return;
  }

  if (endpoint.includes("register")) {
    const confirmPassword = String(payload.confirmPassword || "");

    if (password !== confirmPassword) {
      setAuthStatus("Пароли не совпадают.", "error");
      form.querySelector("[name='confirmPassword']")?.focus();
      return;
    }
  }

  delete payload.confirmPassword;
  payload.login = login;

  if (submitButton) {
    submitButton.disabled = true;
  }

  setAuthStatus(pendingText, "pending");

  try {
    const response = await apiFetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const account = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(account.message || account.error || "Не удалось выполнить действие");
    }

    saveStoredAccount(account);
    applyAccountToUi(account);
    form.reset();
    setAuthStatus(successText, "success");
    loadShop();
    loadMessages();
  } catch (error) {
    setAuthStatus(error.message || "Не удалось связаться с сервером.", "error");
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
    }
  }
}

function getStaffRoleLabel(role) {
  if (role === "Admin") {
    return "Администратор";
  }

  return role === "Teacher" ? "Преподаватель" : role === "Curator" ? "Куратор" : "Команда";
}

function setStaffAuthStatus(message, type = "") {
  if (!staffAuthStatus) {
    return;
  }

  staffAuthStatus.textContent = message;
  staffAuthStatus.className = `auth-status${type ? ` is-${type}` : ""}`;
}

function updateStaffSessionUi(staff = currentStaff) {
  const hasSession = hasAuthenticatedStaff(staff);
  const roleLabel = getStaffRoleLabel(staff?.staff?.role);
  const name = staff?.staff?.name || "";
  const login = staff?.staff?.login || "";

  if (staffSessionStatus) {
    staffSessionStatus.classList.toggle("is-active", hasSession);
    staffSessionStatus.innerHTML = hasSession
      ? `<span>${escapeHtml(roleLabel)}: <strong>${escapeHtml(name || login)}</strong></span>`
      : `<span>Куратор или преподаватель пока не вошёл</span>`;
  }

  if (staffLoginForm) {
    staffLoginForm.classList.toggle("is-hidden", hasSession);
  }

  if (staffLogoutButton) {
    staffLogoutButton.classList.toggle("is-hidden", !hasSession);
  }
}

function getStaffProfile(staff = currentStaff) {
  return staff?.staff || staff || {};
}

function isStaffMode() {
  return Boolean(document.querySelector(".app")?.classList.contains("is-staff-mode") && hasAuthenticatedStaff(currentStaff));
}

function ensureStaffShell() {
  if (!document.querySelector("#staff-side-nav")) {
    document.querySelector(".brand")?.insertAdjacentHTML(
      "afterend",
      `<nav class="staff-side-nav" id="staff-side-nav" aria-label="Навигация команды"></nav>`,
    );
  }

  if (!document.querySelector("[data-page='staff-workspace']")) {
    document.querySelector("#app-content")?.insertAdjacentHTML(
      "beforeend",
      `
        <section class="staff-workspace-page is-hidden" data-page="staff-workspace" aria-hidden="true">
          <header class="staff-workspace-header">
            <div>
              <span id="staff-workspace-eyebrow">Рабочий кабинет</span>
              <h1 id="staff-workspace-title">Команда</h1>
            </div>
            <div class="staff-workspace-actions">
              <div class="staff-header-profile" id="staff-header-profile"></div>
              <button class="staff-refresh-button" type="button" data-staff-refresh>
                <svg><use href="#icon-clock" /></svg>
                Обновить
              </button>
            </div>
          </header>
          <p class="application-status" id="staff-workspace-status" aria-live="polite"></p>
          <div class="staff-workspace-content" id="staff-workspace-content"></div>
        </section>
      `,
    );
  }
}

function getStaffNavItems() {
  const role = getStaffProfile().role;

  if (role === "Admin") {
    return [
      { page: "messages", label: "Сообщения", icon: "#icon-message" },
      { page: "points", label: "Баллы", icon: "#icon-star" },
      { page: "applications", label: "Заявки", icon: "#icon-clipboard" },
      { page: "support", label: "Обращения", icon: "#icon-message" },
      { page: "students", label: "Ученики", icon: "#icon-book" },
      { page: "parents", label: "Родители", icon: "#icon-user" },
      { page: "teachers", label: "Преподаватели", icon: "#icon-play" },
      { page: "curators", label: "Кураторы", icon: "#icon-star" },
      { page: "account", label: "Аккаунт", icon: "#icon-user" },
    ];
  }

  if (role === "Curator") {
    return [
      { page: "messages", label: "Сообщения", icon: "#icon-message" },
      { page: "points", label: "Баллы", icon: "#icon-star" },
      { page: "teachers", label: "Преподаватели", icon: "#icon-user" },
      { page: "students", label: "Ученики", icon: "#icon-book" },
      { page: "lessons", label: "Уроки", icon: "#icon-play" },
      { page: "notes", label: "Конспекты", icon: "#icon-file" },
      { page: "homework", label: "Домашние задания", icon: "#icon-clipboard" },
      { page: "streams", label: "Трансляции", icon: "#icon-broadcast" },
      { page: "calls", label: "Созвоны", icon: "#icon-clock" },
      { page: "archive", label: "Архив оценок", icon: "#icon-folder" },
      { page: "account", label: "Аккаунт", icon: "#icon-user" },
    ];
  }

  return [
    { page: "messages", label: "Сообщения", icon: "#icon-message" },
    { page: "points", label: "Баллы", icon: "#icon-star" },
    { page: "students", label: "Ученики", icon: "#icon-book" },
    { page: "homework", label: "Домашние задания", icon: "#icon-clipboard" },
    { page: "archive", label: "Архив проверок", icon: "#icon-folder" },
    { page: "courses", label: "Мои курсы", icon: "#icon-play" },
    { page: "account", label: "Аккаунт", icon: "#icon-user" },
  ];
}

function renderStaffNav() {
  ensureStaffShell();
  const nav = document.querySelector("#staff-side-nav");

  if (!nav) {
    return;
  }

  nav.innerHTML = getStaffNavItems()
    .map(
      (item) => `
        <button class="side-link" type="button" data-staff-page="${escapeHtml(item.page)}">
          <svg><use href="${item.icon}" /></svg>
          <span>${escapeHtml(item.label)}</span>
        </button>
      `,
    )
    .join("");
  setActiveStaffNav(currentStaffPage);
}

function setActiveStaffNav(pageName) {
  document.querySelectorAll("[data-staff-page]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.staffPage === pageName);
  });
}

function getStaffPageTitle(pageName) {
  const role = getStaffProfile().role;
  const titles = {
    applications: "Заявки",
    support: "Обращения",
    parents: "Родители",
    curators: "Кураторы",
    messages: "Сообщения",
    points: "Баллы",
    students: role === "Teacher" ? "Мои ученики" : "Ученики преподавателей",
    homework: "Домашние задания",
    archive: role === "Teacher" ? "Архив проверок" : "Архив оценок",
    courses: "Мои курсы",
    account: "Аккаунт",
    teachers: "Преподаватели",
    lessons: "Уроки",
    notes: "Конспекты",
    streams: "Трансляции",
    calls: "Созвоны",
  };

  return titles[pageName] || "Рабочий кабинет";
}

function setStaffWorkspaceStatus(message, type = "") {
  const status = document.querySelector("#staff-workspace-status");

  if (!status) {
    return;
  }

  status.textContent = message;
  status.className = `application-status${type ? ` is-${type}` : ""}`;
}

function updateStaffWorkspaceHeader(pageName) {
  const staff = getStaffProfile();
  const title = document.querySelector("#staff-workspace-title");
  const eyebrow = document.querySelector("#staff-workspace-eyebrow");
  const staffHeaderProfile = document.querySelector("#staff-header-profile");
  const staffShopItems = latestStaffWorkspace?.staffShop?.items || [];
  const staffEquippedItems = staffShopItems.filter((item) => item.isEquipped);

  if (title) {
    title.textContent = getStaffPageTitle(pageName);
  }

  if (eyebrow) {
    eyebrow.textContent = `${getStaffRoleLabel(staff.role)} · ${staff.name || staff.login || "команда"}`;
  }

  if (staffHeaderProfile) {
    staffHeaderProfile.innerHTML = `
      ${renderPixelPetMarkup(staffEquippedItems, { wrapperClass: "profile-pet-chip profile-pet-chip--header" })}
      <span>${escapeHtml(staff.name || staff.login || "Команда")}</span>
    `;
  }

  if (isStaffMode() && profileAvatar) {
    profileAvatar.classList.add("has-pet-avatar");
    applyPixelPetOutfit(profilePetPreview, staffEquippedItems);
  }
}

function enterStaffMode(staff = currentStaff, pageName = "") {
  if (!hasAuthenticatedStaff(staff)) {
    return;
  }

  currentStaff = staff;
  ensureStaffShell();
  document.querySelector(".app")?.classList.add("is-staff-mode");
  renderStaffNav();

  const staffProfile = getStaffProfile(staff);

  if (profileName) {
    profileName.textContent = staffProfile.name || staffProfile.login || "Команда";
  }

  resetProfilePetAvatar();
  renderGlobalNotifications();
  const hashPage = location.hash.startsWith("#staff-") ? location.hash.replace("#staff-", "") : "";
  const fallbackPage = "messages";
  const requestedPage = pageName || hashPage || currentStaffPage || fallbackPage;
  openStaffPage(requestedPage);
  loadStaffWorkspace({ silent: true });
}

function exitStaffMode() {
  document.querySelector(".app")?.classList.remove("is-staff-mode");
  latestStaffWorkspace = null;
  currentStaffPage = "messages";

  if (hasAuthenticatedAccount()) {
    applyAccountToUi(latestAccount || currentAccount);
  } else {
    applyGuestUi();
  }

  openAccount();
}

function openStaffPage(pageName = "messages") {
  if (!hasAuthenticatedStaff()) {
    openAccount();
    return;
  }

  ensureStaffShell();
  currentStaffPage = pageName;
  setActiveStaffNav(pageName);
  updateStaffWorkspaceHeader(pageName);

  if (pageName === "messages") {
    showPage("messages");
    setActiveNav("");
    history.replaceState(null, "", "#staff-messages");
    loadMessages();
    return;
  }

  showPage("staff-workspace");
  setActiveNav("");
  history.replaceState(null, "", `#staff-${pageName}`);
  renderStaffPage(pageName);
}

async function loadStaffWorkspace({ silent = false } = {}) {
  if (!hasAuthenticatedStaff()) {
    return null;
  }

  ensureStaffShell();

  if (!silent) {
    setStaffWorkspaceStatus("Загружаю данные из базы...", "pending");
  }

  try {
    const response = await apiFetch("/api/staff/workspace", { cache: "no-store" });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 401) {
        clearStoredStaff();
        updateStaffSessionUi(null);
        exitStaffMode();
      }

      throw new Error(payload.message || payload.error || "Рабочий кабинет не загрузился");
    }

    latestStaffWorkspace = payload;
    setStaffWorkspaceStatus("", "");
    updateStaffWorkspaceHeader(currentStaffPage);
    renderGlobalNotifications();
    renderStaffPage(currentStaffPage);
    return payload;
  } catch (error) {
    setStaffWorkspaceStatus(error.message || "Не удалось загрузить данные команды.", "error");
    return null;
  }
}

function getStaffContent() {
  ensureStaffShell();
  return document.querySelector("#staff-workspace-content");
}

function getStaffItems(name) {
  const items = latestStaffWorkspace?.[name];

  if (Array.isArray(items)) {
    return items;
  }

  if (items && typeof items === "object") {
    return [items];
  }

  return [];
}

function getStaffDrilldownKey(pageName) {
  const role = getStaffProfile().role || "Staff";
  return `${role}:${pageName}`;
}

function getStaffDrilldown(pageName) {
  return staffDrilldownState[getStaffDrilldownKey(pageName)] || {};
}

function setStaffDrilldown(pageName, nextState = {}) {
  const key = getStaffDrilldownKey(pageName);
  staffDrilldownState[key] = { ...(staffDrilldownState[key] || {}), ...nextState };
  renderStaffPage(pageName);
}

function resetStaffDrilldown(pageName, nextState = {}) {
  staffDrilldownState[getStaffDrilldownKey(pageName)] = nextState;
  renderStaffPage(pageName);
}

function getCourseSelectionKey(item) {
  return String(item?.courseId || item?.courseSlug || item?.courseTitle || "course");
}

function matchesCourseSelection(item, selectedCourseId) {
  const selected = String(selectedCourseId || "");

  if (!selected) {
    return true;
  }

  return [item?.courseId, item?.courseSlug, item?.courseTitle].some((value) => String(value || "") === selected);
}

function matchesTeacherSelection(item, teacher) {
  const teacherId = String(teacher?.teacherId || "");

  if (teacherId && String(item?.teacherId || "") === teacherId) {
    return true;
  }

  return Boolean(teacher?.teacherName && item?.teacherName === teacher.teacherName);
}

function getStaffCourseOptions(selectedCourseId = "") {
  return getStaffItems("courses")
    .map((course) => `<option value="${escapeHtml(course.courseId)}" ${String(course.courseId) === String(selectedCourseId) ? "selected" : ""}>${escapeHtml(course.courseTitle)}</option>`)
    .join("");
}

function getStaffLessonOptions(courseId, selectedLessonId = "") {
  return getStaffItems("lessons")
    .filter((lesson) => String(lesson.courseId) === String(courseId))
    .map((lesson) => `<option value="${escapeHtml(lesson.lessonId)}" ${String(lesson.lessonId) === String(selectedLessonId) ? "selected" : ""}>Урок ${escapeHtml(lesson.lessonNumber)} · ${escapeHtml(lesson.lessonTitle)}</option>`)
    .join("");
}

function groupBy(items, getKey) {
  return items.reduce((groups, item) => {
    const key = getKey(item) || "Без группы";
    groups[key] = groups[key] || [];
    groups[key].push(item);
    return groups;
  }, {});
}

function getHomeworkStaffStatus(item) {
  const status = item.submissionStatus || item.homeworkStatus;

  if (status === "Checked") {
    return { label: "Проверено", className: "is-green" };
  }

  if (status === "Submitted") {
    return { label: "На проверке", className: "is-blue" };
  }

  return { label: "Не сдано", className: "is-yellow" };
}

function isCuratorReviewed(item) {
  return Boolean(item?.curatorReviewId || item?.curatorRating || String(item?.curatorComment || "").trim());
}

function isStaffHomeworkChecked(item) {
  return item?.homeworkStatus === "Checked" || item?.submissionStatus === "Checked" || Boolean(item?.checkedAt);
}

function isStaffHomeworkSubmitted(item) {
  return isStaffHomeworkChecked(item) || item?.homeworkStatus === "Submitted" || item?.submissionStatus === "Submitted" || Boolean(item?.submissionLink);
}

function getHomeworkLessonGroupKey(item) {
  return [item?.courseId || item?.courseTitle || "course", item?.lessonId || item?.lessonNumber || "lesson", item?.lessonTitle || ""].join("::");
}

function getHomeworkLessonDomId(item) {
  const safeKey = getHomeworkLessonGroupKey(item)
    .toLowerCase()
    .replace(/[^a-z0-9а-яё_-]+/gi, "-")
    .replace(/^-+|-+$/g, "");

  return `homework-lesson-${safeKey || "group"}`;
}

function sortHomeworkItems(a, b) {
  return (
    String(a.courseTitle || "").localeCompare(String(b.courseTitle || ""), "ru") ||
    Number(a.lessonNumber || 0) - Number(b.lessonNumber || 0) ||
    String(a.homeworkTitle || "").localeCompare(String(b.homeworkTitle || ""), "ru") ||
    String(a.studentName || "").localeCompare(String(b.studentName || ""), "ru")
  );
}

function clampPercent(value) {
  return Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
}

function percentOf(value, total) {
  const normalizedTotal = Number(total) || 0;

  if (normalizedTotal <= 0) {
    return 0;
  }

  return clampPercent((Number(value) || 0) * 100 / normalizedTotal);
}

function getHomeworkLessonSummariesFromStats(stats = getStaffItems("homeworkStats")) {
  const grouped = new Map();

  (stats || []).forEach((stat) => {
    const key = getHomeworkLessonGroupKey(stat);
    const current = grouped.get(key) || {
      ...stat,
      key,
      homeworkTotal: 0,
      studentsTotal: 0,
      submittedTotal: 0,
      checkedTotal: 0,
      curatorReviewedTotal: 0,
    };

    current.homeworkTotal += Number(stat.homeworkTotal || 0);
    current.studentsTotal = Math.max(current.studentsTotal, Number(stat.studentsTotal || 0));
    current.submittedTotal += Number(stat.submittedTotal || 0);
    current.checkedTotal += Number(stat.checkedTotal || 0);
    current.curatorReviewedTotal += Number(stat.curatorReviewedTotal || 0);
    grouped.set(key, current);
  });

  return [...grouped.values()]
    .map((stat) => ({
      ...stat,
      submittedPercent: percentOf(stat.submittedTotal, stat.homeworkTotal),
      checkedPercent: percentOf(stat.checkedTotal, stat.homeworkTotal),
      curatorReviewedPercent: percentOf(stat.curatorReviewedTotal, stat.homeworkTotal),
      domId: getHomeworkLessonDomId(stat),
    }))
    .sort(sortHomeworkItems);
}

function getHomeworkSummaryFromItems(items, stats = getStaffItems("homeworkStats")) {
  const first = items[0] || {};
  const key = getHomeworkLessonGroupKey(first);
  const statSummary = getHomeworkLessonSummariesFromStats(stats).find((stat) => stat.key === key);

  if (statSummary) {
    return statSummary;
  }

  const students = new Set(items.map((item) => item.studentId).filter(Boolean));
  const summary = {
    ...first,
    key,
    homeworkTotal: items.length,
    studentsTotal: students.size || items.length,
    submittedTotal: items.filter(isStaffHomeworkSubmitted).length,
    checkedTotal: items.filter(isStaffHomeworkChecked).length,
    curatorReviewedTotal: items.filter(isCuratorReviewed).length,
  };

  return {
    ...summary,
    submittedPercent: percentOf(summary.submittedTotal, summary.homeworkTotal),
    checkedPercent: percentOf(summary.checkedTotal, summary.homeworkTotal),
    curatorReviewedPercent: percentOf(summary.curatorReviewedTotal, summary.homeworkTotal),
    domId: getHomeworkLessonDomId(summary),
  };
}

function renderHomeworkStatsBars(stat, { curator = false } = {}) {
  const rows = [
    ["Сдано", stat.submittedTotal, stat.submittedPercent, "is-submitted"],
    ["Проверено", stat.checkedTotal, stat.checkedPercent, "is-checked"],
  ];

  if (curator) {
    rows.push(["Фидбек куратора", stat.curatorReviewedTotal, stat.curatorReviewedPercent, "is-curator"]);
  }

  return `
    <div class="staff-bars" aria-label="Статусы домашних заданий">
      ${rows
        .map(
          ([label, value, percent, className]) => `
            <div class="staff-bar ${className}">
              <div>
                <strong>${escapeHtml(label)}</strong>
                <span>${formatNumber(value)} · ${formatPercent(percent)}</span>
              </div>
              <i style="width: ${clampPercent(percent)}%"></i>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderHomeworkStatChips(stat, { curator = false } = {}) {
  return `
    <div class="staff-lesson-summary__chips">
      <span class="resource-chip">${formatNumber(stat.studentsTotal)} учен.</span>
      <span class="resource-chip">${formatNumber(stat.homeworkTotal)} ДЗ</span>
      <span class="resource-chip is-blue">${formatNumber(stat.submittedTotal)} сдано</span>
      <span class="resource-chip is-green">${formatNumber(stat.checkedTotal)} проверено</span>
      ${curator ? `<span class="resource-chip is-yellow">${formatNumber(stat.curatorReviewedTotal)} оценено куратором</span>` : ""}
    </div>
  `;
}

function renderHomeworkStatsOverview(stats, { curator = false } = {}) {
  const summaries = getHomeworkLessonSummariesFromStats(stats);

  if (summaries.length === 0) {
    return "";
  }

  return `
    <section class="staff-homework-overview" aria-label="Сводка домашних заданий">
      ${summaries
        .map(
          (stat) => `
            <button class="staff-lesson-summary" type="button" data-staff-scroll-target="${escapeHtml(stat.domId)}">
              <div>
                <span>${escapeHtml(stat.courseTitle || "Курс")}${stat.teacherName ? ` · ${escapeHtml(stat.teacherName)}` : ""}</span>
                <strong>Урок ${escapeHtml(stat.lessonNumber || "-")} · ${escapeHtml(stat.lessonTitle || stat.homeworkTitle || "Домашнее задание")}</strong>
                ${renderHomeworkStatChips(stat, { curator })}
              </div>
              ${renderHomeworkStatsBars(stat, { curator })}
            </button>
          `,
        )
        .join("")}
    </section>
  `;
}

function getHomeworkCourseSummaries(stats = getStaffItems("homeworkStats")) {
  const grouped = new Map();

  (stats || []).forEach((stat) => {
    const key = getCourseSelectionKey(stat);
    const current = grouped.get(key) || {
      courseId: stat.courseId,
      courseSlug: stat.courseSlug,
      courseTitle: stat.courseTitle,
      teacherId: stat.teacherId,
      teacherName: stat.teacherName,
      homeworkTotal: 0,
      studentsTotal: 0,
      submittedTotal: 0,
      checkedTotal: 0,
      curatorReviewedTotal: 0,
      lessonKeys: new Set(),
    };

    current.homeworkTotal += Number(stat.homeworkTotal || 0);
    current.studentsTotal = Math.max(current.studentsTotal, Number(stat.studentsTotal || 0));
    current.submittedTotal += Number(stat.submittedTotal || 0);
    current.checkedTotal += Number(stat.checkedTotal || 0);
    current.curatorReviewedTotal += Number(stat.curatorReviewedTotal || 0);
    current.lessonKeys.add(getHomeworkLessonGroupKey(stat));
    grouped.set(key, current);
  });

  return [...grouped.values()]
    .map((summary) => ({
      ...summary,
      courseKey: getCourseSelectionKey(summary),
      lessonsCount: summary.lessonKeys.size,
      submittedPercent: percentOf(summary.submittedTotal, summary.homeworkTotal),
      checkedPercent: percentOf(summary.checkedTotal, summary.homeworkTotal),
      curatorReviewedPercent: percentOf(summary.curatorReviewedTotal, summary.homeworkTotal),
    }))
    .sort((left, right) => String(left.courseTitle || "").localeCompare(String(right.courseTitle || ""), "ru"));
}

function getHomeworkLessonSummariesForCourse(courseId, stats = getStaffItems("homeworkStats")) {
  return getHomeworkLessonSummariesFromStats(stats).filter((summary) => matchesCourseSelection(summary, courseId));
}

function isTeacherHomeworkLessonComplete(summary) {
  return Number(summary?.submittedTotal || 0) > 0 && Number(summary.submittedTotal || 0) === Number(summary.checkedTotal || 0);
}

function isCuratorHomeworkLessonComplete(summary) {
  return Number(summary?.checkedTotal || 0) > 0 && Number(summary.checkedTotal || 0) === Number(summary.curatorReviewedTotal || 0);
}

function isHomeworkLessonComplete(summary, { curator = false } = {}) {
  return curator ? isCuratorHomeworkLessonComplete(summary) : isTeacherHomeworkLessonComplete(summary);
}

function renderStaffStepBack(pageName, backTo, courseId = "", label = "Назад") {
  return `
    <button class="staff-step-back" type="button" data-staff-back-step="${escapeHtml(pageName)}" data-staff-back-to="${escapeHtml(backTo)}" data-course-id="${escapeHtml(courseId)}">
      <svg><use href="#icon-chevron" /></svg>${escapeHtml(label)}
    </button>
  `;
}

function renderStaffStepHeading(title, text = "", actions = "") {
  return `
    <header class="staff-step-heading">
      <div>
        <span>${escapeHtml(text)}</span>
        <h2>${escapeHtml(title)}</h2>
      </div>
      ${actions ? `<div class="staff-step-heading__actions">${actions}</div>` : ""}
    </header>
  `;
}

function renderHomeworkCourseStep(pageName, stats, { curator = false } = {}) {
  const summaries = getHomeworkCourseSummaries(stats);

  if (summaries.length === 0) {
    return renderStaffEmpty("По этим курсам пока нет домашних заданий в базе.");
  }

  return `
    ${renderStaffStepHeading("Выберите курс", curator ? "Кураторская проверка домашних заданий" : "Проверка домашних заданий")}
    <div class="staff-step-grid">
      ${summaries
        .map((summary) => {
          const complete = isHomeworkLessonComplete(summary, { curator });
          return `
            <button class="staff-step-card ${complete ? "is-complete" : ""}" type="button" data-staff-open-course="${escapeHtml(pageName)}" data-course-id="${escapeHtml(summary.courseKey)}">
              <div class="staff-step-card__top">
                <span>${escapeHtml(summary.teacherName || "Преподаватель")}</span>
                <strong>${escapeHtml(summary.courseTitle || "Курс")}</strong>
              </div>
              <div class="staff-step-card__meta">
                <span class="resource-chip">${formatNumber(summary.lessonsCount)} урок.</span>
                <span class="resource-chip is-blue">${formatNumber(summary.submittedTotal)} сдано</span>
                <span class="resource-chip is-green">${formatNumber(summary.checkedTotal)} проверено</span>
                ${curator ? `<span class="resource-chip is-yellow">${formatNumber(summary.curatorReviewedTotal)} с фидбеком</span>` : ""}
              </div>
              ${renderHomeworkStatsBars(summary, { curator })}
            </button>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderHomeworkLessonStep(pageName, courseSummary, lessonSummaries, { curator = false } = {}) {
  if (lessonSummaries.length === 0) {
    return `
      ${renderStaffStepHeading(courseSummary?.courseTitle || "Курс", "Уроки", renderStaffStepBack(pageName, "courses", "", "К курсам"))}
      ${renderStaffEmpty("В выбранном курсе пока нет уроков с домашними заданиями.")}
    `;
  }

  return `
    ${renderStaffStepHeading(
      courseSummary?.courseTitle || lessonSummaries[0]?.courseTitle || "Курс",
      curator ? "Выберите урок для кураторской оценки" : "Выберите урок для проверки",
      renderStaffStepBack(pageName, "courses", "", "К курсам"),
    )}
    <div class="staff-step-grid">
      ${lessonSummaries
        .map((summary) => {
          const complete = isHomeworkLessonComplete(summary, { curator });
          return `
            <button class="staff-step-card ${complete ? "is-complete" : ""}" type="button" data-staff-open-lesson="${escapeHtml(pageName)}" data-course-id="${escapeHtml(getCourseSelectionKey(summary))}" data-lesson-key="${escapeHtml(summary.key)}">
              <div class="staff-step-card__top">
                <span>Урок ${escapeHtml(summary.lessonNumber || "-")}</span>
                <strong>${escapeHtml(summary.lessonTitle || summary.homeworkTitle || "Домашнее задание")}</strong>
              </div>
              ${renderHomeworkStatChips(summary, { curator })}
              ${renderHomeworkStatsBars(summary, { curator })}
            </button>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderHomeworkLessonWorkspace(pageName, courseSummary, lessonSummary, items, renderItem, { curator = false } = {}) {
  return `
    ${renderStaffStepHeading(
      `Урок ${lessonSummary?.lessonNumber || "-"} · ${lessonSummary?.lessonTitle || lessonSummary?.homeworkTitle || "Домашнее задание"}`,
      courseSummary?.courseTitle || lessonSummary?.courseTitle || "Курс",
      `${renderStaffStepBack(pageName, "lessons", getCourseSelectionKey(courseSummary || lessonSummary), "К урокам")}${renderStaffStepBack(pageName, "courses", "", "К курсам")}`,
    )}
    ${lessonSummary ? renderHomeworkStatsBars(lessonSummary, { curator }) : ""}
    <div class="staff-card-grid">
      ${
        items.length
          ? items.map(renderItem).join("")
          : renderStaffEmpty("По этому уроку пока нет работ в базе.")
      }
    </div>
  `;
}

function renderTeacherCheckedHomeworkNote(item) {
  const score = item.score ?? "";
  const feedback = item.feedbackText || item.teacherComment || "Комментарий не указан.";

  return `
    <div class="staff-reviewed-note is-success">
      <strong>Вы уже проверили эту работу${score !== "" ? `: ${escapeHtml(score)} / 10 баллов` : "."}</strong>
      <span>${escapeHtml(feedback)}</span>
    </div>
  `;
}

function renderCuratorReviewNote(item) {
  const rating = item.curatorRating ? `${item.curatorRating} / 10` : "оценка не указана";
  const dateText = item.curatorReviewUpdatedAt || item.curatorReviewCreatedAt;

  return `
    <div class="staff-reviewed-note is-success">
      <strong>Кураторская оценка уже выставлена: ${escapeHtml(rating)}</strong>
      <span>${escapeHtml(item.curatorComment || "Комментарий не указан.")}${dateText ? ` · ${escapeHtml(formatStreamDate(dateText))}` : ""}</span>
    </div>
  `;
}

function renderHomeworkTeacherResult(item) {
  if (isStaffHomeworkChecked(item)) {
    const score = item.score ?? "";
    const comment = item.feedbackText || item.teacherComment || "Комментарий преподавателя не указан.";

    return `
      <div class="staff-reviewed-note is-success">
        <strong>Проверено преподавателем${score !== "" ? `: ${escapeHtml(score)} / 10 баллов` : ""}</strong>
        <span>${escapeHtml(comment)}</span>
      </div>
    `;
  }

  if (isStaffHomeworkSubmitted(item)) {
    return `
      <div class="staff-reviewed-note is-pending">
        <strong>На проверке у преподавателя</strong>
        <span>Ссылка ученика уже есть, оценка и комментарий появятся после проверки.</span>
      </div>
    `;
  }

  return `
    <div class="staff-reviewed-note is-muted">
      <strong>ДЗ пока не сдано</strong>
      <span>Кураторский фидбек станет доступен после проверки преподавателем.</span>
    </div>
  `;
}

function createStaffLink(url, label, icon = "#icon-file") {
  if (!url) {
    return `<button type="button" disabled><svg><use href="${icon}" /></svg>${escapeHtml(label)}</button>`;
  }

  return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer"><svg><use href="${icon}" /></svg>${escapeHtml(label)}</a>`;
}

function renderStaffEmpty(message) {
  return `<div class="resource-empty">${escapeHtml(message)}</div>`;
}

function renderStaffMetricCards() {
  const metrics = [
    ["Курсы", getStaffItems("courses").length],
    ["Ученики", getStaffItems("students").length],
    ["ДЗ", getStaffItems("homeworks").length],
    ["Трансляции", getStaffItems("streams").length],
  ];

  return `
    <section class="staff-metrics" aria-label="Сводка">
      ${metrics
        .map(
          ([label, value]) => `
            <article>
              <span>${escapeHtml(label)}</span>
              <strong>${formatNumber(value)}</strong>
            </article>
          `,
        )
        .join("")}
    </section>
  `;
}

function renderStaffPoints() {
  const shop = latestStaffWorkspace?.staffShop || { pointsTotal: 0, items: [] };
  const items = shop.items || [];
  const equippedItems = items.filter((item) => item.isEquipped);
  const staffPetScene = getPixelPetAttributes(equippedItems).scene;
  const filteredItems = currentStaffShopSection === "all" ? items : items.filter((item) => getShopDisplaySection(item.itemType) === currentStaffShopSection);
  const groupedItems = groupBy(
    [...filteredItems].sort((left, right) => getShopSectionOrder(left.itemType) - getShopSectionOrder(right.itemType) || Number(left.pricePoints || 0) - Number(right.pricePoints || 0)),
    (item) => getShopSlot(item.itemType),
  );
  const sections = Object.entries(groupedItems)
    .sort(([left], [right]) => getShopSectionOrder(left) - getShopSectionOrder(right))
    .map(
      ([slot, sectionItems]) => `
        <section class="shop-section">
          <h3>${escapeHtml(getShopTypeLabel(slot))}</h3>
          ${sectionItems
            .map((item) => {
              const canBuy = !item.isOwned && Number(shop.pointsTotal || 0) >= Number(item.pricePoints || 0);
              const action = item.isOwned
                ? item.isEquipped
                  ? `<button type="button" data-staff-shop-unequip="${escapeHtml(item.itemCode)}">Снять</button>`
                  : `<button type="button" data-staff-shop-equip="${escapeHtml(item.itemCode)}">Надеть</button>`
                : `<button type="button" data-staff-shop-buy="${escapeHtml(item.itemCode)}" ${canBuy ? "" : "disabled"}>Купить</button>`;
              return `
                <article class="shop-item">
                  ${renderShopItemPreview(item, equippedItems)}
                  <div>
                    <h3>${escapeHtml(item.itemName)}</h3>
                    <p>${escapeHtml(item.description || "Пиксельный предмет профиля команды.")}</p>
                    <div class="shop-item__meta">
                      <span class="resource-chip is-blue">${escapeHtml(getShopTypeLabel(item.itemType))}</span>
                      ${item.audience && item.audience !== "All" ? `<span class="resource-chip is-green">${escapeHtml(getStaffRoleLabel(item.audience))}</span>` : ""}
                      <span class="resource-chip is-yellow">${escapeHtml(formatNumber(item.pricePoints))} баллов</span>
                      ${item.isOwned ? `<span class="resource-chip is-green">${item.isEquipped ? "Надето" : "Куплено"}</span>` : ""}
                    </div>
                  </div>
                  <div class="shop-item__actions">${action}</div>
                </article>
              `;
            })
            .join("")}
        </section>
      `,
    )
    .join("");

  return `
    <section class="staff-panel">
      <h2>Баллы</h2>
      <p>Баллы начисляются за проверки и кураторские оценки. На них можно покупать пиксельные элементы профиля команды.</p>
      <div class="staff-points-total">
        <span>Баланс</span>
        <strong>${escapeHtml(formatNumber(shop.pointsTotal || 0))}</strong>
      </div>
      <div class="staff-shop-layout">
        <div class="capybara-stage staff-capybara-stage" data-scene="${escapeHtml(staffPetScene)}" aria-label="Пиксельный питомец команды">
          ${renderPixelPetMarkup(equippedItems, { wrapperClass: "staff-shop-pet", petClass: "staff-shop-pet__pet" })}
        </div>
        <div class="shop-items-list staff-shop-list">
          ${renderShopSectionTabs(currentStaffShopSection, "data-staff-shop-section", { includeBadges: false })}
          ${items.length ? sections || `<div class="resource-empty">В этом разделе пока нет предметов.</div>` : renderStaffEmpty("Предметы магазина пока не загрузились.")}
        </div>
      </div>
    </section>
  `;
}

function renderStaffAccount() {
  const staff = getStaffProfile();
  const shop = latestStaffWorkspace?.staffShop || { pointsTotal: 0, items: [] };
  const equippedItems = (shop.items || []).filter((item) => item.isEquipped);

  return `
    <section class="staff-panel staff-account-card">
      <div class="staff-account-hero">
        <div class="profile-pet-card">
          ${renderPixelPetMarkup(equippedItems, { wrapperClass: "profile-pet-chip profile-pet-chip--account" })}
        </div>
        <div>
          <h2>${escapeHtml(staff.name || "Аккаунт команды")}</h2>
          <p>${escapeHtml(getStaffRoleLabel(staff.role))} · рабочий профиль</p>
        </div>
      </div>
      <div class="staff-info-grid">
        <span>Роль<strong>${escapeHtml(getStaffRoleLabel(staff.role))}</strong></span>
        <span>Логин<strong>${escapeHtml(staff.login || "-")}</strong></span>
        <span>ID<strong>${escapeHtml(staff.staffId || "-")}</strong></span>
      </div>
      <button class="submit-button" type="button" data-staff-logout>
        <svg><use href="#icon-user" /></svg>
        Выйти из кабинета команды
      </button>
    </section>
  `;
}

function renderStudentCommentForm(student) {
  return `
    <form class="staff-inline-form" data-staff-student-comment-form data-student-id="${escapeHtml(student.studentId)}">
      <textarea name="commentText" rows="2" placeholder="Комментарий к ученику для команды" required></textarea>
      <button type="submit"><svg><use href="#icon-message" /></svg>Сохранить</button>
      <p class="staff-form-status" aria-live="polite"></p>
    </form>
  `;
}

function renderStaffStudents() {
  const students = getStaffItems("students");

  if (students.length === 0) {
    return renderStaffEmpty("Ученики по вашим курсам пока не найдены.");
  }

  const grouped = groupBy(students, (student) => student.courseTitle);

  return `
    ${renderStaffMetricCards()}
    ${Object.entries(grouped)
      .map(
        ([courseTitle, courseStudents]) => `
          <section class="staff-group">
            <h2>${escapeHtml(courseTitle)}</h2>
            <div class="staff-card-grid">
              ${courseStudents
                .map(
                  (student) => `
                    <article class="staff-card">
                      <div class="staff-card__meta">
                        <span class="resource-chip is-blue">${escapeHtml(student.courseTitle)}</span>
                        <span class="resource-chip">${escapeHtml(student.grade ? `${student.grade} класс` : "класс не указан")}</span>
                        <span class="resource-chip is-green">${formatPercent(student.progressPercent)} курса</span>
                      </div>
                      <h3>${escapeHtml(student.studentName)}</h3>
                      <p>${escapeHtml(student.email || student.phone || "Контакты не указаны")}</p>
                      <p>Баллы: <strong>${formatNumber(student.pointsTotal)}</strong></p>
                      ${student.lastComment ? `<blockquote>${escapeHtml(student.lastComment)}</blockquote>` : ""}
                      ${renderStudentCommentForm(student)}
                    </article>
                  `,
                )
                .join("")}
            </div>
          </section>
        `,
      )
      .join("")}
  `;
}

function updateTopNotificationCount(count) {
  const badge = notificationButton?.querySelector("span");

  if (!badge) {
    return;
  }

  const normalized = Math.max(0, Number(count) || 0);
  badge.textContent = String(Math.min(normalized, 99));
  badge.classList.toggle("is-muted", normalized === 0);
}

function normalizeNotificationTone(tone = "") {
  return ["success", "warning", "danger", "info"].includes(tone) ? tone : "info";
}

function ensureNotificationPanel() {
  document.querySelector("#notification-strip")?.remove();

  if (!document.querySelector("#notification-panel")) {
    notificationButton?.insertAdjacentHTML(
      "afterend",
      `
        <section class="notification-popover is-hidden" id="notification-panel" aria-label="Уведомления">
          <header>
            <strong>Уведомления</strong>
            <span id="notification-panel-count">0 новых</span>
          </header>
          <div class="notification-popover__list" id="notification-panel-list"></div>
        </section>
      `,
    );
  }
}

function getNotificationActorKey() {
  if (hasAuthenticatedStaff()) {
    const staff = getStaffProfile();
    return `staff:${staff.role || "team"}:${staff.staffId || staff.login || "unknown"}`;
  }

  if (hasAuthenticatedAccount(latestAccount || currentAccount)) {
    const account = latestAccount || currentAccount;
    return `student:${account?.student?.studentId || account?.account?.login || "unknown"}`;
  }

  return "guest";
}

function getNotificationSeenStorageKey() {
  return `tutor-notifications-seen:${getNotificationActorKey()}`;
}

function getNotificationItemId(item, index = 0) {
  return String(item?.notificationId || `${item?.type || "event"}:${item?.createdAt || ""}:${item?.title || ""}:${index}`);
}

function readSeenNotificationIds() {
  try {
    return new Set(JSON.parse(localStorage.getItem(getNotificationSeenStorageKey()) || "[]"));
  } catch (error) {
    return new Set();
  }
}

function markNotificationsSeen(items = latestNotificationItems) {
  const ids = items.map(getNotificationItemId).filter(Boolean);

  try {
    localStorage.setItem(getNotificationSeenStorageKey(), JSON.stringify(ids));
  } catch (error) {
    console.info("Не удалось сохранить прочитанные уведомления.", error);
  }
}

function getUnseenNotificationCount(items = latestNotificationItems) {
  const seen = readSeenNotificationIds();
  return items.filter((item, index) => !seen.has(getNotificationItemId(item, index))).length;
}

function renderNotificationEventBars(item) {
  const total = Number(item.homeworkTotal || 0);

  if (!total) {
    return "";
  }

  const submitted = Number(item.submittedTotal || 0);
  const checked = Number(item.checkedTotal || 0);
  const curatorReviewed = Number(item.curatorReviewedTotal || 0);

  return `
    <div class="notification-bars">
      ${[
        ["Сдано", submitted, percentOf(submitted, total), "is-submitted"],
        ["Проверено", checked, percentOf(checked, total), "is-checked"],
      ]
        .map(
          ([label, value, percent, className]) => `
            <div class="staff-bar ${className}">
              <div>
                <strong>${escapeHtml(label)}</strong>
                <span>${formatNumber(value)} из ${formatNumber(total)}</span>
              </div>
              <i style="width: ${clampPercent(percent)}%"></i>
            </div>
          `,
        )
        .join("")}
      ${
        Number.isFinite(Number(item.curatorReviewedTotal))
          ? `
            <div class="staff-bar is-curator">
              <div>
                <strong>Фидбек куратора</strong>
                <span>${formatNumber(curatorReviewed)} из ${formatNumber(total)}</span>
              </div>
              <i style="width: ${clampPercent(percentOf(curatorReviewed, total))}%"></i>
            </div>
          `
          : ""
      }
    </div>
  `;
}

function renderNotificationPanelItems(items, emptyText) {
  ensureNotificationPanel();
  const panel = document.querySelector("#notification-panel");
  const list = document.querySelector("#notification-panel-list");
  const count = document.querySelector("#notification-panel-count");

  if (panel) {
    panel.classList.toggle("is-hidden", !notificationPanelOpen);
  }

  if (!list) {
    return;
  }

  const visibleItems = items.slice(0, 8);
  if (notificationPanelOpen) {
    markNotificationsSeen(visibleItems);
  }

  const unseenCount = getUnseenNotificationCount(visibleItems);
  updateTopNotificationCount(unseenCount);

  if (count) {
    count.textContent = `${formatNumber(unseenCount)} новых`;
  }

  if (visibleItems.length === 0) {
    list.innerHTML = `
      <article class="notification-pill is-info">
        <strong>Уведомлений нет</strong>
        <span>${escapeHtml(emptyText)}</span>
      </article>
    `;
    return;
  }

  list.innerHTML = visibleItems
    .map(
      (item, index) => `
        <article class="notification-pill is-${normalizeNotificationTone(item.tone)}" data-notification-id="${escapeHtml(getNotificationItemId(item, index))}">
          <strong>${escapeHtml(item.title || "Уведомление")}</strong>
          <span>${escapeHtml(item.text || "")}</span>
          ${item.createdAt ? `<small>${escapeHtml(formatStreamDate(item.createdAt))}</small>` : ""}
          ${renderNotificationEventBars(item)}
          ${item.link ? `<a href="${escapeHtml(item.link)}" target="${String(item.link).startsWith("#") ? "_self" : "_blank"}" rel="noopener noreferrer">Открыть</a>` : ""}
        </article>
      `,
    )
    .join("");
}

function getStudentNotificationItems(account = latestAccount) {
  if (!hasAuthenticatedAccount(account)) {
    return [];
  }

  return (account?.notifications || []).map((item) => ({
    notificationId: item.notificationId,
    type: item.type,
    tone: item.tone || (item.type === "Homework" ? "success" : "info"),
    title: item.title,
    text: item.text || item.type || formatStreamDate(item.createdAt),
    link: item.link,
    createdAt: item.createdAt,
  }));
}

function getStaffNotificationItems(workspace = latestStaffWorkspace) {
  if (!hasAuthenticatedStaff()) {
    return [];
  }

  return (workspace?.notifications || []).map((item) => ({
    notificationId: item.notificationId,
    type: item.type,
    tone: item.tone || "info",
    title: item.title,
    text: item.text,
    link: item.link,
    createdAt: item.createdAt,
    homeworkAssignmentId: item.homeworkAssignmentId,
    homeworkSubmissionId: item.homeworkSubmissionId,
    homeworkTemplateId: item.homeworkTemplateId,
    homeworkTotal: item.homeworkTotal,
    submittedTotal: item.submittedTotal,
    checkedTotal: item.checkedTotal,
    curatorReviewedTotal: item.curatorReviewedTotal,
    applicationsTotal: item.applicationsTotal,
    oldestPendingAt: item.oldestPendingAt,
  }));
}

function renderGlobalNotifications() {
  const emptyText = isStaffMode()
    ? "Новые события появятся после сдачи и проверки ДЗ."
    : "Здесь появятся новые трансляции и проверенные домашние задания.";

  latestNotificationItems = isStaffMode()
    ? getStaffNotificationItems()
    : getStudentNotificationItems(latestAccount || currentAccount);

  renderNotificationPanelItems(latestNotificationItems, emptyText);

  if (isStaffMode()) {
    return;
  }
}

function renderTeacherHomeworkLegacy() {
  const homeworks = getStaffItems("homeworks");

  if (homeworks.length === 0) {
    return renderStaffEmpty("Домашние задания по вашим курсам пока не найдены.");
  }

  const activeHomeworks = homeworks.filter((item) => !isStaffHomeworkChecked(item)).sort(sortHomeworkItems);
  const grouped = groupBy(activeHomeworks, getHomeworkLessonGroupKey);
  const stats = getStaffItems("homeworkStats");
  const groupedEntries = Object.entries(grouped).sort(([, left], [, right]) => sortHomeworkItems(left[0] || {}, right[0] || {}));

  return `
    ${renderHomeworkStatsOverview(stats)}
    ${
      groupedEntries.length === 0
        ? renderStaffEmpty("Все сданные работы уже проверены. Они лежат в архиве проверок.")
        : groupedEntries
            .map(([, items]) => {
              const summary = getHomeworkSummaryFromItems(items, stats);
              return `
        <section class="staff-group staff-lesson-group" id="${escapeHtml(summary.domId)}">
          <header class="staff-group-heading">
            <div>
              <span>${escapeHtml(summary.courseTitle || "Курс")}</span>
              <h2>Урок ${escapeHtml(summary.lessonNumber || "-")} · ${escapeHtml(summary.lessonTitle || "Домашнее задание")}</h2>
            </div>
            ${renderHomeworkStatChips(summary)}
          </header>
          ${renderHomeworkStatsBars(summary)}
          <div class="staff-card-grid">
            ${items
              .map((item) => {
                const status = getHomeworkStaffStatus(item);
                const canOpenSubmission = Boolean(item.submissionLink);
                return `
                  <article class="staff-card ${isStaffHomeworkSubmitted(item) ? "staff-card--pending" : "staff-card--muted"}">
                    <div class="staff-card__meta">
                      <span class="resource-chip ${status.className}">${status.label}</span>
                      <span class="resource-chip">${escapeHtml(item.studentName)}</span>
                      <span class="resource-chip">Урок ${escapeHtml(item.lessonNumber || "-")}</span>
                    </div>
                    <h3>${escapeHtml(getHomeworkDisplayTitle(item, "Домашнее задание"))}</h3>
                    <p>${escapeHtml(getHomeworkDisplayDescription(item))}</p>
                    <div class="staff-card__actions">
                      ${createStaffLink(item.taskLink, "Задание", "#icon-file")}
                      ${createStaffLink(item.submissionLink, canOpenSubmission ? "Работа ученика" : "Нет ссылки", "#icon-clipboard")}
                    </div>
                    ${
                      isStaffHomeworkSubmitted(item)
                        ? `
                          <form class="staff-review-form" data-staff-homework-review-form data-homework-assignment-id="${escapeHtml(item.homeworkAssignmentId)}">
                            <label>
                              Оценка
                              <input name="score" type="number" min="1" max="10" value="${escapeHtml(item.score ?? "")}" placeholder="1-10" required />
                            </label>
                            <label>
                              Комментарий
                              <textarea name="feedbackText" rows="3" placeholder="Комментарий ученику">${escapeHtml(item.feedbackText || "")}</textarea>
                            </label>
                            <button type="submit"><svg><use href="#icon-clipboard" /></svg>Проверить</button>
                            <p class="staff-form-status" aria-live="polite"></p>
                          </form>
                        `
                        : `
                          <div class="staff-reviewed-note is-muted">
                            <strong>Ждём ссылку от ученика</strong>
                            <span>Форма проверки появится после сдачи домашнего задания.</span>
                          </div>
                        `
                    }
                  </article>
                `;
              })
              .join("")}
          </div>
        </section>
              `;
            })
            .join("")
    }
  `;
}

function renderTeacherHomeworkCard(item) {
  const status = getHomeworkStaffStatus(item);
  const isChecked = isStaffHomeworkChecked(item);
  const isSubmitted = isStaffHomeworkSubmitted(item);
  const canReview = isSubmitted && !isChecked;
  const canOpenSubmission = Boolean(item.submissionLink);

  return `
    <article class="staff-card ${isChecked ? "staff-card--checked is-complete" : isSubmitted ? "staff-card--pending" : "staff-card--muted"}">
      <div class="staff-card__meta">
        <span class="resource-chip ${status.className}">${status.label}</span>
        <span class="resource-chip">${escapeHtml(item.studentName || "Ученик")}</span>
        ${item.submittedAt ? `<span class="resource-chip">${escapeHtml(formatStreamDate(item.submittedAt))}</span>` : ""}
      </div>
      <h3>${escapeHtml(getHomeworkDisplayTitle(item, "Домашнее задание"))}</h3>
      <p>${escapeHtml(getHomeworkDisplayDescription(item))}</p>
      <div class="staff-card__actions">
        ${createStaffLink(item.taskLink, "Задание", "#icon-file")}
        ${createStaffLink(item.submissionLink, canOpenSubmission ? "Работа ученика" : "Нет ссылки", "#icon-clipboard")}
      </div>
      ${
        isChecked
          ? renderTeacherCheckedHomeworkNote(item)
          : canReview
            ? `
              <form class="staff-review-form" data-staff-homework-review-form data-homework-assignment-id="${escapeHtml(item.homeworkAssignmentId)}">
                <label>
                  Оценка
                  <input name="score" type="number" min="1" max="10" value="${escapeHtml(item.score ?? "")}" placeholder="1-10" required />
                </label>
                <label>
                  Комментарий
                  <textarea name="feedbackText" rows="3" placeholder="Комментарий ученику">${escapeHtml(item.feedbackText || "")}</textarea>
                </label>
                <button type="submit"><svg><use href="#icon-clipboard" /></svg>Проверить</button>
                <p class="staff-form-status" aria-live="polite"></p>
              </form>
            `
            : `
              <div class="staff-reviewed-note is-muted">
                <strong>Ждём ссылку от ученика</strong>
                <span>Форма проверки появится после сдачи домашнего задания.</span>
              </div>
            `
      }
    </article>
  `;
}

function renderTeacherHomework() {
  const homeworks = getStaffItems("homeworks").sort(sortHomeworkItems);
  const stats = getStaffItems("homeworkStats");

  if (homeworks.length === 0 && stats.length === 0) {
    return renderStaffEmpty("Домашние задания по вашим курсам пока не найдены.");
  }

  const state = getStaffDrilldown("homework");
  const courseSummaries = getHomeworkCourseSummaries(stats);

  if (!state.courseId) {
    return renderHomeworkCourseStep("homework", stats);
  }

  const courseSummary = courseSummaries.find((summary) => matchesCourseSelection(summary, state.courseId));
  const lessonSummaries = getHomeworkLessonSummariesForCourse(state.courseId, stats);

  if (!state.lessonKey) {
    return renderHomeworkLessonStep("homework", courseSummary, lessonSummaries);
  }

  const lessonSummary = lessonSummaries.find((summary) => summary.key === state.lessonKey);
  const lessonItems = homeworks
    .filter((item) => matchesCourseSelection(item, state.courseId) && getHomeworkLessonGroupKey(item) === state.lessonKey)
    .sort(sortHomeworkItems);

  return renderHomeworkLessonWorkspace("homework", courseSummary, lessonSummary, lessonItems, renderTeacherHomeworkCard);
}

function renderTeacherCorrectionCard(item) {
  const status = getHomeworkStaffStatus(item);
  const isChecked = isStaffHomeworkChecked(item);
  const isSubmitted = isStaffHomeworkSubmitted(item);
  const canReview = isSubmitted && !isChecked;
  const canOpenSubmission = Boolean(item.submissionLink);

  return `
    <article class="staff-card ${isChecked ? "staff-card--checked is-complete" : isSubmitted ? "staff-card--pending" : "staff-card--muted"}">
      <div class="staff-card__meta">
        <span class="resource-chip ${status.className}">${status.label}</span>
        <span class="resource-chip is-yellow">Работа над ошибками</span>
        <span class="resource-chip">${escapeHtml(item.studentName || "Ученик")}</span>
        ${item.submittedAt ? `<span class="resource-chip">${escapeHtml(formatStreamDate(item.submittedAt))}</span>` : ""}
      </div>
      <h3>${escapeHtml(getHomeworkDisplayTitle(item, "Работа над ошибками"))}</h3>
      <p>${escapeHtml(getHomeworkDisplayDescription(item))}</p>
      <div class="staff-card__actions">
        ${createStaffLink(item.taskLink, "Задание", "#icon-file")}
        ${createStaffLink(item.submissionLink, canOpenSubmission ? "Работа ученика" : "Нет ссылки", "#icon-clipboard")}
      </div>
      ${
        isChecked
          ? renderTeacherCheckedHomeworkNote(item)
          : canReview
            ? `
              <form class="staff-review-form" data-staff-correction-review-form data-correction-id="${escapeHtml(item.correctionId)}">
                <label>
                  Оценка
                  <input name="score" type="number" min="1" max="10" value="${escapeHtml(item.score ?? "")}" placeholder="1-10" required />
                </label>
                <label>
                  Комментарий
                  <textarea name="feedbackText" rows="3" placeholder="Комментарий ученику">${escapeHtml(item.feedbackText || "")}</textarea>
                </label>
                <button type="submit"><svg><use href="#icon-clipboard" /></svg>Проверить исправление</button>
                <p class="staff-form-status" aria-live="polite"></p>
              </form>
            `
            : `
              <div class="staff-reviewed-note is-muted">
                <strong>Ждём работу над ошибками</strong>
                <span>Форма проверки появится после того, как ученик прикрепит ссылку.</span>
              </div>
            `
      }
    </article>
  `;
}

function renderHomeworkModeTabs(mode = "homeworks") {
  return `
    <div class="course-section-tabs staff-subtabs" data-staff-homework-mode-tabs>
      <button type="button" class="${mode === "homeworks" ? "is-active" : ""}" data-staff-homework-mode="homeworks">
        <svg><use href="#icon-clipboard" /></svg>Обычные ДЗ
      </button>
      <button type="button" class="${mode === "corrections" ? "is-active" : ""}" data-staff-homework-mode="corrections">
        <svg><use href="#icon-clock" /></svg>Работа над ошибками
      </button>
    </div>
  `;
}

function renderTeacherHomeworkEnhanced() {
  const state = getStaffDrilldown("homework");
  const mode = state.mode === "corrections" ? "corrections" : "homeworks";
  const items = getStaffItems(mode === "corrections" ? "corrections" : "homeworks").sort(sortHomeworkItems);
  const stats = getStaffItems(mode === "corrections" ? "correctionStats" : "homeworkStats");
  const modeTabs = renderHomeworkModeTabs(mode);

  if (items.length === 0 && stats.length === 0) {
    return `${modeTabs}${renderStaffEmpty(mode === "corrections" ? "Работ над ошибками по вашим курсам пока нет." : "Домашние задания по вашим курсам пока не найдены.")}`;
  }

  const courseSummaries = getHomeworkCourseSummaries(stats);

  if (!state.courseId) {
    return `${modeTabs}${renderHomeworkCourseStep("homework", stats)}`;
  }

  const courseSummary = courseSummaries.find((summary) => matchesCourseSelection(summary, state.courseId));
  const lessonSummaries = getHomeworkLessonSummariesForCourse(state.courseId, stats);

  if (!state.lessonKey) {
    return `${modeTabs}${renderHomeworkLessonStep("homework", courseSummary, lessonSummaries)}`;
  }

  const lessonSummary = lessonSummaries.find((summary) => summary.key === state.lessonKey);
  const lessonItems = items
    .filter((item) => matchesCourseSelection(item, state.courseId) && getHomeworkLessonGroupKey(item) === state.lessonKey)
    .sort(sortHomeworkItems);

  return `${modeTabs}${renderHomeworkLessonWorkspace("homework", courseSummary, lessonSummary, lessonItems, mode === "corrections" ? renderTeacherCorrectionCard : renderTeacherHomeworkCard)}`;
}

function renderTeacherArchivePage() {
  const checkedHomeworks = getStaffItems("homeworks").filter(isStaffHomeworkChecked).sort(sortHomeworkItems);

  if (checkedHomeworks.length === 0) {
    return `
      ${renderHomeworkStatsOverview(getStaffItems("homeworkStats"))}
      ${renderStaffEmpty("Проверенных домашних заданий в архиве пока нет.")}
    `;
  }

  const grouped = groupBy(checkedHomeworks, getHomeworkLessonGroupKey);

  return `
    ${renderHomeworkStatsOverview(getStaffItems("homeworkStats"))}
    ${Object.entries(grouped)
      .sort(([, left], [, right]) => sortHomeworkItems(left[0] || {}, right[0] || {}))
      .map(([, items]) => {
        const summary = getHomeworkSummaryFromItems(items);
        return `
          <section class="staff-group staff-lesson-group" id="${escapeHtml(summary.domId)}">
            <header class="staff-group-heading">
              <div>
                <span>${escapeHtml(summary.courseTitle || "Курс")}</span>
                <h2>Урок ${escapeHtml(summary.lessonNumber || "-")} · ${escapeHtml(summary.lessonTitle || "Домашнее задание")}</h2>
              </div>
              ${renderHomeworkStatChips(summary)}
            </header>
            <div class="staff-card-grid">
              ${items
                .map(
                  (item) => `
                    <article class="staff-card staff-card--archived">
                      <div class="staff-card__meta">
                        <span class="resource-chip is-green">Проверено</span>
                        <span class="resource-chip">${escapeHtml(item.studentName)}</span>
                        ${item.checkedAt ? `<span class="resource-chip">${escapeHtml(formatStreamDate(item.checkedAt))}</span>` : ""}
                      </div>
                      <h3>${escapeHtml(getHomeworkDisplayTitle(item, "Домашнее задание"))}</h3>
                      <p>${escapeHtml(getHomeworkDisplayDescription(item))}</p>
                      <div class="staff-card__actions">
                        ${createStaffLink(item.taskLink, "Задание", "#icon-file")}
                        ${createStaffLink(item.submissionLink, "Работа ученика", "#icon-clipboard")}
                      </div>
                      ${renderTeacherCheckedHomeworkNote(item)}
                    </article>
                  `,
                )
                .join("")}
            </div>
          </section>
        `;
      })
      .join("")}
  `;
}

function renderLessonForm(course, lesson = {}) {
  const isEdit = Boolean(lesson.lessonId);

  return `
    <form class="staff-lesson-form" data-staff-lesson-form>
      <input type="hidden" name="courseId" value="${escapeHtml(course.courseId)}" />
      <input type="hidden" name="lessonId" value="${escapeHtml(lesson.lessonId || "")}" />
      <label>
        Номер
        <input name="lessonNumber" type="number" min="1" value="${escapeHtml(lesson.lessonNumber || "")}" placeholder="авто" />
      </label>
      <label>
        Название урока
        <input name="lessonTitle" type="text" value="${escapeHtml(lesson.lessonTitle || "")}" placeholder="Название урока" required />
      </label>
      <label>
        Тема
        <input name="topic" type="text" value="${escapeHtml(lesson.topic || "")}" placeholder="Краткая тема урока" />
      </label>
      <label>
        Видео
        <input name="videoUrl" type="url" value="${escapeHtml(lesson.videoUrl || "")}" placeholder="https://..." />
      </label>
      <label>
        Конспект
        <input name="notesUrl" type="url" value="${escapeHtml(lesson.notesUrl || "")}" placeholder="https://..." />
      </label>
      <label>
        Домашнее задание
        <input name="homeworkUrl" type="url" value="${escapeHtml(lesson.homeworkUrl || "")}" placeholder="https://..." />
      </label>
      <button type="submit"><svg><use href="#icon-upload" /></svg>${isEdit ? "Сохранить урок" : "Создать урок"}</button>
      <p class="staff-form-status" aria-live="polite"></p>
    </form>
  `;
}

function renderStreamStatusOptions(selectedStatus = "Planned") {
  const labels = {
    Planned: "Запланирована",
    Live: "Идёт сейчас",
    Done: "Завершена",
    Cancelled: "Отменена",
  };

  return Object.entries(labels)
    .map(([value, label]) => `<option value="${escapeHtml(value)}" ${String(selectedStatus || "Planned") === value ? "selected" : ""}>${escapeHtml(label)}</option>`)
    .join("");
}

function renderStreamForm(course, stream = {}) {
  const isEdit = Boolean(stream.streamId);

  return `
    <form class="staff-stream-form" data-staff-stream-form>
      <input type="hidden" name="courseId" value="${escapeHtml(course.courseId)}" />
      <input type="hidden" name="streamId" value="${escapeHtml(stream.streamId || "")}" />
      <label>
        Урок
        <select name="lessonId">
          <option value="">Без привязки</option>
          ${getStaffLessonOptions(course.courseId, stream.lessonId || "")}
        </select>
      </label>
      <label>
        Название
        <input name="streamTitle" type="text" value="${escapeHtml(stream.streamTitle || "")}" placeholder="Разбор задач" required />
      </label>
      <label>
        Дата и время
        <input name="startsAt" type="datetime-local" value="${escapeHtml(toDateTimeLocalValue(stream.startsAt))}" required />
      </label>
      <label>
        Ссылка
        <input name="streamLink" type="url" value="${escapeHtml(stream.streamLink || "")}" placeholder="https://meet.google.com/..." required />
      </label>
      <label>
        Статус
        <select name="status">${renderStreamStatusOptions(stream.status || "Planned")}</select>
      </label>
      <button type="submit"><svg><use href="#icon-broadcast" /></svg>${isEdit ? "Сохранить трансляцию" : "Создать трансляцию"}</button>
      <p class="staff-form-status" aria-live="polite"></p>
    </form>
  `;
}

function getTeacherCourseVisual(course) {
  const fallback = courseData[course.courseSlug] || {};
  return {
    iconClass: fallback.iconClass || "illustration-math",
    iconSymbol: fallback.iconSymbol || "#course-math",
    description: course.description || fallback.description || "Уроки, конспекты, домашние задания и трансляции",
  };
}

function renderTeacherLessonRow(course, lesson) {
  return `
    <article class="lesson-row staff-teacher-lesson-row">
      <span class="lesson-number">${escapeHtml(lesson.lessonNumber || "-")}</span>
      <div class="lesson-copy">
        <h3>Урок ${escapeHtml(lesson.lessonNumber || "-")}. ${escapeHtml(lesson.lessonTitle || "Новый урок")}</h3>
        <p>${escapeHtml(lesson.topic || "Тема не указана")}</p>
      </div>
      <span class="lesson-status status-open">
        <svg><use href="#icon-play" /></svg>${escapeHtml(lesson.lessonStatus || "Open")}
      </span>
      <div class="lesson-actions">
        ${lesson.videoUrl ? `<a href="${escapeHtml(lesson.videoUrl)}" target="_blank" rel="noopener noreferrer"><svg><use href="#icon-play" /></svg>Видео</a>` : `<button type="button" disabled><svg><use href="#icon-play" /></svg>Видео</button>`}
        ${lesson.notesUrl ? `<a href="${escapeHtml(lesson.notesUrl)}" target="_blank" rel="noopener noreferrer"><svg><use href="#icon-file" /></svg>Конспект</a>` : `<button type="button" disabled><svg><use href="#icon-file" /></svg>Конспект</button>`}
        ${lesson.homeworkUrl ? `<a href="${escapeHtml(lesson.homeworkUrl)}" target="_blank" rel="noopener noreferrer"><svg><use href="#icon-clipboard" /></svg>ДЗ</a>` : `<button type="button" disabled><svg><use href="#icon-clipboard" /></svg>ДЗ</button>`}
      </div>
      <details class="staff-details staff-lesson-editor">
        <summary>Редактировать урок и материалы</summary>
        ${renderLessonForm(course, lesson)}
      </details>
    </article>
  `;
}

function renderTeacherStreamCard(course, stream) {
  const timedStatus = getEventStatusMeta({ ...stream, eventType: "stream" });
  const statusLabel =
    stream.status === "Done"
      ? "Завершена"
      : stream.status === "Cancelled"
        ? "Отменена"
        : timedStatus.label || "Запланирована";
  const statusClass = stream.status === "Done" ? "is-muted" : stream.status === "Cancelled" ? "is-yellow" : timedStatus.className || "is-blue";

  return `
    <article class="staff-card staff-stream-card">
      <div class="staff-card__meta">
        <span class="resource-chip ${statusClass}">${escapeHtml(statusLabel)}</span>
        ${stream.startsAt ? `<span class="resource-chip">${escapeHtml(formatStreamDate(stream.startsAt))}</span>` : ""}
        <span class="resource-chip">${stream.lessonNumber ? `Урок ${escapeHtml(stream.lessonNumber)}` : "Общий эфир"}</span>
      </div>
      <h3>${escapeHtml(stream.streamTitle || "Трансляция")}</h3>
      <p>${escapeHtml(stream.lessonTitle || course.courseTitle || "Трансляция курса")}</p>
      <div class="staff-card__actions">
        ${createStaffLink(stream.streamLink, "Открыть трансляцию", "#icon-broadcast")}
      </div>
      <details class="staff-details">
        <summary>Редактировать трансляцию</summary>
        ${renderStreamForm(course, stream)}
      </details>
    </article>
  `;
}

function renderTeacherCourseStepCard(course, lessons) {
  const visual = getTeacherCourseVisual(course);

  return `
    <button class="staff-step-card staff-course-step-card" type="button" data-staff-open-course="courses" data-course-id="${escapeHtml(getCourseSelectionKey(course))}">
      <div class="staff-course-step-card__body">
        <div class="course-illustration ${escapeHtml(visual.iconClass)}" aria-hidden="true">
          <svg class="course-illustration__icon"><use href="${escapeHtml(visual.iconSymbol)}" /></svg>
        </div>
        <div class="staff-step-card__top">
          <span>${escapeHtml(course.teacherName || "Ваш курс")}</span>
          <strong>${escapeHtml(course.courseTitle || "Курс")}</strong>
        </div>
      </div>
      <p>${escapeHtml(visual.description)}</p>
      <div class="staff-step-card__meta">
        <span class="resource-chip">${formatNumber(lessons.length)} урок.</span>
        <span class="resource-chip is-blue">${formatNumber(course.studentsCount || 0)} учен.</span>
        <span class="resource-chip is-green">${formatNumber(course.homeworksCount || 0)} ДЗ</span>
        <span class="resource-chip">${formatNumber(course.streamsCount || 0)} трансляц.</span>
      </div>
    </button>
  `;
}

function renderTeacherCourses() {
  const courses = getStaffItems("courses");
  const lessonsByCourse = groupBy(getStaffItems("lessons"), (lesson) => lesson.courseId);
  const streamsByCourse = groupBy(getStaffItems("streams"), (stream) => stream.courseId);

  if (courses.length === 0) {
    return renderStaffEmpty("Курсы преподавателя пока не найдены.");
  }

  const state = getStaffDrilldown("courses");

  if (!state.courseId) {
    return `
      ${renderStaffStepHeading("Курсы преподавателя", "Выберите курс, чтобы открыть уроки, материалы и инструменты")}
      <div class="staff-step-grid">
        ${courses
          .map((course) => {
            const lessons = (lessonsByCourse[course.courseId] || []).sort((a, b) => Number(a.lessonNumber || 0) - Number(b.lessonNumber || 0));
            return renderTeacherCourseStepCard(course, lessons);
          })
          .join("")}
      </div>
    `;
  }

  const selectedCourse = courses.find((course) => matchesCourseSelection(course, state.courseId));

  if (!selectedCourse) {
    return `
      ${renderStaffStepHeading("Курсы преподавателя", "Выбранный курс не найден", renderStaffStepBack("courses", "courses", "", "К курсам"))}
      ${renderStaffEmpty("Курс мог быть изменён в базе. Вернитесь к списку и выберите курс заново.")}
    `;
  }

  const lessons = (lessonsByCourse[selectedCourse.courseId] || []).sort((a, b) => Number(a.lessonNumber || 0) - Number(b.lessonNumber || 0));
  const courseStreams = (streamsByCourse[selectedCourse.courseId] || []).sort((a, b) => new Date(b.startsAt || 0) - new Date(a.startsAt || 0));
  const visual = getTeacherCourseVisual(selectedCourse);

  return `
    ${renderStaffStepHeading(selectedCourse.courseTitle || "Курс", "Уроки, материалы и инструменты курса", renderStaffStepBack("courses", "courses", "", "К курсам"))}
    <section class="staff-group staff-teacher-course">
      <article class="course-card staff-course-card is-selected">
        <div class="course-card__body">
          <div class="course-illustration ${escapeHtml(visual.iconClass)}" aria-hidden="true">
            <svg class="course-illustration__icon"><use href="${escapeHtml(visual.iconSymbol)}" /></svg>
          </div>
          <div class="course-info">
            <h2>${escapeHtml(selectedCourse.courseTitle)}</h2>
            <p>${escapeHtml(visual.description)}</p>
            <div class="progress-line">
              <span class="progress-text">${formatNumber(lessons.length)} уроков · ${formatNumber(selectedCourse.studentsCount || 0)} учеников</span>
              <div class="progress-track"><span style="width: ${clampPercent(lessons.length ? 100 : 0)}%"></span></div>
              <span class="progress-percent">${formatNumber(selectedCourse.homeworksCount || 0)} ДЗ</span>
            </div>
            <div class="course-actions">
              <button type="button" data-staff-scroll-target="teacher-course-lessons-${escapeHtml(selectedCourse.courseId)}"><svg><use href="#icon-play" /></svg>Уроки</button>
              <button type="button" data-staff-scroll-target="teacher-course-create-${escapeHtml(selectedCourse.courseId)}"><svg><use href="#icon-upload" /></svg>Новый урок</button>
              <button type="button" data-staff-scroll-target="teacher-course-stream-${escapeHtml(selectedCourse.courseId)}"><svg><use href="#icon-broadcast" /></svg>Трансляция</button>
            </div>
          </div>
        </div>
      </article>
      <section class="staff-panel" id="teacher-course-lessons-${escapeHtml(selectedCourse.courseId)}">
        <header class="staff-panel-heading">
          <h3>Уроки курса</h3>
          <span>${formatNumber(lessons.length)} материалов</span>
        </header>
        <div class="lesson-list staff-teacher-lesson-list">
          ${
            lessons.length
              ? lessons.map((lesson) => renderTeacherLessonRow(selectedCourse, lesson)).join("")
              : renderStaffEmpty("В этом курсе пока нет уроков.")
          }
        </div>
      </section>
      <div class="staff-course-tools staff-course-tools--wide">
        <section class="staff-panel" id="teacher-course-create-${escapeHtml(selectedCourse.courseId)}">
          <h3>Создать урок, конспект и ДЗ</h3>
          <p>Если заполнить ссылки на конспект и домашнее задание, сайт автоматически создаст связанные записи в базе и выдаст ДЗ ученикам курса.</p>
          ${renderLessonForm(selectedCourse)}
        </section>
        <section class="staff-panel" id="teacher-course-stream-${escapeHtml(selectedCourse.courseId)}">
          <h3>Создать трансляцию</h3>
          <p>Трансляция появится у учеников курса и в уведомлениях.</p>
          ${renderStreamForm(selectedCourse)}
        </section>
      </div>
      <section class="staff-panel">
        <header class="staff-panel-heading">
          <h3>Трансляции курса</h3>
          <span>${formatNumber(courseStreams.length)} шт.</span>
        </header>
        <div class="staff-card-grid">
          ${
            courseStreams.length
              ? courseStreams.map((stream) => renderTeacherStreamCard(selectedCourse, stream)).join("")
              : renderStaffEmpty("Трансляций по этому курсу пока нет. Создайте первую выше.")
          }
        </div>
      </section>
    </section>
  `;
}

function renderCuratorTeachersLegacy() {
  const teachers = getStaffItems("teachers");

  if (teachers.length === 0) {
    return renderStaffEmpty("Преподаватели для этого куратора пока не найдены.");
  }

  return `
    ${renderStaffMetricCards()}
    <div class="staff-card-grid">
      ${teachers
        .map(
          (teacher) => `
            <article class="staff-card">
              <div class="staff-card__meta">
                <span class="resource-chip is-blue">${formatNumber(teacher.coursesCount)} курс.</span>
                <span class="resource-chip is-green">${formatNumber(teacher.studentsCount)} учен.</span>
              </div>
              <h3>${escapeHtml(teacher.teacherName)}</h3>
              <p>${escapeHtml(teacher.email || teacher.phone || "Контакты не указаны")}</p>
              <p>Рейтинг: <strong>${escapeHtml(teacher.rating || "нет")}</strong></p>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderCuratorTeachers() {
  const teachers = getStaffItems("teachers");
  const courses = getStaffItems("courses");
  const students = getStaffItems("students");

  if (teachers.length === 0) {
    return renderStaffEmpty("Преподаватели для этого куратора пока не найдены.");
  }

  return `
    ${renderStaffMetricCards()}
    <div class="staff-card-grid">
      ${teachers
        .map((teacher) => {
          const teacherCourses = courses.filter((course) => matchesTeacherSelection(course, teacher));
          const teacherCourseIds = new Set(teacherCourses.map((course) => String(course.courseId)));
          const teacherStudents = students.filter((student) => matchesTeacherSelection(student, teacher) || teacherCourseIds.has(String(student.courseId)));
          const studentsByCourse = groupBy(teacherStudents, (student) => student.courseTitle || "Курс не указан");

          return `
            <article class="staff-card staff-teacher-card">
              <div class="staff-card__meta">
                <span class="resource-chip is-blue">${formatNumber(teacherCourses.length || teacher.coursesCount || 0)} курс.</span>
                <span class="resource-chip is-green">${formatNumber(teacherStudents.length || teacher.studentsCount || 0)} учен.</span>
                <span class="resource-chip">Рейтинг: ${escapeHtml(teacher.rating || "нет")}</span>
              </div>
              <h3>${escapeHtml(teacher.teacherName)}</h3>
              <p>${escapeHtml(teacher.email || teacher.phone || "Контакты не указаны")}</p>
              <details class="staff-details staff-teacher-details">
                <summary>Ученики и курсы преподавателя</summary>
                <div class="staff-teacher-details-grid">
                  <section>
                    <h4>Курсы</h4>
                    <div class="staff-mini-list">
                      ${
                        teacherCourses.length
                          ? teacherCourses
                              .map(
                                (course) => `
                                  <div class="staff-mini-row">
                                    <strong>${escapeHtml(course.courseTitle)}</strong>
                                    <span>${formatNumber(course.lessonsCount || course.totalLessons || 0)} урок. · ${formatNumber(course.studentsCount || 0)} учен.</span>
                                  </div>
                                `,
                              )
                              .join("")
                          : `<div class="staff-mini-row is-muted"><strong>Курсы не найдены</strong><span>Проверьте привязку преподавателя к курсам в базе.</span></div>`
                      }
                    </div>
                  </section>
                  <section>
                    <h4>Ученики</h4>
                    <div class="staff-mini-list">
                      ${
                        teacherStudents.length
                          ? Object.entries(studentsByCourse)
                              .map(
                                ([courseTitle, courseStudents]) => `
                                  <div class="staff-mini-row">
                                    <strong>${escapeHtml(courseTitle)}</strong>
                                    <span>${courseStudents.map((student) => escapeHtml(student.studentName)).join(" · ")}</span>
                                  </div>
                                `,
                              )
                              .join("")
                          : `<div class="staff-mini-row is-muted"><strong>Ученики не закреплены</strong><span>После привязки в админке они появятся здесь.</span></div>`
                      }
                    </div>
                  </section>
                </div>
              </details>
            </article>
          `;
        })
        .join("")}
    </div>
  `;
}

function getCuratorCallStudents() {
  const unique = new Map();

  getStaffItems("students").forEach((student) => {
    if (student.studentId && !unique.has(String(student.studentId))) {
      unique.set(String(student.studentId), student);
    }
  });

  return [...unique.values()].sort((left, right) => String(left.studentName || "").localeCompare(String(right.studentName || ""), "ru"));
}

function renderCallStatusOptions(selectedStatus = "Planned") {
  const labels = {
    Planned: "Запланирован",
    Done: "Завершён",
    Cancelled: "Отменён",
  };

  return Object.entries(labels)
    .map(([value, label]) => `<option value="${escapeHtml(value)}" ${String(selectedStatus || "Planned") === value ? "selected" : ""}>${escapeHtml(label)}</option>`)
    .join("");
}

function renderCuratorCallForm(call = {}) {
  const students = getCuratorCallStudents();
  const selectedIds = new Set((call.students || []).map((student) => String(student.studentId)));
  const isEdit = Boolean(call.callId);

  return `
    <form class="staff-lesson-form staff-call-form" data-staff-call-form>
      <input type="hidden" name="callId" value="${escapeHtml(call.callId || "")}" />
      <label>
        Название
        <input name="callTitle" type="text" value="${escapeHtml(call.callTitle || "")}" placeholder="Созвон по прогрессу" required />
      </label>
      <label>
        Дата и время
        <input name="startsAt" type="datetime-local" value="${escapeHtml(toDateTimeLocalValue(call.startsAt))}" required />
      </label>
      <label>
        Ссылка
        <input name="callLink" type="url" value="${escapeHtml(call.callLink || "")}" placeholder="https://meet.google.com/..." />
      </label>
      <label>
        Статус
        <select name="status">${renderCallStatusOptions(call.status || "Planned")}</select>
      </label>
      <label>
        Ученики
        <select name="studentIds" multiple size="6" required>
          ${students
            .map(
              (student) =>
                `<option value="${escapeHtml(student.studentId)}" ${selectedIds.has(String(student.studentId)) ? "selected" : ""}>${escapeHtml(student.studentName)}${student.courseTitle ? ` · ${escapeHtml(student.courseTitle)}` : ""}</option>`,
            )
            .join("")}
        </select>
      </label>
      <button type="submit" ${students.length ? "" : "disabled"}><svg><use href="#icon-clock" /></svg>${isEdit ? "Сохранить созвон" : "Создать созвон"}</button>
      <p class="staff-form-status" aria-live="polite"></p>
    </form>
  `;
}

function renderCuratorCalls() {
  const calls = getStaffItems("calls");

  return `
    <section class="staff-panel">
      <h2>Новый созвон</h2>
      ${renderCuratorCallForm()}
    </section>
    <section class="staff-group">
      <header class="staff-group-heading">
        <div>
          <span>Календарь куратора</span>
          <h2>Созвоны с учениками</h2>
        </div>
        <span class="resource-chip is-blue">${formatNumber(calls.length)} шт.</span>
      </header>
      <div class="staff-card-grid">
        ${
          calls.length
            ? calls
                .map(
                  (call) => `
                    <article class="staff-card">
                      <div class="staff-card__meta">
                        <span class="resource-chip is-blue">${escapeHtml(call.status === "Done" ? "Завершён" : call.status === "Cancelled" ? "Отменён" : "Запланирован")}</span>
                        ${call.startsAt ? `<span class="resource-chip">${escapeHtml(formatStreamDate(call.startsAt))}</span>` : ""}
                      </div>
                      <h3>${escapeHtml(call.callTitle || "Созвон")}</h3>
                      <p>${escapeHtml((call.students || []).map((student) => student.studentName).filter(Boolean).join(" · ") || "Ученики не указаны")}</p>
                      <div class="staff-card__actions">
                        ${createStaffLink(call.callLink, "Открыть созвон", "#icon-clock")}
                      </div>
                      <details class="staff-details">
                        <summary>Редактировать созвон</summary>
                        ${renderCuratorCallForm(call)}
                      </details>
                    </article>
                  `,
                )
                .join("")
            : renderStaffEmpty("Созвонов пока нет. Создайте первый созвон с учениками выше.")
        }
      </div>
    </section>
  `;
}

function getCuratorResourceConfig(pageName) {
  const homeworkState = getStaffDrilldown("homework");
  const homeworkMode = homeworkState.mode === "corrections" ? "corrections" : "homeworks";
  const configs = {
    lessons: {
      items: getStaffItems("lessons"),
      resourceType: "Lesson",
      idField: "lessonId",
      title: (item) => `Урок ${item.lessonNumber}. ${item.lessonTitle}`,
      text: (item) => item.topic || item.courseTitle,
      link: (item) => item.videoUrl,
      linkLabel: "Видео",
      empty: "Уроки по закрепленным преподавателям не найдены.",
    },
    notes: {
      items: getStaffItems("notes"),
      resourceType: "Note",
      idField: "noteId",
      title: (item) => item.materialTitle,
      text: (item) => item.lessonTitle || item.courseTitle,
      link: (item) => item.fileUrl,
      linkLabel: "Конспект",
      empty: "Конспекты по закрепленным преподавателям не найдены.",
    },
    homework: {
      items: getStaffItems(homeworkMode === "corrections" ? "corrections" : "homeworks"),
      resourceType: homeworkMode === "corrections" ? "Correction" : "Homework",
      idField: homeworkMode === "corrections" ? "correctionId" : "homeworkAssignmentId",
      title: (item) => item.homeworkTitle,
      text: (item) => `${item.studentName || "Ученик"} · ${item.lessonTitle || item.courseTitle}`,
      link: (item) => item.taskLink,
      linkLabel: "Задание",
      empty: "Домашние задания по закрепленным преподавателям не найдены.",
    },
    streams: {
      items: getStaffItems("streams"),
      resourceType: "Stream",
      idField: "streamId",
      title: (item) => item.streamTitle,
      text: (item) => `${formatStreamDate(item.startsAt)} · ${item.lessonTitle || item.courseTitle}`,
      link: (item) => item.streamLink,
      linkLabel: "Трансляция",
      empty: "Трансляции по закрепленным преподавателям не найдены.",
    },
  };

  return configs[pageName];
}

function getFilterValue(pageName, key) {
  return staffFilters[pageName]?.[key] || "";
}

function setFilterValue(pageName, key, value) {
  staffFilters[pageName] = staffFilters[pageName] || {};
  staffFilters[pageName][key] = value;
}

function renderCuratorFilters(pageName, items) {
  const teachers = [...new Set(items.map((item) => item.teacherName).filter(Boolean))];
  const courses = [...new Set(items.map((item) => item.courseTitle).filter(Boolean))];
  const selectedTeacher = getFilterValue(pageName, "teacher");
  const selectedCourse = getFilterValue(pageName, "course");

  return `
    <div class="staff-filterbar" data-staff-filter-scope="${escapeHtml(pageName)}">
      <label>
        Преподаватель
        <select data-staff-filter="teacher">
          <option value="">Все</option>
          ${teachers.map((teacher) => `<option value="${escapeHtml(teacher)}" ${teacher === selectedTeacher ? "selected" : ""}>${escapeHtml(teacher)}</option>`).join("")}
        </select>
      </label>
      <label>
        Предмет / курс
        <select data-staff-filter="course">
          <option value="">Все</option>
          ${courses.map((course) => `<option value="${escapeHtml(course)}" ${course === selectedCourse ? "selected" : ""}>${escapeHtml(course)}</option>`).join("")}
        </select>
      </label>
    </div>
  `;
}

function applyCuratorFilters(pageName, items) {
  const selectedTeacher = getFilterValue(pageName, "teacher");
  const selectedCourse = getFilterValue(pageName, "course");

  return items.filter((item) => {
    const teacherMatches = !selectedTeacher || item.teacherName === selectedTeacher;
    const courseMatches = !selectedCourse || item.courseTitle === selectedCourse;
    return teacherMatches && courseMatches;
  });
}

function renderResourceReviewForm(config, item) {
  const resourceId = item[config.idField];
  const currentRating = item.curatorRating || "";

  if (isCuratorReviewed(item)) {
    return renderCuratorReviewNote(item);
  }

  return `
    <form class="staff-inline-form" data-staff-resource-review-form data-resource-type="${escapeHtml(config.resourceType)}" data-resource-id="${escapeHtml(resourceId)}">
      <select name="rating" aria-label="Оценка">
        <option value="">Оценка</option>
        ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => `<option value="${value}" ${String(value) === String(currentRating) ? "selected" : ""}>${value}</option>`).join("")}
      </select>
      <input name="commentText" type="text" value="${escapeHtml(item.curatorComment || "")}" placeholder="Комментарий к материалу" />
      <button type="submit"><svg><use href="#icon-star" /></svg>Сохранить</button>
      <p class="staff-form-status" aria-live="polite"></p>
    </form>
  `;
}

function applyCuratorFiltersToStats(pageName, stats) {
  const selectedTeacher = getFilterValue(pageName, "teacher");
  const selectedCourse = getFilterValue(pageName, "course");

  return (stats || []).filter((stat) => {
    const teacherMatches = !selectedTeacher || stat.teacherName === selectedTeacher;
    const courseMatches = !selectedCourse || stat.courseTitle === selectedCourse;
    return teacherMatches && courseMatches;
  });
}

function renderCuratorHomeworkReviewArea(config, item) {
  if (isCuratorReviewed(item)) {
    return renderCuratorReviewNote(item);
  }

  if (!isStaffHomeworkChecked(item)) {
    return `
      <div class="staff-reviewed-note is-muted">
        <strong>Кураторская оценка пока закрыта</strong>
        <span>Сначала преподаватель должен проверить работу ученика.</span>
      </div>
    `;
  }

  return renderResourceReviewForm(config, item);
}

function renderCuratorHomeworkPageLegacy(pageName, config, items) {
  const filteredItems = applyCuratorFilters(pageName, items);
  const activeItems = filteredItems.filter((item) => !isCuratorReviewed(item)).sort(sortHomeworkItems);
  const filteredStats = applyCuratorFiltersToStats(pageName, getStaffItems("homeworkStats"));
  const grouped = groupBy(activeItems, getHomeworkLessonGroupKey);
  const groupedEntries = Object.entries(grouped).sort(([, left], [, right]) => sortHomeworkItems(left[0] || {}, right[0] || {}));

  return `
    ${renderCuratorFilters(pageName, items)}
    ${renderHomeworkStatsOverview(filteredStats, { curator: true })}
    ${
      groupedEntries.length === 0
        ? renderStaffEmpty("По выбранным фильтрам нет домашних заданий для кураторской оценки. Оцененные работы находятся в архиве.")
        : groupedEntries
            .map(([, lessonItems]) => {
              const summary = getHomeworkSummaryFromItems(lessonItems, filteredStats);
              return `
                <section class="staff-group staff-lesson-group" id="${escapeHtml(summary.domId)}">
                  <header class="staff-group-heading">
                    <div>
                      <span>${escapeHtml(summary.courseTitle || "Курс")}${summary.teacherName ? ` · ${escapeHtml(summary.teacherName)}` : ""}</span>
                      <h2>Урок ${escapeHtml(summary.lessonNumber || "-")} · ${escapeHtml(summary.lessonTitle || "Домашнее задание")}</h2>
                    </div>
                    ${renderHomeworkStatChips(summary, { curator: true })}
                  </header>
                  ${renderHomeworkStatsBars(summary, { curator: true })}
                  <div class="staff-card-grid">
                    ${lessonItems
                      .map((item) => {
                        const status = getHomeworkStaffStatus(item);
                        return `
                          <article class="staff-card ${isStaffHomeworkChecked(item) ? "staff-card--checked" : isStaffHomeworkSubmitted(item) ? "staff-card--pending" : "staff-card--muted"}">
                            <div class="staff-card__meta">
                              <span class="resource-chip ${status.className}">${status.label}</span>
                              <span class="resource-chip is-blue">${escapeHtml(item.teacherName || "Преподаватель")}</span>
                              <span class="resource-chip">${escapeHtml(item.studentName || "Ученик")}</span>
                            </div>
                            <h3>${escapeHtml(config.title(item) || "Домашнее задание")}</h3>
                            <p>${escapeHtml(config.text(item) || "")}</p>
                            <div class="staff-card__actions">
                              ${createStaffLink(config.link(item), config.linkLabel)}
                              ${createStaffLink(item.submissionLink, item.submissionLink ? "Работа ученика" : "Нет ссылки", "#icon-clipboard")}
                            </div>
                            ${renderHomeworkTeacherResult(item)}
                            ${renderCuratorHomeworkReviewArea(config, item)}
                          </article>
                        `;
                      })
                      .join("")}
                  </div>
                </section>
              `;
            })
            .join("")
    }
  `;
}

function renderCuratorHomeworkCard(config, item) {
  const status = getHomeworkStaffStatus(item);
  const reviewed = isCuratorReviewed(item);

  return `
    <article class="staff-card ${reviewed ? "staff-card--checked is-complete" : isStaffHomeworkChecked(item) ? "staff-card--pending" : isStaffHomeworkSubmitted(item) ? "staff-card--pending" : "staff-card--muted"}">
      <div class="staff-card__meta">
        <span class="resource-chip ${status.className}">${status.label}</span>
        <span class="resource-chip is-blue">${escapeHtml(item.teacherName || "Преподаватель")}</span>
        <span class="resource-chip">${escapeHtml(item.studentName || "Ученик")}</span>
      </div>
      <h3>${escapeHtml(config.title(item) || "Домашнее задание")}</h3>
      <p>${escapeHtml(config.text(item) || "")}</p>
      <div class="staff-card__actions">
        ${createStaffLink(config.link(item), config.linkLabel)}
        ${createStaffLink(item.submissionLink, item.submissionLink ? "Работа ученика" : "Нет ссылки", "#icon-clipboard")}
      </div>
      ${renderHomeworkTeacherResult(item)}
      ${renderCuratorHomeworkReviewArea(config, item)}
    </article>
  `;
}

function renderCuratorHomeworkPage(pageName, config, items) {
  const state = getStaffDrilldown(pageName);
  const mode = state.mode === "corrections" ? "corrections" : "homeworks";
  const modeTabs = renderHomeworkModeTabs(mode);
  const filteredItems = applyCuratorFilters(pageName, items).sort(sortHomeworkItems);
  const filteredStats = applyCuratorFiltersToStats(pageName, getStaffItems(mode === "corrections" ? "correctionStats" : "homeworkStats"));

  if (filteredItems.length === 0 && filteredStats.length === 0) {
    return `
      ${renderCuratorFilters(pageName, items)}
      ${modeTabs}
      ${renderStaffEmpty("По выбранным фильтрам нет домашних заданий для кураторской оценки.")}
    `;
  }

  if (!state.courseId) {
    return `
      ${renderCuratorFilters(pageName, items)}
      ${modeTabs}
      ${renderHomeworkCourseStep(pageName, filteredStats, { curator: true })}
    `;
  }

  const courseSummary = getHomeworkCourseSummaries(filteredStats).find((summary) => matchesCourseSelection(summary, state.courseId));
  const lessonSummaries = getHomeworkLessonSummariesForCourse(state.courseId, filteredStats);

  if (!state.lessonKey) {
    return `
      ${renderCuratorFilters(pageName, items)}
      ${modeTabs}
      ${renderHomeworkLessonStep(pageName, courseSummary, lessonSummaries, { curator: true })}
    `;
  }

  const lessonSummary = lessonSummaries.find((summary) => summary.key === state.lessonKey);
  const lessonItems = filteredItems
    .filter((item) => matchesCourseSelection(item, state.courseId) && getHomeworkLessonGroupKey(item) === state.lessonKey)
    .sort(sortHomeworkItems);

  return `
    ${renderCuratorFilters(pageName, items)}
    ${modeTabs}
    ${renderHomeworkLessonWorkspace(pageName, courseSummary, lessonSummary, lessonItems, (item) => renderCuratorHomeworkCard(config, item), { curator: true })}
  `;
}

function renderCuratorArchiveCard(config, item, typeLabel) {
  return `
    <article class="staff-card staff-card--archived">
      <div class="staff-card__meta">
        <span class="resource-chip is-green">${escapeHtml(typeLabel)}</span>
        <span class="resource-chip is-blue">${escapeHtml(item.teacherName || "Преподаватель")}</span>
        <span class="resource-chip">${escapeHtml(item.courseTitle || "Курс")}</span>
      </div>
      <h3>${escapeHtml(config.title(item) || "Материал")}</h3>
      <p>${escapeHtml(config.text(item) || "")}</p>
      <div class="staff-card__actions">
        ${createStaffLink(config.link(item), config.linkLabel)}
        ${config.resourceType === "Homework" ? createStaffLink(item.submissionLink, item.submissionLink ? "Работа ученика" : "Нет ссылки", "#icon-clipboard") : ""}
      </div>
      ${config.resourceType === "Homework" ? renderHomeworkTeacherResult(item) : ""}
      ${renderCuratorReviewNote(item)}
    </article>
  `;
}

function renderCuratorArchivePage() {
  const sections = [
    ["lessons", "Уроки"],
    ["notes", "Конспекты"],
    ["homework", "Домашние задания"],
    ["streams", "Трансляции"],
  ]
    .map(([pageName, label]) => {
      const config = getCuratorResourceConfig(pageName);
      const items = (config?.items || []).filter(isCuratorReviewed).sort(sortHomeworkItems);
      return { pageName, label, config, items };
    })
    .filter((section) => section.items.length > 0);

  if (sections.length === 0) {
    return renderStaffEmpty("Архив кураторских оценок пока пуст.");
  }

  return sections
    .map(
      (section) => `
        <section class="staff-group">
          <h2>${escapeHtml(section.label)}</h2>
          <div class="staff-card-grid">
            ${section.items.map((item) => renderCuratorArchiveCard(section.config, item, section.label)).join("")}
          </div>
        </section>
      `,
    )
    .join("");
}

function renderCuratorResourcePageLegacy(pageName) {
  const config = getCuratorResourceConfig(pageName);

  if (!config) {
    return renderStaffEmpty("Раздел не найден.");
  }

  const items = config.items;

  if (items.length === 0) {
    return renderStaffEmpty(config.empty);
  }

  if (pageName === "homework") {
    return renderCuratorHomeworkPage(pageName, config, items);
  }

  const filteredItems = applyCuratorFilters(pageName, items);
  const activeItems = filteredItems.filter((item) => !isCuratorReviewed(item));

  return `
    ${renderCuratorFilters(pageName, items)}
    <div class="staff-card-grid">
      ${
        activeItems.length === 0
          ? renderStaffEmpty("По выбранным фильтрам нет материалов для оценки. Уже оцененные материалы находятся в архиве.")
          : activeItems
              .map(
                (item) => `
                  <article class="staff-card">
                    <div class="staff-card__meta">
                      <span class="resource-chip is-blue">${escapeHtml(item.teacherName || "Преподаватель")}</span>
                      <span class="resource-chip">${escapeHtml(item.courseTitle || "Курс")}</span>
                    </div>
                    <h3>${escapeHtml(config.title(item) || "Материал")}</h3>
                    <p>${escapeHtml(config.text(item) || "")}</p>
                    <div class="staff-card__actions">
                      ${createStaffLink(config.link(item), config.linkLabel)}
                    </div>
                    ${renderResourceReviewForm(config, item)}
                  </article>
                `,
              )
              .join("")
      }
    </div>
  `;
}

function getCuratorResourceCourseSummaries(items) {
  const grouped = new Map();

  (items || []).forEach((item) => {
    const key = getCourseSelectionKey(item);
    const current = grouped.get(key) || {
      courseId: item.courseId,
      courseSlug: item.courseSlug,
      courseTitle: item.courseTitle,
      teacherId: item.teacherId,
      teacherName: item.teacherName,
      courseKey: key,
      total: 0,
      reviewed: 0,
      lessonKeys: new Set(),
    };

    current.total += 1;
    current.reviewed += isCuratorReviewed(item) ? 1 : 0;
    current.lessonKeys.add(String(item.lessonId || item.lessonNumber || item.streamId || item.noteId || item.lessonTitle || item.materialTitle || item.streamTitle || current.total));
    grouped.set(key, current);
  });

  return [...grouped.values()]
    .map((summary) => ({
      ...summary,
      pending: Math.max(0, summary.total - summary.reviewed),
      reviewedPercent: percentOf(summary.reviewed, summary.total),
      lessonsCount: summary.lessonKeys.size,
    }))
    .sort((left, right) => String(left.courseTitle || "").localeCompare(String(right.courseTitle || ""), "ru"));
}

function renderCuratorResourceCourseStep(pageName, items) {
  const summaries = getCuratorResourceCourseSummaries(items);

  if (summaries.length === 0) {
    return renderStaffEmpty("По выбранным фильтрам нет материалов.");
  }

  return `
    ${renderStaffStepHeading("Выберите курс", "Кураторская оценка материалов")}
    <div class="staff-step-grid">
      ${summaries
        .map((summary) => {
          const complete = summary.total > 0 && summary.total === summary.reviewed;
          return `
            <button class="staff-step-card ${complete ? "is-complete" : ""}" type="button" data-staff-open-course="${escapeHtml(pageName)}" data-course-id="${escapeHtml(summary.courseKey)}">
              <div class="staff-step-card__top">
                <span>${escapeHtml(summary.teacherName || "Преподаватель")}</span>
                <strong>${escapeHtml(summary.courseTitle || "Курс")}</strong>
              </div>
              <div class="staff-step-card__meta">
                <span class="resource-chip">${formatNumber(summary.lessonsCount)} урок.</span>
                <span class="resource-chip is-green">${formatNumber(summary.reviewed)} оценено</span>
                <span class="resource-chip is-yellow">${formatNumber(summary.pending)} ждёт</span>
              </div>
              <div class="staff-bars">
                <div class="staff-bar is-curator">
                  <div>
                    <strong>Оценено</strong>
                    <span>${formatNumber(summary.reviewed)} · ${formatPercent(summary.reviewedPercent)}</span>
                  </div>
                  <i style="width: ${clampPercent(summary.reviewedPercent)}%"></i>
                </div>
              </div>
            </button>
          `;
        })
        .join("")}
    </div>
  `;
}

function sortCuratorResourceItems(config, left, right) {
  return (
    Number(left.lessonNumber || 0) - Number(right.lessonNumber || 0) ||
    String(left.startsAt || "").localeCompare(String(right.startsAt || "")) ||
    String(config.title(left) || "").localeCompare(String(config.title(right) || ""), "ru")
  );
}

function renderCuratorResourceItemsStep(pageName, config, courseSummary, items) {
  const courseItems = items
    .filter((item) => matchesCourseSelection(item, courseSummary?.courseKey || courseSummary?.courseId))
    .sort((left, right) => sortCuratorResourceItems(config, left, right));

  return `
    ${renderStaffStepHeading(
      courseSummary?.courseTitle || courseItems[0]?.courseTitle || "Курс",
      "Материалы курса",
      renderStaffStepBack(pageName, "courses", "", "К курсам"),
    )}
    <div class="staff-card-grid">
      ${
        courseItems.length
          ? courseItems
              .map((item) => {
                const reviewed = isCuratorReviewed(item);
                return `
                  <article class="staff-card ${reviewed ? "is-complete staff-card--checked" : "staff-card--pending"}">
                    <div class="staff-card__meta">
                      <span class="resource-chip ${reviewed ? "is-green" : "is-yellow"}">${reviewed ? "Оценено" : "Ждёт оценки"}</span>
                      <span class="resource-chip is-blue">${escapeHtml(item.teacherName || "Преподаватель")}</span>
                      <span class="resource-chip">${escapeHtml(item.courseTitle || "Курс")}</span>
                      ${item.lessonNumber ? `<span class="resource-chip">Урок ${escapeHtml(item.lessonNumber)}</span>` : ""}
                    </div>
                    <h3>${escapeHtml(config.title(item) || "Материал")}</h3>
                    <p>${escapeHtml(config.text(item) || "")}</p>
                    <div class="staff-card__actions">
                      ${createStaffLink(config.link(item), config.linkLabel)}
                    </div>
                    ${renderResourceReviewForm(config, item)}
                  </article>
                `;
              })
              .join("")
          : renderStaffEmpty("В этом курсе пока нет материалов.")
      }
    </div>
  `;
}

function renderCuratorResourcePage(pageName) {
  const config = getCuratorResourceConfig(pageName);

  if (!config) {
    return renderStaffEmpty("Раздел не найден.");
  }

  const items = config.items;

  if (items.length === 0) {
    return renderStaffEmpty(config.empty);
  }

  if (pageName === "homework") {
    return renderCuratorHomeworkPage(pageName, config, items);
  }

  const filteredItems = applyCuratorFilters(pageName, items);
  const state = getStaffDrilldown(pageName);

  if (!state.courseId) {
    return `
      ${renderCuratorFilters(pageName, items)}
      ${renderCuratorResourceCourseStep(pageName, filteredItems)}
    `;
  }

  const courseSummary = getCuratorResourceCourseSummaries(filteredItems).find((summary) => matchesCourseSelection(summary, state.courseId));

  return `
    ${renderCuratorFilters(pageName, items)}
    ${renderCuratorResourceItemsStep(pageName, config, courseSummary || { courseKey: state.courseId }, filteredItems)}
  `;
}

function renderAdminMetrics() {
  const newApplications = getStaffItems("applications").filter((item) => item.status === "New").length;
  const newSupportRequests = getStaffItems("supportRequests").filter((item) => item.status === "New").length;
  const students = getStaffItems("students");
  const parents = getStaffItems("parents");

  return `
    <section class="staff-metrics" aria-label="Сводка администратора">
      <article><span>Новые заявки</span><strong>${formatNumber(newApplications)}</strong></article>
      <article><span>Новые обращения</span><strong>${formatNumber(newSupportRequests)}</strong></article>
      <article><span>Ученики</span><strong>${formatNumber(students.length)}</strong></article>
      <article><span>Родители</span><strong>${formatNumber(parents.length)}</strong></article>
      <article><span>Курсы</span><strong>${formatNumber(getStaffItems("courses").length)}</strong></article>
    </section>
  `;
}

function renderAdminStatusOptions(selectedStatus = "New") {
  const statuses = [
    ["New", "Не обработана"],
    ["Contacted", "Связались"],
    ["Enrolled", "Записан"],
    ["Rejected", "Отказ"],
  ];

  return statuses.map(([value, label]) => `<option value="${value}" ${value === selectedStatus ? "selected" : ""}>${label}</option>`).join("");
}

function renderAdminSupportStatusOptions(selectedStatus = "New") {
  const statuses = [
    ["New", "Не обработано"],
    ["In_Progress", "В работе"],
    ["Resolved", "Обработано"],
  ];

  return statuses.map(([value, label]) => `<option value="${value}" ${value === selectedStatus ? "selected" : ""}>${label}</option>`).join("");
}

function renderAdminEnrollmentStatusOptions(selectedStatus = "Active") {
  const statuses = [
    ["Active", "Ученик"],
    ["Paused", "Пауза"],
    ["Finished", "Выпускник"],
    ["Cancelled", "Исключён"],
  ];

  return statuses.map(([value, label]) => `<option value="${value}" ${value === selectedStatus ? "selected" : ""}>${label}</option>`).join("");
}

function renderAdminStudentStatusOptions(selectedStatus = "Student") {
  return [
    ["Student", "Ученик"],
    ["Graduate", "Выпускник"],
  ]
    .map(([value, label]) => `<option value="${value}" ${value === selectedStatus ? "selected" : ""}>${label}</option>`)
    .join("");
}

function renderAdminCourseOptions(selectedCourseId = "", includeEmpty = false) {
  const empty = includeEmpty ? `<option value="">Пока не указано</option>` : "";
  return `${empty}${getStaffItems("courses")
    .map((course) => `<option value="${escapeHtml(course.courseId)}" ${String(course.courseId) === String(selectedCourseId) ? "selected" : ""}>${escapeHtml(course.courseTitle)}</option>`)
    .join("")}`;
}

function renderAdminTeacherOptions(selectedTeacherId = "") {
  return `<option value="">Пока не указано</option>${getStaffItems("teachers")
    .map(
      (teacher) =>
        `<option value="${escapeHtml(teacher.teacherId)}" ${String(teacher.teacherId) === String(selectedTeacherId) ? "selected" : ""}>${escapeHtml(teacher.teacherName)} · ${formatNumber(teacher.studentsCount)} учен.</option>`,
    )
    .join("")}`;
}

function renderAdminCuratorOptions(selectedCuratorId = "") {
  return `<option value="">Пока не указано</option>${getStaffItems("curators")
    .map(
      (curator) =>
        `<option value="${escapeHtml(curator.curatorId)}" ${String(curator.curatorId) === String(selectedCuratorId) ? "selected" : ""}>${escapeHtml(curator.curatorName)} · ${formatNumber(curator.studentsCount)} учен.</option>`,
    )
    .join("")}`;
}

function renderAdminParentOptions(selectedParentId = "") {
  return `<option value="">Пока не указано</option>${getStaffItems("parents")
    .map((parent) => `<option value="${escapeHtml(parent.parentId)}" ${String(parent.parentId) === String(selectedParentId) ? "selected" : ""}>${escapeHtml(parent.parentName)}</option>`)
    .join("")}`;
}

function renderAdminStudentOptions(selectedStudentId = "") {
  return `<option value="">Пока не указано</option>${getStaffItems("students")
    .map((student) => `<option value="${escapeHtml(student.studentId)}" ${String(student.studentId) === String(selectedStudentId) ? "selected" : ""}>${escapeHtml(student.studentName)} · ${escapeHtml(student.grade ? `${student.grade} класс` : "класс не указан")}</option>`)
    .join("")}`;
}

function renderAdminStudentMultiOptions(selectedStudentIds = []) {
  const selected = new Set((selectedStudentIds || []).map((id) => String(id)));
  return getStaffItems("students")
    .map((student) => `<option value="${escapeHtml(student.studentId)}" ${selected.has(String(student.studentId)) ? "selected" : ""}>${escapeHtml(student.studentName)} · ${escapeHtml(student.grade ? `${student.grade} класс` : "класс не указан")}</option>`)
    .join("");
}

function renderAdminTeacherMultiOptions(selectedTeacherIds = []) {
  const selected = new Set((selectedTeacherIds || []).map((id) => String(id)));
  return getStaffItems("teachers")
    .map((teacher) => `<option value="${escapeHtml(teacher.teacherId)}" ${selected.has(String(teacher.teacherId)) ? "selected" : ""}>${escapeHtml(teacher.teacherName)} · ${formatNumber(teacher.studentsCount || 0)} учен.</option>`)
    .join("");
}

function renderAdminParentChildForm(parent = {}, child = {}) {
  return `
    <form class="staff-inline-form admin-parent-child-form" data-admin-parent-child-form data-parent-id="${escapeHtml(parent.parentId || "")}">
      <input type="hidden" name="originalStudentId" value="${escapeHtml(child.studentId || "")}" />
      <select name="studentId" required>${renderAdminStudentOptions(child.studentId || "")}</select>
      <input name="relationType" type="text" value="${escapeHtml(child.relationType || "Родитель")}" placeholder="Связь" />
      <select name="action">
        <option value="save">Сохранить связь</option>
        ${child.studentId ? `<option value="remove">Убрать ребёнка</option>` : ""}
      </select>
      <button type="submit"><svg><use href="#icon-upload" /></svg>${child.studentId ? "Сохранить ребёнка" : "Добавить ребёнка"}</button>
      <p class="staff-form-status" aria-live="polite"></p>
    </form>
  `;
}

function renderAdminCourseStaffForm(course = {}, defaults = {}) {
  const fixedCourseId = course.courseId || "";
  const selectedTeacherId = defaults.teacherId ?? course.courseTeacherId ?? course.teacherId ?? "";
  const selectedCuratorId = defaults.curatorId ?? course.courseCuratorId ?? course.curatorId ?? "";

  return `
    <form class="staff-inline-form admin-course-staff-form" data-admin-course-staff-form data-course-id="${escapeHtml(fixedCourseId)}">
      ${
        fixedCourseId
          ? `<input type="hidden" name="courseId" value="${escapeHtml(fixedCourseId)}" />`
          : `<select name="courseId" required>${renderAdminCourseOptions("", true)}</select>`
      }
      <select name="teacherId">${renderAdminTeacherOptions(selectedTeacherId)}</select>
      <select name="curatorId">${renderAdminCuratorOptions(selectedCuratorId)}</select>
      <button type="submit"><svg><use href="#icon-upload" /></svg>Сохранить связку</button>
      <p class="staff-form-status" aria-live="polite"></p>
    </form>
  `;
}

function renderAdminApplicationForm(application = {}) {
  const isNew = application.status === "New";

  return `
    <form class="staff-lesson-form admin-edit-form" data-admin-application-form data-application-id="${escapeHtml(application.applicationId)}">
      <label>Имя ученика<input name="studentName" type="text" value="${escapeHtml(application.studentName || "")}" required /></label>
      <label>Телефон<input name="phone" type="text" value="${escapeHtml(application.phone || "")}" required /></label>
      <label>Email<input name="email" type="email" value="${escapeHtml(application.email || "")}" /></label>
      <label>Предмет<input name="preferredSubject" type="text" value="${escapeHtml(application.preferredSubject || "")}" required /></label>
      <label>Класс<input name="grade" type="number" min="1" max="11" value="${escapeHtml(application.grade || "")}" /></label>
      <label>Статус<select name="status">${renderAdminStatusOptions(application.status || "New")}</select></label>
      <label>Источник<input name="sourcePage" type="text" value="${escapeHtml(application.sourcePage || "")}" /></label>
      <label>Комментарий заявки<textarea name="commentText" rows="2">${escapeHtml(application.commentText || "")}</textarea></label>
      <label>Заметка администратора<textarea name="adminNote" rows="2" placeholder="Что уже сделали по заявке">${escapeHtml(application.adminNote || "")}</textarea></label>
      <button type="submit"><svg><use href="#icon-upload" /></svg>${isNew ? "Сохранить / обработать" : "Сохранить заявку"}</button>
      <p class="staff-form-status" aria-live="polite"></p>
    </form>
  `;
}

function renderAdminApplications() {
  const applications = getStaffItems("applications");
  const active = applications.filter((item) => item.status === "New");
  const archived = applications.filter((item) => item.status !== "New");

  return `
    ${renderAdminMetrics()}
    <section class="staff-group">
      <header class="staff-group-heading">
        <div>
          <span>Новые обращения</span>
          <h2>Не обработанные заявки</h2>
        </div>
        <span class="resource-chip is-yellow">${formatNumber(active.length)} шт.</span>
      </header>
      <div class="staff-card-grid">
        ${
          active.length
            ? active
                .map(
                  (application) => `
                    <article class="staff-card">
                      <div class="staff-card__meta">
                        <span class="resource-chip is-yellow">Не обработана</span>
                        ${application.createdAt ? `<span class="resource-chip">${escapeHtml(formatStreamDate(application.createdAt))}</span>` : ""}
                      </div>
                      <h3>${escapeHtml(application.studentName)}</h3>
                      <p>${escapeHtml([application.phone, application.email, application.preferredSubject].filter(Boolean).join(" · "))}</p>
                      ${renderAdminApplicationForm(application)}
                    </article>
                  `,
                )
                .join("")
            : renderStaffEmpty("Новых заявок пока нет.")
        }
      </div>
    </section>
    <section class="staff-group">
      <header class="staff-group-heading">
        <div>
          <span>Архив</span>
          <h2>Обработанные заявки</h2>
        </div>
        <span class="resource-chip is-green">${formatNumber(archived.length)} шт.</span>
      </header>
      <div class="staff-card-grid">
        ${
          archived.length
            ? archived
                .map(
                  (application) => `
                    <article class="staff-card staff-card--archived">
                      <div class="staff-card__meta">
                        <span class="resource-chip is-green">${escapeHtml(application.status)}</span>
                        ${application.processedAt ? `<span class="resource-chip">${escapeHtml(formatStreamDate(application.processedAt))}</span>` : ""}
                      </div>
                      <h3>${escapeHtml(application.studentName)}</h3>
                      <p>${escapeHtml([application.phone, application.email, application.preferredSubject].filter(Boolean).join(" · "))}</p>
                      ${renderAdminApplicationForm(application)}
                    </article>
                  `,
                )
                .join("")
            : renderStaffEmpty("Архив заявок пока пуст.")
        }
      </div>
    </section>
  `;
}

function renderAdminSupportForm(request = {}) {
  const isNew = request.status === "New";

  return `
    <form class="staff-lesson-form admin-edit-form" data-admin-support-form data-support-request-id="${escapeHtml(request.supportRequestId)}">
      <label>Тема<input name="topic" type="text" value="${escapeHtml(request.topic || "")}" /></label>
      <label>Статус<select name="status">${renderAdminSupportStatusOptions(request.status || "New")}</select></label>
      <label>Текст обращения<textarea name="messageText" rows="3">${escapeHtml(request.messageText || "")}</textarea></label>
      <label>Заметка администратора<textarea name="adminNote" rows="2" placeholder="Что уже сделали по обращению">${escapeHtml(request.adminNote || "")}</textarea></label>
      <button type="submit"><svg><use href="#icon-upload" /></svg>${isNew ? "Сохранить / обработать" : "Сохранить обращение"}</button>
      <p class="staff-form-status" aria-live="polite"></p>
    </form>
  `;
}

function renderAdminSupportCard(request, archived = false) {
  const statusLabel = request.status === "Resolved" ? "Обработано" : request.status === "In_Progress" ? "В работе" : "Не обработано";
  const statusClass = request.status === "Resolved" ? "is-green" : request.status === "In_Progress" ? "is-blue" : "is-yellow";

  return `
    <article class="staff-card ${archived ? "staff-card--archived" : ""}">
      <div class="staff-card__meta">
        <span class="resource-chip ${statusClass}">${statusLabel}</span>
        ${request.createdAt ? `<span class="resource-chip">${escapeHtml(formatStreamDate(request.createdAt))}</span>` : ""}
      </div>
      <h3>${escapeHtml(request.topic || "Обращение")}</h3>
      <p>${escapeHtml(request.messageText || "")}</p>
      <p>${escapeHtml([request.studentName || "Гость", request.phone, request.email].filter(Boolean).join(" · "))}</p>
      ${renderAdminSupportForm(request)}
    </article>
  `;
}

function renderAdminSupportRequests() {
  const requests = getStaffItems("supportRequests");
  const active = requests.filter((item) => item.status === "New" || item.status === "In_Progress");
  const archived = requests.filter((item) => item.status === "Resolved");

  return `
    ${renderAdminMetrics()}
    <section class="staff-group">
      <header class="staff-group-heading">
        <div>
          <span>Поддержка</span>
          <h2>Не обработанные обращения</h2>
        </div>
        <span class="resource-chip is-yellow">${formatNumber(active.length)} шт.</span>
      </header>
      <div class="staff-card-grid">
        ${active.length ? active.map((request) => renderAdminSupportCard(request)).join("") : renderStaffEmpty("Новых обращений пока нет.")}
      </div>
    </section>
    <section class="staff-group">
      <header class="staff-group-heading">
        <div>
          <span>Архив</span>
          <h2>Обработанные обращения</h2>
        </div>
        <span class="resource-chip is-green">${formatNumber(archived.length)} шт.</span>
      </header>
      <div class="staff-card-grid">
        ${archived.length ? archived.map((request) => renderAdminSupportCard(request, true)).join("") : renderStaffEmpty("Архив обращений пока пуст.")}
      </div>
    </section>
  `;
}

function renderAdminFilters(pageName, items) {
  const selectedCourse = getFilterValue(pageName, "course");
  const selectedTeacher = getFilterValue(pageName, "teacher");
  const selectedCurator = getFilterValue(pageName, "curator");

  return `
    <div class="staff-filterbar" data-staff-filter-scope="${escapeHtml(pageName)}">
      <label>Курс<select data-staff-filter="course"><option value="">Все</option>${getStaffItems("courses")
        .map((course) => `<option value="${escapeHtml(course.courseId)}" ${String(course.courseId) === String(selectedCourse) ? "selected" : ""}>${escapeHtml(course.courseTitle)}</option>`)
        .join("")}</select></label>
      <label>Преподаватель<select data-staff-filter="teacher"><option value="">Все</option>${getStaffItems("teachers")
        .map((teacher) => `<option value="${escapeHtml(teacher.teacherId)}" ${String(teacher.teacherId) === String(selectedTeacher) ? "selected" : ""}>${escapeHtml(teacher.teacherName)}</option>`)
        .join("")}</select></label>
      <label>Куратор<select data-staff-filter="curator"><option value="">Все</option>${getStaffItems("curators")
        .map((curator) => `<option value="${escapeHtml(curator.curatorId)}" ${String(curator.curatorId) === String(selectedCurator) ? "selected" : ""}>${escapeHtml(curator.curatorName)}</option>`)
        .join("")}</select></label>
    </div>
  `;
}

function applyAdminStudentFilters(students) {
  const selectedCourse = getFilterValue("students", "course");
  const selectedTeacher = getFilterValue("students", "teacher");
  const selectedCurator = getFilterValue("students", "curator");

  return students.filter((student) => {
    const courses = student.courses || [];
    const courseMatches = !selectedCourse || courses.some((course) => String(course.courseId) === String(selectedCourse));
    const teacherMatches = !selectedTeacher || courses.some((course) => String(course.teacherId) === String(selectedTeacher));
    const curatorMatches = !selectedCurator || courses.some((course) => String(course.curatorId) === String(selectedCurator));
    return courseMatches && teacherMatches && curatorMatches;
  });
}

function getAdminStudentFormDraftKey(form, index) {
  const studentId = form.querySelector("[name='studentId']")?.value || "";
  return studentId ? `student:${studentId}` : `new:${index}`;
}

function collectAdminStudentFormDrafts() {
  return Array.from(document.querySelectorAll("[data-admin-student-form]")).map((form, index) => ({
    key: getAdminStudentFormDraftKey(form, index),
    values: Object.fromEntries(new FormData(form).entries()),
  }));
}

function restoreAdminStudentFormDrafts(drafts = []) {
  if (!drafts.length || currentStaffPage !== "students") {
    return;
  }

  window.requestAnimationFrame(() => {
    const forms = Array.from(document.querySelectorAll("[data-admin-student-form]"));

    forms.forEach((form, index) => {
      const draft = drafts.find((item) => item.key === getAdminStudentFormDraftKey(form, index));

      if (!draft) {
        return;
      }

      Object.entries(draft.values).forEach(([name, value]) => {
        const field = form.elements[name];

        if (!field || field.type === "hidden") {
          return;
        }

        field.value = value;
      });
    });
  });
}

function renderAdminStudentForm(student = {}) {
  const parent = (student.parents || [])[0] || {};

  return `
    <form class="staff-lesson-form admin-edit-form" data-admin-student-form>
      <input type="hidden" name="studentId" value="${escapeHtml(student.studentId || "")}" />
      <label>Имя<input name="firstName" type="text" value="${escapeHtml(student.firstName || "")}" required /></label>
      <label>Фамилия<input name="lastName" type="text" value="${escapeHtml(student.lastName || "")}" required /></label>
      <label>Телефон<input name="phone" type="text" value="${escapeHtml(student.phone || "")}" /></label>
      <label>Email<input name="email" type="email" value="${escapeHtml(student.email || "")}" /></label>
      <label>Класс<input name="grade" type="number" min="1" max="11" value="${escapeHtml(student.grade || "")}" /></label>
      <label>Статус<select name="studentStatus">${renderAdminStudentStatusOptions(student.studentStatus || "Student")}</select></label>
      <label>Telegram<input name="telegramLink" type="url" value="${escapeHtml(student.telegramLink || "")}" placeholder="https://t.me/..." /></label>
      <label>VK<input name="vkLink" type="url" value="${escapeHtml(student.vkLink || "")}" placeholder="https://vk.com/..." /></label>
      <label>Платформа<input name="sourcePlatform" type="text" value="${escapeHtml(student.sourcePlatform || "")}" /></label>
      <label>Логин<input name="login" type="text" value="${escapeHtml(student.login || "")}" placeholder="student_login" /></label>
      <label>Пароль<input name="password" type="password" minlength="6" placeholder="${student.studentId ? "оставьте пустым, чтобы не менять" : "минимум 6 символов"}" /></label>
      <label>Родитель<select name="parentId">${renderAdminParentOptions(parent.parentId || "")}</select></label>
      <label>Связь<input name="relationType" type="text" value="${escapeHtml(parent.relationType || "Родитель")}" /></label>
      <button type="submit"><svg><use href="#icon-upload" /></svg>${student.studentId ? "Сохранить" : "Добавить"}</button>
      <p class="staff-form-status" aria-live="polite"></p>
    </form>
  `;
}

function renderAdminEnrollmentForm(student, enrollment = {}) {
  return `
    <form class="staff-inline-form admin-enrollment-form" data-admin-enrollment-form data-student-id="${escapeHtml(student.studentId)}">
      <select name="courseId" required>${renderAdminCourseOptions(enrollment.courseId || "", !enrollment.courseId)}</select>
      <select name="teacherId">${renderAdminTeacherOptions(enrollment.teacherId || "")}</select>
      <select name="curatorId">${renderAdminCuratorOptions(enrollment.curatorId || "")}</select>
      <select name="enrollmentStatus">${renderAdminEnrollmentStatusOptions(enrollment.enrollmentStatus || "Active")}</select>
      <button type="submit"><svg><use href="#icon-upload" /></svg>Сохранить курс</button>
      <p class="staff-form-status" aria-live="polite"></p>
    </form>
  `;
}

function renderAdminStudentCard(student) {
  const courses = student.courses || [];
  const comments = student.comments || [];

  return `
    <article class="staff-card admin-student-card admin-compact-card">
      <div class="staff-card__meta">
        <span class="resource-chip ${student.studentStatus === "Graduate" ? "is-green" : "is-blue"}">${student.studentStatus === "Graduate" ? "Выпускник" : "Ученик"}</span>
        <span class="resource-chip">${escapeHtml(student.grade ? `${student.grade} класс` : "класс не указан")}</span>
        <span class="resource-chip is-green">${Number(student.averageScore || 0).toFixed(1)} ср. балл</span>
      </div>
      <h3>${escapeHtml(student.studentName || `${student.firstName || ""} ${student.lastName || ""}`.trim())}</h3>
      <p>${escapeHtml([student.phone, student.email].filter(Boolean).join(" · ") || "Контакты не указаны")}</p>
      <p>ДЗ: <strong>${formatNumber(student.homeworkSubmitted || 0)} / ${formatNumber(student.homeworkTotal || 0)}</strong>, проверено ${formatNumber(student.homeworkChecked || 0)}</p>
      <div class="staff-card__meta">
        ${(student.parents || []).map((parent) => `<span class="resource-chip">${escapeHtml(parent.parentName)}</span>`).join("") || `<span class="resource-chip">Родитель не указан</span>`}
      </div>
      <details class="staff-details admin-person-details">
        <summary>Подробности и редактирование ученика</summary>
        <section class="admin-detail-block">
          <h4>Личные данные</h4>
          ${renderAdminStudentForm(student)}
        </section>
        <section class="admin-detail-block">
          <h4>Курсы и закрепления</h4>
        <div class="admin-course-list">
          ${
            courses.length
              ? courses
                  .map(
                    (course) => `
                      <div class="staff-reviewed-note">
                        <strong>${escapeHtml(course.courseTitle)} · ${formatPercent(course.progressPercent)}</strong>
                        <span>${escapeHtml(course.teacherName || "Преподаватель не указан")} · ${escapeHtml(course.curatorName || "Куратор не указан")} · ДЗ ${formatNumber(course.homeworkSubmitted || 0)} / ${formatNumber(course.homeworkTotal || 0)}</span>
                        ${renderAdminEnrollmentForm(student, course)}
                      </div>
                    `,
                  )
                  .join("")
              : `<div class="staff-reviewed-note is-muted"><strong>Курсы не подключены</strong><span>Добавьте ученика на курс ниже.</span></div>`
          }
          <div class="staff-reviewed-note is-pending">
            <strong>Добавить курс</strong>
            ${renderAdminEnrollmentForm(student)}
          </div>
        </div>
        </section>
        <section class="admin-detail-block">
          <h4>Комментарии команды</h4>
        ${
          comments.length
            ? comments.map((comment) => `<blockquote>${escapeHtml(comment.authorName || comment.staffRole)}: ${escapeHtml(comment.commentText || "")}</blockquote>`).join("")
            : `<p>Комментариев пока нет.</p>`
        }
        </section>
      </details>
    </article>
  `;
}

function renderAdminStudents() {
  const students = getStaffItems("students");
  const filteredStudents = applyAdminStudentFilters(students);

  return `
    ${renderAdminMetrics()}
    ${renderAdminAddDetails("Добавить ученика", renderAdminStudentForm())}
    ${renderAdminFilters("students", students)}
    <div class="staff-card-grid">
      ${filteredStudents.length ? filteredStudents.map(renderAdminStudentCard).join("") : renderStaffEmpty("Ученики по выбранным фильтрам не найдены.")}
    </div>
  `;
}

function renderAdminParentForm(parent = {}) {
  const childIds = (parent.children || []).map((child) => child.studentId);

  return `
    <form class="staff-lesson-form admin-edit-form" data-admin-parent-form>
      <input type="hidden" name="parentId" value="${escapeHtml(parent.parentId || "")}" />
      <label>Имя<input name="firstName" type="text" value="${escapeHtml(parent.firstName || "")}" required /></label>
      <label>Фамилия<input name="lastName" type="text" value="${escapeHtml(parent.lastName || "")}" required /></label>
      <label>Телефон<input name="phone" type="text" value="${escapeHtml(parent.phone || "")}" /></label>
      <label>Email<input name="email" type="email" value="${escapeHtml(parent.email || "")}" /></label>
      <label>Telegram<input name="telegramLink" type="url" value="${escapeHtml(parent.telegramLink || "")}" /></label>
      <label>VK<input name="vkLink" type="url" value="${escapeHtml(parent.vkLink || "")}" /></label>
      <label>Платформа<input name="sourcePlatform" type="text" value="${escapeHtml(parent.sourcePlatform || "")}" /></label>
      <label>Комментарий<textarea name="commentText" rows="2">${escapeHtml(parent.commentText || "")}</textarea></label>
      <label>Дети<select name="childIds" multiple size="4">${renderAdminStudentMultiOptions(childIds)}</select></label>
      <button type="submit"><svg><use href="#icon-upload" /></svg>${parent.parentId ? "Сохранить" : "Добавить"}</button>
      <p class="staff-form-status" aria-live="polite"></p>
    </form>
  `;
}

function renderAdminParents() {
  const parents = getStaffItems("parents");

  return `
    ${renderAdminMetrics()}
    ${renderAdminAddDetails("Добавить родителя", renderAdminParentForm())}
    <div class="staff-card-grid">
      ${
        parents.length
          ? parents
              .map(
                (parent) => `
                  <article class="staff-card admin-compact-card">
                    <div class="staff-card__meta">
                      <span class="resource-chip ${parent.parentStatus === "Parent_Student" ? "is-blue" : "is-green"}">${parent.parentStatus === "Parent_Student" ? "Родитель ученика" : "Родитель выпускника"}</span>
                      <span class="resource-chip">${formatNumber((parent.children || []).length)} детей</span>
                    </div>
                    <h3>${escapeHtml(parent.parentName)}</h3>
                    <p>${escapeHtml([parent.phone, parent.email, parent.sourcePlatform].filter(Boolean).join(" · ") || "Контакты не указаны")}</p>
                    <div class="staff-card__meta">
                      ${(parent.children || []).map((child) => `<span class="resource-chip">${escapeHtml(child.studentName)} · ${child.studentStatus === "Graduate" ? "выпускник" : "ученик"}</span>`).join("") || `<span class="resource-chip">Дети не указаны</span>`}
                    </div>
                    <details class="staff-details admin-person-details">
                      <summary>Подробности и редактирование родителя</summary>
                      <section class="admin-detail-block">
                        <h4>Личные данные</h4>
                        ${renderAdminParentForm(parent)}
                      </section>
                      <section class="admin-detail-block">
                        <h4>Дети и связи</h4>
                      <div class="admin-course-list">
                        ${
                          (parent.children || []).length
                            ? parent.children
                                .map(
                                  (child) => `
                                    <div class="staff-reviewed-note">
                                      <strong>${escapeHtml(child.studentName)}</strong>
                                      <span>${escapeHtml(child.studentStatus === "Graduate" ? "выпускник" : "ученик")} · ${escapeHtml(child.relationType || "Родитель")}</span>
                                      ${renderAdminParentChildForm(parent, child)}
                                    </div>
                                  `,
                                )
                                .join("")
                            : `<div class="staff-reviewed-note is-muted"><strong>Дети не указаны</strong><span>Добавьте связь с учеником ниже.</span></div>`
                        }
                        <div class="staff-reviewed-note is-pending">
                          <strong>Добавить ребёнка</strong>
                          ${renderAdminParentChildForm(parent)}
                        </div>
                      </div>
                      </section>
                    </details>
                  </article>
                `,
              )
              .join("")
          : renderStaffEmpty("Родители пока не добавлены.")
      }
    </div>
  `;
}

function adminText(value) {
  return value ? String(value) : "Пока неизвестно";
}

function renderAdminPersonChips(items = [], getLabel) {
  if (!items.length) {
    return `<span class="resource-chip">Пока неизвестно</span>`;
  }

  return items.map((item) => `<span class="resource-chip">${escapeHtml(getLabel(item))}</span>`).join("");
}

function renderAdminAddDetails(label, formHtml) {
  return `
    <details class="staff-details admin-add-details">
      <summary><svg><use href="#icon-upload" /></svg>${escapeHtml(label)}</summary>
      ${formHtml}
    </details>
  `;
}

function renderAdminTeacherForm(teacher = {}) {
  return `
    <form class="staff-lesson-form admin-edit-form" data-admin-teacher-form>
      <input type="hidden" name="teacherId" value="${escapeHtml(teacher.teacherId || "")}" />
      <label>Имя<input name="firstName" type="text" value="${escapeHtml(teacher.firstName || "")}" placeholder="Пока неизвестно" /></label>
      <label>Фамилия<input name="lastName" type="text" value="${escapeHtml(teacher.lastName || "")}" placeholder="Пока неизвестно" /></label>
      <label>Телефон<input name="phone" type="text" value="${escapeHtml(teacher.phone || "")}" placeholder="Пока неизвестно" /></label>
      <label>Email<input name="email" type="email" value="${escapeHtml(teacher.email || "")}" placeholder="Пока неизвестно" /></label>
      <label>Telegram<input name="telegramLink" type="url" value="${escapeHtml(teacher.telegram || "")}" placeholder="Пока неизвестно" /></label>
      <label>Логин<input name="login" type="text" value="${escapeHtml(teacher.login || "")}" placeholder="Пока неизвестно" /></label>
      <label>Новый пароль<input name="password" type="password" minlength="6" placeholder="${teacher.teacherId ? "Оставьте пустым, чтобы не менять" : "teacher123 по умолчанию"}" /></label>
      <button type="submit"><svg><use href="#icon-upload" /></svg>${teacher.teacherId ? "Сохранить преподавателя" : "Добавить преподавателя"}</button>
      <p class="staff-form-status" aria-live="polite"></p>
    </form>
  `;
}

function renderAdminTeacherCardLegacy(teacher) {
  const courses = teacher.courses || [];
  const students = teacher.students || [];
  const curators = teacher.curators || [];

  return `
    <article class="staff-card admin-person-card">
      <div class="staff-card__meta">
        <span class="resource-chip is-green">Рейтинг ${Number(teacher.rating || 0).toFixed(1)} / 10</span>
        <span class="resource-chip is-blue">${formatNumber(teacher.studentsCount || 0)} учен.</span>
        <span class="resource-chip">${formatNumber(teacher.coursesCount || courses.length)} курс.</span>
      </div>
      <h3>${escapeHtml(teacher.teacherName || "Пока неизвестно")}</h3>
      <p>${escapeHtml([teacher.phone, teacher.email, teacher.telegram].filter(Boolean).join(" · ") || "Контакты пока неизвестны")}</p>
      <div class="staff-info-grid">
        <span>ДЗ прислали<strong>${formatNumber(teacher.homeworkSubmitted || 0)}</strong></span>
        <span>ДЗ проверено<strong>${formatNumber(teacher.homeworkChecked || 0)}</strong></span>
        <span>Средний балл за ДЗ<strong>${Number(teacher.averageHomeworkScore || 0).toFixed(1)}</strong></span>
        <span>Логин<strong>${escapeHtml(adminText(teacher.login))}</strong></span>
      </div>
      <details class="staff-details">
        <summary>Вся информация и редактирование</summary>
        ${renderAdminTeacherForm(teacher)}
        <section class="admin-detail-block">
          <h4>Курсы</h4>
          <div class="staff-card__meta">${renderAdminPersonChips(courses, (course) => `${course.courseTitle} · ${course.curatorNames || "куратор неизвестен"} · ${formatNumber(course.studentsCount || 0)} учен.`)}</div>
        </section>
        <section class="admin-detail-block">
          <h4>Ученики</h4>
          <div class="staff-card__meta">${renderAdminPersonChips(students, (student) => `${student.studentName} · ${student.courseTitle} · ${student.curatorName || "куратор неизвестен"}`)}</div>
        </section>
        <section class="admin-detail-block">
          <h4>Кураторы</h4>
          <div class="staff-card__meta">${renderAdminPersonChips(curators, (curator) => `${curator.curatorName} · ${formatNumber(curator.studentsCount || 0)} учен.`)}</div>
        </section>
      </details>
    </article>
  `;
}

function renderAdminTeachers() {
  const teachers = getStaffItems("teachers");

  return `
    ${renderAdminMetrics()}
    ${renderAdminAddDetails("Добавить преподавателя", renderAdminTeacherForm())}
    <div class="staff-card-grid">
      ${teachers.length ? teachers.map(renderAdminTeacherCard).join("") : renderStaffEmpty("Преподаватели пока не добавлены.")}
    </div>
  `;
}

function renderAdminCuratorForm(curator = {}) {
  const teacherIds = (curator.teachers || []).map((teacher) => teacher.teacherId);

  return `
    <form class="staff-lesson-form admin-edit-form" data-admin-curator-form>
      <input type="hidden" name="curatorId" value="${escapeHtml(curator.curatorId || "")}" />
      <label>Имя<input name="firstName" type="text" value="${escapeHtml(curator.firstName || "")}" placeholder="Пока неизвестно" /></label>
      <label>Фамилия<input name="lastName" type="text" value="${escapeHtml(curator.lastName || "")}" placeholder="Пока неизвестно" /></label>
      <label>Телефон<input name="phone" type="text" value="${escapeHtml(curator.phone || "")}" placeholder="Пока неизвестно" /></label>
      <label>Email<input name="email" type="email" value="${escapeHtml(curator.email || "")}" placeholder="Пока неизвестно" /></label>
      <label>Telegram<input name="telegramLink" type="url" value="${escapeHtml(curator.telegram || "")}" placeholder="Пока неизвестно" /></label>
      <label>Логин<input name="login" type="text" value="${escapeHtml(curator.login || "")}" placeholder="Пока неизвестно" /></label>
      <label>Новый пароль<input name="password" type="password" minlength="6" placeholder="${curator.curatorId ? "Оставьте пустым, чтобы не менять" : "curator123 по умолчанию"}" /></label>
      <label>Преподаватели<select name="teacherIds" multiple size="4">${renderAdminTeacherMultiOptions(teacherIds)}</select></label>
      <button type="submit"><svg><use href="#icon-upload" /></svg>${curator.curatorId ? "Сохранить" : "Добавить"}</button>
      <p class="staff-form-status" aria-live="polite"></p>
    </form>
  `;
}

function renderAdminCuratorCardLegacy(curator) {
  const courses = curator.courses || [];
  const students = curator.students || [];
  const teachers = curator.teachers || [];

  return `
    <article class="staff-card admin-person-card">
      <div class="staff-card__meta">
        <span class="resource-chip is-green">Средняя оценка ${Number(curator.rating || 0).toFixed(1)} / 10</span>
        <span class="resource-chip is-blue">${formatNumber(curator.studentsCount || 0)} учен.</span>
        <span class="resource-chip">${formatNumber(curator.teachersCount || teachers.length)} преп.</span>
      </div>
      <h3>${escapeHtml(curator.curatorName || "Пока неизвестно")}</h3>
      <p>${escapeHtml([curator.phone, curator.email, curator.telegram].filter(Boolean).join(" · ") || "Контакты пока неизвестны")}</p>
      <div class="staff-info-grid">
        <span>Проверено преподавателями<strong>${formatNumber(curator.homeworkCheckedByTeachers || 0)}</strong></span>
        <span>Фидбек куратора<strong>${formatNumber(curator.curatorFeedbackTotal || 0)}</strong></span>
        <span>Курсы<strong>${formatNumber(curator.coursesCount || courses.length)}</strong></span>
        <span>Логин<strong>${escapeHtml(adminText(curator.login))}</strong></span>
      </div>
      <details class="staff-details">
        <summary>Вся информация и редактирование</summary>
        ${renderAdminCuratorForm(curator)}
        <section class="admin-detail-block">
          <h4>Курсы</h4>
          <div class="staff-card__meta">${renderAdminPersonChips(courses, (course) => `${course.courseTitle} · ${course.teacherNames || "преподаватель неизвестен"} · ${formatNumber(course.studentsCount || 0)} учен.`)}</div>
        </section>
        <section class="admin-detail-block">
          <h4>Ученики</h4>
          <div class="staff-card__meta">${renderAdminPersonChips(students, (student) => `${student.studentName} · ${student.courseTitle} · ${student.teacherName || "преподаватель неизвестен"}`)}</div>
        </section>
        <section class="admin-detail-block">
          <h4>Преподаватели</h4>
          <div class="staff-card__meta">${renderAdminPersonChips(teachers, (teacher) => `${teacher.teacherName} · ${formatNumber(teacher.studentsCount || 0)} учен.`)}</div>
        </section>
      </details>
    </article>
  `;
}

function renderAdminCurators() {
  const curators = getStaffItems("curators");

  return `
    ${renderAdminMetrics()}
    ${renderAdminAddDetails("Добавить куратора", renderAdminCuratorForm())}
    <div class="staff-card-grid">
      ${curators.length ? curators.map(renderAdminCuratorCard).join("") : renderStaffEmpty("Кураторы пока не добавлены.")}
    </div>
  `;
}

function renderAdminTeacherCard(teacher) {
  const courses = teacher.courses || [];
  const students = teacher.students || [];
  const curators = teacher.curators || [];

  return `
    <article class="staff-card admin-person-card admin-compact-card">
      <div class="staff-card__meta">
        <span class="resource-chip is-green">Рейтинг ${Number(teacher.rating || 0).toFixed(1)} / 10</span>
        <span class="resource-chip is-blue">${formatNumber(teacher.studentsCount || 0)} учен.</span>
        <span class="resource-chip">${formatNumber(teacher.coursesCount || courses.length)} курс.</span>
      </div>
      <h3>${escapeHtml(teacher.teacherName || "Пока неизвестно")}</h3>
      <p>${escapeHtml([teacher.phone, teacher.email, teacher.telegram].filter(Boolean).join(" · ") || "Контакты пока неизвестны")}</p>
      <details class="staff-details admin-person-details">
        <summary>Подробности и редактирование преподавателя</summary>
        <div class="staff-info-grid">
          <span>ДЗ прислали<strong>${formatNumber(teacher.homeworkSubmitted || 0)}</strong></span>
          <span>ДЗ проверено<strong>${formatNumber(teacher.homeworkChecked || 0)}</strong></span>
          <span>Средний балл за ДЗ<strong>${Number(teacher.averageHomeworkScore || 0).toFixed(1)}</strong></span>
          <span>Логин<strong>${escapeHtml(adminText(teacher.login))}</strong></span>
        </div>
        <section class="admin-detail-block">
          <h4>Личные данные</h4>
        ${renderAdminTeacherForm(teacher)}
        </section>
        <section class="admin-detail-block">
          <h4>Курсы</h4>
          <div class="admin-course-list">
            ${
              courses.length
                ? courses
                    .map(
                      (course) => `
                        <div class="staff-reviewed-note">
                          <strong>${escapeHtml(course.courseTitle)} · ${formatNumber(course.studentsCount || 0)} учен.</strong>
                          <span>${escapeHtml(course.curatorNames || "Куратор не указан")}</span>
                          ${renderAdminCourseStaffForm(course, { teacherId: teacher.teacherId, curatorId: course.courseCuratorId || "" })}
                        </div>
                      `,
                    )
                    .join("")
                : `<div class="staff-reviewed-note is-muted"><strong>Курсы не закреплены</strong><span>Выберите курс ниже.</span></div>`
            }
            <div class="staff-reviewed-note is-pending">
              <strong>Добавить курс преподавателю</strong>
              ${renderAdminCourseStaffForm({}, { teacherId: teacher.teacherId })}
            </div>
          </div>
        </section>
        <section class="admin-detail-block">
          <h4>Ученики</h4>
          <div class="admin-course-list">
            ${
              students.length
                ? students
                    .map(
                      (student) => `
                        <div class="staff-reviewed-note">
                          <strong>${escapeHtml(student.studentName)} · ${escapeHtml(student.courseTitle)}</strong>
                          <span>${escapeHtml(student.curatorName || "Куратор не указан")}</span>
                          ${renderAdminEnrollmentForm(student, {
                            courseId: student.courseId,
                            teacherId: teacher.teacherId,
                            curatorId: student.curatorId || "",
                            enrollmentStatus: student.enrollmentStatus || "Active",
                          })}
                        </div>
                      `,
                    )
                    .join("")
                : `<div class="staff-reviewed-note is-muted"><strong>Ученики не закреплены</strong><span>Их можно добавить через раздел учеников.</span></div>`
            }
          </div>
        </section>
        <section class="admin-detail-block">
          <h4>Кураторы</h4>
          <div class="staff-card__meta">${renderAdminPersonChips(curators, (curator) => `${curator.curatorName} · ${formatNumber(curator.studentsCount || 0)} учен.`)}</div>
        </section>
      </details>
    </article>
  `;
}

function renderAdminCuratorCard(curator) {
  const courses = curator.courses || [];
  const students = curator.students || [];
  const teachers = curator.teachers || [];

  return `
    <article class="staff-card admin-person-card admin-compact-card">
      <div class="staff-card__meta">
        <span class="resource-chip is-green">Средняя оценка ${Number(curator.rating || 0).toFixed(1)} / 10</span>
        <span class="resource-chip is-blue">${formatNumber(curator.studentsCount || 0)} учен.</span>
        <span class="resource-chip">${formatNumber(curator.teachersCount || teachers.length)} преп.</span>
      </div>
      <h3>${escapeHtml(curator.curatorName || "Пока неизвестно")}</h3>
      <p>${escapeHtml([curator.phone, curator.email, curator.telegram].filter(Boolean).join(" · ") || "Контакты пока неизвестны")}</p>
      <details class="staff-details admin-person-details">
        <summary>Подробности и редактирование куратора</summary>
        <div class="staff-info-grid">
          <span>Проверено преподавателями<strong>${formatNumber(curator.homeworkCheckedByTeachers || 0)}</strong></span>
          <span>Фидбек куратора<strong>${formatNumber(curator.curatorFeedbackTotal || 0)}</strong></span>
          <span>Курсы<strong>${formatNumber(curator.coursesCount || courses.length)}</strong></span>
          <span>Логин<strong>${escapeHtml(adminText(curator.login))}</strong></span>
        </div>
        <section class="admin-detail-block">
          <h4>Личные данные</h4>
        ${renderAdminCuratorForm(curator)}
        </section>
        <section class="admin-detail-block">
          <h4>Курсы</h4>
          <div class="admin-course-list">
            ${
              courses.length
                ? courses
                    .map(
                      (course) => `
                        <div class="staff-reviewed-note">
                          <strong>${escapeHtml(course.courseTitle)} · ${formatNumber(course.studentsCount || 0)} учен.</strong>
                          <span>${escapeHtml(course.teacherNames || "Преподаватель не указан")}</span>
                          ${renderAdminCourseStaffForm(course, { teacherId: course.courseTeacherId || "", curatorId: curator.curatorId })}
                        </div>
                      `,
                    )
                    .join("")
                : `<div class="staff-reviewed-note is-muted"><strong>Курсы не закреплены</strong><span>Выберите курс ниже.</span></div>`
            }
            <div class="staff-reviewed-note is-pending">
              <strong>Добавить курс куратору</strong>
              ${renderAdminCourseStaffForm({}, { curatorId: curator.curatorId })}
            </div>
          </div>
        </section>
        <section class="admin-detail-block">
          <h4>Ученики</h4>
          <div class="admin-course-list">
            ${
              students.length
                ? students
                    .map(
                      (student) => `
                        <div class="staff-reviewed-note">
                          <strong>${escapeHtml(student.studentName)} · ${escapeHtml(student.courseTitle)}</strong>
                          <span>${escapeHtml(student.teacherName || "Преподаватель не указан")}</span>
                          ${renderAdminEnrollmentForm(student, {
                            courseId: student.courseId,
                            teacherId: student.teacherId || "",
                            curatorId: curator.curatorId,
                            enrollmentStatus: student.enrollmentStatus || "Active",
                          })}
                        </div>
                      `,
                    )
                    .join("")
                : `<div class="staff-reviewed-note is-muted"><strong>Ученики не закреплены</strong><span>Их можно добавить через раздел учеников.</span></div>`
            }
          </div>
        </section>
        <section class="admin-detail-block">
          <h4>Преподаватели</h4>
          <div class="staff-card__meta">${renderAdminPersonChips(teachers, (teacher) => `${teacher.teacherName} · ${formatNumber(teacher.studentsCount || 0)} учен.`)}</div>
        </section>
      </details>
    </article>
  `;
}

function renderStaffPage(pageName = currentStaffPage) {
  if (pageName === "messages") {
    return;
  }

  const content = getStaffContent();

  if (!content) {
    return;
  }

  updateStaffWorkspaceHeader(pageName);

  if (pageName === "account") {
    content.innerHTML = renderStaffAccount();
    return;
  }

  if (!latestStaffWorkspace) {
    content.innerHTML = renderStaffEmpty("Загружаю данные из базы...");
    return;
  }

  const role = getStaffProfile().role;

  if (role === "Admin") {
    if (pageName === "applications") {
      content.innerHTML = renderAdminApplications();
      return;
    }

    if (pageName === "support") {
      content.innerHTML = renderAdminSupportRequests();
      return;
    }

    if (pageName === "students") {
      content.innerHTML = renderAdminStudents();
      return;
    }

    if (pageName === "parents") {
      content.innerHTML = renderAdminParents();
      return;
    }

    if (pageName === "teachers") {
      content.innerHTML = renderAdminTeachers();
      return;
    }

    if (pageName === "curators") {
      content.innerHTML = renderAdminCurators();
      return;
    }
  }

  if (pageName === "points") {
    content.innerHTML = renderStaffPoints();
    return;
  }

  if (pageName === "students") {
    content.innerHTML = renderStaffStudents();
    return;
  }

  if (role === "Teacher") {
    if (pageName === "homework") {
      content.innerHTML = renderTeacherHomeworkEnhanced();
      return;
    }

    if (pageName === "archive") {
      content.innerHTML = renderTeacherArchivePage();
      return;
    }

    if (pageName === "courses") {
      content.innerHTML = renderTeacherCourses();
      return;
    }
  }

  if (role === "Curator") {
    if (pageName === "teachers") {
      content.innerHTML = renderCuratorTeachers();
      return;
    }

    if (pageName === "calls") {
      content.innerHTML = renderCuratorCalls();
      return;
    }

    if (["lessons", "notes", "homework", "streams"].includes(pageName)) {
      content.innerHTML = renderCuratorResourcePage(pageName);
      return;
    }

    if (pageName === "archive") {
      content.innerHTML = renderCuratorArchivePage();
      return;
    }
  }

  content.innerHTML = renderStaffEmpty("Раздел пока не настроен для этой роли.");
}

function setInlineFormStatus(form, message, type = "") {
  const status = form?.querySelector(".staff-form-status");

  if (!status) {
    return;
  }

  status.textContent = message;
  status.className = `staff-form-status${type ? ` is-${type}` : ""}`;
}

async function submitStaffJsonForm(form, url, successMessage, buildPayload = null) {
  const submitButton = form.querySelector("button[type='submit']");
  const payload = buildPayload ? buildPayload(form) : Object.fromEntries(new FormData(form).entries());

  if (submitButton) {
    submitButton.disabled = true;
  }

  setInlineFormStatus(form, "Сохраняю в базе...", "pending");

  try {
    const response = await apiFetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || result.error || "Не удалось сохранить");
    }

    setInlineFormStatus(form, successMessage, "success");
    setStaffWorkspaceStatus(successMessage, "success");
    await loadStaffWorkspace({ silent: true });
    return result;
  } catch (error) {
    setInlineFormStatus(form, error.message || "Ошибка сохранения.", "error");
    setStaffWorkspaceStatus(error.message || "Ошибка сохранения.", "error");
    return null;
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
    }
  }
}

async function submitStaffLogin(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const submitButton = form.querySelector("button[type='submit']");
  const payload = Object.fromEntries(new FormData(form).entries());

  if (submitButton) {
    submitButton.disabled = true;
  }

  setStaffAuthStatus("Проверяю вход команды...", "pending");

  try {
    const response = await apiFetch("/api/staff/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const staff = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(staff.message || staff.error || "Не удалось войти");
    }

    saveStoredStaff(staff);
    updateStaffSessionUi(staff);
    form.reset();
    setStaffAuthStatus("Вход команды выполнен.", "success");
    enterStaffMode(staff, "messages");
  } catch (error) {
    setStaffAuthStatus(error.message || "Не удалось связаться с сервером.", "error");
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
    }
  }
}

async function loadStaffMe() {
  if (!hasAuthenticatedStaff()) {
    updateStaffSessionUi(null);
    return null;
  }

  try {
    const response = await apiFetch("/api/staff/me", { cache: "no-store" });
    const staff = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(staff.message || staff.error || "Сессия команды истекла");
    }

    saveStoredStaff(staff);
    updateStaffSessionUi(staff);
    enterStaffMode(staff);
    return staff;
  } catch (error) {
    clearStoredStaff();
    updateStaffSessionUi(null);
    if (document.querySelector(".app")?.classList.contains("is-staff-mode")) {
      exitStaffMode();
    }
    setStaffAuthStatus("Войдите в команду заново.", "error");
    return null;
  }
}

function setMessageStatus(message, type = "") {
  if (!messageStatus) {
    return;
  }

  messageStatus.textContent = message;
  messageStatus.className = `application-status${type ? ` is-${type}` : ""}`;
}

function getMessageActor() {
  if (hasAuthenticatedStaff()) {
    return {
      role: currentStaff.staff.role,
      label: getStaffRoleLabel(currentStaff.staff.role),
      name: currentStaff.staff.name || currentStaff.staff.login,
    };
  }

  if (hasAuthenticatedAccount()) {
    return {
      role: "Student",
      label: "Ученик",
      name: getStudentFullName(currentAccount.student) || getCurrentLogin(currentAccount),
    };
  }

  return null;
}

function getMessageTargetLabel(role = "") {
  return {
    Admin: "Администратор",
    Teacher: "Преподаватель",
    Curator: "Куратор",
    Student: "Ученик",
  }[role] || role || "Адресат";
}

function getConversationFilterType(conversation = {}) {
  if (conversation.chatType === "TeacherAdmin") {
    return "teachers";
  }

  if (conversation.chatType === "CuratorAdmin") {
    return "curators";
  }

  if (conversation.chatType === "StudentAdmin") {
    return "students";
  }

  return "all";
}

function renderMessageStartPanel(recipients = [], actor = getMessageActor()) {
  if (!actor) {
    return "";
  }

  const options = recipients
    .map(
      (recipient) => `
        <option value="${escapeHtml(`${recipient.targetRole}:${recipient.targetId}`)}">
          ${escapeHtml(getMessageTargetLabel(recipient.targetRole))}: ${escapeHtml(recipient.targetName)}${recipient.subtitle ? ` · ${escapeHtml(recipient.subtitle)}` : ""}
        </option>
      `,
    )
    .join("");

  const filters =
    actor.role === "Admin"
      ? `
        <div class="conversation-filters" data-message-filter-scope>
          ${[
            ["all", "Все"],
            ["teachers", "Преподаватели"],
            ["curators", "Кураторы"],
            ["students", "Ученики"],
          ]
            .map((item) => `<button type="button" class="${currentMessageFilter === item[0] ? "is-active" : ""}" data-message-filter="${item[0]}">${item[1]}</button>`)
            .join("")}
        </div>
      `
      : "";

  return `
    <form class="conversation-start-form" data-message-start-form>
      <label>
        Кому написать
        <select name="recipient" ${recipients.length ? "" : "disabled"} required>
          <option value="">Выберите адресата</option>
          ${options}
        </select>
      </label>
      <button type="submit" ${recipients.length ? "" : "disabled"}>
        <svg><use href="#icon-message" /></svg>Создать чат
      </button>
      ${recipients.length ? "" : `<p>Нет доступных адресатов.</p>`}
    </form>
    ${filters}
  `;
}

function renderStudentFriendsPanel(friendState = null, actor = getMessageActor(), { open = false } = {}) {
  if (actor?.role !== "Student") {
    return "";
  }

  const friends = friendState?.friends || [];
  const incoming = friendState?.incomingRequests || [];
  const outgoing = friendState?.outgoingRequests || [];
  const suggestions = friendState?.suggestions || [];
  const renderPerson = (person, actions = "") => {
    const badgeMarkup = renderProfileBadgeMarkup(person, "friend-card__badge");
    const avatarMarkup = renderPixelPetMarkup(person.profileItems || [], {
      wrapperClass: "friend-card__avatar",
      petClass: "friend-card__pet",
    });

    return `
      <article class="friend-card">
        ${avatarMarkup}
        <div class="friend-card__body">
          <strong>${escapeHtml(person.studentName || "Ученик")}</strong>
          <span>${escapeHtml(person.subtitle || getProfileStatusLabel(person.profileStatus) || "Профиль ученика")}</span>
          ${badgeMarkup ? `<div class="friend-card__badges">${badgeMarkup}</div>` : ""}
        </div>
        <div class="friend-card__actions">${actions}</div>
      </article>
    `;
  };

  return `
    <section class="friends-panel">
      <details ${open ? "open" : ""}>
        <summary>Друзья и заявки</summary>
        <div class="friends-panel__grid">
          <section>
            <h3>Друзья</h3>
            ${
              friends.length
                ? friends
                    .map((friend) =>
                      renderPerson(
                        friend,
                        `
                          <button type="button" data-start-friend-chat="${escapeHtml(friend.studentId)}"><svg><use href="#icon-message" /></svg>Написать</button>
                          <button type="button" data-friend-remove="${escapeHtml(friend.studentId)}">Удалить</button>
                        `,
                      ),
                    )
                    .join("")
                : `<p class="resource-empty">Друзей пока нет.</p>`
            }
          </section>
          <section>
            <h3>Входящие</h3>
            ${
              incoming.length
                ? incoming
                    .map((request) =>
                      renderPerson(
                        request,
                        `
                          <button type="button" data-friend-respond="${escapeHtml(request.requestId)}" data-friend-action="accept">Принять</button>
                          <button type="button" data-friend-respond="${escapeHtml(request.requestId)}" data-friend-action="decline">Отклонить</button>
                        `,
                      ),
                    )
                    .join("")
                : `<p class="resource-empty">Новых заявок нет.</p>`
            }
          </section>
          <section>
            <h3>Исходящие</h3>
            ${
              outgoing.length
                ? outgoing
                    .map((request) =>
                      renderPerson(request, `<button type="button" data-friend-cancel="${escapeHtml(request.requestId)}">Отозвать</button>`),
                    )
                    .join("")
                : `<p class="resource-empty">Исходящих заявок нет.</p>`
            }
          </section>
          <section>
            <h3>Найти друзей</h3>
            ${
              suggestions.length
                ? suggestions
                    .map((student) =>
                      renderPerson(student, `<button type="button" data-friend-request="${escapeHtml(student.studentId)}">Добавить</button>`),
                    )
                    .join("")
                : `<p class="resource-empty">Новых учеников для заявки пока нет.</p>`
            }
          </section>
        </div>
      </details>
    </section>
  `;
}

function renderMessages(payload) {
  latestMessages = payload;
  const actor = getMessageActor();
  const conversations = payload?.conversations || [];
  const messages = payload?.messages || [];
  currentConversationId = payload?.activeConversationId || conversations[0]?.conversationId || currentConversationId;

  if (messageThreadRole) {
    messageThreadRole.textContent = actor ? actor.label : "Чат";
  }

  const activeConversation = conversations.find((conversation) => String(conversation.conversationId) === String(currentConversationId));

  if (messageThreadTitle) {
    messageThreadTitle.textContent = activeConversation?.title || (actor ? "Учебный чат" : "Выберите чат");
  }

  if (conversationList) {
    const recipients = payload?.recipients || [];
    const filteredConversations =
      actor?.role === "Admin" && currentMessageFilter !== "all"
        ? conversations.filter((conversation) => getConversationFilterType(conversation) === currentMessageFilter)
        : conversations;
    const friendsPanel = renderStudentFriendsPanel(payload?.friends, actor);

    if (filteredConversations.length === 0) {
      conversationList.innerHTML = `${renderMessageStartPanel(recipients, actor)}${friendsPanel}<div class="resource-empty">Чаты пока не найдены.</div>`;
    } else {
      conversationList.innerHTML =
        renderMessageStartPanel(recipients, actor) +
        friendsPanel +
        filteredConversations
        .map((conversation) => `
          <button class="conversation-button ${String(conversation.conversationId) === String(currentConversationId) ? "is-active" : ""}" type="button" data-conversation-id="${escapeHtml(conversation.conversationId)}">
            <strong>${escapeHtml(conversation.title)}</strong>
            <span>${escapeHtml([conversation.studentName, conversation.friendStudentName, conversation.teacherName, conversation.curatorName, conversation.adminName].filter(Boolean).join(" · ") || conversation.staffName || "Учебный чат")}</span>
            <span>${escapeHtml(conversation.chatType === "TeacherAdmin" ? "Чат с преподавателем" : conversation.chatType === "CuratorAdmin" ? "Чат с куратором" : conversation.chatType === "StudentAdmin" ? "Чат с учеником" : conversation.chatType === "StudentFriend" ? "Чат с другом" : "Учебный чат")}</span>
            <span>${escapeHtml(formatStreamDate(conversation.lastMessageAt || conversation.createdAt))}</span>
          </button>
        `)
        .join("");
    }
  }

  if (!messageList) {
    return;
  }

  if (!actor) {
    messageList.innerHTML = `<div class="resource-empty">Войдите в аккаунт ученика или команды, чтобы читать сообщения.</div>`;
    return;
  }

  if (messages.length === 0) {
    messageList.innerHTML = `<div class="resource-empty">В этом чате пока нет сообщений.</div>`;
    return;
  }

  messageList.innerHTML = messages
    .map((message) => {
      const isOwn = Boolean(message.isOwn);
      const avatar = renderPixelPetMarkup(message.profileItems || [], {
        wrapperClass: "message-profile-pet",
        petClass: "message-profile-pet__pet",
      });
      const badge = renderProfileBadgeMarkup(message, "message-profile-badge");
      return `
        <article class="message-bubble ${isOwn ? "is-own" : ""}">
          <div class="message-bubble__head">
            ${avatar}
            <div class="message-bubble__author">
              <strong>${escapeHtml(message.senderName || message.senderRole)}</strong>
              ${badge}
            </div>
          </div>
          <p>${escapeHtml(message.messageText)}</p>
          <time>${escapeHtml(formatStreamDate(message.sentAt))}</time>
        </article>
      `;
    })
    .join("");
}

async function loadMessages(conversationId = currentConversationId) {
  const actor = getMessageActor();

  if (!actor) {
    currentConversationId = null;
    renderMessages({ conversations: [], messages: [] });
    setMessageStatus("Войдите как ученик или сотрудник команды.", "error");
    return null;
  }

  setMessageStatus("Загружаю сообщения...", "pending");

  try {
    const query = conversationId ? `?conversationId=${encodeURIComponent(conversationId)}` : "";
    const response = await apiFetch(`/api/messages${query}`, { cache: "no-store" });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload.message || payload.error || "Сообщения не загрузились");
    }

    renderMessages(payload);
    setMessageStatus("", "");
    return payload;
  } catch (error) {
    setMessageStatus(error.message || "Не удалось загрузить сообщения.", "error");
    return null;
  }
}

function renderAccountFriends(friendState = null) {
  if (!accountFriendsList) {
    return;
  }

  if (!hasAuthenticatedAccount()) {
    accountFriendsList.innerHTML = `<div class="resource-empty">Войдите в аккаунт, чтобы видеть друзей и заявки.</div>`;
    return;
  }

  accountFriendsList.innerHTML =
    renderStudentFriendsPanel(friendState, { role: "Student" }, { open: true }) ||
    `<div class="resource-empty">Друзья и заявки пока не загрузились.</div>`;
}

async function loadAccountFriends() {
  if (!accountFriendsList) {
    return null;
  }

  if (!hasAuthenticatedAccount()) {
    renderAccountFriends(null);
    return null;
  }

  accountFriendsList.innerHTML = `<div class="resource-empty">Загружаю друзей из базы...</div>`;

  try {
    const response = await apiFetch("/api/friends", { cache: "no-store" });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload.message || payload.error || "Не удалось загрузить друзей.");
    }

    renderAccountFriends(payload);
    return payload;
  } catch (error) {
    accountFriendsList.innerHTML = `<div class="resource-empty">${escapeHtml(error.message || "Друзья не загрузились.")}</div>`;
    return null;
  }
}

async function startMessageConversation(form) {
  const value = String(new FormData(form).get("recipient") || "");
  const [targetRole, targetId] = value.split(":");

  if (!targetRole || !targetId) {
    setMessageStatus("Выберите адресата.", "error");
    return;
  }

  const button = form.querySelector("button[type='submit']");

  if (button) {
    button.disabled = true;
  }

  setMessageStatus("Создаю чат...", "pending");

  try {
    const response = await apiFetch("/api/messages/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ targetRole, targetId }),
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || result.error || "Не удалось создать чат");
    }

    currentConversationId = result.activeConversationId;
    if (getMessageActor()?.role === "Admin") {
      currentMessageFilter = targetRole === "Teacher" ? "teachers" : targetRole === "Curator" ? "curators" : targetRole === "Student" ? "students" : currentMessageFilter;
    }
    await loadMessages(currentConversationId);
    setMessageStatus("Чат открыт.", "success");
  } catch (error) {
    setMessageStatus(error.message || "Не удалось создать чат.", "error");
  } finally {
    if (button) {
      button.disabled = false;
    }
  }
}

async function startStudentFriendChat(friendId) {
  if (!friendId) {
    return;
  }

  setMessageStatus("Открываю чат с другом...", "pending");

  try {
    const response = await apiFetch("/api/messages/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ targetRole: "Student", targetId: friendId }),
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || result.error || "Не удалось открыть чат с другом.");
    }

    currentConversationId = result.activeConversationId;
    showPage("messages");
    setActiveNav("messages");
    history.replaceState(null, "", "#messages");
    await loadMessages(currentConversationId);
    setMessageStatus("Чат с другом открыт.", "success");
  } catch (error) {
    setMessageStatus(error.message || "Не удалось открыть чат с другом.", "error");
  }
}

async function startCurrentCourseCuratorChat() {
  if (!hasAuthenticatedAccount()) {
    openAccount();
    setAuthStatus("Войдите или создайте аккаунт, чтобы написать куратору.", "error");
    return;
  }

  const curator = getCurrentCourseCurator();
  const accountCourse = getAccountCourse(currentCourseKey);

  if (!currentCourseAccess?.isOwned && !accountCourse?.isOwned) {
    setAuthStatus("Чат с куратором откроется после покупки курса.", "error");
    return;
  }

  if (!curator.curatorId) {
    setAuthStatus("Куратор для этого курса пока не указан в базе.", "error");
    return;
  }

  if (detailCuratorButton) {
    detailCuratorButton.disabled = true;
  }

  try {
    const response = await apiFetch("/api/messages/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ targetRole: "Curator", targetId: curator.curatorId }),
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || result.error || "Не удалось открыть чат с куратором.");
    }

    currentConversationId = result.activeConversationId;
    openMessages();
    await loadMessages(currentConversationId);
    setMessageStatus(`Чат с куратором ${curator.curatorName || ""} открыт.`, "success");
  } catch (error) {
    setAuthStatus(error.message || "Не удалось открыть чат с куратором.", "error");
  } finally {
    updateCourseCuratorPanel();
  }
}

async function sendFriendAction(endpoint, payload = {}) {
  setMessageStatus("Обновляю друзей...", "pending");

  try {
    const response = await apiFetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || result.error || "Не удалось обновить друзей.");
    }

    await Promise.allSettled([loadMessages(currentConversationId), loadAccountFriends()]);
    setMessageStatus(result.message || "Друзья обновлены.", "success");
  } catch (error) {
    setMessageStatus(error.message || "Не удалось обновить друзей.", "error");
  }
}

async function submitMessage(event) {
  event.preventDefault();

  const actor = getMessageActor();

  if (!actor) {
    setMessageStatus("Сначала войдите в аккаунт ученика или команды.", "error");
    return;
  }

  const form = event.currentTarget;
  const submitButton = form.querySelector("button[type='submit']");
  const payload = Object.fromEntries(new FormData(form).entries());
  payload.conversationId = currentConversationId;

  if (!String(payload.messageText || "").trim()) {
    setMessageStatus("Введите сообщение.", "error");
    form.querySelector("[name='messageText']")?.focus();
    return;
  }

  if (submitButton) {
    submitButton.disabled = true;
  }

  setMessageStatus("Отправляю сообщение...", "pending");

  try {
    const response = await apiFetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || result.error || "Сообщение не отправлено");
    }

    form.reset();
    setMessageStatus("Сообщение отправлено.", "success");
    await loadMessages(result.activeConversationId || currentConversationId);
  } catch (error) {
    setMessageStatus(error.message || "Не удалось отправить сообщение.", "error");
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
    }
  }
}

function normalizeLesson(rawLesson) {
  const lessonTitle = cleanDisplayText(rawLesson.lessonTitle ?? rawLesson.Lesson_Title, "Урок");
  return {
    lessonId: rawLesson.lessonId ?? rawLesson.Lesson_ID ?? null,
    lessonNumber: rawLesson.lessonNumber ?? rawLesson.Lesson_Number,
    lessonTitle,
    topic: cleanDisplayText(rawLesson.topic ?? rawLesson.Topic, ""),
    lessonStatus: rawLesson.lessonStatus ?? rawLesson.Lesson_Status ?? "Open",
    videoUrl: rawLesson.videoUrl ?? rawLesson.Video_Link ?? null,
    notesUrl: rawLesson.notesUrl ?? rawLesson.Notes_Link ?? null,
    homeworkUrl: rawLesson.homeworkUrl ?? rawLesson.Homework_Link ?? rawLesson.homeworkTaskUrl ?? null,
    homeworkTemplateId: rawLesson.homeworkTemplateId ?? null,
    homeworkTitle: cleanDisplayText(rawLesson.homeworkTitle ?? rawLesson.homeworkName, null),
    homeworkDescription: cleanDisplayText(rawLesson.homeworkDescription, ""),
    homeworkTaskUrl: rawLesson.homeworkTaskUrl ?? rawLesson.homeworkUrl ?? rawLesson.Homework_Link ?? null,
    homeworkAssignmentId: rawLesson.homeworkAssignmentId ?? null,
    homeworkStatus: rawLesson.homeworkStatus ?? null,
    homeworkDueAt: rawLesson.homeworkDueAt ?? null,
    homeworkUploadUrl: rawLesson.homeworkUploadUrl ?? null,
    homeworkSubmissionId: rawLesson.homeworkSubmissionId ?? null,
    submittedHomeworkUrl: rawLesson.submittedHomeworkUrl ?? null,
    submissionStatus: rawLesson.submissionStatus ?? null,
    feedbackUrl: rawLesson.feedbackUrl ?? null,
    feedbackText: rawLesson.feedbackText ?? null,
    teacherComment: rawLesson.teacherComment ?? null,
    homeworkScore: rawLesson.homeworkScore ?? null,
    checkedAt: rawLesson.checkedAt ?? null,
    correctionId: rawLesson.correctionId ?? null,
    correctionStatus: rawLesson.correctionStatus ?? null,
    correctionSubmittedUrl: rawLesson.correctionSubmittedUrl ?? null,
    correctionSubmittedAt: rawLesson.correctionSubmittedAt ?? null,
    correctionScore: rawLesson.correctionScore ?? null,
    correctionFeedbackText: rawLesson.correctionFeedbackText ?? null,
    correctionCheckedAt: rawLesson.correctionCheckedAt ?? null,
  };
}

function normalizeNote(rawNote) {
  return {
    noteId: rawNote.noteId,
    courseSlug: rawNote.courseSlug,
    courseTitle: rawNote.courseTitle || "Курс",
    lessonNumber: rawNote.lessonNumber,
    lessonTitle: rawNote.lessonTitle,
    materialTitle: rawNote.materialTitle || "Конспект",
    materialType: rawNote.materialType || "Конспект",
    authorName: rawNote.authorName || "",
    fileUrl: rawNote.fileUrl,
    isOwned: Boolean(rawNote.isOwned),
  };
}

async function loadLessonsFromApi(courseKey) {
  const response = await apiFetch(`/api/courses/${encodeURIComponent(courseKey)}/lessons`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Не удалось получить уроки: ${response.status}`);
  }

  const payload = await response.json();
  return {
    source: payload.source || "database",
    course: payload.course || null,
    lessons: (payload.lessons || []).map(normalizeLesson),
  };
}

async function loadNotesFromApi(courseKey = "") {
  const url = courseKey ? `/api/courses/${encodeURIComponent(courseKey)}/notes` : "/api/notes";
  const response = await apiFetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Не удалось получить конспекты: ${response.status}`);
  }

  const payload = await response.json();
  return (payload.items || []).map(normalizeNote);
}

function getNotesLibraryAccessKey() {
  const owned = getAccountCourses()
    .filter((course) => course.isOwned)
    .map((course) => course.courseSlug)
    .sort()
    .join(",");

  return `${hasAuthenticatedAccount() ? "student" : "guest"}:${owned}`;
}

function canViewLibraryNote(note) {
  return Number(note.lessonNumber || 0) === 1 || Boolean(getAccountCourse(note.courseSlug)?.isOwned) || Boolean(note.isOwned);
}

function filterNotesForCurrentAccess(notes) {
  return (notes || []).filter(canViewLibraryNote);
}

function normalizeStream(rawStream) {
  return {
    eventType: "stream",
    streamId: rawStream.streamId ?? rawStream.liveStreamId ?? rawStream.Live_Stream_ID ?? "",
    courseSlug: rawStream.courseSlug ?? rawStream.Course_Slug ?? "",
    courseTitle: rawStream.courseTitle ?? rawStream.Course_Name ?? "Курс",
    lessonNumber: rawStream.lessonNumber ?? rawStream.Lesson_Number ?? null,
    lessonTitle: rawStream.lessonTitle ?? rawStream.Lesson_Title ?? "",
    streamTitle: rawStream.streamTitle ?? rawStream.Stream_Title ?? "Трансляция",
    startsAt: rawStream.startsAt ?? rawStream.Starts_At ?? null,
    endsAt: rawStream.endsAt ?? rawStream.Ends_At ?? null,
    streamLink: rawStream.streamLink ?? rawStream.Stream_Link ?? "",
    recordLink: rawStream.recordLink ?? rawStream.Record_Link ?? "",
    status: rawStream.status ?? rawStream.Status ?? "Planned",
  };
}

function normalizeStudentCall(rawCall) {
  return {
    eventType: "call",
    callId: rawCall.callId ?? rawCall.studentCallId ?? rawCall.Student_Call_ID ?? "",
    callTitle: rawCall.callTitle ?? rawCall.title ?? rawCall.Call_Title ?? "Созвон с куратором",
    callLink: rawCall.callLink ?? rawCall.link ?? rawCall.Call_Link ?? "",
    startsAt: rawCall.startsAt ?? rawCall.Starts_At ?? null,
    status: rawCall.status ?? rawCall.Status ?? "Planned",
    curatorId: rawCall.curatorId ?? rawCall.Curator_ID ?? "",
    curatorName: rawCall.curatorName ?? rawCall.Curator_Name ?? "Куратор",
  };
}

function isFutureEvent(item) {
  const start = new Date(item?.startsAt || "");
  const end = new Date(item?.endsAt || "");
  const now = Date.now();

  if (!Number.isNaN(end.getTime())) {
    return end.getTime() >= now;
  }

  return !Number.isNaN(start.getTime()) && start.getTime() >= now;
}

function sortUpcomingEvents(items = []) {
  return [...items]
    .filter(isFutureEvent)
    .sort((left, right) => new Date(left.startsAt || 0) - new Date(right.startsAt || 0));
}

function formatRelativeEventTime(milliseconds) {
  const minutes = Math.max(1, Math.round(milliseconds / 60000));

  if (minutes < 60) {
    return `через ${minutes} мин`;
  }

  const hours = Math.round(minutes / 60);

  if (hours < 24) {
    return `через ${hours} ч`;
  }

  return `через ${Math.round(hours / 24)} дн`;
}

function getEventStatusMeta(eventItem = {}) {
  const now = Date.now();
  const start = new Date(eventItem.startsAt || "");
  const end = new Date(eventItem.endsAt || "");
  const status = String(eventItem.status || "Planned");

  if (status === "Live") {
    return { label: "Идёт сейчас", className: "is-green" };
  }

  if (!Number.isNaN(start.getTime()) && start.getTime() <= now && !Number.isNaN(end.getTime()) && end.getTime() >= now) {
    return { label: "Идёт сейчас", className: "is-green" };
  }

  if (!Number.isNaN(start.getTime()) && start.getTime() > now) {
    const startsIn = start.getTime() - now;
    return { label: formatRelativeEventTime(startsIn), className: startsIn < 60 * 60 * 1000 ? "is-yellow" : "is-blue" };
  }

  return { label: "Завершено", className: "is-muted" };
}

async function loadStreamsFromApi(courseKey = "") {
  const url = courseKey ? `/api/courses/${encodeURIComponent(courseKey)}/streams` : "/api/streams";
  const response = await apiFetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Не удалось получить трансляции: ${response.status}`);
  }

  const payload = await response.json();
  return (payload.items || []).map(normalizeStream);
}

async function loadStudentCallsFromApi() {
  if (!hasAuthenticatedAccount()) {
    return [];
  }

  const response = await apiFetch("/api/student/calls", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Не удалось получить созвоны: ${response.status}`);
  }

  const payload = await response.json();
  return (payload.items || []).map(normalizeStudentCall);
}

function getFallbackStreams(courseKey = "") {
  return fallbackStreams.map(normalizeStream).filter((stream) => !courseKey || stream.courseSlug === courseKey);
}

function formatStreamDate(value) {
  if (!value) {
    return "Время уточняется";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Время уточняется";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function toDateTimeLocalValue(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
}

function renderStreamCards(target, streams, { limit = 0, emptyText = "Ближайших трансляций пока нет." } = {}) {
  if (!target) {
    return;
  }

  const upcomingStreams = sortUpcomingEvents(streams);
  const visibleStreams = limit > 0 ? upcomingStreams.slice(0, limit) : upcomingStreams;

  if (visibleStreams.length === 0) {
    target.innerHTML = `<div class="resource-empty">${escapeHtml(emptyText)}</div>`;
    return;
  }

  target.innerHTML = visibleStreams
    .map((eventItem) => {
      const isCall = eventItem.eventType === "call";
      const lessonText = isCall ? "Созвон" : eventItem.lessonNumber ? `Урок ${escapeHtml(eventItem.lessonNumber)}` : "Общий эфир";
      const primaryLabel = isCall ? "Куратор" : eventItem.courseTitle;
      const title = isCall ? eventItem.callTitle : eventItem.streamTitle;
      const subtitle = isCall ? eventItem.curatorName || "Созвон с куратором" : eventItem.lessonTitle || "Онлайн-разбор с преподавателем";
      const link = isCall ? eventItem.callLink : eventItem.streamLink;
      const icon = isCall ? "#icon-user" : "#icon-broadcast";
      const actionText = isCall ? "Перейти к созвону" : "Открыть";
      const disabledText = isCall ? "Ссылка скоро" : "Ссылка скоро";
      const action = link
        ? `<a href="${escapeHtml(link)}" target="_blank" rel="noopener noreferrer"><svg><use href="${icon}" /></svg>${actionText}</a>`
        : `<button type="button" disabled><svg><use href="#icon-clock" /></svg>${disabledText}</button>`;
      const eventStatus = getEventStatusMeta(eventItem);
      const chatAction =
        !isCall && eventItem.streamId
          ? `<button type="button" data-open-stream-chat="${escapeHtml(eventItem.streamId)}"><svg><use href="#icon-message" /></svg>Чат</button>`
          : "";

      return `
        <article class="stream-card">
          <div>
            <div class="stream-card__meta">
              <span class="resource-chip is-blue">${escapeHtml(primaryLabel)}</span>
              <span class="resource-chip">${lessonText}</span>
              <span class="resource-chip ${eventStatus.className}">${escapeHtml(eventStatus.label)}</span>
              <span class="resource-chip is-yellow">${escapeHtml(formatStreamDate(eventItem.startsAt))}</span>
            </div>
            <h3>${escapeHtml(title)}</h3>
            <p>${escapeHtml(subtitle)}</p>
          </div>
          <div class="stream-card__actions">
            ${action}
            ${chatAction}
          </div>
        </article>
      `;
    })
    .join("");
}

function ensureStreamChatModal() {
  let modal = document.querySelector("#stream-chat-modal");

  if (modal) {
    return modal;
  }

  modal = document.createElement("div");
  modal.id = "stream-chat-modal";
  modal.className = "stream-chat-modal is-hidden";
  modal.innerHTML = `
    <div class="stream-chat-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="stream-chat-title">
      <header>
        <div>
          <span id="stream-chat-subtitle">Трансляция</span>
          <h2 id="stream-chat-title">Чат трансляции</h2>
        </div>
        <button type="button" data-close-stream-chat aria-label="Закрыть чат">×</button>
      </header>
      <div class="stream-chat-messages" id="stream-chat-messages"></div>
      <form class="stream-chat-form" id="stream-chat-form">
        <input name="messageText" type="text" maxlength="600" placeholder="Написать вопрос или сообщение..." required />
        <button type="submit"><svg><use href="#icon-message" /></svg>Отправить</button>
      </form>
      <p class="application-status" id="stream-chat-status" aria-live="polite"></p>
    </div>
  `;
  document.body.append(modal);

  modal.addEventListener("click", (event) => {
    const friendButton = event.target.closest("[data-friend-request]");

    if (friendButton) {
      event.preventDefault();
      sendFriendAction("/api/friends/request", { receiverId: friendButton.dataset.friendRequest });
      return;
    }

    if (event.target === modal || event.target.closest("[data-close-stream-chat]")) {
      closeStreamChat();
    }
  });

  modal.querySelector("#stream-chat-form")?.addEventListener("submit", submitStreamChatMessage);
  return modal;
}

function setStreamChatStatus(message, type = "") {
  const status = document.querySelector("#stream-chat-status");

  if (!status) {
    return;
  }

  status.textContent = message;
  status.className = `application-status${type ? ` is-${type}` : ""}`;
}

function renderStreamChat(payload) {
  const modal = ensureStreamChatModal();
  const stream = payload?.stream || {};
  const messages = payload?.messages || [];
  const title = modal.querySelector("#stream-chat-title");
  const subtitle = modal.querySelector("#stream-chat-subtitle");
  const messageBox = modal.querySelector("#stream-chat-messages");

  if (title) {
    title.textContent = stream.streamTitle || "Чат трансляции";
  }

  if (subtitle) {
    subtitle.textContent = [stream.courseTitle, stream.lessonNumber ? `Урок ${stream.lessonNumber}` : "", formatStreamDate(stream.startsAt)].filter(Boolean).join(" · ");
  }

  if (messageBox) {
    messageBox.innerHTML = messages.length
      ? messages
          .map(
            (message) => {
              const avatar = renderPixelPetMarkup(message.profileItems || [], {
                wrapperClass: `stream-chat-avatar ${message.isOwn ? "is-own" : ""}`,
                asButton: !message.isOwn,
                buttonAttrs: !message.isOwn ? `data-friend-request="${escapeHtml(message.studentId)}" title="Добавить в друзья"` : "",
              });

              return `
              <article class="stream-chat-message ${message.isOwn ? "is-own" : ""}">
                ${avatar}
                <div>
                  <div class="stream-chat-author">
                    <strong>${escapeHtml(message.studentName || "Ученик")}</strong>
                    ${renderProfileBadgeMarkup(message, "stream-chat-badge")}
                  </div>
                  <p>${escapeHtml(message.messageText)}</p>
                  <time>${escapeHtml(formatStreamDate(message.createdAt))}</time>
                </div>
              </article>
            `;
            },
          )
          .join("")
      : `<div class="resource-empty">В чате пока нет сообщений. Можно задать первый вопрос.</div>`;
    messageBox.scrollTop = messageBox.scrollHeight;
  }

  modal.classList.remove("is-hidden");
}

async function openStreamChat(streamId) {
  if (!hasAuthenticatedAccount()) {
    openAccount();
    setAuthStatus("Войдите в аккаунт ученика, чтобы писать в чат трансляции.", "error");
    return;
  }

  activeStreamChatId = streamId;
  const modal = ensureStreamChatModal();
  modal.classList.remove("is-hidden");
  setStreamChatStatus("Загружаю чат...", "pending");

  try {
    const response = await apiFetch(`/api/streams/${encodeURIComponent(streamId)}/chat`, { cache: "no-store" });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload.message || payload.error || "Не удалось загрузить чат трансляции.");
    }

    renderStreamChat(payload);
    setStreamChatStatus("", "");
  } catch (error) {
    setStreamChatStatus(error.message || "Не удалось загрузить чат трансляции.", "error");
  }
}

function closeStreamChat() {
  activeStreamChatId = null;
  document.querySelector("#stream-chat-modal")?.classList.add("is-hidden");
}

async function submitStreamChatMessage(event) {
  event.preventDefault();

  if (!activeStreamChatId) {
    return;
  }

  const form = event.currentTarget;
  const payload = Object.fromEntries(new FormData(form).entries());
  const button = form.querySelector("button[type='submit']");

  if (!String(payload.messageText || "").trim()) {
    setStreamChatStatus("Введите сообщение.", "error");
    return;
  }

  if (button) {
    button.disabled = true;
  }

  try {
    const response = await apiFetch(`/api/streams/${encodeURIComponent(activeStreamChatId)}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || result.error || "Не удалось отправить сообщение.");
    }

    form.reset();
    await openStreamChat(activeStreamChatId);
  } catch (error) {
    setStreamChatStatus(error.message || "Не удалось отправить сообщение.", "error");
  } finally {
    if (button) {
      button.disabled = false;
    }
  }
}

async function loadStreams(courseKey = "") {
  let streams = [];

  try {
    streams = await loadStreamsFromApi(courseKey);
  } catch (error) {
    streams = getFallbackStreams(courseKey);
    console.info("Трансляции из базы не загружены, показано запасное расписание.", error);
  }

  streams = sortUpcomingEvents(streams);

  if (courseKey) {
    latestCourseStreams = streams;
    renderStreamCards(courseStreamList, streams);

    if (detailNextStream) {
      detailNextStream.textContent = streams[0] ? formatStreamDate(streams[0].startsAt) : "нет эфиров";
    }

    return streams;
  }

  streamsLoaded = true;
  latestGlobalStreams = streams;
  renderStreamCards(homeStreamList, streams, { limit: 3 });

  let studentCalls = [];

  try {
    studentCalls = sortUpcomingEvents(await loadStudentCallsFromApi());
  } catch (error) {
    studentCalls = [];
    console.info("Созвоны ученика не загружены.", error);
  }

  latestStudentCalls = studentCalls;
  renderStreamCards(studyStreamList, sortUpcomingEvents([...streams, ...studentCalls]), {
    limit: 4,
    emptyText: "Ближайших трансляций и созвонов пока нет.",
  });
  return streams;
}

function refreshVisibleStreamCards() {
  renderStreamCards(homeStreamList, latestGlobalStreams, { limit: 3 });
  renderStreamCards(studyStreamList, sortUpcomingEvents([...latestGlobalStreams, ...latestStudentCalls]), {
    limit: 4,
    emptyText: "Ближайших трансляций и созвонов пока нет.",
  });
  renderStreamCards(courseStreamList, latestCourseStreams);

  if (detailNextStream) {
    const streams = sortUpcomingEvents(latestCourseStreams);
    detailNextStream.textContent = streams[0] ? formatStreamDate(streams[0].startsAt) : "нет эфиров";
  }
}

function startStreamStatusRefresh() {
  window.setInterval(() => {
    if (document.hidden) {
      return;
    }

    refreshVisibleStreamCards();
    loadStreams();

    if (!document.querySelector('[data-page="course"]')?.classList.contains("is-hidden")) {
      loadStreams(currentCourseKey);
    }
  }, 60 * 1000);
}

function getFallbackLessons(courseKey) {
  return (fallbackLessons[courseKey] || fallbackLessons.math).map(normalizeLesson);
}

function getFallbackNotesLibrary() {
  return Object.entries(fallbackLessons).flatMap(([courseKey, lessons]) =>
    lessons
      .map(normalizeLesson)
      .filter((lesson) => lesson.notesUrl)
      .map((lesson) =>
        normalizeNote({
          noteId: `${courseKey}-${lesson.lessonNumber}`,
          courseSlug: courseKey,
          courseTitle: courseData[courseKey]?.title || "Курс",
          lessonNumber: lesson.lessonNumber,
          lessonTitle: lesson.lessonTitle,
          materialTitle: `Конспект: ${lesson.lessonTitle}`,
          materialType: "PDF",
          authorName: "Онлайн-школа",
          fileUrl: lesson.notesUrl,
        }),
      ),
  );
}

function isUsableContentUrl(url) {
  return Boolean(url) && !/^https?:\/\/example\.com\//i.test(String(url));
}

function createLessonSearchUrl(lesson, kind) {
  const query = `${courseData[currentCourseKey]?.title || "ЕГЭ"} ${lesson.lessonTitle || ""} ${kind}`.trim();
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

function getLessonVideoUrl(lesson) {
  if (isUsableContentUrl(lesson.videoUrl)) {
    return lesson.videoUrl;
  }

  const query = `${courseData[currentCourseKey]?.title || "ЕГЭ"} ${lesson.lessonTitle || ""} урок`.trim();
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

function getLessonNotesUrl(lesson) {
  if (isUsableContentUrl(lesson.notesUrl)) {
    return lesson.notesUrl;
  }

  return createLessonSearchUrl(lesson, "конспект");
}

function getLessonHomeworkTaskUrl(lesson) {
  if (isUsableContentUrl(lesson.homeworkTaskUrl)) {
    return lesson.homeworkTaskUrl;
  }

  if (isUsableContentUrl(lesson.homeworkUrl)) {
    return lesson.homeworkUrl;
  }

  return createLessonSearchUrl(lesson, "домашнее задание");
}

function formatDate(value) {
  if (!value) {
    return "Срок не указан";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getHomeworkStatusMeta(status) {
  if (status === "Checked") {
    return { label: "Проверено", className: "is-green" };
  }

  if (status === "Submitted") {
    return { label: "На проверке", className: "is-blue" };
  }

  return { label: "Не сдано", className: "is-yellow" };
}

function getLessonKey(lesson) {
  return String(lesson.lessonId ?? `${currentCourseKey}-${lesson.lessonNumber}`);
}

function hasHomework(lesson) {
  return Boolean(lesson?.homeworkAssignmentId || lesson?.homeworkTemplateId || lesson?.homeworkTitle || lesson?.homeworkTaskUrl || lesson?.homeworkUrl);
}

function isHomeworkSubmitted(lesson) {
  return Boolean(
    lesson?.submittedHomeworkUrl ||
      lesson?.homeworkStatus === "Submitted" ||
      lesson?.homeworkStatus === "Checked" ||
      lesson?.submissionStatus === "Submitted" ||
      lesson?.submissionStatus === "Checked",
  );
}

function getEffectiveHomeworkStatus(lesson) {
  if (lesson?.homeworkStatus === "Checked" || lesson?.submissionStatus === "Checked") {
    return "Checked";
  }

  if (isHomeworkSubmitted(lesson)) {
    return "Submitted";
  }

  return lesson?.homeworkStatus || "Assigned";
}

function getHomeworkScoreValue(lesson) {
  const rawScore = lesson?.homeworkScore ?? lesson?.score;

  if (rawScore === null || rawScore === undefined || rawScore === "") {
    return null;
  }

  const numericScore = Number(rawScore);

  if (!Number.isFinite(numericScore)) {
    return String(rawScore).trim() || null;
  }

  return Number.isInteger(numericScore) ? numericScore : Number(numericScore.toFixed(1));
}

function formatHomeworkScoreText(lesson) {
  const score = getHomeworkScoreValue(lesson);

  if (score === null) {
    return "";
  }

  return `${escapeHtml(score)} / 10 баллов`;
}

function getCheckedHomeworkScoreText(lesson) {
  if (getEffectiveHomeworkStatus(lesson) !== "Checked") {
    return "";
  }

  return formatHomeworkScoreText(lesson) || "Баллы не указаны";
}

function getHomeworkTeacherFeedback(lesson) {
  return lesson?.feedbackText || lesson?.teacherComment || "";
}

function renderHomeworkReviewResult(lesson) {
  if (getEffectiveHomeworkStatus(lesson) !== "Checked") {
    return "";
  }

  const scoreText = formatHomeworkScoreText(lesson) || "Оценка не указана";
  const feedbackText = getHomeworkTeacherFeedback(lesson) || "Комментарий преподавателя не оставлен.";

  return `
    <section class="homework-review-result" aria-label="Результат проверки домашнего задания">
      <div>
        <span>Оценка</span>
        <strong>${scoreText}</strong>
      </div>
      <p><strong>Комментарий преподавателя:</strong> ${escapeHtml(feedbackText)}</p>
    </section>
  `;
}

function getCorrectionStatusMeta(status, score = null) {
  if (status === "Checked") {
    const numericScore = Number(score);
    const isGoodScore = Number.isFinite(numericScore) && numericScore >= 5;
    return { label: "Исправление проверено", className: isGoodScore ? "is-green" : "is-yellow" };
  }

  if (status === "Submitted") {
    return { label: "Исправление на проверке", className: "is-blue" };
  }

  return { label: "Нужна работа над ошибками", className: "is-yellow" };
}

function getCorrectionScoreText(lesson) {
  const rawScore = lesson?.correctionScore;

  if (rawScore === null || rawScore === undefined || rawScore === "") {
    return "";
  }

  const numericScore = Number(rawScore);
  const score = Number.isFinite(numericScore) ? (Number.isInteger(numericScore) ? numericScore : Number(numericScore.toFixed(1))) : String(rawScore).trim();
  return `${escapeHtml(score)} / 10 баллов`;
}

function renderCorrectionResult(lesson) {
  if (lesson?.correctionStatus !== "Checked") {
    return "";
  }

  const scoreText = getCorrectionScoreText(lesson) || "Оценка не указана";
  const feedbackText = lesson.correctionFeedbackText || "Комментарий преподавателя не оставлен.";

  return `
    <section class="homework-review-result is-correction" aria-label="Результат работы над ошибками">
      <div>
        <span>Работа над ошибками</span>
        <strong>${scoreText}</strong>
      </div>
      <p><strong>Комментарий преподавателя:</strong> ${escapeHtml(feedbackText)}</p>
    </section>
  `;
}

function getHomeworkButtonMeta(lesson) {
  const effectiveStatus = getEffectiveHomeworkStatus(lesson);

  if (effectiveStatus === "Checked") {
    return {
      className: "button-green",
      icon: "#icon-clipboard",
      label: "Проверено",
      title: "Открыть проверенное ДЗ",
    };
  }

  if (effectiveStatus === "Submitted") {
    return {
      className: "button-blue",
      icon: "#icon-clipboard",
      label: "На проверке",
      title: "Открыть или заменить ссылку до проверки",
    };
  }

  return {
    className: "button-yellow",
    icon: "#icon-upload",
    label: "Сдать ДЗ",
    title: "Прикрепить ссылку на ДЗ из Google Drive",
  };
}

function applyLessonAccessRules(lessons, courseAccess = null) {
  const shouldLimitToPreview = courseAccess ? !courseAccess.isOwned : !hasAuthenticatedAccount();

  if (!shouldLimitToPreview) {
    return lessons;
  }

  const lockReason = hasAuthenticatedAccount() ? "purchase" : "login";

  return lessons.map((lesson, index) => ({
    ...lesson,
    isPreviewLesson: index === 0,
    isPreviewLocked: index > 0,
    previewLockReason: index > 0 ? lockReason : "",
    homeworkAccessLocked: true,
    homeworkAssignmentId: null,
    homeworkTemplateId: null,
    homeworkTitle: null,
    homeworkDescription: "",
    homeworkTaskUrl: null,
    homeworkUrl: null,
    homeworkStatus: "Assigned",
    homeworkSubmissionId: null,
    submittedHomeworkUrl: null,
    submissionStatus: null,
    feedbackUrl: null,
    feedbackText: null,
    homeworkScore: null,
    checkedAt: null,
    correctionId: null,
    correctionStatus: null,
    correctionSubmittedUrl: null,
    correctionSubmittedAt: null,
    correctionScore: null,
    correctionFeedbackText: null,
    correctionCheckedAt: null,
  }));
}

function renderLessonRow(lesson) {
  const meta = lesson.isPreviewLocked
    ? { label: "После входа", className: "status-soon", icon: "#icon-lock" }
    : statusMeta[lesson.lessonStatus] || statusMeta.Open;
  const isAnnouncementOnly = lesson.lessonStatus === "Announcement" && !lesson.videoUrl;
  const numberClass = lesson.lessonStatus === "Done" ? "is-done" : isAnnouncementOnly ? "is-muted" : "";
  const actionButtons = [];

  if (lesson.isPreviewLocked) {
    const lockedTitle =
      lesson.previewLockReason === "purchase" ? "Этот урок откроется после покупки курса" : "Зарегистрируйтесь, чтобы открыть урок";
    const lockedHomeworkLabel = lesson.previewLockReason === "purchase" ? "ДЗ после покупки" : "ДЗ после входа";

    actionButtons.push(`
      <button type="button" disabled title="${escapeHtml(lockedTitle)}">
        <svg><use href="#icon-lock" /></svg>Запись
      </button>
      <button type="button" disabled title="${escapeHtml(lockedTitle)}">
        <svg><use href="#icon-file" /></svg>Конспект
      </button>
      <button class="button-yellow" type="button" disabled title="${escapeHtml(lockedTitle)}">
        <svg><use href="#icon-upload" /></svg>${lockedHomeworkLabel}
      </button>
    `);
  } else {
  const videoUrl = getLessonVideoUrl(lesson);
  const notesUrl = getLessonNotesUrl(lesson);

  if (videoUrl) {
    actionButtons.push(`
      <button type="button" data-video-url="${escapeHtml(videoUrl)}">
        <svg><use href="#icon-play" /></svg>Запись
      </button>
    `);
  } else if (isAnnouncementOnly) {
    actionButtons.push(`
      <button type="button" disabled>
        <svg><use href="#icon-megaphone" /></svg>Анонс
      </button>
    `);
  } else {
    actionButtons.push(`
      <button type="button" disabled title="Запустите API с базой данных, чтобы получить ссылку на запись">
        <svg><use href="#icon-play" /></svg>Запись
      </button>
    `);
  }

  if (notesUrl) {
    const notesLabel = isAnnouncementOnly ? "Материалы" : "Конспект PDF";
    actionButtons.push(`
      <button type="button" data-material-url="${escapeHtml(notesUrl)}">
        <svg><use href="#icon-file" /></svg>${notesLabel}
      </button>
    `);
  }

  const homeworkButton = getHomeworkButtonMeta(lesson);
  const checkedScoreText = getCheckedHomeworkScoreText(lesson);

    if (lesson.homeworkAccessLocked) {
      const homeworkLabel = hasAuthenticatedAccount() ? "ДЗ после покупки" : "ДЗ после входа";
      const homeworkTitle = hasAuthenticatedAccount() ? "Домашнее задание откроется после покупки курса" : "Зарегистрируйтесь, чтобы сдавать ДЗ";
      actionButtons.push(`
        <button class="button-yellow" type="button" disabled title="${escapeHtml(homeworkTitle)}">
          <svg><use href="#icon-upload" /></svg>${homeworkLabel}
        </button>
      `);
    } else if (hasAuthenticatedAccount()) {
      actionButtons.push(`
        <button class="${homeworkButton.className}" type="button" data-homework-lesson-id="${escapeHtml(getLessonKey(lesson))}" title="${homeworkButton.title}">
          <svg><use href="${homeworkButton.icon}" /></svg>${homeworkButton.label}
        </button>
        ${checkedScoreText ? `<span class="lesson-score-chip">${checkedScoreText}</span>` : ""}
      `);
      if (lesson.correctionId) {
        const correctionMeta = getCorrectionStatusMeta(lesson.correctionStatus, lesson.correctionScore);
        const correctionButtonClass = correctionMeta.className === "is-green" ? "button-green" : correctionMeta.className === "is-blue" ? "button-blue" : "button-yellow";
        actionButtons.push(`
          <button class="${correctionButtonClass} correction-action" type="button" data-homework-lesson-id="${escapeHtml(getLessonKey(lesson))}" title="Открыть работу над ошибками">
            <svg><use href="#icon-clipboard" /></svg>${correctionMeta.label}
          </button>
        `);
      }
    } else {
      actionButtons.push(`
        <button class="button-yellow" type="button" disabled title="Зарегистрируйтесь, чтобы сдавать ДЗ">
          <svg><use href="#icon-upload" /></svg>ДЗ после входа
        </button>
      `);
    }
  }

  const shortActionsClass = actionButtons.length <= 2 ? " lesson-actions--short" : "";

  return `
    <article class="lesson-row">
      <span class="lesson-number ${numberClass}">${escapeHtml(lesson.lessonNumber)}</span>
      <div class="lesson-copy">
        <h3>Урок ${escapeHtml(lesson.lessonNumber)}. ${escapeHtml(lesson.lessonTitle)}</h3>
        <p>Тема: ${escapeHtml(lesson.topic)}</p>
      </div>
      <span class="lesson-status ${meta.className}">
        <svg><use href="${meta.icon}" /></svg>${meta.label}
      </span>
      <div class="lesson-actions${shortActionsClass}">
        ${actionButtons.join("")}
      </div>
    </article>
  `;
}

function renderLessons(lessons) {
  lessonList.innerHTML = lessons.map(renderLessonRow).join("");
}

function renderHomeworks(lessons) {
  const homeworks = lessons.filter(hasHomework);

  if (homeworks.length === 0) {
    homeworkList.innerHTML = `<div class="resource-empty">Домашки для этого курса пока не добавлены.</div>`;
    return;
  }

  homeworkList.innerHTML = homeworks
    .map((lesson) => {
      const meta = getHomeworkStatusMeta(getEffectiveHomeworkStatus(lesson));
      const homeworkButton = getHomeworkButtonMeta(lesson);
      const checkedScoreText = getCheckedHomeworkScoreText(lesson);
      const correctionMeta = lesson.correctionId ? getCorrectionStatusMeta(lesson.correctionStatus, lesson.correctionScore) : null;
      const scoreText =
        checkedScoreText
          ? checkedScoreText
          : isHomeworkSubmitted(lesson)
            ? "На проверке"
            : "Ожидает ссылку";
      const scoreClass = getEffectiveHomeworkStatus(lesson) === "Submitted" ? "is-blue" : isHomeworkSubmitted(lesson) ? "is-green" : "is-yellow";

      return `
        <article class="resource-card">
          <div>
            <div class="resource-card__meta">
              <span class="resource-chip">Урок ${escapeHtml(lesson.lessonNumber)}</span>
              <span class="resource-chip ${meta.className}">${meta.label}</span>
              ${correctionMeta ? `<span class="resource-chip ${correctionMeta.className}">${correctionMeta.label}</span>` : ""}
              <span class="resource-chip">до ${escapeHtml(formatDate(lesson.homeworkDueAt))}</span>
            </div>
            <h3>${escapeHtml(getHomeworkDisplayTitle(lesson, `ДЗ: ${lesson.lessonTitle}`))}</h3>
            <p>${escapeHtml(getHomeworkDisplayDescription(lesson))}</p>
          </div>
          <div class="resource-card__actions">
            <button class="${homeworkButton.className}" type="button" data-homework-lesson-id="${escapeHtml(getLessonKey(lesson))}" title="${homeworkButton.title}">
              <svg><use href="${homeworkButton.icon}" /></svg>${homeworkButton.label}
            </button>
            <span class="resource-chip ${scoreClass}">${scoreText}</span>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderCourseNotes(lessons) {
  const notes = lessons.filter((lesson) => lesson.notesUrl && !lesson.isPreviewLocked);

  if (notes.length === 0) {
    notesList.innerHTML = `<div class="resource-empty">Конспекты для этого курса пока не добавлены.</div>`;
    return;
  }

  notesList.innerHTML = notes
    .map((lesson) => `
      <article class="resource-card">
        <div>
          <div class="resource-card__meta">
            <span class="resource-chip">Урок ${escapeHtml(lesson.lessonNumber)}</span>
            <span class="resource-chip is-blue">${escapeHtml(courseData[currentCourseKey]?.title || "Курс")}</span>
          </div>
          <h3>Конспект: ${escapeHtml(lesson.lessonTitle)}</h3>
          <p>${escapeHtml(lesson.topic || "")}</p>
        </div>
        <div class="resource-card__actions">
          <a href="${escapeHtml(lesson.notesUrl)}" target="_blank" rel="noopener noreferrer">
            <svg><use href="#icon-file" /></svg>Открыть PDF
          </a>
        </div>
      </article>
    `)
    .join("");
}

function renderCourseData(lessons, courseAccess = null) {
  if (courseAccess) {
    currentCourseAccess = courseAccess;
    updateCourseCuratorPanel(courseAccess);
  }

  const visibleLessons = applyLessonAccessRules(lessons, courseAccess);
  currentLessons = visibleLessons;
  renderLessons(visibleLessons);
  renderHomeworks(visibleLessons);
  renderCourseNotes(visibleLessons);
}

function setCourseView(viewName) {
  currentCourseView = viewName;

  courseViewButtons.forEach((button) => {
    const isActive = button.dataset.courseView === viewName;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  coursePanels.forEach((panel) => {
    panel.classList.toggle("is-hidden", panel.dataset.coursePanel !== viewName);
  });
}

function findLessonByKey(lessonKey) {
  return currentLessons.find((lesson) => getLessonKey(lesson) === String(lessonKey));
}

function createActionLink(url, className, icon, label) {
  if (!url) {
    return `
      <button class="${className}" type="button" disabled>
        <svg><use href="${icon}" /></svg>${label}
      </button>
    `;
  }

  return `
    <a class="${className}" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">
      <svg><use href="${icon}" /></svg>${label}
    </a>
  `;
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.info("Clipboard API недоступен, пробую запасной способ.", error);
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.append(textarea);
  textarea.select();

  try {
    const copied = document.execCommand("copy");

    if (!copied) {
      throw new Error("Copy command returned false.");
    }

    return true;
  } finally {
    textarea.remove();
  }
}

function setHomeworkSubmitStatus(message, type = "") {
  const status = document.querySelector("#homework-upload-status");

  if (!status) {
    return;
  }

  status.textContent = message;
  status.className = `homework-upload-status${type ? ` is-${type}` : ""}`;
}

function setCorrectionSubmitStatus(message, type = "") {
  const status = document.querySelector("#correction-upload-status");

  if (!status) {
    return;
  }

  status.textContent = message;
  status.className = `homework-upload-status${type ? ` is-${type}` : ""}`;
}

function normalizeHomeworkLink(value) {
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

function isGoogleHomeworkUrl(value) {
  try {
    const url = new URL(normalizeHomeworkLink(value));
    const host = url.hostname.toLowerCase();

    return url.protocol === "https:" && (host === "google.com" || host.endsWith(".google.com"));
  } catch (error) {
    return false;
  }
}

async function submitHomeworkLink(lessonKey, form) {
  const lesson = findLessonByKey(lessonKey);
  const input = form?.querySelector("#homework-link-input");
  const submitButton = form?.querySelector("button[type='submit']");
  const homeworkLink = normalizeHomeworkLink(input?.value || "");

  if (!hasAuthenticatedAccount()) {
    setHomeworkSubmitStatus("Войдите или создайте аккаунт, чтобы сдавать ДЗ.", "error");
    return;
  }

  if (input) {
    input.value = homeworkLink;
  }

  if (!lesson?.homeworkAssignmentId) {
    setHomeworkSubmitStatus("Это ДЗ еще не связано с заданием ученика в базе.", "error");
    return;
  }

  if (getEffectiveHomeworkStatus(lesson) === "Checked") {
    setHomeworkSubmitStatus("Проверенное ДЗ нельзя заменить с сайта.", "error");
    return;
  }

  if (!isGoogleHomeworkUrl(homeworkLink)) {
    setHomeworkSubmitStatus("Вставьте ссылку на файл или документ в Google Drive.", "error");
    input?.focus();
    return;
  }

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.innerHTML = `<svg><use href="#icon-clock" /></svg>Сохраняю...`;
  }

  setHomeworkSubmitStatus("Сохраняю ссылку в базе...", "pending");

  try {
    const response = await apiFetch(`/api/homeworks/${encodeURIComponent(lesson.homeworkAssignmentId)}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ homeworkLink }),
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || result.error || "Не удалось сохранить ссылку на ДЗ");
    }

    lesson.homeworkStatus = result.homeworkStatus || "Submitted";
    lesson.homeworkSubmissionId = result.homeworkSubmissionId ?? lesson.homeworkSubmissionId;
    lesson.submittedHomeworkUrl = result.submittedHomeworkUrl || homeworkLink;
    lesson.submissionStatus = result.submissionStatus || "Submitted";
    lesson.feedbackUrl = null;
    lesson.feedbackText = null;
    lesson.teacherComment = null;
    lesson.homeworkScore = null;
    lesson.checkedAt = null;

    renderCourseData(currentLessons);
    setCourseView(currentCourseView);
    await loadAccount({ silent: true });
    openHomeworkModal(getLessonKey(lesson));
    setHomeworkSubmitStatus("Ссылка сохранена. ДЗ отправлено на проверку.", "success");
  } catch (error) {
    setHomeworkSubmitStatus(error.message || "Ссылка не сохранена. Проверьте сервер.", "error");

    if (submitButton) {
      submitButton.disabled = false;
      submitButton.innerHTML = `<svg><use href="#icon-upload" /></svg>Сохранить ссылку`;
    }
  }
}

async function submitCorrectionLink(lessonKey, form) {
  const input = form?.querySelector("#correction-link-input");
  const lesson = findLessonByKey(lessonKey);
  const correctionLink = normalizeHomeworkLink(input?.value || "");

  if (!hasAuthenticatedAccount()) {
    setCorrectionSubmitStatus("Войдите или создайте аккаунт, чтобы сдавать работу над ошибками.", "error");
    return;
  }

  if (input) {
    input.value = correctionLink;
  }

  if (!lesson?.homeworkAssignmentId || !lesson?.correctionId) {
    setCorrectionSubmitStatus("Работа над ошибками для этого ДЗ еще не назначена.", "error");
    return;
  }

  if (lesson.correctionStatus === "Checked") {
    setCorrectionSubmitStatus("Проверенную работу над ошибками нельзя заменить с сайта.", "error");
    return;
  }

  if (!isGoogleHomeworkUrl(correctionLink)) {
    setCorrectionSubmitStatus("Вставьте ссылку на файл или документ в Google Drive.", "error");
    input?.focus();
    return;
  }

  const submitButton = form?.querySelector("button[type='submit']");
  if (submitButton) {
    submitButton.disabled = true;
  }

  setCorrectionSubmitStatus("Сохраняю работу над ошибками в базе...", "pending");

  try {
    const response = await apiFetch(`/api/homeworks/${encodeURIComponent(lesson.homeworkAssignmentId)}/correction/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ correctionLink }),
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || result.error || "Не удалось сохранить работу над ошибками");
    }

    lesson.correctionStatus = result.correctionStatus || "Submitted";
    lesson.correctionSubmittedUrl = result.correctionSubmittedUrl || correctionLink;
    lesson.correctionSubmittedAt = result.correctionSubmittedAt || new Date().toISOString();
    lesson.correctionScore = null;
    lesson.correctionFeedbackText = null;
    lesson.correctionCheckedAt = null;

    renderCourseData(currentLessons);
    await loadAccount({ silent: true });
    openHomeworkModal(getLessonKey(lesson));
    setCorrectionSubmitStatus("Работа над ошибками отправлена на проверку.", "success");
  } catch (error) {
    setCorrectionSubmitStatus(error.message || "Ссылка не сохранена. Проверьте сервер.", "error");
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
    }
  }
}

function openHomeworkModal(lessonKey) {
  const lesson = findLessonByKey(lessonKey);

  if (!lesson || !homeworkModal) {
    return;
  }

  const effectiveStatus = getEffectiveHomeworkStatus(lesson);
  const meta = getHomeworkStatusMeta(effectiveStatus);
  const isChecked = effectiveStatus === "Checked";
  const currentLink = lesson.submittedHomeworkUrl || "";
  const checkedScoreText = getCheckedHomeworkScoreText(lesson);
  const correctionMeta = lesson.correctionId ? getCorrectionStatusMeta(lesson.correctionStatus, lesson.correctionScore) : null;
  const correctionLink = lesson.correctionSubmittedUrl || "";
  const isCorrectionChecked = lesson.correctionStatus === "Checked";
  const correctionStatusText = !lesson.correctionId
    ? ""
    : isCorrectionChecked
      ? "Работа над ошибками уже проверена. Ссылку можно открыть, но заменить её нельзя."
      : correctionLink
        ? "Работа над ошибками отправлена на проверку. Можно заменить ссылку до проверки."
        : "После оценки ниже 5 нужно прикрепить работу над ошибками ссылкой на Google Drive.";
  const statusText = !lesson.homeworkAssignmentId
    ? "Это ДЗ найдено в курсе, но ещё не назначено ученику в базе."
    : isChecked
      ? "Работа уже проверена. Ссылку можно открыть, но заменить её нельзя."
      : currentLink
        ? "Работа отправлена на проверку. Можно заменить ссылку до проверки."
        : "Вставьте ссылку на файл или документ в Google Drive.";

  homeworkModalStatus.textContent = meta.label;
  homeworkModalStatus.className = `homework-modal__eyebrow ${meta.className}`;
  homeworkModalTitle.textContent = getHomeworkDisplayTitle(lesson, `ДЗ: ${lesson.lessonTitle}`);
  homeworkModalDescription.textContent = getHomeworkDisplayDescription(lesson);
  homeworkModalMeta.innerHTML = `
    <span class="resource-chip">Урок ${escapeHtml(lesson.lessonNumber)}</span>
    <span class="resource-chip ${meta.className}">${meta.label}</span>
    ${checkedScoreText ? `<span class="resource-chip is-green">${checkedScoreText}</span>` : ""}
    ${correctionMeta ? `<span class="resource-chip ${correctionMeta.className}">${correctionMeta.label}</span>` : ""}
    <span class="resource-chip">до ${escapeHtml(formatDate(lesson.homeworkDueAt))}</span>
  `;

  homeworkModalActions.innerHTML = `
    ${renderHomeworkReviewResult(lesson)}
    ${
      lesson.correctionId
        ? `
          <section class="homework-correction-panel">
            <header>
              <span class="resource-chip ${correctionMeta.className}">${correctionMeta.label}</span>
              ${getCorrectionScoreText(lesson) ? `<span class="resource-chip is-green">${getCorrectionScoreText(lesson)}</span>` : ""}
            </header>
            <h3>Работа над ошибками</h3>
            <p>Это дополнительная работа по этому же уроку. Она появляется, если оценка за основное ДЗ ниже 5.</p>
            ${renderCorrectionResult(lesson)}
            <div class="staff-card__actions">
              ${correctionLink ? createActionLink(correctionLink, isCorrectionChecked ? "button-green" : "button-blue", "#icon-clipboard", isCorrectionChecked ? "Открыть проверенную работу" : "Открыть работу на проверке") : ""}
              ${correctionLink ? `<button class="button-yellow" type="button" data-copy-homework-link="${escapeHtml(correctionLink)}"><svg><use href="#icon-clipboard" /></svg>Скопировать ссылку</button>` : ""}
            </div>
            <form class="homework-link-form" data-correction-submit-form="${escapeHtml(getLessonKey(lesson))}">
              <label class="homework-link-field" for="correction-link-input">
                <span>Ссылка на работу над ошибками в Google Drive</span>
                <input
                  id="correction-link-input"
                  name="correctionLink"
                  type="text"
                  inputmode="url"
                  autocomplete="url"
                  placeholder="https://drive.google.com/..."
                  value="${escapeHtml(correctionLink)}"
                  ${isCorrectionChecked ? "disabled" : ""}
                  required
                />
              </label>
              <button class="button-blue" type="submit" ${isCorrectionChecked ? "disabled" : ""}>
                <svg><use href="#icon-upload" /></svg>Сохранить работу над ошибками
              </button>
              <p id="correction-upload-status" class="homework-upload-status">${correctionStatusText}</p>
            </form>
          </section>
        `
        : ""
    }
    ${createActionLink(getLessonHomeworkTaskUrl(lesson), "", "#icon-file", "Открыть задание")}
    ${currentLink ? createActionLink(currentLink, isChecked ? "button-green" : "button-blue", "#icon-clipboard", isChecked ? "Открыть проверенное ДЗ" : "Открыть ДЗ на проверке") : ""}
    ${currentLink ? `<button class="button-yellow" type="button" data-copy-homework-link="${escapeHtml(currentLink)}"><svg><use href="#icon-clipboard" /></svg>Скопировать ссылку</button>` : ""}
    <form class="homework-link-form" data-homework-submit-form="${escapeHtml(getLessonKey(lesson))}">
      <label class="homework-link-field" for="homework-link-input">
        <span>Ссылка на ДЗ в Google Drive</span>
        <input
          id="homework-link-input"
          name="homeworkLink"
          type="text"
          inputmode="url"
          autocomplete="url"
          placeholder="https://drive.google.com/..."
          value="${escapeHtml(currentLink)}"
          ${!lesson.homeworkAssignmentId || isChecked ? "disabled" : ""}
          required
        />
      </label>
      <button class="button-blue" type="submit" ${!lesson.homeworkAssignmentId || isChecked ? "disabled" : ""}>
        <svg><use href="#icon-upload" /></svg>Сохранить ссылку
      </button>
      <p id="homework-upload-status" class="homework-upload-status">${statusText}</p>
    </form>
  `;

  homeworkModal.classList.remove("is-hidden");
  homeworkModal.setAttribute("aria-hidden", "false");
  document.querySelector("#homework-link-input:not(:disabled)")?.focus();
}

function closeHomeworkModal() {
  if (!homeworkModal) {
    return;
  }

  homeworkModal.classList.add("is-hidden");
  homeworkModal.setAttribute("aria-hidden", "true");
}

async function loadNotesLibrary() {
  const accessKey = getNotesLibraryAccessKey();

  if (libraryLoaded && libraryAccessKey === accessKey) {
    return;
  }

  if (!libraryNotesList) {
    return;
  }

  libraryNotesList.innerHTML = `<div class="resource-empty">Загружаю конспекты...</div>`;

  let notes = [];

  try {
    notes = filterNotesForCurrentAccess(await loadNotesFromApi());
  } catch (error) {
    notes = filterNotesForCurrentAccess(getFallbackNotesLibrary());
    console.info("Конспекты из базы не загружены, показан локальный список.", error);
  }

  libraryLoaded = true;
  libraryAccessKey = accessKey;

  if (libraryCount) {
    libraryCount.textContent = `${notes.length} файлов`;
  }

  if (notes.length === 0) {
    libraryNotesList.innerHTML = `<div class="resource-empty">В библиотеке пока нет конспектов.</div>`;
    return;
  }

  libraryNotesList.innerHTML = notes
    .map((note) => `
      <article class="resource-card">
        <div>
          <div class="resource-card__meta">
            <span class="resource-chip is-blue">${escapeHtml(note.courseTitle)}</span>
            <span class="resource-chip">Урок ${escapeHtml(note.lessonNumber || "-")}</span>
            <span class="resource-chip">${escapeHtml(note.materialType)}</span>
          </div>
          <h3>${escapeHtml(note.materialTitle)}</h3>
          <p>${escapeHtml(note.lessonTitle ? `К уроку: ${note.lessonTitle}` : note.authorName)}</p>
        </div>
        <div class="resource-card__actions">
          <a href="${escapeHtml(note.fileUrl)}" target="_blank" rel="noopener noreferrer">
            <svg><use href="#icon-file" /></svg>Открыть PDF
          </a>
        </div>
      </article>
    `)
    .join("");
}

function openStudy(tabName = "owned") {
  showPage("study");
  setActiveStudyNav();
  setStudyTab(tabName);
  history.replaceState(null, "", "#study");
  loadStreams();
}

function findCourseCard(courseKey) {
  return Array.from(studyCourseCards).find((card) => card.dataset.course === courseKey) || null;
}

function isCourseOwned(courseKey) {
  if (!hasAuthenticatedAccount()) {
    return true;
  }

  const accountCourse = getAccountCourse(courseKey);

  if (accountCourse) {
    return accountCourse.isOwned;
  }

  const card = findCourseCard(courseKey);
  return Boolean(card && card.dataset.owned === "true" && card.dataset.catalog !== "true");
}

function showLockedCourseNotice(courseKey) {
  const card = findCourseCard(courseKey);

  openStudy("all");

  if (card) {
    card.classList.add("course-card--attention");
    card.scrollIntoView({ block: "center", behavior: "smooth" });
    window.setTimeout(() => card.classList.remove("course-card--attention"), 1200);
  }
}

async function openCourse(courseKey, viewName = "lessons") {
  currentCourseKey = courseKey;
  currentCourseView = viewName;
  const course = courseData[courseKey] || courseData.math;
  const fallbackLessonCount = getFallbackLessonCount(courseKey);
  const isGuest = !hasAuthenticatedAccount();
  const accountCourse = getAccountCourse(courseKey);
  const hasFullCourseAccess = Boolean(accountCourse?.isOwned);
  const isPreviewAccess = !hasFullCourseAccess;
  currentCourseAccess = accountCourse || null;

  detailTitle.textContent = course.title;
  detailDescription.textContent = course.description;
  detailLessons.textContent = isPreviewAccess ? `1 из ${fallbackLessonCount} ${getLessonGenitiveWord(fallbackLessonCount)} открыт` : course.lessonsText;
  detailProgressText.textContent = isPreviewAccess
    ? isGuest
      ? "Остальные уроки откроются после регистрации"
      : "Остальные уроки откроются после покупки курса"
    : course.progressText;
  breadcrumbCourse.textContent = course.breadcrumb;

  detailIcon.className = `course-illustration course-hero__icon ${course.iconClass}`;
  detailIcon.querySelector("use").setAttribute("href", course.iconSymbol);
  updateCourseCuratorPanel(accountCourse || { curatorName: "Загружаю куратора..." });
  const guestPercent = fallbackLessonCount > 0 ? Math.round(100 / fallbackLessonCount) : 0;
  donut.style.setProperty("--value", String(isPreviewAccess ? guestPercent : course.donut));
  donut.querySelector("span").textContent = isPreviewAccess ? `${guestPercent}%` : `${course.donut}%`;

  renderCourseData(getFallbackLessons(courseKey), { ...(accountCourse || {}), isOwned: hasFullCourseAccess });
  renderStreamCards(courseStreamList, getFallbackStreams(courseKey));
  showPage("course");
  setActiveStudyNav();
  setCourseView(viewName);
  applyCourseDetailProgress(courseKey, getAccountCourse(courseKey));
  loadStreams(courseKey);
  history.replaceState(null, "", `#course-${courseKey}`);

  try {
    const result = await loadLessonsFromApi(courseKey);
    if (currentCourseKey === courseKey && result.lessons.length > 0) {
      renderCourseData(result.lessons, result.course);
      if (!hasAuthenticatedAccount() || result.course?.isOwned === false) {
        const lessonCount = result.course?.lessonsTotal || result.lessons.length;
        const previewPercent = lessonCount > 0 ? Math.round(100 / lessonCount) : 0;
        detailLessons.textContent = `1 из ${lessonCount} ${getLessonGenitiveWord(lessonCount)} открыт`;
        detailProgressText.textContent = hasAuthenticatedAccount()
          ? "Остальные уроки и ДЗ откроются после покупки курса"
          : "Зарегистрируйтесь, чтобы открыть остальные уроки и сдавать ДЗ";
        donut.style.setProperty("--value", String(previewPercent));
        donut.querySelector("span").textContent = `${previewPercent}%`;
      } else if (result.course?.isOwned) {
        applyCourseDetailProgress(
          courseKey,
          normalizeAccountCourse({
            ...result.course,
            courseSlug: courseKey,
            courseTitle: course.title,
            isOwned: result.course.isOwned,
            pointsEarned: getAccountCourse(courseKey)?.pointsEarned || 0,
          }),
        );
      }
      setCourseView(currentCourseView);
    }
  } catch (error) {
    console.info("Уроки показаны из локального демо-набора. Проверьте работу API-сервера и базы данных.", error);
  }
}

async function submitApplication(event) {
  event.preventDefault();

  if (!applicationForm) {
    return;
  }

  const submitButton = applicationForm.querySelector("button[type='submit']");
  const formData = new FormData(applicationForm);
  const payload = Object.fromEntries(formData.entries());

  payload.sourcePage = "Главная";

  if (submitButton) {
    submitButton.disabled = true;
  }

  setApplicationStatus("Сохраняю заявку в базу...", "pending");

  try {
    const response = await apiFetch("/api/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || result.error || "Не удалось сохранить заявку");
    }

    applicationForm.reset();
    setApplicationStatus(`Заявка №${result.applicationId} сохранена в базе.`, "success");
  } catch (error) {
    setApplicationStatus(error.message || "Заявка не отправлена. Проверьте работу API-сервера.", "error");
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
    }
  }
}

async function submitSupportRequest(event) {
  event.preventDefault();

  if (!supportForm) {
    return;
  }

  const submitButton = supportForm.querySelector("button[type='submit']");
  const payload = Object.fromEntries(new FormData(supportForm).entries());

  if (!String(payload.message || "").trim()) {
    setSupportStatus("Опишите вопрос, чтобы мы могли помочь.", "error");
    supportForm.querySelector("[name='message']")?.focus();
    return;
  }

  if (submitButton) {
    submitButton.disabled = true;
  }

  setSupportStatus("Отправляю обращение в поддержку...", "pending");

  try {
    const response = await apiFetch("/api/support", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || result.error || "Не удалось отправить обращение");
    }

    supportForm.reset();
    setSupportStatus(`Обращение №${result.supportId || result.supportRequestId} отправлено.`, "success");
  } catch (error) {
    setSupportStatus(error.message || "Обращение не отправлено. Проверьте сервер.", "error");
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
    }
  }
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setStudyTab(tab.dataset.tab || "owned");
  });
});

setAccountTab(currentAccountTab);

openStudyControls.forEach((control) => {
  control.addEventListener("click", (event) => {
    event.preventDefault();
    openStudy(control.dataset.studyTab || "owned");
  });
});

openLibraryControls.forEach((control) => {
  control.addEventListener("click", (event) => {
    event.preventDefault();
    openLibrary();
  });
});

openSupportControls.forEach((control) => {
  control.addEventListener("click", (event) => {
    event.preventDefault();
    openSupport();
  });
});

openMessagesControls.forEach((control) => {
  control.addEventListener("click", (event) => {
    event.preventDefault();
    openMessages();
  });
});

if (detailCuratorButton) {
  detailCuratorButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    startCurrentCourseCuratorChat();
  });
}

openAccountControls.forEach((control) => {
  control.addEventListener("click", (event) => {
    event.preventDefault();
    openAccount();
  });
});

openPointsControls.forEach((control) => {
  control.addEventListener("click", (event) => {
    event.preventDefault();
    openPoints();
  });
});

openHomeControls.forEach((control) => {
  control.addEventListener("click", (event) => {
    event.preventDefault();
    openHome();
  });
});

sideLinks.forEach((link) => {
  if (!link.dataset.openStudy && !link.dataset.openHome && !link.dataset.openMessages && !link.dataset.openLibrary && !link.dataset.openSupport && !link.dataset.openAccount && !link.dataset.openPoints) {
    link.addEventListener("click", () => {
      sideLinks.forEach((item) => item.classList.remove("is-active"));
      link.classList.add("is-active");
    });
  }
});

courseCards.forEach((card) => {
  const courseKey = card.dataset.course;

  card.addEventListener("click", (event) => {
    if (event.target.closest(".course-actions")) {
      return;
    }

    openCourse(courseKey);
  });

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openCourse(courseKey);
    }
  });
});

courseActionButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    const card = button.closest("[data-course]");
    const courseKey = card?.dataset.course;
    const viewName = button.dataset.courseAction || "lessons";

    if (courseKey) {
      openCourse(courseKey, viewName);
    }
  });
});

courseViewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setCourseView(button.dataset.courseView || "lessons");
  });
});

document.querySelectorAll(".course-actions button, .event-card, .curator-panel button").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
  });
});

lessonList.addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (!button || button.disabled) {
    return;
  }

  if (button.dataset.homeworkLessonId) {
    openHomeworkModal(button.dataset.homeworkLessonId);
    return;
  }

  const targetUrl = button.dataset.videoUrl || button.dataset.materialUrl || button.dataset.homeworkUrl;

  if (targetUrl) {
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  }
});

homeworkList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-homework-lesson-id]");

  if (button && !button.disabled) {
    openHomeworkModal(button.dataset.homeworkLessonId);
  }
});

closeHomeworkButtons.forEach((button) => {
  button.addEventListener("click", closeHomeworkModal);
});

if (homeworkModal) {
  homeworkModal.addEventListener("click", (event) => {
    const copyButton = event.target.closest("[data-copy-homework-link]");

    if (copyButton) {
      copyTextToClipboard(copyButton.dataset.copyHomeworkLink || "")
        .then(() => {
          setHomeworkSubmitStatus("Ссылка скопирована.", "success");
        })
        .catch(() => {
          setHomeworkSubmitStatus("Не удалось скопировать автоматически. Выделите ссылку в поле и скопируйте вручную.", "error");
        });
      return;
    }

    if (event.target === homeworkModal) {
      closeHomeworkModal();
    }
  });

  homeworkModal.addEventListener("submit", (event) => {
    const correctionForm = event.target.closest("[data-correction-submit-form]");

    if (correctionForm) {
      event.preventDefault();
      submitCorrectionLink(correctionForm.dataset.correctionSubmitForm, correctionForm);
      return;
    }

    const form = event.target.closest("[data-homework-submit-form]");

    if (!form) {
      return;
    }

    event.preventDefault();
    submitHomeworkLink(form.dataset.homeworkSubmitForm, form);
  });
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeHomeworkModal();
  }
});

if (applicationForm) {
  applicationForm.addEventListener("submit", submitApplication);
}

if (supportForm) {
  supportForm.addEventListener("submit", submitSupportRequest);
}

accountTabs.forEach((button) => {
  button.addEventListener("click", () => {
    setAccountTab(button.dataset.accountTab || "progress");
  });
});

if (shopItemsList) {
  shopItemsList.addEventListener("click", (event) => {
    const sectionButton = event.target.closest("[data-shop-section]");
    const buyButton = event.target.closest("[data-shop-buy]");
    const equipButton = event.target.closest("[data-shop-equip]");
    const unequipButton = event.target.closest("[data-shop-unequip]");
    const badgeBuyButton = event.target.closest("[data-badge-buy]");
    const badgeEquipButton = event.target.closest("[data-badge-equip]");
    const badgeUnequipButton = event.target.closest("[data-badge-unequip]");

    if (sectionButton) {
      currentShopSection = sectionButton.dataset.shopSection || "all";
      if (latestShop) {
        renderShop(latestShop);
      }
      return;
    }

    if (buyButton && !buyButton.disabled) {
      sendShopAction("/api/shop/purchase", buyButton.dataset.shopBuy);
      return;
    }

    if (equipButton && !equipButton.disabled) {
      sendShopAction("/api/shop/equip", equipButton.dataset.shopEquip);
      return;
    }

    if (unequipButton && !unequipButton.disabled) {
      sendShopAction("/api/shop/equip", unequipButton.dataset.shopUnequip, { unequip: true });
      return;
    }

    if (badgeBuyButton && !badgeBuyButton.disabled) {
      sendBadgeAction("/api/badges/purchase", badgeBuyButton.dataset.badgeBuy);
      return;
    }

    if (badgeEquipButton && !badgeEquipButton.disabled) {
      sendBadgeAction("/api/badges/equip", badgeEquipButton.dataset.badgeEquip);
      return;
    }

    if (badgeUnequipButton && !badgeUnequipButton.disabled) {
      sendBadgeAction("/api/badges/equip", badgeUnequipButton.dataset.badgeUnequip, { unequip: true });
    }
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    submitAuthForm(event, "/api/auth/login", "Проверяю логин и пароль...", "Вход выполнен.");
  });
}

if (registerForm) {
  registerForm.addEventListener("submit", (event) => {
    submitAuthForm(event, "/api/auth/register", "Создаю аккаунт и курсы...", "Аккаунт создан. Курсы и ДЗ назначены.");
  });
}

if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    clearStoredAccount();
    latestAccount = null;
    applyGuestUi();
    renderCourseData(currentLessons);
    renderShopEmpty("Войдите в аккаунт, чтобы покупать одежду для капибары.");
    setAuthStatus("Вы вышли из аккаунта. Личные данные скрыты.", "success");
    loadMessages();
  });
}

if (staffLoginForm) {
  staffLoginForm.addEventListener("submit", submitStaffLogin);
}

if (staffLogoutButton) {
  staffLogoutButton.addEventListener("click", () => {
    clearStoredStaff();
    updateStaffSessionUi(null);
    setStaffAuthStatus("Вы вышли из командного входа.", "success");
    exitStaffMode();
    loadMessages();
  });
}

if (notificationButton) {
  notificationButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    notificationPanelOpen = !notificationPanelOpen;

    if (notificationPanelOpen) {
      markNotificationsSeen(latestNotificationItems);
    }

    renderGlobalNotifications();
  });
}

document.addEventListener("click", (event) => {
  if (notificationPanelOpen && !event.target.closest("#notification-panel") && !event.target.closest(".notification-button")) {
    notificationPanelOpen = false;
    renderGlobalNotifications();
  }

  const streamChatButton = event.target.closest("[data-open-stream-chat]");

  if (streamChatButton) {
    event.preventDefault();
    openStreamChat(streamChatButton.dataset.openStreamChat);
    return;
  }

  const staffShopBuyButton = event.target.closest("[data-staff-shop-buy]");
  const staffShopSectionButton = event.target.closest("[data-staff-shop-section]");

  if (staffShopSectionButton) {
    event.preventDefault();
    currentStaffShopSection = staffShopSectionButton.dataset.staffShopSection || "all";
    renderStaffPage(currentStaffPage);
    return;
  }

  if (staffShopBuyButton && !staffShopBuyButton.disabled) {
    event.preventDefault();
    sendStaffShopAction("/api/staff/shop/purchase", staffShopBuyButton.dataset.staffShopBuy);
    return;
  }

  const staffShopEquipButton = event.target.closest("[data-staff-shop-equip]");

  if (staffShopEquipButton && !staffShopEquipButton.disabled) {
    event.preventDefault();
    sendStaffShopAction("/api/staff/shop/equip", staffShopEquipButton.dataset.staffShopEquip);
    return;
  }

  const staffShopUnequipButton = event.target.closest("[data-staff-shop-unequip]");

  if (staffShopUnequipButton && !staffShopUnequipButton.disabled) {
    event.preventDefault();
    sendStaffShopAction("/api/staff/shop/equip", staffShopUnequipButton.dataset.staffShopUnequip, { unequip: true });
    return;
  }

  const staffPageButton = event.target.closest("[data-staff-page]");

  if (staffPageButton) {
    event.preventDefault();
    openStaffPage(staffPageButton.dataset.staffPage || "messages");
    return;
  }

  const refreshButton = event.target.closest("[data-staff-refresh]");

  if (refreshButton) {
    event.preventDefault();
    loadStaffWorkspace();
    if (currentStaffPage === "messages") {
      loadMessages(currentConversationId);
    }
    return;
  }

  const homeworkModeButton = event.target.closest("[data-staff-homework-mode]");

  if (homeworkModeButton) {
    event.preventDefault();
    resetStaffDrilldown("homework", {
      mode: homeworkModeButton.dataset.staffHomeworkMode === "corrections" ? "corrections" : "homeworks",
    });
    return;
  }

  const openStaffCourseButton = event.target.closest("[data-staff-open-course]");

  if (openStaffCourseButton) {
    event.preventDefault();
    const pageName = openStaffCourseButton.dataset.staffOpenCourse || currentStaffPage;
    setStaffDrilldown(pageName, {
      courseId: openStaffCourseButton.dataset.courseId || "",
      lessonKey: "",
    });
    return;
  }

  const openStaffLessonButton = event.target.closest("[data-staff-open-lesson]");

  if (openStaffLessonButton) {
    event.preventDefault();
    const pageName = openStaffLessonButton.dataset.staffOpenLesson || currentStaffPage;
    setStaffDrilldown(pageName, {
      courseId: openStaffLessonButton.dataset.courseId || "",
      lessonKey: openStaffLessonButton.dataset.lessonKey || "",
    });
    return;
  }

  const staffStepBackButton = event.target.closest("[data-staff-back-step]");

  if (staffStepBackButton) {
    event.preventDefault();
    const pageName = staffStepBackButton.dataset.staffBackStep || currentStaffPage;
    const backTo = staffStepBackButton.dataset.staffBackTo || "courses";
    const currentMode = getStaffDrilldown(pageName).mode;
    const nextState = currentMode ? { mode: currentMode } : {};

    if (backTo === "lessons") {
      resetStaffDrilldown(pageName, { ...nextState, courseId: staffStepBackButton.dataset.courseId || "", lessonKey: "" });
    } else {
      resetStaffDrilldown(pageName, nextState);
    }
    return;
  }

  const dynamicLogoutButton = event.target.closest("[data-staff-logout]");

  if (dynamicLogoutButton) {
    event.preventDefault();
    clearStoredStaff();
    updateStaffSessionUi(null);
    setStaffAuthStatus("Вы вышли из командного входа.", "success");
    exitStaffMode();
    loadMessages();
    return;
  }

  const scrollButton = event.target.closest("[data-staff-scroll-target]");

  if (scrollButton) {
    event.preventDefault();
    const target = document.getElementById(scrollButton.dataset.staffScrollTarget || "");

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
});

document.addEventListener("change", (event) => {
  const filter = event.target.closest("[data-staff-filter]");

  if (!filter) {
    return;
  }

  const scope = filter.closest("[data-staff-filter-scope]")?.dataset.staffFilterScope;

  if (!scope) {
    return;
  }

  setFilterValue(scope, filter.dataset.staffFilter, filter.value);
  staffDrilldownState[getStaffDrilldownKey(scope)] = {};
  renderStaffPage(scope);
});

document.addEventListener("submit", (event) => {
  const profileStatusForm = event.target.closest("[data-profile-status-form]");

  if (profileStatusForm) {
    event.preventDefault();
    const status = profileStatusForm.querySelector(".staff-form-status");
    const payload = Object.fromEntries(new FormData(profileStatusForm).entries());

    if (status) {
      status.textContent = "Сохраняю статус...";
      status.className = "staff-form-status is-pending";
    }

    apiFetch("/api/account/status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        const account = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(account.message || account.error || "Статус не сохранен.");
        }
        saveStoredAccount(account);
        applyAccountToUi(account);
      })
      .catch((error) => {
        if (status) {
          status.textContent = error.message || "Статус не сохранен.";
          status.className = "staff-form-status is-error";
        }
      });
    return;
  }

  const adminApplicationForm = event.target.closest("[data-admin-application-form]");

  if (adminApplicationForm) {
    event.preventDefault();
    const applicationId = adminApplicationForm.dataset.applicationId;
    submitStaffJsonForm(adminApplicationForm, `/api/admin/applications/${encodeURIComponent(applicationId)}`, "Заявка сохранена.");
    return;
  }

  const adminSupportForm = event.target.closest("[data-admin-support-form]");

  if (adminSupportForm) {
    event.preventDefault();
    const supportRequestId = adminSupportForm.dataset.supportRequestId;
    submitStaffJsonForm(adminSupportForm, `/api/admin/support/${encodeURIComponent(supportRequestId)}`, "Обращение сохранено.");
    return;
  }

  const adminStudentForm = event.target.closest("[data-admin-student-form]");

  if (adminStudentForm) {
    event.preventDefault();
    submitStaffJsonForm(adminStudentForm, "/api/admin/students", "Ученик сохранён.");
    return;
  }

  const adminEnrollmentForm = event.target.closest("[data-admin-enrollment-form]");

  if (adminEnrollmentForm) {
    event.preventDefault();
    const studentId = adminEnrollmentForm.dataset.studentId;
    const studentDrafts = collectAdminStudentFormDrafts();
    submitStaffJsonForm(adminEnrollmentForm, `/api/admin/students/${encodeURIComponent(studentId)}/enrollment`, "Курс ученика обновлён.").then(() => {
      restoreAdminStudentFormDrafts(studentDrafts);
    });
    return;
  }

  const adminParentChildForm = event.target.closest("[data-admin-parent-child-form]");

  if (adminParentChildForm) {
    event.preventDefault();
    const parentId = adminParentChildForm.dataset.parentId;
    submitStaffJsonForm(adminParentChildForm, `/api/admin/parents/${encodeURIComponent(parentId)}/children`, "Связь родителя и ребёнка обновлена.");
    return;
  }

  const adminCourseStaffForm = event.target.closest("[data-admin-course-staff-form]");

  if (adminCourseStaffForm) {
    event.preventDefault();
    const formData = new FormData(adminCourseStaffForm);
    const courseId = adminCourseStaffForm.dataset.courseId || formData.get("courseId");
    submitStaffJsonForm(adminCourseStaffForm, `/api/admin/courses/${encodeURIComponent(courseId)}/staff`, "Связка курса обновлена.");
    return;
  }

  const adminParentForm = event.target.closest("[data-admin-parent-form]");

  if (adminParentForm) {
    event.preventDefault();
    submitStaffJsonForm(adminParentForm, "/api/admin/parents", "Родитель сохранён.", (form) => {
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      payload.childIds = formData.getAll("childIds");
      return payload;
    });
    return;
  }

  const adminTeacherForm = event.target.closest("[data-admin-teacher-form]");

  if (adminTeacherForm) {
    event.preventDefault();
    submitStaffJsonForm(adminTeacherForm, "/api/admin/teachers", "Преподаватель сохранён.");
    return;
  }

  const adminCuratorForm = event.target.closest("[data-admin-curator-form]");

  if (adminCuratorForm) {
    event.preventDefault();
    submitStaffJsonForm(adminCuratorForm, "/api/admin/curators", "Куратор сохранён.", (form) => {
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      payload.teacherIds = formData.getAll("teacherIds");
      return payload;
    });
    return;
  }

  const homeworkForm = event.target.closest("[data-staff-homework-review-form]");

  if (homeworkForm) {
    event.preventDefault();
    const assignmentId = homeworkForm.dataset.homeworkAssignmentId;
    submitStaffJsonForm(
      homeworkForm,
      `/api/staff/homeworks/${encodeURIComponent(assignmentId)}/review`,
      "Домашнее задание проверено.",
    );
    return;
  }

  const correctionReviewForm = event.target.closest("[data-staff-correction-review-form]");

  if (correctionReviewForm) {
    event.preventDefault();
    const correctionId = correctionReviewForm.dataset.correctionId;
    submitStaffJsonForm(
      correctionReviewForm,
      `/api/staff/corrections/${encodeURIComponent(correctionId)}/review`,
      "Работа над ошибками проверена.",
    );
    return;
  }

  const lessonForm = event.target.closest("[data-staff-lesson-form]");

  if (lessonForm) {
    event.preventDefault();
    submitStaffJsonForm(lessonForm, "/api/staff/lessons", "Урок сохранён.");
    return;
  }

  const streamForm = event.target.closest("[data-staff-stream-form]");

  if (streamForm) {
    event.preventDefault();
    const isEdit = Boolean(new FormData(streamForm).get("streamId"));
    submitStaffJsonForm(streamForm, "/api/staff/streams", isEdit ? "Трансляция сохранена." : "Трансляция создана.");
    return;
  }

  const callForm = event.target.closest("[data-staff-call-form]");

  if (callForm) {
    event.preventDefault();
    const isEdit = Boolean(new FormData(callForm).get("callId"));
    submitStaffJsonForm(callForm, "/api/staff/calls", isEdit ? "Созвон сохранён." : "Созвон создан.", (form) => {
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      payload.studentIds = formData.getAll("studentIds");
      return payload;
    });
    return;
  }

  const reviewForm = event.target.closest("[data-staff-resource-review-form]");

  if (reviewForm) {
    event.preventDefault();
    submitStaffJsonForm(
      reviewForm,
      "/api/staff/reviews",
      "Оценка сохранена.",
      (form) => ({
        resourceType: form.dataset.resourceType,
        resourceId: form.dataset.resourceId,
        ...Object.fromEntries(new FormData(form).entries()),
      }),
    );
    return;
  }

  const commentForm = event.target.closest("[data-staff-student-comment-form]");

  if (commentForm) {
    event.preventDefault();
    const studentId = commentForm.dataset.studentId;
    submitStaffJsonForm(
      commentForm,
      `/api/staff/students/${encodeURIComponent(studentId)}/comment`,
      "Комментарий сохранён.",
    );
  }
});

if (conversationList) {
  conversationList.addEventListener("click", (event) => {
    const filterButton = event.target.closest("[data-message-filter]");

    if (filterButton) {
      event.preventDefault();
      currentMessageFilter = filterButton.dataset.messageFilter || "all";
      renderMessages(latestMessages || { conversations: [], messages: [] });
      return;
    }

    const friendRequestButton = event.target.closest("[data-friend-request]");

    if (friendRequestButton) {
      event.preventDefault();
      sendFriendAction("/api/friends/request", { receiverId: friendRequestButton.dataset.friendRequest });
      return;
    }

    const friendRespondButton = event.target.closest("[data-friend-respond]");

    if (friendRespondButton) {
      event.preventDefault();
      sendFriendAction("/api/friends/respond", {
        requestId: friendRespondButton.dataset.friendRespond,
        action: friendRespondButton.dataset.friendAction || "accept",
      });
      return;
    }

    const friendCancelButton = event.target.closest("[data-friend-cancel]");

    if (friendCancelButton) {
      event.preventDefault();
      sendFriendAction("/api/friends/cancel", { requestId: friendCancelButton.dataset.friendCancel });
      return;
    }

    const friendRemoveButton = event.target.closest("[data-friend-remove]");

    if (friendRemoveButton) {
      event.preventDefault();
      sendFriendAction("/api/friends/remove", { friendId: friendRemoveButton.dataset.friendRemove });
      return;
    }

    const startFriendChatButton = event.target.closest("[data-start-friend-chat]");

    if (startFriendChatButton) {
      event.preventDefault();
      startStudentFriendChat(startFriendChatButton.dataset.startFriendChat);
      return;
    }

    const button = event.target.closest("[data-conversation-id]");

    if (button) {
      currentConversationId = button.dataset.conversationId;
      loadMessages(currentConversationId);
    }
  });
}

if (accountFriendsList) {
  accountFriendsList.addEventListener("click", (event) => {
    const friendRequestButton = event.target.closest("[data-friend-request]");

    if (friendRequestButton) {
      event.preventDefault();
      sendFriendAction("/api/friends/request", { receiverId: friendRequestButton.dataset.friendRequest });
      return;
    }

    const friendRespondButton = event.target.closest("[data-friend-respond]");

    if (friendRespondButton) {
      event.preventDefault();
      sendFriendAction("/api/friends/respond", {
        requestId: friendRespondButton.dataset.friendRespond,
        action: friendRespondButton.dataset.friendAction || "accept",
      });
      return;
    }

    const friendCancelButton = event.target.closest("[data-friend-cancel]");

    if (friendCancelButton) {
      event.preventDefault();
      sendFriendAction("/api/friends/cancel", { requestId: friendCancelButton.dataset.friendCancel });
      return;
    }

    const friendRemoveButton = event.target.closest("[data-friend-remove]");

    if (friendRemoveButton) {
      event.preventDefault();
      sendFriendAction("/api/friends/remove", { friendId: friendRemoveButton.dataset.friendRemove });
      return;
    }

    const startFriendChatButton = event.target.closest("[data-start-friend-chat]");

    if (startFriendChatButton) {
      event.preventDefault();
      startStudentFriendChat(startFriendChatButton.dataset.startFriendChat);
    }
  });
}

if (conversationList) {
  conversationList.addEventListener("submit", (event) => {
    const form = event.target.closest("[data-message-start-form]");

    if (form) {
      event.preventDefault();
      startMessageConversation(form);
    }
  });
}

if (messageForm) {
  messageForm.addEventListener("submit", submitMessage);
}

if (messagesRefreshButton) {
  messagesRefreshButton.addEventListener("click", () => {
    loadMessages(currentConversationId);
  });
}

const initialCourse = location.hash.match(/^#course-(.+)$/)?.[1];
const initialStaffPage = location.hash.match(/^#staff-(.+)$/)?.[1];

if (hasAuthenticatedStaff(currentStaff)) {
  enterStaffMode(currentStaff, initialStaffPage || "messages");
} else if (initialCourse) {
  openCourse(initialCourse);
} else if (location.hash === "#study") {
  openStudy();
} else if (location.hash === "#library") {
  openLibrary();
} else if (location.hash === "#support") {
  openSupport();
} else if (location.hash === "#messages") {
  openMessages();
} else if (location.hash === "#points") {
  openPoints();
} else if (location.hash === "#account") {
  openAccount();
} else {
  openHome();
}

if (hasAuthenticatedAccount(currentAccount)) {
  applyAccountToUi(currentAccount);
} else {
  applyGuestUi();
}

if (hasAuthenticatedAccount(currentAccount)) {
  loadAccount({ silent: true });
  loadShop();
}

updateStaffSessionUi(currentStaff);

if (hasAuthenticatedStaff(currentStaff)) {
  loadStaffMe();
}

if (!streamsLoaded) {
  loadStreams();
}

startStreamStatusRefresh();

window.addEventListener("hashchange", () => {
  const staffPageFromHash = location.hash.match(/^#staff-(.+)$/)?.[1];

  if (staffPageFromHash) {
    if (hasAuthenticatedStaff()) {
      openStaffPage(staffPageFromHash);
    } else {
      openAccount();
    }
    return;
  }

  if (isStaffMode()) {
    openStaffPage("messages");
    return;
  }

  const courseFromHash = location.hash.match(/^#course-(.+)$/)?.[1];

  if (courseFromHash) {
    openCourse(courseFromHash);
    return;
  }

  if (location.hash === "#study") {
    openStudy();
    return;
  }

  if (location.hash === "#library") {
    openLibrary();
    return;
  }

  if (location.hash === "#support") {
    openSupport();
    return;
  }

  if (location.hash === "#messages") {
    openMessages();
    return;
  }

  if (location.hash === "#points") {
    openPoints();
    return;
  }

  if (location.hash === "#account") {
    openAccount();
    return;
  }

  if (location.hash === "#home" || location.hash === "") {
    openHome();
  }
});
