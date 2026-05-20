import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AccountInfoCard } from '@/components/profile/account-info-card';
import { AvatarHero } from '@/components/profile/avatar-hero';
import { AVATAR_COSTS, AvatarPicker } from '@/components/profile/avatar-picker';
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
  const [points, setPoints] = useState<number>(0);
  const [unlockedAvatars, setUnlockedAvatars] = useState<string[]>([]);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadUser = async () => {
      await supabase.auth.refreshSession();
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      setEmail(data.user?.email ?? null);
      setMemberSince(data.user?.created_at ?? null);
      setAvatar(data.user?.user_metadata?.avatar ?? null);
      setPoints(data.user?.user_metadata?.points ?? 0);
      setUnlockedAvatars(data.user?.user_metadata?.unlockedAvatars ?? []);
      setLoading(false);
    };
    loadUser();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setEmail(session?.user?.email ?? null);
      setMemberSince(session?.user?.created_at ?? null);
      setAvatar(session?.user?.user_metadata?.avatar ?? null);
      setPoints(session?.user?.user_metadata?.points ?? 0);
      setUnlockedAvatars(session?.user?.user_metadata?.unlockedAvatars ?? []);
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

  const handleBuyAvatar = async (emoji: string) => {
    const { data } = await supabase.auth.getUser();
    const currentPoints: number = data.user?.user_metadata?.points ?? 0;
    const currentUnlocked: string[] = data.user?.user_metadata?.unlockedAvatars ?? [];
    const cost: number = AVATAR_COSTS[emoji] ?? 0;

    if (currentPoints < cost) return;

    const newPoints = currentPoints - cost;
    const newUnlocked = [...currentUnlocked, emoji];

    await supabase.auth.updateUser({
      data: { points: newPoints, unlockedAvatars: newUnlocked, avatar: emoji },
    });

    setPoints(newPoints);
    setUnlockedAvatars(newUnlocked);
    setAvatar(emoji);
    setPickerVisible(false);
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
                points={points}
                onPress={() => setPickerVisible(true)}
              />
              <StatsCard memberSince={memberSince} points={points} />
              <AccountInfoCard email={email} />
              <DangerZone />
            </>
          )}
        </ScrollView>
      </ThemedView>

      <AvatarPicker
        visible={pickerVisible}
        current={avatar}
        points={points}
        unlockedAvatars={unlockedAvatars}
        onSelect={handleSelectAvatar}
        onBuy={handleBuyAvatar}
        onClose={() => setPickerVisible(false)}
      />
    </SafeAreaView>
  );
}
