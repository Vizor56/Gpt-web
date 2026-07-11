USE master;
GO

IF DB_ID(N'Yaroslav_Tutor_Online_School') IS NOT NULL
BEGIN
    ALTER DATABASE Yaroslav_Tutor_Online_School SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE Yaroslav_Tutor_Online_School;
END;
GO

CREATE DATABASE Yaroslav_Tutor_Online_School;
GO

USE Yaroslav_Tutor_Online_School;
GO

/*============================================================
  База данных для онлайн-школы подготовки к ЕГЭ.

  Что хранится:
  1. Люди: ученики, родители, преподаватели, кураторы.
  2. Онлайн-курсы: курс, уроки, записи, прогресс ученика.
  3. Конспекты: готовые материалы к предмету, курсу или уроку.
  4. Домашки: готовые шаблоны, задания внутри шаблонов, выдача ученику,
     сдача и проверка.
  5. Частные занятия: заказы, отдельные уроки, домашки после частных уроков.
  6. Баллы, платежи, трансляции, сообщения и уведомления.

  В скрипте используются простые таблицы, первичные ключи,
  внешние ключи, CHECK-ограничения и обычные индексы.
============================================================*/

--============================================================
-- 1. Справочники и люди
--============================================================

CREATE TABLE Subjects
(
    Subject_ID       INT IDENTITY(1,1) NOT NULL,
    Subject_Name     NVARCHAR(100) NOT NULL,
    Exam_Name        NVARCHAR(50) NOT NULL,
    Grade            INT NOT NULL,
    Is_Profile_Level BIT NOT NULL DEFAULT 0,
    Is_Active        BIT NOT NULL DEFAULT 1,

    CONSTRAINT PK_Subjects PRIMARY KEY (Subject_ID),
    CONSTRAINT UQ_Subjects UNIQUE (Subject_Name, Exam_Name, Grade, Is_Profile_Level),
    CONSTRAINT CHK_Subjects_Grade CHECK (Grade BETWEEN 1 AND 11),
    CONSTRAINT CHK_Subjects_Exam_Name CHECK (Exam_Name IN (N'ЕГЭ', N'ОГЭ', N'Школа'))
);

CREATE TABLE Parents
(
    Parent_ID        INT IDENTITY(1,1) NOT NULL,
    First_Name       NVARCHAR(50) NOT NULL,
    Patronymic       NVARCHAR(50) NULL,
    Last_Name        NVARCHAR(50) NOT NULL,
    Phone            NVARCHAR(50) NOT NULL,
    Email            NVARCHAR(150) NULL,
    Telegram_Link    NVARCHAR(500) NULL,
    VK_Link          NVARCHAR(500) NULL,
    Added_Date       DATE NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    Is_Active        BIT NOT NULL DEFAULT 1,

    CONSTRAINT PK_Parents PRIMARY KEY (Parent_ID)
);

CREATE TABLE Students
(
    Student_ID       INT IDENTITY(1,1) NOT NULL,
    Parent_ID        INT NULL,
    First_Name       NVARCHAR(50) NOT NULL,
    Patronymic       NVARCHAR(50) NULL,
    Last_Name        NVARCHAR(50) NOT NULL,
    Phone            NVARCHAR(50) NULL,
    Email            NVARCHAR(150) NULL,
    Telegram_Link    NVARCHAR(500) NULL,
    VK_Link          NVARCHAR(500) NULL,
    Grade            INT NULL,
    Added_Date       DATE NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    Is_Active        BIT NOT NULL DEFAULT 1,

    CONSTRAINT PK_Students PRIMARY KEY (Student_ID),
    CONSTRAINT CHK_Students_Grade CHECK (Grade BETWEEN 1 AND 11 OR Grade IS NULL),
    CONSTRAINT FK_Students_Parents FOREIGN KEY (Parent_ID) REFERENCES Parents(Parent_ID)
);

CREATE TABLE Student_Accounts
(
    Student_Account_ID INT IDENTITY(1,1) NOT NULL,
    Student_ID         INT NOT NULL,
    Login              NVARCHAR(150) NOT NULL,
    Password_Hash      NVARCHAR(128) NOT NULL,
    Created_At         DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    Last_Login_At      DATETIME2 NULL,
    Session_Token      NVARCHAR(128) NULL,
    Session_Expires_At DATETIME2 NULL,

    CONSTRAINT PK_Student_Accounts PRIMARY KEY (Student_Account_ID),
    CONSTRAINT UQ_Student_Accounts_Login UNIQUE (Login),
    CONSTRAINT FK_Student_Accounts_Students FOREIGN KEY (Student_ID) REFERENCES Students(Student_ID)
);

CREATE TABLE Teachers
(
    Teacher_ID       INT IDENTITY(1,1) NOT NULL,
    First_Name       NVARCHAR(50) NOT NULL,
    Patronymic       NVARCHAR(50) NULL,
    Last_Name        NVARCHAR(50) NOT NULL,
    Phone            NVARCHAR(50) NOT NULL,
    Email            NVARCHAR(150) NULL,
    Telegram_Link    NVARCHAR(500) NULL,
    Work_Experience_Years DECIMAL(4,1) NOT NULL DEFAULT 0,
    Average_Rating   DECIMAL(4,2) NULL,
    Salary_Rub       INT NULL,
    Is_Active        BIT NOT NULL DEFAULT 1,

    CONSTRAINT PK_Teachers PRIMARY KEY (Teacher_ID),
    CONSTRAINT CHK_Teachers_Experience CHECK (Work_Experience_Years >= 0),
    CONSTRAINT CHK_Teachers_Rating CHECK (Average_Rating BETWEEN 1 AND 10 OR Average_Rating IS NULL),
    CONSTRAINT CHK_Teachers_Salary CHECK (Salary_Rub >= 0 OR Salary_Rub IS NULL)
);

CREATE TABLE Curators
(
    Curator_ID       INT IDENTITY(1,1) NOT NULL,
    First_Name       NVARCHAR(50) NOT NULL,
    Patronymic       NVARCHAR(50) NULL,
    Last_Name        NVARCHAR(50) NOT NULL,
    Phone            NVARCHAR(50) NOT NULL,
    Email            NVARCHAR(150) NULL,
    Telegram_Link    NVARCHAR(500) NULL,
    Average_Rating   DECIMAL(4,2) NULL,
    Salary_Rub       INT NULL,
    Is_Active        BIT NOT NULL DEFAULT 1,

    CONSTRAINT PK_Curators PRIMARY KEY (Curator_ID),
    CONSTRAINT CHK_Curators_Rating CHECK (Average_Rating BETWEEN 1 AND 10 OR Average_Rating IS NULL),
    CONSTRAINT CHK_Curators_Salary CHECK (Salary_Rub >= 0 OR Salary_Rub IS NULL)
);

CREATE TABLE Staff_Accounts
(
    Staff_Account_ID  INT IDENTITY(1,1) NOT NULL,
    Staff_Role        NVARCHAR(30) NOT NULL,
    Teacher_ID        INT NULL,
    Curator_ID        INT NULL,
    Login             NVARCHAR(150) NOT NULL,
    Password_Hash     NVARCHAR(128) NOT NULL,
    Created_At        DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    Last_Login_At     DATETIME2 NULL,
    Session_Token     NVARCHAR(128) NULL,
    Session_Expires_At DATETIME2 NULL,

    CONSTRAINT PK_Staff_Accounts PRIMARY KEY (Staff_Account_ID),
    CONSTRAINT UQ_Staff_Accounts_Login UNIQUE (Login),
    CONSTRAINT FK_Staff_Accounts_Teachers FOREIGN KEY (Teacher_ID) REFERENCES Teachers(Teacher_ID),
    CONSTRAINT FK_Staff_Accounts_Curators FOREIGN KEY (Curator_ID) REFERENCES Curators(Curator_ID),
    CONSTRAINT CHK_Staff_Accounts_Role CHECK (Staff_Role IN (N'Teacher', N'Curator'))
);

