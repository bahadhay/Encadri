# Encadri - React to Angular Migration Tasks

## Quick Reference Checklist

### ✅ Phase 1: Project Setup

- [ ] Create Angular project with routing
  ```bash
  ng new encadri-angular --routing --style=scss
  ```

- [ ] Install Tailwind CSS
  ```bash
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init
  ```

- [ ] Configure Tailwind (tailwind.config.js)
  ```javascript
  content: ["./src/**/*.{html,ts}"]
  ```

- [ ] Install Angular Material/CDK
  ```bash
  ng add @angular/material
  ```

- [ ] Install icon library
  ```bash
  npm install lucide-angular
  ```

- [ ] Set up project folder structure
  ```
  src/app/
  ├── core/
  │   ├── services/
  │   ├── guards/
  │   ├── interceptors/
  │   └── models/
  ├── shared/
  │   └── components/
  ├── features/
  │   ├── auth/
  │   ├── dashboard/
  │   ├── projects/
  │   ├── submissions/
  │   ├── meetings/
  │   ├── notifications/
  │   ├── evaluations/
  │   └── profile/
  └── layout/
  ```

---

### ✅ Phase 2: Core Services & Models

- [ ] **Create data models** (interfaces/types)
  - [ ] User model
  - [ ] Project model
  - [ ] Submission model
  - [ ] Milestone model
  - [ ] Notification model
  - [ ] Meeting model
  - [ ] Evaluation model
  - [ ] Message model

- [ ] **Base44 API Service**
  - [ ] Create Base44Client service
  - [ ] Implement authentication methods
  - [ ] Implement entity CRUD operations
  - [ ] Add error handling
  - [ ] Add HTTP interceptor

- [ ] **Authentication Service**
  - [ ] Login method
  - [ ] Logout method
  - [ ] Get current user (me)
  - [ ] Store auth token
  - [ ] Observable for user state

- [ ] **Auth Guard**
  - [ ] Check if user is authenticated
  - [ ] Redirect to login if not authenticated
  - [ ] Role-based guard (student/supervisor)

- [ ] **Entity Services** (one per entity)
  - [ ] ProjectService
  - [ ] SubmissionService
  - [ ] MilestoneService
  - [ ] NotificationService
  - [ ] MeetingService
  - [ ] EvaluationService
  - [ ] MessageService

---

### ✅ Phase 3: Shared UI Components

- [ ] **Layout Components**
  - [ ] AppLayout component
  - [ ] Sidebar component
  - [ ] SidebarHeader component
  - [ ] SidebarFooter component
  - [ ] MobileHeader component

- [ ] **UI Components**
  - [ ] Card component
  - [ ] Button component
  - [ ] Badge component
  - [ ] Avatar component
  - [ ] Input component
  - [ ] Select component
  - [ ] Textarea component
  - [ ] Modal/Dialog component
  - [ ] Toast/Alert component

- [ ] **Dashboard Components**
  - [ ] StatsCard component
  - [ ] ProjectCard component
  - [ ] UpcomingDeadlines component
  - [ ] RecentActivity component

---

### ✅ Phase 4: Routing Configuration

- [ ] Set up app routes
  ```typescript
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'projects', component: ProjectsComponent },
      { path: 'project/:id', component: ProjectDetailsComponent },
      { path: 'invitations', component: ProjectInvitationsComponent },
      { path: 'submissions', component: SubmissionsComponent },
      { path: 'meetings', component: MeetingsComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: 'evaluations', component: EvaluationsComponent },
      { path: 'profile', component: ProfileComponent },
    ]
  }
  ```

- [ ] Auth routes (login, onboarding)
- [ ] Redirect logic (default routes)
- [ ] 404 page

---

### ✅ Phase 5: Feature Modules

#### Auth Module
- [ ] Login page
- [ ] Onboarding page (role selection)
- [ ] Password reset (if needed)

#### Dashboard Module
- [ ] Dashboard page component
- [ ] Stats calculation logic
- [ ] Role-based content display
- [ ] Integrate with services
- [ ] Add loading states

#### Projects Module
- [ ] Projects list page
- [ ] Project details page
- [ ] Create project form
- [ ] Edit project form
- [ ] Project filters (status, search)
- [ ] Role-based views

#### Project Invitations Module (Student)
- [ ] Invitations list page
- [ ] Accept/decline actions
- [ ] Badge count integration

#### Submissions Module
- [ ] Submissions list page
- [ ] Create submission form
- [ ] Submission details view
- [ ] File upload (if needed)
- [ ] Status tracking

#### Meetings Module
- [ ] Meetings list/calendar page
- [ ] Create meeting form
- [ ] Meeting details view
- [ ] Join meeting link

#### Notifications Module
- [ ] Notifications page
- [ ] Mark as read functionality
- [ ] Unread count badge
- [ ] Real-time updates (polling)

