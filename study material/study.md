# Project Folder Structure

## Top-Level Structure

```
src/
├── app/
│   ├── api/
│   ├── admin/
│   ├── student/
│   ├── login/
│   ├── register/
│   ├── components/
│   └── lib/
├── lib/
└── scripts/
```

## Detailed Breakdown

### 1. `src/app/`
This is the main application directory that contains all Next.js pages, components, and API routes.

#### 1.1. `api/`
Contains all API routes organized by functionality.

##### 1.1.1. `auth/`
- **`login/route.js`**: Handles user authentication
- **`register/route.js`**: Handles user registration
- **`me/route.js`**: Retrieves current user information

##### 1.1.2. `admin/`
- **`dashboard/route.js`**: Provides admin dashboard data
- **`exams/route.js`**: Manages exam CRUD operations
- **`exams/[id]/route.js`**: Handles individual exam operations
- **`users/route.js`**: Manages user administration
- **`results/route.js`**: Retrieves and processes exam results
- **`monitoring/route.js`**: Retrieves monitoring logs

##### 1.1.3. `student/`
- **`exams/route.js`**: Lists available exams for students
- **`exams/recent/route.js`**: Retrieves recent exam results
- **`exam/[examId]/route.js`**: Gets exam details for taking an exam
- **`exam/submit/route.js`**: Processes exam submissions
- **`exam/saveAnswer/route.js`**: Saves individual answers during an exam
- **`exam/monitor/route.js`**: Logs student activities during exams

##### 1.1.4. `init/route.js`
Initializes application requirements like directories for file uploads.

#### 1.2. `admin/`
Contains all admin-facing pages.

- **`page.jsx`**: Admin dashboard main page
- **`exams/page.jsx`**: Exam management page
- **`exams/create/page.jsx`**: Create new exam form
- **`exams/edit/[id]/page.jsx`**: Edit existing exam form
- **`users/page.jsx`**: User management page
- **`results/page.jsx`**: Exam results analysis page
- **`monitoring/page.jsx`**: Student monitoring page

#### 1.3. `student/`
Contains all student-facing pages.

- **`page.jsx`**: Student dashboard main page
- **`exams/page.jsx`**: Available exams listing
- **`exam/[examId]/page.jsx`**: Exam-taking interface
- **`results/page.jsx`**: Student's exam results page

#### 1.4. `login/page.jsx`
The login page for user authentication.

#### 1.5. `register/page.jsx`
The registration page for new users.

#### 1.6. `components/`
Reusable UI components used across multiple pages.

- **`Header.jsx`**: Navigation header component
- **`Footer.jsx`**: Page footer component
- **`Sidebar.jsx`**: Navigation sidebar for admin and student dashboards
- **`Timer.jsx`**: Countdown timer for exams
- **`RecentExams.jsx`**: Component to display recent exam results
- **`ExamCard.jsx`**: Card component for displaying exam information
- **`QuestionForm.jsx`**: Component for creating/editing exam questions
- **`Alert.jsx`**: Component for displaying error and success messages

#### 1.7. `model/`
Mongoose models for database interaction.

- **`User.js`**: Schema for user data
- **`Exam.js`**: Schema for exam data including questions
- **`Result.js`**: Schema for exam results
- **`MonitoringLog.js`**: Schema for exam monitoring logs

### 2. `src/lib/`
Utility functions and middleware used throughout the application.

- **`dbConnect.js`**: Function for connecting to MongoDB
- **`authmiddleware.js`**: Authentication middleware to protect routes
- **`ensureUploadDirectories.js`**: Utility to check/create upload directories
- **`utils.js`**: General utility functions

### 3. `src/scripts/`
Scripts for development and maintenance tasks.

- **`seed.js`**: Seeds the database with initial data
- **`migrate.js`**: Database migration utilities
- **`cleanup.js`**: Cleanup scripts for maintenance

## File Purposes and Connectivity

### Next.js Pages
Each `.jsx` file in the `app` directory (excluding `components` and `api`) represents a page in the application. Next.js uses a file-based routing system, so the file structure determines the URL structure.

