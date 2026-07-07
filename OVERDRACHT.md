# Motiva — Handover & Further Development

**Project:** Motiva — Task Management App
**Version:** 1.0.0
**Platform:** iOS & Android (React Native / Expo)
**Backend:** Supabase (PostgreSQL + Auth)
**Date:** July 2026

---

## 1. Project Overview

Motiva is a mobile task-management app built to motivate users through gamification. Users create tasks with optional deadlines and rewards, break them into subtasks, track progress via a visual progress bar, and are rewarded with points and unlockable avatars when tasks are completed. The app supports full dark/light mode and stores all user data securely per account.

---

## 2. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | React Native + Expo | ~54 |
| Routing | Expo Router (file-based) | ~6 |
| Backend / Auth | Supabase (PostgreSQL + Auth) | ^2.105 |
| State management | React Context API | — |
| Local storage | @react-native-async-storage | 2.2.0 |
| Date picker | @react-native-community/datetimepicker | ^8.4.4 |
| Icons | @expo/vector-icons (MaterialIcons) | ^15 |
| Haptics | expo-haptics | ~15 |
| Audio | expo-audio | ~1.1 |
| Confetti | react-native-confetti-cannon | ^1.5 |
| Language | TypeScript | ~5.9 |
| Build/Deploy | EAS (Expo Application Services) | — |

---

## 3. Repository Structure

```
motiva/
├── app/                         # Expo Router screens (file-based routing)
│   ├── _layout.tsx              # Root layout — providers, navigation stack
│   ├── index.tsx                # Auth guard — redirects to tabs or login
│   ├── loading.tsx              # Splash / auth-check screen
│   ├── settings.tsx             # Appearance settings (pushed from Profile)
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Bottom tab bar configuration
│   │   ├── index.tsx            # Dashboard screen
│   │   ├── rewards.tsx          # Rewards screen
│   │   └── profile.tsx          # Profile screen
│   └── auth/
│       ├── login.tsx            # Login screen
│       └── register.tsx         # Registration screen
│
├── components/
│   ├── common/                  # Shared UI primitives (buttons, inputs, cards)
│   ├── dashboard/               # Task-related components (task card, subtask list, forms)
│   ├── profile/                 # Profile components (avatar, stats, account forms)
│   └── rewards/                 # Reward display components
│
├── constants/
│   ├── theme.ts                 # Full color palette (light + dark) and font tokens
│   └── styles.ts                # All StyleSheet definitions
│
├── features/
│   ├── tasks/
│   │   ├── types.ts             # Task and Subtask TypeScript interfaces
│   │   ├── use-tasks.ts         # All Supabase mutations and local task state
│   │   ├── tasks-context.tsx    # TasksProvider — app-wide shared task state
│   │   ├── utils.ts             # getTaskProgress, formatDeadline, sort helpers
│   │   └── celebration.ts       # Event emitter for completion celebrations
│   ├── profile/
│   │   ├── use-account-actions.ts
│   │   └── use-profile-stats.ts
│   └── theme/
│       └── theme-preference.tsx # ThemePreferenceProvider + useThemePreference hook
│
├── hooks/                       # Custom hooks (color scheme, themed styles, auth)
├── lib/
│   └── supabase.ts              # Supabase client (AsyncStorage session persistence)
└── assets/
    ├── images/
    └── sounds/
```

---

## 4. Architecture Overview

### Data Flow

```
Supabase DB
    ↕  (supabase-js)
lib/supabase.ts
    ↕
features/tasks/use-tasks.ts        ← owns all task state + Supabase mutations
    ↕
features/tasks/tasks-context.tsx   ← TasksProvider wraps use-tasks; exposes useTasksContext()
    ↕
app/(tabs)/index.tsx               ← reads useTasksContext(), passes callbacks down
    ↓
components/dashboard/task-card.tsx ← React.memo, re-renders only on own task change
    ↓
TaskCardHeader / TaskProgress / SubtaskList / TaskEditForm
```

### Key Architectural Decisions

- **`use-tasks.ts` as single source of truth** — all Supabase reads/writes live in one hook; screens receive only stable callback references to prevent unnecessary re-renders.
- **`TasksProvider` context** — mounts once in `app/_layout.tsx`, listens to Supabase auth state to fetch/clear tasks on sign-in/sign-out. All screens share one task list.
- **`tasksRef`** — a `useRef` mirror of the tasks array lets `useCallback` closures always read the latest list without `tasks` as a dependency (avoids recreating every function on every mutation).
- **`React.memo` on `TaskCard`** — each card only re-renders when its own `task` object or the passed callbacks change.
- **Celebration event emitter** (`celebration.ts`) — a module-level `Set` of listeners decouples `useTasks` from `CelebrationOverlay`, keeping the one-off completion trigger out of the shared Context.
- **Gamification stored in Auth metadata** — user `points`, selected `avatar`, and `unlockedAvatars` are stored in Supabase Auth `user_metadata` (no extra table needed). Updated via `supabase.auth.updateUser({ data: ... })`.

---

## 5. Database Schema

