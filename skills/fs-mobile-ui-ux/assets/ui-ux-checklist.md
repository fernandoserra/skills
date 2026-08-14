# Checklist de UI/UX para Expo/React Native

Cada control indica cómo se verifica:

- 📄 **estática** — se puede evaluar leyendo código/config.
- 🔍 **visual** — requiere ver la pantalla renderizada (screenshot/simulador vía la skill `run`). Por código solo se puede inferir de forma indirecta.

Algunos controles combinan ambas: hay una señal estática indirecta, pero la confirmación real es visual.

## UX-HIERARCHY (jerarquía visual)

| ID | Verificación | Foco | Qué revisar en Expo/RN |
|---|---|---|---|
| UX-HIERARCHY-1 | 🔍 | El elemento más importante de la pantalla (CTA primario, título) se distingue claramente de los secundarios. | Screenshot: ¿el botón/acción principal resalta por color, tamaño o posición, o compite en el mismo nivel visual que acciones secundarias? |
| UX-HIERARCHY-2 | 📄+🔍 | Un único CTA primario por pantalla (o claramente jerarquizado si hay varios). | Código: contar cuántos `Button`/`TouchableOpacity` con estilo "primario" (mismo color fuerte) aparecen en una misma pantalla. Confirmar con screenshot. |

## UX-SPACING (espaciado y layout)

| ID | Verificación | Foco | Qué revisar en Expo/RN |
|---|---|---|---|
| UX-SPACING-1 | 📄 | Espaciado basado en una escala consistente, no valores sueltos. | Grep de `padding`/`margin`/`gap` en `StyleSheet.create`: ¿se repiten números arbitrarios (7, 13, 22) en vez de una escala (4/8/12/16/24)? ¿Existe un archivo de constantes (ej. `Spacing.js` del preset `classic-stack`) y se usa, o hay valores inline sueltos? |
| UX-SPACING-2 | 🔍 | Densidad visual apropiada — ni elementos apretados sin aire, ni huecos vacíos injustificados. | Screenshot de pantallas con listas/formularios largos. |

## UX-TOUCH (tamaño de botones y áreas táctiles)

| ID | Verificación | Foco | Qué revisar en Expo/RN |
|---|---|---|---|
| UX-TOUCH-1 | 📄 | Área táctil mínima ~44×44pt (iOS HIG) / 48×48dp (Material). | `TouchableOpacity`/`Pressable`/iconos tocables con `padding` bajo y sin `hitSlop`; botones cuyo `height`/`minHeight` en estilos queda por debajo del mínimo. |
| UX-TOUCH-2 | 📄+🔍 | Separación suficiente entre elementos táctiles adyacentes para evitar toques accidentales. | Código: `gap`/`marginRight` entre `TouchableOpacity` consecutivos (ej. iconos en un header). Confirmar densidad real con screenshot. |

## UX-NAV (navegación)

| ID | Verificación | Foco | Qué revisar en Expo/RN |
|---|---|---|---|
| UX-NAV-1 | 📄 | Estructura de navegación predecible, con forma de volver siempre disponible. | Revisar `RootNavigator`/`StackNavigator`/`TabNavigator`/`DrawerNavigator`: pantallas sin header ni back button donde se esperaría uno; `gestureEnabled`/swipe-back deshabilitado sin razón aparente. |
| UX-NAV-2 | 🔍 | Iconografía y etiquetas de navegación consistentes y reconocibles (tabs, drawer). | Screenshot: ¿los íconos de tabs comunican bien su sección? ¿el ítem activo se distingue del resto? |

## UX-STATES (loading, vacío, error)

| ID | Verificación | Foco | Qué revisar en Expo/RN |
|---|---|---|---|
| UX-STATES-1 | 📄 | Todo fetch/acción async muestra un estado de carga visible. | Componentes con `fetch`/`axios`/`useQuery`/similar: ¿existe un estado `loading`/`isLoading` que renderiza `ActivityIndicator`/skeleton, o la pantalla queda en blanco hasta que llega la respuesta? |
| UX-STATES-2 | 📄 | Listas/colecciones vacías muestran un estado dedicado (mensaje, ilustración o CTA), no un espacio en blanco. | `FlatList`/`SectionList`/`.map()` sobre datos: ¿hay `ListEmptyComponent` o un condicional `length === 0` con contenido propio? |
| UX-STATES-3 | 📄 | Errores se comunican de forma clara y accionable al usuario, no solo se loguean. | Bloques `catch`/`.catch()`: ¿actualizan un estado de error visible (mensaje + opción de reintentar), o solo hacen `console.error`/`Alert.alert` genérico tipo "Ocurrió un error"? |

