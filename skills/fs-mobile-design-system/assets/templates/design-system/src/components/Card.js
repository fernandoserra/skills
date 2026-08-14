import { View } from "react-native";
import { useAppTheme } from "../hooks/useAppTheme";

export function Card({ style, elevation = "sm", children, ...rest }) {
  const { colors, spacing, radius, shadows } = useAppTheme();
  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: radius.lg,
          padding: spacing.md,
        },
        shadows[elevation],
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
