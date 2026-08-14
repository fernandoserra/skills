import { Modal as RNModal, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../hooks/useAppTheme";

export function Modal({ visible, onClose, children, style }) {
  const { colors, spacing, radius } = useAppTheme();

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityRole="button" accessibilityLabel="Cerrar" />
      <View style={styles.wrapper} pointerEvents="box-none">
        <SafeAreaView style={styles.safe}>
          <View
            style={[
              {
                backgroundColor: colors.background,
                borderRadius: radius.lg,
                padding: spacing.lg,
              },
              style,
            ]}
          >
            {children}
          </View>
        </SafeAreaView>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  wrapper: {
    flex: 1,
    justifyContent: "flex-end",
  },
  safe: {
    width: "100%",
  },
});