CREATE TABLE Teacher_Subjects
(
    Teacher_Subject_ID INT IDENTITY(1,1) NOT NULL,
    Teacher_ID         INT NOT NULL,
    Subject_ID         INT NOT NULL,

    CONSTRAINT PK_Teacher_Subjects PRIMARY KEY (Teacher_Subject_ID),
    CONSTRAINT UQ_Teacher_Subjects UNIQUE (Teacher_ID, Subject_ID),
    CONSTRAINT FK_Teacher_Subjects_Teachers FOREIGN KEY (Teacher_ID) REFERENCES Teachers(Teacher_ID),
    CONSTRAINT FK_Teacher_Subjects_Subjects FOREIGN KEY (Subject_ID) REFERENCES Subjects(Subject_ID)
);

--============================================================
-- 2. Онлайн-курсы, уроки и прогресс
--============================================================

CREATE TABLE Courses
(
    Course_ID        INT IDENTITY(1,1) NOT NULL,
    Subject_ID       INT NOT NULL,
    Teacher_ID       INT NULL,
    Curator_ID       INT NULL,
    Course_Slug      NVARCHAR(50) NOT NULL,
    Course_Name      NVARCHAR(200) NOT NULL,
    Short_Description NVARCHAR(500) NULL,
    Price_Rub        INT NOT NULL DEFAULT 0,
    Total_Lessons    INT NOT NULL DEFAULT 0,
    Start_Date       DATE NULL,
    End_Date         DATE NULL,
    Cover_Image_Link NVARCHAR(1000) NULL,
    Status           NVARCHAR(30) NOT NULL DEFAULT N'Active',

    CONSTRAINT PK_Courses PRIMARY KEY (Course_ID),
    CONSTRAINT UQ_Courses_Slug UNIQUE (Course_Slug),
    CONSTRAINT FK_Courses_Subjects FOREIGN KEY (Subject_ID) REFERENCES Subjects(Subject_ID),
    CONSTRAINT FK_Courses_Teachers FOREIGN KEY (Teacher_ID) REFERENCES Teachers(Teacher_ID),
    CONSTRAINT FK_Courses_Curators FOREIGN KEY (Curator_ID) REFERENCES Curators(Curator_ID),
    CONSTRAINT CHK_Courses_Price CHECK (Price_Rub >= 0),
    CONSTRAINT CHK_Courses_Total_Lessons CHECK (Total_Lessons >= 0),
    CONSTRAINT CHK_Courses_Dates CHECK (End_Date IS NULL OR Start_Date IS NULL OR End_Date >= Start_Date),
    CONSTRAINT CHK_Courses_Status CHECK (Status IN (N'Draft', N'Active', N'Archived'))
);

CREATE TABLE Course_Enrollments
(
    Course_Enrollment_ID INT IDENTITY(1,1) NOT NULL,
    Course_ID            INT NOT NULL,
    Student_ID           INT NOT NULL,
    Purchased_At         DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    Access_Start_Date    DATE NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    Access_End_Date      DATE NULL,
    Progress_Percent     DECIMAL(5,2) NOT NULL DEFAULT 0,
    Status               NVARCHAR(30) NOT NULL DEFAULT N'Active',

    CONSTRAINT PK_Course_Enrollments PRIMARY KEY (Course_Enrollment_ID),
    CONSTRAINT UQ_Course_Enrollments UNIQUE (Course_ID, Student_ID),
    CONSTRAINT FK_Course_Enrollments_Courses FOREIGN KEY (Course_ID) REFERENCES Courses(Course_ID),
    CONSTRAINT FK_Course_Enrollments_Students FOREIGN KEY (Student_ID) REFERENCES Students(Student_ID),
    CONSTRAINT CHK_Course_Enrollments_Progress CHECK (Progress_Percent BETWEEN 0 AND 100),
    CONSTRAINT CHK_Course_Enrollments_Dates CHECK (Access_End_Date IS NULL OR Access_End_Date >= Access_Start_Date),
    CONSTRAINT CHK_Course_Enrollments_Status CHECK (Status IN (N'Active', N'Paused', N'Finished', N'Refunded'))
);

CREATE TABLE Lessons
(
    Lesson_ID        INT IDENTITY(1,1) NOT NULL,
    Course_ID        INT NOT NULL,
    Lesson_Number    INT NOT NULL,
    Lesson_Title     NVARCHAR(200) NOT NULL,
    Topic            NVARCHAR(500) NULL,
    Video_Link       NVARCHAR(1000) NULL,
    Notes_Link       NVARCHAR(1000) NULL,
    Homework_Link    NVARCHAR(1000) NULL,
    Duration_Minutes INT NULL,
    Release_Date     DATE NULL,
    Is_Open          BIT NOT NULL DEFAULT 1,
    Lesson_Status    NVARCHAR(30) NOT NULL DEFAULT N'Open',

    CONSTRAINT PK_Lessons PRIMARY KEY (Lesson_ID),
    CONSTRAINT UQ_Lessons_Course_Number UNIQUE (Course_ID, Lesson_Number),
    CONSTRAINT FK_Lessons_Courses FOREIGN KEY (Course_ID) REFERENCES Courses(Course_ID),
    CONSTRAINT CHK_Lessons_Number CHECK (Lesson_Number > 0),
    CONSTRAINT CHK_Lessons_Duration CHECK (Duration_Minutes > 0 OR Duration_Minutes IS NULL),
    CONSTRAINT CHK_Lessons_Status CHECK (Lesson_Status IN (N'Done', N'Homework_Check', N'Open', N'Announcement', N'Soon'))
);

CREATE TABLE Lesson_Progress
(
    Lesson_Progress_ID    INT IDENTITY(1,1) NOT NULL,
    Course_Enrollment_ID  INT NOT NULL,
    Lesson_ID             INT NOT NULL,
    Watch_Percent         DECIMAL(5,2) NOT NULL DEFAULT 0,
    Is_Completed          BIT NOT NULL DEFAULT 0,
    Last_Watched_At       DATETIME2 NULL,
    Completed_At          DATETIME2 NULL,

    CONSTRAINT PK_Lesson_Progress PRIMARY KEY (Lesson_Progress_ID),
    CONSTRAINT UQ_Lesson_Progress UNIQUE (Course_Enrollment_ID, Lesson_ID),
    CONSTRAINT FK_Lesson_Progress_Enrollments FOREIGN KEY (Course_Enrollment_ID) REFERENCES Course_Enrollments(Course_Enrollment_ID),
    CONSTRAINT FK_Lesson_Progress_Lessons FOREIGN KEY (Lesson_ID) REFERENCES Lessons(Lesson_ID),
    CONSTRAINT CHK_Lesson_Progress_Watch CHECK (Watch_Percent BETWEEN 0 AND 100)
);

CREATE TABLE Live_Streams
(
    Live_Stream_ID   INT IDENTITY(1,1) NOT NULL,
    Course_ID        INT NOT NULL,
    Lesson_ID        INT NULL,
    Stream_Title     NVARCHAR(200) NOT NULL,
    Starts_At        DATETIME2 NOT NULL,
    Ends_At          DATETIME2 NULL,
    Stream_Link      NVARCHAR(1000) NULL,
    Record_Link      NVARCHAR(1000) NULL,
    Status           NVARCHAR(30) NOT NULL DEFAULT N'Planned',
    Created_At       DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT PK_Live_Streams PRIMARY KEY (Live_Stream_ID),
    CONSTRAINT FK_Live_Streams_Courses FOREIGN KEY (Course_ID) REFERENCES Courses(Course_ID),
    CONSTRAINT FK_Live_Streams_Lessons FOREIGN KEY (Lesson_ID) REFERENCES Lessons(Lesson_ID),
    CONSTRAINT CHK_Live_Streams_Dates CHECK (Ends_At IS NULL OR Ends_At >= Starts_At),
    CONSTRAINT CHK_Live_Streams_Status CHECK (Status IN (N'Planned', N'Live', N'Finished', N'Cancelled'))
);

--============================================================
-- 3. Конспекты и готовые материалы
--============================================================

