# Motiva

A React Native task-management app built with Expo and Supabase. Create tasks with optional deadlines and rewards, break them down into subtasks, track progress, and celebrate completions.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Supabase Setup](#supabase-setup)
5. [Environment Variables](#environment-variables)
6. [Installation & Running](#installation--running)
7. [Project Structure](#project-structure)
8. [Architecture Overview](#architecture-overview)
9. [Theming](#theming)
10. [Scripts](#scripts)

---

## Features

- **Authentication** — email/password sign-up and login via Supabase Auth
- **Dashboard** — view all tasks sorted by deadline, add/edit/delete tasks inline
- **Subtasks** — expand any task to manage subtasks with their own deadlines
- **Progress tracking** — red progress bar per task based on subtask completion
- **Rewards** — attach a reward string to a task; view next upcoming reward and earned rewards
- **Celebration** — confetti burst, haptic feedback, and sound when a task reaches 100%
- **Profile** — view account stats (total tasks, completed tasks, rewards earned), change email or password, delete account
- **Settings** — choose light, dark, or system appearance; preference persisted to device storage
- **Full dark mode** — every screen respects the active color scheme

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [React Native](https://reactnative.dev) + [Expo](https://expo.dev) ~54 |
| Routing | [Expo Router](https://expo.dev/router) v6 (file-based) |
| Backend / Auth | [Supabase](https://supabase.com) (PostgreSQL + Auth) |
| State | React `useState` / `useCallback` / `useRef` hooks |
| Storage (local) | `@react-native-async-storage/async-storage` |
| Date picker | `@react-native-community/datetimepicker` |
| Icons | `@expo/vector-icons` (MaterialIcons + SF Symbols via `expo-symbols`) |
| Haptics | `expo-haptics` |
| Audio | `expo-audio` |
| Confetti | `react-native-confetti-cannon` |
| Language | TypeScript ~5.9 |

---

## Prerequisites

Before running the project locally you need:

- **Node.js** ≥ 18 and **npm** ≥ 9
- **Expo CLI** — install globally if not already present:
  ```bash
  npm install -g expo-cli
  ```
- **Expo Go** app on your physical device (iOS or Android) **or** a running emulator/simulator
- A free **Supabase** account at [supabase.com](https://supabase.com)

---

## Supabase Setup

### 1. Create a project

Log in to the [Supabase dashboard](https://app.supabase.com) and create a new project. Note your **Project URL** and **anon public key** — you will need them in the next step.

### 2. Create the database tables

Open the **SQL Editor** in the Supabase dashboard and run the following:

```sql
create table public.tasks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null,
  completed   boolean not null default false,
  deadline    timestamptz,
  reward      text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.subtasks (
  id          uuid primary key default gen_random_uuid(),
  task_id     uuid not null references public.tasks(id) on delete cascade,
  title       text not null,
  completed   boolean not null default false,
  deadline    timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
```

### 3. Enable Row Level Security

```sql
alter table public.tasks    enable row level security;
alter table public.subtasks enable row level security;

create policy "Users manage own tasks"
  on public.tasks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage subtasks of own tasks"
  on public.subtasks for all
  using (
    exists (
      select 1 from public.tasks
      where tasks.id = subtasks.task_id
        and tasks.user_id = auth.uid()
    )
  );
```

### 4. (Optional) Account deletion RPC

The profile screen exposes a "Delete account" button that calls the `delete_user_account` RPC. To enable it, create the following Postgres function in the SQL Editor:

```sql
create or replace function public.delete_user_account()
returns void
language plpgsql
security definer
as $$
begin
  delete from auth.users where id = auth.uid();
end;
$$;
```

> Without this function the button shows an "unavailable" alert instead of deleting the account — everything else still works fine.

---

## Environment Variables

Create a `.env` file in the project root (next to `package.json`):

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

Both values are available in the Supabase dashboard under **Project Settings → API**.

> The `EXPO_PUBLIC_` prefix exposes the variables to the Expo bundler. Do **not** use the service-role key here.

---

## Installation & Running

```bash
# 1. Clone the repository
git clone <repo-url>
cd motiva

# 2. Install dependencies
npm install

# 3. Add your .env file (see above)

# 4. Start the development server
npx expo start
```

The Metro bundler will open. From there:

| Option | Command |
|---|---|
| Scan QR with Expo Go | Press `s` to switch to Expo Go mode, then scan |
| Android emulator | Press `a` |
| iOS simulator (macOS only) | Press `i` |
| Web browser | Press `w` |

You can also use the dedicated scripts:

```bash
npm run android   # open on Android device / emulator
npm run ios       # open on iOS simulator
npm run web       # open in browser
```

---

## Project Structure

```
motiva/
├── app/                        # Expo Router screens (file-based routing)
│   ├── _layout.tsx             # Root layout — ThemePreferenceProvider, navigation stack
│   ├── index.tsx               # Auth guard — redirects to tabs or login
│   ├── loading.tsx             # Splash / auth-check screen
│   ├── settings.tsx            # Appearance settings (pushed from Profile)
│   ├── (tabs)/
│   │   ├── _layout.tsx         # Bottom tab bar configuration
│   │   ├── index.tsx           # Dashboard screen
│   │   ├── rewards.tsx         # Rewards screen
│   │   └── profile.tsx         # Profile screen
│   └── auth/
│       ├── login.tsx           # Login screen
│       └── register.tsx        # Registration screen
│
├── components/
│   ├── common/                 # Shared UI primitives
│   │   ├── danger-button.tsx
│   │   ├── date-field.tsx      # Tappable date picker field (iOS modal + Android inline)
│   │   ├── form-buttons.tsx    # Cancel / Save row
│   │   ├── labeled-row.tsx     # Row with label + value + optional trailing element
│   │   ├── password-input.tsx  # Text input with eye-toggle
│   │   ├── radio-row.tsx       # Icon + label + checkmark row
│   │   ├── screen-header.tsx   # Consistent header (title + left/right slots)
│   │   └── section-card.tsx    # Rounded surface card with optional title
│   ├── dashboard/              # Task-specific components
│   │   ├── add-subtask-form.tsx
│   │   ├── add-task-form.tsx
│   │   ├── celebration-overlay.tsx  # Confetti + sound + haptic on task completion
│   │   ├── dashboard-header.tsx
│   │   ├── subtask-edit-form.tsx
│   │   ├── subtask-list.tsx
│   │   ├── subtask-row.tsx
│   │   ├── task-card.tsx
│   │   ├── task-card-header.tsx
│   │   ├── task-edit-form.tsx
│   │   └── task-progress.tsx
│   ├── profile/                # Profile-specific components
│   ├── rewards/                # Rewards-specific components
│   ├── settings/               # Theme picker component
│   └── ui/                     # Low-level primitives (IconSymbol, Collapsible)
│
├── constants/
│   ├── theme.ts                # Full color palette (light + dark) and font tokens
│   └── styles.ts               # StyleSheet definitions (BaseStyles, AuthStyles, DashboardStyles)
│
├── features/
│   ├── tasks/
│   │   ├── types.ts            # Task and Subtask TypeScript interfaces
│   │   ├── use-tasks.ts        # All task/subtask Supabase mutations and state
│   │   ├── utils.ts            # getTaskProgress, formatDeadline, sort helpers
│   │   └── celebration.ts      # Lightweight event emitter for celebration triggers
│   ├── profile/
│   │   ├── use-account-actions.ts   # Email/password change, logout, delete account
│   │   └── use-profile-stats.ts     # Fetches task stats for profile screen
│   └── theme/
│       └── theme-preference.tsx     # ThemePreferenceProvider + useThemePreference hook
│
├── hooks/
│   ├── use-color-scheme.ts          # Reads effective color scheme (native)
│   ├── use-color-scheme.web.ts      # Web-safe version (hydration guard)
│   ├── use-theme-color.ts           # Resolves a single color token
│   ├── use-themed-styles.ts         # Merges StyleSheet + theme colors into one object
│   └── useAuth.ts                   # Supabase auth session listener
│
├── lib/
│   └── supabase.ts             # Supabase client (AsyncStorage session persistence)
│
└── assets/
    ├── images/
    └── sounds/
        └── celebrate.wav
```

---

## Architecture Overview

### Data flow

```
Supabase DB
    ↕  (supabase-js)
lib/supabase.ts
    ↕
features/tasks/use-tasks.ts   ← owns all task state + mutations
    ↕
app/(tabs)/index.tsx           ← passes stable callbacks down
    ↓
components/dashboard/task-card.tsx  ← React.memo, curries task.id
    ↓
TaskCardHeader / TaskProgress / SubtaskList / TaskEditForm
```

### Key decisions

- **`use-tasks.ts` as single source of truth** — all Supabase reads and writes live in one hook. Screens and components receive only stable callback references, preventing unnecessary re-renders.
- **`tasksRef`** — a `useRef` mirror of the tasks array lets `useCallback` closures always read the latest list without declaring `tasks` as a dependency (which would recreate every function on every mutation).
- **`React.memo` on `TaskCard`** — each card only re-renders when its own `task` object or the passed callbacks change.
- **Celebration event emitter** (`features/tasks/celebration.ts`) — a module-level `Set` of listeners decouples the `useTasks` hook from `CelebrationOverlay` without needing React Context.

---

## Theming

All colors are defined in `constants/theme.ts` under `Colors.light` and `Colors.dark`. The `useThemedStyles()` hook (from `hooks/use-themed-styles.ts`) merges those tokens with the base `StyleSheet` definitions and returns a single style object. Components import only `useThemedStyles()` or `useThemeColors()` — never raw hex values.

The user's preferred theme (`light` | `dark` | `system`) is persisted to AsyncStorage via `ThemePreferenceProvider` and applied through `useEffectiveColorScheme()`.

### Brand palette

| Token | Light | Dark | Usage |
|---|---|---|---|
| `primary` | `#BF1A2F` | `#BF1A2F` | Progress bar, delete icons, errors |
| `secondary` | `#36749E` | `#4A8BB8` | Edit icons, active tab, links |
| `text` | `#23344A` | `#E6E8E6` | All body text |
| `background` | `#E6E8E6` | `#111820` | Screen background |
| `surface` | `#FFFFFF` | `#23344A` | Cards, tab bar |
| `border` | `#D4D6D4` | `#2E4560` | Dividers, input borders |

---

## Scripts

| Script | Description |
|---|---|
| `npm start` | Start Metro bundler |
| `npm run android` | Open on Android device / emulator |
| `npm run ios` | Open on iOS simulator |
| `npm run web` | Open in browser |
| `npm run lint` | Run ESLint via `expo lint` |
