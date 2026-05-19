import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';
import { useEffect } from 'react';
import LoadingScreen from './loading';

export default function Index() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/(tabs)');
      } else {
        router.replace('/auth/login');
      }
    }
  }, [user, loading]);

  if (loading) {
    return <LoadingScreen />;
  }

  return null;
}
