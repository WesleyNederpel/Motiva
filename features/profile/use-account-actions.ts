import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

import { supabase } from '@/lib/supabase';

interface ChangePasswordInput {
  email: string;
  current: string;
  next: string;
  confirm: string;
}

export function useAccountActions() {
  const router = useRouter();

  const updateEmail = async (currentEmail: string, newEmail: string): Promise<boolean> => {
    const trimmed = newEmail.trim();
    if (trimmed === '') {
      Alert.alert('Error', 'Please enter an email address.');
      return false;
    }
    if (trimmed === currentEmail) {
      Alert.alert('No change', 'That is already your email address.');
      return false;
    }

    const { error } = await supabase.auth.updateUser({ email: trimmed });
    if (error) {
      Alert.alert('Error', error.message);
      return false;
    }

    Alert.alert(
      'Confirmation email sent',
      `A confirmation link has been sent to ${trimmed}. Click the link to finalize the change.`
    );
    return true;
  };

  const changePassword = async ({
    email,
    current,
    next,
    confirm,
  }: ChangePasswordInput): Promise<boolean> => {
    if (!current || !next || !confirm) {
      Alert.alert('Error', 'Please fill in all password fields.');
      return false;
    }
    if (next.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters long.');
      return false;
    }
    if (next !== confirm) {
      Alert.alert('Error', 'New password and confirmation do not match.');
      return false;
    }
    if (next === current) {
      Alert.alert('Error', 'New password must be different from your current password.');
      return false;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: current,
    });
    if (signInError) {
      Alert.alert('Error', 'Current password is incorrect.');
      return false;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: next });
    if (updateError) {
      Alert.alert('Error', updateError.message);
      return false;
    }

    Alert.alert('Password updated', 'Your password has been changed successfully.');
    return true;
  };

  const deleteAccount = async (): Promise<void> => {
    Alert.alert(
      'Delete account',
      'This will permanently delete your account and all associated data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase.rpc('delete_user_account');
            if (error) {
              console.error('delete_user_account RPC error:', error);
              Alert.alert(
                'Unavailable',
                'Account deletion is not yet configured. Please contact support.'
              );
              return;
            }
            await supabase.auth.signOut();
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  const logout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          router.replace('/auth/login');
        },
      },
    ]);
  };

  return { updateEmail, changePassword, deleteAccount, logout };
}
