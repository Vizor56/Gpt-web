USE Yaroslav_Tutor_Online_School;
GO

IF COL_LENGTH(N'Homework_Assignments', N'Upload_Folder_Link') IS NULL
BEGIN
    ALTER TABLE Homework_Assignments ADD Upload_Folder_Link NVARCHAR(1000) NULL;
END;
GO

IF COL_LENGTH(N'Homework_Submissions', N'Feedback_Link') IS NULL
BEGIN
    ALTER TABLE Homework_Submissions ADD Feedback_Link NVARCHAR(1000) NULL;
END;
GO

DECLARE @DriveUploadFolder NVARCHAR(1000) = N'https://drive.google.com/drive/folders/1Sk6-01wk63BB65o575Wr7JuUf2yELcI-';

DELETE FROM Books_and_notes
WHERE File_Link LIKE N'https://example.com/files/%';
GO

DECLARE @CourseNotes TABLE
(
    Course_Slug NVARCHAR(50) NOT NULL,
    Lesson_Number INT NOT NULL,
    Material_Name NVARCHAR(200) NOT NULL,
    Material_Type NVARCHAR(50) NOT NULL,
    Author NVARCHAR(200) NOT NULL,
    File_Link NVARCHAR(1000) NOT NULL
);

INSERT INTO @CourseNotes
    (Course_Slug, Lesson_Number, Material_Name, Material_Type, Author, File_Link)
VALUES
    (N'math', 1, N'Конспект: Производная', N'Конспект', N'Ярослав Смирнов', N'https://drive.google.com/file/d/1LaFegJ29E7PYwXq1QA4R6mCJtyK70mRo'),
    (N'math', 2, N'Конспект: Первообразная', N'Конспект', N'Ярослав Смирнов', N'https://drive.google.com/file/d/1ADdDBQ22c0DtLXORv-xzJ-yzzqP9R81I'),
    (N'math', 3, N'Конспект: Задачи с параметром', N'Конспект', N'Ярослав Смирнов', N'https://drive.google.com/file/d/1VXR7RgKc0wSFlkqqpOB4MY2mqzo993Zm'),
    (N'math', 4, N'Материалы: Планиметрия', N'Файл', N'Ярослав Смирнов', N'https://drive.google.com/file/d/1yDKrMTfyM0PbZ3SC2RGo8hVtO-U8i9R1'),

    (N'russian', 1, N'Конспект: Орфоэпия и ударения', N'Конспект', N'Ольга Кузнецова', N'https://drive.google.com/file/d/1aaFkBsvU-IPPm_Z8mFluYvf9CvTfnAxw'),
    (N'russian', 2, N'Конспект: Паронимы', N'Конспект', N'Ольга Кузнецова', N'https://drive.google.com/file/d/1riOofik3Pg38MfSuvP38UEe-gzxGAZzg'),
    (N'russian', 3, N'Конспект: Сочинение ЕГЭ', N'Конспект', N'Ольга Кузнецова', N'https://drive.google.com/file/d/1xG46l0vexVAfSS2Ora-VIhnkta4W55VB'),
    (N'russian', 4, N'Материалы: Пунктуация в сложном предложении', N'Файл', N'Ольга Кузнецова', N'https://drive.google.com/file/d/1GQbihWtR5JhrzyvIN2OXPwJNpgYaZVq-'),

    (N'informatics', 1, N'Конспект: Кодирование информации', N'Конспект', N'Дмитрий Орлов', N'https://drive.google.com/file/d/14DJwCAEpiEqjPNsr6sDTTDMxBVI-X8j2'),
    (N'informatics', 2, N'Конспект: Логические выражения', N'Конспект', N'Дмитрий Орлов', N'https://drive.google.com/file/d/1OWMHfQNNgjC8z-FbY2s0ProsYWVMhWCD'),
    (N'informatics', 3, N'Конспект: Python: циклы и условия', N'Конспект', N'Дмитрий Орлов', N'https://drive.google.com/file/d/12VWLzqM_8VF3ak0xGbyNrwmjOWLEJgPy'),
    (N'informatics', 4, N'Материалы: Динамическое программирование', N'Файл', N'Дмитрий Орлов', N'https://drive.google.com/file/d/1eCsAogLgzZS_T39AZQNqXxeSXfBYFS3c'),

    (N'physics', 1, N'Конспект: Кинематика', N'Конспект', N'Алексей Волков', N'https://drive.google.com/file/d/1LaFegJ29E7PYwXq1QA4R6mCJtyK70mRo'),
    (N'physics', 2, N'Конспект: Законы Ньютона', N'Конспект', N'Алексей Волков', N'https://drive.google.com/file/d/1ADdDBQ22c0DtLXORv-xzJ-yzzqP9R81I'),
    (N'physics', 3, N'Конспект: Электростатика', N'Конспект', N'Алексей Волков', N'https://drive.google.com/file/d/1aaFkBsvU-IPPm_Z8mFluYvf9CvTfnAxw'),
    (N'physics', 4, N'Материалы: Оптика', N'Файл', N'Алексей Волков', N'https://drive.google.com/file/d/1VXR7RgKc0wSFlkqqpOB4MY2mqzo993Zm');

