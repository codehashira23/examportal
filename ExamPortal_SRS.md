# Software Requirements Specification

## ExamPortal: Modern Online Examination System

**Version:** 1.0  
**Date:** 06/4/2025
**Prepared by:** Development Team  

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) document outlines the requirements for the ExamPortal system, a comprehensive online examination platform designed for educational institutions. It details the functional and non-functional requirements, constraints, and system interfaces.

### 1.2 Scope
ExamPortal is a web-based application that facilitates secure online examination administration, monitoring, and result analysis. The system will support multiple user roles (administrators and students) with role-specific functionalities to streamline the end-to-end examination process.

### 1.3 Definitions, Acronyms, and Abbreviations
- **SRS:** Software Requirements Specification
- **UI:** User Interface
- **API:** Application Programming Interface
- **CRUD:** Create, Read, Update, Delete
- **JWT:** JSON Web Token
- **SSR:** Server-Side Rendering
- **LMS:** Learning Management System

### 1.4 References
- IEEE Standard 830-1998: IEEE Recommended Practice for Software Requirements Specifications
- Next.js Documentation: https://nextjs.org/docs
- MongoDB Documentation: https://docs.mongodb.com/
- React Documentation: https://reactjs.org/docs

### 1.5 Overview
The remainder of this document provides a detailed description of the ExamPortal system. It includes system features, user characteristics, constraints, assumptions and dependencies, and specific requirements categorized by user roles and system functionality.

---

## 2. Overall Description

### 2.1 Product Perspective
ExamPortal is a standalone system designed to integrate with existing educational infrastructure. It provides a complete solution for conducting secure online examinations, from creation to result analysis. The system is built using modern web technologies and follows best practices in security and user experience design.

### 2.2 Product Functions
The primary functions of ExamPortal include:
- User authentication and role-based access control
- Exam creation and management
- Secure exam administration
- Real-time monitoring of exam activities
- Automated grading and result generation
- Performance analytics and reporting
- User management

### 2.3 User Classes and Characteristics

#### 2.3.1 Administrators
- Educational staff responsible for creating and managing exams
- Require comprehensive control over exam settings
- Need access to monitoring tools and result analytics
- Technical proficiency: Moderate to high

#### 2.3.2 Students
- End-users taking examinations
- Need intuitive interface to navigate exams
- Require secure and stable examination environment
- Technical proficiency: Varied (system must be accessible to all)

### 2.4 Operating Environment
- Web-based application accessible via standard browsers
- Server environment: Node.js runtime
- Database: MongoDB
- Deployment: Cloud-based infrastructure
- Client devices: Desktop computers, laptops, tablets, and smartphones
- Supported browsers: Chrome, Firefox, Safari, Edge (latest two versions)

### 2.5 Design and Implementation Constraints
- Development must use Next.js framework and React
- Database implementation limited to MongoDB
- User authentication must use JWT-based session management
- Must comply with accessibility guidelines (WCAG 2.1 AA)
- System must ensure security and privacy of examination data
- Responsive design required for multi-device support

### 2.6 Assumptions and Dependencies
- Users have access to a stable internet connection
- Client devices meet minimum hardware requirements
- MongoDB Atlas available for database hosting
- Vercel or similar platform available for application hosting
- Users have basic familiarity with web applications

---

## 3. Specific Requirements

### 3.1 External Interface Requirements

#### 3.1.1 User Interfaces
- **Login/Registration Screen**
  - Fields for email and password
  - Role selection (admin/student)
  - Password reset functionality

- **Admin Dashboard**
  - Overview of created exams
  - User management section
  - Analytics visualization
  - System settings

- **Exam Creation Interface**
  - Form for exam details (title, duration, etc.)
  - Question editor with multiple question types
  - Settings for randomization and time limits
  - Preview functionality

- **Student Dashboard**
  - List of available and completed exams
  - Performance metrics visualization
  - Profile settings

- **Examination Interface**
  - Question display with navigation
  - Timer display
  - Answer submission controls
  - Status indicators

- **Results Interface**
  - Score display
  - Performance breakdown by topic/question
  - Correct answer review (if enabled)

#### 3.1.2 Hardware Interfaces
Not applicable as the system is web-based with no direct hardware interactions.

#### 3.1.3 Software Interfaces
- **Database Interface**
  - MongoDB connection for data storage and retrieval
  - Mongoose ODM for data modeling

- **Authentication Service**
  - NextAuth.js integration for user authentication
  - JWT service for token generation and validation

- **File Storage Service**
  - Integration for storing images and other media

#### 3.1.4 Communications Interfaces
- RESTful API for client-server communication
- WebSockets for real-time updates during examinations

