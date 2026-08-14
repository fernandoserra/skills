# WCAG 2.1/2.2 AA — checklist de trabajo de accesibilidad para Expo/React Native

**Importante:** las columnas "Foco" son una interpretación de trabajo de cada criterio de éxito (WCAG, aplicado a mobile), no una cita textual — si el usuario pide el texto oficial de un criterio, verificarlo con `WebFetch` sobre `https://www.w3.org/WAI/WCAG21/Understanding/<criterio>`.

Cada control indica cómo se verifica:

- 📄 **estática** — se puede evaluar leyendo código.
- 🔍 **runtime** — el código puede dar una señal (props presentes/ausentes), pero la confirmación real requiere recorrer la pantalla con VoiceOver (iOS) o TalkBack (Android) activados, o ver un screenshot con configuración de accesibilidad del sistema activada (texto grande, etc.).

Marcar como ✅ solo lo que se puede confirmar de verdad. Un control 🔍 sin haber corrido el screen reader real se reporta como 🔍 pendiente, nunca como ✅.

## A11Y-LABELS (etiquetas)

| ID | WCAG | Verificación | Foco | Qué revisar en Expo/RN |
|---|---|---|---|---|
| A11Y-LABELS-1 | 1.1.1 Non-text Content | 📄 | Elementos interactivos e imágenes con significado tienen un nombre accesible. | `TouchableOpacity`/`Pressable`/`Image` sin texto visible como hijo y sin `accessibilityLabel` (íconos solos, botones de solo-ícono, imágenes que comunican información). |
| A11Y-LABELS-2 | 4.1.2 Name, Role, Value | 📄 | Componentes custom que actúan como controles (botón, switch, checkbox hechos con `View`+`onPress`) exponen `accessibilityRole` y, si aplica, `accessibilityState`. | Grep de `View` con `onPress`/`onTouchEnd` sin `accessible={true}` ni `accessibilityRole`; toggles/checkboxes custom sin `accessibilityState={{ checked }}`. |

## A11Y-SCREENREADER (VoiceOver / TalkBack)

| ID | WCAG | Verificación | Foco | Qué revisar en Expo/RN |
|---|---|---|---|---|
| A11Y-SCREENREADER-1 | 4.1.2 Name, Role, Value | 📄+🔍 | Elementos interactivos son enfocables por el screen reader y anuncian su propósito al enfocarse. | Código: presencia de `accessible`/`accessibilityRole`/`accessibilityLabel` (ver LABELS). Runtime: recorrer la pantalla con VoiceOver/TalkBack y confirmar que cada control se anuncia con nombre + rol correctos. |
| A11Y-SCREENREADER-2 | 2.4.3 Focus Order | 🔍 | El orden en que el screen reader lee la pantalla coincide con el orden visual/lógico. | Señal estática: orden del JSX vs. uso de `position: absolute`, `flexDirection: "row-reverse"` o `zIndex` que puede desordenar la lectura respecto a lo visual. Confirmación real requiere swipe con VoiceOver/TalkBack. |
| A11Y-SCREENREADER-3 | 1.3.1 Info and Relationships | 📄 | Elementos puramente decorativos quedan fuera del árbol de accesibilidad, para no "ensuciar" la lectura. | Íconos/imágenes decorativas sin `accessible={false}` (iOS) / `importantForAccessibility="no-hide-descendants"` (Android) cuando no aportan información. |
| A11Y-SCREENREADER-4 | 2.4.3 Focus Order | 📄+🔍 | Modales/overlays atrapan el foco del screen reader mientras están abiertos (no se puede navegar "detrás"). | `Modal` de RN sin `accessibilityViewIsModal` (iOS); confirmar en runtime que VoiceOver no llega a elementos de la pantalla de atrás mientras el modal está visible. |

## A11Y-DYNAMICTYPE (Dynamic Type / escalado de fuente)

| ID | WCAG | Verificación | Foco | Qué revisar en Expo/RN |
|---|---|---|---|---|
| A11Y-DYNAMICTYPE-1 | 1.4.4 Resize Text | 📄 | El texto no bloquea el escalado de fuente del sistema. | Uso de `allowFontScaling={false}` en `Text` de contenido real (aceptable en logos/marca, no en texto de lectura). |
| A11Y-DYNAMICTYPE-2 | 1.4.4 Resize Text | 🔍 | El layout no se rompe (texto cortado, superpuesto, botones sin espacio) con tamaños de fuente grandes. | Screenshot con la configuración de texto grande del sistema activada (Ajustes → Accesibilidad → Texto más grande, o el emulador de Android con fuente XL). |

## A11Y-CONTRAST (contraste)