MERGE Books_and_notes AS target
USING
(
    SELECT
        S.Subject_ID,
        C.Course_ID,
        L.Lesson_ID,
        N.Material_Name,
        N.Material_Type,
        N.Author,
        N.File_Link
    FROM @CourseNotes AS N
    JOIN Courses AS C
        ON C.Course_Slug = N.Course_Slug
    JOIN Lessons AS L
        ON L.Course_ID = C.Course_ID
       AND L.Lesson_Number = N.Lesson_Number
    JOIN Subjects AS S
        ON S.Subject_ID = C.Subject_ID
) AS source
ON target.Lesson_ID = source.Lesson_ID
AND target.Material_Name = source.Material_Name
WHEN MATCHED THEN
    UPDATE SET
        Subject_ID = source.Subject_ID,
        Course_ID = source.Course_ID,
        Material_Type = source.Material_Type,
        Author = source.Author,
        File_Link = source.File_Link
WHEN NOT MATCHED THEN
    INSERT (Subject_ID, Course_ID, Lesson_ID, Material_Name, Material_Type, Author, File_Link)
    VALUES (source.Subject_ID, source.Course_ID, source.Lesson_ID, source.Material_Name, source.Material_Type, source.Author, source.File_Link);
GO

IF OBJECT_ID(N'tempdb..#HomeworkSeed') IS NOT NULL
BEGIN
    DROP TABLE #HomeworkSeed;
END;

DECLARE @DriveUploadFolder NVARCHAR(1000) = N'https://drive.google.com/drive/folders/1Sk6-01wk63BB65o575Wr7JuUf2yELcI-';

CREATE TABLE #HomeworkSeed
(
    Course_Slug NVARCHAR(50) NOT NULL,
    Lesson_Number INT NOT NULL,
    Homework_Name NVARCHAR(200) NOT NULL,
    Description NVARCHAR(1000) NOT NULL,
    Task_Link NVARCHAR(1000) NOT NULL,
    Upload_Folder_Link NVARCHAR(1000) NOT NULL,
    Assignment_Status NVARCHAR(30) NOT NULL,
    Submission_Link NVARCHAR(1000) NULL,
    Feedback_Link NVARCHAR(1000) NULL,
    Feedback_Text NVARCHAR(1000) NULL,
    Score INT NULL,
    Due_Days INT NOT NULL
);

INSERT INTO #HomeworkSeed
    (Course_Slug, Lesson_Number, Homework_Name, Description, Task_Link, Upload_Folder_Link, Assignment_Status, Submission_Link, Feedback_Link, Feedback_Text, Score, Due_Days)
