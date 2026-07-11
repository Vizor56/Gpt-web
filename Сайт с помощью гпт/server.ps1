param
(
    [int]$Port = 8765,
    [string]$Root = $PSScriptRoot
)

$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Web
Add-Type -AssemblyName System.Data

$RootFullPath = [System.IO.Path]::GetFullPath($Root)
$ConfigPath = Join-Path $RootFullPath "database\db-config.json"
$SeedPath = Join-Path $RootFullPath "database\lesson-records.seed.json"
$HomeworkUploadRoot = Join-Path $RootFullPath "uploads\homework"
$HomeworkLinksPath = Join-Path $RootFullPath "uploads\homework-links.json"
$SupportRequestsPath = Join-Path $RootFullPath "uploads\support-requests.json"

function ConvertTo-JsonBytes
{
    param($Value)

    $json = $Value | ConvertTo-Json -Depth 20
    return [System.Text.Encoding]::UTF8.GetBytes($json)
}

function Write-Response
{
    param
    (
        [System.Net.HttpListenerContext]$Context,
        [int]$StatusCode,
        [byte[]]$Bytes,
        [string]$ContentType
    )

    try
    {
        $Context.Response.StatusCode = $StatusCode
        $Context.Response.ContentType = $ContentType
        $Context.Response.Headers["Access-Control-Allow-Origin"] = "*"
        $Context.Response.Headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        $Context.Response.Headers["Access-Control-Allow-Headers"] = "Content-Type, X-Student-Id, X-Auth-Token, X-Staff-Id, X-Staff-Role, X-Staff-Auth-Token"
        $Context.Response.Headers["Access-Control-Max-Age"] = "86400"
        $Context.Response.ContentLength64 = $Bytes.Length
        $Context.Response.OutputStream.Write($Bytes, 0, $Bytes.Length)
    }
    finally
    {
        try
        {
            $Context.Response.OutputStream.Close()
        }
        catch
        {
        }
    }
}

function Write-Json
{
    param
    (
        [System.Net.HttpListenerContext]$Context,
        [int]$StatusCode,
        $Value
    )

    Write-Response -Context $Context -StatusCode $StatusCode -Bytes (ConvertTo-JsonBytes $Value) -ContentType "application/json; charset=utf-8"
}

