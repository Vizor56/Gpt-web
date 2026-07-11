USE Yaroslav_Tutor_Online_School;
GO

IF COL_LENGTH(N'Courses', N'Course_Slug') IS NULL
BEGIN
    ALTER TABLE Courses ADD Course_Slug NVARCHAR(50) NULL;
END;
GO

UPDATE Courses
SET Course_Slug =
    CASE Course_Name
        WHEN N'ЕГЭ Математика' THEN N'math'
        WHEN N'ЕГЭ Русский язык' THEN N'russian'
        WHEN N'ЕГЭ Информатика' THEN N'informatics'
        WHEN N'ЕГЭ Физика' THEN N'physics'
        ELSE LOWER(REPLACE(REPLACE(Course_Name, N' ', N'-'), N'ЕГЭ-', N''))
    END
WHERE Course_Slug IS NULL OR LTRIM(RTRIM(Course_Slug)) = N'';
GO

IF EXISTS
(
    SELECT 1
    FROM sys.columns
    WHERE object_id = OBJECT_ID(N'Courses')
      AND name = N'Course_Slug'
      AND is_nullable = 1
)
BEGIN
    ALTER TABLE Courses ALTER COLUMN Course_Slug NVARCHAR(50) NOT NULL;
END;
GO

IF NOT EXISTS
(
    SELECT 1
    FROM sys.key_constraints
    WHERE name = N'UQ_Courses_Slug'
      AND parent_object_id = OBJECT_ID(N'Courses')
)
BEGIN
    ALTER TABLE Courses ADD CONSTRAINT UQ_Courses_Slug UNIQUE (Course_Slug);
END;
GO

IF COL_LENGTH(N'Lessons', N'Notes_Link') IS NULL
BEGIN
    ALTER TABLE Lessons ADD Notes_Link NVARCHAR(1000) NULL;
END;
GO

IF COL_LENGTH(N'Lessons', N'Homework_Link') IS NULL
BEGIN
    ALTER TABLE Lessons ADD Homework_Link NVARCHAR(1000) NULL;
END;
GO

IF COL_LENGTH(N'Lessons', N'Lesson_Status') IS NULL
BEGIN
    ALTER TABLE Lessons
    ADD Lesson_Status NVARCHAR(30) NOT NULL
        CONSTRAINT DF_Lessons_Lesson_Status DEFAULT N'Open';
END;
GO

IF NOT EXISTS
(
    SELECT 1
    FROM sys.check_constraints
    WHERE name = N'CHK_Lessons_Status'
      AND parent_object_id = OBJECT_ID(N'Lessons')
)
BEGIN
    ALTER TABLE Lessons
    ADD CONSTRAINT CHK_Lessons_Status
    CHECK (Lesson_Status IN (N'Done', N'Homework_Check', N'Open', N'Announcement', N'Soon'));
END;
GO

IF OBJECT_ID(N'Course_Applications', N'U') IS NULL
BEGIN
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
END;
GO

IF NOT EXISTS
(
    SELECT 1
    FROM sys.indexes
    WHERE name = N'IX_Course_Applications_Status'
      AND object_id = OBJECT_ID(N'Course_Applications')
)
BEGIN
    CREATE INDEX IX_Course_Applications_Status ON Course_Applications(Status, Created_At);
END;
GO

UPDATE Courses
SET
    Short_Description = CASE Course_Slug
        WHEN N'math' THEN N'Профильная математика: теория, записи, конспекты и домашки.'
        WHEN N'russian' THEN N'Тестовая часть, сочинение, теория и практика.'
        WHEN N'informatics' THEN N'Алгоритмы, программирование и разбор задач ЕГЭ.'
        WHEN N'physics' THEN N'Механика, электричество, оптика и задачи второй части.'
        ELSE Short_Description
    END,
    Total_Lessons = 24
WHERE Course_Slug IN (N'math', N'russian', N'informatics', N'physics');
GO

