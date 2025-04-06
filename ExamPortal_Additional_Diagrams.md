# ExamPortal Additional Diagrams

This document contains additional UML diagrams for the ExamPortal project, including Activity, Sequence, Class, State, and Swimlane diagrams.

## Activity Diagram: Exam Taking Process

```mermaid
flowchart TD
    Start([Start]) --> Login[Student Login]
    Login --> ViewAvailableExams[View Available Exams]
    ViewAvailableExams --> SelectExam[Select Exam]
    SelectExam --> ReadInstructions[Read Exam Instructions]
    ReadInstructions --> AgreeToRules{Agree to\nRules?}
    AgreeToRules -- No --> ViewAvailableExams
    AgreeToRules -- Yes --> StartExam[Start Exam]
    StartExam --> AnswerQuestions[Answer Questions]
    AnswerQuestions --> ReviewAnswers[Review Answers]
    ReviewAnswers --> SubmitExam{Submit\nExam?}
    SubmitExam -- No --> AnswerQuestions
    SubmitExam -- Yes --> ConfirmSubmission{Confirm\nSubmission?}
    ConfirmSubmission -- No --> ReviewAnswers
    ConfirmSubmission -- Yes --> SubmitFinal[Submit Final Answers]
    SubmitFinal --> ViewResults[View Results]
    ViewResults --> End([End])
```

## Sequence Diagram: Exam Creation and Taking Process

```mermaid
sequenceDiagram
    actor Admin
    actor Student
    participant Auth as Authentication Service
    participant ExamService
    participant QuestionService
    participant MonitoringService
    participant ResultService
    participant DB as Database
    
    %% Admin Creates an Exam
    Admin->>Auth: Login
    Auth->>DB: Verify Credentials
    DB-->>Auth: Credentials Valid
    Auth-->>Admin: Authentication Success
    
    Admin->>ExamService: Create New Exam
    ExamService->>DB: Store Exam Details
    DB-->>ExamService: Exam Created
    ExamService-->>Admin: Exam Creation Confirmation
    
    Admin->>QuestionService: Add Questions to Exam
    QuestionService->>DB: Store Questions & Options
    DB-->>QuestionService: Questions Saved
    QuestionService-->>Admin: Questions Added Confirmation
    
    Admin->>ExamService: Publish Exam
    ExamService->>DB: Update Exam Status
    DB-->>ExamService: Status Updated
    ExamService-->>Admin: Publish Confirmation
    
    %% Student Takes the Exam
    Student->>Auth: Login
    Auth->>DB: Verify Credentials
    DB-->>Auth: Credentials Valid
    Auth-->>Student: Authentication Success
    
    Student->>ExamService: View Available Exams
    ExamService->>DB: Fetch Available Exams
    DB-->>ExamService: Return Exam List
    ExamService-->>Student: Display Exam List
    
    Student->>ExamService: Select Exam
    ExamService->>DB: Fetch Exam Details
    DB-->>ExamService: Return Exam Details
    ExamService-->>Student: Display Exam Instructions
    
    Student->>ExamService: Start Exam
    ExamService->>QuestionService: Fetch Questions
    QuestionService->>DB: Get Questions for Exam
    DB-->>QuestionService: Return Questions
    QuestionService-->>ExamService: Provide Questions
    ExamService-->>Student: Display Questions
    
    activate MonitoringService
    MonitoringService->>DB: Log Start Time
    MonitoringService->>Student: Monitor Activity
    
    Student->>ExamService: Answer Questions
    
    MonitoringService->>DB: Log Focus/Blur Events
    
    Student->>ExamService: Submit Exam
    ExamService->>ResultService: Process Answers
    ResultService->>DB: Grade Answers
    DB-->>ResultService: Return Score
    ResultService-->>ExamService: Provide Results
    ExamService-->>Student: Display Results
    
    deactivate MonitoringService
```

## Class Diagram: ExamPortal System