### 3.2 Functional Requirements

#### 3.2.1 Authentication & User Management

**FR-1:** User Registration
- System shall allow new users to register with email, password, and role
- System shall validate email uniqueness
- System shall enforce password strength requirements
- System shall send verification email to confirm registration

**FR-2:** User Authentication
- System shall authenticate users with email and password
- System shall generate and manage JWT tokens for session management
- System shall provide secure password reset functionality
- System shall implement login attempt limits to prevent brute force attacks

**FR-3:** User Profile Management
- System shall allow users to view and edit their profile information
- System shall permit password changes
- System shall support profile image upload

**FR-4:** Role-Based Access Control
- System shall restrict access to features based on user role
- System shall prevent unauthorized access to admin functions
- System shall maintain separation between student accounts

#### 3.2.2 Admin Functionality

**FR-5:** Exam Creation
- System shall allow admins to create new exams with title, subject, and duration
- System shall support creation of multiple question types
- System shall allow setting maximum marks for each question
- System shall permit adding instructions and rules for exams
- System shall support saving exams as drafts before publishing

**FR-6:** Exam Management
- System shall provide CRUD operations for existing exams
- System shall allow scheduling/unscheduling of exams
- System shall support duplication of existing exams
- System shall permit importing questions from external sources
- System shall allow randomization of questions and answer options

**FR-7:** Student Management
- System shall allow admins to view registered students
- System shall support filtering and searching for specific students
- System shall permit enabling/disabling student accounts
- System shall allow assigning students to specific exams

**FR-8:** Monitoring
- System shall detect and log tab switching during exams
- System shall record exam progress in real-time
- System shall alert admins to suspicious activities
- System shall track time spent on individual questions

**FR-9:** Results Management
- System shall provide detailed results for all exams
- System shall support filtering results by exam/student
- System shall allow exporting results in various formats
- System shall generate performance analytics

#### 3.2.3 Student Functionality

**FR-10:** Exam Access
- System shall display all available exams to eligible students
- System shall enforce exam scheduling restrictions
- System shall provide exam instructions before starting
- System shall verify eligibility before allowing exam access

**FR-11:** Exam Taking
- System shall present questions with multiple-choice options
- System shall provide navigation between questions
- System shall display a countdown timer
- System shall auto-save answers periodically
- System shall allow students to flag questions for review
- System shall confirm submission before finalizing

**FR-12:** Result Viewing
- System shall display scores immediately after submission
- System shall provide detailed breakdown of performance
- System shall show correct answers (if enabled by admin)
- System shall allow reviewing past exam results
- System shall visualize performance trends over time

### 3.3 Non-Functional Requirements

#### 3.3.1 Performance Requirements

**NFR-1:** Response Time
- System shall load pages within 2 seconds under normal conditions
- System shall process form submissions within 1 second
- System shall handle at least 500 concurrent users without degradation

**NFR-2:** Reliability
- System shall be available 99.9% of the time
- System shall automatically recover from crashes
- System shall preserve exam progress in case of disruptions
- System shall maintain data integrity across all operations

**NFR-3:** Scalability
- System shall support horizontal scaling for increased load
- Database shall handle growth to at least 100,000 users
- System shall support at least 10,000 exams without performance degradation

#### 3.3.2 Security Requirements

**NFR-4:** Data Security
- All sensitive data shall be encrypted in transit and at rest
- User passwords shall be hashed using industry-standard algorithms
- System shall implement proper input validation to prevent injection attacks
- System shall protect against common web vulnerabilities (XSS, CSRF)

**NFR-5:** Authentication Security
- Authentication tokens shall expire after 24 hours
- System shall enforce secure password policies
- System shall implement rate limiting on authentication attempts
- System shall log all authentication activities

**NFR-6:** Exam Security
- System shall detect and log tab switching during exams
- System shall prevent unauthorized access to exam content
- System shall time-bound exam access according to settings
- System shall prevent copying exam content where possible

#### 3.3.3 Usability Requirements

**NFR-7:** User Interface
- Interface shall be intuitive and require minimal training
- Interface shall be consistent across all sections
- Interface shall provide clear feedback for all actions
- Interface shall include help documentation for key features

**NFR-8:** Accessibility
- System shall comply with WCAG 2.1 AA standards
- Interface shall support screen readers
- Interface shall maintain minimum contrast ratios
- Interface shall be fully navigable via keyboard

**NFR-9:** Responsive Design
- Interface shall adapt to screens from 320px to 4K resolution
- Interface shall be usable on touch and non-touch devices
- Interface shall support both portrait and landscape orientations
- Interface shall optimize content display for different devices

