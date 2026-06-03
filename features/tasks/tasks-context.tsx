import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

import { supabase } from '@/lib/supabase';
import { useTasks } from './use-tasks';

type TasksApi = ReturnType<typeof useTasks>;

interface TasksContextValue extends TasksApi {
  initialized: boolean;
  refresh: () => Promise<void>;
}

const TasksContext = createContext<TasksContextValue | null>(null);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const tasksApi = useTasks();
  const { fetchTasks, reset } = tasksApi;

  const [initialized, setInitialized] = useState(false);
  const [hasUser, setHasUser] = useState<boolean | null>(null);
  const fetchedForUserRef = useRef<string | null>(null);

  // Track auth state to decide when to (re)fetch or clear.
  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setHasUser(!!session?.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const userId = session?.user?.id ?? null;
      setHasUser(!!userId);
      if (!userId) {
        // Sign-out: clear cached tasks so the next user starts clean.
        fetchedForUserRef.current = null;
        reset();
        setInitialized(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [reset]);

  // Drive the initial fetch off the auth state.
  useEffect(() => {
    if (hasUser === null) return; // auth state not resolved yet

    if (!hasUser) {
      // No user → nothing to fetch, but the app is "ready" to show the auth screen.
      setInitialized(true);
      return;
    }

    let cancelled = false;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (cancelled || !user) return;
      if (fetchedForUserRef.current === user.id) return;
      fetchedForUserRef.current = user.id;
      await fetchTasks({ silent: true });
      if (!cancelled) setInitialized(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [hasUser, fetchTasks]);

  const refresh = useCallback(async () => {
    await fetchTasks({ silent: true });
  }, [fetchTasks]);

  return (
    <TasksContext.Provider value={{ ...tasksApi, initialized, refresh }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasksContext(): TasksContextValue {
  const ctx = useContext(TasksContext);
  if (!ctx) {
    throw new Error('useTasksContext must be used within a TasksProvider');
  }
  return ctx;
}
