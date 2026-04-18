import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '../types';
import HomePage from '../../pages/Home';
import HistoryPage from '../../pages/History';
import { Icon, IoniconsName } from '../../components/Common/Icon';
import { useTheme } from '../../theme/ThemeProvider';
import { View } from 'react-native';

const Tab = createBottomTabNavigator<MainTabParamList>();

type TabRoute = {
  name: keyof MainTabParamList;
  label: string;
  component: React.ComponentType;
  icon: IoniconsName;
  iconFocused: IoniconsName;
};

const tabs: TabRoute[] = [
  {
    name: 'Home',
    label: 'Início',
    icon: 'home-outline',
    iconFocused: 'home',
    component: HomePage,
  },
  {
    name: 'History',
    label: 'Histórico',
    icon: 'calendar-outline',
    iconFocused: 'calendar',
    component: HistoryPage,
  },
];

export default function TabNavigator() {
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background.primary,
          borderTopColor: colors.border.default,
          borderTopWidth: 1,
          paddingBottom: spacing.sm,
          paddingTop: spacing.sm,
        },
        tabBarActiveTintColor: colors.primary[500],
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarLabelStyle: {
          fontSize: typography.sizes.caption,
          fontWeight: typography.weights.medium,
          marginTop: 2,
        },
      }}
    >
      {tabs.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            tabBarLabel: tab.label,
            tabBarIcon: ({ color, focused }) => (
              <View>
                <Icon
                  name={focused ? tab.iconFocused : tab.icon}
                  size={22}
                  color={color}
                />
              </View>
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}
