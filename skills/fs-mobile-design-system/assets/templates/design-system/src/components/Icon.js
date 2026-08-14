import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../hooks/useAppTheme";

const SIZES = { sm: 16, md: 24, lg: 32 };

export function Icon({ name, size = "md", color, ...rest }) {
  const { colors } = useAppTheme();
  const resolvedSize = typeof size === "number" ? size : SIZES[size];
  return <Ionicons name={name} size={resolvedSize} color={color ?? colors.text} {...rest} />;
}