VALUES
    (N'math', 1, N'ДЗ: Производная', N'Задания на производную, касательную и исследование функции.', N'https://drive.google.com/file/d/1LaFegJ29E7PYwXq1QA4R6mCJtyK70mRo', @DriveUploadFolder, N'Checked', N'https://drive.google.com/file/d/1t-o_WwgJSQILFXRXWk7w3KZz4uPU1Oew', N'https://drive.google.com/file/d/1ADdDBQ22c0DtLXORv-xzJ-yzzqP9R81I', N'Работа проверена: оформление хорошее, во второй части следи за знаками.', 86, -3),
    (N'math', 2, N'ДЗ: Первообразная', N'Интегралы, первообразные и площадь под графиком.', N'https://drive.google.com/file/d/1ADdDBQ22c0DtLXORv-xzJ-yzzqP9R81I', @DriveUploadFolder, N'Submitted', N'https://drive.google.com/file/d/1t-o_WwgJSQILFXRXWk7w3KZz4uPU1Oew', NULL, NULL, NULL, 2),
    (N'math', 3, N'ДЗ: Задачи с параметром', N'Параметры через графики, дискриминант и монотонность.', N'https://drive.google.com/file/d/1VXR7RgKc0wSFlkqqpOB4MY2mqzo993Zm', @DriveUploadFolder, N'Assigned', NULL, NULL, NULL, NULL, 5),
    (N'math', 4, N'ДЗ: Планиметрия', N'Треугольники, окружности и основные конфигурации.', N'https://drive.google.com/file/d/1yDKrMTfyM0PbZ3SC2RGo8hVtO-U8i9R1', @DriveUploadFolder, N'Assigned', NULL, NULL, NULL, NULL, 7),

    (N'russian', 1, N'ДЗ: Орфоэпия и ударения', N'Тренировка ударений по словнику и мини-тест.', N'https://drive.google.com/file/d/1aaFkBsvU-IPPm_Z8mFluYvf9CvTfnAxw', @DriveUploadFolder, N'Checked', N'https://drive.google.com/file/d/1t-o_WwgJSQILFXRXWk7w3KZz4uPU1Oew', N'https://drive.google.com/file/d/1riOofik3Pg38MfSuvP38UEe-gzxGAZzg', N'Проверено: ошибок мало, повтори слова из блока 3.', 92, -2),
    (N'russian', 2, N'ДЗ: Паронимы', N'Подбор паронимов и задания в формате ЕГЭ.', N'https://drive.google.com/file/d/1riOofik3Pg38MfSuvP38UEe-gzxGAZzg', @DriveUploadFolder, N'Submitted', N'https://drive.google.com/file/d/1t-o_WwgJSQILFXRXWk7w3KZz4uPU1Oew', NULL, NULL, NULL, 2),
    (N'russian', 3, N'ДЗ: Сочинение ЕГЭ', N'План, комментарий и полный текст сочинения.', N'https://drive.google.com/file/d/1xG46l0vexVAfSS2Ora-VIhnkta4W55VB', @DriveUploadFolder, N'Assigned', NULL, NULL, NULL, NULL, 5),
    (N'russian', 4, N'ДЗ: Пунктуация', N'Практика СПП, БСП и сложных случаев пунктуации.', N'https://drive.google.com/file/d/1GQbihWtR5JhrzyvIN2OXPwJNpgYaZVq-', @DriveUploadFolder, N'Assigned', NULL, NULL, NULL, NULL, 8),

    (N'informatics', 1, N'ДЗ: Кодирование информации', N'Задачи на объём сообщения и кодирование.', N'https://drive.google.com/file/d/14DJwCAEpiEqjPNsr6sDTTDMxBVI-X8j2', @DriveUploadFolder, N'Checked', N'https://drive.google.com/file/d/1t-o_WwgJSQILFXRXWk7w3KZz4uPU1Oew', N'https://drive.google.com/file/d/1OWMHfQNNgjC8z-FbY2s0ProsYWVMhWCD', N'Проверено: отлично решены задачи на объём, проверь перевод единиц.', 88, -2),
    (N'informatics', 2, N'ДЗ: Логические выражения', N'Таблицы истинности и преобразование логики.', N'https://drive.google.com/file/d/1OWMHfQNNgjC8z-FbY2s0ProsYWVMhWCD', @DriveUploadFolder, N'Submitted', N'https://drive.google.com/file/d/1t-o_WwgJSQILFXRXWk7w3KZz4uPU1Oew', NULL, NULL, NULL, 2),
    (N'informatics', 3, N'ДЗ: Python: циклы и условия', N'Короткие программы и разбор типовых ошибок.', N'https://drive.google.com/file/d/12VWLzqM_8VF3ak0xGbyNrwmjOWLEJgPy', @DriveUploadFolder, N'Assigned', NULL, NULL, NULL, NULL, 5),
    (N'informatics', 4, N'ДЗ: Динамическое программирование', N'Первые задачи на состояния и переходы.', N'https://drive.google.com/file/d/1eCsAogLgzZS_T39AZQNqXxeSXfBYFS3c', @DriveUploadFolder, N'Assigned', NULL, NULL, NULL, NULL, 8),

    (N'physics', 1, N'ДЗ: Кинематика', N'Графики движения, скорость и ускорение.', N'https://drive.google.com/file/d/1LaFegJ29E7PYwXq1QA4R6mCJtyK70mRo', @DriveUploadFolder, N'Checked', N'https://drive.google.com/file/d/1t-o_WwgJSQILFXRXWk7w3KZz4uPU1Oew', N'https://drive.google.com/file/d/1ADdDBQ22c0DtLXORv-xzJ-yzzqP9R81I', N'Проверено: ход решения верный, допиши единицы измерения.', 84, -2),
    (N'physics', 2, N'ДЗ: Законы Ньютона', N'Силы, второй закон Ньютона и движение по окружности.', N'https://drive.google.com/file/d/1ADdDBQ22c0DtLXORv-xzJ-yzzqP9R81I', @DriveUploadFolder, N'Submitted', N'https://drive.google.com/file/d/1t-o_WwgJSQILFXRXWk7w3KZz4uPU1Oew', NULL, NULL, NULL, 2),
    (N'physics', 3, N'ДЗ: Электростатика', N'Закон Кулона, поле и потенциал.', N'https://drive.google.com/file/d/1aaFkBsvU-IPPm_Z8mFluYvf9CvTfnAxw', @DriveUploadFolder, N'Assigned', NULL, NULL, NULL, NULL, 5),
    (N'physics', 4, N'ДЗ: Оптика', N'Линзы, зеркала и построение изображений.', N'https://drive.google.com/file/d/1VXR7RgKc0wSFlkqqpOB4MY2mqzo993Zm', @DriveUploadFolder, N'Assigned', NULL, NULL, NULL, NULL, 8);