#### 3.3.4 Maintainability Requirements

**NFR-10:** Code Quality
- Code shall follow consistent style guidelines
- Code shall include appropriate documentation
- Code shall be modular and follow separation of concerns
- Code shall have adequate test coverage

**NFR-11:** Deployment
- System shall support automated deployment processes
- System shall include monitoring for critical functions
- System shall maintain separate environments for development, testing, and production
- System shall support rollback to previous versions if needed

### 3.4 Data Requirements

#### 3.4.1 Data Entities
- Users (Admin and Student)
- Exams
- Questions
- Results
- Monitoring Logs

#### 3.4.2 Data Relationships
- Users to Exams (many-to-many)
- Exams to Questions (one-to-many)
- Users to Results (one-to-many)
- Results to Exams (many-to-one)
- Monitoring Logs to User-Exam sessions (many-to-one)

#### 3.4.3 Data Retention
- Exam results shall be retained for at least 5 years
- User accounts shall be preserved until explicitly deleted
- Monitoring logs shall be retained for 1 year
- System shall support archiving of old data

---

## 4. System Features

### 4.1 Authentication System
The authentication system shall provide secure login, registration, and session management for all users.

#### 4.1.1 Description
The system shall authenticate users based on email and password, generating secure JWT tokens for maintaining sessions.

#### 4.1.2 Stimulus/Response Sequences
1. User navigates to login page
2. User enters credentials
3. System validates credentials against database
4. System generates JWT token upon successful authentication
5. User is redirected to appropriate dashboard based on role

#### 4.1.3 Functional Requirements
- FR-1, FR-2, FR-3, FR-4

### 4.2 Exam Management System
The exam management system shall allow administrators to create, edit, and manage exams.

#### 4.2.1 Description
Administrators shall be able to create exams with various question types, set scheduling parameters, and publish to students.

#### 4.2.2 Stimulus/Response Sequences
1. Admin navigates to exam creation page
2. Admin fills in exam details and adds questions
3. System validates and saves exam information
4. Admin schedules exam for availability
5. System updates exam status and makes it available to students at scheduled time

#### 4.2.3 Functional Requirements
- FR-5, FR-6

### 4.3 Exam Taking System
The exam taking system shall provide students with a secure environment for completing exams.

#### 4.3.1 Description
Students shall be able to access scheduled exams, answer questions, navigate through the exam, and submit responses securely.

#### 4.3.2 Stimulus/Response Sequences
1. Student views available exams
2. Student selects and starts an exam
3. System presents questions with timer
4. Student answers questions and navigates through exam
5. Student submits exam or system auto-submits when time expires
6. System processes responses and generates result

#### 4.3.3 Functional Requirements
- FR-10, FR-11

### 4.4 Monitoring System
The monitoring system shall track student activities during exams to ensure integrity.

#### 4.4.1 Description
The system shall detect and log actions such as tab switching, browser focus changes, and time spent on questions.

#### 4.4.2 Stimulus/Response Sequences
1. Student attempts to switch tabs during exam
2. System detects tab switch and logs the event
3. System displays warning to student
4. Administrator can view logged events in real-time or after exam completion

#### 4.4.3 Functional Requirements
- FR-8

### 4.5 Results and Analytics System
The results system shall process exam submissions and provide comprehensive analytics.

#### 4.5.1 Description
The system shall automatically grade objective questions, calculate scores, and provide detailed performance analytics for both students and administrators.

#### 4.5.2 Stimulus/Response Sequences
1. Exam is submitted (manually or automatically)
2. System processes answers and calculates score
3. System generates detailed result breakdown
4. Student can view personal results
5. Administrator can view individual and aggregate results

#### 4.5.3 Functional Requirements
- FR-9, FR-12

---

## 5. Other Requirements

### 5.1 Legal and Compliance Requirements
- System shall comply with relevant data protection regulations
- System shall provide mechanisms for data export and deletion upon request
- Terms of service and privacy policy shall be clearly displayed

### 5.2 Internationalization Requirements
- Interface shall support future localization
- System shall store dates and times in standardized format
- System shall handle various character sets for international names

### 5.3 Documentation Requirements
- System shall include online help documentation
- Administrator guide shall be provided
- API documentation shall be maintained for developers

---

## Appendix A: Analysis Models

[Placeholder for UML diagrams, entity relationship diagrams, and other modeling artifacts]

## Appendix B: To Be Determined List

- Integration with third-party learning management systems
- Advanced proctoring features using webcam and microphone
- Implementation of essay-type questions with AI-assisted grading
- Mobile application development timeline
- Browser extension for enhanced security during exams 