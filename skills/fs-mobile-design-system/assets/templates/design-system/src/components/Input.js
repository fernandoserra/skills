import { useState } from "react";
import { TextInput, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { useAppTheme } from "../hooks/useAppTheme";

export function Input({ label, error, style, onFocus, onBlur, ...rest }) {
  const { colors, spacing, radius, typography } = useAppTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = error ? colors.danger : focused ? colors.primary : colors.border;

  return (
    <View style={{ marginBottom: spacing.md }}>
      {label && (
        <ThemedText variant="caption" style={{ marginBottom: spacing.xs }}>
          {label}
        </ThemedText>
      )}
      <TextInput
        placeholderTextColor={colors.textMuted}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[
          typography.body,
          {
            color: colors.text,
            borderColor,
            borderWidth: 1,
            borderRadius: radius.md,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            minHeight: 44,
          },
          style,
        ]}
        {...rest}
      />
      {error && (
        <ThemedText variant="caption" style={{ color: colors.danger, marginTop: spacing.xs }}>
          {error}
        </ThemedText>
      )}
    </View>
  );
}
