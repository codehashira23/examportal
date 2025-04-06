# ExamPortal Architecture Viewpoints

This document presents the ExamPortal system from four distinct architectural viewpoints: Business, Application, Technology, and Physical. Each viewpoint provides a different perspective on the system's architecture to address the concerns of different stakeholders.

## 1. Business Viewpoint

The Business Viewpoint focuses on the organizational context, business processes, and stakeholders involved in the ExamPortal system.

### 1.1 Key Business Processes

1. **Exam Creation Process**
   - Planning examination content
   - Creating and reviewing questions
   - Setting exam parameters and rules
   - Publishing exams to students

2. **Exam Administration Process**
   - Student registration and authentication
   - Exam scheduling and access control
   - Monitoring exam integrity
   - Results processing and publication

3. **Analytics and Reporting Process**
   - Performance data collection
   - Statistical analysis of results
   - Generating insights for educators
   - Continuous improvement of assessments

### 1.2 Stakeholders and Roles

| Stakeholder | Role | Primary Concerns |
|-------------|------|------------------|
| Educational Institutions | System owners | Overall system effectiveness, ROI, compliance |
| Administrators | Content creators & managers | Ease of exam creation, security, analytics |
| Students | End users | Usability, reliability, fairness |
| IT Staff | System maintenance | Performance, security, maintenance |
| Accreditation Bodies | External validators | Compliance, integrity, data protection |

### 1.3 Business Value Proposition

- **Cost Reduction**: Eliminates expenses associated with paper-based exams
- **Efficiency**: Automates grading and results processing
- **Accessibility**: Enables remote examination without geographical constraints
- **Scalability**: Supports large numbers of simultaneous examinations
- **Analytics**: Provides data-driven insights for educational improvement
- **Integrity**: Ensures examination security and prevents academic dishonesty

### 1.4 Business Process Diagram

```mermaid
flowchart TD
    subgraph "Exam Creation Process"
        A1[Plan Exam Content] --> A2[Create Questions]
        A2 --> A3[Set Exam Parameters]
        A3 --> A4[Review and Quality Check]
        A4 --> A5[Publish Exam]
    end
    
    subgraph "Exam Administration Process"
        B1[Student Registration] --> B2[Exam Scheduling]
        B2 --> B3[Student Authentication]
        B3 --> B4[Exam Taking]
        B4 --> B5[Monitoring]
        B5 --> B6[Submission]
    end
    
    subgraph "Results Processing"
        C1[Auto-Grading] --> C2[Result Compilation]
        C2 --> C3[Analytics Generation]
        C3 --> C4[Results Publication]
        C4 --> C5[Performance Feedback]
    end
    
    A5 --> B2
    B6 --> C1
    
    classDef process fill:#f9f,stroke:#333,stroke-width:2px;
    class A1,A2,A3,A4,A5,B1,B2,B3,B4,B5,B6,C1,C2,C3,C4,C5 process;
```

## 2. Application Viewpoint

The Application Viewpoint describes the system's structure in terms of application components, their interactions, and the services they provide.

### 2.1 Application Components

1. **User Management Module**
   - Authentication and authorization
   - Profile management
   - Role-based access control

2. **Exam Management Module**
   - Exam creation and editing
   - Question bank management
   - Scheduling and publication

3. **Exam Taking Module**
   - Secure exam environment
   - Answer submission
   - Timer and navigation
   - Auto-save functionality

4. **Monitoring Module**
   - Tab switching detection
   - Activity logging
   - Real-time progress tracking
   - Suspicious activity alerts

5. **Results and Analytics Module**
   - Automated grading
   - Performance statistics
   - Result visualization
   - Data export capabilities

6. **Administration Module**
   - System configuration
   - User management
   - Audit logging
   - Backup and recovery

### 2.2 Application Interactions

