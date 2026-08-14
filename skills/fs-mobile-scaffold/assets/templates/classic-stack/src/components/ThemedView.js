import { View } from "react-native";
import { useAppTheme } from "../hooks/useAppTheme";

export function ThemedView({ style, surface = false, ...rest }) {
  const { colors } = useAppTheme();
  const backgroundColor = surface ? colors.surface : colors.background;
  return <View style={[{ backgroundColor }, style]} {...rest} />;
}
