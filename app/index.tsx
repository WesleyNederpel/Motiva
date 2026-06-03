import { useTasksContext } from '@/features/tasks/tasks-context';
import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';
import { useEffect } from 'react';
import LoadingScreen from './loading';

export default function Index() {
  const { user, loading: authLoading } = useAuth();
  const { initialized } = useTasksContext();

  // Ready when auth has resolved AND, if signed in, tasks have been fetched.
  const ready = !authLoading && (user ? initialized : true);

  useEffect(() => {
    if (ready) {
      if (user) {
        router.replace('/(tabs)');
      } else {
        router.replace('/auth/login');
      }
    }
  }, [ready, user]);

  if (!ready) {
    return <LoadingScreen />;
  }

  return null;
}
