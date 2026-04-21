import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/theme/ThemeProvider';
import { Navigation } from './src/navigation/index.routes';
import { getDatabase } from './src/database';

export default function App() {
  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    getDatabase()
      .then(() => setIsDbReady(true))
      .catch((error) =>
        console.error('Erro ao inicializar banco de dados:', error),
      );
  }, []);

  if (!isDbReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Navigation />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