DECLARE @Lessons TABLE
(
    Course_Slug NVARCHAR(50) NOT NULL,
    Lesson_Number INT NOT NULL,
    Lesson_Title NVARCHAR(200) NOT NULL,
    Topic NVARCHAR(500) NULL,
    Video_Link NVARCHAR(1000) NULL,
    Notes_Link NVARCHAR(1000) NULL,
    Homework_Link NVARCHAR(1000) NULL,
    Duration_Minutes INT NULL,
    Is_Open BIT NOT NULL,
    Lesson_Status NVARCHAR(30) NOT NULL
);

INSERT INTO @Lessons
    (Course_Slug, Lesson_Number, Lesson_Title, Topic, Video_Link, Notes_Link, Homework_Link, Duration_Minutes, Is_Open, Lesson_Status)
VALUES
    (N'math', 1, N'Производная', N'Понятие производной, правила дифференцирования', N'https://www.youtube.com/watch?v=M6K6SbXO44Q', N'https://drive.google.com/file/d/1LaFegJ29E7PYwXq1QA4R6mCJtyK70mRo', N'https://example.com/homework/math-derivative.pdf', 85, 1, N'Done'),
    (N'math', 2, N'Первообразная', N'Неопределенный интеграл, таблица интегралов', N'https://www.youtube.com/watch?v=N98OuNVG5pY', N'https://drive.google.com/file/d/1ADdDBQ22c0DtLXORv-xzJ-yzzqP9R81I', N'https://example.com/homework/math-integral.pdf', 90, 1, N'Homework_Check'),
    (N'math', 3, N'Задачи с параметром', N'Основные методы решения задач с параметром', N'https://www.youtube.com/watch?v=4r_IcBBMmj8', N'https://drive.google.com/file/d/1VXR7RgKc0wSFlkqqpOB4MY2mqzo993Zm', N'https://example.com/homework/math-parameters.pdf', 95, 1, N'Open'),
    (N'math', 4, N'Планиметрия', N'Треугольники, четырехугольники, окружности', N'https://www.youtube.com/watch?v=axMFeOWP6x8', N'https://drive.google.com/file/d/1yDKrMTfyM0PbZ3SC2RGo8hVtO-U8i9R1', NULL, 240, 1, N'Open'),

    (N'russian', 1, N'Орфоэпия и ударения', N'Словник ФИПИ, типичные ловушки задания 4', N'https://www.youtube.com/results?search_query=ЕГЭ+русский+орфоэпия+урок', N'https://drive.google.com/file/d/1aaFkBsvU-IPPm_Z8mFluYvf9CvTfnAxw', N'https://example.com/homework/russian-orthoepy.pdf', 70, 1, N'Done'),
    (N'russian', 2, N'Паронимы', N'Различение значений и работа со словарём паронимов', N'https://www.youtube.com/results?search_query=ЕГЭ+русский+паронимы+урок', N'https://drive.google.com/file/d/1riOofik3Pg38MfSuvP38UEe-gzxGAZzg', N'https://example.com/homework/russian-paronyms.pdf', 75, 1, N'Homework_Check'),
    (N'russian', 3, N'Сочинение ЕГЭ', N'Проблема, комментарий, позиция автора и аргументация', N'https://www.youtube.com/results?search_query=ЕГЭ+русский+сочинение+урок', N'https://drive.google.com/file/d/1xG46l0vexVAfSS2Ora-VIhnkta4W55VB', N'https://example.com/homework/russian-essay.pdf', 95, 1, N'Open'),
    (N'russian', 4, N'Пунктуация в сложном предложении', N'СПП, БСП и сложные случаи постановки знаков', NULL, N'https://drive.google.com/file/d/1GQbihWtR5JhrzyvIN2OXPwJNpgYaZVq-', NULL, 90, 0, N'Announcement'),

    (N'informatics', 1, N'Кодирование информации', N'Алфавитный подход, объём сообщения, единицы измерения', N'https://www.youtube.com/results?search_query=ЕГЭ+информатика+кодирование+информации', N'https://drive.google.com/file/d/14DJwCAEpiEqjPNsr6sDTTDMxBVI-X8j2', N'https://example.com/homework/it-coding.pdf', 80, 1, N'Done'),
    (N'informatics', 2, N'Логические выражения', N'Таблицы истинности и преобразование логических выражений', N'https://www.youtube.com/results?search_query=ЕГЭ+информатика+логика+урок', N'https://drive.google.com/file/d/1OWMHfQNNgjC8z-FbY2s0ProsYWVMhWCD', N'https://example.com/homework/it-logic.pdf', 85, 1, N'Homework_Check'),
    (N'informatics', 3, N'Python: циклы и условия', N'Базовые конструкции для задач ЕГЭ', N'https://www.youtube.com/results?search_query=ЕГЭ+информатика+Python+циклы+условия', N'https://drive.google.com/file/d/12VWLzqM_8VF3ak0xGbyNrwmjOWLEJgPy', N'https://example.com/homework/it-python.pdf', 95, 1, N'Open'),
    (N'informatics', 4, N'Динамическое программирование', N'Разбор идеи и первые задачи', NULL, N'https://drive.google.com/file/d/1eCsAogLgzZS_T39AZQNqXxeSXfBYFS3c', NULL, 90, 0, N'Announcement'),

    (N'physics', 1, N'Кинематика', N'Равномерное и равноускоренное движение', N'https://www.youtube.com/results?search_query=ЕГЭ+физика+кинематика+урок', N'https://drive.google.com/file/d/1LaFegJ29E7PYwXq1QA4R6mCJtyK70mRo', N'https://example.com/homework/physics-kinematics.pdf', 80, 1, N'Done'),
    (N'physics', 2, N'Законы Ньютона', N'Силы, ускорение, движение по окружности', N'https://www.youtube.com/results?search_query=ЕГЭ+физика+законы+Ньютона+урок', N'https://drive.google.com/file/d/1ADdDBQ22c0DtLXORv-xzJ-yzzqP9R81I', N'https://example.com/homework/physics-newton.pdf', 90, 1, N'Homework_Check'),
    (N'physics', 3, N'Электростатика', N'Закон Кулона, напряжённость, потенциал', N'https://www.youtube.com/results?search_query=ЕГЭ+физика+электростатика+урок', N'https://drive.google.com/file/d/1aaFkBsvU-IPPm_Z8mFluYvf9CvTfnAxw', N'https://example.com/homework/physics-electrostatics.pdf', 95, 1, N'Open'),
    (N'physics', 4, N'Оптика', N'Линзы, зеркала и ход лучей', NULL, N'https://drive.google.com/file/d/1VXR7RgKc0wSFlkqqpOB4MY2mqzo993Zm', NULL, 85, 0, N'Announcement');