#### Evaluations Module (Supervisor)
- [ ] Evaluations list page
- [ ] Create evaluation form
- [ ] Grade input
- [ ] Feedback textarea

#### Profile Module
- [ ] Profile page
- [ ] Edit profile form
- [ ] Avatar upload
- [ ] Change password

---

### ✅ Phase 6: Apply Design System

- [ ] **Color Palette**
  - [ ] Configure Tailwind colors (indigo, slate)
  - [ ] Create gradient classes
  - [ ] Set up shadow utilities

- [ ] **Typography**
  - [ ] Font families
  - [ ] Font sizes
  - [ ] Font weights
  - [ ] Text colors

- [ ] **Spacing System**
  - [ ] Padding classes
  - [ ] Margin classes
  - [ ] Gap utilities

- [ ] **Component Styling**
  - [ ] Sidebar styling (gradient, blur)
  - [ ] Navigation items (active state)
  - [ ] Cards and containers
  - [ ] Buttons (variants)
  - [ ] Form inputs
  - [ ] Badges

- [ ] **Responsive Design**
  - [ ] Mobile menu toggle
  - [ ] Breakpoint adjustments
  - [ ] Grid/flex layouts

- [ ] **Animations**
  - [ ] Transitions
  - [ ] Hover effects
  - [ ] Loading spinners

---

### ✅ Phase 7: Business Logic

- [ ] **Role-Based Features**
  - [ ] Student navigation items
  - [ ] Supervisor navigation items
  - [ ] Conditional rendering

- [ ] **Data Fetching**
  - [ ] Projects list with filters
  - [ ] Notifications with unread filter
  - [ ] Invitations count
  - [ ] User data

- [ ] **Notifications System**
  - [ ] Fetch unread notifications
  - [ ] Update badge count
  - [ ] Mark as read
  - [ ] Polling interval

- [ ] **Invitations System**
  - [ ] Fetch pending invitations
  - [ ] Accept invitation
  - [ ] Decline invitation
  - [ ] Update counts

- [ ] **Project Status Management**
  - [ ] Proposed projects
  - [ ] Active projects
  - [ ] Completed projects
  - [ ] Status transitions

---

### ✅ Phase 8: Testing

- [ ] **Unit Tests**
  - [ ] Services
  - [ ] Components
  - [ ] Guards
  - [ ] Pipes/Utilities

- [ ] **Integration Tests**
  - [ ] API integration
  - [ ] Routing
  - [ ] Authentication flow

- [ ] **E2E Tests**
  - [ ] Login flow
  - [ ] Dashboard navigation
  - [ ] CRUD operations
  - [ ] Role switching

---

### ✅ Phase 9: Optimization

- [ ] Lazy loading modules
- [ ] OnPush change detection
- [ ] Bundle size optimization
- [ ] Image optimization
- [ ] Caching strategy
- [ ] Performance monitoring

---

### ✅ Phase 10: Deployment

- [ ] Environment configurations
- [ ] Production build
- [ ] Base44 API endpoints setup
- [ ] Deploy to hosting platform
- [ ] SSL certificate
- [ ] Domain configuration

---

## Migration Order (Recommended)

### Week 1: Foundation
1. Project setup
2. Core services
3. Data models
4. Authentication

### Week 2: Layout & Shared Components
1. Layout component with sidebar
2. UI components
3. Routing setup

### Week 3: Core Features
1. Dashboard
2. Projects
3. Profile
4. Notifications

### Week 4: Additional Features
1. Submissions
2. Meetings
3. Evaluations
4. Project invitations

### Week 5: Polish & Testing
1. Design refinement
2. Testing
3. Bug fixes
4. Optimization

---

## Claude CLI Command Templates

### Generate Service
```
Create an Angular service called ProjectService that:
- Uses the Base44 API client
- Has methods for list, filter, get, create, update, delete
- Returns Observables
- Handles errors
- Reference the Project entity from @EncadriStruct/Entities/Project.rtf
```

### Generate Component
```
Create an Angular component for the Dashboard page based on @EncadriStruct/pages/Dashboard.rtf that:
- Uses the same layout structure
- Implements role-based content
- Uses Tailwind classes from the original
- Integrates with ProjectService, SubmissionService, MilestoneService
```

### Apply Styling
```
Style the Sidebar component to match @EncadriStruct/Layout.js.rtf:
- Same gradient background
- Same active state styling
- Same hover effects
- Same badge positioning
```

### Create Model
```
Create a TypeScript interface for the Project entity based on @EncadriStruct/Entities/Project.rtf
```

---

## Notes
- Check off tasks as you complete them
- Each phase builds on the previous
- Test frequently during development
- Keep original design intact
- Maintain Base44 API compatibility

---

Last Updated: 2025-11-23