| ID | WCAG | Verificación | Foco | Qué revisar en Expo/RN |
|---|---|---|---|---|
| A11Y-CONTRAST-1 | 1.4.3 Contrast (Minimum) | 📄+🔍 | Contraste texto/fondo ≥4.5:1 (texto normal) o ≥3:1 (texto grande, ≥18pt o ≥14pt bold). | Si los colores están en tokens (`Colors.js`), calcular el ratio directo entre `text`/`background` y `textMuted`/`background`. Si el color viene de una imagen o mezcla dinámica, confirmar con screenshot. |
| A11Y-CONTRAST-2 | 1.4.11 Non-text Contrast | 📄+🔍 | Bordes de inputs, íconos funcionales e indicadores de estado tienen contraste ≥3:1 contra su fondo. | Tokens de `border`/`primary` usados en inputs y controles vs. `background`/`surface`. |

## A11Y-TOUCH (áreas táctiles)

| ID | WCAG | Verificación | Foco | Qué revisar en Expo/RN |
|---|---|---|---|---|
| A11Y-TOUCH-1 | 2.5.5 Target Size (Enhanced) / 2.5.8 Target Size (Minimum) | 📄 | Área táctil mínima ~44×44pt. | `TouchableOpacity`/`Pressable` con `padding`/`minHeight`/`minWidth` por debajo del mínimo y sin `hitSlop` que lo compense. |
| A11Y-TOUCH-2 | 2.5.2 Pointer Cancellation | 📄 | Acciones irreversibles/destructivas no se disparan al iniciar el toque, sino al completarlo (y son cancelables). | Uso de `onPressIn`/`onTouchStart` (en vez de `onPress`) para disparar acciones como eliminar, confirmar compra, enviar. |

## A11Y-NAV (navegación por accesibilidad)

| ID | WCAG | Verificación | Foco | Qué revisar en Expo/RN |
|---|---|---|---|---|
| A11Y-NAV-1 | 2.4.3 Focus Order | 🔍 | El orden de foco al navegar (tab, swipe de screen reader) es lógico y consistente entre pantallas similares. | Confirmar en runtime con VoiceOver/TalkBack sobre las pantallas principales. |
| A11Y-NAV-2 | 3.2.4 Consistent Identification | 📄+🔍 | Mismos íconos/patrones de navegación cumplen siempre la misma función en toda la app (relevante para quien navega por nombre/rol, no por apariencia). | Comparar `accessibilityLabel` de íconos de navegación repetidos (ej. ícono de "volver", de "buscar") entre distintas pantallas — deberían tener el mismo label. |

## A11Y-MOTION (movimiento reducido)

| ID | WCAG | Verificación | Foco | Qué revisar en Expo/RN |
|---|---|---|---|---|
| A11Y-MOTION-1 | 2.3.3 Animation from Interactions (buena práctica, AAA) | 📄 | Animaciones no esenciales respetan la preferencia de movimiento reducido del sistema. | Uso de `Animated`/`react-native-reanimated` sin chequear `AccessibilityInfo.isReduceMotionEnabled()` / `useReducedMotion()` antes de animar transiciones grandes (parallax, autoplay, transiciones de pantalla completa). |

## A11Y-FORMS (formularios accesibles)

| ID | WCAG | Verificación | Foco | Qué revisar en Expo/RN |
|---|---|---|---|---|
| A11Y-FORMS-1 | 3.3.1 Error Identification + 4.1.3 Status Messages | 📄 | Errores de formulario se anuncian al screen reader (no solo se muestran visualmente en rojo). | Manejo de errores de inputs: ¿el mensaje de error usa `accessibilityLiveRegion="polite"` / `AccessibilityInfo.announceForAccessibility(...)`, o el foco se mueve al primer campo inválido, o el usuario con screen reader no se entera de que falló? |

## A11Y-LIVEREGION (contenido dinámico)

| ID | WCAG | Verificación | Foco | Qué revisar en Expo/RN |
|---|---|---|---|---|
| A11Y-LIVEREGION-1 | 4.1.3 Status Messages | 📄 | Cambios de estado importantes (carga terminada, error, confirmación de acción) se anuncian al screen reader, no solo se muestran visualmente. | Estados de loading/éxito/error (ver también `UX-STATES` de `fs-mobile-ui-ux`) sin `accessibilityLiveRegion` ni `AccessibilityInfo.announceForAccessibility` — el cambio es mudo para quien usa VoiceOver/TalkBack. |

## Resumen de categorías

LABELS, SCREENREADER, DYNAMICTYPE, CONTRAST, TOUCH, NAV, MOTION, FORMS, LIVEREGION — 9 categorías, 16 controles. La mayoría de `SCREENREADER` y `NAV`, y parte de `DYNAMICTYPE`/`CONTRAST`, requieren confirmación 🔍 con VoiceOver/TalkBack real o screenshot con configuración de accesibilidad activada — no se pueden dar por ✅ solo con lectura de código.