```mermaid
classDiagram
    class User {
        -String _id
        -String name
        -String email
        -String password
        -String role
        -String profileImage
        -Date lastLogin
        -String status
        -Date createdAt
        -Date updatedAt
        +register()
        +login()
        +logout()
        +updateProfile()
        +changePassword()
    }
    
    class Admin {
        +createExam()
        +editExam()
        +deleteExam()
        +publishExam()
        +viewResults()
        +generateReports()
    }
    
    class Student {
        +viewAvailableExams()
        +takeExam()
        +viewResults()
        +viewHistory()
    }
    
    class Exam {
        -String _id
        -String title
        -String subject
        -Number duration
        -String instructions
        -String rules
        -Number maxMarks
        -String createdBy
        -Boolean scheduled
        -Date scheduledAt
        -Date startsAt
        -Date endsAt
        -Number allowedAttempts
        -Number passingPercentage
        -Boolean randomizeQuestions
        -String visibilityStatus
        -Date createdAt
        -Date updatedAt
        +createQuestions()
        +updateDetails()
        +publish()
        +calculateResults()
    }
    
    class Question {
        -String _id
        -String examId
        -String questionText
        -String questionType
        -Number marks
        -Number correctOption
        -Number order
        -Boolean isRequired
        -Date createdAt
        -Date updatedAt
        +addOptions()
        +updateQuestion()
        +validateAnswer()
    }
    
    class Option {
        -String _id
        -String questionId
        -String optionText
        -Number order
        -Boolean isCorrect
        +updateOption()
    }
    
    class Result {
        -String _id
        -String studentId
        -String examId
        -Map answers
        -Number score
        -Number percentage
        -String status
        -Date submittedAt
        -Number timeSpent
        -Number attemptNumber
        -Object browserInfo
        -String ipAddress
        -Date createdAt
        -Date updatedAt
        +calculateScore()
        +generateCertificate()
    }
    
    class MonitoringLog {
        -String _id
        -String studentId
        -String examId
        -String activityType
        -Date timestamp
        -String description
        -Object metadata
        -Date createdAt
        +logActivity()
        +detectSuspiciousActivity()
    }
    
    class ExamService {
        +createExam()
        +updateExam()
        +deleteExam()
        +publishExam()
        +getAvailableExams()
        +startExam()
        +submitExam()
    }
    
    class AuthService {
        +register()
        +login()
        +logout()
        +verifyToken()
        +refreshToken()
    }
    
    class ResultService {
        +processAnswers()
        +calculateScore()
        +generateReport()
    }
    
    User <|-- Admin
    User <|-- Student
    Admin "1" -- "many" Exam : creates
    Exam "1" -- "many" Question : contains
    Question "1" -- "many" Option : has
    Student "1" -- "many" Result : receives
    Exam "1" -- "many" Result : produces
    Student "1" -- "many" MonitoringLog : generates
    Exam "1" -- "many" MonitoringLog : monitors
```

## State Diagram: Exam Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Draft: Admin creates exam
    
    Draft --> InReview: Admin submits for review
    InReview --> Draft: Requires changes
    
    InReview --> Published: Approved
    Published --> Scheduled: Admin schedules exam
    
    Scheduled --> Active: Exam start time reached
    
    Active --> Completed: Exam end time reached
    Active --> Completed: All students submitted
    
    Completed --> ResultsGenerated: System processes results
    
    ResultsGenerated --> Archived: Admin archives exam
    Published --> Archived: Admin archives exam
    
    Archived --> [*]
    
    note right of Draft
        Admin can add/edit questions
        and exam details
    end note
    
    note right of Published
        Students can see upcoming exam
        but cannot take it yet
    end note
    
    note right of Active
        Students can access and
        take the exam
    end note
    
    note right of ResultsGenerated
        Students can view their scores
        Admin can generate reports
    end note
```

## Swimlane Diagram: Exam Management Process

```mermaid
flowchart TD
    %% Define swimlanes
    subgraph Admin
        A1[Create Exam Template]
        A2[Add Questions & Options]
        A3[Review Exam]
        A4[Publish Exam]
        A5[Schedule Exam]
        A8[Generate Reports]
        A9[Archive Exam]
    end
    
    subgraph System
        S1[Validate Exam Settings]
        S2[Store Exam in Database]
        S3[Notify Students]
        S4[Activate Exam at Start Time]
        S5[Monitor Student Activity]
        S6[Process Results]
        S7[Apply Grading Rules]
    end
    
    subgraph Student
        ST1[Receive Notification]
        ST2[View Exam Details]
        ST3[Start Exam]
        ST4[Answer Questions]
        ST5[Submit Exam]
        ST6[View Results]
    end
    
    %% Define flow
    A1 --> A2
    A2 --> A3
    A3 --> S1
    S1 --> A4
    A4 --> S2
    S2 --> A5
    A5 --> S3
    S3 --> ST1
    ST1 --> ST2
    ST2 --> S4
    S4 --> ST3
    ST3 --> S5
    S5 --> ST4
    ST4 --> ST5
    ST5 --> S6
    S6 --> S7
    S7 --> ST6
    S7 --> A8
    A8 --> A9
