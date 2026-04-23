import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/theme/ThemeProvider';
import { Navigation } from './src/navigation/index.routes';
import { getDatabase } from './src/database';
import {
  requestNotificationPermission,
  setUpNotificationChannel,
} from './src/services/notificationService';
import { runDailyJob } from './src/services/jobService';

import * as DevMenu from 'expo-dev-menu';
import { ToastProvider } from './src/providers/ToastProvider';
DevMenu.closeMenu();

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function initialize() {
      await getDatabase();
      await setUpNotificationChannel();
      await requestNotificationPermission();

      // Roda o job em background sem bloquear a inicialização
      runDailyJob().catch((error) =>
        console.error('[Job] Erro ao rodar job diário:', error),
      );

      setIsReady(true);
    }

    initialize().catch((error) =>
      console.error('Erro ao inicializar o app:', error),
    );
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle='dark-content' />
      <ThemeProvider>
        <ToastProvider>
          <Navigation />
        </ToastProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
