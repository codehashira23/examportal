# UI Component Imports and Usage

This document explains the UI components that are imported in each page of the application and how they are utilized to create a cohesive user experience.

## Login Page (`src/app/login/page.jsx`)

**Imported Components:**
- `useState` from 'react': For managing form state (email, password)
- `useRouter` from 'next/navigation': For navigation after successful login
- `Link` from 'next/link': For the registration page link

**Usage:**
- The login page uses a card-based layout with form controls for user authentication
- Form validation is handled using state variables
- Error messages are displayed using alert components
- The page includes a link to the registration page for new users

## Registration Page (`src/app/register/page.jsx`)

**Imported Components:**
- `useState` from 'react': For managing form state (name, email, password)
- `useRouter` from 'next/navigation': For navigation after successful registration
- `Link` from 'next/link': For the login page link

**Usage:**
- Similar to the login page with a card-based layout
- Includes form validation for required fields
- Uses a role selection dropdown for user type (student/admin)
- Displays error messages for validation and server errors

## Student Dashboard (`src/app/student/page.jsx`)

**Imported Components:**
- `useState`, `useEffect` from 'react': For managing state and lifecycle
- `Card`, `CardContent`, `CardHeader` components: For displaying exam statistics
- `RecentExams` component: Custom component to display recent exam results

**Usage:**
- Dashboard layout with statistics cards showing exam performance
- Uses grid layout for responsive design
- Fetches data from API on component mount
- Displays loading states during data fetch

## Admin Dashboard (`src/app/admin/page.jsx`)

**Imported Components:**
- `useState`, `useEffect` from 'react': For managing state and lifecycle
- `Card`, `CardContent`, `CardHeader` components: For displaying admin statistics
- `Chart` components from a charting library: For visualizing exam data
- `Table` components: For displaying recent exams

**Usage:**
- More complex dashboard with statistical overviews
- Chart components to visualize student performance by subject
- Table component for displaying recent exam data
- Admin actions section with quick links to common tasks

## Exam Taking Page (`src/app/student/exam/[examId]/page.jsx`)

**Imported Components:**
- `useState`, `useEffect` from 'react': For managing exam state
- `useRouter`, `useParams` from 'next/navigation': For routing and accessing URL parameters
- `Timer` component: Custom component for exam countdown
- `Modal` component: For confirmation dialogs

**Usage:**
- Question navigation with prev/next buttons
- Timer component displays remaining time
- Radio buttons for selecting answers
- Modal component for confirming exam submission
- Progress indicator showing completed questions

## Exam Creation Page (`src/app/admin/exams/create/page.jsx`)

**Imported Components:**
- `useState` from 'react': For managing form state
- `useRouter` from 'next/navigation': For navigation after exam creation
- `Form`, `FormField`, `Input`, `TextArea` components: For form controls
- `Button` components: For form submission and cancellation

**Usage:**
- Multi-step form for creating exams
- Dynamic form fields for adding questions and options
- Validation for required fields
- Preview functionality before submission

## Monitoring Page (`src/app/admin/monitoring/page.jsx`)

**Imported Components:**
- `useState`, `useEffect` from 'react': For managing state and data fetching
- `Table`, `TableHeader`, `TableRow`, `TableCell` components: For displaying monitoring data
- `Spinner` component: For loading states
- `Alert` component: For error messages
- `Button` component: For refresh functionality

**Usage:**
- Table layout for displaying student monitoring logs
- Loading spinner during data fetch
- Error handling with alert components
- Refresh button to update monitoring data
- Status indicators for exam progress

## Results Page (`src/app/admin/results/page.jsx`)

**Imported Components:**
- `useState`, `useEffect` from 'react': For managing state and data fetching
- `Table` components: For displaying result data
- `Card` components: For summary statistics
- `TabGroup`, `Tab` components: For organizing different result views

**Usage:**
- Tabbed interface for viewing results by student or by exam
- Table components for structured data display
- Card components for summarizing performance metrics
- Filter controls for narrowing down results

## User Management Page (`src/app/admin/users/page.jsx`)

**Imported Components:**
- `useState`, `useEffect` from 'react': For managing state and data fetching
- `Table` components: For displaying user data
- `Modal` component: For confirmation dialogs
- `Button` components: For user actions (delete, edit)

**Usage:**
- Table layout for user listing
- Filter and search functionality
- Action buttons for each user row
- Confirmation modals before destructive actions

## Common UI Patterns

Throughout the application, several UI patterns are consistently used:

1. **Loading States**: Most pages use spinners or skeleton loaders during data fetching
2. **Error Handling**: Alert components display user-friendly error messages
3. **Responsive Layouts**: Grid and flex layouts ensure the UI works across device sizes
4. **Form Validation**: Client-side validation provides immediate feedback
5. **Confirmation Dialogs**: Important actions require confirmation to prevent mistakes
6. **Navigation**: Consistent header and navigation components across pages

## Component Dependencies

The application leverages a mix of:

- Next.js built-in components (`Link`, `Image`)
- React hooks for state management (`useState`, `useEffect`, `useContext`)
- Custom components built specifically for the application
- UI component libraries for consistent styling

## Styling Approach

The application uses a combination of:

- Tailwind CSS for utility-based styling
- Component-level CSS modules for component-specific styling
- Global styles for application-wide consistency

This approach ensures a consistent user experience while allowing for component-specific customization where needed.
