# Referencia de tokens y componentes — fs-mobile-design-system

Para cada categoría: el valor/estructura por defecto que scaffoldea el modo generar, y qué buscar en modo auditar para detectar drift (valores sueltos o componentes reimplementados en vez de usar la capa compartida).

## Colores

Fuente: `src/constants/Colors.js` (tokens `light`/`dark`: `background`, `surface`, `border`, `text`, `textMuted`, `primary`, `primaryText`, `accent`, `danger`, `success`).

Auditar: grep de literales hex (`#[0-9a-fA-F]{3,8}`) o `rgba(...)` fuera de `Colors.js`. Cada hallazgo debería resolver a un token existente o señalar que falta uno (ej. un color de marca secundario no contemplado).

## Tipografía

Fuente: `src/constants/Typography.js` (`h1`, `h2`, `h3`, `body`, `bodyBold`, `caption`).

Auditar: grep de `fontSize:`/`fontWeight:` hardcodeados en `StyleSheet.create` fuera de `Typography.js`, o texto renderizado con `<Text style={{ fontSize: N }}>` en vez de `<ThemedText variant="...">`.

## Spacing

Fuente: `src/constants/Spacing.js` → `Spacing` (`xs:4, sm:8, md:16, lg:24, xl:32, xxl:48`).

Auditar: grep de `padding`/`margin`/`gap` con números literales que no sean 0 y no vengan de `spacing.*`/`Spacing.*`. Valores que no calzan con la escala (ej. `13`, `7`, `22`) son la señal más clara de drift.

## Radius

Fuente: `src/constants/Spacing.js` → `Radius` (`sm:4, md:8, lg:16, full:999`).

Auditar: grep de `borderRadius:` con número literal fuera de `radius.*`/`Radius.*`.

## Sombras

Fuente: `src/constants/Shadows.js` → `Shadows` (`none`, `sm`, `md`, `lg`, vía `Platform.select` con `shadowColor`/`shadowOffset`/`shadowOpacity`/`shadowRadius` en iOS y `elevation` en Android).

Auditar: grep de `shadowColor:`/`shadowOffset:`/`elevation:` escritos a mano fuera de `Shadows.js` — normalmente en componentes tipo card reimplementados sin usar `Card`.

## Íconos

Fuente: `src/components/Icon.js`, envuelve `Ionicons` de `@expo/vector-icons` con tamaños `sm/md/lg` y color por defecto del theme.

Auditar: imports directos de `@expo/vector-icons` (u otras libs de íconos) fuera de `Icon.js`, sobre todo con `size`/`color` hardcodeados que varían pantalla a pantalla sin motivo.

## Botones

Fuente: `src/components/Button.js` — variantes `primary/secondary/outline/danger`, tamaños `sm/md/lg` (alto mínimo 44/36/52), estado `disabled`/`loading` con `ActivityIndicator`, `hitSlop`.

Auditar: `TouchableOpacity`/`Pressable` con `onPress` + texto hijo, estilado a mano como botón, fuera de `Button.js`. Señal de que cada pantalla reimplementa su propio botón en vez de reusar el componente — también contradice `UX-TOUCH-1`/`UX-FEEDBACK-1` de `fs-mobile-ui-ux` si el botón reimplementado no respeta alto mínimo o estado disabled/loading.

## Inputs

Fuente: `src/components/Input.js` — label opcional, mensaje de error, borde que cambia con foco/error, alto mínimo 44.

Auditar: `TextInput` crudo con estilos inline fuera de `Input.js`, sobre todo sin manejo de estado de error visible (relacionado con `UX-FORMS-1` de `fs-mobile-ui-ux`).

## Cards

Fuente: `src/components/Card.js` — `surface` + `radius.lg` + `shadows[elevation]` + `padding`.

Auditar: `View` con `backgroundColor`+`borderRadius`+sombra repetidos manualmente en varias pantallas en vez de usar `Card`.

## Modales

Fuente: `src/components/Modal.js` — envuelve `Modal` de `react-native` con backdrop, `SafeAreaView` y contenedor themed (patrón bottom-sheet).

Auditar: uso directo de `Modal` de `react-native` fuera de `Modal.js`, o `Alert.alert` usado para mostrar contenido custom (no solo un mensaje simple) en vez de un modal propio.