CREATE TABLE Books_and_notes
(
    Books_and_notes_ID INT IDENTITY(1,1) NOT NULL,
    Subject_ID         INT NOT NULL,
    Course_ID          INT NULL,
    Lesson_ID          INT NULL,
    Material_Name      NVARCHAR(200) NOT NULL,
    Material_Type      NVARCHAR(50) NOT NULL DEFAULT N'Конспект',
    Author             NVARCHAR(200) NULL,
    Publication_Year   INT NULL,
    File_Link          NVARCHAR(1000) NULL,
    Comments           NVARCHAR(MAX) NULL,
    Is_Active          BIT NOT NULL DEFAULT 1,

    CONSTRAINT PK_Books_and_notes PRIMARY KEY (Books_and_notes_ID),
    CONSTRAINT FK_Books_and_notes_Subjects FOREIGN KEY (Subject_ID) REFERENCES Subjects(Subject_ID),
    CONSTRAINT FK_Books_and_notes_Courses FOREIGN KEY (Course_ID) REFERENCES Courses(Course_ID),
    CONSTRAINT FK_Books_and_notes_Lessons FOREIGN KEY (Lesson_ID) REFERENCES Lessons(Lesson_ID),
    CONSTRAINT CHK_Books_and_notes_Year CHECK (Publication_Year > 0 OR Publication_Year IS NULL),
    CONSTRAINT CHK_Books_and_notes_Type CHECK (Material_Type IN (N'Конспект', N'Шпаргалка', N'Книга', N'Презентация', N'Файл'))
);

--============================================================
-- 4. Готовые домашки, задания, выдача и проверка
--============================================================

CREATE TABLE Homework_Templates
(
    Homework_Template_ID INT IDENTITY(1,1) NOT NULL,
    Subject_ID           INT NOT NULL,
    Course_ID            INT NULL,
    Lesson_ID            INT NULL,
    Created_By_Teacher_ID INT NULL,
    Homework_Name        NVARCHAR(200) NOT NULL,
    Description          NVARCHAR(MAX) NULL,
    File_Link            NVARCHAR(1000) NULL,
    Max_Score            INT NOT NULL DEFAULT 10,
    For_Online_Course    BIT NOT NULL DEFAULT 1,
    For_Private_Lesson   BIT NOT NULL DEFAULT 1,
    Is_Active            BIT NOT NULL DEFAULT 1,

    CONSTRAINT PK_Homework_Templates PRIMARY KEY (Homework_Template_ID),
    CONSTRAINT FK_Homework_Templates_Subjects FOREIGN KEY (Subject_ID) REFERENCES Subjects(Subject_ID),
    CONSTRAINT FK_Homework_Templates_Courses FOREIGN KEY (Course_ID) REFERENCES Courses(Course_ID),
    CONSTRAINT FK_Homework_Templates_Lessons FOREIGN KEY (Lesson_ID) REFERENCES Lessons(Lesson_ID),
    CONSTRAINT FK_Homework_Templates_Teachers FOREIGN KEY (Created_By_Teacher_ID) REFERENCES Teachers(Teacher_ID),
    CONSTRAINT CHK_Homework_Templates_Max_Score CHECK (Max_Score > 0),
    CONSTRAINT CHK_Homework_Templates_Usage CHECK (For_Online_Course = 1 OR For_Private_Lesson = 1)
);

CREATE TABLE Homework_Tasks
(
    Homework_Task_ID     INT IDENTITY(1,1) NOT NULL,
    Homework_Template_ID INT NOT NULL,
    Task_Number          INT NOT NULL,
    Task_Text            NVARCHAR(MAX) NOT NULL,
    Answer_Text          NVARCHAR(MAX) NULL,
    Score                INT NOT NULL DEFAULT 1,

    CONSTRAINT PK_Homework_Tasks PRIMARY KEY (Homework_Task_ID),
    CONSTRAINT UQ_Homework_Tasks UNIQUE (Homework_Template_ID, Task_Number),
    CONSTRAINT FK_Homework_Tasks_Templates FOREIGN KEY (Homework_Template_ID) REFERENCES Homework_Templates(Homework_Template_ID),
    CONSTRAINT CHK_Homework_Tasks_Number CHECK (Task_Number > 0),
    CONSTRAINT CHK_Homework_Tasks_Score CHECK (Score > 0)
);

--============================================================
-- 5. Частные занятия
--============================================================

CREATE TABLE Private_Lesson_Orders
(
    Private_Order_ID INT IDENTITY(1,1) NOT NULL,
    Subject_ID       INT NOT NULL,
    Student_ID       INT NOT NULL,
    Teacher_ID       INT NOT NULL,
    Curator_ID       INT NULL,
    Price_Per_Lesson_Rub INT NOT NULL,
    Date_Start       DATE NULL,
    Date_End         DATE NULL,
    Chat_Link        NVARCHAR(1000) NULL,
    Board_Link       NVARCHAR(1000) NULL,
    Call_Link        NVARCHAR(1000) NULL,
    Records_Folder_Link NVARCHAR(1000) NULL,
    Status           NVARCHAR(30) NOT NULL DEFAULT N'Active',

    CONSTRAINT PK_Private_Lesson_Orders PRIMARY KEY (Private_Order_ID),
    CONSTRAINT FK_Private_Orders_Subjects FOREIGN KEY (Subject_ID) REFERENCES Subjects(Subject_ID),
    CONSTRAINT FK_Private_Orders_Students FOREIGN KEY (Student_ID) REFERENCES Students(Student_ID),
    CONSTRAINT FK_Private_Orders_Teachers FOREIGN KEY (Teacher_ID) REFERENCES Teachers(Teacher_ID),
    CONSTRAINT FK_Private_Orders_Curators FOREIGN KEY (Curator_ID) REFERENCES Curators(Curator_ID),
    CONSTRAINT CHK_Private_Orders_Price CHECK (Price_Per_Lesson_Rub >= 0),
    CONSTRAINT CHK_Private_Orders_Dates CHECK (Date_End IS NULL OR Date_Start IS NULL OR Date_End >= Date_Start),
    CONSTRAINT CHK_Private_Orders_Status CHECK (Status IN (N'Active', N'Paused', N'Finished', N'Cancelled'))
);

CREATE TABLE Private_Lessons
(
    Private_Lesson_ID INT IDENTITY(1,1) NOT NULL,
    Private_Order_ID  INT NOT NULL,
    Lesson_Number     INT NOT NULL,
    Lesson_Title      NVARCHAR(200) NULL,
    Starts_At         DATETIME2 NOT NULL,
    Ends_At           DATETIME2 NULL,
    Call_Link         NVARCHAR(1000) NULL,
    Board_Link        NVARCHAR(1000) NULL,
    Record_Link       NVARCHAR(1000) NULL,
    Teacher_Comment   NVARCHAR(MAX) NULL,
    Status            NVARCHAR(30) NOT NULL DEFAULT N'Planned',

    CONSTRAINT PK_Private_Lessons PRIMARY KEY (Private_Lesson_ID),
    CONSTRAINT UQ_Private_Lessons_Order_Number UNIQUE (Private_Order_ID, Lesson_Number),
    CONSTRAINT FK_Private_Lessons_Orders FOREIGN KEY (Private_Order_ID) REFERENCES Private_Lesson_Orders(Private_Order_ID),
    CONSTRAINT CHK_Private_Lessons_Number CHECK (Lesson_Number > 0),
    CONSTRAINT CHK_Private_Lessons_Dates CHECK (Ends_At IS NULL OR Ends_At >= Starts_At),
    CONSTRAINT CHK_Private_Lessons_Status CHECK (Status IN (N'Planned', N'Done', N'Cancelled', N'Moved'))
);