```

## Activity Diagram: Student Monitoring Process

```mermaid
flowchart TD
    Start([Start]) --> BeginExam[Student Begins Exam]
    BeginExam --> InitMonitoring[Initialize Monitoring System]
    InitMonitoring --> TrackActivity[Track Student Activity]
    
    TrackActivity --> DetectAction{Detect Action}
    
    DetectAction -- Tab Change --> LogTabChange[Log Tab Change Event]
    LogTabChange --> EvaluateSeverity1{Evaluate Severity}
    EvaluateSeverity1 -- Minor --> WarnStudent1[Display Warning]
    EvaluateSeverity1 -- Severe --> FlagSuspicious1[Flag as Suspicious Activity]
    WarnStudent1 --> TrackActivity
    FlagSuspicious1 --> TrackActivity
    
    DetectAction -- Window Blur --> LogBlurEvent[Log Window Blur Event]
    LogBlurEvent --> EvaluateSeverity2{Evaluate Severity}
    EvaluateSeverity2 -- Minor --> WarnStudent2[Display Warning]
    EvaluateSeverity2 -- Severe --> FlagSuspicious2[Flag as Suspicious Activity]
    WarnStudent2 --> TrackActivity
    FlagSuspicious2 --> TrackActivity
    
    DetectAction -- Unusual Timing --> LogTimingIssue[Log Timing Anomaly]
    LogTimingIssue --> EvaluateSeverity3{Evaluate Severity}
    EvaluateSeverity3 -- Minor --> WarnStudent3[Display Warning]
    EvaluateSeverity3 -- Severe --> FlagSuspicious3[Flag as Suspicious Activity]
    WarnStudent3 --> TrackActivity
    FlagSuspicious3 --> TrackActivity
    
    DetectAction -- Exam Submission --> EndMonitoring[End Monitoring Session]
    EndMonitoring --> GenerateReport[Generate Monitoring Report]
    GenerateReport --> End([End])
```

## Sequence Diagram: Student Authentication and Monitoring

```mermaid
sequenceDiagram
    actor Student
    participant UI as User Interface
    participant Auth as Authentication Service
    participant Session as Session Manager
    participant Monitor as Monitoring Service
    participant API as API Gateway
    participant DB as Database
    
    Student->>UI: Enter Credentials
    UI->>Auth: Submit Login Request
    Auth->>DB: Verify Credentials
    DB-->>Auth: Return User Data
    
    alt Invalid Credentials
        Auth-->>UI: Authentication Failed
        UI-->>Student: Display Error Message
    else Valid Credentials
        Auth->>Session: Create User Session
        Session-->>Auth: Return Session Token
        Auth-->>UI: Authentication Success
        UI-->>Student: Redirect to Dashboard
        
        Student->>UI: Select Exam
        UI->>API: Request Exam Details
        API->>DB: Fetch Exam Data
        DB-->>API: Return Exam Details
        API-->>UI: Display Exam Information
        
        Student->>UI: Start Exam
        UI->>Monitor: Initialize Monitoring
        Monitor->>DB: Create Monitoring Session
        DB-->>Monitor: Monitoring Active
        
        loop During Exam
            Monitor->>UI: Track Browser Events
            
            alt Tab Switch Detected
                UI->>Monitor: Report Tab Switch
                Monitor->>DB: Log Suspicious Activity
                Monitor->>UI: Display Warning
                UI-->>Student: Show Warning Message
            end
            
            alt Window Blur Detected
                UI->>Monitor: Report Window Blur
                Monitor->>DB: Log Suspicious Activity
                Monitor->>UI: Display Warning
                UI-->>Student: Show Warning Message
            end
        end
        
        Student->>UI: Submit Exam
        UI->>Monitor: End Monitoring Session
        Monitor->>DB: Save Monitoring Data
        UI->>API: Submit Exam Answers
        API->>DB: Store Answers & Calculate Score
        DB-->>API: Return Results
        API-->>UI: Display Results
        UI-->>Student: Show Exam Results
    end
``` 