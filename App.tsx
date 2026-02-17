import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import BaseScreen from './src/screens/BaseScreen';
import SkillsScreen from './src/screens/SkillsScreen';
import ARScreen from './src/screens/ARScreen';
import IntelScreen from './src/screens/IntelScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import OfflineMapsScreen from './src/screens/OfflineMapsScreen';

import { TabBarIcon } from './src/components/ui/TabBarIcon';
import { Colors } from './src/theme/colors';
import { useUser } from './src/hooks/useUser';

const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();

export default function App() {
  const { hydrated, hydrate } = useUser();

  useEffect(() => {
    if (!hydrated) hydrate();
  }, [hydrated, hydrate]);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer theme={DarkTheme}>
          <StatusBar style="light" translucent backgroundColor="transparent" />
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarStyle: {
                backgroundColor: 'rgba(0,0,0,0.92)',
                borderTopWidth: 0.5,
                borderTopColor: Colors.border,
                height: 84,
                paddingBottom: 20,
              },
              tabBarActiveTintColor: Colors.green,
              tabBarInactiveTintColor: Colors.muted,
            }}
          >
            <Tab.Screen
              name="Base"
              component={BaseScreen}
              options={{ tabBarIcon: ({ color }) => <TabBarIcon icon="compass" color={color} /> }}
            />
            <Tab.Screen
              name="Skills"
              component={SkillsScreen}
              options={{ tabBarIcon: ({ color }) => <TabBarIcon icon="layer-group" color={color} /> }}
            />
            <Tab.Screen
              name="Scan"
              component={ARScreen}
              options={{
                tabBarIcon: () => <TabBarIcon icon="camera" color={Colors.green} isCenter />,
                tabBarLabel: () => null,
              }}
            />
            <Tab.Screen
              name="Intel"
              component={IntelScreen}
              options={{ tabBarIcon: ({ color }) => <TabBarIcon icon="satellite-dish" color={color} /> }}
            />
            <Tab.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ tabBarIcon: ({ color }) => <TabBarIcon icon="user-shield" color={color} /> }}
            />
            {/* hidden route, accessible from Base quick grid */}
            <Tab.Screen
              name="Offline"
              component={OfflineMapsScreen}
              options={{
                tabBarButton: () => null,
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