CREATE TABLE Homework_Assignments
(
    Homework_Assignment_ID INT IDENTITY(1,1) NOT NULL,
    Homework_Template_ID   INT NOT NULL,
    Student_ID             INT NOT NULL,
    Course_Enrollment_ID   INT NULL,
    Private_Lesson_ID      INT NULL,
    Assigned_By_Teacher_ID INT NULL,
    Assigned_By_Curator_ID INT NULL,
    Assigned_Date          DATE NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    Due_Date               DATETIME2 NULL,
    Status                 NVARCHAR(30) NOT NULL DEFAULT N'Assigned',
    Teacher_Comment        NVARCHAR(MAX) NULL,

    CONSTRAINT PK_Homework_Assignments PRIMARY KEY (Homework_Assignment_ID),
    CONSTRAINT FK_Homework_Assignments_Templates FOREIGN KEY (Homework_Template_ID) REFERENCES Homework_Templates(Homework_Template_ID),
    CONSTRAINT FK_Homework_Assignments_Students FOREIGN KEY (Student_ID) REFERENCES Students(Student_ID),
    CONSTRAINT FK_Homework_Assignments_Enrollments FOREIGN KEY (Course_Enrollment_ID) REFERENCES Course_Enrollments(Course_Enrollment_ID),
    CONSTRAINT FK_Homework_Assignments_Private_Lessons FOREIGN KEY (Private_Lesson_ID) REFERENCES Private_Lessons(Private_Lesson_ID),
    CONSTRAINT FK_Homework_Assignments_Teachers FOREIGN KEY (Assigned_By_Teacher_ID) REFERENCES Teachers(Teacher_ID),
    CONSTRAINT FK_Homework_Assignments_Curators FOREIGN KEY (Assigned_By_Curator_ID) REFERENCES Curators(Curator_ID),
    CONSTRAINT CHK_Homework_Assignments_Source CHECK (Course_Enrollment_ID IS NOT NULL OR Private_Lesson_ID IS NOT NULL),
    CONSTRAINT CHK_Homework_Assignments_Status CHECK (Status IN (N'Assigned', N'Submitted', N'Checked', N'Late', N'Cancelled'))
);

CREATE TABLE Homework_Submissions
(
    Homework_Submission_ID INT IDENTITY(1,1) NOT NULL,
    Homework_Assignment_ID INT NOT NULL,
    Submitted_At           DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    Student_Text           NVARCHAR(MAX) NULL,
    File_Link              NVARCHAR(1000) NULL,
    Checked_By_Teacher_ID  INT NULL,
    Checked_At             DATETIME2 NULL,
    Score                  INT NULL,
    Feedback_Text          NVARCHAR(MAX) NULL,
    Status                 NVARCHAR(30) NOT NULL DEFAULT N'Submitted',

    CONSTRAINT PK_Homework_Submissions PRIMARY KEY (Homework_Submission_ID),
    CONSTRAINT FK_Homework_Submissions_Assignments FOREIGN KEY (Homework_Assignment_ID) REFERENCES Homework_Assignments(Homework_Assignment_ID),
    CONSTRAINT FK_Homework_Submissions_Teachers FOREIGN KEY (Checked_By_Teacher_ID) REFERENCES Teachers(Teacher_ID),
    CONSTRAINT CHK_Homework_Submissions_Score CHECK (Score BETWEEN 1 AND 10 OR Score IS NULL),
    CONSTRAINT CHK_Homework_Submissions_Status CHECK (Status IN (N'Submitted', N'Checked', N'Needs_Fix'))
);

--============================================================
-- 6. Платежи, баллы, бонусы
--============================================================

CREATE TABLE Payments
(
    Payment_ID            INT IDENTITY(1,1) NOT NULL,
    Student_ID            INT NOT NULL,
    Course_Enrollment_ID  INT NULL,
    Private_Order_ID      INT NULL,
    Amount_Rub            INT NOT NULL,
    Paid_At               DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    Payment_Method        NVARCHAR(50) NULL,
    Status                NVARCHAR(30) NOT NULL DEFAULT N'Paid',
    Comment               NVARCHAR(500) NULL,

    CONSTRAINT PK_Payments PRIMARY KEY (Payment_ID),
    CONSTRAINT FK_Payments_Students FOREIGN KEY (Student_ID) REFERENCES Students(Student_ID),
    CONSTRAINT FK_Payments_Enrollments FOREIGN KEY (Course_Enrollment_ID) REFERENCES Course_Enrollments(Course_Enrollment_ID),
    CONSTRAINT FK_Payments_Private_Orders FOREIGN KEY (Private_Order_ID) REFERENCES Private_Lesson_Orders(Private_Order_ID),
    CONSTRAINT CHK_Payments_Amount CHECK (Amount_Rub >= 0),
    CONSTRAINT CHK_Payments_Target CHECK (Course_Enrollment_ID IS NOT NULL OR Private_Order_ID IS NOT NULL),
    CONSTRAINT CHK_Payments_Status CHECK (Status IN (N'Paid', N'Refunded', N'Waiting'))
);

CREATE TABLE Point_Transactions
(
    Point_Transaction_ID  INT IDENTITY(1,1) NOT NULL,
    Student_ID            INT NOT NULL,
    Course_Enrollment_ID  INT NULL,
    Homework_Assignment_ID INT NULL,
    Points                INT NOT NULL,
    Reason                NVARCHAR(200) NOT NULL,
    Created_At            DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT PK_Point_Transactions PRIMARY KEY (Point_Transaction_ID),
    CONSTRAINT FK_Point_Transactions_Students FOREIGN KEY (Student_ID) REFERENCES Students(Student_ID),
    CONSTRAINT FK_Point_Transactions_Enrollments FOREIGN KEY (Course_Enrollment_ID) REFERENCES Course_Enrollments(Course_Enrollment_ID),
    CONSTRAINT FK_Point_Transactions_Homework FOREIGN KEY (Homework_Assignment_ID) REFERENCES Homework_Assignments(Homework_Assignment_ID)
);

CREATE TABLE Point_Rewards
(
    Point_Reward_ID INT IDENTITY(1,1) NOT NULL,
    Reward_Name     NVARCHAR(200) NOT NULL,
    Points_Price    INT NOT NULL,
    Description     NVARCHAR(500) NULL,
    Is_Active       BIT NOT NULL DEFAULT 1,

    CONSTRAINT PK_Point_Rewards PRIMARY KEY (Point_Reward_ID),
    CONSTRAINT CHK_Point_Rewards_Price CHECK (Points_Price > 0)
);

CREATE TABLE Student_Reward_Orders
(
    Student_Reward_Order_ID INT IDENTITY(1,1) NOT NULL,
    Student_ID              INT NOT NULL,
    Point_Reward_ID         INT NOT NULL,
    Ordered_At              DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    Status                  NVARCHAR(30) NOT NULL DEFAULT N'New',

    CONSTRAINT PK_Student_Reward_Orders PRIMARY KEY (Student_Reward_Order_ID),
    CONSTRAINT FK_Student_Reward_Orders_Students FOREIGN KEY (Student_ID) REFERENCES Students(Student_ID),
    CONSTRAINT FK_Student_Reward_Orders_Rewards FOREIGN KEY (Point_Reward_ID) REFERENCES Point_Rewards(Point_Reward_ID),
    CONSTRAINT CHK_Student_Reward_Orders_Status CHECK (Status IN (N'New', N'Done', N'Cancelled'))
);

CREATE TABLE Capybara_Shop_Items
(
    Item_ID      INT IDENTITY(1,1) NOT NULL,
    Item_Code    NVARCHAR(80) NOT NULL,
    Item_Name    NVARCHAR(150) NOT NULL,
    Item_Type    NVARCHAR(50) NOT NULL,
    Price_Points INT NOT NULL,
    Css_Class    NVARCHAR(80) NOT NULL,
    Description  NVARCHAR(400) NULL,
    Is_Active    BIT NOT NULL DEFAULT 1,

    CONSTRAINT PK_Capybara_Shop_Items PRIMARY KEY (Item_ID),
    CONSTRAINT UQ_Capybara_Shop_Items_Code UNIQUE (Item_Code),
    CONSTRAINT CHK_Capybara_Shop_Items_Price CHECK (Price_Points > 0)
);