- **Entry Points**:
  - `/login` - Entry point for unauthenticated users
  - `/register` - New user registration
  - `/student` - Dashboard for students after login
  - `/admin` - Dashboard for admins after login

### API Routes
API routes in the `api` directory handle server-side logic and database operations. They follow RESTful conventions:

- **GET**: Retrieve data (e.g., listing exams)
- **POST**: Create new resources (e.g., creating an exam)
- **PUT/PATCH**: Update existing resources
- **DELETE**: Remove resources

### Data Flow
1. **User Authentication**: Users log in through `login/page.jsx` which calls the `/api/auth/login` endpoint
2. **Dashboard Data**: Dashboard pages fetch data from respective API endpoints
3. **Exam Taking**: 
   - Student selects an exam from `/student/exams`
   - Exam details are fetched from `/api/student/exam/[examId]`
   - Answers are saved through `/api/student/exam/saveAnswer`
   - Final submission goes through `/api/student/exam/submit`
4. **Admin Operations**:
   - Creating/editing exams through forms that call `/api/admin/exams` endpoints
   - Managing users through interfaces that call `/api/admin/users` endpoints
   - Viewing results through dashboards that call `/api/admin/results` endpoints

### Component Reuse
Components in the `components` directory are reused across multiple pages:
- `Header.jsx` and `Footer.jsx` appear on all pages
- `Sidebar.jsx` is used in both admin and student dashboards
- `Timer.jsx` is specific to the exam-taking interface
- `Alert.jsx` is used across all forms for error/success messages

### MongoDB Models
Models in the `model` directory define the data structure for MongoDB collections:
- `User.js` defines the schema for student and admin users
- `Exam.js` contains the structure for exams including questions and options
- `Result.js` stores the results of student exam attempts
- `MonitoringLog.js` tracks student activity during exams

This architecture follows the principles of separation of concerns and modularity, making the codebase maintainable and scalable. The Next.js framework provides a solid foundation for both server-side and client-side rendering, optimizing the user experience.




# Detailed Explanation of Project Configuration Files

## 1. `/src/lib/dbConnect.js`

This file handles MongoDB connection using Mongoose.

```javascript
// The file establishes a connection to the MongoDB database using the Mongoose library
// It implements connection pooling to reuse connections across API requests
// Includes error handling for connection failures
// Uses environment variables for the MongoDB URI
// Implements connection lifecycle event listeners for monitoring
// Enhanced with connection health checking and retry logic
```

## 2. `/src/lib/upload-helper.js`

This utility helps manage file uploads.

```javascript
// Creates and manages directories for file uploads
// Ensures file storage structure exists before uploads begin
// Provides utility functions for generating file paths
// Validates file types and sizes before saving
// Handles file naming and organization
```

## 3. `/src/lib/authmiddleware.js`

Authentication middleware for protecting routes.

```javascript
// Verifies JWT tokens from incoming requests
// Extracts user information from verified tokens
// Manages user sessions across requests
// Provides access control based on user roles
// Returns user data for authenticated routes
```

## 4. `/src/lib/middleware.js`

Next.js middleware for route protection.

```javascript
// Intercepts requests before they reach route handlers
// Redirects unauthenticated users to login page
// Handles role-based access control
// Processes cookies and auth headers
// Determines if a route requires authentication
```

## 5. `/src/scripts/setup.js`

Initialization script for project setup.

```javascript
// Runs before application startup
// Creates necessary directories
// Validates environment variables
// Initializes any required resources
// Ensures application prerequisites are met
```

## 6. `/src/scripts/setup-uploads.js`

Script for setting up file upload directories.

```javascript
// Specifically creates and validates upload directories
// Ensures proper permissions are set
// Creates directory structure for organizing uploads
// Used during initial setup and deployment
```

## 7. `tsconfig.json`

TypeScript configuration for the project.