function Get-MimeType
{
    param([string]$Path)

    switch ([System.IO.Path]::GetExtension($Path).ToLowerInvariant())
    {
        ".html" { "text/html; charset=utf-8" }
        ".css"  { "text/css; charset=utf-8" }
        ".js"   { "text/javascript; charset=utf-8" }
        ".json" { "application/json; charset=utf-8" }
        ".svg"  { "image/svg+xml" }
        ".png"  { "image/png" }
        ".ico"  { "image/x-icon" }
        ".jpg"  { "image/jpeg" }
        ".jpeg" { "image/jpeg" }
        ".pdf"  { "application/pdf" }
        ".doc"  { "application/msword" }
        ".docx" { "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }
        ".xls"  { "application/vnd.ms-excel" }
        ".xlsx" { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
        ".txt"  { "text/plain; charset=utf-8" }
        default { "application/octet-stream" }
    }
}

function Get-ConnectionString
{
    if ($env:YTUTOR_CONNECTION_STRING)
    {
        return $env:YTUTOR_CONNECTION_STRING
    }

    if (Test-Path $ConfigPath)
    {
        $config = Get-Content -Raw -Encoding UTF8 -Path $ConfigPath | ConvertFrom-Json
        return [string]$config.connectionString
    }

    return ""
}

function Get-DbValue
{
    param
    (
        [System.Data.DataRow]$Row,
        [string]$ColumnName
    )

    if ([System.DBNull]::Value.Equals($Row[$ColumnName]))
    {
        return $null
    }

    return $Row[$ColumnName]
}

function Get-DbDateText
{
    param
    (
        [System.Data.DataRow]$Row,
        [string]$ColumnName
    )

    $value = Get-DbValue -Row $Row -ColumnName $ColumnName

    if ($null -eq $value)
    {
        return $null
    }

    return ([datetime]$value).ToString("s")
}

function Read-RequestJson
{
    param([System.Net.HttpListenerRequest]$Request)

    $reader = New-Object System.IO.StreamReader($Request.InputStream, [System.Text.Encoding]::UTF8)

    try
    {
        $body = $reader.ReadToEnd()
    }
    finally
    {
        $reader.Close()
    }

    if ([string]::IsNullOrWhiteSpace($body))
    {
        return $null
    }

    return $body | ConvertFrom-Json
}

function Normalize-HomeworkLink
{
    param([string]$Value)

    if ([string]::IsNullOrWhiteSpace($Value))
    {
        return ""
    }

    $trimmed = $Value.Trim()

    if ($trimmed -match "^http://")
    {
        return "https://$($trimmed.Substring(7))"
    }

    if ($trimmed -notmatch "^[a-zA-Z][a-zA-Z0-9+.-]*://")
    {
        return "https://$trimmed"
    }

    return $trimmed
}

function Test-GoogleHomeworkLink
{
    param([string]$Value)

    $normalized = Normalize-HomeworkLink -Value $Value

    if ([string]::IsNullOrWhiteSpace($normalized))
    {
        return $false
    }

    $uri = $null

    if (-not [System.Uri]::TryCreate($normalized, [System.UriKind]::Absolute, [ref]$uri))
    {
        return $false
    }

    if ($uri.Scheme -ne "https")
    {
        return $false
    }

    $uriHost = $uri.Host.ToLowerInvariant()
    return ($uriHost -eq "google.com" -or $uriHost.EndsWith(".google.com"))
}

function Set-ObjectProperty
{
    param
    (
        $Object,
        [string]$Name,
        $Value
    )

    if ($Object.PSObject.Properties[$Name])
    {
        $Object.$Name = $Value
    }
    else
    {
        $Object | Add-Member -NotePropertyName $Name -NotePropertyValue $Value
    }
}

function Read-HomeworkLinkFallback
{
    if (-not (Test-Path $HomeworkLinksPath -PathType Leaf))
    {
        return @()
    }

    $items = Get-Content -Raw -Encoding UTF8 -Path $HomeworkLinksPath | ConvertFrom-Json

    if ($null -eq $items)
    {
        return @()
    }

    return @($items)
}

function Write-HomeworkLinkFallback
{
    param($Items)

    $folder = Split-Path -Parent $HomeworkLinksPath

    if (-not (Test-Path $folder -PathType Container))
    {
        [void](New-Item -ItemType Directory -Path $folder -Force)
    }

    $Items | ConvertTo-Json -Depth 10 | Set-Content -Path $HomeworkLinksPath -Encoding UTF8
}

function Save-HomeworkSubmissionToFallback
{
    param
    (
        [int]$AssignmentId,
        [int]$StudentId = 1,
        [string]$HomeworkLink
    )

    $HomeworkLink = Normalize-HomeworkLink -Value $HomeworkLink

    if (-not (Test-GoogleHomeworkLink -Value $HomeworkLink))
    {
        throw "A Google Drive homework link is required."
    }

    $submittedAt = (Get-Date).ToString("s")
    $items = @()
    $updated = $false

    foreach ($item in Read-HomeworkLinkFallback)
    {
        if ([int]$item.homeworkAssignmentId -eq $AssignmentId)
        {
            $submissionId = $AssignmentId

            if ($item.homeworkSubmissionId)
            {
                $submissionId = [int]$item.homeworkSubmissionId
            }

            $items += [ordered]@{
                homeworkAssignmentId = $AssignmentId
                homeworkStatus = "Submitted"
                homeworkSubmissionId = $submissionId
                submittedHomeworkUrl = $HomeworkLink.Trim()
                submissionStatus = "Submitted"
                submittedAt = $submittedAt
            }
            $updated = $true
        }
        else
        {
            $items += $item
        }
    }

    if (-not $updated)
    {
        $items += [ordered]@{
            homeworkAssignmentId = $AssignmentId
            homeworkStatus = "Submitted"
            homeworkSubmissionId = $AssignmentId
            submittedHomeworkUrl = $HomeworkLink.Trim()
            submissionStatus = "Submitted"
            submittedAt = $submittedAt
        }
    }

    Write-HomeworkLinkFallback -Items $items

    return [ordered]@{
        source = "local"
        homeworkAssignmentId = $AssignmentId
        homeworkStatus = "Submitted"
        homeworkSubmissionId = $AssignmentId
        submittedHomeworkUrl = $HomeworkLink.Trim()
        submissionStatus = "Submitted"
        submittedAt = $submittedAt
    }
}

function Apply-HomeworkLinkFallback
{
    param($Lessons)

    $links = Read-HomeworkLinkFallback

    if ($links.Count -eq 0)
    {
        return $Lessons
    }

    foreach ($lesson in @($Lessons))
    {
        if (-not $lesson.homeworkAssignmentId)
        {
            continue
        }

        $submission = $links | Where-Object { [int]$_.homeworkAssignmentId -eq [int]$lesson.homeworkAssignmentId } | Select-Object -First 1

        if ($submission)
        {
            Set-ObjectProperty -Object $lesson -Name "homeworkStatus" -Value "Submitted"
            Set-ObjectProperty -Object $lesson -Name "homeworkSubmissionId" -Value $submission.homeworkSubmissionId
            Set-ObjectProperty -Object $lesson -Name "submittedHomeworkUrl" -Value $submission.submittedHomeworkUrl
            Set-ObjectProperty -Object $lesson -Name "submissionStatus" -Value "Submitted"
            Set-ObjectProperty -Object $lesson -Name "homeworkScore" -Value $null
            Set-ObjectProperty -Object $lesson -Name "checkedAt" -Value $null
        }
    }

    return $Lessons
}

function Read-RequestBytes
{
    param([System.Net.HttpListenerRequest]$Request)

    $memory = New-Object System.IO.MemoryStream

    try
    {
        $Request.InputStream.CopyTo($memory)
        return $memory.ToArray()
    }
    finally
    {
        $memory.Close()
    }
}

function Find-ByteSequence
{
    param
    (
        [byte[]]$Bytes,
        [byte[]]$Pattern,
        [int]$StartIndex = 0
    )

    if ($null -eq $Bytes -or $null -eq $Pattern -or $Pattern.Length -eq 0 -or $Bytes.Length -lt $Pattern.Length)
    {
        return -1
    }

    $lastStart = $Bytes.Length - $Pattern.Length
    $start = [Math]::Max(0, $StartIndex)

    for ($index = $start; $index -le $lastStart; $index++)
    {
        $matched = $true

        for ($patternIndex = 0; $patternIndex -lt $Pattern.Length; $patternIndex++)
        {
            if ($Bytes[$index + $patternIndex] -ne $Pattern[$patternIndex])
            {
                $matched = $false
                break
            }
        }

        if ($matched)
        {
            return $index
        }
    }

    return -1
}

function Get-SafeUploadFileName
{
    param([string]$FileName)

    $baseName = [System.IO.Path]::GetFileName($FileName)

    if ([string]::IsNullOrWhiteSpace($baseName))
    {
        $baseName = "homework-file.bin"
    }

    $safeName = [regex]::Replace($baseName, "[^a-zA-Z0-9._-]+", "_").Trim("_")

    if ([string]::IsNullOrWhiteSpace($safeName))
    {
        $safeName = "homework-file.bin"
    }

    return $safeName
}

function Read-MultipartFile
{
    param([System.Net.HttpListenerRequest]$Request)

    if ([string]::IsNullOrWhiteSpace($Request.ContentType) -or $Request.ContentType -notmatch "boundary=(.+)$")
    {
        throw "Multipart boundary was not found."
    }

    $boundary = $Matches[1].Trim().Trim('"')
    $bodyBytes = Read-RequestBytes -Request $Request

    if ($bodyBytes.Length -eq 0)
    {
        throw "Request body is empty."
    }

    if ($bodyBytes.Length -gt 26214400)
    {
        throw "File is too large."
    }

    $boundaryBytes = [System.Text.Encoding]::ASCII.GetBytes("--$boundary")
    $headerEndBytes = [byte[]](13, 10, 13, 10)
    $partStart = Find-ByteSequence -Bytes $bodyBytes -Pattern $boundaryBytes -StartIndex 0

    while ($partStart -ge 0)
    {
        $headersStart = $partStart + $boundaryBytes.Length

        if ($headersStart + 1 -lt $bodyBytes.Length -and $bodyBytes[$headersStart] -eq 45 -and $bodyBytes[$headersStart + 1] -eq 45)
        {
            break
        }

        if ($headersStart + 1 -lt $bodyBytes.Length -and $bodyBytes[$headersStart] -eq 13 -and $bodyBytes[$headersStart + 1] -eq 10)
        {
            $headersStart += 2
        }

        $headersEnd = Find-ByteSequence -Bytes $bodyBytes -Pattern $headerEndBytes -StartIndex $headersStart

        if ($headersEnd -lt 0)
        {
            break
        }

        $headersLength = $headersEnd - $headersStart
        $headersText = [System.Text.Encoding]::UTF8.GetString($bodyBytes, $headersStart, $headersLength)
        $contentStart = $headersEnd + $headerEndBytes.Length
        $nextBoundary = Find-ByteSequence -Bytes $bodyBytes -Pattern $boundaryBytes -StartIndex $contentStart

        if ($nextBoundary -lt 0)
        {
            break
        }

        $contentEnd = $nextBoundary

        if ($contentEnd -ge 2 -and $bodyBytes[$contentEnd - 2] -eq 13 -and $bodyBytes[$contentEnd - 1] -eq 10)
        {
            $contentEnd -= 2
        }

        if ($headersText -match 'name="file"' -and $headersText -match 'filename="([^"]*)"')
        {
            $fileName = Get-SafeUploadFileName -FileName ([System.Web.HttpUtility]::UrlDecode($Matches[1]))
            $contentLength = $contentEnd - $contentStart

            if ($contentLength -le 0)
            {
                throw "Uploaded file is empty."
            }

            $fileBytes = New-Object byte[] $contentLength
            [System.Array]::Copy($bodyBytes, $contentStart, $fileBytes, 0, $contentLength)

            $contentType = "application/octet-stream"

            if ($headersText -match "Content-Type:\s*([^\r\n]+)")
            {
                $contentType = $Matches[1].Trim()
            }

            return [ordered]@{
                fileName = $fileName
                contentType = $contentType
                bytes = $fileBytes
            }
        }

        $partStart = Find-ByteSequence -Bytes $bodyBytes -Pattern $boundaryBytes -StartIndex ($nextBoundary + $boundaryBytes.Length)
    }

    throw "File field was not found."
}

function Get-TextValue
{
    param
    (
        $Object,
        [string]$Name,
        [int]$MaxLength = 0
    )

    if ($null -eq $Object -or -not ($Object.PSObject.Properties.Name -contains $Name))
    {
        return $null
    }

    $value = [string]$Object.$Name

    if ([string]::IsNullOrWhiteSpace($value))
    {
        return $null
    }

    $value = $value.Trim()

    if ($MaxLength -gt 0 -and $value.Length -gt $MaxLength)
    {
        return $value.Substring(0, $MaxLength)
    }

    return $value
}

function Get-IntValue
{
    param
    (
        $Object,
        [string]$Name
    )

    $text = Get-TextValue -Object $Object -Name $Name

    if ($null -eq $text)
    {
        return $null
    }

    $result = 0

    if ([int]::TryParse($text, [ref]$result))
    {
        return $result
    }

    return $null
}

function Add-SqlParameter
{
    param
    (
        [System.Data.SqlClient.SqlCommand]$Command,
        [string]$Name,
        [System.Data.SqlDbType]$Type,
        [int]$Size,
        $Value
    )

    if ($Size -gt 0)
    {
        $parameter = $Command.Parameters.Add($Name, $Type, $Size)
    }
    else
    {
        $parameter = $Command.Parameters.Add($Name, $Type)
    }

    if ($null -eq $Value)
    {
        $parameter.Value = [System.DBNull]::Value
    }
    else
    {
        $parameter.Value = $Value
    }
}

function Test-SqlServerConnection
{
    $connectionString = Get-ConnectionString
    $connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
    $command = $connection.CreateCommand()
    $command.CommandText = "SELECT DB_NAME() AS databaseName;"

    try
    {
        $connection.Open()
        return [string]$command.ExecuteScalar()
    }
    finally
    {
        $connection.Close()
    }
}

function Get-PasswordHash
{
    param([string]$Password)

    if ([string]::IsNullOrWhiteSpace($Password))
    {
        throw "Password is required."
    }

    $sha = [System.Security.Cryptography.SHA256]::Create()
    try
    {
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($Password)
        $hash = $sha.ComputeHash($bytes)
        return [System.BitConverter]::ToString($hash).Replace("-", "").ToLowerInvariant()
    }
    finally
    {
        $sha.Dispose()
    }
}

function New-AuthToken
{
    $bytes = New-Object byte[] 32
    $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()

    try
    {
        $rng.GetBytes($bytes)
        return [System.Convert]::ToBase64String($bytes).TrimEnd("=").Replace("+", "-").Replace("/", "_")
    }
    finally
    {
        $rng.Dispose()
    }
}

function Normalize-AccountLogin
{
    param([string]$Login)

    $normalized = ""

    if ($null -ne $Login)
    {
        $normalized = $Login.Trim().ToLowerInvariant()
    }

    if ([string]::IsNullOrWhiteSpace($normalized))
    {
        throw "Введите логин."
    }

    if ($normalized.Length -lt 3)
    {
        throw "Логин должен быть не короче 3 символов."
    }

    if ($normalized.Length -gt 150)
    {
        throw "Логин слишком длинный."
    }

    return $normalized
}

function Ensure-AccountTable
{
    $connectionString = Get-ConnectionString
    $query = @"
IF OBJECT_ID(N'dbo.Student_Accounts', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Student_Accounts
    (
        Student_Account_ID INT IDENTITY(1,1) NOT NULL,
        Student_ID INT NOT NULL,
        Login NVARCHAR(150) NOT NULL,
        Password_Hash NVARCHAR(128) NOT NULL,
        Created_At DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
        Last_Login_At DATETIME2 NULL,
        Session_Token NVARCHAR(128) NULL,
        Session_Expires_At DATETIME2 NULL,
        CONSTRAINT PK_Student_Accounts PRIMARY KEY (Student_Account_ID),
        CONSTRAINT UQ_Student_Accounts_Login UNIQUE (Login),
        CONSTRAINT FK_Student_Accounts_Students FOREIGN KEY (Student_ID) REFERENCES Students(Student_ID)
    );
END;

IF COL_LENGTH(N'dbo.Student_Accounts', N'Session_Token') IS NULL
BEGIN
    ALTER TABLE dbo.Student_Accounts ADD Session_Token NVARCHAR(128) NULL;
END;

IF COL_LENGTH(N'dbo.Student_Accounts', N'Session_Expires_At') IS NULL
BEGIN
    ALTER TABLE dbo.Student_Accounts ADD Session_Expires_At DATETIME2 NULL;
END;

IF COL_LENGTH(N'dbo.Student_Accounts', N'Last_Login_At') IS NULL
BEGIN
    ALTER TABLE dbo.Student_Accounts ADD Last_Login_At DATETIME2 NULL;
END;
"@

    $connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
    $command = $connection.CreateCommand()
    $command.CommandText = $query

    try
    {
        $connection.Open()
        [void]$command.ExecuteNonQuery()
    }
    finally
    {
        $connection.Close()
    }
}

function Test-StudentAuthToken
{
    param
    (
        [int]$StudentId,
        [string]$AuthToken
    )

    if ($StudentId -le 0 -or [string]::IsNullOrWhiteSpace($AuthToken))
    {
        return $false
    }

    Ensure-AccountTable

    $query = @"
SELECT COUNT(*)
FROM Student_Accounts
WHERE Student_ID = @StudentId
  AND Session_Token = @AuthToken
  AND (Session_Expires_At IS NULL OR Session_Expires_At > SYSDATETIME());
"@

    $connection = New-Object System.Data.SqlClient.SqlConnection(Get-ConnectionString)
    $command = $connection.CreateCommand()
    $command.CommandText = $query
    Add-SqlParameter -Command $command -Name "@StudentId" -Type ([System.Data.SqlDbType]::Int) -Size 0 -Value $StudentId
    Add-SqlParameter -Command $command -Name "@AuthToken" -Type ([System.Data.SqlDbType]::NVarChar) -Size 128 -Value $AuthToken

    try
    {
        $connection.Open()
        return ([int]$command.ExecuteScalar() -gt 0)
    }
    finally
    {
        $connection.Close()
    }
}

function Get-RequestStudentId
{
    param([System.Net.HttpListenerContext]$Context)

    $studentIdText = $Context.Request.Headers["X-Student-Id"]

    if ([string]::IsNullOrWhiteSpace($studentIdText))
    {
        $studentIdText = $Context.Request.QueryString["studentId"]
    }

    $studentId = 0

    if (-not [string]::IsNullOrWhiteSpace($studentIdText))
    {
        [void][int]::TryParse($studentIdText, [ref]$studentId)
    }

    if ($studentId -le 0)
    {
        return 0
    }

    if ($studentId -gt 0)
    {
        $authToken = $Context.Request.Headers["X-Auth-Token"]

        if (-not (Test-StudentAuthToken -StudentId $studentId -AuthToken $authToken))
        {
            return 0
        }
    }

    return $studentId
}

function Split-StudentName
{
    param([string]$FullName)

    $parts = @($FullName.Trim() -split "\s+" | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })

    if ($parts.Count -eq 0)
    {
        throw "Student name is required."
    }

    $firstName = $parts[0]
    $lastName = "Ученик"

    if ($parts.Count -gt 1)
    {
        $lastName = $parts[$parts.Count - 1]
    }

    return [ordered]@{
        firstName = $firstName
        lastName = $lastName
    }
}

function Save-RegisteredStudentToSqlServer
{
    param($Payload)

    Ensure-AccountTable

    $studentName = Get-TextValue -Object $Payload -Name "studentName" -MaxLength 120
    $phone = Get-TextValue -Object $Payload -Name "phone" -MaxLength 50
    $email = Get-TextValue -Object $Payload -Name "email" -MaxLength 150
    $requestedLogin = Get-TextValue -Object $Payload -Name "login" -MaxLength 150
    $password = Get-TextValue -Object $Payload -Name "password" -MaxLength 120
    $grade = Get-IntValue -Object $Payload -Name "grade"

    if ([string]::IsNullOrWhiteSpace($requestedLogin) -and [string]::IsNullOrWhiteSpace($phone) -and [string]::IsNullOrWhiteSpace($email))
    {
        throw "Login, phone or email is required."
    }

    if ([string]::IsNullOrWhiteSpace($password) -or $password.Trim().Length -lt 6)
    {
        throw "Password must contain at least 6 characters."
    }

    if ($null -ne $grade -and ($grade -lt 1 -or $grade -gt 11))
    {
        throw "Grade must be between 1 and 11."
    }

    $name = Split-StudentName -FullName $studentName
    $loginSource = if (-not [string]::IsNullOrWhiteSpace($requestedLogin)) { $requestedLogin } elseif (-not [string]::IsNullOrWhiteSpace($email)) { $email } else { $phone }
    $login = Normalize-AccountLogin -Login $loginSource
    $passwordHash = Get-PasswordHash -Password $password
    $authToken = New-AuthToken

    $query = @"
IF EXISTS (SELECT 1 FROM Student_Accounts WHERE Login = @Login)
BEGIN
    THROW 52001, 'Account already exists.', 1;
END;

DECLARE @StudentId INT;

INSERT INTO Students (First_Name, Last_Name, Phone, Email, Grade)
VALUES (@FirstName, @LastName, @Phone, @Email, @Grade);

SET @StudentId = CONVERT(INT, SCOPE_IDENTITY());

INSERT INTO Student_Accounts (Student_ID, Login, Password_Hash, Session_Token, Session_Expires_At, Last_Login_At)
VALUES (@StudentId, @Login, @PasswordHash, @AuthToken, DATEADD(day, 30, SYSDATETIME()), SYSDATETIME());

INSERT INTO Course_Enrollments (Course_ID, Student_ID, Progress_Percent, Status)
SELECT C.Course_ID, @StudentId, 0, N'Active'
FROM Courses AS C
WHERE C.Status = N'Active';

INSERT INTO Homework_Assignments (Homework_Template_ID, Student_ID, Course_Enrollment_ID, Assigned_By_Teacher_ID, Due_Date, Status)
SELECT HT.Homework_Template_ID, @StudentId, CE.Course_Enrollment_ID, HT.Created_By_Teacher_ID, DATEADD(day, 7, SYSDATETIME()), N'Assigned'
FROM Homework_Templates AS HT
JOIN Course_Enrollments AS CE
    ON CE.Course_ID = HT.Course_ID
   AND CE.Student_ID = @StudentId
WHERE HT.For_Online_Course = 1
  AND HT.Is_Active = 1;

SELECT @StudentId AS Student_ID;
"@

    $connection = New-Object System.Data.SqlClient.SqlConnection(Get-ConnectionString)
    $command = $connection.CreateCommand()
    $command.CommandText = $query

    Add-SqlParameter -Command $command -Name "@FirstName" -Type ([System.Data.SqlDbType]::NVarChar) -Size 50 -Value $name.firstName
    Add-SqlParameter -Command $command -Name "@LastName" -Type ([System.Data.SqlDbType]::NVarChar) -Size 50 -Value $name.lastName
    Add-SqlParameter -Command $command -Name "@Phone" -Type ([System.Data.SqlDbType]::NVarChar) -Size 50 -Value $phone
    Add-SqlParameter -Command $command -Name "@Email" -Type ([System.Data.SqlDbType]::NVarChar) -Size 150 -Value $email
    Add-SqlParameter -Command $command -Name "@Grade" -Type ([System.Data.SqlDbType]::Int) -Size 0 -Value $grade
    Add-SqlParameter -Command $command -Name "@Login" -Type ([System.Data.SqlDbType]::NVarChar) -Size 150 -Value $login
    Add-SqlParameter -Command $command -Name "@PasswordHash" -Type ([System.Data.SqlDbType]::NVarChar) -Size 128 -Value $passwordHash
    Add-SqlParameter -Command $command -Name "@AuthToken" -Type ([System.Data.SqlDbType]::NVarChar) -Size 128 -Value $authToken

    try
    {
        $connection.Open()
        $studentId = [int]$command.ExecuteScalar()
    }
    finally
    {
        $connection.Close()
    }

    Ensure-StudentCourseChats -StudentId $studentId

    return Get-AccountFromSqlServer -StudentId $studentId -AuthToken $authToken
}

function Login-StudentToSqlServer
{
    param($Payload)

    Ensure-AccountTable

    $login = Get-TextValue -Object $Payload -Name "login" -MaxLength 150
    $password = Get-TextValue -Object $Payload -Name "password" -MaxLength 120

    if ([string]::IsNullOrWhiteSpace($login))
    {
        throw "Login is required."
    }

    $normalizedLogin = Normalize-AccountLogin -Login $login
    $passwordHash = Get-PasswordHash -Password $password
    $authToken = New-AuthToken
    $query = @"
DECLARE @StudentId INT;

SELECT TOP 1 @StudentId = Student_ID
FROM Student_Accounts
WHERE Login = @Login
  AND Password_Hash = @PasswordHash;

IF @StudentId IS NOT NULL
BEGIN
    UPDATE Student_Accounts
    SET Session_Token = @AuthToken,
        Session_Expires_At = DATEADD(day, 30, SYSDATETIME()),
        Last_Login_At = SYSDATETIME()
    WHERE Student_ID = @StudentId
      AND Login = @Login;
END;

SELECT @StudentId AS Student_ID;
"@

    $connection = New-Object System.Data.SqlClient.SqlConnection(Get-ConnectionString)
    $command = $connection.CreateCommand()
    $command.CommandText = $query
    Add-SqlParameter -Command $command -Name "@Login" -Type ([System.Data.SqlDbType]::NVarChar) -Size 150 -Value $normalizedLogin
    Add-SqlParameter -Command $command -Name "@PasswordHash" -Type ([System.Data.SqlDbType]::NVarChar) -Size 128 -Value $passwordHash
    Add-SqlParameter -Command $command -Name "@AuthToken" -Type ([System.Data.SqlDbType]::NVarChar) -Size 128 -Value $authToken

    try
    {
        $connection.Open()
        $studentId = $command.ExecuteScalar()
    }
    finally
    {
        $connection.Close()
    }

    if ($null -eq $studentId -or [System.DBNull]::Value.Equals($studentId))
    {
        throw "Wrong login or password."
    }

    return Get-AccountFromSqlServer -StudentId ([int]$studentId) -AuthToken $authToken
}

function Normalize-StaffRole
{
    param([string]$Role)

    $normalized = ""

    if ($null -ne $Role)
    {
        $normalized = $Role.Trim()
    }

    if ($normalized -eq "Teacher" -or $normalized -eq "Преподаватель")
    {
        return "Teacher"
    }

    if ($normalized -eq "Curator" -or $normalized -eq "Куратор")
    {
        return "Curator"
    }

    throw "Staff role is invalid."
}

function Ensure-StaffAccountTable
{
    $teacherPasswordHash = Get-PasswordHash -Password "teacher123"
    $curatorPasswordHash = Get-PasswordHash -Password "curator123"
    $query = @"
IF OBJECT_ID(N'dbo.Staff_Accounts', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Staff_Accounts
    (
        Staff_Account_ID INT IDENTITY(1,1) NOT NULL,
        Staff_Role NVARCHAR(30) NOT NULL,
        Teacher_ID INT NULL,
        Curator_ID INT NULL,
        Login NVARCHAR(150) NOT NULL,
        Password_Hash NVARCHAR(128) NOT NULL,
        Created_At DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
        Last_Login_At DATETIME2 NULL,
        Session_Token NVARCHAR(128) NULL,
        Session_Expires_At DATETIME2 NULL,
        CONSTRAINT PK_Staff_Accounts PRIMARY KEY (Staff_Account_ID),
        CONSTRAINT UQ_Staff_Accounts_Login UNIQUE (Login),
        CONSTRAINT FK_Staff_Accounts_Teachers FOREIGN KEY (Teacher_ID) REFERENCES Teachers(Teacher_ID),
        CONSTRAINT FK_Staff_Accounts_Curators FOREIGN KEY (Curator_ID) REFERENCES Curators(Curator_ID),
        CONSTRAINT CHK_Staff_Accounts_Role CHECK (Staff_Role IN (N'Teacher', N'Curator'))
    );
END;

IF NOT EXISTS (SELECT 1 FROM Staff_Accounts WHERE Login = N'teacher')
BEGIN
    INSERT INTO Staff_Accounts (Staff_Role, Teacher_ID, Login, Password_Hash)
    SELECT TOP 1 N'Teacher', Teacher_ID, N'teacher', @TeacherPasswordHash
    FROM Teachers
    WHERE Is_Active = 1
    ORDER BY Teacher_ID;
END;

IF NOT EXISTS (SELECT 1 FROM Staff_Accounts WHERE Login = N'curator')
BEGIN
    INSERT INTO Staff_Accounts (Staff_Role, Curator_ID, Login, Password_Hash)
    SELECT TOP 1 N'Curator', Curator_ID, N'curator', @CuratorPasswordHash
    FROM Curators
    WHERE Is_Active = 1
    ORDER BY Curator_ID;
END;

IF NOT EXISTS (SELECT 1 FROM Curators WHERE Phone = N'+7 900 000-00-08')
BEGIN
    INSERT INTO Curators (First_Name, Last_Name, Phone, Telegram_Link, Average_Rating, Is_Active)
    VALUES (N'Мария', N'Орлова', N'+7 900 000-00-08', N'https://t.me/curator_maria', 9.76, 1);
END;

IF NOT EXISTS (SELECT 1 FROM Curators WHERE Phone = N'+7 900 000-00-09')
BEGIN
    INSERT INTO Curators (First_Name, Last_Name, Phone, Telegram_Link, Average_Rating, Is_Active)
    VALUES (N'Иван', N'Романов', N'+7 900 000-00-09', N'https://t.me/curator_ivan', 9.64, 1);
END;

UPDATE C
SET Curator_ID = CU.Curator_ID
FROM Courses AS C
JOIN Curators AS CU
    ON CU.Phone = N'+7 900 000-00-08'
WHERE C.Course_Slug = N'informatics'
  AND C.Status = N'Active';

UPDATE C
SET Curator_ID = CU.Curator_ID
FROM Courses AS C
JOIN Curators AS CU
    ON CU.Phone = N'+7 900 000-00-09'
WHERE C.Course_Slug = N'physics'
  AND C.Status = N'Active';

IF NOT EXISTS (SELECT 1 FROM Staff_Accounts WHERE Login = N'teacher_russian')
BEGIN
    INSERT INTO Staff_Accounts (Staff_Role, Teacher_ID, Login, Password_Hash)
    SELECT TOP 1 N'Teacher', Teacher_ID, N'teacher_russian', @TeacherPasswordHash
    FROM Teachers
    WHERE Is_Active = 1 AND (Last_Name = N'Кузнецова' OR Phone = N'+7 900 000-00-04')
    ORDER BY Teacher_ID;
END;

IF NOT EXISTS (SELECT 1 FROM Staff_Accounts WHERE Login = N'teacher_it')
BEGIN
    INSERT INTO Staff_Accounts (Staff_Role, Teacher_ID, Login, Password_Hash)
    SELECT TOP 1 N'Teacher', Teacher_ID, N'teacher_it', @TeacherPasswordHash
    FROM Teachers
    WHERE Is_Active = 1 AND (Last_Name = N'Орлов' OR Phone = N'+7 900 000-00-05')
    ORDER BY Teacher_ID;
END;

IF NOT EXISTS (SELECT 1 FROM Staff_Accounts WHERE Login = N'teacher_physics')
BEGIN
    INSERT INTO Staff_Accounts (Staff_Role, Teacher_ID, Login, Password_Hash)
    SELECT TOP 1 N'Teacher', Teacher_ID, N'teacher_physics', @TeacherPasswordHash
    FROM Teachers
    WHERE Is_Active = 1 AND (Last_Name = N'Волков' OR Phone = N'+7 900 000-00-06')
    ORDER BY Teacher_ID;
END;

IF NOT EXISTS (SELECT 1 FROM Staff_Accounts WHERE Login = N'curator_maria')
BEGIN
    INSERT INTO Staff_Accounts (Staff_Role, Curator_ID, Login, Password_Hash)
    SELECT TOP 1 N'Curator', Curator_ID, N'curator_maria', @CuratorPasswordHash
    FROM Curators
    WHERE Is_Active = 1 AND Phone = N'+7 900 000-00-08'
    ORDER BY Curator_ID;
END;

IF NOT EXISTS (SELECT 1 FROM Staff_Accounts WHERE Login = N'curator_ivan')
BEGIN
    INSERT INTO Staff_Accounts (Staff_Role, Curator_ID, Login, Password_Hash)
    SELECT TOP 1 N'Curator', Curator_ID, N'curator_ivan', @CuratorPasswordHash
    FROM Curators
    WHERE Is_Active = 1 AND Phone = N'+7 900 000-00-09'
    ORDER BY Curator_ID;
END;
"@

    $connection = New-Object System.Data.SqlClient.SqlConnection(Get-ConnectionString)
    $command = $connection.CreateCommand()
    $command.CommandText = $query
    Add-SqlParameter -Command $command -Name "@TeacherPasswordHash" -Type ([System.Data.SqlDbType]::NVarChar) -Size 128 -Value $teacherPasswordHash
    Add-SqlParameter -Command $command -Name "@CuratorPasswordHash" -Type ([System.Data.SqlDbType]::NVarChar) -Size 128 -Value $curatorPasswordHash

    try
    {
        $connection.Open()
        [void]$command.ExecuteNonQuery()
    }
    finally
    {
        $connection.Close()
    }
}

function Get-StaffByToken
{
    param
    (
        [int]$StaffId,
        [string]$Role,
        [string]$AuthToken
    )

    if ($StaffId -le 0 -or [string]::IsNullOrWhiteSpace($AuthToken))
    {
        return $null
    }

    Ensure-StaffAccountTable
    $staffRole = Normalize-StaffRole -Role $Role
    $query = @"
SELECT TOP 1
    SA.Staff_Account_ID,
    SA.Staff_Role,
    SA.Teacher_ID,
    SA.Curator_ID,
    SA.Login,
    CASE
        WHEN SA.Staff_Role = N'Teacher' THEN CONCAT(T.First_Name, N' ', T.Last_Name)
        ELSE CONCAT(C.First_Name, N' ', C.Last_Name)
    END AS Staff_Name,
    CASE
        WHEN SA.Staff_Role = N'Teacher' THEN SA.Teacher_ID
        ELSE SA.Curator_ID
    END AS Staff_ID
FROM Staff_Accounts AS SA
LEFT JOIN Teachers AS T
    ON T.Teacher_ID = SA.Teacher_ID
LEFT JOIN Curators AS C
    ON C.Curator_ID = SA.Curator_ID
WHERE SA.Staff_Role = @Role
  AND (CASE WHEN SA.Staff_Role = N'Teacher' THEN SA.Teacher_ID ELSE SA.Curator_ID END) = @StaffId
  AND SA.Session_Token = @AuthToken
  AND (SA.Session_Expires_At IS NULL OR SA.Session_Expires_At > SYSDATETIME());
"@

    $connection = New-Object System.Data.SqlClient.SqlConnection(Get-ConnectionString)
    $command = $connection.CreateCommand()
    $command.CommandText = $query
    Add-SqlParameter -Command $command -Name "@Role" -Type ([System.Data.SqlDbType]::NVarChar) -Size 30 -Value $staffRole
    Add-SqlParameter -Command $command -Name "@StaffId" -Type ([System.Data.SqlDbType]::Int) -Size 0 -Value $StaffId
    Add-SqlParameter -Command $command -Name "@AuthToken" -Type ([System.Data.SqlDbType]::NVarChar) -Size 128 -Value $AuthToken

    $table = New-Object System.Data.DataTable
    $adapter = New-Object System.Data.SqlClient.SqlDataAdapter($command)

    try
    {
        [void]$adapter.Fill($table)
    }
    finally
    {
        $connection.Close()
    }

    if ($table.Rows.Count -eq 0)
    {
        return $null
    }

    $row = $table.Rows[0]

    return [ordered]@{
        staffAccountId = [int](Get-DbValue $row "Staff_Account_ID")
        role = Get-DbValue $row "Staff_Role"
        staffId = [int](Get-DbValue $row "Staff_ID")
        teacherId = Get-DbValue $row "Teacher_ID"
        curatorId = Get-DbValue $row "Curator_ID"
        login = Get-DbValue $row "Login"
        name = Get-DbValue $row "Staff_Name"
        authToken = $AuthToken
    }
}

function Get-RequestStaff
{
    param([System.Net.HttpListenerContext]$Context)

    $staffId = 0
    [void][int]::TryParse($Context.Request.Headers["X-Staff-Id"], [ref]$staffId)
    $role = $Context.Request.Headers["X-Staff-Role"]
    $authToken = $Context.Request.Headers["X-Staff-Auth-Token"]

    try
    {
        return Get-StaffByToken -StaffId $staffId -Role $role -AuthToken $authToken
    }
    catch
    {
        return $null
    }
}

function Login-StaffToSqlServer
{
    param($Payload)

    Ensure-StaffAccountTable

    $role = Normalize-StaffRole -Role (Get-TextValue -Object $Payload -Name "role" -MaxLength 30)
    $login = Normalize-AccountLogin -Login (Get-TextValue -Object $Payload -Name "login" -MaxLength 150)
    $password = Get-TextValue -Object $Payload -Name "password" -MaxLength 120
    $passwordHash = Get-PasswordHash -Password $password
    $authToken = New-AuthToken
    $query = @"
DECLARE @StaffAccountId INT;

SELECT TOP 1 @StaffAccountId = Staff_Account_ID
FROM Staff_Accounts
WHERE Staff_Role = @Role
  AND Login = @Login
  AND Password_Hash = @PasswordHash;

IF @StaffAccountId IS NOT NULL
BEGIN
    UPDATE Staff_Accounts
    SET Session_Token = @AuthToken,
        Session_Expires_At = DATEADD(day, 30, SYSDATETIME()),
        Last_Login_At = SYSDATETIME()
    WHERE Staff_Account_ID = @StaffAccountId;
END;

SELECT
    SA.Staff_Account_ID,
    SA.Staff_Role,
    SA.Teacher_ID,
    SA.Curator_ID,
    SA.Login,
    CASE
        WHEN SA.Staff_Role = N'Teacher' THEN CONCAT(T.First_Name, N' ', T.Last_Name)
        ELSE CONCAT(C.First_Name, N' ', C.Last_Name)
    END AS Staff_Name,
    CASE
        WHEN SA.Staff_Role = N'Teacher' THEN SA.Teacher_ID
        ELSE SA.Curator_ID
    END AS Staff_ID
FROM Staff_Accounts AS SA
LEFT JOIN Teachers AS T
    ON T.Teacher_ID = SA.Teacher_ID
LEFT JOIN Curators AS C
    ON C.Curator_ID = SA.Curator_ID
WHERE SA.Staff_Account_ID = @StaffAccountId;
"@

    $connection = New-Object System.Data.SqlClient.SqlConnection(Get-ConnectionString)
    $command = $connection.CreateCommand()
    $command.CommandText = $query
    Add-SqlParameter -Command $command -Name "@Role" -Type ([System.Data.SqlDbType]::NVarChar) -Size 30 -Value $role
    Add-SqlParameter -Command $command -Name "@Login" -Type ([System.Data.SqlDbType]::NVarChar) -Size 150 -Value $login
    Add-SqlParameter -Command $command -Name "@PasswordHash" -Type ([System.Data.SqlDbType]::NVarChar) -Size 128 -Value $passwordHash
    Add-SqlParameter -Command $command -Name "@AuthToken" -Type ([System.Data.SqlDbType]::NVarChar) -Size 128 -Value $authToken

    $table = New-Object System.Data.DataTable
    $adapter = New-Object System.Data.SqlClient.SqlDataAdapter($command)

    try
    {
        [void]$adapter.Fill($table)
    }
    finally
    {
        $connection.Close()
    }

    if ($table.Rows.Count -eq 0)
    {
        throw "Wrong staff login or password."
    }

    $row = $table.Rows[0]

    return [ordered]@{
        source = "database"
        staff = [ordered]@{
            staffAccountId = [int](Get-DbValue $row "Staff_Account_ID")
            role = Get-DbValue $row "Staff_Role"
            staffId = [int](Get-DbValue $row "Staff_ID")
            teacherId = Get-DbValue $row "Teacher_ID"
            curatorId = Get-DbValue $row "Curator_ID"
            login = Get-DbValue $row "Login"
            name = Get-DbValue $row "Staff_Name"
            authToken = $authToken
        }
    }
}

function Ensure-ShopTables
{
    $query = @"
IF OBJECT_ID(N'dbo.Capybara_Shop_Items', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Capybara_Shop_Items
    (
        Item_ID INT IDENTITY(1,1) NOT NULL,
        Item_Code NVARCHAR(80) NOT NULL,
        Item_Name NVARCHAR(150) NOT NULL,
        Item_Type NVARCHAR(50) NOT NULL,
        Price_Points INT NOT NULL,
        Css_Class NVARCHAR(80) NOT NULL,
        Description NVARCHAR(400) NULL,
        Is_Active BIT NOT NULL DEFAULT 1,
        CONSTRAINT PK_Capybara_Shop_Items PRIMARY KEY (Item_ID),
        CONSTRAINT UQ_Capybara_Shop_Items_Code UNIQUE (Item_Code),
        CONSTRAINT CHK_Capybara_Shop_Items_Price CHECK (Price_Points > 0)
    );
END;

IF OBJECT_ID(N'dbo.Student_Capybara_Items', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Student_Capybara_Items
    (
        Student_ID INT NOT NULL,
        Item_ID INT NOT NULL,
        Purchased_At DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
        Is_Equipped BIT NOT NULL DEFAULT 0,
        CONSTRAINT PK_Student_Capybara_Items PRIMARY KEY (Student_ID, Item_ID),
        CONSTRAINT FK_Student_Capybara_Items_Students FOREIGN KEY (Student_ID) REFERENCES Students(Student_ID),
        CONSTRAINT FK_Student_Capybara_Items_Items FOREIGN KEY (Item_ID) REFERENCES Capybara_Shop_Items(Item_ID)
    );
END;

IF NOT EXISTS (SELECT 1 FROM Capybara_Shop_Items WHERE Item_Code = N'blue_scarf')
BEGIN
    INSERT INTO Capybara_Shop_Items (Item_Code, Item_Name, Item_Type, Price_Points, Css_Class, Description)
    VALUES
        (N'blue_scarf', N'Синий шарф', N'Шарф', 120, N'blue-scarf', N'Аккуратный шарф для спокойной учебной капибары.'),
        (N'green_hoodie', N'Зелёная худи', N'Кофта', 220, N'green-hoodie', N'Тёплая худи для вечерних разборов.'),
        (N'round_glasses', N'Круглые очки', N'Аксессуар', 160, N'round-glasses', N'Очки для режима "сейчас всё пойму".'),
        (N'gold_crown', N'Золотая корона', N'Корона', 350, N'gold-crown', N'Награда для короля домашек.');
END;
"@

    $connection = New-Object System.Data.SqlClient.SqlConnection(Get-ConnectionString)
    $command = $connection.CreateCommand()
    $command.CommandText = $query

    try
    {
        $connection.Open()
        [void]$command.ExecuteNonQuery()
    }
    finally
    {
        $connection.Close()
    }
}

function Get-ShopFromSqlServer
{
    param([int]$StudentId)

    if ($StudentId -le 0)
    {
        throw "Student id is invalid."
    }

    Ensure-ShopTables
    $query = @"
SELECT
    I.Item_Code,
    I.Item_Name,
    I.Item_Type,
    I.Price_Points,
    I.Css_Class,
    I.Description,
    CASE WHEN SCI.Student_ID IS NULL THEN CAST(0 AS bit) ELSE CAST(1 AS bit) END AS Is_Owned,
    ISNULL(SCI.Is_Equipped, 0) AS Is_Equipped,
    ISNULL((SELECT SUM(Points) FROM Point_Transactions WHERE Student_ID = @StudentId), 0) AS Points_Total
FROM Capybara_Shop_Items AS I
LEFT JOIN Student_Capybara_Items AS SCI
    ON SCI.Item_ID = I.Item_ID
   AND SCI.Student_ID = @StudentId
WHERE I.Is_Active = 1
ORDER BY I.Price_Points, I.Item_ID;
"@

    $connection = New-Object System.Data.SqlClient.SqlConnection(Get-ConnectionString)
    $command = $connection.CreateCommand()
    $command.CommandText = $query
    Add-SqlParameter -Command $command -Name "@StudentId" -Type ([System.Data.SqlDbType]::Int) -Size 0 -Value $StudentId
    $table = New-Object System.Data.DataTable
    $adapter = New-Object System.Data.SqlClient.SqlDataAdapter($command)

    try
    {
        [void]$adapter.Fill($table)
    }
    finally
    {
        $connection.Close()
    }

    $pointsTotal = 0
    $items = @()

    foreach ($row in $table.Rows)
    {
        $pointsTotal = [int](Get-DbValue $row "Points_Total")
        $items += [ordered]@{
            itemCode = Get-DbValue $row "Item_Code"
            itemName = Get-DbValue $row "Item_Name"
            itemType = Get-DbValue $row "Item_Type"
            pricePoints = [int](Get-DbValue $row "Price_Points")
            cssClass = Get-DbValue $row "Css_Class"
            description = Get-DbValue $row "Description"
            isOwned = [bool](Get-DbValue $row "Is_Owned")
            isEquipped = [bool](Get-DbValue $row "Is_Equipped")
        }
    }

    return [ordered]@{
        source = "database"
        pointsTotal = $pointsTotal
        items = $items
    }
}

function Invoke-ShopPurchase
{
    param
    (
        [int]$StudentId,
        [string]$ItemCode
    )

    Ensure-ShopTables
    $query = @"
DECLARE @ItemId INT;
DECLARE @Price INT;
DECLARE @Points INT;

SELECT @ItemId = Item_ID, @Price = Price_Points
FROM Capybara_Shop_Items
WHERE Item_Code = @ItemCode
  AND Is_Active = 1;

IF @ItemId IS NULL
BEGIN
    THROW 53001, 'Shop item was not found.', 1;
END;

IF EXISTS (SELECT 1 FROM Student_Capybara_Items WHERE Student_ID = @StudentId AND Item_ID = @ItemId)
BEGIN
    THROW 53002, 'Shop item already purchased.', 1;
END;

SELECT @Points = ISNULL(SUM(Points), 0)
FROM Point_Transactions
WHERE Student_ID = @StudentId;

IF @Points < @Price
BEGIN
    THROW 53003, 'Not enough points.', 1;
END;

INSERT INTO Student_Capybara_Items (Student_ID, Item_ID, Is_Equipped)
VALUES (@StudentId, @ItemId, 0);

INSERT INTO Point_Transactions (Student_ID, Points, Reason)
VALUES (@StudentId, -@Price, CONCAT(N'Покупка в магазине: ', @ItemCode));
"@

    $connection = New-Object System.Data.SqlClient.SqlConnection(Get-ConnectionString)
    $command = $connection.CreateCommand()
    $command.CommandText = $query
    Add-SqlParameter -Command $command -Name "@StudentId" -Type ([System.Data.SqlDbType]::Int) -Size 0 -Value $StudentId
    Add-SqlParameter -Command $command -Name "@ItemCode" -Type ([System.Data.SqlDbType]::NVarChar) -Size 80 -Value $ItemCode

    try
    {
        $connection.Open()
        [void]$command.ExecuteNonQuery()
    }
    finally
    {
        $connection.Close()
    }

    return Get-ShopFromSqlServer -StudentId $StudentId
}

function Invoke-ShopEquip
{
    param
    (
        [int]$StudentId,
        [string]$ItemCode
    )

    Ensure-ShopTables
    $query = @"
DECLARE @ItemId INT;
DECLARE @ItemType NVARCHAR(50);

SELECT @ItemId = Item_ID, @ItemType = Item_Type
FROM Capybara_Shop_Items
WHERE Item_Code = @ItemCode
  AND Is_Active = 1;

IF @ItemId IS NULL
BEGIN
    THROW 53101, 'Shop item was not found.', 1;
END;

IF NOT EXISTS (SELECT 1 FROM Student_Capybara_Items WHERE Student_ID = @StudentId AND Item_ID = @ItemId)
BEGIN
    THROW 53102, 'Shop item was not purchased.', 1;
END;

UPDATE SCI
SET Is_Equipped = 0
FROM Student_Capybara_Items AS SCI
JOIN Capybara_Shop_Items AS I
    ON I.Item_ID = SCI.Item_ID
WHERE SCI.Student_ID = @StudentId
  AND I.Item_Type = @ItemType;

UPDATE Student_Capybara_Items
SET Is_Equipped = 1
WHERE Student_ID = @StudentId
  AND Item_ID = @ItemId;
"@

    $connection = New-Object System.Data.SqlClient.SqlConnection(Get-ConnectionString)
    $command = $connection.CreateCommand()
    $command.CommandText = $query
    Add-SqlParameter -Command $command -Name "@StudentId" -Type ([System.Data.SqlDbType]::Int) -Size 0 -Value $StudentId
    Add-SqlParameter -Command $command -Name "@ItemCode" -Type ([System.Data.SqlDbType]::NVarChar) -Size 80 -Value $ItemCode

    try
    {
        $connection.Open()
        [void]$command.ExecuteNonQuery()
    }
    finally
    {
        $connection.Close()
    }

    return Get-ShopFromSqlServer -StudentId $StudentId
}

function Get-AccountFromSqlServer
{
    param
    (
        [int]$StudentId = 1,
        [string]$AuthToken = $null
    )

    Ensure-AccountTable
    Ensure-LiveStreamSchedule

    $studentQuery = @"
SELECT
    S.Student_ID,
    S.First_Name,
    S.Last_Name,
    S.Phone,
    S.Email,
    S.Grade,
    (
        SELECT TOP 1 SA.Login
        FROM Student_Accounts AS SA
        WHERE SA.Student_ID = S.Student_ID
        ORDER BY SA.Student_Account_ID DESC
    ) AS Account_Login,
    ISNULL(SUM(PT.Points), 0) AS Points_Total
FROM Students AS S
LEFT JOIN Point_Transactions AS PT
    ON PT.Student_ID = S.Student_ID
WHERE S.Student_ID = @StudentId
GROUP BY S.Student_ID, S.First_Name, S.Last_Name, S.Phone, S.Email, S.Grade;
"@

    $coursesQuery = @"
SELECT
    C.Course_ID,
    C.Course_Slug,
    C.Course_Name,
    C.Short_Description,
    C.Total_Lessons,
    (SELECT COUNT(*) FROM Lessons AS CourseLessons WHERE CourseLessons.Course_ID = C.Course_ID) AS Lessons_Total,
    (
        SELECT COUNT(*)
        FROM Lessons AS CourseLessons
        LEFT JOIN Lesson_Progress AS LP
            ON LP.Lesson_ID = CourseLessons.Lesson_ID
           AND LP.Course_Enrollment_ID = CE.Course_Enrollment_ID
        WHERE CourseLessons.Course_ID = C.Course_ID
          AND (LP.Is_Completed = 1 OR LP.Watch_Percent >= 95)
    ) AS Lessons_Completed,
    CE.Course_Enrollment_ID,
    CE.Status AS Enrollment_Status,
    CASE WHEN CE.Course_Enrollment_ID IS NULL THEN CAST(0 AS bit) ELSE CAST(1 AS bit) END AS Is_Owned,
    COUNT(HA.Homework_Assignment_ID) AS Homework_Total,
    SUM(CASE WHEN HA.Status IN (N'Submitted', N'Checked') THEN 1 ELSE 0 END) AS Homework_Submitted,
    SUM(CASE WHEN HA.Status = N'Checked' THEN 1 ELSE 0 END) AS Homework_Checked,
    CAST(
        CASE
            WHEN COUNT(HA.Homework_Assignment_ID) = 0 THEN 0
            ELSE 100.0 * SUM(CASE WHEN HA.Status = N'Checked' THEN 1 ELSE 0 END) / COUNT(HA.Homework_Assignment_ID)
        END
        AS DECIMAL(5,2)
    ) AS Progress_Percent,
    ISNULL((
        SELECT SUM(CoursePoints.Points)
        FROM Point_Transactions AS CoursePoints
        WHERE CoursePoints.Course_Enrollment_ID = CE.Course_Enrollment_ID
          AND CoursePoints.Student_ID = @StudentId
    ), 0) AS Points_Earned
FROM Courses AS C
LEFT JOIN Course_Enrollments AS CE
    ON CE.Course_ID = C.Course_ID
   AND CE.Student_ID = @StudentId
LEFT JOIN Homework_Assignments AS HA
    ON HA.Course_Enrollment_ID = CE.Course_Enrollment_ID
   AND HA.Student_ID = @StudentId
   AND HA.Status <> N'Cancelled'
WHERE C.Status = N'Active'
GROUP BY C.Course_ID, C.Course_Slug, C.Course_Name, C.Short_Description, C.Total_Lessons, CE.Course_Enrollment_ID, CE.Status
ORDER BY C.Course_ID;
"@

    $lessonsQuery = @"
SELECT
    C.Course_Slug,
    L.Lesson_ID,
    L.Lesson_Number,
    L.Lesson_Title,
    L.Lesson_Status,
    ISNULL(LP.Watch_Percent, 0) AS Watch_Percent,
    ISNULL(LP.Is_Completed, 0) AS Is_Completed,
    LP.Completed_At
FROM Course_Enrollments AS CE
JOIN Courses AS C
    ON C.Course_ID = CE.Course_ID
JOIN Lessons AS L
    ON L.Course_ID = C.Course_ID
LEFT JOIN Lesson_Progress AS LP
    ON LP.Course_Enrollment_ID = CE.Course_Enrollment_ID
   AND LP.Lesson_ID = L.Lesson_ID
WHERE CE.Student_ID = @StudentId
  AND CE.Status = N'Active'
  AND C.Status = N'Active'
ORDER BY C.Course_ID, L.Lesson_Number;
"@

    $notificationsQuery = @"
SELECT TOP 8
    Notification_ID,
    Title,
    Notification_Text,
    Notification_Type,
    Link,
    Created_At,
    Is_Read,
    Tone
FROM
(
    SELECT
        CAST(CONCAT(N'homework-', HS.Homework_Submission_ID) AS NVARCHAR(80)) AS Notification_ID,
        N'ДЗ проверено' AS Title,
        CONCAT(C.Course_Name, N' · Урок ', L.Lesson_Number, N'. ', HT.Homework_Name, N' · ', HS.Score, N'/10 баллов') AS Notification_Text,
        N'Homework' AS Notification_Type,
        CONCAT(N'#course-', C.Course_Slug) AS Link,
        HS.Checked_At AS Created_At,
        CAST(0 AS bit) AS Is_Read,
        N'success' AS Tone
    FROM Homework_Assignments AS HA
    JOIN Homework_Templates AS HT
        ON HT.Homework_Template_ID = HA.Homework_Template_ID
    JOIN Courses AS C
        ON C.Course_ID = HT.Course_ID
    LEFT JOIN Lessons AS L
        ON L.Lesson_ID = HT.Lesson_ID
    JOIN Homework_Submissions AS HS
        ON HS.Homework_Assignment_ID = HA.Homework_Assignment_ID
    WHERE HA.Student_ID = @StudentId
      AND HS.Status = N'Checked'
      AND HS.Checked_At IS NOT NULL

    UNION ALL

    SELECT
        CAST(CONCAT(N'stream-', LS.Live_Stream_ID) AS NVARCHAR(80)) AS Notification_ID,
        N'Новая трансляция' AS Title,
        CONCAT(C.Course_Name, N' · ', LS.Stream_Title, CASE WHEN L.Lesson_Number IS NULL THEN N'' ELSE CONCAT(N' · Урок ', L.Lesson_Number) END) AS Notification_Text,
        N'Live_Stream' AS Notification_Type,
        COALESCE(LS.Stream_Link, CONCAT(N'#course-', C.Course_Slug)) AS Link,
        LS.Created_At AS Created_At,
        CAST(0 AS bit) AS Is_Read,
        N'info' AS Tone
    FROM Live_Streams AS LS
    JOIN Courses AS C
        ON C.Course_ID = LS.Course_ID
    JOIN Course_Enrollments AS CE
        ON CE.Course_ID = C.Course_ID
       AND CE.Student_ID = @StudentId
       AND CE.Status = N'Active'
    LEFT JOIN Lessons AS L
        ON L.Lesson_ID = LS.Lesson_ID
    WHERE LS.Status IN (N'Planned', N'Live')
) AS Events
WHERE Created_At IS NOT NULL
ORDER BY Created_At DESC, Notification_ID DESC;
"@

    $connection = New-Object System.Data.SqlClient.SqlConnection(Get-ConnectionString)
    $studentCommand = $connection.CreateCommand()
    $studentCommand.CommandText = $studentQuery
    Add-SqlParameter -Command $studentCommand -Name "@StudentId" -Type ([System.Data.SqlDbType]::Int) -Size 0 -Value $StudentId

    $coursesCommand = $connection.CreateCommand()
    $coursesCommand.CommandText = $coursesQuery
    Add-SqlParameter -Command $coursesCommand -Name "@StudentId" -Type ([System.Data.SqlDbType]::Int) -Size 0 -Value $StudentId

    $lessonsCommand = $connection.CreateCommand()
    $lessonsCommand.CommandText = $lessonsQuery
    Add-SqlParameter -Command $lessonsCommand -Name "@StudentId" -Type ([System.Data.SqlDbType]::Int) -Size 0 -Value $StudentId

    $notificationsCommand = $connection.CreateCommand()
    $notificationsCommand.CommandText = $notificationsQuery
    Add-SqlParameter -Command $notificationsCommand -Name "@StudentId" -Type ([System.Data.SqlDbType]::Int) -Size 0 -Value $StudentId

    $studentTable = New-Object System.Data.DataTable
    $courseTable = New-Object System.Data.DataTable
    $lessonTable = New-Object System.Data.DataTable
    $notificationTable = New-Object System.Data.DataTable

    try
    {
        $connection.Open()
        $studentAdapter = New-Object System.Data.SqlClient.SqlDataAdapter($studentCommand)
        [void]$studentAdapter.Fill($studentTable)

        $coursesAdapter = New-Object System.Data.SqlClient.SqlDataAdapter($coursesCommand)
        [void]$coursesAdapter.Fill($courseTable)

        $lessonsAdapter = New-Object System.Data.SqlClient.SqlDataAdapter($lessonsCommand)
        [void]$lessonsAdapter.Fill($lessonTable)

        $notificationsAdapter = New-Object System.Data.SqlClient.SqlDataAdapter($notificationsCommand)
        [void]$notificationsAdapter.Fill($notificationTable)
    }
    finally
    {
        $connection.Close()
    }

    if ($studentTable.Rows.Count -eq 0)
    {
        throw "Student was not found."
    }

    $studentRow = $studentTable.Rows[0]
    $courses = @()
    $lessonGroups = @{}
    $notifications = @()

    foreach ($row in $lessonTable.Rows)
    {
        $slug = [string](Get-DbValue $row "Course_Slug")

        if (-not $lessonGroups.ContainsKey($slug))
        {
            $lessonGroups[$slug] = @()
        }

        $lessonGroups[$slug] = @($lessonGroups[$slug]) + [ordered]@{
            lessonId = [int](Get-DbValue $row "Lesson_ID")
            lessonNumber = [int](Get-DbValue $row "Lesson_Number")
            lessonTitle = Get-DbValue $row "Lesson_Title"
            lessonStatus = Get-DbValue $row "Lesson_Status"
            watchPercent = [decimal](Get-DbValue $row "Watch_Percent")
            isCompleted = [bool](Get-DbValue $row "Is_Completed")
            completedAt = Get-DbDateText -Row $row -ColumnName "Completed_At"
        }
    }

    foreach ($row in $courseTable.Rows)
    {
        $slug = [string](Get-DbValue $row "Course_Slug")

        $courses += [ordered]@{
            courseId = [int](Get-DbValue $row "Course_ID")
            courseSlug = $slug
            courseTitle = Get-DbValue $row "Course_Name"
            courseDescription = Get-DbValue $row "Short_Description"
            totalLessons = [int](Get-DbValue $row "Total_Lessons")
            lessonsTotal = [int](Get-DbValue $row "Lessons_Total")
            lessonsCompleted = [int](Get-DbValue $row "Lessons_Completed")
            enrollmentId = Get-DbValue $row "Course_Enrollment_ID"
            enrollmentStatus = Get-DbValue $row "Enrollment_Status"
            isOwned = [bool](Get-DbValue $row "Is_Owned")
            homeworkTotal = [int](Get-DbValue $row "Homework_Total")
            homeworkSubmitted = [int](Get-DbValue $row "Homework_Submitted")
            homeworkChecked = [int](Get-DbValue $row "Homework_Checked")
            progressPercent = [decimal](Get-DbValue $row "Progress_Percent")
            pointsEarned = [int](Get-DbValue $row "Points_Earned")
            lessons = $(if ($lessonGroups.ContainsKey($slug)) { @($lessonGroups[$slug]) } else { @() })
        }
    }

    foreach ($row in $notificationTable.Rows)
    {
        $notifications += [ordered]@{
            notificationId = [string](Get-DbValue $row "Notification_ID")
            title = Get-DbValue $row "Title"
            text = Get-DbValue $row "Notification_Text"
            type = Get-DbValue $row "Notification_Type"
            link = Get-DbValue $row "Link"
            createdAt = Get-DbDateText -Row $row -ColumnName "Created_At"
            isRead = [bool](Get-DbValue $row "Is_Read")
            tone = Get-DbValue $row "Tone"
        }
    }

    return [ordered]@{
        source = "database"
        student = [ordered]@{
            studentId = [int](Get-DbValue $studentRow "Student_ID")
            firstName = Get-DbValue $studentRow "First_Name"
            lastName = Get-DbValue $studentRow "Last_Name"
            phone = Get-DbValue $studentRow "Phone"
            email = Get-DbValue $studentRow "Email"
            grade = Get-DbValue $studentRow "Grade"
        }
        account = [ordered]@{
            login = Get-DbValue $studentRow "Account_Login"
            authToken = $AuthToken
        }
        pointsTotal = [int](Get-DbValue $studentRow "Points_Total")
        courses = $courses
        notifications = $notifications
    }
}

function Ensure-ApplicationTable
{
    $query = @"
IF OBJECT_ID(N'dbo.Course_Applications', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Course_Applications
    (
        Application_ID INT IDENTITY(1,1) NOT NULL,
        Student_Name NVARCHAR(150) NOT NULL,
        Phone NVARCHAR(50) NOT NULL,
        Email NVARCHAR(150) NULL,
        Preferred_Subject NVARCHAR(100) NOT NULL,
        Grade INT NULL,
        Comment_Text NVARCHAR(1000) NULL,
        Source_Page NVARCHAR(100) NULL,
        Status NVARCHAR(30) NOT NULL DEFAULT N'New',
        Created_At DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
        CONSTRAINT PK_Course_Applications PRIMARY KEY (Application_ID),
        CONSTRAINT CHK_Course_Applications_Grade CHECK (Grade BETWEEN 1 AND 11 OR Grade IS NULL),
        CONSTRAINT CHK_Course_Applications_Status CHECK (Status IN (N'New', N'Contacted', N'Enrolled', N'Rejected'))
    );
END;

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_Course_Applications_Status' AND object_id = OBJECT_ID(N'dbo.Course_Applications'))
BEGIN
    CREATE INDEX IX_Course_Applications_Status ON dbo.Course_Applications(Status, Created_At);
END;
"@

    $connection = New-Object System.Data.SqlClient.SqlConnection(Get-ConnectionString)
    $command = $connection.CreateCommand()
    $command.CommandText = $query

    try
    {
        $connection.Open()
        [void]$command.ExecuteNonQuery()
    }
    finally
    {
        $connection.Close()
    }
}

function Save-ApplicationToSqlServer
{
    param($Application)

    Ensure-ApplicationTable

    $studentName = Get-TextValue -Object $Application -Name "studentName" -MaxLength 150
    $phone = Get-TextValue -Object $Application -Name "phone" -MaxLength 50
    $email = Get-TextValue -Object $Application -Name "email" -MaxLength 150
    $preferredSubject = Get-TextValue -Object $Application -Name "preferredSubject" -MaxLength 100
    $grade = Get-IntValue -Object $Application -Name "grade"
    $comment = Get-TextValue -Object $Application -Name "comment" -MaxLength 1000
    $sourcePage = Get-TextValue -Object $Application -Name "sourcePage" -MaxLength 100

    if ([string]::IsNullOrWhiteSpace($studentName))
    {
        throw "Student name is required."
    }

    if ([string]::IsNullOrWhiteSpace($phone))
    {
        throw "Phone is required."
    }

    if ([string]::IsNullOrWhiteSpace($preferredSubject))
    {
        $preferredSubject = "Not selected"
    }

    if ($null -ne $grade -and ($grade -lt 1 -or $grade -gt 11))
    {
        throw "Grade must be between 1 and 11."
    }

    if ([string]::IsNullOrWhiteSpace($sourcePage))
    {
        $sourcePage = "Home"
    }

    $connectionString = Get-ConnectionString
    $query = @"
INSERT INTO Course_Applications
    (Student_Name, Phone, Email, Preferred_Subject, Grade, Comment_Text, Source_Page)
OUTPUT INSERTED.Application_ID, INSERTED.Created_At
VALUES
    (@StudentName, @Phone, @Email, @PreferredSubject, @Grade, @CommentText, @SourcePage);
"@

    $connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
    $command = $connection.CreateCommand()
    $command.CommandText = $query

    Add-SqlParameter -Command $command -Name "@StudentName" -Type ([System.Data.SqlDbType]::NVarChar) -Size 150 -Value $studentName
    Add-SqlParameter -Command $command -Name "@Phone" -Type ([System.Data.SqlDbType]::NVarChar) -Size 50 -Value $phone
    Add-SqlParameter -Command $command -Name "@Email" -Type ([System.Data.SqlDbType]::NVarChar) -Size 150 -Value $email
    Add-SqlParameter -Command $command -Name "@PreferredSubject" -Type ([System.Data.SqlDbType]::NVarChar) -Size 100 -Value $preferredSubject
    Add-SqlParameter -Command $command -Name "@Grade" -Type ([System.Data.SqlDbType]::Int) -Size 0 -Value $grade
    Add-SqlParameter -Command $command -Name "@CommentText" -Type ([System.Data.SqlDbType]::NVarChar) -Size 1000 -Value $comment
    Add-SqlParameter -Command $command -Name "@SourcePage" -Type ([System.Data.SqlDbType]::NVarChar) -Size 100 -Value $sourcePage

    try
    {
        $connection.Open()
        $reader = $command.ExecuteReader()

        if (-not $reader.Read())
        {
            throw "Application was not saved."
        }

        return [ordered]@{
            source = "database"
            applicationId = [int]$reader["Application_ID"]
            createdAt = ([datetime]$reader["Created_At"]).ToString("s")
        }
    }
    finally
    {
        if ($reader)
        {
            $reader.Close()
        }

        $connection.Close()
    }
}

function Save-SupportRequestToFallback
{
    param
    (
        [int]$StudentId,
        [string]$Topic,
        [string]$Message
    )

    if ([string]::IsNullOrWhiteSpace($Topic))
    {
        $Topic = "Поддержка"
    }

    if ([string]::IsNullOrWhiteSpace($Message))
    {
        throw "Support message is required."
    }

    $folder = Split-Path -Parent $SupportRequestsPath

    if (-not (Test-Path $folder))
    {
        [void](New-Item -ItemType Directory -Path $folder -Force)
    }

    $items = @()

    if (Test-Path $SupportRequestsPath)
    {
        $raw = Get-Content -Raw -Encoding UTF8 -Path $SupportRequestsPath

        if (-not [string]::IsNullOrWhiteSpace($raw))
        {
            $parsed = $raw | ConvertFrom-Json

            if ($parsed)
            {
                $items = @($parsed)
            }
        }
    }

    $request = [ordered]@{
        supportId = [guid]::NewGuid().ToString("N")
        source = "local"
        studentId = $StudentId
        topic = $Topic
        message = $Message
        createdAt = (Get-Date).ToString("s")
    }

    @($request) + $items | ConvertTo-Json -Depth 10 | Set-Content -Path $SupportRequestsPath -Encoding UTF8

    return $request
}

function Save-SupportRequestToSqlServer
{
    param
    (
        [int]$StudentId,
        $Payload
    )

    $topic = Get-TextValue -Object $Payload -Name "topic" -MaxLength 100
    $message = Get-TextValue -Object $Payload -Name "message" -MaxLength 2000

    if ($StudentId -le 0)
    {
        throw "Student id is invalid."
    }

    if ([string]::IsNullOrWhiteSpace($topic))
    {
        $topic = "Поддержка"
    }

    if ([string]::IsNullOrWhiteSpace($message))
    {
        throw "Support message is required."
    }

    $query = @"
INSERT INTO Feedbacks (Student_ID, Feedback_Type, Feedback_Text)
OUTPUT INSERTED.Feedback_ID, INSERTED.Created_At
VALUES (@StudentId, N'Student_To_Teacher', @FeedbackText);
"@

    $connection = New-Object System.Data.SqlClient.SqlConnection(Get-ConnectionString)
    $command = $connection.CreateCommand()
    $command.CommandText = $query
    $feedbackText = "Тема: $topic`n$message"

    Add-SqlParameter -Command $command -Name "@StudentId" -Type ([System.Data.SqlDbType]::Int) -Size 0 -Value $StudentId
    Add-SqlParameter -Command $command -Name "@FeedbackText" -Type ([System.Data.SqlDbType]::NVarChar) -Size 2000 -Value $feedbackText

    try
    {
        $connection.Open()
        $reader = $command.ExecuteReader()

        if (-not $reader.Read())
        {
            throw "Support request was not saved."
        }

        return [ordered]@{
            source = "database"
            supportId = [int]$reader["Feedback_ID"]
            createdAt = ([datetime]$reader["Created_At"]).ToString("s")
        }
    }
    finally
    {
        if ($reader)
        {
            $reader.Close()
        }

        $connection.Close()
    }
}

function Get-LessonsFromSqlServer
{
    param
    (
        [string]$CourseSlug,
        [int]$StudentId = 1
    )

    $connectionString = Get-ConnectionString

    if ([string]::IsNullOrWhiteSpace($connectionString))
    {
        throw "Connection string is empty. Set database\db-config.json or YTUTOR_CONNECTION_STRING."
    }

    $query = @"
SELECT
    C.Course_ID AS courseId,
    C.Course_Slug AS courseSlug,
    C.Course_Name AS courseTitle,
    C.Short_Description AS courseDescription,
    C.Total_Lessons AS totalLessons,
    COUNT(L.Lesson_ID) OVER (PARTITION BY C.Course_ID) AS lessonsTotal,
    CE.Progress_Percent AS progressPercent,
    L.Lesson_ID AS lessonId,
    L.Lesson_Number AS lessonNumber,
    L.Lesson_Title AS lessonTitle,
    L.Topic AS topic,
    L.Video_Link AS videoUrl,
    L.Notes_Link AS notesUrl,
    L.Homework_Link AS homeworkUrl,
    L.Lesson_Status AS lessonStatus,
    HT.Homework_Template_ID AS homeworkTemplateId,
    HT.Homework_Name AS homeworkTitle,
    HT.Description AS homeworkDescription,
    HT.File_Link AS homeworkTaskUrl,
    HA.Homework_Assignment_ID AS homeworkAssignmentId,
    HA.Status AS homeworkStatus,
    HA.Due_Date AS homeworkDueAt,
    HA.Upload_Folder_Link AS homeworkUploadUrl,
    HS.Homework_Submission_ID AS homeworkSubmissionId,
    HS.File_Link AS submittedHomeworkUrl,
    HS.Status AS submissionStatus,
    HS.Feedback_Link AS feedbackUrl,
    HS.Feedback_Text AS feedbackText,
    HS.Score AS homeworkScore,
    HS.Checked_At AS checkedAt
FROM Courses AS C
JOIN Lessons AS L
    ON L.Course_ID = C.Course_ID
LEFT JOIN Course_Enrollments AS CE
    ON CE.Course_ID = C.Course_ID
   AND CE.Student_ID = @StudentId
OUTER APPLY
(
    SELECT TOP 1 *
    FROM Homework_Templates AS Template
    WHERE Template.Lesson_ID = L.Lesson_ID
      AND Template.Course_ID = C.Course_ID
      AND Template.For_Online_Course = 1
      AND Template.Is_Active = 1
    ORDER BY Template.Homework_Template_ID
) AS HT
OUTER APPLY
(
    SELECT TOP 1 *
    FROM Homework_Assignments AS Assignment
WHERE Assignment.Homework_Template_ID = HT.Homework_Template_ID
      AND Assignment.Student_ID = @StudentId
      AND Assignment.Course_Enrollment_ID = CE.Course_Enrollment_ID
    ORDER BY Assignment.Homework_Assignment_ID DESC
) AS HA
OUTER APPLY
(
    SELECT TOP 1 *
    FROM Homework_Submissions AS Submission
    WHERE Submission.Homework_Assignment_ID = HA.Homework_Assignment_ID
    ORDER BY Submission.Submitted_At DESC
) AS HS
WHERE C.Course_Slug = @CourseSlug
ORDER BY L.Lesson_Number;
"@

    $connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
    $command = $connection.CreateCommand()
    $command.CommandText = $query
    $parameter = $command.Parameters.Add("@CourseSlug", [System.Data.SqlDbType]::NVarChar, 50)
    $parameter.Value = $CourseSlug
    Add-SqlParameter -Command $command -Name "@StudentId" -Type ([System.Data.SqlDbType]::Int) -Size 0 -Value $StudentId

    $table = New-Object System.Data.DataTable
    $adapter = New-Object System.Data.SqlClient.SqlDataAdapter($command)

    try
    {
        [void]$adapter.Fill($table)
    }
    finally
    {
        $connection.Close()
    }

    if ($table.Rows.Count -eq 0)
    {
        return $null
    }

    $first = $table.Rows[0]
    $lessons = @()

    foreach ($row in $table.Rows)
    {
        $lessons += [ordered]@{
            lessonId = [int](Get-DbValue $row "lessonId")
            lessonNumber = [int](Get-DbValue $row "lessonNumber")
            lessonTitle = Get-DbValue $row "lessonTitle"
            topic = Get-DbValue $row "topic"
            lessonStatus = Get-DbValue $row "lessonStatus"
            videoUrl = Get-DbValue $row "videoUrl"
            notesUrl = Get-DbValue $row "notesUrl"
            homeworkUrl = Get-DbValue $row "homeworkTaskUrl"
            homeworkTemplateId = Get-DbValue $row "homeworkTemplateId"
            homeworkTitle = Get-DbValue $row "homeworkTitle"
            homeworkDescription = Get-DbValue $row "homeworkDescription"
            homeworkTaskUrl = Get-DbValue $row "homeworkTaskUrl"
            homeworkAssignmentId = Get-DbValue $row "homeworkAssignmentId"
            homeworkStatus = Get-DbValue $row "homeworkStatus"
            homeworkDueAt = Get-DbDateText -Row $row -ColumnName "homeworkDueAt"
            homeworkUploadUrl = Get-DbValue $row "homeworkUploadUrl"
            homeworkSubmissionId = Get-DbValue $row "homeworkSubmissionId"
            submittedHomeworkUrl = Get-DbValue $row "submittedHomeworkUrl"
            submissionStatus = Get-DbValue $row "submissionStatus"
            feedbackUrl = Get-DbValue $row "feedbackUrl"
            feedbackText = Get-DbValue $row "feedbackText"
            homeworkScore = Get-DbValue $row "homeworkScore"
            checkedAt = Get-DbDateText -Row $row -ColumnName "checkedAt"
        }
    }

    $homeworkTotal = @($lessons | Where-Object { $_.homeworkAssignmentId }).Count
    $homeworkSubmitted = @($lessons | Where-Object { $_.homeworkStatus -in @("Submitted", "Checked") -or $_.submissionStatus -in @("Submitted", "Checked") }).Count
    $homeworkChecked = @($lessons | Where-Object { $_.homeworkStatus -eq "Checked" -or $_.submissionStatus -eq "Checked" }).Count
    $progressPercent = 0

    if ($homeworkTotal -gt 0)
    {
        $progressPercent = [math]::Round(($homeworkSubmitted * 100.0) / $homeworkTotal, 2)
    }

    return [ordered]@{
        source = "database"
        course = [ordered]@{
            courseId = [int](Get-DbValue $first "courseId")
            courseSlug = Get-DbValue $first "courseSlug"
            courseTitle = Get-DbValue $first "courseTitle"
            courseDescription = Get-DbValue $first "courseDescription"
            totalLessons = [int](Get-DbValue $first "totalLessons")
            lessonsTotal = [int](Get-DbValue $first "lessonsTotal")
            progressPercent = $progressPercent
            homeworkTotal = $homeworkTotal
            homeworkSubmitted = $homeworkSubmitted
            homeworkChecked = $homeworkChecked
        }
        lessons = $lessons
    }
}

function Get-HomeworksFromSqlServer
{
    param
    (
        [string]$CourseSlug,
        [int]$StudentId = 1
    )

    $connectionString = Get-ConnectionString
    $query = @"
SELECT
    C.Course_ID AS courseId,
    C.Course_Slug AS courseSlug,
    C.Course_Name AS courseTitle,
    L.Lesson_ID AS lessonId,
    L.Lesson_Number AS lessonNumber,
    L.Lesson_Title AS lessonTitle,
    HT.Homework_Template_ID AS homeworkTemplateId,
    HT.Homework_Name AS homeworkTitle,
    HT.Description AS homeworkDescription,
    HT.File_Link AS homeworkTaskUrl,
    HA.Homework_Assignment_ID AS homeworkAssignmentId,
    HA.Status AS homeworkStatus,
    HA.Due_Date AS homeworkDueAt,
    HA.Upload_Folder_Link AS homeworkUploadUrl,
    HS.Homework_Submission_ID AS homeworkSubmissionId,
    HS.File_Link AS submittedHomeworkUrl,
    HS.Status AS submissionStatus,
    HS.Feedback_Link AS feedbackUrl,
    HS.Feedback_Text AS feedbackText,
    HS.Score AS homeworkScore,
    HS.Checked_At AS checkedAt
FROM Courses AS C
JOIN Lessons AS L
    ON L.Course_ID = C.Course_ID
JOIN Homework_Templates AS HT
    ON HT.Course_ID = C.Course_ID
   AND HT.Lesson_ID = L.Lesson_ID
   AND HT.For_Online_Course = 1
   AND HT.Is_Active = 1
JOIN Course_Enrollments AS CE
    ON CE.Course_ID = C.Course_ID
   AND CE.Student_ID = @StudentId
LEFT JOIN Homework_Assignments AS HA
    ON HA.Homework_Template_ID = HT.Homework_Template_ID
   AND HA.Student_ID = @StudentId
   AND HA.Course_Enrollment_ID = CE.Course_Enrollment_ID
OUTER APPLY
(
    SELECT TOP 1 *
    FROM Homework_Submissions AS Submission
    WHERE Submission.Homework_Assignment_ID = HA.Homework_Assignment_ID
    ORDER BY Submission.Submitted_At DESC
) AS HS
WHERE (@CourseSlug IS NULL OR C.Course_Slug = @CourseSlug)
ORDER BY C.Course_ID, L.Lesson_Number;
"@

    $connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
    $command = $connection.CreateCommand()
    $command.CommandText = $query
    $parameter = $command.Parameters.Add("@CourseSlug", [System.Data.SqlDbType]::NVarChar, 50)

    if ([string]::IsNullOrWhiteSpace($CourseSlug))
    {
        $parameter.Value = [System.DBNull]::Value
    }
    else
    {
        $parameter.Value = $CourseSlug
    }
    Add-SqlParameter -Command $command -Name "@StudentId" -Type ([System.Data.SqlDbType]::Int) -Size 0 -Value $StudentId

    $table = New-Object System.Data.DataTable
    $adapter = New-Object System.Data.SqlClient.SqlDataAdapter($command)

    try
    {
        [void]$adapter.Fill($table)
    }
    finally
    {
        $connection.Close()
    }

    $items = @()

    foreach ($row in $table.Rows)
    {
        $items += [ordered]@{
            courseId = [int](Get-DbValue $row "courseId")
            courseSlug = Get-DbValue $row "courseSlug"
            courseTitle = Get-DbValue $row "courseTitle"
            lessonId = [int](Get-DbValue $row "lessonId")
            lessonNumber = [int](Get-DbValue $row "lessonNumber")
            lessonTitle = Get-DbValue $row "lessonTitle"
            homeworkTemplateId = Get-DbValue $row "homeworkTemplateId"
            homeworkTitle = Get-DbValue $row "homeworkTitle"
            homeworkDescription = Get-DbValue $row "homeworkDescription"
            homeworkTaskUrl = Get-DbValue $row "homeworkTaskUrl"
            homeworkAssignmentId = Get-DbValue $row "homeworkAssignmentId"
            homeworkStatus = Get-DbValue $row "homeworkStatus"
            homeworkDueAt = Get-DbDateText -Row $row -ColumnName "homeworkDueAt"
            homeworkUploadUrl = Get-DbValue $row "homeworkUploadUrl"
            homeworkSubmissionId = Get-DbValue $row "homeworkSubmissionId"
            submittedHomeworkUrl = Get-DbValue $row "submittedHomeworkUrl"
            submissionStatus = Get-DbValue $row "submissionStatus"
            feedbackUrl = Get-DbValue $row "feedbackUrl"
            feedbackText = Get-DbValue $row "feedbackText"
            homeworkScore = Get-DbValue $row "homeworkScore"
            checkedAt = Get-DbDateText -Row $row -ColumnName "checkedAt"
        }
    }

    return [ordered]@{
        source = "database"
        items = $items
    }
}

function Save-HomeworkSubmissionToSqlServer
{
    param
    (
        [int]$AssignmentId,
        [int]$StudentId,
        [string]$HomeworkLink
    )

    if ($AssignmentId -le 0)
    {
        throw "Homework assignment id is invalid."
    }

    if ($StudentId -le 0)
    {
        throw "Student id is invalid."
    }

    $HomeworkLink = Normalize-HomeworkLink -Value $HomeworkLink

    if (-not (Test-GoogleHomeworkLink -Value $HomeworkLink))
    {
        throw "A Google Drive homework link is required."
    }

    $connectionString = Get-ConnectionString
    $query = @"
IF NOT EXISTS
(
    SELECT 1
    FROM Homework_Assignments
    WHERE Homework_Assignment_ID = @AssignmentId
      AND Student_ID = @RequestStudentId
)
BEGIN
    THROW 51001, 'Homework assignment was not found for this student.', 1;
END;

IF EXISTS
(
    SELECT 1
    FROM Homework_Assignments AS HA
    LEFT JOIN Homework_Submissions AS HS
        ON HS.Homework_Assignment_ID = HA.Homework_Assignment_ID
    WHERE HA.Homework_Assignment_ID = @AssignmentId
      AND HA.Student_ID = @RequestStudentId
      AND (HA.Status = N'Checked' OR HS.Status = N'Checked')
)
BEGIN
    THROW 51002, 'Checked homework cannot be overwritten.', 1;
END;

DECLARE @SubmissionId INT;
DECLARE @StudentId INT;
DECLARE @EnrollmentId INT;
DECLARE @PointsAwarded INT = 0;
DECLARE @CourseProgressPercent DECIMAL(5,2) = 0;

SELECT
    @StudentId = Student_ID,
    @EnrollmentId = Course_Enrollment_ID
FROM Homework_Assignments
WHERE Homework_Assignment_ID = @AssignmentId
  AND Student_ID = @RequestStudentId;

SELECT TOP 1 @SubmissionId = Homework_Submission_ID
FROM Homework_Submissions
WHERE Homework_Assignment_ID = @AssignmentId
ORDER BY Submitted_At DESC;

UPDATE Homework_Assignments
SET Status = N'Submitted'
WHERE Homework_Assignment_ID = @AssignmentId
  AND Student_ID = @RequestStudentId;

IF @SubmissionId IS NULL
BEGIN
    INSERT INTO Homework_Submissions
        (Homework_Assignment_ID, Submitted_At, Student_Text, File_Link, Checked_By_Teacher_ID, Checked_At, Score, Feedback_Text, Status)
    VALUES
        (@AssignmentId, SYSDATETIME(), N'Ссылка на сданную работу прикреплена с сайта.', @HomeworkLink, NULL, NULL, NULL, NULL, N'Submitted');

    SET @SubmissionId = CONVERT(INT, SCOPE_IDENTITY());
END
ELSE
BEGIN
    UPDATE Homework_Submissions
    SET Submitted_At = SYSDATETIME(),
        Student_Text = N'Ссылка на сданную работу прикреплена с сайта.',
        File_Link = @HomeworkLink,
        Checked_By_Teacher_ID = NULL,
        Checked_At = NULL,
        Score = NULL,
        Feedback_Text = NULL,
        Feedback_Link = NULL,
        Status = N'Submitted'
    WHERE Homework_Submission_ID = @SubmissionId;
END;

IF NOT EXISTS
(
    SELECT 1
    FROM Point_Transactions
    WHERE Homework_Assignment_ID = @AssignmentId
      AND Student_ID = @StudentId
)
BEGIN
    INSERT INTO Point_Transactions (Student_ID, Course_Enrollment_ID, Homework_Assignment_ID, Points, Reason)
    VALUES (@StudentId, @EnrollmentId, @AssignmentId, 100, N'Баллы за сданное ДЗ');

    SET @PointsAwarded = 100;
END;

IF @EnrollmentId IS NOT NULL
BEGIN
    DECLARE @HomeworkTotal INT = 0;
    DECLARE @HomeworkChecked INT = 0;

    SELECT
        @HomeworkTotal = COUNT(*),
        @HomeworkChecked = SUM(CASE WHEN Status = N'Checked' THEN 1 ELSE 0 END)
    FROM Homework_Assignments
    WHERE Course_Enrollment_ID = @EnrollmentId
      AND Student_ID = @StudentId
      AND Status <> N'Cancelled';

    IF @HomeworkTotal > 0
    BEGIN
        SET @CourseProgressPercent = CAST(100.0 * @HomeworkChecked / @HomeworkTotal AS DECIMAL(5,2));
    END;

    UPDATE Course_Enrollments
    SET Progress_Percent = @CourseProgressPercent
    WHERE Course_Enrollment_ID = @EnrollmentId;
END;

SELECT
    HA.Homework_Assignment_ID,
    HA.Status AS Homework_Status,
    HS.Homework_Submission_ID,
    HS.File_Link,
    HS.Status AS Submission_Status,
    HS.Submitted_At,
    @PointsAwarded AS Points_Awarded,
    @CourseProgressPercent AS Course_Progress_Percent,
    (SELECT ISNULL(SUM(Points), 0) FROM Point_Transactions WHERE Student_ID = @StudentId) AS Points_Total
FROM Homework_Assignments AS HA
JOIN Homework_Submissions AS HS
    ON HS.Homework_Submission_ID = @SubmissionId
WHERE HA.Homework_Assignment_ID = @AssignmentId;
"@

    $connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
    $command = $connection.CreateCommand()
    $command.CommandText = $query

    Add-SqlParameter -Command $command -Name "@AssignmentId" -Type ([System.Data.SqlDbType]::Int) -Size 0 -Value $AssignmentId
    Add-SqlParameter -Command $command -Name "@RequestStudentId" -Type ([System.Data.SqlDbType]::Int) -Size 0 -Value $StudentId
    Add-SqlParameter -Command $command -Name "@HomeworkLink" -Type ([System.Data.SqlDbType]::NVarChar) -Size 1000 -Value $HomeworkLink.Trim()

    try
    {
        $connection.Open()
        $reader = $command.ExecuteReader()

        if (-not $reader.Read())
        {
            throw "Homework submission was not saved."
        }

        return [ordered]@{
            source = "database"
            homeworkAssignmentId = [int]$reader["Homework_Assignment_ID"]
            homeworkStatus = [string]$reader["Homework_Status"]
            homeworkSubmissionId = [int]$reader["Homework_Submission_ID"]
            submittedHomeworkUrl = [string]$reader["File_Link"]
            submissionStatus = [string]$reader["Submission_Status"]
            submittedAt = ([datetime]$reader["Submitted_At"]).ToString("s")
            pointsAwarded = [int]$reader["Points_Awarded"]
            courseProgressPercent = [decimal]$reader["Course_Progress_Percent"]
            pointsTotal = [int]$reader["Points_Total"]
        }
    }
    finally
    {
        if ($reader)
        {
            $reader.Close()
        }

        $connection.Close()
    }
}

function Get-NotesFromSqlServer
{
    param([string]$CourseSlug)

    $connectionString = Get-ConnectionString
    $query = @"
SELECT
    B.Books_and_notes_ID AS noteId,
    C.Course_ID AS courseId,
    C.Course_Slug AS courseSlug,
    C.Course_Name AS courseTitle,
    L.Lesson_ID AS lessonId,
    L.Lesson_Number AS lessonNumber,
    L.Lesson_Title AS lessonTitle,
    B.Material_Name AS materialTitle,
    B.Material_Type AS materialType,
    B.Author AS authorName,
    B.File_Link AS fileUrl
FROM Books_and_notes AS B
LEFT JOIN Courses AS C
    ON C.Course_ID = B.Course_ID
LEFT JOIN Lessons AS L
    ON L.Lesson_ID = B.Lesson_ID
WHERE (@CourseSlug IS NULL OR C.Course_Slug = @CourseSlug)
ORDER BY C.Course_ID, L.Lesson_Number, B.Books_and_notes_ID;
"@

    $connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
    $command = $connection.CreateCommand()
    $command.CommandText = $query
    $parameter = $command.Parameters.Add("@CourseSlug", [System.Data.SqlDbType]::NVarChar, 50)

    if ([string]::IsNullOrWhiteSpace($CourseSlug))
    {
        $parameter.Value = [System.DBNull]::Value
    }
    else
    {
        $parameter.Value = $CourseSlug
    }

    $table = New-Object System.Data.DataTable
    $adapter = New-Object System.Data.SqlClient.SqlDataAdapter($command)

    try
    {
        [void]$adapter.Fill($table)
    }
    finally
    {
        $connection.Close()
    }

    $items = @()

    foreach ($row in $table.Rows)
    {
        $lessonId = Get-DbValue $row "lessonId"
        $lessonNumber = Get-DbValue $row "lessonNumber"

        $items += [ordered]@{
            noteId = [int](Get-DbValue $row "noteId")
            courseId = Get-DbValue $row "courseId"
            courseSlug = Get-DbValue $row "courseSlug"
            courseTitle = Get-DbValue $row "courseTitle"
            lessonId = $lessonId
            lessonNumber = $lessonNumber
            lessonTitle = Get-DbValue $row "lessonTitle"
            materialTitle = Get-DbValue $row "materialTitle"
            materialType = Get-DbValue $row "materialType"
            authorName = Get-DbValue $row "authorName"
            fileUrl = Get-DbValue $row "fileUrl"
        }
    }

    return [ordered]@{
        source = "database"
        items = $items
    }
}

function Ensure-ChatTables
{
    $query = @"
IF OBJECT_ID(N'dbo.Chats', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Chats
    (
        Chat_ID INT IDENTITY(1,1) NOT NULL,
        Student_ID INT NOT NULL,
        Teacher_ID INT NULL,
        Curator_ID INT NULL,
        Chat_Name NVARCHAR(200) NOT NULL,
        Created_At DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
        Is_Active BIT NOT NULL DEFAULT 1,
        CONSTRAINT PK_Chats PRIMARY KEY (Chat_ID),
        CONSTRAINT FK_Chats_Students FOREIGN KEY (Student_ID) REFERENCES Students(Student_ID),
        CONSTRAINT FK_Chats_Teachers FOREIGN KEY (Teacher_ID) REFERENCES Teachers(Teacher_ID),
        CONSTRAINT FK_Chats_Curators FOREIGN KEY (Curator_ID) REFERENCES Curators(Curator_ID)
    );
END;

IF OBJECT_ID(N'dbo.Chat_Messages', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Chat_Messages
    (
        Chat_Message_ID INT IDENTITY(1,1) NOT NULL,
        Chat_ID INT NOT NULL,
        Sender_Role NVARCHAR(30) NOT NULL,
        Sender_Name NVARCHAR(150) NOT NULL,
        Message_Text NVARCHAR(MAX) NOT NULL,
        Sent_At DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
        Is_Read BIT NOT NULL DEFAULT 0,
        CONSTRAINT PK_Chat_Messages PRIMARY KEY (Chat_Message_ID),
        CONSTRAINT FK_Chat_Messages_Chats FOREIGN KEY (Chat_ID) REFERENCES Chats(Chat_ID),
        CONSTRAINT CHK_Chat_Messages_Sender_Role CHECK (Sender_Role IN (N'Student', N'Parent', N'Teacher', N'Curator', N'System'))
    );
END;
"@

    $connection = New-Object System.Data.SqlClient.SqlConnection(Get-ConnectionString)
    $command = $connection.CreateCommand()
    $command.CommandText = $query

    try
    {
        $connection.Open()
        [void]$command.ExecuteNonQuery()
    }
    finally
    {
        $connection.Close()
    }
}

function Ensure-StudentCourseChats
{
    param([int]$StudentId = 0)

    Ensure-ChatTables
    $query = @"
WITH EnrolledCourses AS
(
    SELECT
        CE.Student_ID,
        CONCAT(S.First_Name, N' ', S.Last_Name) AS Student_Name,
        C.Course_ID,
        C.Course_Name,
        C.Teacher_ID,
        C.Curator_ID
    FROM Course_Enrollments AS CE
    JOIN Students AS S
        ON S.Student_ID = CE.Student_ID
    JOIN Courses AS C
        ON C.Course_ID = CE.Course_ID
    WHERE CE.Status = N'Active'
      AND C.Status = N'Active'
      AND (@StudentId = 0 OR CE.Student_ID = @StudentId)
)
INSERT INTO Chats (Student_ID, Teacher_ID, Curator_ID, Chat_Name)
SELECT
    EC.Student_ID,
    EC.Teacher_ID,
    EC.Curator_ID,
    CONCAT(EC.Course_Name, N': ', EC.Student_Name)
FROM EnrolledCourses AS EC
WHERE NOT EXISTS
(
    SELECT 1
    FROM Chats AS ExistingChats
    WHERE ExistingChats.Student_ID = EC.Student_ID
      AND ExistingChats.Is_Active = 1
      AND ExistingChats.Chat_Name = CONCAT(EC.Course_Name, N': ', EC.Student_Name)
);

INSERT INTO Chat_Messages (Chat_ID, Sender_Role, Sender_Name, Message_Text)
SELECT
    C.Chat_ID,
    N'System',
    N'Онлайн-школа',
    N'Чат создан. Здесь можно писать куратору и преподавателю курса.'
FROM Chats AS C
WHERE C.Is_Active = 1
  AND (@StudentId = 0 OR C.Student_ID = @StudentId)
  AND NOT EXISTS
  (
      SELECT 1
      FROM Chat_Messages AS CM
      WHERE CM.Chat_ID = C.Chat_ID
  );
"@

    $connection = New-Object System.Data.SqlClient.SqlConnection(Get-ConnectionString)
    $command = $connection.CreateCommand()
    $command.CommandText = $query
    Add-SqlParameter -Command $command -Name "@StudentId" -Type ([System.Data.SqlDbType]::Int) -Size 0 -Value $StudentId

    try
    {
        $connection.Open()
        [void]$command.ExecuteNonQuery()
    }
    finally
    {
        $connection.Close()
    }
}

function Get-StudentDisplayName
{
    param([int]$StudentId)

    $query = "SELECT CONCAT(First_Name, N' ', Last_Name) FROM Students WHERE Student_ID = @StudentId;"
    $connection = New-Object System.Data.SqlClient.SqlConnection(Get-ConnectionString)
    $command = $connection.CreateCommand()
    $command.CommandText = $query
    Add-SqlParameter -Command $command -Name "@StudentId" -Type ([System.Data.SqlDbType]::Int) -Size 0 -Value $StudentId

    try
    {
        $connection.Open()
        $name = $command.ExecuteScalar()
    }
    finally
    {
        $connection.Close()
    }

    if ($null -eq $name -or [System.DBNull]::Value.Equals($name))
    {
        return "Ученик"
    }

    return [string]$name
}

function Get-MessageActor
{
    param([System.Net.HttpListenerContext]$Context)

    $staff = Get-RequestStaff -Context $Context

    if ($staff)
    {
        return [ordered]@{
            role = $staff.role
            name = $staff.name
            staffId = $staff.staffId
            teacherId = $staff.teacherId
            curatorId = $staff.curatorId
            studentId = $null
        }
    }

    $studentId = Get-RequestStudentId -Context $Context

    if ($studentId -gt 0)
    {
        return [ordered]@{
            role = "Student"
            name = Get-StudentDisplayName -StudentId $studentId
            staffId = $null
            teacherId = $null
            curatorId = $null
            studentId = $studentId
        }
    }

    return $null
}

function Ensure-StudentChat
{
    param([int]$StudentId)

    Ensure-ChatTables
    Ensure-StudentCourseChats -StudentId $StudentId
    $query = @"
DECLARE @ChatId INT;
DECLARE @TeacherId INT;
DECLARE @CuratorId INT;
DECLARE @StudentName NVARCHAR(150);

SELECT TOP 1 @ChatId = Chat_ID
FROM Chats
WHERE Student_ID = @StudentId
  AND Is_Active = 1
ORDER BY Chat_ID;

IF @ChatId IS NULL
BEGIN
    SELECT TOP 1 @TeacherId = Teacher_ID FROM Teachers WHERE Is_Active = 1 ORDER BY Teacher_ID;
    SELECT TOP 1 @CuratorId = Curator_ID FROM Curators WHERE Is_Active = 1 ORDER BY Curator_ID;
    SELECT @StudentName = CONCAT(First_Name, N' ', Last_Name) FROM Students WHERE Student_ID = @StudentId;

    INSERT INTO Chats (Student_ID, Teacher_ID, Curator_ID, Chat_Name)
    VALUES (@StudentId, @TeacherId, @CuratorId, CONCAT(N'Учебный чат: ', ISNULL(@StudentName, N'ученик')));

    SET @ChatId = CONVERT(INT, SCOPE_IDENTITY());

    INSERT INTO Chat_Messages (Chat_ID, Sender_Role, Sender_Name, Message_Text)
    VALUES (@ChatId, N'System', N'Онлайн-школа', N'Чат создан. Здесь можно писать куратору и преподавателю.');
END;

SELECT @ChatId;
"@

    $connection = New-Object System.Data.SqlClient.SqlConnection(Get-ConnectionString)
    $command = $connection.CreateCommand()
    $command.CommandText = $query
    Add-SqlParameter -Command $command -Name "@StudentId" -Type ([System.Data.SqlDbType]::Int) -Size 0 -Value $StudentId

    try
    {
        $connection.Open()
        return [int]$command.ExecuteScalar()
    }
    finally
    {
        $connection.Close()
    }
}

function Get-ConversationsFromSqlServer
{
    param($Actor)

    Ensure-ChatTables
    Ensure-StudentCourseChats
    $query = @"
SELECT
    C.Chat_ID,
    C.Chat_Name,
    C.Created_At,
    CONCAT(S.First_Name, N' ', S.Last_Name) AS Student_Name,
    CASE
        WHEN C.Teacher_ID IS NOT NULL THEN CONCAT(T.First_Name, N' ', T.Last_Name)
        WHEN C.Curator_ID IS NOT NULL THEN CONCAT(CU.First_Name, N' ', CU.Last_Name)
        ELSE N'Команда курса'
    END AS Staff_Name,
    ISNULL(MAX(CM.Sent_At), C.Created_At) AS Last_Message_At
FROM Chats AS C
JOIN Students AS S
    ON S.Student_ID = C.Student_ID
LEFT JOIN Teachers AS T
    ON T.Teacher_ID = C.Teacher_ID
LEFT JOIN Curators AS CU
    ON CU.Curator_ID = C.Curator_ID
LEFT JOIN Chat_Messages AS CM
    ON CM.Chat_ID = C.Chat_ID
WHERE C.Is_Active = 1
  AND
  (
      (@Role = N'Student' AND C.Student_ID = @StudentId)
      OR (@Role = N'Teacher' AND (@TeacherId IS NULL OR C.Teacher_ID = @TeacherId OR C.Teacher_ID IS NULL))
      OR (@Role = N'Curator' AND (@CuratorId IS NULL OR C.Curator_ID = @CuratorId OR C.Curator_ID IS NULL))
  )
GROUP BY C.Chat_ID, C.Chat_Name, C.Created_At, S.First_Name, S.Last_Name, C.Teacher_ID, C.Curator_ID, T.First_Name, T.Last_Name, CU.First_Name, CU.Last_Name
ORDER BY ISNULL(MAX(CM.Sent_At), C.Created_At) DESC;
"@

    $connection = New-Object System.Data.SqlClient.SqlConnection(Get-ConnectionString)
    $command = $connection.CreateCommand()
    $command.CommandText = $query
    Add-SqlParameter -Command $command -Name "@Role" -Type ([System.Data.SqlDbType]::NVarChar) -Size 30 -Value $Actor.role
    Add-SqlParameter -Command $command -Name "@StudentId" -Type ([System.Data.SqlDbType]::Int) -Size 0 -Value $Actor.studentId
    Add-SqlParameter -Command $command -Name "@TeacherId" -Type ([System.Data.SqlDbType]::Int) -Size 0 -Value $Actor.teacherId
    Add-SqlParameter -Command $command -Name "@CuratorId" -Type ([System.Data.SqlDbType]::Int) -Size 0 -Value $Actor.curatorId
    $table = New-Object System.Data.DataTable
    $adapter = New-Object System.Data.SqlClient.SqlDataAdapter($command)

    try
    {
        [void]$adapter.Fill($table)
    }
    finally
    {
        $connection.Close()
    }

    $items = @()

    foreach ($row in $table.Rows)
    {
        $items += [ordered]@{
            conversationId = [int](Get-DbValue $row "Chat_ID")
            title = Get-DbValue $row "Chat_Name"
            studentName = Get-DbValue $row "Student_Name"
            staffName = Get-DbValue $row "Staff_Name"
            createdAt = Get-DbDateText -Row $row -ColumnName "Created_At"
            lastMessageAt = Get-DbDateText -Row $row -ColumnName "Last_Message_At"
        }
    }

    return $items
}

function Get-ConversationMessagesFromSqlServer
{
    param
    (
        [int]$ConversationId,
        $Actor
    )

    $query = @"
SELECT Chat_Message_ID, Sender_Role, Sender_Name, Message_Text, Sent_At
FROM Chat_Messages
WHERE Chat_ID = @ConversationId
ORDER BY Sent_At, Chat_Message_ID;
"@

    $connection = New-Object System.Data.SqlClient.SqlConnection(Get-ConnectionString)
    $command = $connection.CreateCommand()
    $command.CommandText = $query
    Add-SqlParameter -Command $command -Name "@ConversationId" -Type ([System.Data.SqlDbType]::Int) -Size 0 -Value $ConversationId
    $table = New-Object System.Data.DataTable
    $adapter = New-Object System.Data.SqlClient.SqlDataAdapter($command)

    try
    {
        [void]$adapter.Fill($table)
    }
    finally
    {
        $connection.Close()
    }

    $items = @()

    foreach ($row in $table.Rows)
    {
        $senderRole = [string](Get-DbValue $row "Sender_Role")
        $items += [ordered]@{
            messageId = [int](Get-DbValue $row "Chat_Message_ID")
            senderRole = $senderRole
            senderName = Get-DbValue $row "Sender_Name"
            messageText = Get-DbValue $row "Message_Text"
            sentAt = Get-DbDateText -Row $row -ColumnName "Sent_At"
            isOwn = ($senderRole -eq $Actor.role)
        }
    }

    return $items
}

function Get-MessagesFromSqlServer
{
    param
    (
        [System.Net.HttpListenerContext]$Context,
        [int]$ConversationId = 0
    )

    $actor = Get-MessageActor -Context $Context

    if (-not $actor)
    {
        throw "Unauthorized."
    }

    if ($actor.role -eq "Student")
    {
        [void](Ensure-StudentChat -StudentId ([int]$actor.studentId))
    }

    $conversations = @(Get-ConversationsFromSqlServer -Actor $actor)

    if ($conversations.Count -eq 0)
    {
        return [ordered]@{
            source = "database"
            activeConversationId = $null
            actorRole = $actor.role
            conversations = @()
            messages = @()
        }
    }

    $activeConversation = $conversations | Where-Object { [int]$_.conversationId -eq $ConversationId } | Select-Object -First 1

    if (-not $activeConversation)
    {
        $activeConversation = $conversations[0]
    }

    $messages = @(Get-ConversationMessagesFromSqlServer -ConversationId ([int]$activeConversation.conversationId) -Actor $actor)

    return [ordered]@{
        source = "database"
        activeConversationId = [int]$activeConversation.conversationId
        actorRole = $actor.role
        conversations = $conversations
        messages = $messages
    }
}

function Save-MessageToSqlServer
{
    param
    (
        [System.Net.HttpListenerContext]$Context,
        $Payload
    )

    $actor = Get-MessageActor -Context $Context

    if (-not $actor)
    {
        throw "Unauthorized."
    }

    $messageText = Get-TextValue -Object $Payload -Name "messageText" -MaxLength 4000

    if ([string]::IsNullOrWhiteSpace($messageText))
    {
        throw "Message text is required."
    }

    $conversationId = Get-IntValue -Object $Payload -Name "conversationId"

    if ($actor.role -eq "Student" -and ($null -eq $conversationId -or $conversationId -le 0))
    {
        $conversationId = Ensure-StudentChat -StudentId ([int]$actor.studentId)
    }

    if ($null -eq $conversationId -or $conversationId -le 0)
    {
        throw "Conversation is required."
    }

    $allowedConversations = @(Get-ConversationsFromSqlServer -Actor $actor)
    $isAllowed = $allowedConversations | Where-Object { [int]$_.conversationId -eq [int]$conversationId } | Select-Object -First 1

    if (-not $isAllowed)
    {
        throw "Conversation is unavailable."
    }

    $query = @"
INSERT INTO Chat_Messages (Chat_ID, Sender_Role, Sender_Name, Message_Text)
VALUES (@ConversationId, @SenderRole, @SenderName, @MessageText);
"@

    $connection = New-Object System.Data.SqlClient.SqlConnection(Get-ConnectionString)
    $command = $connection.CreateCommand()
    $command.CommandText = $query
    Add-SqlParameter -Command $command -Name "@ConversationId" -Type ([System.Data.SqlDbType]::Int) -Size 0 -Value $conversationId
    Add-SqlParameter -Command $command -Name "@SenderRole" -Type ([System.Data.SqlDbType]::NVarChar) -Size 30 -Value $actor.role
    Add-SqlParameter -Command $command -Name "@SenderName" -Type ([System.Data.SqlDbType]::NVarChar) -Size 150 -Value $actor.name
    Add-SqlParameter -Command $command -Name "@MessageText" -Type ([System.Data.SqlDbType]::NVarChar) -Size 4000 -Value $messageText

    try
    {
        $connection.Open()
        [void]$command.ExecuteNonQuery()
    }
    finally
    {
        $connection.Close()
    }

    return Get-MessagesFromSqlServer -Context $Context -ConversationId ([int]$conversationId)
}

function Ensure-LiveStreamSchedule
{
    $query = @"
IF OBJECT_ID(N'dbo.Live_Streams', N'U') IS NOT NULL
BEGIN
    IF COL_LENGTH(N'dbo.Live_Streams', N'Created_At') IS NULL
    BEGIN
        ALTER TABLE dbo.Live_Streams
        ADD Created_At DATETIME2 NOT NULL CONSTRAINT DF_Live_Streams_Created_At DEFAULT SYSDATETIME();
    END;

    WITH CourseRows AS
    (
        SELECT
            C.Course_ID,
            C.Course_Name,
            C.Course_Slug,
            MIN(L.Lesson_ID) AS Lesson_ID,
            ROW_NUMBER() OVER (ORDER BY C.Course_ID) AS Row_Num
        FROM Courses AS C
        LEFT JOIN Lessons AS L
            ON L.Course_ID = C.Course_ID
        WHERE C.Status = N'Active'
        GROUP BY C.Course_ID, C.Course_Name, C.Course_Slug
    )
    INSERT INTO Live_Streams (Course_ID, Lesson_ID, Stream_Title, Starts_At, Ends_At, Stream_Link, Status)
    SELECT
        CR.Course_ID,
        CR.Lesson_ID,
        CONCAT(N'Ближайший эфир: ', CR.Course_Name),
        DATEADD(hour, 18 + CR.Row_Num * 24, SYSDATETIME()),
        DATEADD(hour, 20 + CR.Row_Num * 24, SYSDATETIME()),
        CASE CR.Course_Slug
            WHEN N'math' THEN N'https://meet.google.com/yar-math-001'
            WHEN N'russian' THEN N'https://meet.google.com/yar-rus-001'
            WHEN N'informatics' THEN N'https://meet.google.com/yar-it-001'
            WHEN N'physics' THEN N'https://meet.google.com/yar-phys-001'
            ELSE CONCAT(N'https://meet.google.com/yar-course-', CR.Course_ID)
        END,
        N'Planned'
    FROM CourseRows AS CR
    WHERE NOT EXISTS
    (
        SELECT 1
        FROM Live_Streams AS ExistingStreams
        WHERE ExistingStreams.Course_ID = CR.Course_ID
          AND ExistingStreams.Status IN (N'Planned', N'Live')
          AND ExistingStreams.Starts_At >= DATEADD(hour, -1, SYSDATETIME())
    );

    UPDATE LS
    SET Stream_Link =
        CASE C.Course_Slug
            WHEN N'math' THEN N'https://meet.google.com/yar-math-001'
            WHEN N'russian' THEN N'https://meet.google.com/yar-rus-001'
            WHEN N'informatics' THEN N'https://meet.google.com/yar-it-001'
            WHEN N'physics' THEN N'https://meet.google.com/yar-phys-001'
            ELSE CONCAT(N'https://meet.google.com/yar-course-', C.Course_ID)
        END
    FROM Live_Streams AS LS
    JOIN Courses AS C
        ON C.Course_ID = LS.Course_ID
    WHERE LS.Status IN (N'Planned', N'Live')
      AND LS.Starts_At >= DATEADD(hour, -1, SYSDATETIME())
      AND (LS.Stream_Link IS NULL OR LS.Stream_Link = N'' OR LS.Stream_Link LIKE N'https://example.com/live/%');
END;
"@

    $connection = New-Object System.Data.SqlClient.SqlConnection(Get-ConnectionString)
    $command = $connection.CreateCommand()
    $command.CommandText = $query

    try
    {
        $connection.Open()
        [void]$command.ExecuteNonQuery()
    }
    finally
    {
        $connection.Close()
    }
}

function Get-StreamsFromSqlServer
{
    param([string]$CourseSlug)

    Ensure-LiveStreamSchedule
    $query = @"
SELECT
    LS.Live_Stream_ID,
    C.Course_Slug,
    C.Course_Name,
    L.Lesson_Number,
    L.Lesson_Title,
    LS.Stream_Title,
    LS.Starts_At,
    LS.Ends_At,
    LS.Stream_Link,
    LS.Record_Link,
    LS.Status
FROM Live_Streams AS LS
JOIN Courses AS C
    ON C.Course_ID = LS.Course_ID
LEFT JOIN Lessons AS L
    ON L.Lesson_ID = LS.Lesson_ID
WHERE (@CourseSlug IS NULL OR C.Course_Slug = @CourseSlug)
  AND LS.Status IN (N'Planned', N'Live')
  AND LS.Starts_At >= DATEADD(hour, -1, SYSDATETIME())
ORDER BY LS.Starts_At, LS.Live_Stream_ID;
"@

    $connection = New-Object System.Data.SqlClient.SqlConnection(Get-ConnectionString)
    $command = $connection.CreateCommand()
    $command.CommandText = $query
    $parameter = $command.Parameters.Add("@CourseSlug", [System.Data.SqlDbType]::NVarChar, 50)

    if ([string]::IsNullOrWhiteSpace($CourseSlug))
    {
        $parameter.Value = [System.DBNull]::Value
    }
    else
    {
        $parameter.Value = $CourseSlug
    }

    $table = New-Object System.Data.DataTable
    $adapter = New-Object System.Data.SqlClient.SqlDataAdapter($command)

    try
    {
        [void]$adapter.Fill($table)
    }
    finally
    {
        $connection.Close()
    }

    $items = @()

    foreach ($row in $table.Rows)
    {
        $items += [ordered]@{
            streamId = [int](Get-DbValue $row "Live_Stream_ID")
            courseSlug = Get-DbValue $row "Course_Slug"
            courseTitle = Get-DbValue $row "Course_Name"
            lessonNumber = Get-DbValue $row "Lesson_Number"
            lessonTitle = Get-DbValue $row "Lesson_Title"
            streamTitle = Get-DbValue $row "Stream_Title"
            startsAt = Get-DbDateText -Row $row -ColumnName "Starts_At"
            endsAt = Get-DbDateText -Row $row -ColumnName "Ends_At"
            streamLink = Get-DbValue $row "Stream_Link"
            recordLink = Get-DbValue $row "Record_Link"
            status = Get-DbValue $row "Status"
        }
    }

    return [ordered]@{
        source = "database"
        items = $items
    }
}

function Ensure-StaffWorkspaceTables
{
    $query = @"
IF OBJECT_ID(N'dbo.Staff_Resource_Reviews', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Staff_Resource_Reviews
    (
        Review_ID INT IDENTITY(1,1) NOT NULL,
        Staff_Role NVARCHAR(30) NOT NULL,
        Staff_ID INT NOT NULL,
        Resource_Type NVARCHAR(40) NOT NULL,
        Resource_ID INT NOT NULL,
        Rating INT NULL,
        Comment_Text NVARCHAR(1200) NULL,
        Created_At DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
        Updated_At DATETIME2 NULL,
        CONSTRAINT PK_Staff_Resource_Reviews PRIMARY KEY (Review_ID),
        CONSTRAINT UQ_Staff_Resource_Reviews UNIQUE (Staff_Role, Staff_ID, Resource_Type, Resource_ID),
        CONSTRAINT CHK_Staff_Resource_Reviews_Rating CHECK (Rating BETWEEN 1 AND 10 OR Rating IS NULL)
    );
END;

IF OBJECT_ID(N'dbo.Staff_Resource_Reviews', N'U') IS NOT NULL
   AND EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = N'CHK_Staff_Resource_Reviews_Rating' AND parent_object_id = OBJECT_ID(N'dbo.Staff_Resource_Reviews'))
BEGIN
    ALTER TABLE dbo.Staff_Resource_Reviews DROP CONSTRAINT CHK_Staff_Resource_Reviews_Rating;
    ALTER TABLE dbo.Staff_Resource_Reviews
    ADD CONSTRAINT CHK_Staff_Resource_Reviews_Rating CHECK (Rating BETWEEN 1 AND 10 OR Rating IS NULL);
END;

IF OBJECT_ID(N'dbo.Teachers', N'U') IS NOT NULL
BEGIN
    IF EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = N'CHK_Teachers_Rating' AND parent_object_id = OBJECT_ID(N'dbo.Teachers'))
    BEGIN
        ALTER TABLE dbo.Teachers DROP CONSTRAINT CHK_Teachers_Rating;
    END;

    ALTER TABLE dbo.Teachers ALTER COLUMN Average_Rating DECIMAL(4,2) NULL;

    UPDATE dbo.Teachers
    SET Average_Rating =
        CASE
            WHEN Average_Rating IS NULL THEN NULL
            WHEN Average_Rating > 0 AND Average_Rating <= 5 THEN CONVERT(DECIMAL(4,2), Average_Rating * 2)
            WHEN Average_Rating > 10 THEN 10
            WHEN Average_Rating < 1 THEN 1
            ELSE Average_Rating
        END
    WHERE Average_Rating IS NOT NULL
      AND (Average_Rating < 1 OR Average_Rating <= 5 OR Average_Rating > 10);

    ALTER TABLE dbo.Teachers
    ADD CONSTRAINT CHK_Teachers_Rating CHECK (Average_Rating BETWEEN 1 AND 10 OR Average_Rating IS NULL);
END;

IF OBJECT_ID(N'dbo.Curators', N'U') IS NOT NULL
BEGIN
    IF EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = N'CHK_Curators_Rating' AND parent_object_id = OBJECT_ID(N'dbo.Curators'))
    BEGIN
        ALTER TABLE dbo.Curators DROP CONSTRAINT CHK_Curators_Rating;
    END;

    ALTER TABLE dbo.Curators ALTER COLUMN Average_Rating DECIMAL(4,2) NULL;

    UPDATE dbo.Curators
    SET Average_Rating =
        CASE
            WHEN Average_Rating IS NULL THEN NULL
            WHEN Average_Rating > 0 AND Average_Rating <= 5 THEN CONVERT(DECIMAL(4,2), Average_Rating * 2)
            WHEN Average_Rating > 10 THEN 10
            WHEN Average_Rating < 1 THEN 1
            ELSE Average_Rating
        END
    WHERE Average_Rating IS NOT NULL
      AND (Average_Rating < 1 OR Average_Rating <= 5 OR Average_Rating > 10);

    ALTER TABLE dbo.Curators
    ADD CONSTRAINT CHK_Curators_Rating CHECK (Average_Rating BETWEEN 1 AND 10 OR Average_Rating IS NULL);
END;

IF OBJECT_ID(N'dbo.Feedbacks', N'U') IS NOT NULL
BEGIN
    IF EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = N'CHK_Feedbacks_Mark' AND parent_object_id = OBJECT_ID(N'dbo.Feedbacks'))
    BEGIN
        ALTER TABLE dbo.Feedbacks DROP CONSTRAINT CHK_Feedbacks_Mark;
    END;

    UPDATE dbo.Feedbacks
    SET Mark =
        CASE
            WHEN Mark IS NULL THEN NULL
            WHEN Mark > 0 AND Mark <= 5 THEN Mark * 2
            WHEN Mark > 10 THEN 10
            WHEN Mark < 1 THEN 1
            ELSE Mark
        END
    WHERE Mark IS NOT NULL
      AND (Mark < 1 OR Mark <= 5 OR Mark > 10);

    ALTER TABLE dbo.Feedbacks
    ADD CONSTRAINT CHK_Feedbacks_Mark CHECK (Mark BETWEEN 1 AND 10 OR Mark IS NULL);
END;

IF OBJECT_ID(N'dbo.Student_Staff_Comments', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Student_Staff_Comments
    (
        Comment_ID INT IDENTITY(1,1) NOT NULL,
        Student_ID INT NOT NULL,
        Staff_Role NVARCHAR(30) NOT NULL,
        Staff_ID INT NOT NULL,
        Comment_Text NVARCHAR(1200) NOT NULL,
        Created_At DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
        CONSTRAINT PK_Student_Staff_Comments PRIMARY KEY (Comment_ID),
        CONSTRAINT FK_Student_Staff_Comments_Students FOREIGN KEY (Student_ID) REFERENCES Students(Student_ID)
    );
END;

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_Staff_Resource_Reviews_Resource' AND object_id = OBJECT_ID(N'dbo.Staff_Resource_Reviews'))
BEGIN
    CREATE INDEX IX_Staff_Resource_Reviews_Resource ON dbo.Staff_Resource_Reviews(Resource_Type, Resource_ID);
END;

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_Student_Staff_Comments_Student_ID' AND object_id = OBJECT_ID(N'dbo.Student_Staff_Comments'))
BEGIN
    CREATE INDEX IX_Student_Staff_Comments_Student_ID ON dbo.Student_Staff_Comments(Student_ID, Created_At DESC);
END;

IF OBJECT_ID(N'dbo.Homework_Templates', N'U') IS NOT NULL
BEGIN
    UPDATE dbo.Homework_Templates
    SET Max_Score = 10
    WHERE Max_Score <> 10;
END;

IF OBJECT_ID(N'dbo.Homework_Submissions', N'U') IS NOT NULL
BEGIN
    UPDATE dbo.Homework_Submissions
    SET Score =
        CASE
            WHEN Score IS NULL THEN NULL
            WHEN Score > 10 THEN
                CASE
                    WHEN CONVERT(INT, ROUND(Score / 10.0, 0)) < 1 THEN 1
                    WHEN CONVERT(INT, ROUND(Score / 10.0, 0)) > 10 THEN 10
                    ELSE CONVERT(INT, ROUND(Score / 10.0, 0))
                END
            WHEN Score < 1 THEN 1
            ELSE Score
        END
    WHERE Score IS NOT NULL AND (Score < 1 OR Score > 10);

    IF EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = N'CHK_Homework_Submissions_Score' AND parent_object_id = OBJECT_ID(N'dbo.Homework_Submissions'))
    BEGIN
        ALTER TABLE dbo.Homework_Submissions DROP CONSTRAINT CHK_Homework_Submissions_Score;
    END;

    ALTER TABLE dbo.Homework_Submissions
    ADD CONSTRAINT CHK_Homework_Submissions_Score CHECK (Score BETWEEN 1 AND 10 OR Score IS NULL);
END;
"@

    $connection = New-Object System.Data.SqlClient.SqlConnection(Get-ConnectionString)
    $command = $connection.CreateCommand()
    $command.CommandText = $query

    try
    {
        $connection.Open()
        [void]$command.ExecuteNonQuery()
    }
    finally
    {
        $connection.Close()
    }
}

function Add-StaffScopeParameters
{
    param
    (
        [System.Data.SqlClient.SqlCommand]$Command,
        $Staff
    )

    Add-SqlParameter -Command $Command -Name "@Role" -Type ([System.Data.SqlDbType]::NVarChar) -Size 30 -Value $Staff.role
    Add-SqlParameter -Command $Command -Name "@TeacherId" -Type ([System.Data.SqlDbType]::Int) -Size 0 -Value $Staff.teacherId
    Add-SqlParameter -Command $Command -Name "@CuratorId" -Type ([System.Data.SqlDbType]::Int) -Size 0 -Value $Staff.curatorId
    Add-SqlParameter -Command $Command -Name "@StaffId" -Type ([System.Data.SqlDbType]::Int) -Size 0 -Value $Staff.staffId
}

function Get-StaffScopedTable
{
    param
    (
        [string]$Query,
        $Staff
    )

    $connection = New-Object System.Data.SqlClient.SqlConnection(Get-ConnectionString)
    $command = $connection.CreateCommand()
    $command.CommandText = $Query
    Add-StaffScopeParameters -Command $command -Staff $Staff
    $table = New-Object System.Data.DataTable
    $adapter = New-Object System.Data.SqlClient.SqlDataAdapter($command)

    try
    {
        [void]$adapter.Fill($table)
    }
    finally
    {
        $connection.Close()
    }

    return $table
}

function Convert-StaffWorkspaceTable
{
    param
    (
        $Table,
        [scriptblock]$Mapper
    )

    $items = @()
    $rows = @()

    if ($Table -is [System.Data.DataTable])
    {
        $rows = @($Table.Rows)
    }
    elseif ($Table -is [System.Data.DataRow])
    {
        $rows = @($Table)
    }
    elseif ($null -ne $Table)
    {
        $rows = @($Table)
    }

    foreach ($row in $rows)
    {
        $items += & $Mapper $row
    }

    return $items
}

function Get-StaffWorkspaceFromSqlServer
{
    param([System.Net.HttpListenerContext]$Context)

    $staff = Get-RequestStaff -Context $Context

    if (-not $staff)
    {
        throw "Unauthorized."
    }

    Ensure-StaffWorkspaceTables
    Ensure-StudentCourseChats
    Ensure-LiveStreamSchedule

    $scopeWhere = "((@Role = N'Teacher' AND C.Teacher_ID = @TeacherId) OR (@Role = N'Curator' AND C.Curator_ID = @CuratorId))"
    $coursesQuery = @"
SELECT
    C.Course_ID,
    C.Course_Slug,
    C.Course_Name,
    C.Short_Description,
    C.Total_Lessons,
    CONCAT(T.First_Name, N' ', T.Last_Name) AS Teacher_Name,
    CONCAT(CU.First_Name, N' ', CU.Last_Name) AS Curator_Name,
    COUNT(DISTINCT CE.Student_ID) AS Students_Count,
    COUNT(DISTINCT L.Lesson_ID) AS Lessons_Count,
    COUNT(DISTINCT HA.Homework_Assignment_ID) AS Homeworks_Count,
    COUNT(DISTINCT LS.Live_Stream_ID) AS Streams_Count
FROM Courses AS C
LEFT JOIN Teachers AS T ON T.Teacher_ID = C.Teacher_ID
LEFT JOIN Curators AS CU ON CU.Curator_ID = C.Curator_ID
LEFT JOIN Course_Enrollments AS CE ON CE.Course_ID = C.Course_ID AND CE.Status = N'Active'
LEFT JOIN Lessons AS L ON L.Course_ID = C.Course_ID
LEFT JOIN Homework_Assignments AS HA ON HA.Course_Enrollment_ID = CE.Course_Enrollment_ID AND HA.Status <> N'Cancelled'
LEFT JOIN Live_Streams AS LS ON LS.Course_ID = C.Course_ID AND LS.Status IN (N'Planned', N'Live')
WHERE C.Status = N'Active' AND $scopeWhere
GROUP BY C.Course_ID, C.Course_Slug, C.Course_Name, C.Short_Description, C.Total_Lessons, T.First_Name, T.Last_Name, CU.First_Name, CU.Last_Name
ORDER BY C.Course_ID;
"@

    $studentsQuery = @"
SELECT
    S.Student_ID,
    CONCAT(S.First_Name, N' ', S.Last_Name) AS Student_Name,
    S.Phone,
    S.Email,
    S.Grade,
    C.Course_ID,
    C.Course_Slug,
    C.Course_Name,
    CE.Progress_Percent,
    CE.Status AS Enrollment_Status,
    ISNULL((SELECT SUM(PT.Points) FROM Point_Transactions AS PT WHERE PT.Student_ID = S.Student_ID), 0) AS Points_Total,
    (SELECT TOP 1 Comment_Text FROM Student_Staff_Comments AS SC WHERE SC.Student_ID = S.Student_ID ORDER BY SC.Created_At DESC) AS Last_Comment,
    (SELECT TOP 1 Created_At FROM Student_Staff_Comments AS SC WHERE SC.Student_ID = S.Student_ID ORDER BY SC.Created_At DESC) AS Last_Comment_At
FROM Course_Enrollments AS CE
JOIN Students AS S ON S.Student_ID = CE.Student_ID
JOIN Courses AS C ON C.Course_ID = CE.Course_ID
WHERE CE.Status = N'Active' AND C.Status = N'Active' AND $scopeWhere
ORDER BY C.Course_ID, S.Last_Name, S.First_Name, S.Student_ID;
"@

    $teachersQuery = @"
SELECT
    T.Teacher_ID,
    CONCAT(T.First_Name, N' ', T.Last_Name) AS Teacher_Name,
    T.Phone,
    T.Email,
    T.Telegram_Link,
    T.Average_Rating,
    COUNT(DISTINCT C.Course_ID) AS Courses_Count,
    COUNT(DISTINCT CE.Student_ID) AS Students_Count
FROM Courses AS C
JOIN Teachers AS T ON T.Teacher_ID = C.Teacher_ID
LEFT JOIN Course_Enrollments AS CE ON CE.Course_ID = C.Course_ID AND CE.Status = N'Active'
WHERE C.Status = N'Active'
  AND ((@Role = N'Teacher' AND C.Teacher_ID = @TeacherId) OR (@Role = N'Curator' AND C.Curator_ID = @CuratorId))
GROUP BY T.Teacher_ID, T.First_Name, T.Last_Name, T.Phone, T.Email, T.Telegram_Link, T.Average_Rating
ORDER BY T.Teacher_ID;
"@

    $lessonsQuery = @"
SELECT
    L.Lesson_ID,
    C.Course_ID,
    C.Course_Slug,
    C.Course_Name,
    CONCAT(T.First_Name, N' ', T.Last_Name) AS Teacher_Name,
    L.Lesson_Number,
    L.Lesson_Title,
    L.Topic,
    L.Video_Link,
    L.Notes_Link,
    L.Homework_Link,
    L.Duration_Minutes,
    L.Lesson_Status,
    R.Review_ID,
    R.Rating,
    R.Comment_Text AS Review_Comment,
    R.Created_At AS Review_Created_At,
    R.Updated_At AS Review_Updated_At
FROM Lessons AS L
JOIN Courses AS C ON C.Course_ID = L.Course_ID
LEFT JOIN Teachers AS T ON T.Teacher_ID = C.Teacher_ID
LEFT JOIN Staff_Resource_Reviews AS R
    ON R.Resource_Type = N'Lesson'
   AND R.Resource_ID = L.Lesson_ID
   AND R.Staff_Role = @Role
   AND R.Staff_ID = @StaffId
WHERE C.Status = N'Active' AND $scopeWhere
ORDER BY C.Course_ID, L.Lesson_Number;
"@

    $notesQuery = @"
SELECT
    B.Books_and_notes_ID,
    C.Course_ID,
    C.Course_Slug,
    C.Course_Name,
    CONCAT(T.First_Name, N' ', T.Last_Name) AS Teacher_Name,
    L.Lesson_ID,
    L.Lesson_Number,
    L.Lesson_Title,
    B.Material_Name,
    B.Material_Type,
    B.File_Link,
    R.Review_ID,
    R.Rating,
    R.Comment_Text AS Review_Comment,
    R.Created_At AS Review_Created_At,
    R.Updated_At AS Review_Updated_At
FROM Books_and_notes AS B
JOIN Courses AS C ON C.Course_ID = B.Course_ID
LEFT JOIN Lessons AS L ON L.Lesson_ID = B.Lesson_ID
LEFT JOIN Teachers AS T ON T.Teacher_ID = C.Teacher_ID
LEFT JOIN Staff_Resource_Reviews AS R
    ON R.Resource_Type = N'Note'
   AND R.Resource_ID = B.Books_and_notes_ID
   AND R.Staff_Role = @Role
   AND R.Staff_ID = @StaffId
WHERE B.Is_Active = 1 AND C.Status = N'Active' AND $scopeWhere
ORDER BY C.Course_ID, L.Lesson_Number, B.Books_and_notes_ID;
"@

    $homeworksQuery = @"
SELECT
    HA.Homework_Assignment_ID,
    HT.Homework_Template_ID,
    C.Course_ID,
    C.Course_Slug,
    C.Course_Name,
    CONCAT(T.First_Name, N' ', T.Last_Name) AS Teacher_Name,
    S.Student_ID,
    CONCAT(S.First_Name, N' ', S.Last_Name) AS Student_Name,
    S.Grade,
    L.Lesson_ID,
    L.Lesson_Number,
    L.Lesson_Title,
    HT.Homework_Name,
    HT.Description,
    HT.File_Link AS Task_Link,
    HA.Due_Date,
    HA.Status AS Homework_Status,
    HS.Homework_Submission_ID,
    HS.File_Link AS Submission_Link,
    HS.Status AS Submission_Status,
    HS.Submitted_At,
    HS.Score,
    HS.Feedback_Text,
    HS.Checked_At,
    HS.Checked_By_Teacher_ID,
    HA.Teacher_Comment,
    R.Review_ID,
    R.Rating,
    R.Comment_Text AS Review_Comment,
    R.Created_At AS Review_Created_At,
    R.Updated_At AS Review_Updated_At
FROM Homework_Assignments AS HA
JOIN Homework_Templates AS HT ON HT.Homework_Template_ID = HA.Homework_Template_ID
JOIN Students AS S ON S.Student_ID = HA.Student_ID
LEFT JOIN Course_Enrollments AS CE ON CE.Course_Enrollment_ID = HA.Course_Enrollment_ID
LEFT JOIN Courses AS C ON C.Course_ID = COALESCE(CE.Course_ID, HT.Course_ID)
LEFT JOIN Teachers AS T ON T.Teacher_ID = C.Teacher_ID
LEFT JOIN Lessons AS L ON L.Lesson_ID = HT.Lesson_ID
OUTER APPLY
(
    SELECT TOP 1 *
    FROM Homework_Submissions AS Submission
    WHERE Submission.Homework_Assignment_ID = HA.Homework_Assignment_ID
    ORDER BY Submission.Submitted_At DESC
) AS HS
LEFT JOIN Staff_Resource_Reviews AS R
    ON R.Resource_Type = N'Homework'
   AND R.Resource_ID = HA.Homework_Assignment_ID
   AND R.Staff_Role = @Role
   AND R.Staff_ID = @StaffId
WHERE C.Status = N'Active' AND HA.Status <> N'Cancelled' AND $scopeWhere
ORDER BY C.Course_ID, S.Last_Name, S.First_Name, L.Lesson_Number, HA.Homework_Assignment_ID;
"@

    $streamsQuery = @"
SELECT
    LS.Live_Stream_ID,
    C.Course_ID,
    C.Course_Slug,
    C.Course_Name,
    CONCAT(T.First_Name, N' ', T.Last_Name) AS Teacher_Name,
    L.Lesson_Number,
    L.Lesson_Title,
    LS.Stream_Title,
    LS.Starts_At,
    LS.Ends_At,
    LS.Stream_Link,
    LS.Status,
    R.Review_ID,
    R.Rating,
    R.Comment_Text AS Review_Comment,
    R.Created_At AS Review_Created_At,
    R.Updated_At AS Review_Updated_At
FROM Live_Streams AS LS
JOIN Courses AS C ON C.Course_ID = LS.Course_ID
LEFT JOIN Lessons AS L ON L.Lesson_ID = LS.Lesson_ID
LEFT JOIN Teachers AS T ON T.Teacher_ID = C.Teacher_ID
LEFT JOIN Staff_Resource_Reviews AS R
    ON R.Resource_Type = N'Stream'
   AND R.Resource_ID = LS.Live_Stream_ID
   AND R.Staff_Role = @Role
   AND R.Staff_ID = @StaffId
WHERE C.Status = N'Active' AND $scopeWhere
ORDER BY LS.Starts_At DESC, LS.Live_Stream_ID DESC;
"@

    $homeworkStatsQuery = @"
SELECT
    C.Course_ID,
    C.Course_Slug,
    C.Course_Name,
    CONCAT(T.First_Name, N' ', T.Last_Name) AS Teacher_Name,
    L.Lesson_ID,
    L.Lesson_Number,
    L.Lesson_Title,
    HT.Homework_Template_ID,
    HT.Homework_Name,
    COUNT(HA.Homework_Assignment_ID) AS Homework_Total,
    COUNT(DISTINCT HA.Student_ID) AS Students_Total,
    SUM(CASE WHEN HA.Status IN (N'Submitted', N'Checked') OR HS.Status IN (N'Submitted', N'Checked') THEN 1 ELSE 0 END) AS Submitted_Total,
    SUM(CASE WHEN HA.Status = N'Checked' OR HS.Status = N'Checked' THEN 1 ELSE 0 END) AS Checked_Total,
    SUM(CASE WHEN R.Review_ID IS NOT NULL AND HA.Homework_Assignment_ID IS NOT NULL THEN 1 ELSE 0 END) AS Curator_Reviewed_Total,
    MAX(R.Review_ID) AS Review_ID,
    MAX(R.Rating) AS Rating,
    MAX(R.Comment_Text) AS Review_Comment
FROM Homework_Templates AS HT
JOIN Courses AS C ON C.Course_ID = HT.Course_ID
LEFT JOIN Teachers AS T ON T.Teacher_ID = C.Teacher_ID
LEFT JOIN Lessons AS L ON L.Lesson_ID = HT.Lesson_ID
LEFT JOIN Homework_Assignments AS HA
    ON HA.Homework_Template_ID = HT.Homework_Template_ID
   AND HA.Status <> N'Cancelled'
OUTER APPLY
(
    SELECT TOP 1 *
    FROM Homework_Submissions AS Submission
    WHERE Submission.Homework_Assignment_ID = HA.Homework_Assignment_ID
    ORDER BY Submission.Submitted_At DESC
) AS HS
LEFT JOIN Staff_Resource_Reviews AS R
    ON R.Resource_Type = N'Homework'
   AND R.Resource_ID = HA.Homework_Assignment_ID
   AND R.Staff_Role = @Role
   AND R.Staff_ID = @StaffId
WHERE HT.Is_Active = 1 AND C.Status = N'Active' AND $scopeWhere
GROUP BY C.Course_ID, C.Course_Slug, C.Course_Name, T.First_Name, T.Last_Name, L.Lesson_ID, L.Lesson_Number, L.Lesson_Title, HT.Homework_Template_ID, HT.Homework_Name
ORDER BY C.Course_ID, L.Lesson_Number, HT.Homework_Template_ID;
"@

    $courses = Convert-StaffWorkspaceTable -Table (Get-StaffScopedTable -Query $coursesQuery -Staff $staff) -Mapper {
        param($row)
        [ordered]@{
            courseId = [int](Get-DbValue $row "Course_ID")
            courseSlug = Get-DbValue $row "Course_Slug"
            courseTitle = Get-DbValue $row "Course_Name"
            description = Get-DbValue $row "Short_Description"
            totalLessons = [int](Get-DbValue $row "Total_Lessons")
            teacherName = Get-DbValue $row "Teacher_Name"
            curatorName = Get-DbValue $row "Curator_Name"
            studentsCount = [int](Get-DbValue $row "Students_Count")
            lessonsCount = [int](Get-DbValue $row "Lessons_Count")
            homeworksCount = [int](Get-DbValue $row "Homeworks_Count")
            streamsCount = [int](Get-DbValue $row "Streams_Count")
        }
    }

    $students = Convert-StaffWorkspaceTable -Table (Get-StaffScopedTable -Query $studentsQuery -Staff $staff) -Mapper {
        param($row)
        [ordered]@{
            studentId = [int](Get-DbValue $row "Student_ID")
            studentName = Get-DbValue $row "Student_Name"
            phone = Get-DbValue $row "Phone"
            email = Get-DbValue $row "Email"
            grade = Get-DbValue $row "Grade"
            courseId = [int](Get-DbValue $row "Course_ID")
            courseSlug = Get-DbValue $row "Course_Slug"
            courseTitle = Get-DbValue $row "Course_Name"
            progressPercent = Get-DbValue $row "Progress_Percent"
            enrollmentStatus = Get-DbValue $row "Enrollment_Status"
            pointsTotal = [int](Get-DbValue $row "Points_Total")
            lastComment = Get-DbValue $row "Last_Comment"
            lastCommentAt = Get-DbDateText -Row $row -ColumnName "Last_Comment_At"
        }
    }

    $teachers = Convert-StaffWorkspaceTable -Table (Get-StaffScopedTable -Query $teachersQuery -Staff $staff) -Mapper {
        param($row)
        [ordered]@{
            teacherId = [int](Get-DbValue $row "Teacher_ID")
            teacherName = Get-DbValue $row "Teacher_Name"
            phone = Get-DbValue $row "Phone"
            email = Get-DbValue $row "Email"
            telegram = Get-DbValue $row "Telegram_Link"
            rating = Get-DbValue $row "Average_Rating"
            coursesCount = [int](Get-DbValue $row "Courses_Count")
            studentsCount = [int](Get-DbValue $row "Students_Count")
        }
    }

    $lessons = Convert-StaffWorkspaceTable -Table (Get-StaffScopedTable -Query $lessonsQuery -Staff $staff) -Mapper {
        param($row)
        [ordered]@{
            lessonId = [int](Get-DbValue $row "Lesson_ID")
            courseId = [int](Get-DbValue $row "Course_ID")
            courseSlug = Get-DbValue $row "Course_Slug"
            courseTitle = Get-DbValue $row "Course_Name"
            teacherName = Get-DbValue $row "Teacher_Name"
            lessonNumber = [int](Get-DbValue $row "Lesson_Number")
            lessonTitle = Get-DbValue $row "Lesson_Title"
            topic = Get-DbValue $row "Topic"
            videoUrl = Get-DbValue $row "Video_Link"
            notesUrl = Get-DbValue $row "Notes_Link"
            homeworkUrl = Get-DbValue $row "Homework_Link"
            durationMinutes = Get-DbValue $row "Duration_Minutes"
            lessonStatus = Get-DbValue $row "Lesson_Status"
            curatorReviewId = Get-DbValue $row "Review_ID"
            curatorRating = Get-DbValue $row "Rating"
            curatorComment = Get-DbValue $row "Review_Comment"
            curatorReviewCreatedAt = Get-DbDateText -Row $row -ColumnName "Review_Created_At"
            curatorReviewUpdatedAt = Get-DbDateText -Row $row -ColumnName "Review_Updated_At"
        }
    }

    $notes = Convert-StaffWorkspaceTable -Table (Get-StaffScopedTable -Query $notesQuery -Staff $staff) -Mapper {
        param($row)
        [ordered]@{
            noteId = [int](Get-DbValue $row "Books_and_notes_ID")
            courseId = [int](Get-DbValue $row "Course_ID")
            courseSlug = Get-DbValue $row "Course_Slug"
            courseTitle = Get-DbValue $row "Course_Name"
            teacherName = Get-DbValue $row "Teacher_Name"
            lessonId = Get-DbValue $row "Lesson_ID"
            lessonNumber = Get-DbValue $row "Lesson_Number"
            lessonTitle = Get-DbValue $row "Lesson_Title"
            materialTitle = Get-DbValue $row "Material_Name"
            materialType = Get-DbValue $row "Material_Type"
            fileUrl = Get-DbValue $row "File_Link"
            curatorReviewId = Get-DbValue $row "Review_ID"
            curatorRating = Get-DbValue $row "Rating"
            curatorComment = Get-DbValue $row "Review_Comment"
            curatorReviewCreatedAt = Get-DbDateText -Row $row -ColumnName "Review_Created_At"
            curatorReviewUpdatedAt = Get-DbDateText -Row $row -ColumnName "Review_Updated_At"
        }
    }

    $homeworks = Convert-StaffWorkspaceTable -Table (Get-StaffScopedTable -Query $homeworksQuery -Staff $staff) -Mapper {
        param($row)
        [ordered]@{
            homeworkAssignmentId = [int](Get-DbValue $row "Homework_Assignment_ID")
            homeworkTemplateId = [int](Get-DbValue $row "Homework_Template_ID")
            courseId = [int](Get-DbValue $row "Course_ID")
            courseSlug = Get-DbValue $row "Course_Slug"
            courseTitle = Get-DbValue $row "Course_Name"
            teacherName = Get-DbValue $row "Teacher_Name"
            studentId = [int](Get-DbValue $row "Student_ID")
            studentName = Get-DbValue $row "Student_Name"
            grade = Get-DbValue $row "Grade"
            lessonId = Get-DbValue $row "Lesson_ID"
            lessonNumber = Get-DbValue $row "Lesson_Number"
            lessonTitle = Get-DbValue $row "Lesson_Title"
            homeworkTitle = Get-DbValue $row "Homework_Name"
            homeworkDescription = Get-DbValue $row "Description"
            taskLink = Get-DbValue $row "Task_Link"
            dueAt = Get-DbDateText -Row $row -ColumnName "Due_Date"
            homeworkStatus = Get-DbValue $row "Homework_Status"
            homeworkSubmissionId = Get-DbValue $row "Homework_Submission_ID"
            submissionLink = Get-DbValue $row "Submission_Link"
            submissionStatus = Get-DbValue $row "Submission_Status"
            submittedAt = Get-DbDateText -Row $row -ColumnName "Submitted_At"
            score = Get-DbValue $row "Score"
            feedbackText = Get-DbValue $row "Feedback_Text"
            teacherComment = Get-DbValue $row "Teacher_Comment"
            checkedByTeacherId = Get-DbValue $row "Checked_By_Teacher_ID"
            checkedAt = Get-DbDateText -Row $row -ColumnName "Checked_At"
            curatorReviewId = Get-DbValue $row "Review_ID"
            curatorRating = Get-DbValue $row "Rating"
            curatorComment = Get-DbValue $row "Review_Comment"
            curatorReviewCreatedAt = Get-DbDateText -Row $row -ColumnName "Review_Created_At"
            curatorReviewUpdatedAt = Get-DbDateText -Row $row -ColumnName "Review_Updated_At"
        }
    }

    $streams = Convert-StaffWorkspaceTable -Table (Get-StaffScopedTable -Query $streamsQuery -Staff $staff) -Mapper {
        param($row)
        [ordered]@{
            streamId = [int](Get-DbValue $row "Live_Stream_ID")
            courseId = [int](Get-DbValue $row "Course_ID")
            courseSlug = Get-DbValue $row "Course_Slug"
            courseTitle = Get-DbValue $row "Course_Name"
            teacherName = Get-DbValue $row "Teacher_Name"
            lessonNumber = Get-DbValue $row "Lesson_Number"
            lessonTitle = Get-DbValue $row "Lesson_Title"
            streamTitle = Get-DbValue $row "Stream_Title"
            startsAt = Get-DbDateText -Row $row -ColumnName "Starts_At"
            endsAt = Get-DbDateText -Row $row -ColumnName "Ends_At"
            streamLink = Get-DbValue $row "Stream_Link"
            status = Get-DbValue $row "Status"
            curatorReviewId = Get-DbValue $row "Review_ID"
            curatorRating = Get-DbValue $row "Rating"
            curatorComment = Get-DbValue $row "Review_Comment"
            curatorReviewCreatedAt = Get-DbDateText -Row $row -ColumnName "Review_Created_At"
            curatorReviewUpdatedAt = Get-DbDateText -Row $row -ColumnName "Review_Updated_At"
        }
    }

    $homeworkStats = Convert-StaffWorkspaceTable -Table (Get-StaffScopedTable -Query $homeworkStatsQuery -Staff $staff) -Mapper {
        param($row)
        $homeworkTotal = [int](Get-DbValue $row "Homework_Total")
        $submittedTotal = [int](Get-DbValue $row "Submitted_Total")
        $checkedTotal = [int](Get-DbValue $row "Checked_Total")
        $curatorReviewedTotal = [int](Get-DbValue $row "Curator_Reviewed_Total")

        [ordered]@{
            courseId = [int](Get-DbValue $row "Course_ID")
            courseSlug = Get-DbValue $row "Course_Slug"
            courseTitle = Get-DbValue $row "Course_Name"
            teacherName = Get-DbValue $row "Teacher_Name"
            lessonId = Get-DbValue $row "Lesson_ID"
            lessonNumber = Get-DbValue $row "Lesson_Number"
            lessonTitle = Get-DbValue $row "Lesson_Title"
            homeworkTemplateId = [int](Get-DbValue $row "Homework_Template_ID")
            homeworkTitle = Get-DbValue $row "Homework_Name"
            homeworkTotal = $homeworkTotal
            studentsTotal = [int](Get-DbValue $row "Students_Total")
            submittedTotal = $submittedTotal
            checkedTotal = $checkedTotal
            curatorReviewedTotal = $curatorReviewedTotal
            submittedPercent = $(if ($homeworkTotal -gt 0) { [math]::Round(100 * $submittedTotal / $homeworkTotal) } else { 0 })
            checkedPercent = $(if ($homeworkTotal -gt 0) { [math]::Round(100 * $checkedTotal / $homeworkTotal) } else { 0 })
            curatorReviewedPercent = $(if ($homeworkTotal -gt 0) { [math]::Round(100 * $curatorReviewedTotal / $homeworkTotal) } else { 0 })
            curatorReviewId = Get-DbValue $row "Review_ID"
            curatorRating = Get-DbValue $row "Rating"
            curatorComment = Get-DbValue $row "Review_Comment"
        }
    }

    $notifications = @()

    if ($staff.role -eq "Teacher")
    {
        $submittedEvents = @($homeworks |
            Where-Object { $_.submittedAt } |
            Sort-Object { [datetime]$_.submittedAt } -Descending |
            Select-Object -First 8)

        foreach ($homework in $submittedEvents)
        {
            $stat = @($homeworkStats | Where-Object { [int]$_.homeworkTemplateId -eq [int]$homework.homeworkTemplateId } | Select-Object -First 1)[0]

            $notifications += [ordered]@{
                notificationId = "teacher-submission-$($homework.homeworkSubmissionId)"
                type = "HomeworkSubmitted"
                tone = $(if ($homework.submissionStatus -eq "Checked" -or $homework.homeworkStatus -eq "Checked") { "success" } else { "warning" })
                title = "$($homework.studentName) сдал ДЗ"
                text = "$($homework.courseTitle) · Урок $($homework.lessonNumber). $($homework.homeworkTitle)"
                createdAt = $homework.submittedAt
                link = "#staff-homework"
                actorName = $homework.studentName
                homeworkAssignmentId = $homework.homeworkAssignmentId
                homeworkSubmissionId = $homework.homeworkSubmissionId
                homeworkTemplateId = $homework.homeworkTemplateId
                courseTitle = $homework.courseTitle
                courseSlug = $homework.courseSlug
                courseId = $homework.courseId
                lessonId = $homework.lessonId
                lessonNumber = $homework.lessonNumber
                lessonTitle = $homework.lessonTitle
                homeworkTitle = $homework.homeworkTitle
                homeworkTotal = $(if ($stat) { $stat.homeworkTotal } else { 0 })
                submittedTotal = $(if ($stat) { $stat.submittedTotal } else { 0 })
                checkedTotal = $(if ($stat) { $stat.checkedTotal } else { 0 })
                submittedPercent = $(if ($stat) { $stat.submittedPercent } else { 0 })
                checkedPercent = $(if ($stat) { $stat.checkedPercent } else { 0 })
            }
        }
    }
    elseif ($staff.role -eq "Curator")
    {
        $checkedEvents = @($homeworks |
            Where-Object { $_.checkedAt } |
            Sort-Object { [datetime]$_.checkedAt } -Descending |
            Select-Object -First 8)

        foreach ($homework in $checkedEvents)
        {
            $stat = @($homeworkStats | Where-Object { [int]$_.homeworkTemplateId -eq [int]$homework.homeworkTemplateId } | Select-Object -First 1)[0]

            $notifications += [ordered]@{
                notificationId = "curator-checked-$($homework.homeworkSubmissionId)"
                type = "HomeworkChecked"
                tone = $(if ($homework.curatorReviewId) { "success" } else { "warning" })
                title = "$($homework.teacherName) проверил ДЗ"
                text = "$($homework.courseTitle) · Урок $($homework.lessonNumber). $($homework.homeworkTitle)"
                createdAt = $homework.checkedAt
                link = "#staff-homework"
                actorName = $homework.teacherName
                homeworkAssignmentId = $homework.homeworkAssignmentId
                homeworkSubmissionId = $homework.homeworkSubmissionId
                homeworkTemplateId = $homework.homeworkTemplateId
                courseTitle = $homework.courseTitle
                courseSlug = $homework.courseSlug
                courseId = $homework.courseId
                lessonId = $homework.lessonId
                lessonNumber = $homework.lessonNumber
                lessonTitle = $homework.lessonTitle
                homeworkTitle = $homework.homeworkTitle
                homeworkTotal = $(if ($stat) { $stat.homeworkTotal } else { 0 })
                submittedTotal = $(if ($stat) { $stat.submittedTotal } else { 0 })
                checkedTotal = $(if ($stat) { $stat.checkedTotal } else { 0 })
                submittedPercent = $(if ($stat) { $stat.submittedPercent } else { 0 })
                checkedPercent = $(if ($stat) { $stat.checkedPercent } else { 0 })
            }
        }
    }

    return [ordered]@{
        source = "database"
        staff = $staff
        courses = $courses
        students = $students
        teachers = $teachers
        lessons = $lessons
        notes = $notes
        homeworks = $homeworks
        streams = $streams
        homeworkStats = $homeworkStats
        notifications = $notifications
    }
}

function Save-StaffHomeworkReview
{
    param
    (
        [System.Net.HttpListenerContext]$Context,
        [int]$AssignmentId,
        $Payload
    )

    $staff = Get-RequestStaff -Context $Context

    if (-not $staff -or $staff.role -ne "Teacher" -or $null -eq $staff.teacherId)
    {
        throw "Only a teacher can check homework."
    }

    $score = Get-IntValue -Object $Payload -Name "score"
    $feedback = Get-TextValue -Object $Payload -Name "feedbackText" -MaxLength 2000

    if ([string]::IsNullOrWhiteSpace($feedback))
    {
        $feedback = Get-TextValue -Object $Payload -Name "comment" -MaxLength 2000
    }

    if ($null -eq $score -or $score -lt 1 -or $score -gt 10)
    {
        throw "Score must be between 1 and 10."
    }

    if ([string]::IsNullOrWhiteSpace($feedback))
    {
        $feedback = "Проверено."
    }

    $query = @"
IF NOT EXISTS
(
    SELECT 1
    FROM Homework_Assignments AS HA
    JOIN Homework_Templates AS HT ON HT.Homework_Template_ID = HA.Homework_Template_ID
    JOIN Courses AS C ON C.Course_ID = HT.Course_ID
    WHERE HA.Homework_Assignment_ID = @AssignmentId
      AND C.Teacher_ID = @TeacherId
)
BEGIN
    THROW 54001, 'Homework is unavailable for this teacher.', 1;
END;

IF EXISTS
(
    SELECT 1
    FROM Homework_Assignments AS HA
    OUTER APPLY
    (
        SELECT TOP 1 *
        FROM Homework_Submissions AS Submission
        WHERE Submission.Homework_Assignment_ID = HA.Homework_Assignment_ID
        ORDER BY Submission.Submitted_At DESC
    ) AS HS
    WHERE HA.Homework_Assignment_ID = @AssignmentId
      AND (HA.Status = N'Checked' OR HS.Status = N'Checked')
)
BEGIN
    THROW 54002, 'Homework is already checked.', 1;
END;

IF NOT EXISTS
(
    SELECT 1
    FROM Homework_Submissions
    WHERE Homework_Assignment_ID = @AssignmentId
      AND Status = N'Submitted'
)
BEGIN
    THROW 54003, 'Homework has no submitted work to check.', 1;
END;

DECLARE @SubmissionId INT;
DECLARE @StudentId INT;
DECLARE @EnrollmentId INT;

SELECT
    @StudentId = HA.Student_ID,
    @EnrollmentId = HA.Course_Enrollment_ID
FROM Homework_Assignments AS HA
WHERE HA.Homework_Assignment_ID = @AssignmentId;

SELECT TOP 1 @SubmissionId = Homework_Submission_ID
FROM Homework_Submissions
WHERE Homework_Assignment_ID = @AssignmentId
ORDER BY Submitted_At DESC;

IF @SubmissionId IS NULL
BEGIN
    INSERT INTO Homework_Submissions (Homework_Assignment_ID, Student_Text, File_Link, Checked_By_Teacher_ID, Checked_At, Score, Feedback_Text, Status)
    VALUES (@AssignmentId, N'Проверено преподавателем без прикрепленной ссылки.', NULL, @TeacherId, SYSDATETIME(), @Score, @FeedbackText, N'Checked');
    SET @SubmissionId = CONVERT(INT, SCOPE_IDENTITY());
END
ELSE
BEGIN
    UPDATE Homework_Submissions
    SET Checked_By_Teacher_ID = @TeacherId,
        Checked_At = SYSDATETIME(),
        Score = @Score,
        Feedback_Text = @FeedbackText,
        Status = N'Checked'
    WHERE Homework_Submission_ID = @SubmissionId;
END;

UPDATE Homework_Assignments
SET Status = N'Checked',
    Teacher_Comment = @FeedbackText
WHERE Homework_Assignment_ID = @AssignmentId;

IF @EnrollmentId IS NOT NULL
BEGIN
    DECLARE @HomeworkTotal INT = 0;
    DECLARE @HomeworkChecked INT = 0;
    DECLARE @Progress DECIMAL(5,2) = 0;

    SELECT
        @HomeworkTotal = COUNT(*),
        @HomeworkChecked = SUM(CASE WHEN Status = N'Checked' THEN 1 ELSE 0 END)
    FROM Homework_Assignments
    WHERE Course_Enrollment_ID = @EnrollmentId
      AND Student_ID = @StudentId
      AND Status <> N'Cancelled';

    IF @HomeworkTotal > 0
    BEGIN
        SET @Progress = CAST(100.0 * @HomeworkChecked / @HomeworkTotal AS DECIMAL(5,2));
    END;

    UPDATE Course_Enrollments
    SET Progress_Percent = @Progress
    WHERE Course_Enrollment_ID = @EnrollmentId;
END;

SELECT @SubmissionId AS Homework_Submission_ID;
"@

    $connection = New-Object System.Data.SqlClient.SqlConnection(Get-ConnectionString)
    $command = $connection.CreateCommand()
    $command.CommandText = $query
    Add-SqlParameter -Command $command -Name "@AssignmentId" -Type ([System.Data.SqlDbType]::Int) -Size 0 -Value $AssignmentId
    Add-SqlParameter -Command $command -Name "@TeacherId" -Type ([System.Data.SqlDbType]::Int) -Size 0 -Value $staff.teacherId
    Add-SqlParameter -Command $command -Name "@Score" -Type ([System.Data.SqlDbType]::Int) -Size 0 -Value $score
    Add-SqlParameter -Command $command -Name "@FeedbackText" -Type ([System.Data.SqlDbType]::NVarChar) -Size 2000 -Value $feedback

    try
    {
        $connection.Open()
        $submissionId = [int]$command.ExecuteScalar()
    }
    finally
    {
        $connection.Close()
    }

    return [ordered]@{
        ok = $true
        source = "database"
        homeworkAssignmentId = $AssignmentId
        homeworkSubmissionId = $submissionId
        score = $score
        feedbackText = $feedback
    }
}

function Save-StaffLesson
{
    param
    (
        [System.Net.HttpListenerContext]$Context,
        $Payload
    )

    $staff = Get-RequestStaff -Context $Context

    if (-not $staff -or $staff.role -ne "Teacher" -or $null -eq $staff.teacherId)
    {
        throw "Only a teacher can edit course lessons."
    }

    $lessonId = Get-IntValue -Object $Payload -Name "lessonId"
    $courseId = Get-IntValue -Object $Payload -Name "courseId"
    $lessonNumber = Get-IntValue -Object $Payload -Name "lessonNumber"
    $lessonTitle = Get-TextValue -Object $Payload -Name "lessonTitle" -MaxLength 200
    $topic = Get-TextValue -Object $Payload -Name "topic" -MaxLength 500
    $videoUrl = Get-TextValue -Object $Payload -Name "videoUrl" -MaxLength 1000
    $notesUrl = Get-TextValue -Object $Payload -Name "notesUrl" -MaxLength 1000
    $homeworkUrl = Get-TextValue -Object $Payload -Name "homeworkUrl" -MaxLength 1000

    if ($courseId -le 0 -or [string]::IsNullOrWhiteSpace($lessonTitle))
    {
        throw "Course and lesson title are required."
    }

    $query = @"
IF NOT EXISTS (SELECT 1 FROM Courses WHERE Course_ID = @CourseId AND Teacher_ID = @TeacherId AND Status = N'Active')
BEGIN
    THROW 54101, 'Course is unavailable for this teacher.', 1;
END;

IF @LessonNumber IS NULL OR @LessonNumber <= 0
BEGIN
    SELECT @LessonNumber = ISNULL(MAX(Lesson_Number), 0) + 1
    FROM Lessons
    WHERE Course_ID = @CourseId;
END;

IF @LessonId IS NULL OR @LessonId <= 0
BEGIN
    INSERT INTO Lessons (Course_ID, Lesson_Number, Lesson_Title, Topic, Video_Link, Notes_Link, Homework_Link, Duration_Minutes, Is_Open, Lesson_Status)
    VALUES (@CourseId, @LessonNumber, @LessonTitle, @Topic, @VideoUrl, @NotesUrl, @HomeworkUrl, 90, 1, N'Open');
    SET @LessonId = CONVERT(INT, SCOPE_IDENTITY());
END
ELSE
BEGIN
    UPDATE Lessons
    SET Lesson_Number = @LessonNumber,
        Lesson_Title = @LessonTitle,
        Topic = @Topic,
        Video_Link = @VideoUrl,
        Notes_Link = @NotesUrl,
        Homework_Link = @HomeworkUrl,
        Is_Open = 1
    WHERE Lesson_ID = @LessonId
      AND Course_ID = @CourseId;
END;

IF @NotesUrl IS NOT NULL AND @NotesUrl <> N''
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Books_and_notes WHERE Course_ID = @CourseId AND Lesson_ID = @LessonId AND Material_Type = N'Конспект')
    BEGIN
        INSERT INTO Books_and_notes (Subject_ID, Course_ID, Lesson_ID, Material_Name, Material_Type, Author, File_Link)
        SELECT Subject_ID, Course_ID, @LessonId, CONCAT(N'Конспект: ', @LessonTitle), N'Конспект', N'Преподаватель', @NotesUrl
        FROM Courses
        WHERE Course_ID = @CourseId;
    END
    ELSE
    BEGIN
        UPDATE Books_and_notes
        SET Material_Name = CONCAT(N'Конспект: ', @LessonTitle),
            File_Link = @NotesUrl,
            Is_Active = 1
        WHERE Course_ID = @CourseId
          AND Lesson_ID = @LessonId
          AND Material_Type = N'Конспект';
    END;
END;

IF @HomeworkUrl IS NOT NULL AND @HomeworkUrl <> N''
BEGIN
    DECLARE @TemplateId INT;
    SELECT TOP 1 @TemplateId = Homework_Template_ID
    FROM Homework_Templates
    WHERE Course_ID = @CourseId
      AND Lesson_ID = @LessonId
      AND For_Online_Course = 1;

    IF @TemplateId IS NULL
    BEGIN
        INSERT INTO Homework_Templates (Subject_ID, Course_ID, Lesson_ID, Created_By_Teacher_ID, Homework_Name, Description, File_Link, Max_Score, For_Online_Course, For_Private_Lesson, Is_Active)
        SELECT Subject_ID, Course_ID, @LessonId, @TeacherId, CONCAT(N'ДЗ: ', @LessonTitle), @Topic, @HomeworkUrl, 10, 1, 1, 1
        FROM Courses
        WHERE Course_ID = @CourseId;
        SET @TemplateId = CONVERT(INT, SCOPE_IDENTITY());
    END
    ELSE
    BEGIN
        UPDATE Homework_Templates
        SET Homework_Name = CONCAT(N'ДЗ: ', @LessonTitle),
            Description = @Topic,
            File_Link = @HomeworkUrl,
            Max_Score = 10,
            Is_Active = 1
        WHERE Homework_Template_ID = @TemplateId;
    END;

    INSERT INTO Homework_Assignments (Homework_Template_ID, Student_ID, Course_Enrollment_ID, Assigned_By_Teacher_ID, Due_Date, Status)
    SELECT @TemplateId, CE.Student_ID, CE.Course_Enrollment_ID, @TeacherId, DATEADD(day, 7, SYSDATETIME()), N'Assigned'
    FROM Course_Enrollments AS CE
    WHERE CE.Course_ID = @CourseId
      AND CE.Status = N'Active'
      AND NOT EXISTS
      (
          SELECT 1
          FROM Homework_Assignments AS HA
          WHERE HA.Homework_Template_ID = @TemplateId
            AND HA.Student_ID = CE.Student_ID
            AND HA.Course_Enrollment_ID = CE.Course_Enrollment_ID
      );
END;

UPDATE Courses
SET Total_Lessons = (SELECT COUNT(*) FROM Lessons WHERE Course_ID = @CourseId)
WHERE Course_ID = @CourseId;

SELECT @LessonId AS Lesson_ID;
"@

    $connection = New-Object System.Data.SqlClient.SqlConnection(Get-ConnectionString)
    $command = $connection.CreateCommand()
    $command.CommandText = $query
    Add-SqlParameter -Command $command -Name "@LessonId" -Type ([System.Data.SqlDbType]::Int) -Size 0 -Value $lessonId
    Add-SqlParameter -Command $command -Name "@CourseId" -Type ([System.Data.SqlDbType]::Int) -Size 0 -Value $courseId
    Add-SqlParameter -Command $command -Name "@TeacherId" -Type ([System.Data.SqlDbType]::Int) -Size 0 -Value $staff.teacherId
    Add-SqlParameter -Command $command -Name "@LessonNumber" -Type ([System.Data.SqlDbType]::Int) -Size 0 -Value $lessonNumber
    Add-SqlParameter -Command $command -Name "@LessonTitle" -Type ([System.Data.SqlDbType]::NVarChar) -Size 200 -Value $lessonTitle
    Add-SqlParameter -Command $command -Name "@Topic" -Type ([System.Data.SqlDbType]::NVarChar) -Size 500 -Value $topic
    Add-SqlParameter -Command $command -Name "@VideoUrl" -Type ([System.Data.SqlDbType]::NVarChar) -Size 1000 -Value $videoUrl
    Add-SqlParameter -Command $command -Name "@NotesUrl" -Type ([System.Data.SqlDbType]::NVarChar) -Size 1000 -Value $notesUrl
    Add-SqlParameter -Command $command -Name "@HomeworkUrl" -Type ([System.Data.SqlDbType]::NVarChar) -Size 1000 -Value $homeworkUrl

    try
    {
        $connection.Open()
        $savedLessonId = [int]$command.ExecuteScalar()
    }
    finally
    {
        $connection.Close()
    }

    return [ordered]@{ ok = $true; source = "database"; lessonId = $savedLessonId }
}

function Save-StaffStream
{
    param
    (
        [System.Net.HttpListenerContext]$Context,
        $Payload
    )

    $staff = Get-RequestStaff -Context $Context

    if (-not $staff -or $staff.role -ne "Teacher" -or $null -eq $staff.teacherId)
    {
        throw "Only a teacher can create streams."
    }

    $courseId = Get-IntValue -Object $Payload -Name "courseId"
    $lessonId = Get-IntValue -Object $Payload -Name "lessonId"
    $streamTitle = Get-TextValue -Object $Payload -Name "streamTitle" -MaxLength 200
    $startsAtText = Get-TextValue -Object $Payload -Name "startsAt" -MaxLength 80
    $streamLink = Normalize-HomeworkLink -Value (Get-TextValue -Object $Payload -Name "streamLink" -MaxLength 1000)
    $startsAt = Get-Date

    if ($courseId -le 0 -or [string]::IsNullOrWhiteSpace($streamTitle) -or [string]::IsNullOrWhiteSpace($streamLink))
    {
        throw "Course, title and link are required."
    }

    if (-not [datetime]::TryParse($startsAtText, [ref]$startsAt))
    {
        $startsAt = (Get-Date).AddDays(1)
    }

    $query = @"
IF NOT EXISTS (SELECT 1 FROM Courses WHERE Course_ID = @CourseId AND Teacher_ID = @TeacherId AND Status = N'Active')
BEGIN
    THROW 54201, 'Course is unavailable for this teacher.', 1;
END;

INSERT INTO Live_Streams (Course_ID, Lesson_ID, Stream_Title, Starts_At, Ends_At, Stream_Link, Status)
OUTPUT INSERTED.Live_Stream_ID
VALUES (@CourseId, @LessonId, @StreamTitle, @StartsAt, DATEADD(hour, 2, @StartsAt), @StreamLink, N'Planned');
"@

    $connection = New-Object System.Data.SqlClient.SqlConnection(Get-ConnectionString)
    $command = $connection.CreateCommand()
    $command.CommandText = $query
    Add-SqlParameter -Command $command -Name "@CourseId" -Type ([System.Data.SqlDbType]::Int) -Size 0 -Value $courseId
    Add-SqlParameter -Command $command -Name "@LessonId" -Type ([System.Data.SqlDbType]::Int) -Size 0 -Value $lessonId
    Add-SqlParameter -Command $command -Name "@TeacherId" -Type ([System.Data.SqlDbType]::Int) -Size 0 -Value $staff.teacherId
    Add-SqlParameter -Command $command -Name "@StreamTitle" -Type ([System.Data.SqlDbType]::NVarChar) -Size 200 -Value $streamTitle
    Add-SqlParameter -Command $command -Name "@StartsAt" -Type ([System.Data.SqlDbType]::DateTime2) -Size 0 -Value $startsAt
    Add-SqlParameter -Command $command -Name "@StreamLink" -Type ([System.Data.SqlDbType]::NVarChar) -Size 1000 -Value $streamLink

    try
    {
        $connection.Open()
        $streamId = [int]$command.ExecuteScalar()
    }
    finally
    {
        $connection.Close()
    }

    return [ordered]@{ ok = $true; source = "database"; streamId = $streamId }
}

function Save-StaffResourceReview
{
    param
    (
        [System.Net.HttpListenerContext]$Context,
        $Payload
    )

    $staff = Get-RequestStaff -Context $Context

    if (-not $staff -or $staff.role -ne "Curator")
    {
        throw "Only a curator can rate teacher resources."
    }

    $resourceType = Get-TextValue -Object $Payload -Name "resourceType" -MaxLength 40
    $resourceId = Get-IntValue -Object $Payload -Name "resourceId"
    $rating = Get-IntValue -Object $Payload -Name "rating"
    $comment = Get-TextValue -Object $Payload -Name "commentText" -MaxLength 1200

    if ($resourceType -notin @("Lesson", "Note", "Homework", "Stream") -or $resourceId -le 0)
    {
        throw "Resource is invalid."
    }

    if ($null -eq $rating -or $rating -lt 1 -or $rating -gt 10)
    {
        throw "Rating must be between 1 and 10."
    }

    Ensure-StaffWorkspaceTables
$query = @"
IF @ResourceType = N'Homework'
   AND NOT EXISTS
   (
       SELECT 1
       FROM Homework_Assignments AS HA
       OUTER APPLY
       (
           SELECT TOP 1 *
           FROM Homework_Submissions AS Submission
           WHERE Submission.Homework_Assignment_ID = HA.Homework_Assignment_ID
           ORDER BY Submission.Submitted_At DESC
       ) AS HS
       WHERE HA.Homework_Assignment_ID = @ResourceId
         AND (HA.Status = N'Checked' OR HS.Status = N'Checked')
   )
BEGIN
    THROW 54302, 'Homework is not checked by teacher yet.', 1;
END;

IF EXISTS
(
    SELECT 1
    FROM Staff_Resource_Reviews
    WHERE Staff_Role = @Role
      AND Staff_ID = @StaffId
      AND Resource_Type = @ResourceType
      AND Resource_ID = @ResourceId
)
BEGIN
    THROW 54301, 'Resource is already reviewed.', 1;
END
ELSE
BEGIN
    INSERT INTO Staff_Resource_Reviews (Staff_Role, Staff_ID, Resource_Type, Resource_ID, Rating, Comment_Text)
    VALUES (@Role, @StaffId, @ResourceType, @ResourceId, @Rating, @CommentText);
END;
"@

    $connection = New-Object System.Data.SqlClient.SqlConnection(Get-ConnectionString)
    $command = $connection.CreateCommand()
    $command.CommandText = $query
    Add-SqlParameter -Command $command -Name "@Role" -Type ([System.Data.SqlDbType]::NVarChar) -Size 30 -Value $staff.role
    Add-SqlParameter -Command $command -Name "@StaffId" -Type ([System.Data.SqlDbType]::Int) -Size 0 -Value $staff.staffId
    Add-SqlParameter -Command $command -Name "@ResourceType" -Type ([System.Data.SqlDbType]::NVarChar) -Size 40 -Value $resourceType
    Add-SqlParameter -Command $command -Name "@ResourceId" -Type ([System.Data.SqlDbType]::Int) -Size 0 -Value $resourceId
    Add-SqlParameter -Command $command -Name "@Rating" -Type ([System.Data.SqlDbType]::Int) -Size 0 -Value $rating
    Add-SqlParameter -Command $command -Name "@CommentText" -Type ([System.Data.SqlDbType]::NVarChar) -Size 1200 -Value $comment

    try
    {
        $connection.Open()
        [void]$command.ExecuteNonQuery()
    }
    finally
    {
        $connection.Close()
    }

    return [ordered]@{ ok = $true; source = "database"; resourceType = $resourceType; resourceId = $resourceId }
}

function Save-StudentStaffComment
{
    param
    (
        [System.Net.HttpListenerContext]$Context,
        [int]$StudentId,
        $Payload
    )

    $staff = Get-RequestStaff -Context $Context

    if (-not $staff)
    {
        throw "Unauthorized."
    }

    $comment = Get-TextValue -Object $Payload -Name "commentText" -MaxLength 1200

    if ($StudentId -le 0 -or [string]::IsNullOrWhiteSpace($comment))
    {
        throw "Student and comment are required."
    }

    Ensure-StaffWorkspaceTables
    $query = @"
INSERT INTO Student_Staff_Comments (Student_ID, Staff_Role, Staff_ID, Comment_Text)
VALUES (@StudentId, @Role, @StaffId, @CommentText);
"@

    $connection = New-Object System.Data.SqlClient.SqlConnection(Get-ConnectionString)
    $command = $connection.CreateCommand()
    $command.CommandText = $query
    Add-SqlParameter -Command $command -Name "@StudentId" -Type ([System.Data.SqlDbType]::Int) -Size 0 -Value $StudentId
    Add-SqlParameter -Command $command -Name "@Role" -Type ([System.Data.SqlDbType]::NVarChar) -Size 30 -Value $staff.role
    Add-SqlParameter -Command $command -Name "@StaffId" -Type ([System.Data.SqlDbType]::Int) -Size 0 -Value $staff.staffId
    Add-SqlParameter -Command $command -Name "@CommentText" -Type ([System.Data.SqlDbType]::NVarChar) -Size 1200 -Value $comment

    try
    {
        $connection.Open()
        [void]$command.ExecuteNonQuery()
    }
    finally
    {
        $connection.Close()
    }

    return [ordered]@{ ok = $true; source = "database"; studentId = $StudentId; commentText = $comment }
}

function Get-LessonsFromSeed
{
    param([string]$CourseSlug)

    if (-not (Test-Path $SeedPath))
    {
        return $null
    }

    $seed = Get-Content -Raw -Encoding UTF8 -Path $SeedPath | ConvertFrom-Json
    $course = $seed.courses | Where-Object { $_.courseSlug -eq $CourseSlug } | Select-Object -First 1

    if (-not $course)
    {
        return $null
    }

    return [ordered]@{
        source = "seed"
        course = [ordered]@{
            courseSlug = $course.courseSlug
            courseTitle = $course.courseTitle
            courseDescription = $course.courseDescription
        }
        lessons = Apply-HomeworkLinkFallback -Lessons $course.lessons
    }
}

function Handle-ApiRequest
{
    param
    (
        [System.Net.HttpListenerContext]$Context,
        [string]$Path
    )

    if ($Context.Request.HttpMethod -eq "OPTIONS")
    {
        Write-Response -Context $Context -StatusCode 204 -Bytes ([byte[]]@()) -ContentType "text/plain; charset=utf-8"
        return
    }

    if ($Path -eq "/api/staff/login")
    {
        if ($Context.Request.HttpMethod -ne "POST")
        {
            Write-Json -Context $Context -StatusCode 405 -Value @{ error = "Method not allowed" }
            return
        }

        try
        {
            $payload = Read-RequestJson -Request $Context.Request
            Write-Json -Context $Context -StatusCode 200 -Value (Login-StaffToSqlServer -Payload $payload)
        }
        catch
        {
            $message = $_.Exception.Message

            if ($message -like "*Wrong staff login or password*")
            {
                $message = "Неверный логин, пароль или роль."
            }

            Write-Json -Context $Context -StatusCode 401 -Value @{
                error = "Staff login failed"
                message = $message
            }
        }

        return
    }

    if ($Path -eq "/api/staff/me")
    {
        if ($Context.Request.HttpMethod -ne "GET")
        {
            Write-Json -Context $Context -StatusCode 405 -Value @{ error = "Method not allowed" }
            return
        }

        $staff = Get-RequestStaff -Context $Context

        if (-not $staff)
        {
            Write-Json -Context $Context -StatusCode 401 -Value @{
                error = "Unauthorized"
                message = "Войдите как куратор или преподаватель."
            }
            return
        }

        Write-Json -Context $Context -StatusCode 200 -Value ([ordered]@{
            source = "database"
            staff = $staff
        })
        return
    }

    if ($Path -eq "/api/staff/workspace")
    {
        if ($Context.Request.HttpMethod -ne "GET")
        {
            Write-Json -Context $Context -StatusCode 405 -Value @{ error = "Method not allowed" }
            return
        }

        try
        {
            Write-Json -Context $Context -StatusCode 200 -Value (Get-StaffWorkspaceFromSqlServer -Context $Context)
        }
        catch
        {
            $statusCode = 500

            if ($_.Exception.Message -like "*Unauthorized*")
            {
                $statusCode = 401
            }

            Write-Json -Context $Context -StatusCode $statusCode -Value @{
                error = "Staff workspace was not loaded"
                message = $_.Exception.Message
            }
        }

        return
    }

    if ($Path -match "^/api/staff/homeworks/([0-9]+)/review$")
    {
        if ($Context.Request.HttpMethod -ne "POST")
        {
            Write-Json -Context $Context -StatusCode 405 -Value @{ error = "Method not allowed" }
            return
        }

        try
        {
            $payload = Read-RequestJson -Request $Context.Request
            Write-Json -Context $Context -StatusCode 200 -Value (Save-StaffHomeworkReview -Context $Context -AssignmentId ([int]$Matches[1]) -Payload $payload)
        }
        catch
        {
            $statusCode = 500

            if ($_.Exception.Message -like "*Only a teacher*" -or $_.Exception.Message -like "*Unauthorized*")
            {
                $statusCode = 401
            }
            elseif ($_.Exception.Message -like "*already checked*")
            {
                $statusCode = 409
            }
            elseif ($_.Exception.Message -like "*unavailable*" -or $_.Exception.Message -like "*Score*")
            {
                $statusCode = 400
            }
            elseif ($_.Exception.Message -like "*no submitted work*")
            {
                $statusCode = 400
            }

            Write-Json -Context $Context -StatusCode $statusCode -Value @{
                error = "Homework review was not saved"
                message = $_.Exception.Message
            }
        }

        return
    }

    if ($Path -eq "/api/staff/lessons")
    {
        if ($Context.Request.HttpMethod -ne "POST")
        {
            Write-Json -Context $Context -StatusCode 405 -Value @{ error = "Method not allowed" }
            return
        }

        try
        {
            $payload = Read-RequestJson -Request $Context.Request
            Write-Json -Context $Context -StatusCode 200 -Value (Save-StaffLesson -Context $Context -Payload $payload)
        }
        catch
        {
            $statusCode = 500

            if ($_.Exception.Message -like "*Only a teacher*" -or $_.Exception.Message -like "*Unauthorized*")
            {
                $statusCode = 401
            }
            elseif ($_.Exception.Message -like "*required*" -or $_.Exception.Message -like "*unavailable*")
            {
                $statusCode = 400
            }

            Write-Json -Context $Context -StatusCode $statusCode -Value @{
                error = "Lesson was not saved"
                message = $_.Exception.Message
            }
        }

        return
    }

    if ($Path -eq "/api/staff/streams")
    {
        if ($Context.Request.HttpMethod -ne "POST")
        {
            Write-Json -Context $Context -StatusCode 405 -Value @{ error = "Method not allowed" }
            return
        }

        try
        {
            $payload = Read-RequestJson -Request $Context.Request
            Write-Json -Context $Context -StatusCode 200 -Value (Save-StaffStream -Context $Context -Payload $payload)
        }
        catch
        {
            $statusCode = 500

            if ($_.Exception.Message -like "*Only a teacher*" -or $_.Exception.Message -like "*Unauthorized*")
            {
                $statusCode = 401
            }
            elseif ($_.Exception.Message -like "*required*" -or $_.Exception.Message -like "*unavailable*")
            {
                $statusCode = 400
            }

            Write-Json -Context $Context -StatusCode $statusCode -Value @{
                error = "Stream was not saved"
                message = $_.Exception.Message
            }
        }

        return
    }

    if ($Path -eq "/api/staff/reviews")
    {
        if ($Context.Request.HttpMethod -ne "POST")
        {
            Write-Json -Context $Context -StatusCode 405 -Value @{ error = "Method not allowed" }
            return
        }

        try
        {
            $payload = Read-RequestJson -Request $Context.Request
            Write-Json -Context $Context -StatusCode 200 -Value (Save-StaffResourceReview -Context $Context -Payload $payload)
        }
        catch
        {
            $statusCode = 500

            if ($_.Exception.Message -like "*Only a curator*" -or $_.Exception.Message -like "*Unauthorized*")
            {
                $statusCode = 401
            }
            elseif ($_.Exception.Message -like "*already reviewed*")
            {
                $statusCode = 409
            }
            elseif ($_.Exception.Message -like "*not checked by teacher*")
            {
                $statusCode = 400
            }
            elseif ($_.Exception.Message -like "*invalid*" -or $_.Exception.Message -like "*Rating*")
            {
                $statusCode = 400
            }

            Write-Json -Context $Context -StatusCode $statusCode -Value @{
                error = "Review was not saved"
                message = $_.Exception.Message
            }
        }

        return
    }

    if ($Path -match "^/api/staff/students/([0-9]+)/comment$")
    {
        if ($Context.Request.HttpMethod -ne "POST")
        {
            Write-Json -Context $Context -StatusCode 405 -Value @{ error = "Method not allowed" }
            return
        }

        try
        {
            $payload = Read-RequestJson -Request $Context.Request
            Write-Json -Context $Context -StatusCode 200 -Value (Save-StudentStaffComment -Context $Context -StudentId ([int]$Matches[1]) -Payload $payload)
        }
        catch
        {
            $statusCode = 500

            if ($_.Exception.Message -like "*Unauthorized*")
            {
                $statusCode = 401
            }
            elseif ($_.Exception.Message -like "*required*")
            {
                $statusCode = 400
            }

            Write-Json -Context $Context -StatusCode $statusCode -Value @{
                error = "Student comment was not saved"
                message = $_.Exception.Message
            }
        }

        return
    }

    if ($Path -eq "/api/shop")
    {
        if ($Context.Request.HttpMethod -ne "GET")
        {
            Write-Json -Context $Context -StatusCode 405 -Value @{ error = "Method not allowed" }
            return
        }

        try
        {
            $studentId = Get-RequestStudentId -Context $Context

            if ($studentId -le 0)
            {
                Write-Json -Context $Context -StatusCode 401 -Value @{
                    error = "Unauthorized"
                    message = "Войдите в аккаунт, чтобы открыть магазин."
                }
                return
            }

            Write-Json -Context $Context -StatusCode 200 -Value (Get-ShopFromSqlServer -StudentId $studentId)
        }
        catch
        {
            Write-Json -Context $Context -StatusCode 500 -Value @{
                error = "Shop was not loaded"
                message = $_.Exception.Message
            }
        }

        return
    }

    if ($Path -eq "/api/shop/purchase" -or $Path -eq "/api/shop/equip")
    {
        if ($Context.Request.HttpMethod -ne "POST")
        {
            Write-Json -Context $Context -StatusCode 405 -Value @{ error = "Method not allowed" }
            return
        }

        try
        {
            $studentId = Get-RequestStudentId -Context $Context

            if ($studentId -le 0)
            {
                Write-Json -Context $Context -StatusCode 401 -Value @{
                    error = "Unauthorized"
                    message = "Войдите в аккаунт, чтобы использовать магазин."
                }
                return
            }

            $payload = Read-RequestJson -Request $Context.Request
            $itemCode = Get-TextValue -Object $payload -Name "itemCode" -MaxLength 80

            if ([string]::IsNullOrWhiteSpace($itemCode))
            {
                Write-Json -Context $Context -StatusCode 400 -Value @{
                    error = "Invalid item"
                    message = "Предмет магазина не выбран."
                }
                return
            }

            if ($Path -eq "/api/shop/purchase")
            {
                Write-Json -Context $Context -StatusCode 200 -Value (Invoke-ShopPurchase -StudentId $studentId -ItemCode $itemCode)
            }
            else
            {
                Write-Json -Context $Context -StatusCode 200 -Value (Invoke-ShopEquip -StudentId $studentId -ItemCode $itemCode)
            }
        }
        catch
        {
            $statusCode = 500
            $message = $_.Exception.Message

            if ($message -like "*Not enough points*")
            {
                $statusCode = 400
                $message = "Не хватает баллов для покупки."
            }
            elseif ($message -like "*already purchased*")
            {
                $statusCode = 409
                $message = "Этот предмет уже куплен."
            }
            elseif ($message -like "*was not purchased*")
            {
                $statusCode = 400
                $message = "Сначала купите этот предмет."
            }
            elseif ($message -like "*was not found*")
            {
                $statusCode = 404
                $message = "Предмет не найден."
            }

            Write-Json -Context $Context -StatusCode $statusCode -Value @{
                error = "Shop action failed"
                message = $message
            }
        }

        return
    }

    if ($Path -eq "/api/messages")
    {
        if ($Context.Request.HttpMethod -eq "GET")
        {
            try
            {
                $conversationId = 0
                [void][int]::TryParse($Context.Request.QueryString["conversationId"], [ref]$conversationId)
                Write-Json -Context $Context -StatusCode 200 -Value (Get-MessagesFromSqlServer -Context $Context -ConversationId $conversationId)
            }
            catch
            {
                $statusCode = 500

                if ($_.Exception.Message -like "*Unauthorized*")
                {
                    $statusCode = 401
                }

                Write-Json -Context $Context -StatusCode $statusCode -Value @{
                    error = "Messages were not loaded"
                    message = $_.Exception.Message
                }
            }

            return
        }

        if ($Context.Request.HttpMethod -eq "POST")
        {
            try
            {
                $payload = Read-RequestJson -Request $Context.Request
                Write-Json -Context $Context -StatusCode 201 -Value (Save-MessageToSqlServer -Context $Context -Payload $payload)
            }
            catch
            {
                $statusCode = 500

                if ($_.Exception.Message -like "*Unauthorized*")
                {
                    $statusCode = 401
                }
                elseif ($_.Exception.Message -like "*required*" -or $_.Exception.Message -like "*unavailable*")
                {
                    $statusCode = 400
                }

                Write-Json -Context $Context -StatusCode $statusCode -Value @{
                    error = "Message was not saved"
                    message = $_.Exception.Message
                }
            }

            return
        }

        Write-Json -Context $Context -StatusCode 405 -Value @{ error = "Method not allowed" }
        return
    }

    if ($Path -eq "/api/streams")
    {
        if ($Context.Request.HttpMethod -ne "GET")
        {
            Write-Json -Context $Context -StatusCode 405 -Value @{ error = "Method not allowed" }
            return
        }

        try
        {
            Write-Json -Context $Context -StatusCode 200 -Value (Get-StreamsFromSqlServer -CourseSlug $null)
        }
        catch
        {
            Write-Json -Context $Context -StatusCode 500 -Value @{
                error = "Streams were not loaded"
                message = $_.Exception.Message
            }
        }

        return
    }

    if ($Path -match "^/api/courses/([^/]+)/streams$")
    {
        if ($Context.Request.HttpMethod -ne "GET")
        {
            Write-Json -Context $Context -StatusCode 405 -Value @{ error = "Method not allowed" }
            return
        }

        try
        {
            $courseSlug = [System.Web.HttpUtility]::UrlDecode($Matches[1])
            Write-Json -Context $Context -StatusCode 200 -Value (Get-StreamsFromSqlServer -CourseSlug $courseSlug)
        }
        catch
        {
            Write-Json -Context $Context -StatusCode 500 -Value @{
                error = "Streams were not loaded"
                message = $_.Exception.Message
            }
        }

        return
    }

    if ($Path -match "^/api/courses/([^/]+)/lessons$")
    {
        if ($Context.Request.HttpMethod -ne "GET")
        {
            Write-Json -Context $Context -StatusCode 405 -Value @{ error = "Method not allowed" }
            return
        }

        $courseSlug = [System.Web.HttpUtility]::UrlDecode($Matches[1])
        $studentId = Get-RequestStudentId -Context $Context

        try
        {
            $payload = Get-LessonsFromSqlServer -CourseSlug $courseSlug -StudentId $studentId
        }
        catch
        {
            Write-Host "SQL Server is unavailable, using seed data: $($_.Exception.Message)"
            $payload = Get-LessonsFromSeed -CourseSlug $courseSlug
        }

        if ($null -eq $payload)
        {
            Write-Json -Context $Context -StatusCode 404 -Value @{ error = "Course not found" }
            return
        }

        Write-Json -Context $Context -StatusCode 200 -Value $payload
        return
    }

    if ($Path -match "^/api/homeworks/([0-9]+)/submit$")
    {
        if ($Context.Request.HttpMethod -ne "POST")
        {
            Write-Json -Context $Context -StatusCode 405 -Value @{ error = "Method not allowed" }
            return
        }

        $assignmentId = [int]$Matches[1]
        try
        {
            $payload = Read-RequestJson -Request $Context.Request
        }
        catch
        {
            Write-Json -Context $Context -StatusCode 400 -Value @{
                error = "Invalid JSON"
                message = "Некорректный JSON в запросе."
            }
            return
        }

        $homeworkLink = Normalize-HomeworkLink -Value ([string]$payload.homeworkLink)

        if (-not (Test-GoogleHomeworkLink -Value $homeworkLink))
        {
            Write-Json -Context $Context -StatusCode 400 -Value @{
                error = "Invalid homework link"
                message = "Вставьте ссылку на файл или документ в Google Drive."
            }
            return
        }

        try
        {
            $studentId = Get-RequestStudentId -Context $Context

            if ($studentId -le 0)
            {
                Write-Json -Context $Context -StatusCode 401 -Value @{
                    error = "Unauthorized"
                    message = "Войдите или создайте аккаунт, чтобы сдавать ДЗ."
                }
                return
            }

            $saved = Save-HomeworkSubmissionToSqlServer -AssignmentId $assignmentId -StudentId $studentId -HomeworkLink $homeworkLink
            Write-Json -Context $Context -StatusCode 201 -Value $saved
        }
        catch
        {
            if ($_.Exception.Message -like "*Checked homework cannot be overwritten*")
            {
                Write-Json -Context $Context -StatusCode 409 -Value @{
                    error = "Checked homework cannot be overwritten"
                    message = "Проверенное ДЗ нельзя заменить с сайта."
                }
                return
            }

            if ($_.Exception.Message -like "*not found for this student*")
            {
                Write-Json -Context $Context -StatusCode 404 -Value @{
                    error = "Homework assignment was not found"
                    message = "Это ДЗ не найдено для текущего аккаунта. Войдите заново и откройте курс."
                }
                return
            }

            Write-Host "SQL Server did not save homework link, using local fallback: $($_.Exception.Message)"

            try
            {
                $saved = Save-HomeworkSubmissionToFallback -AssignmentId $assignmentId -HomeworkLink $homeworkLink
                Write-Json -Context $Context -StatusCode 201 -Value $saved
            }
            catch
            {
                Write-Json -Context $Context -StatusCode 500 -Value @{
                    error = "Homework link was not saved"
                    message = $_.Exception.Message
                }
            }
        }

        return
    }

    if ($Path -eq "/api/account")
    {
        if ($Context.Request.HttpMethod -ne "GET")
        {
            Write-Json -Context $Context -StatusCode 405 -Value @{ error = "Method not allowed" }
            return
        }

        try
        {
            $studentId = Get-RequestStudentId -Context $Context
            $authToken = $null

            if ($studentId -le 0)
            {
                Write-Json -Context $Context -StatusCode 401 -Value @{
                    error = "Unauthorized"
                    message = "Войдите или создайте аккаунт."
                }
                return
            }

            if ($studentId -gt 0)
            {
                $authToken = $Context.Request.Headers["X-Auth-Token"]
            }

            Write-Json -Context $Context -StatusCode 200 -Value (Get-AccountFromSqlServer -StudentId $studentId -AuthToken $authToken)
        }
        catch
        {
            Write-Json -Context $Context -StatusCode 500 -Value @{
                error = "Account was not loaded"
                message = $_.Exception.Message
            }
        }

        return
    }

    if ($Path -eq "/api/auth/register")
    {
        if ($Context.Request.HttpMethod -ne "POST")
        {
            Write-Json -Context $Context -StatusCode 405 -Value @{ error = "Method not allowed" }
            return
        }

        try
        {
            $payload = Read-RequestJson -Request $Context.Request
        }
        catch
        {
            Write-Json -Context $Context -StatusCode 400 -Value @{ error = "Invalid JSON" }
            return
        }

        try
        {
            Write-Json -Context $Context -StatusCode 201 -Value (Save-RegisteredStudentToSqlServer -Payload $payload)
        }
        catch
        {
            $statusCode = 500
            $message = $_.Exception.Message

            if ($_.Exception.Message -like "*Account already exists*")
            {
                $statusCode = 409
                $message = "Такой логин уже занят."
            }
            elseif ($_.Exception.Message -like "*required*" -or
                    $_.Exception.Message -like "*Введите*" -or
                    $_.Exception.Message -like "*Логин*" -or
                    $_.Exception.Message -like "*Password*" -or
                    $_.Exception.Message -like "*Grade*" -or
                    $_.Exception.Message -like "*name*")
            {
                $statusCode = 400
            }

            Write-Json -Context $Context -StatusCode $statusCode -Value @{
                error = "Registration failed"
                message = $message
            }
        }

        return
    }

    if ($Path -eq "/api/auth/login")
    {
        if ($Context.Request.HttpMethod -ne "POST")
        {
            Write-Json -Context $Context -StatusCode 405 -Value @{ error = "Method not allowed" }
            return
        }

        try
        {
            $payload = Read-RequestJson -Request $Context.Request
        }
        catch
        {
            Write-Json -Context $Context -StatusCode 400 -Value @{ error = "Invalid JSON" }
            return
        }

        try
        {
            Write-Json -Context $Context -StatusCode 200 -Value (Login-StudentToSqlServer -Payload $payload)
        }
        catch
        {
            $message = $_.Exception.Message

            if ($message -like "*Wrong login or password*")
            {
                $message = "Неверный логин или пароль."
            }

            Write-Json -Context $Context -StatusCode 401 -Value @{
                error = "Login failed"
                message = $message
            }
        }

        return
    }

    if ($Path -match "^/api/courses/([^/]+)/homeworks$")
    {
        if ($Context.Request.HttpMethod -ne "GET")
        {
            Write-Json -Context $Context -StatusCode 405 -Value @{ error = "Method not allowed" }
            return
        }

        try
        {
            $courseSlug = [System.Web.HttpUtility]::UrlDecode($Matches[1])
            $studentId = Get-RequestStudentId -Context $Context
            Write-Json -Context $Context -StatusCode 200 -Value (Get-HomeworksFromSqlServer -CourseSlug $courseSlug -StudentId $studentId)
        }
        catch
        {
            Write-Json -Context $Context -StatusCode 500 -Value @{
                error = "Homeworks were not loaded"
                message = $_.Exception.Message
            }
        }

        return
    }

    if ($Path -eq "/api/homeworks")
    {
        if ($Context.Request.HttpMethod -ne "GET")
        {
            Write-Json -Context $Context -StatusCode 405 -Value @{ error = "Method not allowed" }
            return
        }

        try
        {
            $studentId = Get-RequestStudentId -Context $Context
            Write-Json -Context $Context -StatusCode 200 -Value (Get-HomeworksFromSqlServer -CourseSlug $null -StudentId $studentId)
        }
        catch
        {
            Write-Json -Context $Context -StatusCode 500 -Value @{
                error = "Homeworks were not loaded"
                message = $_.Exception.Message
            }
        }

        return
    }

    if ($Path -match "^/api/courses/([^/]+)/notes$")
    {
        if ($Context.Request.HttpMethod -ne "GET")
        {
            Write-Json -Context $Context -StatusCode 405 -Value @{ error = "Method not allowed" }
            return
        }

        try
        {
            $courseSlug = [System.Web.HttpUtility]::UrlDecode($Matches[1])
            Write-Json -Context $Context -StatusCode 200 -Value (Get-NotesFromSqlServer -CourseSlug $courseSlug)
        }
        catch
        {
            Write-Json -Context $Context -StatusCode 500 -Value @{
                error = "Notes were not loaded"
                message = $_.Exception.Message
            }
        }

        return
    }

    if ($Path -eq "/api/notes")
    {
        if ($Context.Request.HttpMethod -ne "GET")
        {
            Write-Json -Context $Context -StatusCode 405 -Value @{ error = "Method not allowed" }
            return
        }

        try
        {
            Write-Json -Context $Context -StatusCode 200 -Value (Get-NotesFromSqlServer -CourseSlug $null)
        }
        catch
        {
            Write-Json -Context $Context -StatusCode 500 -Value @{
                error = "Notes were not loaded"
                message = $_.Exception.Message
            }
        }

        return
    }

    if ($Path -eq "/api/applications")
    {
        if ($Context.Request.HttpMethod -ne "POST")
        {
            Write-Json -Context $Context -StatusCode 405 -Value @{ error = "Method not allowed" }
            return
        }

        try
        {
            $application = Read-RequestJson -Request $Context.Request
        }
        catch
        {
            Write-Json -Context $Context -StatusCode 400 -Value @{ error = "Invalid JSON" }
            return
        }

        try
        {
            $saved = Save-ApplicationToSqlServer -Application $application
            Write-Json -Context $Context -StatusCode 201 -Value $saved
        }
        catch
        {
            Write-Json -Context $Context -StatusCode 500 -Value @{
                error = "Application was not saved"
                message = $_.Exception.Message
            }
        }

        return
    }

    if ($Path -eq "/api/support")
    {
        if ($Context.Request.HttpMethod -ne "POST")
        {
            Write-Json -Context $Context -StatusCode 405 -Value @{ error = "Method not allowed" }
            return
        }

        try
        {
            $payload = Read-RequestJson -Request $Context.Request
        }
        catch
        {
            Write-Json -Context $Context -StatusCode 400 -Value @{ error = "Invalid JSON" }
            return
        }

        try
        {
            $studentId = Get-RequestStudentId -Context $Context
            $saved = Save-SupportRequestToSqlServer -StudentId $studentId -Payload $payload
            Write-Json -Context $Context -StatusCode 201 -Value $saved
        }
        catch
        {
            try
            {
                $studentId = Get-RequestStudentId -Context $Context
                $topic = Get-TextValue -Object $payload -Name "topic" -MaxLength 100
                $message = Get-TextValue -Object $payload -Name "message" -MaxLength 2000
                $saved = Save-SupportRequestToFallback -StudentId $studentId -Topic $topic -Message $message
                Write-Json -Context $Context -StatusCode 201 -Value $saved
            }
            catch
            {
                Write-Json -Context $Context -StatusCode 500 -Value @{
                    error = "Support request was not saved"
                    message = $_.Exception.Message
                }
            }
        }

        return
    }

    if ($Path -eq "/api/health")
    {
        try
        {
            Write-Json -Context $Context -StatusCode 200 -Value @{
                source = "database"
                database = Test-SqlServerConnection
            }
        }
        catch
        {
            Write-Json -Context $Context -StatusCode 503 -Value @{
                source = "database"
                error = "SQL Server unavailable"
                message = $_.Exception.Message
            }
        }

        return
    }

    Write-Json -Context $Context -StatusCode 404 -Value @{ error = "API endpoint not found" }
}

function Handle-StaticRequest
{
    param
    (
        [System.Net.HttpListenerContext]$Context,
        [string]$Path
    )

    $relativePath = [System.Web.HttpUtility]::UrlDecode($Path).TrimStart("/")

    if ([string]::IsNullOrWhiteSpace($relativePath))
    {
        $relativePath = "index.html"
    }

    $fullPath = [System.IO.Path]::GetFullPath((Join-Path $RootFullPath $relativePath))

    if (-not $fullPath.StartsWith($RootFullPath, [System.StringComparison]::OrdinalIgnoreCase))
    {
        Write-Json -Context $Context -StatusCode 403 -Value @{ error = "Forbidden" }
        return
    }

    if ((Test-Path $fullPath -PathType Container))
    {
        $fullPath = Join-Path $fullPath "index.html"
    }

    if (-not (Test-Path $fullPath -PathType Leaf))
    {
        Write-Json -Context $Context -StatusCode 404 -Value @{ error = "Not found" }
        return
    }

    $bytes = [System.IO.File]::ReadAllBytes($fullPath)
    Write-Response -Context $Context -StatusCode 200 -Bytes $bytes -ContentType (Get-MimeType $fullPath)
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://127.0.0.1:$Port/")
$listener.Start()

Write-Host "Serving $RootFullPath"
Write-Host "Open http://127.0.0.1:$Port/"
Write-Host "Press Ctrl+C to stop."

while ($listener.IsListening)
{
    $context = $listener.GetContext()
    $path = $context.Request.Url.AbsolutePath

    try
    {
        if ($path.StartsWith("/api/", [System.StringComparison]::OrdinalIgnoreCase))
        {
            Handle-ApiRequest -Context $context -Path $path
        }
        else
        {
            Handle-StaticRequest -Context $context -Path $path
        }
    }
    catch
    {
        Write-Host ("Request failed {0}: {1}" -f $path, $_.Exception.Message)

        try
        {
            Write-Json -Context $context -StatusCode 500 -Value @{
                error = "Server error"
                message = $_.Exception.Message
            }
        }
        catch
        {
            Write-Host ("Could not send error response: {0}" -f $_.Exception.Message)
        }
    }
}