CREATE TABLE Student_Capybara_Items
(
    Student_ID   INT NOT NULL,
    Item_ID      INT NOT NULL,
    Purchased_At DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    Is_Equipped  BIT NOT NULL DEFAULT 0,

    CONSTRAINT PK_Student_Capybara_Items PRIMARY KEY (Student_ID, Item_ID),
    CONSTRAINT FK_Student_Capybara_Items_Students FOREIGN KEY (Student_ID) REFERENCES Students(Student_ID),
    CONSTRAINT FK_Student_Capybara_Items_Items FOREIGN KEY (Item_ID) REFERENCES Capybara_Shop_Items(Item_ID)
);

--============================================================
-- 7. Сообщения, уведомления, обратная связь
--============================================================

CREATE TABLE Chats
(
    Chat_ID        INT IDENTITY(1,1) NOT NULL,
    Student_ID     INT NOT NULL,
    Teacher_ID     INT NULL,
    Curator_ID     INT NULL,
    Chat_Name      NVARCHAR(200) NOT NULL,
    Created_At     DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    Is_Active      BIT NOT NULL DEFAULT 1,

    CONSTRAINT PK_Chats PRIMARY KEY (Chat_ID),
    CONSTRAINT FK_Chats_Students FOREIGN KEY (Student_ID) REFERENCES Students(Student_ID),
    CONSTRAINT FK_Chats_Teachers FOREIGN KEY (Teacher_ID) REFERENCES Teachers(Teacher_ID),
    CONSTRAINT FK_Chats_Curators FOREIGN KEY (Curator_ID) REFERENCES Curators(Curator_ID)
);

CREATE TABLE Chat_Messages
(
    Chat_Message_ID INT IDENTITY(1,1) NOT NULL,
    Chat_ID         INT NOT NULL,
    Sender_Role     NVARCHAR(30) NOT NULL,
    Sender_Name     NVARCHAR(150) NOT NULL,
    Message_Text    NVARCHAR(MAX) NOT NULL,
    Sent_At         DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    Is_Read         BIT NOT NULL DEFAULT 0,

    CONSTRAINT PK_Chat_Messages PRIMARY KEY (Chat_Message_ID),
    CONSTRAINT FK_Chat_Messages_Chats FOREIGN KEY (Chat_ID) REFERENCES Chats(Chat_ID),
    CONSTRAINT CHK_Chat_Messages_Sender_Role CHECK (Sender_Role IN (N'Student', N'Parent', N'Teacher', N'Curator', N'System'))
);

CREATE TABLE Staff_Resource_Reviews
(
    Review_ID     INT IDENTITY(1,1) NOT NULL,
    Staff_Role    NVARCHAR(30) NOT NULL,
    Staff_ID      INT NOT NULL,
    Resource_Type NVARCHAR(40) NOT NULL,
    Resource_ID   INT NOT NULL,
    Rating        INT NULL,
    Comment_Text  NVARCHAR(1200) NULL,
    Created_At    DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    Updated_At    DATETIME2 NULL,

    CONSTRAINT PK_Staff_Resource_Reviews PRIMARY KEY (Review_ID),
    CONSTRAINT UQ_Staff_Resource_Reviews UNIQUE (Staff_Role, Staff_ID, Resource_Type, Resource_ID),
    CONSTRAINT CHK_Staff_Resource_Reviews_Role CHECK (Staff_Role IN (N'Teacher', N'Curator')),
    CONSTRAINT CHK_Staff_Resource_Reviews_Type CHECK (Resource_Type IN (N'Lesson', N'Note', N'Homework', N'Stream')),
    CONSTRAINT CHK_Staff_Resource_Reviews_Rating CHECK (Rating BETWEEN 1 AND 10 OR Rating IS NULL)
);

CREATE TABLE Student_Staff_Comments
(
    Comment_ID   INT IDENTITY(1,1) NOT NULL,
    Student_ID   INT NOT NULL,
    Staff_Role   NVARCHAR(30) NOT NULL,
    Staff_ID     INT NOT NULL,
    Comment_Text NVARCHAR(1200) NOT NULL,
    Created_At   DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT PK_Student_Staff_Comments PRIMARY KEY (Comment_ID),
    CONSTRAINT FK_Student_Staff_Comments_Students FOREIGN KEY (Student_ID) REFERENCES Students(Student_ID),
    CONSTRAINT CHK_Student_Staff_Comments_Role CHECK (Staff_Role IN (N'Teacher', N'Curator'))
);

CREATE TABLE Notifications
(
    Notification_ID INT IDENTITY(1,1) NOT NULL,
    Student_ID      INT NOT NULL,
    Title           NVARCHAR(200) NOT NULL,
    Notification_Text NVARCHAR(1000) NULL,
    Notification_Type NVARCHAR(50) NOT NULL,
    Link            NVARCHAR(1000) NULL,
    Created_At      DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    Is_Read         BIT NOT NULL DEFAULT 0,

    CONSTRAINT PK_Notifications PRIMARY KEY (Notification_ID),
    CONSTRAINT FK_Notifications_Students FOREIGN KEY (Student_ID) REFERENCES Students(Student_ID),
    CONSTRAINT CHK_Notifications_Type CHECK (Notification_Type IN (N'Course', N'Homework', N'Live_Stream', N'Points', N'Message', N'System'))
);

CREATE TABLE Feedbacks
(
    Feedback_ID          INT IDENTITY(1,1) NOT NULL,
    Student_ID           INT NOT NULL,
    Parent_ID            INT NULL,
    Teacher_ID           INT NULL,
    Curator_ID           INT NULL,
    Course_Enrollment_ID INT NULL,
    Private_Lesson_ID    INT NULL,
    Feedback_Type        NVARCHAR(50) NOT NULL,
    Mark                 INT NULL,
    Feedback_Text        NVARCHAR(MAX) NULL,
    Created_At           DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT PK_Feedbacks PRIMARY KEY (Feedback_ID),
    CONSTRAINT FK_Feedbacks_Students FOREIGN KEY (Student_ID) REFERENCES Students(Student_ID),
    CONSTRAINT FK_Feedbacks_Parents FOREIGN KEY (Parent_ID) REFERENCES Parents(Parent_ID),
    CONSTRAINT FK_Feedbacks_Teachers FOREIGN KEY (Teacher_ID) REFERENCES Teachers(Teacher_ID),
    CONSTRAINT FK_Feedbacks_Curators FOREIGN KEY (Curator_ID) REFERENCES Curators(Curator_ID),
    CONSTRAINT FK_Feedbacks_Enrollments FOREIGN KEY (Course_Enrollment_ID) REFERENCES Course_Enrollments(Course_Enrollment_ID),
    CONSTRAINT FK_Feedbacks_Private_Lessons FOREIGN KEY (Private_Lesson_ID) REFERENCES Private_Lessons(Private_Lesson_ID),
    CONSTRAINT CHK_Feedbacks_Mark CHECK (Mark BETWEEN 1 AND 10 OR Mark IS NULL),
    CONSTRAINT CHK_Feedbacks_Type CHECK (Feedback_Type IN (N'Student_To_Teacher', N'Parent_To_Teacher', N'Parent_To_Curator', N'Teacher_To_Student', N'Curator_To_Parent'))
);

CREATE TABLE Course_Applications
(
    Application_ID    INT IDENTITY(1,1) NOT NULL,
    Student_Name      NVARCHAR(150) NOT NULL,
    Phone             NVARCHAR(50) NOT NULL,
    Email             NVARCHAR(150) NULL,
    Preferred_Subject NVARCHAR(100) NOT NULL,
    Grade             INT NULL,
    Comment_Text      NVARCHAR(1000) NULL,
    Source_Page       NVARCHAR(100) NOT NULL DEFAULT N'Главная',
    Status            NVARCHAR(30) NOT NULL DEFAULT N'New',
    Created_At        DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT PK_Course_Applications PRIMARY KEY (Application_ID),
    CONSTRAINT CHK_Course_Applications_Grade CHECK (Grade BETWEEN 1 AND 11 OR Grade IS NULL),
    CONSTRAINT CHK_Course_Applications_Status CHECK (Status IN (N'New', N'Contacted', N'Enrolled', N'Rejected'))
);