```json
{
  "compilerOptions": {
    "target": "ES2017",          // JavaScript version to compile to
    "lib": ["dom", "dom.iterable", "esnext"],  // Libraries available during compilation
    "allowJs": true,             // Allow JavaScript files to be compiled
    "skipLibCheck": true,        // Skip type checking of declaration files
    "strict": false,             // Don't enforce strict type checking
    "noEmit": true,              // Don't output compiled files
    "incremental": true,         // Enable incremental compilation
    "module": "esnext",          // Module code generation method
    "esModuleInterop": true,     // Allow default imports from CommonJS modules
    "moduleResolution": "node",  // How modules are resolved
    "resolveJsonModule": true,   // Allow importing JSON files
    "isolatedModules": true,     // Each file is a separate module
    "jsx": "preserve",           // Preserve JSX for Next.js
    "baseUrl": ".",              // Base directory for resolving imports
    "paths": {                   // Path aliases for module resolution
      "@/*": ["./*"]            // @ alias points to root directory
    },
    "plugins": [                 // TypeScript plugins
      {
        "name": "next"           // Next.js TypeScript plugin
      }
    ]
  },
  "include": ["next-env.d.ts", ".next/types/**/*.ts", "**/*.ts", "**/*.tsx"],  // Files to include
  "exclude": ["node_modules"]    // Files to exclude
}
```

## 8. `postcss.config.mjs`

PostCSS configuration for processing CSS.

```javascript
const config = {
  plugins: ["@tailwindcss/postcss"],  // Use Tailwind CSS PostCSS plugin
};

export default config;
```

## 9. `package.json`

Project dependencies and scripts.

```json
{
  "name": "examportal",          // Project name
  "version": "0.1.0",            // Project version
  "private": true,               // Not published to npm
  "scripts": {
    "dev": "next dev --turbopack",  // Development with Turbopack
    "build": "node src/scripts/setup.js && next build",  // Setup and build
    "start": "next start",       // Production start
    "lint": "next lint",         // Run linting
    "setup": "node src/scripts/setup.js"  // Run setup script
  },
  "dependencies": {              // Production dependencies
    "@emotion/react": "^11.14.0",        // Emotion for styled components
    "@emotion/styled": "^11.14.0",       // Styled component system
    "@mui/icons-material": "^7.0.1",     // Material UI icons
    "@mui/material": "^7.0.1",           // Material UI components
    "@radix-ui/react-label": "^2.1.2",   // Accessible label component
    "@radix-ui/react-radio-group": "^1.2.3",  // Radio group component
    "@radix-ui/react-slot": "^1.1.2",    // Slot component
    "@radix-ui/react-toast": "^1.2.6",   // Toast notification component
    "bcryptjs": "^3.0.2",               // Password hashing
    "class-variance-authority": "^0.7.1", // CSS class utilities
    "clsx": "^2.1.1",                   // Class name utility
    "jsonwebtoken": "^9.0.2",           // JWT authentication
    "mongodb": "^6.15.0",               // MongoDB driver
    "mongoose": "^8.12.1",              // MongoDB ORM
    "next": "15.2.3",                   // Next.js framework
    "react": "^19.0.0",                 // React library
    "react-dom": "^19.0.0",             // React DOM
    "react-icons": "^5.5.0",            // Icon library
    "tailwind-merge": "^3.0.2",         // Tailwind utility
    "tw-animate-css": "^1.2.5"          // Animation utility
  },
  "devDependencies": {           // Development dependencies
    "@eslint/eslintrc": "^3",           // ESLint configuration
    "@shadcn/ui": "^0.0.4",             // ShadCN UI components
    "@tailwindcss/postcss": "^4",       // Tailwind PostCSS
    "@types/node": "22.13.10",          // Node.js type definitions
    "@types/react": "19.0.12",          // React type definitions
    "eslint": "^9",                     // Linting
    "eslint-config-next": "15.2.3",     // Next.js ESLint config
    "tailwindcss": "^4"                 // Tailwind CSS
  }
}
```

## 10. `next.config.mjs`

Next.js configuration file.

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {};  // Empty config using default Next.js settings

export default nextConfig;
```

## 11. `next-env.d.ts`

TypeScript definitions for Next.js.

```typescript
/// <reference types="next" />  // Import Next.js type definitions
/// <reference types="next/image-types/global" />  // Import Next.js image type definitions

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
```

## 12. `jsconfig.json`

JavaScript path mapping configuration.

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]  // @ alias points to src directory
    }
  }
}
```

