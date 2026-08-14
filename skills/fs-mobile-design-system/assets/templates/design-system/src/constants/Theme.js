import { light, dark } from "./Colors";
import { Typography } from "./Typography";
import { Spacing, Radius } from "./Spacing";
import { Shadows } from "./Shadows";

export function createTheme(colorScheme) {
  const colors = colorScheme === "dark" ? dark : light;
  return {
    colorScheme,
    colors,
    typography: Typography,
    spacing: Spacing,
    radius: Radius,
    shadows: Shadows,
  };
}