--============================================================
-- 8. Индексы для внешних ключей и частых экранов личного кабинета
--============================================================

CREATE INDEX IX_Students_Parent_ID ON Students(Parent_ID);
CREATE INDEX IX_Student_Accounts_Student_ID ON Student_Accounts(Student_ID);
CREATE INDEX IX_Teacher_Subjects_Teacher_ID ON Teacher_Subjects(Teacher_ID);
CREATE INDEX IX_Teacher_Subjects_Subject_ID ON Teacher_Subjects(Subject_ID);
CREATE INDEX IX_Courses_Subject_ID ON Courses(Subject_ID);
CREATE INDEX IX_Courses_Teacher_ID ON Courses(Teacher_ID);
CREATE INDEX IX_Courses_Curator_ID ON Courses(Curator_ID);
CREATE INDEX IX_Enrollments_Student_ID ON Course_Enrollments(Student_ID);
CREATE INDEX IX_Enrollments_Course_ID ON Course_Enrollments(Course_ID);
CREATE INDEX IX_Lessons_Course_ID ON Lessons(Course_ID);
CREATE INDEX IX_Lesson_Progress_Enrollment_ID ON Lesson_Progress(Course_Enrollment_ID);
CREATE INDEX IX_Books_and_notes_Subject_ID ON Books_and_notes(Subject_ID);
CREATE INDEX IX_Books_and_notes_Course_ID ON Books_and_notes(Course_ID);
CREATE INDEX IX_Homework_Templates_Subject_ID ON Homework_Templates(Subject_ID);
CREATE INDEX IX_Homework_Templates_Course_ID ON Homework_Templates(Course_ID);
CREATE INDEX IX_Homework_Assignments_Student_ID ON Homework_Assignments(Student_ID);
CREATE INDEX IX_Homework_Assignments_Enrollment_ID ON Homework_Assignments(Course_Enrollment_ID);
CREATE INDEX IX_Homework_Assignments_Private_Lesson_ID ON Homework_Assignments(Private_Lesson_ID);
CREATE INDEX IX_Private_Orders_Student_ID ON Private_Lesson_Orders(Student_ID);
CREATE INDEX IX_Private_Lessons_Order_ID ON Private_Lessons(Private_Order_ID);
CREATE INDEX IX_Payments_Student_ID ON Payments(Student_ID);
CREATE INDEX IX_Point_Transactions_Student_ID ON Point_Transactions(Student_ID);
CREATE INDEX IX_Notifications_Student_ID ON Notifications(Student_ID);
CREATE INDEX IX_Chat_Messages_Chat_ID ON Chat_Messages(Chat_ID);
CREATE INDEX IX_Course_Applications_Status ON Course_Applications(Status, Created_At);
CREATE INDEX IX_Staff_Resource_Reviews_Resource ON Staff_Resource_Reviews(Resource_Type, Resource_ID);
CREATE INDEX IX_Student_Staff_Comments_Student_ID ON Student_Staff_Comments(Student_ID, Created_At DESC);

--============================================================
-- 9. Минимальные тестовые данные под текущий экран сайта
--============================================================

INSERT INTO Subjects (Subject_Name, Exam_Name, Grade, Is_Profile_Level)
VALUES
    (N'Математика', N'ЕГЭ', 11, 1),
    (N'Русский язык', N'ЕГЭ', 11, 0),
    (N'Информатика', N'ЕГЭ', 11, 0),
    (N'Физика', N'ЕГЭ', 11, 0);

INSERT INTO Parents (First_Name, Last_Name, Phone, Telegram_Link)
VALUES
    (N'Марина', N'Петрова', N'+7 900 000-00-01', N'https://t.me/marina_parent');

INSERT INTO Students (Parent_ID, First_Name, Last_Name, Phone, Telegram_Link, Grade)
VALUES
    (1, N'Иван', N'Петров', N'+7 900 000-00-02', N'https://t.me/ivan_student', 11);

INSERT INTO Teachers (First_Name, Last_Name, Phone, Telegram_Link, Work_Experience_Years, Average_Rating)
VALUES
    (N'Ярослав', N'Смирнов', N'+7 900 000-00-03', N'https://t.me/teacher_math', 7, 9.80),
    (N'Ольга', N'Кузнецова', N'+7 900 000-00-04', N'https://t.me/teacher_russian', 6, 9.60),
    (N'Дмитрий', N'Орлов', N'+7 900 000-00-05', N'https://t.me/teacher_it', 5, 9.50),
    (N'Алексей', N'Волков', N'+7 900 000-00-06', N'https://t.me/teacher_physics', 8, 9.70);

INSERT INTO Curators (First_Name, Last_Name, Phone, Telegram_Link, Average_Rating)
VALUES
    (N'Анна', N'Сергеевна', N'+7 900 000-00-07', N'https://t.me/curator_anna', 9.90),
    (N'Мария', N'Орлова', N'+7 900 000-00-08', N'https://t.me/curator_maria', 9.76),
    (N'Иван', N'Романов', N'+7 900 000-00-09', N'https://t.me/curator_ivan', 9.64);

INSERT INTO Staff_Accounts (Staff_Role, Teacher_ID, Curator_ID, Login, Password_Hash)
VALUES
    (N'Teacher', 1, NULL, N'teacher', N'cde383eee8ee7a4400adf7a15f716f179a2eb97646b37e089eb8d6d04e663416'),
    (N'Teacher', 2, NULL, N'teacher_russian', N'cde383eee8ee7a4400adf7a15f716f179a2eb97646b37e089eb8d6d04e663416'),
    (N'Teacher', 3, NULL, N'teacher_it', N'cde383eee8ee7a4400adf7a15f716f179a2eb97646b37e089eb8d6d04e663416'),
    (N'Teacher', 4, NULL, N'teacher_physics', N'cde383eee8ee7a4400adf7a15f716f179a2eb97646b37e089eb8d6d04e663416'),
    (N'Curator', NULL, 1, N'curator', N'958fd30f64ac34d82850e17dd0d816130c61fd42c64c8e5782515108da1b2eff'),
    (N'Curator', NULL, 2, N'curator_maria', N'958fd30f64ac34d82850e17dd0d816130c61fd42c64c8e5782515108da1b2eff'),
    (N'Curator', NULL, 3, N'curator_ivan', N'958fd30f64ac34d82850e17dd0d816130c61fd42c64c8e5782515108da1b2eff');

INSERT INTO Teacher_Subjects (Teacher_ID, Subject_ID)
VALUES (1,1), (2,2), (3,3), (4,4);

INSERT INTO Courses (Subject_ID, Teacher_ID, Curator_ID, Course_Slug, Course_Name, Short_Description, Price_Rub, Total_Lessons, Status)
VALUES
    (1, 1, 1, N'math', N'ЕГЭ Математика', N'Профильная математика: теория, записи, конспекты и домашки.', 24900, 24, N'Active'),
    (2, 2, 1, N'russian', N'ЕГЭ Русский язык', N'Тестовая часть, сочинение, теория и практика.', 21900, 24, N'Active'),
    (3, 3, 2, N'informatics', N'ЕГЭ Информатика', N'Алгоритмы, программирование и разбор задач ЕГЭ.', 23900, 24, N'Active'),
    (4, 4, 3, N'physics', N'ЕГЭ Физика', N'Механика, электричество, оптика и задачи второй части.', 24900, 24, N'Active');

INSERT INTO Course_Enrollments (Course_ID, Student_ID, Progress_Percent)
VALUES
    (1, 1, 33.00),
    (2, 1, 75.00),
    (3, 1, 58.00),
    (4, 1, 42.00);