## 13. `eslint.config.mjs`

ESLint configuration for code linting.

```javascript
import { dirname } from "path";  // Get directory name
import { fileURLToPath } from "url";  // Convert URL to file path
import { FlatCompat } from "@eslint/eslintrc";  // Compatibility layer for ESLint config

const __filename = fileURLToPath(import.meta.url);  // Get current file name
const __dirname = dirname(__filename);  // Get directory name

const compat = new FlatCompat({
  baseDirectory: __dirname,  // Set base directory for ESLint
});

const eslintConfig = [...compat.extends("next/core-web-vitals")];  // Use Next.js recommended rules

export default eslintConfig;
```

## 14. `components.json`

ShadCN UI configuration.

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",  // ShadCN schema
  "style": "new-york",           // UI style theme
  "rsc": true,                   // React Server Components enabled
  "tsx": true,                   // Using TypeScript with JSX
  "tailwind": {
    "config": "",                // Tailwind config path
    "css": "src/app/globals.css", // Global CSS path
    "baseColor": "neutral",      // Base color theme
    "cssVariables": true,        // Use CSS variables
    "prefix": ""                 // No prefix for CSS classes
  },
  "aliases": {                   // Import aliases
    "components": "@/components", // Components path
    "utils": "@/lib/utils",      // Utilities path
    "ui": "@/components/ui",     // UI components path
    "lib": "@/lib",              // Library path
    "hooks": "@/hooks"           // React hooks path
  },
  "iconLibrary": "lucide"        // Using Lucide icons
}
```

## 15. `.gitignore`

Git ignore configuration.

```
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules                   # Node modules directory
/.pnp                          # Plug'n'Play
.pnp.*                         # PnP files
.yarn/*                        # Yarn files
!.yarn/patches                 # Keep yarn patches
!.yarn/plugins                 # Keep yarn plugins  
!.yarn/releases                # Keep yarn releases
!.yarn/versions                # Keep yarn versions

# testing
/coverage                      # Test coverage reports

# next.js
/.next/                        # Next.js build output
/out/                          # Static export directory

# production
/build                         # Production build files

# misc
.DS_Store                      # macOS files
*.pem                          # PEM certificates

# debug
npm-debug.log*                 # npm debug logs
yarn-debug.log*                # Yarn debug logs
yarn-error.log*                # Yarn error logs
.pnpm-debug.log*               # pnpm debug logs

# env files
.env*                          # Environment files

# vercel
.vercel                        # Vercel deployment files

# typescript
*.tsbuildinfo                  # TypeScript build info
next-env.d.ts                  # Next.js TypeScript declarations
```

## 16. `.env`

Environment variables.

```
MONGODB_URI=mongodb+srv://divyanshjaiswal:23julydivyansh@cluster0.3zwot.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
# MongoDB connection string for database access

JWT_SECRET=your_jwt_secret
# Secret key used for signing and verifying JWT tokens
```

## Integration Between Files

This project uses Next.js with MongoDB for an exam portal system. The files work together as follows:

1. **Configuration Files** (`tsconfig.json`, `jsconfig.json`, `next.config.mjs`, `postcss.config.mjs`) define the project structure, module resolution, and build process.

2. **Environment Setup** (`.env`) provides secrets and connection strings.

3. **Database Connection** (`dbConnect.js`) establishes and maintains the MongoDB connection using the URI from environment variables.

4. **Authentication** (`authmiddleware.js`, `middleware.js`) protects routes and validates user sessions using JWT tokens.

5. **File Management** (`upload-helper.js`, `setup-uploads.js`) handles file uploads and ensures proper directory structure.

6. **UI Components** (`components.json`) configures the ShadCN UI library for consistent styling.

7. **Development Tools** (`eslint.config.mjs`, `.gitignore`) set up code quality standards and version control exclusions.

8. **Initialization Scripts** (`setup.js`) prepare the application environment before running.

The project uses modern JavaScript features, TypeScript for type safety, and follows the Next.js App Router structure. It integrates multiple UI libraries (MUI, Radix UI, ShadCN) with Tailwind CSS for styling.