| Component | Interacts With | Purpose |
|-----------|----------------|---------|
| User Management | All modules | Authentication, authorization |
| Exam Management | Results, Monitoring | Exam setup, question management |
| Exam Taking | Monitoring, Results | Student exam experience |
| Monitoring | Exam Taking, Administration | Integrity enforcement |
| Results & Analytics | Exam Management, Exam Taking | Performance assessment |
| Administration | All modules | System maintenance and configuration |

### 2.3 Application Architecture Diagram

```mermaid
flowchart TD
    subgraph "Frontend Layer"
        F1[Admin UI]
        F2[Student UI]
    end
    
    subgraph "API Layer"
        A1[Authentication API]
        A2[Exam Management API]
        A3[Exam Taking API]
        A4[Monitoring API]
        A5[Results API]
        A6[Admin API]
    end
    
    subgraph "Service Layer"
        S1[User Service]
        S2[Exam Service]
        S3[Question Service]
        S4[Monitoring Service]
        S5[Results Service]
        S6[Admin Service]
    end
    
    subgraph "Data Layer"
        D1[(User Repository)]
        D2[(Exam Repository)]
        D3[(Question Repository)]
        D4[(Monitoring Log Repository)]
        D5[(Results Repository)]
    end
    
    F1 --> A1 & A2 & A5 & A6
    F2 --> A1 & A3 & A4 & A5
    
    A1 --> S1
    A2 --> S2 & S3
    A3 --> S2 & S3 & S4
    A4 --> S4
    A5 --> S5
    A6 --> S6
    
    S1 --> D1
    S2 --> D2
    S3 --> D3
    S4 --> D4
    S5 --> D5
    S6 --> D1 & D2 & D3 & D4 & D5
    
    classDef frontend fill:#6EB5FF,stroke:#333,stroke-width:1px;
    classDef api fill:#FFB6C1,stroke:#333,stroke-width:1px;
    classDef service fill:#FFFFB5,stroke:#333,stroke-width:1px;
    classDef data fill:#C1FFB5,stroke:#333,stroke-width:1px;
    
    class F1,F2 frontend;
    class A1,A2,A3,A4,A5,A6 api;
    class S1,S2,S3,S4,S5,S6 service;
    class D1,D2,D3,D4,D5 data;
```

## 3. Technology Viewpoint

The Technology Viewpoint describes the software and hardware technologies used to implement the system, including frameworks, libraries, and infrastructure components.

### 3.1 Technology Stack

| Layer | Technologies |
|-------|--------------|
| Frontend | Next.js 14, React 19, Tailwind CSS, Shadcn UI, Framer Motion |
| API & Backend | Next.js API Routes, RESTful API, WebSockets |
| Authentication | NextAuth.js, JWT, Bcrypt |
| Database | MongoDB, Mongoose ODM |
| DevOps | Vercel, GitHub Actions, Docker |
| Testing | Jest, React Testing Library, Cypress, Selenium |
| Monitoring | Sentry, Lighthouse, Custom logging |

### 3.2 Technology Dependencies

- **Node.js**: Runtime environment for server-side JavaScript
- **MongoDB Atlas**: Cloud database service for MongoDB
- **Vercel**: Cloud platform for deployment and hosting
- **NPM/Yarn**: Package managers for dependency management
- **Git**: Version control system
- **GitHub**: Repository hosting and CI/CD integration
- **Browser APIs**: For tab switching detection and viewport management

### 3.3 Technology Constraints

- Cross-browser compatibility requirements
- Mobile device performance considerations
- Internet connectivity dependencies
- Security requirements for sensitive exam data
- Scalability needs for concurrent exam sessions

### 3.4 Technology Architecture Diagram

