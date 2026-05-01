import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { testSupabaseClient, testSupabaseConnection } from '../../lib/test-connection';

export default function TabTwoScreen() {
  const [connectionStatus, setConnectionStatus] = useState<string>('Not tested');
  const [connectionDetails, setConnectionDetails] = useState<string>('');

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    setConnectionStatus('Testing...');
    setConnectionDetails('');

    try {
      // First test if client is initialized
      const clientTest = testSupabaseClient();
      if (!clientTest.success) {
        setConnectionStatus('Client Error');
        setConnectionDetails(clientTest.error || 'Unknown client error');
        return;
      }

      // Then test actual connection
      const result = await testSupabaseConnection();
      if (result.success) {
        setConnectionStatus('Connected');
        setConnectionDetails('Supabase connection is working correctly!');
      } else {
        setConnectionStatus('Failed');
        setConnectionDetails(result.error || 'Connection failed');
      }
    } catch (error) {
      setConnectionStatus('Error');
      setConnectionDetails(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          Explore
        </ThemedText>
      </ThemedView>
      <ThemedText>This app includes example code to help you get started.</ThemedText>
      <Collapsible title="File-based routing">
        <ThemedText>
          This app has two screens:{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
        </ThemedText>
        <ThemedText>
          The layout file in <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{' '}
          sets up the tab navigator.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Android, iOS, and web support">
        <ThemedText>
          You can open this project on Android, iOS, and the web. To open the web version, press{' '}
          <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
        </ThemedText>
      </Collapsible>
      <Collapsible title="Images">
        <ThemedText>
          For static images, you can use the <ThemedText type="defaultSemiBold">@2x</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">@3x</ThemedText> suffixes to provide files for
          different screen densities
        </ThemedText>
        <Image
          source={require('@/assets/images/react-logo.png')}
          style={{ width: 100, height: 100, alignSelf: 'center' }}
        />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Light and dark mode components">
        <ThemedText>
          This template has light and dark mode support. The{' '}
          <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook lets you inspect
          what the user&apos;s current color scheme is, and so you can adjust UI colors accordingly.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Animations">
        <ThemedText>
          This template includes an example of an animated component. The{' '}
          <ThemedText type="defaultSemiBold">components/HelloWave.tsx</ThemedText> component uses
          the powerful{' '}
          <ThemedText type="defaultSemiBold" style={{ fontFamily: Fonts.mono }}>
            react-native-reanimated
          </ThemedText>{' '}
          library to create a waving hand animation.
        </ThemedText>
        {Platform.select({
          ios: (
            <ThemedText>
              The <ThemedText type="defaultSemiBold">components/ParallaxScrollView.tsx</ThemedText>{' '}
              component provides a parallax effect for the header image.
            </ThemedText>
          ),
        })}
      </Collapsible>
      <Collapsible title="Supabase Connection">
        <ThemedText>
          Test your Supabase database connection. The status will update automatically when you open this screen.
        </ThemedText>
        <ThemedView style={{ marginTop: 10, padding: 10, backgroundColor: connectionStatus === 'Connected' ? '#d4edda' : connectionStatus === 'Failed' || connectionStatus === 'Error' ? '#f8d7da' : '#d1ecf1', borderRadius: 5 }}>
          <ThemedText type="defaultSemiBold">Status: {connectionStatus}</ThemedText>
          {connectionDetails && (
            <ThemedText style={{ marginTop: 5 }}>{connectionDetails}</ThemedText>
          )}
        </ThemedView>
        <ThemedText style={{ marginTop: 10 }}>
          <ThemedText type="link" onPress={testConnection}>Test Connection Again</ThemedText>
        </ThemedText>
        <ExternalLink href="https://supabase.com/docs/guides/getting-started">
          <ThemedText type="link">Learn more about Supabase</ThemedText>
        </ExternalLink>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
