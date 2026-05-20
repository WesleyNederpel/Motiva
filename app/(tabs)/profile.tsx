import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AccountInfoCard } from '@/components/profile/account-info-card';
import { AvatarHero } from '@/components/profile/avatar-hero';
import { AvatarPicker } from '@/components/profile/avatar-picker';
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
  const [avatar, setAvatar] = useState<string | null>(null);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      setEmail(data.user?.email ?? null);
      setMemberSince(data.user?.created_at ?? null);
      setAvatar(data.user?.user_metadata?.avatar ?? null);
      setLoading(false);
    };
    loadUser();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setEmail(session?.user?.email ?? null);
      setMemberSince(session?.user?.created_at ?? null);
      setAvatar(session?.user?.user_metadata?.avatar ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const handleSelectAvatar = async (selected: string) => {
    setPickerVisible(false);
    setAvatar(selected);
    await supabase.auth.updateUser({ data: { avatar: selected } });
  };

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
              <AvatarHero
                avatar={avatar}
                email={email}
                onPress={() => setPickerVisible(true)}
              />
              <StatsCard memberSince={memberSince} />
              <AccountInfoCard email={email} />
              <DangerZone />
            </>
          )}
        </ScrollView>
      </ThemedView>

      <AvatarPicker
        visible={pickerVisible}
        current={avatar}
        onSelect={handleSelectAvatar}
        onClose={() => setPickerVisible(false)}
      />
    </SafeAreaView>
  );
}
