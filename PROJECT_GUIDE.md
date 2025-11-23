# Encadri Website - React to Angular Migration Guide

## Project Overview
**Encadri** is a project management platform for academic supervision, connecting students and supervisors. Originally built with React and Tailwind CSS on Base44.com platform, this guide helps migrate it to Angular.

## Current Tech Stack (React)
- **Frontend Framework**: React
- **Routing**: React Router DOM
- **State Management**: React Query (@tanstack/react-query)
- **Styling**: Tailwind CSS
- **UI Components**: Custom UI components (Sidebar, Card, Button, Badge, Avatar)
- **Icons**: Lucide React
- **Backend**: Base44.com API service
- **Authentication**: Base44 Auth

## Target Tech Stack (Angular)
- **Frontend Framework**: Angular
- **Routing**: Angular Router
- **State Management**: RxJS + Services
- **Styling**: Tailwind CSS (maintain same design)
- **UI Components**: Angular Material or custom components
- **Icons**: Angular Lucide or similar
- **Backend**: Keep Base44 API (adapt client)
- **Authentication**: Angular Auth Guards + Services

---

## Project Structure

```
EncadriStruct/
├── COMPONENTS/           # Component directories
│   ├── Dashbord/        # Dashboard components
│   ├── Meetings/        # Meeting components
│   ├── Project-details/ # Project detail components
│   └── Projects/        # Project list components
├── Entities/            # Data models/entities
│   ├── Evaluation.rtf
│   ├── Meeting.rtf
│   ├── Message.rtf
│   ├── Milestone.rtf
│   ├── Notification.rtf
│   ├── Project.rtf
│   └── Submission.rtf
├── Figma/              # Design files
├── pages/              # Page components
│   ├── Dashboard.rtf
│   ├── Evaluations.rtf
│   ├── Meetings.rtf
│   ├── Notifications.rtf
│   ├── Onbording.rtf
│   ├── Profile.rtf
│   ├── ProjectDetails.rtf
│   ├── ProjectInvitations.rtf
│   ├── Projects.rtf
│   └── Submissions.rtf
└── Layout.js.rtf       # Main layout component
```

---

## Data Entities

### 1. **User**
- `email` (string)
- `full_name` (string)
- `user_role` (string): "student" | "supervisor"
- `avatar_url` (string)

### 2. **Project**
- `id` (string/number)
- `title` (string)
- `description` (string)
- `status` (string): "proposed" | "active" | "completed"
- `student_email` (string)
- `supervisor_email` (string)
- `created_date` (date)
- `updated_date` (date)

### 3. **Submission**
- `id` (string/number)
- `project_id` (string/number)
- `content` (string)
- `created_date` (date)
- `status` (string)

### 4. **Milestone**
- `id` (string/number)
- `project_id` (string/number)
- `title` (string)
- `description` (string)
- `due_date` (date)
- `status` (string)

### 5. **Notification**
- `id` (string/number)
- `user_email` (string)
- `is_read` (boolean)
- `message` (string)
- `created_date` (date)

### 6. **Meeting**
- `id` (string/number)
- `project_id` (string/number)
- `title` (string)
- `date` (date)
- `duration` (number)

### 7. **Evaluation**
- `id` (string/number)
- `project_id` (string/number)
- `grade` (number)
- `feedback` (string)
- `created_date` (date)

### 8. **Message**
- `id` (string/number)
- `sender_email` (string)
- `receiver_email` (string)
- `content` (string)
- `created_date` (date)

---

## Pages & Features

### 1. **Dashboard** (`pages/Dashboard.rtf`)
**Purpose**: Main overview page showing stats and recent activity

**Features**:
- User role-based content (Student vs Supervisor)
- Stats cards showing:
  - Total projects
  - Pending submissions
  - Upcoming milestones
  - Recent activities
- Project cards with quick actions
- Upcoming deadlines widget
- Recent activity feed

**Components Used**:
- `StatsCard`
- `ProjectCard`
- `UpcomingDeadlines`
- `RecentActivity`

### 2. **Projects** (`pages/Projects.rtf`)
**Purpose**: List all projects

**Student View**:
- Shows projects where student is assigned
- Filter by status (active, completed)
- Create new project requests

**Supervisor View**:
- Shows all supervised projects
- Accept/reject project proposals
- View project details