MERGE Homework_Templates AS target
USING
(
    SELECT
        C.Subject_ID,
        C.Course_ID,
        L.Lesson_ID,
        C.Teacher_ID,
        H.Homework_Name,
        H.Description,
        H.Task_Link
    FROM #HomeworkSeed AS H
    JOIN Courses AS C
        ON C.Course_Slug = H.Course_Slug
    JOIN Lessons AS L
        ON L.Course_ID = C.Course_ID
       AND L.Lesson_Number = H.Lesson_Number
) AS source
ON target.Course_ID = source.Course_ID
AND target.Lesson_ID = source.Lesson_ID
AND target.For_Online_Course = 1
WHEN MATCHED THEN
    UPDATE SET
        Subject_ID = source.Subject_ID,
        Created_By_Teacher_ID = source.Teacher_ID,
        Homework_Name = source.Homework_Name,
        Description = source.Description,
        File_Link = source.Task_Link,
        Max_Score = 100,
        For_Online_Course = 1,
        Is_Active = 1
WHEN NOT MATCHED THEN
    INSERT
        (Subject_ID, Course_ID, Lesson_ID, Created_By_Teacher_ID, Homework_Name, Description, File_Link, Max_Score, For_Online_Course, For_Private_Lesson, Is_Active)
    VALUES
        (source.Subject_ID, source.Course_ID, source.Lesson_ID, source.Teacher_ID, source.Homework_Name, source.Description, source.Task_Link, 100, 1, 1, 1);
GO

DECLARE @Student_ID INT = 1;

