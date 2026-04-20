import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import type { MainTabParamList } from '../types';
import HomePage from '../../pages/Home';
import HistoryPage from '../../pages/History';
import { Icon, IconName } from '../../components/Common/Icon';
import { useTheme } from '../../theme/ThemeProvider';
import FABButton from './FAB';

const Tab = createBottomTabNavigator<MainTabParamList>();

type TabRoute = {
  name: keyof MainTabParamList;
  label: string;
  component: React.ComponentType;
  icon: IconName;
  iconFocused: IconName;
};

const tabs: TabRoute[] = [
  {
    name: 'Home',
    label: 'Início',
    icon: 'House',
    iconFocused: 'House',
    component: HomePage,
  },
  {
    name: 'History',
    label: 'Histórico',
    icon: 'Calendar',
    iconFocused: 'Calendar',
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
      <Tab.Screen
        name='Home'
        component={tabs[0].component}
        options={{
          tabBarLabel: tabs[0].label,
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name={focused ? tabs[0].iconFocused : tabs[0].icon}
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name='AddButton'
        component={HomePage}
        options={{
          tabBarLabel: () => null,
          tabBarButton: () => (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FABButton />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name='History'
        component={tabs[1].component}
        options={{
          tabBarLabel: tabs[1].label,
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name={focused ? tabs[1].iconFocused : tabs[1].icon}
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
