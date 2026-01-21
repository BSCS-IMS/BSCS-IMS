# BSCS-IMS
**IMS ng Pinas!**

A Next.js + Electron inventory management system with Firebase backend, built with modern web technologies.

---

## 🚀 Tech Stack

- **Frontend Framework**: Next.js 16 (App Router, JavaScript)
- **Desktop Wrapper**: Electron 40
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS 4
- **UI Components**: Material-UI (MUI) + shadcn/ui
- **Icons**: Lucide React + MUI Icons

---

## 📋 Prerequisites

Before you begin, ensure you have installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)
- **Firebase Account** - [Sign up here](https://firebase.google.com/)

---

## 🛠️ Setup Instructions for Developers

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/bscs-ims.git
cd bscs-ims
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js, React
- Firebase SDK
- Electron & Electron Builder
- Tailwind CSS
- Material-UI & shadcn/ui
- Axios
- All development dependencies

### 3. Setup Environment Variables

Create a `.env.local` file in the root directory:

```bash
touch .env.local
```

Add your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

**⚠️ IMPORTANT**: Never commit `.env.local` to git! It contains sensitive credentials.

### 4. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Go to **Project Settings** → **General** → **Your apps** → **Web app**
4. Copy the configuration values to your `.env.local`
5. Go to **Firestore Database** → **Rules** and set (for development):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

6. Enable **Authentication** → **Email/Password** sign-in method

### 5. Verify Installation

```bash
npm list --depth=0
```

You should see all dependencies listed without errors.

---

## 🏃 Running the Application

### For Web Development (Browser)

```bash
npm run dev
```

- Opens at: `http://localhost:3000`
- Hot reload enabled
- Access in any web browser

### For Desktop Development (Electron)

**Option 1: Single Command (Automated)**
```bash
npm run electron
```

**Option 2: Manual (Two Terminals)**

**Terminal 1:**
```bash
npm run dev
```
Wait for: `✓ Ready on http://localhost:3000`

**Terminal 2:**
```bash
npm run electron
```

- Opens Electron window
- DevTools open by default
- Hot reload enabled

**Keyboard Shortcuts in Electron:**
- `Ctrl+R` / `Cmd+R` → Reload window
- `Ctrl+Shift+I` / `Cmd+Shift+I` → Toggle DevTools
- `Ctrl+Shift+R` / `Cmd+Shift+R` → Force reload

---

## 🏗️ Building for Production

### Build Web Application

```bash
npm run build
```

Creates optimized production build in `.next/` directory.

To run production build locally:
```bash
npm run start
```

### Build Desktop Application

```bash
npm run electron:build
```

Creates installers in `dist/` directory:
- **Windows**: `.exe` installer
- **macOS**: `.dmg` installer
- **Linux**: `.AppImage`

---

## 📂 Project Structure

```
bscs-ims/
├── app/                          # Next.js App Router
│   ├── page.jsx                  # Home page
│   ├── crud.jsx                  # CRUD component
│   ├── globals.css               # Global styles (Tailwind)
│   ├── layout.jsx                # Root layout
│   └── lib/
│       ├── firebase.js           # Firebase configuration
│       └── utils.js              # Utility functions
│
├── components/
│   └── ui/                       # shadcn/ui components
│       ├── button.jsx
│       ├── card.jsx
│       ├── input.jsx
│       └── ...
│
├── electron/
│   └── main.js                   # Electron main process
│
├── public/                       # Static assets
│
├── .env.local                    # Environment variables (gitignored)
├── .gitignore                    # Git ignore rules
├── components.json               # shadcn/ui configuration
├── next.config.js                # Next.js configuration
├── package.json                  # Dependencies & scripts
├── postcss.config.js             # PostCSS configuration
├── tailwind.config.js            # Tailwind CSS configuration
└── README.md                     # This file
```

---

## 🔄 Git Workflow

### Initial Setup

```bash
# Check current branch
git branch

# Ensure you're on main
git checkout main

# Pull latest changes
git pull origin main
```

### Creating a New Feature Branch

Use the naming convention: `[initials]-[ticket-number]`

```bash
# Example: Andre Victoria working on ticket 001
git checkout -b av-001

# Example: Juan Dela Cruz working on ticket 002
git checkout -b jdc-002
```

### Working on Your Branch

```bash
# Check status
git status

# Add files
git add .

# Commit changes
git commit -m "feat: add user authentication"

# Push to remote
git push origin av-001
```

### Keeping Your Branch Updated

```bash
# Switch to main
git checkout main

# Pull latest changes
git pull origin main

# Switch back to your branch
git checkout av-001

# Merge main into your branch
git merge main
```

### Creating a Pull Request

1. Push your branch: `git push origin av-001`
2. Go to GitHub repository
3. Click **"Compare & pull request"**
4. Add description of changes
5. Request review from team members
6. Wait for approval and merge

### Common Git Commands

```bash
# View all branches
git branch -a

# Delete local branch (after merge)
git branch -d av-001

# Discard local changes
git checkout -- .

# View commit history
git log --oneline

# Stash changes temporarily
git stash
git stash pop

# Pull latest from current branch
git pull
```

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js development server (web) |
| `npm run electron` | Start Electron desktop app (development) |
| `npm run build` | Build Next.js for production |
| `npm run start` | Run production build (web) |
| `npm run electron:build` | Build Electron installer |
| `npm run lint` | Run ESLint |

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Windows
taskkill /F /IM node.exe

# Mac/Linux
killall node
```

### Electron Won't Start

1. Make sure Next.js dev server is running first
2. Check if port 3000 is accessible
3. Delete `.next` folder and restart: `rm -rf .next`

### Firebase Permissions Error

- Check Firestore rules are set correctly
- Verify `.env.local` has correct credentials
- Ensure Firebase project is active

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next
```

---

## 🔒 Security Notes

- **Never commit** `.env.local` to git
- **Never commit** `node_modules/` to git
- Keep Firebase rules restrictive in production
- Use environment-specific configurations
- Review security rules before deployment

---

## 🤝 Contributing

1. Create a new branch from `main`
2. Make your changes
3. Test thoroughly (both web and desktop)
4. Commit with clear messages
5. Push and create Pull Request
6. Request code review
7. Address feedback
8. Merge after approval

---

## 📝 Commit Message Convention

Follow conventional commits:

```bash
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting, missing semicolons, etc.
refactor: code restructuring
test: adding tests
chore: updating build tasks, package manager configs, etc.
```

Examples:
```bash
git commit -m "feat: add user authentication"
git commit -m "fix: resolve Firestore connection issue"
git commit -m "docs: update README with setup instructions"
```

---

## 🌐 Deployment

### Web Deployment (Vercel)

1. Push to GitHub
2. Connect repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push to `main`

### Desktop Distribution

1. Run `npm run electron:build`
2. Installers created in `dist/` folder
3. Distribute `.exe`, `.dmg`, or `.AppImage` to users

---


## 👥 Team

**BSCS Development Team**
- IMS ng Pinas!

---

**Happy Coding! 🚀**