MERGE Homework_Assignments AS target
USING
(
    SELECT
        HT.Homework_Template_ID,
        CE.Student_ID,
        CE.Course_Enrollment_ID,
        C.Teacher_ID,
        DATEADD(day, H.Due_Days, SYSDATETIME()) AS Due_Date,
        H.Assignment_Status,
        H.Upload_Folder_Link
    FROM #HomeworkSeed AS H
    JOIN Courses AS C
        ON C.Course_Slug = H.Course_Slug
    JOIN Lessons AS L
        ON L.Course_ID = C.Course_ID
       AND L.Lesson_Number = H.Lesson_Number
    JOIN Homework_Templates AS HT
        ON HT.Course_ID = C.Course_ID
       AND HT.Lesson_ID = L.Lesson_ID
       AND HT.For_Online_Course = 1
    JOIN Course_Enrollments AS CE
        ON CE.Course_ID = C.Course_ID
       AND CE.Student_ID = @Student_ID
) AS source
ON target.Homework_Template_ID = source.Homework_Template_ID
AND target.Student_ID = source.Student_ID
AND target.Course_Enrollment_ID = source.Course_Enrollment_ID
WHEN MATCHED THEN
    UPDATE SET
        Assigned_By_Teacher_ID = source.Teacher_ID,
        Due_Date = source.Due_Date,
        Status = source.Assignment_Status,
        Upload_Folder_Link = source.Upload_Folder_Link
WHEN NOT MATCHED THEN
    INSERT
        (Homework_Template_ID, Student_ID, Course_Enrollment_ID, Assigned_By_Teacher_ID, Due_Date, Status, Upload_Folder_Link)
    VALUES
        (source.Homework_Template_ID, source.Student_ID, source.Course_Enrollment_ID, source.Teacher_ID, source.Due_Date, source.Assignment_Status, source.Upload_Folder_Link);
GO

MERGE Homework_Submissions AS target
USING
(
    SELECT
        HA.Homework_Assignment_ID,
        H.Submission_Link,
        H.Feedback_Link,
        H.Feedback_Text,
        H.Score,
        CASE WHEN H.Assignment_Status = N'Checked' THEN N'Checked' ELSE N'Submitted' END AS Submission_Status,
        CASE WHEN H.Assignment_Status = N'Checked' THEN SYSDATETIME() ELSE NULL END AS Checked_At,
        CASE WHEN H.Assignment_Status = N'Checked' THEN C.Teacher_ID ELSE NULL END AS Checked_By_Teacher_ID
    FROM #HomeworkSeed AS H
    JOIN Courses AS C
        ON C.Course_Slug = H.Course_Slug
    JOIN Lessons AS L
        ON L.Course_ID = C.Course_ID
       AND L.Lesson_Number = H.Lesson_Number
    JOIN Homework_Templates AS HT
        ON HT.Course_ID = C.Course_ID
       AND HT.Lesson_ID = L.Lesson_ID
       AND HT.For_Online_Course = 1
    JOIN Homework_Assignments AS HA
        ON HA.Homework_Template_ID = HT.Homework_Template_ID
       AND HA.Student_ID = 1
       AND HA.Course_Enrollment_ID IS NOT NULL
    WHERE H.Assignment_Status IN (N'Submitted', N'Checked')
) AS source
ON target.Homework_Assignment_ID = source.Homework_Assignment_ID
WHEN MATCHED THEN
    UPDATE SET
        File_Link = source.Submission_Link,
        Feedback_Link = source.Feedback_Link,
        Feedback_Text = source.Feedback_Text,
        Score = source.Score,
        Checked_At = source.Checked_At,
        Checked_By_Teacher_ID = source.Checked_By_Teacher_ID,
        Status = source.Submission_Status
WHEN NOT MATCHED THEN
    INSERT
        (Homework_Assignment_ID, Student_Text, File_Link, Checked_By_Teacher_ID, Checked_At, Score, Feedback_Text, Feedback_Link, Status)
    VALUES
        (source.Homework_Assignment_ID, N'Ссылка на сданную работу прикреплена.', source.Submission_Link, source.Checked_By_Teacher_ID, source.Checked_At, source.Score, source.Feedback_Text, source.Feedback_Link, source.Submission_Status);
GO

SELECT N'Books_and_notes' AS Table_Name, COUNT(*) AS Rows_Count FROM Books_and_notes
UNION ALL SELECT N'Homework_Templates', COUNT(*) FROM Homework_Templates
UNION ALL SELECT N'Homework_Assignments', COUNT(*) FROM Homework_Assignments
UNION ALL SELECT N'Homework_Submissions', COUNT(*) FROM Homework_Submissions;
GO