INSERT INTO Lessons (Course_ID, Lesson_Number, Lesson_Title, Topic, Video_Link, Notes_Link, Homework_Link, Duration_Minutes, Is_Open, Lesson_Status)
VALUES
    (1, 1, N'Производная', N'Понятие производной, правила дифференцирования', N'https://www.youtube.com/watch?v=M6K6SbXO44Q', N'https://drive.google.com/file/d/1LaFegJ29E7PYwXq1QA4R6mCJtyK70mRo', N'https://example.com/homework/math-derivative.pdf', 85, 1, N'Done'),
    (1, 2, N'Первообразная', N'Неопределенный интеграл, таблица интегралов', N'https://www.youtube.com/watch?v=N98OuNVG5pY', N'https://drive.google.com/file/d/1ADdDBQ22c0DtLXORv-xzJ-yzzqP9R81I', N'https://example.com/homework/math-integral.pdf', 90, 1, N'Homework_Check'),
    (1, 3, N'Задачи с параметром', N'Основные методы решения задач с параметром', N'https://www.youtube.com/watch?v=4r_IcBBMmj8', N'https://drive.google.com/file/d/1VXR7RgKc0wSFlkqqpOB4MY2mqzo993Zm', N'https://example.com/homework/math-parameters.pdf', 95, 1, N'Open'),
    (1, 4, N'Планиметрия', N'Треугольники, четырехугольники, окружности', N'https://www.youtube.com/watch?v=axMFeOWP6x8', N'https://drive.google.com/file/d/1yDKrMTfyM0PbZ3SC2RGo8hVtO-U8i9R1', NULL, 240, 1, N'Open'),

    (2, 1, N'Орфоэпия и ударения', N'Словник ФИПИ, типичные ловушки задания 4', N'https://www.youtube.com/results?search_query=ЕГЭ+русский+орфоэпия+урок', N'https://drive.google.com/file/d/1aaFkBsvU-IPPm_Z8mFluYvf9CvTfnAxw', N'https://example.com/homework/russian-orthoepy.pdf', 70, 1, N'Done'),
    (2, 2, N'Паронимы', N'Различение значений и работа со словарём паронимов', N'https://www.youtube.com/results?search_query=ЕГЭ+русский+паронимы+урок', N'https://drive.google.com/file/d/1riOofik3Pg38MfSuvP38UEe-gzxGAZzg', N'https://example.com/homework/russian-paronyms.pdf', 75, 1, N'Homework_Check'),
    (2, 3, N'Сочинение ЕГЭ', N'Проблема, комментарий, позиция автора и аргументация', N'https://www.youtube.com/results?search_query=ЕГЭ+русский+сочинение+урок', N'https://drive.google.com/file/d/1xG46l0vexVAfSS2Ora-VIhnkta4W55VB', N'https://example.com/homework/russian-essay.pdf', 95, 1, N'Open'),
    (2, 4, N'Пунктуация в сложном предложении', N'СПП, БСП и сложные случаи постановки знаков', NULL, N'https://drive.google.com/file/d/1GQbihWtR5JhrzyvIN2OXPwJNpgYaZVq-', NULL, 90, 0, N'Announcement'),

    (3, 1, N'Кодирование информации', N'Алфавитный подход, объём сообщения, единицы измерения', N'https://www.youtube.com/results?search_query=ЕГЭ+информатика+кодирование+информации', N'https://drive.google.com/file/d/14DJwCAEpiEqjPNsr6sDTTDMxBVI-X8j2', N'https://example.com/homework/it-coding.pdf', 80, 1, N'Done'),
    (3, 2, N'Логические выражения', N'Таблицы истинности и преобразование логических выражений', N'https://www.youtube.com/results?search_query=ЕГЭ+информатика+логика+урок', N'https://drive.google.com/file/d/1OWMHfQNNgjC8z-FbY2s0ProsYWVMhWCD', N'https://example.com/homework/it-logic.pdf', 85, 1, N'Homework_Check'),
    (3, 3, N'Python: циклы и условия', N'Базовые конструкции для задач ЕГЭ', N'https://www.youtube.com/results?search_query=ЕГЭ+информатика+Python+циклы+условия', N'https://drive.google.com/file/d/12VWLzqM_8VF3ak0xGbyNrwmjOWLEJgPy', N'https://example.com/homework/it-python.pdf', 95, 1, N'Open'),
    (3, 4, N'Динамическое программирование', N'Разбор идеи и первые задачи', NULL, N'https://drive.google.com/file/d/1eCsAogLgzZS_T39AZQNqXxeSXfBYFS3c', NULL, 90, 0, N'Announcement'),

    (4, 1, N'Кинематика', N'Равномерное и равноускоренное движение', N'https://www.youtube.com/results?search_query=ЕГЭ+физика+кинематика+урок', N'https://drive.google.com/file/d/1LaFegJ29E7PYwXq1QA4R6mCJtyK70mRo', N'https://example.com/homework/physics-kinematics.pdf', 80, 1, N'Done'),
    (4, 2, N'Законы Ньютона', N'Силы, ускорение, движение по окружности', N'https://www.youtube.com/results?search_query=ЕГЭ+физика+законы+Ньютона+урок', N'https://drive.google.com/file/d/1ADdDBQ22c0DtLXORv-xzJ-yzzqP9R81I', N'https://example.com/homework/physics-newton.pdf', 90, 1, N'Homework_Check'),
    (4, 3, N'Электростатика', N'Закон Кулона, напряжённость, потенциал', N'https://www.youtube.com/results?search_query=ЕГЭ+физика+электростатика+урок', N'https://drive.google.com/file/d/1aaFkBsvU-IPPm_Z8mFluYvf9CvTfnAxw', N'https://example.com/homework/physics-electrostatics.pdf', 95, 1, N'Open'),
    (4, 4, N'Оптика', N'Линзы, зеркала и ход лучей', NULL, N'https://drive.google.com/file/d/1VXR7RgKc0wSFlkqqpOB4MY2mqzo993Zm', NULL, 85, 0, N'Announcement');

INSERT INTO Lesson_Progress (Course_Enrollment_ID, Lesson_ID, Watch_Percent, Is_Completed, Completed_At)
VALUES
    (1, 1, 100, 1, SYSDATETIME()),
    (1, 2, 100, 1, SYSDATETIME()),
    (1, 3, 40, 0, NULL),
    (2, 5, 100, 1, SYSDATETIME()),
    (2, 6, 75, 0, NULL),
    (3, 9, 100, 1, SYSDATETIME()),
    (3, 10, 60, 0, NULL),
    (4, 13, 100, 1, SYSDATETIME()),
    (4, 14, 40, 0, NULL);

INSERT INTO Books_and_notes (Subject_ID, Course_ID, Lesson_ID, Material_Name, Material_Type, Author, File_Link)
VALUES
    (1, 1, 1, N'Конспект PDF: Производная', N'Конспект', N'Ярослав Смирнов', N'https://drive.google.com/file/d/1LaFegJ29E7PYwXq1QA4R6mCJtyK70mRo'),
    (1, 1, 2, N'Конспект PDF: Первообразная', N'Конспект', N'Ярослав Смирнов', N'https://drive.google.com/file/d/1ADdDBQ22c0DtLXORv-xzJ-yzzqP9R81I'),
    (2, 2, NULL, N'Шпаргалка по сочинению ЕГЭ', N'Шпаргалка', N'Ольга Кузнецова', N'https://drive.google.com/file/d/1xG46l0vexVAfSS2Ora-VIhnkta4W55VB');

INSERT INTO Homework_Templates (Subject_ID, Course_ID, Lesson_ID, Created_By_Teacher_ID, Homework_Name, Description, File_Link, Max_Score, For_Online_Course, For_Private_Lesson)
VALUES
    (1, 1, 1, 1, N'Домашка: Производная', N'Базовые и профильные задания на производную.', N'https://example.com/homework/math-derivative.pdf', 10, 1, 1),
    (1, 1, 2, 1, N'Домашка: Первообразная', N'Задания на таблицу интегралов и первообразные.', N'https://example.com/homework/math-integral.pdf', 10, 1, 1),
    (2, 2, NULL, 2, N'Вариант 12. Часть 1-2', N'Тренировочный вариант по русскому языку.', N'https://example.com/homework/russian-var-12.pdf', 10, 1, 0);