MERGE Lessons AS target
USING
(
    SELECT
        C.Course_ID,
        L.Lesson_Number,
        L.Lesson_Title,
        L.Topic,
        L.Video_Link,
        L.Notes_Link,
        L.Homework_Link,
        L.Duration_Minutes,
        L.Is_Open,
        L.Lesson_Status
    FROM @Lessons AS L
    JOIN Courses AS C
        ON C.Course_Slug = L.Course_Slug
) AS source
ON target.Course_ID = source.Course_ID
AND target.Lesson_Number = source.Lesson_Number
WHEN MATCHED THEN
    UPDATE SET
        Lesson_Title = source.Lesson_Title,
        Topic = source.Topic,
        Video_Link = source.Video_Link,
        Notes_Link = source.Notes_Link,
        Homework_Link = source.Homework_Link,
        Duration_Minutes = source.Duration_Minutes,
        Is_Open = source.Is_Open,
        Lesson_Status = source.Lesson_Status
WHEN NOT MATCHED THEN
    INSERT
        (Course_ID, Lesson_Number, Lesson_Title, Topic, Video_Link, Notes_Link, Homework_Link, Duration_Minutes, Is_Open, Lesson_Status)
    VALUES
        (source.Course_ID, source.Lesson_Number, source.Lesson_Title, source.Topic, source.Video_Link, source.Notes_Link, source.Homework_Link, source.Duration_Minutes, source.Is_Open, source.Lesson_Status);
GO

SELECT
    N'Courses' AS Table_Name,
    COUNT(*) AS Rows_Count
FROM Courses
UNION ALL SELECT N'Lessons', COUNT(*) FROM Lessons
UNION ALL SELECT N'Course_Applications', COUNT(*) FROM Course_Applications;
GO
