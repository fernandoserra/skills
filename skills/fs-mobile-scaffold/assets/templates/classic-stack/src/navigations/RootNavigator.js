import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import { DrawerNavigator } from "./DrawerNavigator";
import LoginScreen from "../../screens/LoginScreen"; // placeholder — reemplazar por la screen real

const Root = createNativeStackNavigator();

export function RootNavigator() {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return null; // reemplazar por un splash/loading screen si hace falta

  return (
    <NavigationContainer>
      <Root.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Root.Screen name="App" component={DrawerNavigator} />
        ) : (
          <Root.Screen name="Login" component={LoginScreen} />
        )}
      </Root.Navigator>
    </NavigationContainer>
  );
}