### 3. **Project Details** (`pages/ProjectDetails.rtf`)
**Purpose**: Detailed view of a single project

**Features**:
- Project information
- Milestones tracking
- Submissions list
- Meeting history
- Team communication

### 4. **Project Invitations** (`pages/ProjectInvitations.rtf`)
**Purpose**: Manage project invitations (student only)

**Features**:
- List of proposed projects
- Accept/decline invitations
- Badge count in navigation

### 5. **Submissions** (`pages/Submissions.rtf`)
**Purpose**: Submit and track project deliverables

**Features**:
- Create new submissions
- View submission history
- Track review status

### 6. **Meetings** (`pages/Meetings.rtf`)
**Purpose**: Schedule and manage meetings

**Features**:
- Calendar view
- Schedule new meetings
- Join virtual meetings
- Meeting history

### 7. **Evaluations** (`pages/Evaluations.rtf`)
**Purpose**: Supervisor evaluation system

**Features** (Supervisor only):
- Grade submissions
- Provide feedback
- View evaluation history

### 8. **Notifications** (`pages/Notifications.rtf`)
**Purpose**: Notification center

**Features**:
- Unread badge count
- Mark as read
- Filter by type
- Real-time updates

### 9. **Profile** (`pages/Profile.rtf`)
**Purpose**: User profile management

**Features**:
- Edit personal information
- Upload avatar
- Change password
- Account settings

### 10. **Onboarding** (`pages/Onbording.rtf`)
**Purpose**: Initial setup for new users

**Features**:
- Select user role (student/supervisor)
- Complete profile
- Tutorial/welcome flow

---

## Layout Component (`Layout.js.rtf`)

### Structure
```
SidebarProvider
└── Container
    ├── Sidebar
    │   ├── SidebarHeader (Logo + App Name)
    │   ├── SidebarContent
    │   │   ├── Navigation Group
    │   │   │   └── Menu Items (role-based)
    │   │   └── Account Group
    │   │       └── Profile Link
    │   └── SidebarFooter
    │       ├── User Avatar + Info
    │       └── Logout Button
    └── Main Content
        ├── Mobile Header (with menu trigger)
        └── Page Content
```

### Navigation Items

**Student Navigation**:
1. Dashboard - `LayoutDashboard` icon
2. Invitations - `Mail` icon (with badge)
3. My Projects - `FolderKanban` icon
4. Submissions - `FileText` icon
5. Meetings - `Calendar` icon
6. Notifications - `Bell` icon (with badge)
7. Profile - `User` icon

**Supervisor Navigation**:
1. Dashboard - `LayoutDashboard` icon
2. All Projects - `FolderKanban` icon
3. Evaluations - `FileText` icon
4. Meetings - `Calendar` icon
5. Notifications - `Bell` icon (with badge)
6. Profile - `User` icon

### Design Features
- Gradient backgrounds: `from-slate-50 via-white to-indigo-50/30`
- Active state: `bg-gradient-to-r from-indigo-600 to-indigo-700`
- Hover effects: `hover:bg-indigo-50 hover:text-indigo-700`
- Backdrop blur: `backdrop-blur-xl`
- Shadow effects: `shadow-lg shadow-indigo-500/20`
- Responsive mobile menu

---

## Base44 API Integration

### Authentication
```javascript
// Get current user
base44.auth.me()

// Logout
base44.auth.logout()
```

### Entity Operations
```javascript
// List all entities
base44.entities.Project.list('-updated_date')

// Filter entities
base44.entities.Notification.filter({
  user_email: email,
  is_read: false
})

// CRUD operations available:
// - .list(sortField)
// - .filter(conditions)
// - .get(id)
// - .create(data)
// - .update(id, data)
// - .delete(id)
```

---

## Migration Tasks to Angular

### Phase 1: Project Setup
1. Create new Angular project with Tailwind CSS
2. Install dependencies:
   - Angular Router
   - RxJS
   - Tailwind CSS
   - Angular CDK/Material (or custom UI library)
   - Lucide Angular icons
3. Set up project structure (modules, components, services)
4. Configure Tailwind (replicate current design system)

### Phase 2: Core Services
1. Create Base44 API service adapter
2. Implement authentication service + guard
3. Create entity services for each data model
4. Set up state management (RxJS subjects/stores)
5. Implement routing configuration

