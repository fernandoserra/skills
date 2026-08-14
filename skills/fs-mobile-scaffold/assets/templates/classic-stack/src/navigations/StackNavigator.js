import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Envuelve una o más screens de una misma sección (tab o item del drawer)
// en su propio Stack, para que cada sección tenga su propio historial de navegación.
const Stack = createNativeStackNavigator();

export function StackNavigator({ screens }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {screens.map(({ name, component }) => (
        <Stack.Screen key={name} name={name} component={component} />
      ))}
    </Stack.Navigator>
  );
}