```mermaid
flowchart TD
    subgraph "Client Layer"
        C1[Web Browsers]
        C2[Mobile Browsers]
    end
    
    subgraph "Presentation Layer"
        P1[Next.js SSR]
        P2[React Components]
        P3[Tailwind CSS]
    end
    
    subgraph "Application Layer"
        A1[Next.js API Routes]
        A2[Authentication Logic]
        A3[Business Logic]
        A4[Validation Layer]
    end
    
    subgraph "Data Layer"
        D1[Mongoose ODM]
        D2[MongoDB Atlas]
    end
    
    subgraph "Infrastructure Layer"
        I1[Vercel Platform]
        I2[GitHub Actions]
        I3[Sentry Monitoring]
    end
    
    C1 & C2 --> P1
    P1 --> P2 --> P3
    P1 --> A1
    A1 --> A2 & A3 & A4
    A2 & A3 & A4 --> D1 --> D2
    P1 & A1 --> I1
    I1 --> I2
    I1 --> I3
    
    classDef client fill:#86C5DA,stroke:#333,stroke-width:1px;
    classDef presentation fill:#8BD9A0,stroke:#333,stroke-width:1px;
    classDef application fill:#F5C76D,stroke:#333,stroke-width:1px;
    classDef data fill:#D991C5,stroke:#333,stroke-width:1px;
    classDef infra fill:#C2C2C2,stroke:#333,stroke-width:1px;
    
    class C1,C2 client;
    class P1,P2,P3 presentation;
    class A1,A2,A3,A4 application;
    class D1,D2 data;
    class I1,I2,I3 infra;
```

## 4. Physical Viewpoint

The Physical Viewpoint describes the hardware and infrastructure components that host the ExamPortal system, including deployment architecture and network topology.

### 4.1 Deployment Environment

| Environment | Purpose | Characteristics |
|-------------|---------|-----------------|
| Development | Building and testing new features | Individual developer machines, local servers |
| Testing | Quality assurance and integration testing | Isolated cloud environment with test data |
| Staging | Pre-production validation | Mirror of production with synthetic load |
| Production | Live system for end users | High-availability, auto-scaling, real data |

### 4.2 Infrastructure Components

- **Edge Network**: Vercel's global CDN for static content delivery
- **Application Servers**: Serverless functions for API and dynamic content
- **Database Cluster**: MongoDB Atlas with primary and replica nodes
- **Storage Service**: For media and file storage
- **Monitoring & Logging**: Distributed tracing and centralized logging
- **Backup Systems**: Regular automated backups of database and configurations

### 4.3 Network Requirements

- **Bandwidth**: Sufficient to handle concurrent exam sessions
- **Latency**: Low latency for real-time monitoring features
- **Reliability**: High uptime guarantee for exam sessions
- **Security**: Encrypted connections (HTTPS/TLS)
- **Firewall Rules**: Protection against unauthorized access

### 4.4 Physical Architecture Diagram

```mermaid
flowchart TD
    U1[End Users: Browsers/Devices] --> E1
    
    subgraph "Vercel Edge Network"
        E1[CDN Edge Locations]
    end
    
    E1 --> S1
    
    subgraph "Serverless Environment"
        S1[API Routes / Serverless Functions]
        S2[Static Asset Hosting]
        S3[Image Optimization]
    end
    
    S1 --> D1
    
    subgraph "MongoDB Atlas"
        D1[(Primary Node)] <--> D2[(Secondary Node)]
        D1 <--> D3[(Analytics Node)]
        D4[MongoDB Atlas Search]
    end
    
    subgraph "Monitoring & Support"
        M1[Sentry Error Tracking]
        M2[Application Logging]
        M3[Performance Monitoring]
    end
    
    S1 --> M1 & M2 & M3
    
    subgraph "External Services"
        X1[Email Service]
        X2[Storage Service]
    end
    
    S1 --> X1 & X2
    
    classDef users fill:#D0E8FF,stroke:#333,stroke-width:1px;
    classDef edge fill:#FFBEBC,stroke:#333,stroke-width:1px;
    classDef compute fill:#C9FFBC,stroke:#333,stroke-width:1px;
    classDef data fill:#FFDFBC,stroke:#333,stroke-width:1px;
    classDef monitoring fill:#E5BCFF,stroke:#333,stroke-width:1px;
    classDef external fill:#BCFFFF,stroke:#333,stroke-width:1px;
    
    class U1 users;
    class E1 edge;
    class S1,S2,S3 compute;
    class D1,D2,D3,D4 data;
    class M1,M2,M3 monitoring;
    class X1,X2 external;
```