INSERT INTO Homework_Tasks (Homework_Template_ID, Task_Number, Task_Text, Answer_Text, Score)
VALUES
    (1, 1, N'Найдите производную функции y = x^3 - 5x.', N'3x^2 - 5', 10),
    (1, 2, N'Решите задачу на касательную к графику функции.', NULL, 20),
    (2, 1, N'Найдите первообразную функции f(x) = 2x.', N'x^2 + C', 10);

INSERT INTO Homework_Assignments (Homework_Template_ID, Student_ID, Course_Enrollment_ID, Assigned_By_Teacher_ID, Due_Date, Status)
VALUES
    (1, 1, 1, 1, DATEADD(day, 3, SYSDATETIME()), N'Checked'),
    (2, 1, 1, 1, DATEADD(day, 5, SYSDATETIME()), N'Assigned');

INSERT INTO Homework_Submissions (Homework_Assignment_ID, Student_Text, File_Link, Checked_By_Teacher_ID, Checked_At, Score, Feedback_Text, Status)
VALUES
    (1, N'Ссылка на сданную работу прикреплена.', N'https://example.com/submissions/ivan-homework-1.pdf', 1, SYSDATETIME(), 8, N'Хорошая работа, нужно аккуратнее оформлять вторую часть.', N'Checked');

INSERT INTO Private_Lesson_Orders (Subject_ID, Student_ID, Teacher_ID, Curator_ID, Price_Per_Lesson_Rub, Date_Start, Chat_Link, Status)
VALUES
    (1, 1, 1, 1, 2500, CAST(GETDATE() AS DATE), N'https://t.me/private_math_chat', N'Active');

INSERT INTO Private_Lessons (Private_Order_ID, Lesson_Number, Lesson_Title, Starts_At, Ends_At, Call_Link, Status)
VALUES
    (1, 1, N'Индивидуальный разбор производной', DATEADD(day, 2, SYSDATETIME()), DATEADD(hour, 1, DATEADD(day, 2, SYSDATETIME())), N'https://example.com/call/private-1', N'Planned');

INSERT INTO Homework_Assignments (Homework_Template_ID, Student_ID, Private_Lesson_ID, Assigned_By_Teacher_ID, Due_Date, Status)
VALUES
    (1, 1, 1, 1, DATEADD(day, 4, SYSDATETIME()), N'Assigned');

INSERT INTO Live_Streams (Course_ID, Lesson_ID, Stream_Title, Starts_At, Stream_Link, Status)
VALUES
    (1, 3, N'Разбор задач №13 (профиль)', DATEADD(hour, 5, SYSDATETIME()), N'https://meet.google.com/yar-math-001', N'Planned'),
    (2, 6, N'Сочинение: комментарий и позиция автора', DATEADD(day, 1, SYSDATETIME()), N'https://meet.google.com/yar-rus-001', N'Planned'),
    (3, 10, N'Python: циклы и условия', DATEADD(day, 2, SYSDATETIME()), N'https://meet.google.com/yar-it-001', N'Planned'),
    (4, 14, N'Законы Ньютона: задачи второй части', DATEADD(day, 3, SYSDATETIME()), N'https://meet.google.com/yar-phys-001', N'Planned');

INSERT INTO Payments (Student_ID, Course_Enrollment_ID, Amount_Rub, Payment_Method, Status)
VALUES
    (1, 1, 24900, N'Карта', N'Paid');

INSERT INTO Point_Transactions (Student_ID, Course_Enrollment_ID, Homework_Assignment_ID, Points, Reason)
VALUES
    (1, 1, 1, 240, N'Баллы за проверенную домашку по математике'),
    (1, 1, NULL, 1010, N'Стартовый баланс и активность на курсе');

INSERT INTO Point_Rewards (Reward_Name, Points_Price, Description)
VALUES
    (N'Скидка 500 рублей', 750, N'Можно применить к следующему месяцу или курсу'),
    (N'Дополнительный разбор ДЗ', 1000, N'Куратор передаст работу преподавателю на подробный разбор');

INSERT INTO Capybara_Shop_Items (Item_Code, Item_Name, Item_Type, Price_Points, Css_Class, Description)
VALUES
    (N'blue_scarf', N'Синий шарф', N'Шарф', 120, N'blue-scarf', N'Аккуратный шарф для спокойной учебной капибары.'),
    (N'green_hoodie', N'Зелёная худи', N'Кофта', 220, N'green-hoodie', N'Тёплая худи для вечерних разборов.'),
    (N'round_glasses', N'Круглые очки', N'Аксессуар', 160, N'round-glasses', N'Очки для режима "сейчас всё пойму".'),
    (N'gold_crown', N'Золотая корона', N'Корона', 350, N'gold-crown', N'Награда для короля домашек.');

INSERT INTO Chats (Student_ID, Teacher_ID, Curator_ID, Chat_Name)
VALUES
    (1, 1, 1, N'ЕГЭ Математика: Иван Петров'),
    (1, 2, 1, N'ЕГЭ Русский язык: Иван Петров'),
    (1, 3, 2, N'ЕГЭ Информатика: Иван Петров'),
    (1, 4, 3, N'ЕГЭ Физика: Иван Петров');

INSERT INTO Chat_Messages (Chat_ID, Sender_Role, Sender_Name, Message_Text)
VALUES
    (1, N'Curator', N'Анна Сергеевна', N'Иван, сегодня не забудь посмотреть запись по производной.'),
    (1, N'Student', N'Иван Петров', N'Хорошо, после школы сделаю домашку.'),
    (2, N'Teacher', N'Ольга Кузнецова', N'Посмотри конспект по паронимам перед следующим уроком.'),
    (3, N'Curator', N'Мария Орлова', N'В информатике на этой неделе тренируем логические выражения.'),
    (4, N'Curator', N'Иван Романов', N'По физике пришлю напоминание перед трансляцией.');

INSERT INTO Notifications (Student_ID, Title, Notification_Text, Notification_Type, Link)
VALUES
    (1, N'Новая трансляция', N'Сегодня в 17:00 разбор задач №13.', N'Live_Stream', N'#course-math'),
    (1, N'Домашка назначена', N'Открыта домашка по первообразной.', N'Homework', N'#course-math'),
    (1, N'Баллы начислены', N'За домашку начислено 240 баллов.', N'Points', N'#study');

--============================================================
-- 10. Быстрая проверка количества строк
--============================================================

SELECT N'Subjects' AS Table_Name, COUNT(*) AS Rows_Count FROM Subjects
UNION ALL SELECT N'Parents', COUNT(*) FROM Parents
UNION ALL SELECT N'Students', COUNT(*) FROM Students
UNION ALL SELECT N'Teachers', COUNT(*) FROM Teachers
UNION ALL SELECT N'Curators', COUNT(*) FROM Curators
UNION ALL SELECT N'Staff_Accounts', COUNT(*) FROM Staff_Accounts
UNION ALL SELECT N'Courses', COUNT(*) FROM Courses
UNION ALL SELECT N'Course_Enrollments', COUNT(*) FROM Course_Enrollments
UNION ALL SELECT N'Lessons', COUNT(*) FROM Lessons
UNION ALL SELECT N'Books_and_notes', COUNT(*) FROM Books_and_notes
UNION ALL SELECT N'Homework_Templates', COUNT(*) FROM Homework_Templates
UNION ALL SELECT N'Homework_Assignments', COUNT(*) FROM Homework_Assignments
UNION ALL SELECT N'Private_Lesson_Orders', COUNT(*) FROM Private_Lesson_Orders
UNION ALL SELECT N'Private_Lessons', COUNT(*) FROM Private_Lessons
UNION ALL SELECT N'Live_Streams', COUNT(*) FROM Live_Streams
UNION ALL SELECT N'Payments', COUNT(*) FROM Payments
UNION ALL SELECT N'Point_Transactions', COUNT(*) FROM Point_Transactions
UNION ALL SELECT N'Capybara_Shop_Items', COUNT(*) FROM Capybara_Shop_Items
UNION ALL SELECT N'Notifications', COUNT(*) FROM Notifications
UNION ALL SELECT N'Course_Applications', COUNT(*) FROM Course_Applications;
GO
