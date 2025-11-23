# Encadri Angular - Setup Guide

## ✅ Phase 1: Project Setup - COMPLETED

### What's Been Done

1. ✅ **Angular Project Created**
   - Project name: `encadri-angular`
   - Angular version: 20.3
   - Routing: Enabled
   - Styles: SCSS

2. ✅ **Tailwind CSS Installed**
   - Tailwind CSS v3.x
   - PostCSS & Autoprefixer
   - Configuration: `tailwind.config.js`
   - Styles configured in `src/styles.scss`

3. ✅ **Angular Material/CDK Installed**
   - Version: 20.x (compatible with Angular 20)
   - Angular CDK included

4. ✅ **Lucide Angular Icons Installed**
   - Package: `lucide-angular`
   - For all UI icons (matching React version)

5. ✅ **Project Structure Created**
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

## 🚀 Development Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Angular CLI (optional, but recommended)

### Install Angular CLI (if not already installed)
```bash
npm install -g @angular/cli
```

### Navigate to Project
```bash
cd /Users/bahadhay/Desktop/EncadriWebSite/encadri-angular
```

### Install Dependencies (if needed)
Dependencies are already installed, but if you need to reinstall:
```bash
npm install
```

### Start Development Server
```bash
ng serve
```
or
```bash
npm start
```

The app will be available at: `http://localhost:4200`

### Build for Production
```bash
ng build --configuration production
```

---

## 📦 Installed Packages

### Core Dependencies
- `@angular/common`: ^20.3.0
- `@angular/core`: ^20.3.0
- `@angular/router`: ^20.3.0
- `@angular/material`: ^20.0.0
- `@angular/cdk`: ^20.0.0
- `lucide-angular`: latest
- `rxjs`: ~7.8.0

### Development Dependencies
- `tailwindcss`: latest
- `postcss`: latest
- `autoprefixer`: latest
- TypeScript: ~5.x

---

## 🎨 Tailwind Configuration

Tailwind is configured with custom colors matching the original design:

```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        indigo: { /* custom indigo palette */ }
      },
      boxShadow: {
        'indigo-lg': '...' // Custom indigo shadow
      }
    }
  }
}
```

### Using Tailwind in Components
```html
<div class="bg-gradient-to-r from-indigo-600 to-indigo-700 p-4 rounded-xl">
  Content here
</div>
```

---

## 🔧 Next Steps (Phase 2)

### 1. Create Data Models
Navigate to `src/app/core/models/` and create:
- `user.model.ts`
- `project.model.ts`
- `submission.model.ts`
- `milestone.model.ts`
- `notification.model.ts`
- `meeting.model.ts`
- `evaluation.model.ts`
- `message.model.ts`

**Claude CLI Command:**
```
Create the User model interface in src/app/core/models/user.model.ts based on the user entity from @EncadriStruct
```

### 2. Create Base44 Service
Create `src/app/core/services/base44.service.ts`

**Claude CLI Command:**
```
Create the Base44Service in src/app/core/services/base44.service.ts based on @BASE44_API_REFERENCE.md
```

### 3. Create Authentication Service
Create `src/app/core/services/auth.service.ts`

**Claude CLI Command:**
```
Create the AuthService in src/app/core/services/auth.service.ts with login, logout, and user state management
```

### 4. Create Auth Guard
Create `src/app/core/guards/auth.guard.ts`

**Claude CLI Command:**
```
Create an auth guard in src/app/core/guards/auth.guard.ts that protects routes
```

### 5. Create HTTP Interceptor
Create `src/app/core/interceptors/auth.interceptor.ts`

**Claude CLI Command:**
```
Create an HTTP interceptor in src/app/core/interceptors/auth.interceptor.ts that adds auth token to requests
```

---

## 📝 Useful Commands

### Generate Components
```bash
# Generate a standalone component
ng generate component features/dashboard/dashboard --standalone

# Generate a component with inline template/styles
ng generate component shared/components/button --inline-template --inline-style
```

### Generate Services
```bash
# Generate a service
ng generate service core/services/project

# Generate a guard
ng generate guard core/guards/auth
```

### Run Tests
```bash
ng test
```

### Lint Code
```bash
ng lint
```

---

## 🗂️ File Organization Tips

### Component Structure
```
feature-name/
├── feature-name.component.ts      # Component logic
├── feature-name.component.html    # Template
├── feature-name.component.scss    # Styles
└── feature-name.component.spec.ts # Tests
```

### Service Structure
```
core/services/
├── base44.service.ts
├── auth.service.ts
├── project.service.ts
└── ...
```

---

## 🎯 Working with Claude CLI

### Example Prompts

**Create a model:**
```
Create a Project model interface in src/app/core/models/project.model.ts based on @EncadriStruct/Entities/Project.rtf
```

**Create a service:**
```
Create a ProjectService in src/app/core/services/project.service.ts that uses the Base44Service to fetch projects
```

**Create a component:**
```
Create a Dashboard component in src/app/features/dashboard/dashboard.component.ts based on @EncadriStruct/pages/Dashboard.rtf
```

**Apply styling:**
```
Style the sidebar component to match the design from @EncadriStruct/Layout.js.rtf using Tailwind classes
```

---

## 🔍 Troubleshooting

### Port Already in Use
If port 4200 is already in use:
```bash
ng serve --port 4300
```

### Clear Node Modules
If you encounter dependency issues:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Tailwind Not Working
Make sure `src/styles.scss` contains:
```scss
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 📚 Resources

- [Angular Documentation](https://angular.io/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Angular Material](https://material.angular.io)
- [Lucide Icons](https://lucide.dev)
- [RxJS Documentation](https://rxjs.dev)

---

## ✨ Phase 1 Complete!

You're ready to start building! Follow **Phase 2** in `@MIGRATION_TASKS.md` to create core services and models.

**Recommended Next Step:**
```
Help me implement Phase 2 from @MIGRATION_TASKS.md - create all the data models
```

---

Last Updated: 2025-11-23
