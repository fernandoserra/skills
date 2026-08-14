import { useColorScheme } from "react-native";
import { createTheme } from "../constants/Theme";

export function useAppTheme() {
  const colorScheme = useColorScheme();
  return createTheme(colorScheme);
}
