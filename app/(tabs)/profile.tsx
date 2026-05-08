import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AccountInfoCard } from '@/components/profile/account-info-card';
import { DangerZone } from '@/components/profile/danger-zone';
import { ProfileHeader } from '@/components/profile/profile-header';
import { StatsCard } from '@/components/profile/stats-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemedStyles } from '@/hooks/use-themed-styles';
import { supabase } from '@/lib/supabase';

export default function ProfileScreen() {
  const styles = useThemedStyles();
  const [email, setEmail] = useState<string | null>(null);
  const [memberSince, setMemberSince] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      setEmail(data.user?.email ?? null);
      setMemberSince(data.user?.created_at ?? null);
      setLoading(false);
    };
    loadUser();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setEmail(session?.user?.email ?? null);
      setMemberSince(session?.user?.created_at ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.innerContainer}>
        <ProfileHeader />
        <ScrollView showsVerticalScrollIndicator={false}>
          {loading || !email ? (
            <ThemedView style={styles.emptyState}>
              <ThemedText style={styles.emptyText}>Loading profile…</ThemedText>
            </ThemedView>
          ) : (
            <>
              <AccountInfoCard email={email} />
              <StatsCard memberSince={memberSince} />
              <DangerZone />
            </>
          )}
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}