## UX-FEEDBACK (feedback visual de acciones)

| ID | Verificación | Foco | Qué revisar en Expo/RN |
|---|---|---|---|
| UX-FEEDBACK-1 | 📄 | Botones de acción se deshabilitan o muestran loading mientras la request está en curso (evita doble submit). | Handlers de submit: ¿el botón queda tocable durante todo el request, o hay `disabled={isSubmitting}` / spinner? |
| UX-FEEDBACK-2 | 📄 | Confirmación visual tras acciones importantes (guardar, eliminar, enviar). | ¿Hay algún mecanismo de toast/snackbar/`Alert.alert` tras completar acciones, o el usuario no recibe señal de que algo pasó? |

## UX-CONSISTENCY (consistencia)

| ID | Verificación | Foco | Qué revisar en Expo/RN |
|---|---|---|---|
| UX-CONSISTENCY-1 | 📄 | Componentes compartidos reutilizados en vez de reimplementar estilos por pantalla. | ¿Existe una carpeta `components/` con elementos comunes (botones, cards, inputs — ver `ThemedText`/`ThemedView` del preset `classic-stack`), o cada pantalla define su propio `StyleSheet` para lo mismo? |
| UX-CONSISTENCY-2 | 📄 | Colores centralizados en un theme, sin valores hardcodeados sueltos. | Grep de colores hex (`#fff`, `#333`, `rgba(...)`) fuera del archivo de constantes de color (`Colors.js` del preset); si la app soporta dark mode, ¿esos hardcodeados rompen el cambio de tema? |

## UX-TYPOGRAPHY (tipografía)

| ID | Verificación | Foco | Qué revisar en Expo/RN |
|---|---|---|---|
| UX-TYPOGRAPHY-1 | 📄 | Escala tipográfica consistente (tamaños/pesos definidos), no `fontSize` sueltos por pantalla. | Grep de `fontSize:`/`fontWeight:` hardcodeados vs. uso de constantes (`Typography.js` del preset). |

## UX-A11Y (accesibilidad visual)

| ID | Verificación | Foco | Qué revisar en Expo/RN |
|---|---|---|---|
| UX-A11Y-1 | 🔍 | Contraste de color suficiente entre texto y fondo (referencia WCAG AA, ~4.5:1 para texto normal). | Si el par de colores está hardcodeado en el theme, se puede calcular el ratio directamente; si no, evaluar sobre screenshot. |
| UX-A11Y-2 | 📄 | Texto respeta el font-scaling del sistema en vez de bloquearlo. | Uso indiscriminado de `allowFontScaling={false}`; tamaños base de texto de cuerpo por debajo de ~12-14pt. |

## UX-FORMS (formularios)

| ID | Verificación | Foco | Qué revisar en Expo/RN |
|---|---|---|---|
| UX-FORMS-1 | 📄 | Validación con feedback inline (no solo al hacer submit), mensajes de error específicos por campo. | Formularios: ¿validan `onBlur`/`onChange` o solo tras submit? ¿El mensaje de error identifica el campo y qué corregir, o es genérico ("Datos inválidos")? |

## UX-SAFEAREA (safe area / notch)

| ID | Verificación | Foco | Qué revisar en Expo/RN |
|---|---|---|---|
| UX-SAFEAREA-1 | 📄 | Contenido respeta el safe area (notch, home indicator, status bar) sin quedar tapado. | Uso de `SafeAreaView`/`useSafeAreaInsets` de `react-native-safe-area-context` en pantallas raíz vs. `View` plano que puede superponerse con el notch o el home indicator. |

## Resumen de categorías

HIERARCHY, SPACING, TOUCH, NAV, STATES, FEEDBACK, CONSISTENCY, TYPOGRAPHY, A11Y, FORMS, SAFEAREA — 11 categorías, ~19 controles.
