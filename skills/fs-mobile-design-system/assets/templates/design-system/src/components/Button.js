import { ActivityIndicator, Pressable, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { useAppTheme } from "../hooks/useAppTheme";

const HEIGHTS = { sm: 36, md: 44, lg: 52 };

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  style,
  ...rest
}) {
  const { colors, spacing, radius } = useAppTheme();
  const isDisabled = disabled || loading;

  const backgroundColor = {
    primary: colors.primary,
    secondary: colors.surface,
    outline: "transparent",
    danger: colors.danger,
  }[variant];

  const textColor = variant === "secondary" || variant === "outline" ? colors.text : colors.primaryText;
  const borderColor = variant === "outline" ? colors.primary : "transparent";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      hitSlop={8}
      onPress={isDisabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.base,
        {
          minHeight: HEIGHTS[size],
          backgroundColor,
          borderColor,
          borderWidth: variant === "outline" ? 1 : 0,
          borderRadius: radius.md,
          paddingHorizontal: spacing.lg,
          opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
        },
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <ThemedText variant="bodyBold" style={{ color: textColor }}>
          {title}
        </ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
  },
});
