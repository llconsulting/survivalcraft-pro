import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './src/screens/HomeScreen';
import BaseScreen from './src/screens/BaseScreen';
import SkillsScreen from './src/screens/SkillsScreen';
import ARScreen from './src/screens/ARScreen';
import IntelScreen from './src/screens/IntelScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import OfflineMapsScreen from './src/screens/OfflineMapsScreen';
import CampaignScreen from './src/screens/CampaignScreen';

import { TabBarIcon } from './src/components/ui/TabBarIcon';
import { Colors } from './src/theme/colors';
import { useUser } from './src/hooks/useUser';

const Tab = createBottomTabNavigator();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Colors.bg,
    card: Colors.bg,
    primary: Colors.green,
    text: Colors.text,
    border: Colors.border,
    notification: Colors.orange,
  },
};

export default function App() {
  const hydrated = useUser((state) => state.hydrated);
  const hydrate = useUser((state) => state.hydrate);

  useEffect(() => {
    if (!hydrated) void hydrate();
  }, [hydrated, hydrate]);

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navTheme}>
        <StatusBar style="light" translucent backgroundColor="transparent" />
        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: Colors.bg,
              borderTopWidth: 1,
              borderTopColor: Colors.border,
              height: Platform.OS === 'web' ? 64 : 84,
              paddingBottom: Platform.OS === 'web' ? 8 : 20,
              paddingTop: 6,
            },
            tabBarActiveTintColor: Colors.green,
            tabBarInactiveTintColor: Colors.muted,
            tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarIcon: ({ color }) => <TabBarIcon icon="home" color={color} />,
            }}
          />
          <Tab.Screen
            name="Base"
            component={BaseScreen}
            options={{
              title: 'Trail',
              tabBarLabel: 'Trail',
              tabBarIcon: ({ color }) => <TabBarIcon icon="compass" color={color} />,
            }}
          />
          <Tab.Screen
            name="Skills"
            component={SkillsScreen}
            options={{
              tabBarIcon: ({ color }) => <TabBarIcon icon="layer-group" color={color} />,
            }}
          />
          <Tab.Screen
            name="Scan"
            component={ARScreen}
            options={{
              tabBarAccessibilityLabel: 'Field notes',
              tabBarIcon: () => <TabBarIcon icon="book" color={Colors.bg} isCenter />,
              tabBarLabel: () => null,
            }}
          />
          <Tab.Screen
            name="Intel"
            component={IntelScreen}
            options={{
              title: 'Wire',
              tabBarLabel: 'Wire',
              tabBarIcon: ({ color }) => <TabBarIcon icon="satellite-dish" color={color} />,
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              tabBarIcon: ({ color }) => <TabBarIcon icon="user" color={color} />,
            }}
          />
          <Tab.Screen
            name="Offline"
            component={OfflineMapsScreen}
            options={{ tabBarButton: () => null }}
          />
          <Tab.Screen
            name="Campaign"
            component={CampaignScreen}
            options={{
              tabBarButton: () => null,
              tabBarStyle: { display: 'none' },
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
