# Checklist de responsive/adaptabilidad para Expo/React Native

Cada control indica cómo se verifica:

- 📄 **estática** — se puede evaluar leyendo código/config.
- 🔍 **visual** — requiere ver la app corriendo en un simulador/dispositivo concreto (vía la skill `run`). Por código solo se puede inferir de forma indirecta.

## RESP-PHONE (distintos tamaños de teléfono)

| ID | Verificación | Foco | Qué revisar en Expo/RN |
|---|---|---|---|
| RESP-PHONE-1 | 📄 | El layout no asume un ancho/alto de pantalla fijo. | Grep de `width:`/`height:` con números fijos en `StyleSheet.create` para contenedores de layout (no para íconos chicos), en vez de `flex`, `%`, `aspectRatio` o `useWindowDimensions()`. |
| RESP-PHONE-2 | 📄 | Imágenes/medios escalan de forma relativa, no con tamaños fijos en pt. | Uso de `resizeMode` + `aspectRatio`/`flex` en `Image` vs. `width`/`height` fijos que se ven distinto en pantallas chicas y grandes. |
| RESP-PHONE-3 | 🔍 | No hay overflow, texto cortado ni elementos tapados en los extremos del espectro de tamaños. | Screenshot en un modelo chico (iPhone SE / Android compacto) y uno grande (iPhone Pro Max) de las pantallas con más contenido. |

## RESP-TABLET (tablets)

| ID | Verificación | Foco | Qué revisar en Expo/RN |
|---|---|---|---|
| RESP-TABLET-1 | 📄 | Existe algún manejo de breakpoint por ancho para adaptar el layout en pantallas grandes. | Uso de `useWindowDimensions().width` (o `Platform.isPad`) para cambiar columnas/densidad, vs. el mismo layout de teléfono forzado en tablet. |
| RESP-TABLET-2 | 📄 | Listas largas adaptan la cantidad de columnas al ancho disponible. | `FlatList`/`SectionList` con `numColumns` fijo en `1` en vez de calculado por ancho. |
| RESP-TABLET-3 | 🔍 | El contenido no queda incómodamente estirado en pantallas grandes (ej. formularios ocupando todo el ancho de un iPad). | Screenshot en iPad y/o tablet Android de pantallas con formularios, listas y detalle. |

## RESP-ORIENTATION (orientación)

| ID | Verificación | Foco | Qué revisar en Expo/RN |
|---|---|---|---|
| RESP-ORIENTATION-1 | 📄 | Si la app permite rotar (`orientation: "default"` en `app.config.js`/`app.json`), las pantallas reaccionan al cambio de dimensiones. | Uso de `useWindowDimensions()` (reactivo) vs. `Dimensions.get("window")` leído una sola vez al montar (queda con el valor viejo tras rotar). |
| RESP-ORIENTATION-2 | 🔍 | El layout no se desborda ni corta contenido en landscape. | Rotar el simulador en las pantallas principales y confirmar que no hay overflow ni elementos inaccesibles. |

## RESP-SAFEAREA (safe areas)

| ID | Verificación | Foco | Qué revisar en Expo/RN |
|---|---|---|---|
| RESP-SAFEAREA-1 | 📄 | Pantallas raíz usan `useSafeAreaInsets()`/`SafeAreaView` de `react-native-safe-area-context` tanto para el borde superior como el inferior. | Buscar pantallas que solo resuelven el top (status bar) y dejan contenido pegado al borde inferior sin considerar `insets.bottom`. |
| RESP-SAFEAREA-2 | 📄 | No hay valores fijos "a ojo" para esquivar el notch/status bar. | Grep de `paddingTop:`/`top:` con números mágicos (ej. `44`, `20`, `47`) en vez de `insets.top`. |
| RESP-SAFEAREA-3 | 📄 | Elementos flotantes (botón fijo abajo, tab bar custom) restan el inset inferior. | Componentes posicionados con `position: "absolute", bottom: 0` sin sumar `insets.bottom` — quedan tapados por el home indicator (iOS) o la barra de gestos (Android). |

## RESP-NOTCH-DYNAMICISLAND (notch / Dynamic Island)

| ID | Verificación | Foco | Qué revisar en Expo/RN |
|---|---|---|---|
| RESP-NOTCH-DYNAMICISLAND-1 | 📄+🔍 | El inset superior se calcula de forma dinámica, no con un número fijo pensado para el notch "clásico". | Mismo patrón que `RESP-SAFEAREA-2`, pero confirmar específicamente en un simulador de iPhone 14 Pro+ (Dynamic Island) que el contenido no queda tapado ni con espacio de más comparado con un iPhone con notch clásico o sin notch. |
| RESP-NOTCH-DYNAMICISLAND-2 | 🔍 | Contenido cerca del status bar no se superpone cuando el Dynamic Island se agranda (llamada activa, grabación de pantalla, actividad en vivo). | Screenshot con una Live Activity/indicador activo simulado si la app tiene pantallas con elementos pegados al borde superior. |

## RESP-KEYBOARD (teclado)

| ID | Verificación | Foco | Qué revisar en Expo/RN |
|---|---|---|---|
| RESP-KEYBOARD-1 | 📄 | Pantallas con formularios manejan la aparición del teclado. | Uso de `KeyboardAvoidingView` con `behavior="padding"` en iOS / `"height"` o control manual en Android (o una librería equivalente como `react-native-keyboard-controller`). |
| RESP-KEYBOARD-2 | 📄 | El offset del teclado considera el header/safe area en vez de un valor fijo pensado para un solo modelo. | `keyboardVerticalOffset` hardcodeado (ej. `80`) vs. calculado a partir del alto real del header + `insets.top`. |
| RESP-KEYBOARD-3 | 🔍 | El input activo queda visible al abrir el teclado. | Simulador con teclado abierto en un formulario largo, en un modelo con safe area grande (ej. iPhone Pro Max). |

## Resumen de categorías

PHONE, TABLET, ORIENTATION, SAFEAREA, NOTCH-DYNAMICISLAND, KEYBOARD — 6 categorías, 15 controles.

## Set mínimo de simuladores recomendado para la pasada visual

Para no correr un simulador por cada control 🔍 por separado, usar este set base (vía la skill `run`) y cubrir los distintos controles visuales en la misma tanda de screenshots:

- **iPhone SE** (pantalla chica, sin notch) — referencia de espacio mínimo.
- **iPhone 15/16 Pro Max** (Dynamic Island) — referencia de espacio máximo + notch dinámico.
- **iPad** (cualquier modelo reciente) — tablet iOS.
- **Android compacto** (ej. Pixel 4a o equivalente en el emulador) — fragmentación Android.
- **Android tablet** (perfil de tablet en el emulador) — tablet Android.
