import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColors, useThemedStyles } from '@/hooks/use-themed-styles';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const router = useRouter();
  const styles = useThemedStyles();
  const colors = useThemeColors();

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await supabase.auth.signOut();
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ padding: 20 }}>
        <Text style={[styles.title, { marginBottom: 30 }]}>Settings</Text>

        <View style={styles.section}>
          <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={handleLogout}>
            <IconSymbol size={24} name="arrow.right.square" color={colors.error} />
            <Text style={[styles.menuText, { color: colors.error }]}>Log Out</Text>
            <IconSymbol size={20} name="chevron.right" color={colors.muted} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

