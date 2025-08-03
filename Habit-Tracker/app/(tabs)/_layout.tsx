import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

export default function TabsLayout() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: '#f5f5f5' },
          headerShadowVisible: false,
          tabBarStyle: {
            backgroundColor: '#f5f5f5',
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarActiveTintColor: '#6200ee',
          tabBarInactiveTintColor: '#666666',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Today's Habit",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="calendar-today" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="streaks"
          options={{
            title: 'Streaks',
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="chart-line" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="addhabit"
          options={{
            title: 'Add habit',
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="plus-circle" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});