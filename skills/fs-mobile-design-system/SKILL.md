---
name: fs-mobile-design-system
description: Mantiene un design system consistente entre proyectos Expo/React Native — colores, tipografía, spacing, radius, sombras, íconos y componentes base (Button, Input, Card, Modal). Modo generar/inyectar para crear o completar la capa de tokens y componentes en un proyecto, y modo auditar para detectar drift (valores hardcodeados o componentes reimplementados en vez de reusar la capa compartida). Usar cuando el usuario pida crear/estandarizar un design system, agregar tokens/componentes base a una app móvil, o auditar consistencia de colores/tipografía/spacing/componentes entre proyectos.
---

# fs-mobile-design-system

Dos modos. Detectar cuál aplica antes de actuar (si hay ambigüedad, preguntar):

1. **Modo generar/inyectar** — el proyecto no tiene la capa de tokens/componentes, o el usuario pide agregarla/completarla.
2. **Modo auditar** — el proyecto ya tiene (parcial o totalmente) la capa de design system y el usuario pide revisar consistencia/drift.

## Relación con otras skills

- `fs-mobile-scaffold` ya crea parte de esta capa como parte del preset `classic-stack` (`Colors.js`, `Typography.js`, `Spacing.js` con `Radius`, `Theme.js`, `useAppTheme.js`, `ThemedText`/`ThemedView`). Esta skill la completa: agrega `Shadows.js`, `Icon.js`, y los componentes base que el scaffold no incluye (`Button`, `Input`, `Card`, `Modal`).
- `fs-mobile-ui-ux` audita heurísticas de UX sobre pantallas ya construidas (jerarquía, feedback, estados, navegación). Esta skill audita algo más angosto y anterior en la cadena: si existe una capa de tokens/componentes centralizada y si el código la usa — no la calidad de cada pantalla en sí.

## Qué NO es esta skill

No define identidad de marca real — el modo generar scaffoldea un set neutro pensado para sobreescribirse (paleta, tipografía, radio de bordes). Tampoco es una herramienta de diseño: no produce assets gráficos ni sincroniza con Figma, solo código.

## Fuente de los tokens y componentes

`assets/templates/design-system/src/` trae el árbol completo (`constants/`, `hooks/`, `components/`) con los valores por defecto. `assets/tokens-reference.md` documenta cada categoría con su fuente y el criterio de auditoría.

## Modo generar/inyectar

1. Detectar qué ya existe en el proyecto: `src/constants/{Colors,Typography,Spacing,Theme,Shadows}.js`, `src/hooks/useAppTheme.js`, `src/components/{ThemedText,ThemedView,Icon,Button,Input,Card,Modal}.js`.
2. Si no existe nada de esto, copiar el árbol completo de `assets/templates/design-system/src/` al proyecto.
3. Si ya existe parcialmente (típicamente porque el proyecto se armó con `fs-mobile-scaffold`), completar solo lo que falta:
   - `Shadows.js` si no existe, y agregar `shadows: Shadows` a `Theme.js` si `Theme.js` ya existe pero no lo expone (mostrar el diff antes de aplicarlo).
   - Cualquiera de `Icon.js`/`Button.js`/`Input.js`/`Card.js`/`Modal.js` que falte, copiado desde `assets/templates/design-system/src/components/`.
4. **Nunca sobreescribir un archivo existente con contenido distinto sin mostrarlo y confirmar con el usuario** — puede tener la paleta de marca real u otras customizaciones ya cargadas.
5. Confirmar dependencias:
   - `react-native-safe-area-context` (la usa `Modal.js`) — instalar con `npx expo install react-native-safe-area-context` si falta.
   - `@expo/vector-icons` (la usa `Icon.js`) — viene incluida con el SDK de Expo, no requiere instalación aparte; solo confirmar que el proyecto sea Expo antes de copiar `Icon.js` (si es RN bare sin Expo, avisar y ofrecer adaptarlo a otra lib de íconos).
6. Cerrar con: qué se creó/completó, y qué queda para personalizar (paleta real en `Colors.js`, `fontFamily` en `Typography.js` si suman una fuente custom, set de íconos si no usan Ionicons).

## Modo auditar

Recorrer `assets/tokens-reference.md` categoría por categoría (colores, tipografía, spacing, radius, sombras, íconos, botones, inputs, cards, modales), aplicando el grep/criterio de cada una sobre `src/`.

Reportar por categoría:

| Categoría | Estado | Evidencia | Sugerencia |
|---|---|---|---|
| Colores | ⚠️ | `src/screens/ProfileScreen.js:18` — `#2650A2` hardcodeado en vez de `colors.primary` | Reemplazar por el token de `Colors.js` |
| Botones | ❌ | `src/screens/CheckoutScreen.js:40-55` — `TouchableOpacity` con estilos propios en vez de `Button` | Migrar a `components/Button.js` (variant `primary`) |

Estado: ✅ consistente / ⚠️ drift parcial (algunos casos sueltos) / ❌ drift generalizado (la categoría no se usa realmente) / N/A no aplica.

Cerrar con resumen: cuántas categorías ✅/⚠️/❌, priorizando colores y spacing primero (son los que más se filtran como valores sueltos), y no aplicar fixes automáticamente sin confirmar con el usuario.
