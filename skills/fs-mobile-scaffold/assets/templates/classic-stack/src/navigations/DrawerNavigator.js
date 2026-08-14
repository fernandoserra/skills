import { createDrawerNavigator } from "@react-navigation/drawer";
import { TabNavigator } from "./TabNavigator";

const Drawer = createDrawerNavigator();

export function DrawerNavigator() {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="Main" component={TabNavigator} />
      {/* Sumar acá las secciones exclusivas del drawer (Configuración, Perfil, etc.) */}
    </Drawer.Navigator>
  );
}
