import { Platform } from "react-native";

const elevation = (level) =>
  Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: level },
      shadowOpacity: 0.1 + level * 0.02,
      shadowRadius: level * 2,
    },
    android: { elevation: level },
    default: {},
  });

export const Shadows = {
  none: elevation(0),
  sm: elevation(2),
  md: elevation(4),
  lg: elevation(8),
};
