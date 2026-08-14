import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAppTheme } from "../hooks/useAppTheme";
import { StackNavigator } from "./StackNavigator";
import HomeScreen from "../../screens/HomeScreen"; // placeholder — reemplazar por las screens reales

const Tab = createBottomTabNavigator();

export function TabNavigator({ openDrawer }) {
  const { colors } = useAppTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.border },
      }}
    >
      <Tab.Screen name="Inicio">
        {() => <StackNavigator screens={[{ name: "Home", component: HomeScreen }]} />}
      </Tab.Screen>
      {/* Sumar acá el resto de los tabs. Un tab "Menú" puede usar `listeners`
          para llamar `openDrawer()` en vez de navegar, como en el patrón original. */}
    </Tab.Navigator>
  );
}