## 5. Combined Architecture Overview

### 5.1 Architecture Principles

1. **Modularity**: System components are designed with clear boundaries and interfaces
2. **Scalability**: Architecture supports growth in users and functionality
3. **Security**: Security considerations are addressed at all levels
4. **Maintainability**: Code and infrastructure designed for long-term maintenance
5. **Responsiveness**: System optimized for performance across devices
6. **Resilience**: Fault tolerance built into critical components

### 5.2 Cross-Cutting Concerns

| Concern | Implementation Approach |
|---------|-------------------------|
| Security | JWT authentication, encrypted data, HTTPS, input validation |
| Logging | Centralized logging, structured log format, audit trails |
| Error Handling | Global error boundaries, graceful degradation, retry mechanisms |
| Performance | CDN, code splitting, optimized queries, caching strategies |
| Accessibility | WCAG compliance, semantic HTML, keyboard navigation |
| Internationalization | Text externalization, locale-aware formatting |

### 5.3 Integrated Architecture Diagram

```mermaid
flowchart TD
    subgraph "Business Layer"
        B1[Exam Creation]
        B2[Exam Administration]
        B3[Results Analysis]
    end
    
    subgraph "User Interface Layer"
        U1[Admin Portal]
        U2[Student Exam Interface]
        U3[Results Dashboard]
    end
    
    subgraph "Application Layer"
        A1[Authentication Module]
        A2[Exam Management Module]
        A3[Exam Taking Module]
        A4[Monitoring Module]
        A5[Analytics Module]
    end
    
    subgraph "Service Layer"
        S1[User Service]
        S2[Exam Service]
        S3[Question Service]
        S4[Monitoring Service]
        S5[Results Service]
    end
    
    subgraph "Data Access Layer"
        D1[MongoDB Repositories]
        D2[Caching Services]
    end
    
    subgraph "Infrastructure Layer"
        I1[Vercel Edge Network]
        I2[Serverless Functions]
        I3[MongoDB Atlas]
        I4[Monitoring Services]
    end
    
    B1 & B2 & B3 <--> U1 & U2 & U3
    U1 & U2 & U3 --> A1 & A2 & A3 & A4 & A5
    A1 & A2 & A3 & A4 & A5 --> S1 & S2 & S3 & S4 & S5
    S1 & S2 & S3 & S4 & S5 --> D1 & D2
    D1 & D2 --> I1 & I2 & I3 & I4
    
    classDef business fill:#FFD700,stroke:#333,stroke-width:1px;
    classDef ui fill:#98FB98,stroke:#333,stroke-width:1px;
    classDef app fill:#FF6347,stroke:#333,stroke-width:1px;
    classDef service fill:#87CEFA,stroke:#333,stroke-width:1px;
    classDef data fill:#DDA0DD,stroke:#333,stroke-width:1px;
    classDef infra fill:#C0C0C0,stroke:#333,stroke-width:1px;
    
    class B1,B2,B3 business;
    class U1,U2,U3 ui;
    class A1,A2,A3,A4,A5 app;
    class S1,S2,S3,S4,S5 service;
    class D1,D2 data;
    class I1,I2,I3,I4 infra;
```

## 6. Architecture Decision Records

| Decision ID | Decision | Rationale |
|-------------|----------|-----------|
| ADR-001 | Use Next.js for frontend & API | Unified development experience, SSR capabilities |
| ADR-002 | Use MongoDB as database | Schema flexibility, JSON-like document structure |
| ADR-003 | Deploy on Vercel | Seamless integration with Next.js, global CDN |
| ADR-004 | JWT for authentication | Stateless authentication, security, scalability |
| ADR-005 | Microservices-inspired modular structure | Maintainability, separation of concerns |
| ADR-006 | Client-side tab switching detection | Privacy concerns with webcam monitoring |
| ADR-007 | Serverless function deployment | Cost efficiency, auto-scaling capabilities | 