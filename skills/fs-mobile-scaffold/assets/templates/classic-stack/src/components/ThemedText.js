import { Text } from "react-native";
import { useAppTheme } from "../hooks/useAppTheme";

export function ThemedText({ style, variant = "body", muted = false, ...rest }) {
  const { colors, typography } = useAppTheme();
  const color = muted ? colors.textMuted : colors.text;
  return <Text style={[typography[variant], { color }, style]} {...rest} />;
}