### `public.tasks`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid (PK) | auto-generated |
| `user_id` | uuid (FK → auth.users) | cascade delete |
| `title` | text | required |
| `completed` | boolean | default false |
| `completed_at` | timestamptz | set when task reaches 100% |
| `deadline` | timestamptz | optional |
| `reward` | text | optional reward string |
| `points_awarded` | boolean | prevents double-awarding points |
| `created_at` | timestamptz | auto |
| `updated_at` | timestamptz | auto |

### `public.subtasks`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid (PK) | auto-generated |
| `task_id` | uuid (FK → tasks.id) | cascade delete |
| `title` | text | required |
| `completed` | boolean | default false |
| `deadline` | timestamptz | optional |
| `created_at` | timestamptz | auto |
| `updated_at` | timestamptz | auto |

### Row Level Security

Both tables have RLS enabled. Users can only read/write their own tasks. The subtask policy checks that the parent task belongs to the requesting user.

### Optional: Account Deletion RPC

A `delete_user_account()` Postgres function (security definer) is required for the "Delete account" feature on the Profile screen. Without it, the button shows a graceful error message — everything else works fine.

---

## 6. Environment Setup

### Prerequisites

- Node.js ≥ 18, npm ≥ 9
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on a physical device OR an Android emulator / iOS simulator
- A Supabase account (free tier is sufficient)

### Steps

1. Clone the repository and run `npm install`
2. Create a `.env` file in the project root:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   ```
3. Run the SQL schema from Section 5 in the Supabase SQL Editor
4. Start the dev server: `npx expo start`

---

## 7. Current Features

### Authentication
- Email/password sign-up and login via Supabase Auth
- Session persisted to device storage (stays logged in between app restarts)
- Auth-guarded routing: unauthenticated users are redirected to login

### Dashboard
- View all open tasks sorted by deadline
- Add task (title, optional reward, optional deadline)
- Inline edit task (pencil icon opens edit form within the card)
- Delete task (trash icon with confirmation)
- Expand/collapse subtasks per task (chevron toggle)
- Add, delete, and toggle subtasks
- Red progress bar per task based on subtask completion percentage
- Deadline shown as DD/MM below the progress bar
- Tasks grouped into collapsible sections

### Rewards
- Attach a reward string to any task
- Rewards screen shows the next upcoming reward and a list of all earned rewards

### Celebration
- Confetti burst, haptic feedback, and sound effect when a task reaches 100% completion

### Profile & Gamification
- Stats overview: total tasks, completed tasks, rewards earned, points
- Avatar system with four tiers: Free, Common (25 pts), Rare (75 pts), Legendary (150 pts)
- Points earned by completing tasks; spent to unlock avatar tiers
- Change email, change password
- Delete account

### Settings & Theming
- Light, dark, or system appearance setting
- Preference persisted to device storage
- Every screen and component fully supports dark mode

---

## 8. Color Palette (Brand)

| Token | Light | Dark | Usage |
|---|---|---|---|
| `primary` | `#BF1A2F` | `#BF1A2F` | Progress bar, delete icons, errors |
| `secondary` | `#36749E` | `#4A8BB8` | Edit icons, active tab, links |
| `text` | `#23344A` | `#E6E8E6` | All body text |
| `background` | `#E6E8E6` | `#111820` | Screen background |
| `surface` | `#FFFFFF` | `#23344A` | Cards, tab bar |
| `border` | `#D4D6D4` | `#2E4560` | Dividers, input borders |

All colors are defined in `constants/theme.ts`. The `useThemedStyles()` hook merges color tokens with StyleSheet definitions — no component ever uses raw hex values directly.

---

## 9. Build & Deployment

The project is configured for **Expo Application Services (EAS)**. The EAS Project ID is `a1af2eba-0403-474c-8573-3ef1d98ae7d7`.

| Build profile | Distribution | Notes |
|---|---|---|
| `development` | Internal | Includes development client |
| `preview` | Internal | For TestFlight / internal testing |
| `production` | App Store / Play Store | Auto-increments version |

### Commands

```bash
# Build for Android
eas build --platform android --profile production

# Build for iOS
eas build --platform ios --profile production

# Submit to app stores
eas submit --platform android
eas submit --platform ios
```

---

## 10. Future Development Roadmap

### 10.1 Push Notifications (HIGH PRIORITY)

**Goal:** Remind users daily to work on open tasks and alert them on deadline day.

**Implementation plan:**
- Install `expo-notifications` package
- Request notification permissions on first launch (show a permission prompt with context)
- Daily reminder: schedule a local notification each evening (e.g. 20:00) listing the user's open tasks for that day
- Deadline-day notification: when a task is created or edited with a deadline, schedule a local notification for 09:00 on that deadline day
- On task completion, cancel the corresponding deadline notification
- Add a "Notification Settings" section to the Settings screen so users can toggle reminders on/off and choose their preferred reminder time

**Key files to change:** `app/_layout.tsx` (permission request on launch), new `features/notifications/` folder for scheduling logic, `app/settings.tsx`.

---

### 10.2 App Store Release — iOS & Android (HIGH PRIORITY)

**Goal:** Publish Motiva to the Apple App Store and Google Play Store.