### Phase 3: Shared Components
1. Layout component with sidebar
2. UI components (Card, Button, Badge, Avatar)
3. Form components
4. Loading states
5. Error handling components

### Phase 4: Feature Modules
1. Auth module (login, onboarding)
2. Dashboard module
3. Projects module
4. Submissions module
5. Meetings module
6. Notifications module
7. Profile module
8. Evaluations module (supervisor)

### Phase 5: Styling & Polish
1. Apply Tailwind classes (match current design)
2. Responsive design
3. Animations and transitions
4. Dark mode (optional)
5. Accessibility improvements

### Phase 6: Testing & Deployment
1. Unit tests
2. Integration tests
3. E2E tests
4. Performance optimization
5. Production build
6. Deployment setup

---

## Key Design Patterns to Implement

### 1. Role-Based Access Control
```typescript
// Angular example
if (user.user_role === 'supervisor') {
  // Show supervisor features
} else {
  // Show student features
}
```

### 2. Real-time Badge Updates
- Unread notifications count
- Pending invitations count
- Update via polling or WebSocket

### 3. Query Caching Strategy
React Query used in original - replicate with:
- RxJS BehaviorSubject
- Angular HTTP interceptors
- ShareReplay operator

### 4. Conditional Navigation
Different menu items based on user role

### 5. Protected Routes
Use Angular guards for authenticated pages

---

## Design System

### Color Palette
- **Primary**: Indigo (600-700 for gradients)
- **Background**: Slate (50, white)
- **Text**: Slate (900, 600, 500)
- **Success**: Green
- **Error**: Red (500)
- **Warning**: Yellow

### Typography
- **Headings**: Bold, tracking-tight
- **Body**: Medium weight
- **Labels**: Semibold, uppercase, tracking-wider

### Spacing
- **Padding**: 3, 4, 6 units
- **Gap**: 2, 3, 4 units
- **Rounded**: xl, lg

### Effects
- **Shadows**: `shadow-lg shadow-indigo-500/20`
- **Blur**: `backdrop-blur-xl`
- **Transitions**: `transition-all duration-200`
- **Gradients**: `from-indigo-600 to-indigo-700`

---

## Working with Claude CLI

### Common Commands

#### Explore the codebase
```
Can you explore the EncadriStruct folder and tell me about the Dashboard page structure?
```

#### Create Angular service
```
Create an Angular service for the Base44 API that handles authentication and entity operations
```

#### Generate component
```
Generate the Dashboard Angular component based on the React version in EncadriStruct/pages/Dashboard.rtf
```

#### Apply styling
```
Apply Tailwind styling to the sidebar component to match the design in EncadriStruct/Layout.js.rtf
```

### Tips for Better Results
1. Reference specific files: `@EncadriStruct/pages/Dashboard.rtf`
2. Be specific about requirements: "maintain the same gradient design"
3. Ask for incremental changes
4. Request explanations when needed
5. Use todo lists for multi-step tasks

---

## Quick Start Workflow

### Step 1: Initialize Angular Project
```bash
ng new encadri-angular --routing --style=scss
cd encadri-angular
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```

### Step 2: Install Dependencies
```bash
npm install @angular/material @angular/cdk
npm install lucide-angular
npm install rxjs
```

### Step 3: Ask Claude to Create Base Structure
```
Based on the EncadriStruct folder, create the Angular project structure with:
1. Core module with services
2. Shared module with UI components
3. Feature modules for each page
4. Routing configuration
```

### Step 4: Migrate Page by Page
Start with simpler pages and progress to complex ones:
1. Layout component
2. Login/Onboarding
3. Dashboard
4. Profile
5. Notifications
6. Projects
7. Project Details
8. Submissions
9. Meetings
10. Evaluations

---

## Notes
- All RTF files contain React/JSX code with Tailwind classes
- Base44 API client needs to be adapted for Angular HTTP
- Maintain the same visual design and user experience
- Keep role-based access control logic
- Preserve all notification and invitation badge functionality

---

## Reference Files
- **Layout**: `EncadriStruct/Layout.js.rtf`
- **Pages**: `EncadriStruct/pages/*.rtf`
- **Components**: `EncadriStruct/COMPONENTS/**/*`
- **Entities**: `EncadriStruct/Entities/*.rtf`

---

Last Updated: 2025-11-23
