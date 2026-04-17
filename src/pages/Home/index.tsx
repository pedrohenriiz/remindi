import { Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { StatusBar } from 'expo-status-bar';
import { Icon } from '../../components/Common/Icon';
import { StatusBadge } from '../../components/StatusBadge';

export default function Home() {
  const { theme } = useTheme();

  return (
    <View
      style={{
        backgroundColor: theme.colors.error[500],
      }}
    >
      <Text>Open up App.tsx to start working on your app 31231!</Text>
      <StatusBar style='auto' />
      <Icon name='accessibility' color={theme.colors.secondary[700]} />
    </View>
  );
}