**Steps for iOS:**
1. Enroll in the Apple Developer Program ($99/year at developer.apple.com)
2. Configure signing in EAS: `eas credentials --platform ios`
3. Build production IPA: `eas build --platform ios --profile production`
4. Submit: `eas submit --platform ios` (requires App Store Connect app listing)
5. Complete App Store metadata: screenshots, description, age rating, privacy policy URL

**Steps for Android:**
1. Create a Google Play Developer account ($25 one-time at play.google.com/console)
2. Build production AAB: `eas build --platform android --profile production`
3. Submit: `eas submit --platform android` (requires Play Console app listing)
4. Complete Play Store metadata: feature graphic, screenshots, description, content rating

**Note:** A privacy policy URL is required by both stores because the app collects email addresses and user-generated content.

---

### 10.3 Avatar Store with Illustrated Avatars (MEDIUM PRIORITY)

**Goal:** Replace the current emoji-based avatar system with a proper avatar store where users buy illustrated avatars with their earned points.

**Implementation plan:**
- Design or license a set of avatar illustrations (e.g. 12–20 options across multiple styles/themes)
- Store images in `assets/images/avatars/` and bundle them with the app
- Define each avatar in a central config: `{ id, name, image, pointsCost, tier }`
- Keep the existing points economy — avatars are still purchased with points earned by completing tasks
- The avatar picker (`avatar-picker.tsx`) becomes a scrollable store grid: owned avatars are selectable, locked avatars show their point cost and a lock icon
- `avatar-hero.tsx` renders `<Image>` instead of emoji text
- `unlockedAvatars` list and selected avatar ID remain in `user_metadata` (no schema change needed)

---

### 10.4 Recurring Tasks (SUGGESTED)

**Goal:** Allow tasks to repeat automatically on a schedule (e.g., "Clean desk — every Monday").

**Implementation plan:**
- Add a `recurrence` column to the `tasks` table (`none` | `daily` | `weekly` | `monthly`)
- When a recurring task is marked complete, auto-create a new copy with the next deadline
- Show a recurring badge icon on recurring task cards
- Add recurrence selection to the add/edit task form

---

### 10.5 Task Categories / Tags (SUGGESTED)

**Goal:** Let users organise tasks by area of life (e.g., Work, Study, Personal, Health).

**Implementation plan:**
- Add a `category` column (or a separate `tags` table) to `tasks`
- Add a category filter bar at the top of the Dashboard
- Color-code task cards or badges by category
- Show category breakdown in the Profile stats

---

### 10.6 Home Screen Widget (SUGGESTED)

**Goal:** Show today's open tasks on the device home screen without opening the app.

**Implementation plan:**
- Use `expo-widgets` (currently experimental) or a native module
- Widget shows count of open tasks + up to 3 task titles
- Tapping the widget deep-links directly to the Dashboard

---

### 10.7 Detailed Statistics / Productivity Insights (SUGGESTED)

**Goal:** Give users a view of their long-term progress and habits.

**Implementation plan:**
- Track completion timestamps (already stored as `completed_at` in the tasks table)
- Add a Statistics screen (new tab or pushed from Profile)
- Show: tasks completed per week (bar chart), completion rate by day of week, average time to complete a task
- Use a charting library such as `react-native-gifted-charts` or `victory-native`

---

### 10.8 Onboarding Flow for New Users (SUGGESTED)

**Goal:** Guide new users through the app on first launch so they understand all features.

**Implementation plan:**
- Detect first launch via AsyncStorage flag
- Show a 3–4 screen modal walkthrough: "Create your first task", "Break it into subtasks", "Earn rewards", "Unlock avatars"
- Skip button on every screen
- Mark onboarding as complete in AsyncStorage so it never shows again

---

## 11. Known Limitations & Technical Debt

- **No offline support** — all reads and writes require an internet connection. Tasks created offline are lost.
- **No pagination** — the app fetches all tasks at once. Performance may degrade for users with many hundreds of tasks.
- **Subtask deadlines** — subtasks support deadlines in the data model but there is currently no deadline-day notification for individual subtasks.
- **No email verification enforcement** — users can log in without verifying their email. Consider enabling Supabase email confirmation for production.
- **Avatar metadata in auth** — storing avatar data in `user_metadata` is convenient but limits querying (e.g., leaderboards). A dedicated `profiles` table would be needed for any social features.
- **iOS build requires macOS** — `eas build` in the cloud handles this, but local `expo run:ios` requires a Mac.

---

## 12. Resources

| Resource | Link |
|---|---|
| Expo documentation | https://docs.expo.dev |
| Expo Router docs | https://expo.github.io/router |
| Supabase documentation | https://supabase.com/docs |
| EAS Build docs | https://docs.expo.dev/build/introduction |
| EAS Submit docs | https://docs.expo.dev/submit/introduction |
| Apple Developer | https://developer.apple.com |
| Google Play Console | https://play.google.com/console |
| expo-notifications | https://docs.expo.dev/versions/latest/sdk/notifications |

---

*Document generated: July 2026 | Motiva v1.0.0*
