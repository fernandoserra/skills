---
name: fs-mobile-accessibility
description: Audita la accesibilidad de una app Expo/React Native contra WCAG 2.1/2.2 AA aplicado a mobile — labels para screen reader, soporte de VoiceOver/TalkBack, Dynamic Type, contraste, áreas táctiles, navegación por accesibilidad, movimiento reducido, formularios accesibles y anuncios de contenido dinámico. Combina revisión estática de código con confirmación en runtime (VoiceOver/TalkBack real, o screenshots con configuración de accesibilidad activada) para lo que no se puede verificar solo leyendo código. Usar cuando el usuario pida una auditoría de accesibilidad, revisar soporte de VoiceOver/TalkBack, o evaluar cumplimiento WCAG de una app móvil.
---

# fs-mobile-accessibility

Auditoría de accesibilidad de una app Expo/React Native contra [WCAG 2.1/2.2](https://www.w3.org/WAI/WCAG21/quickref/) nivel AA, adaptado a mobile (labels, screen reader, touch, etc. en vez de teclado/mouse).

## Qué NO es esta skill

No reemplaza probar la app con un usuario real que use VoiceOver/TalkBack a diario, ni un audit certificado de accesibilidad. Varios controles —sobre todo toda la categoría `SCREENREADER` y `NAV`, y parte de `DYNAMICTYPE`— solo se pueden confirmar de verdad recorriendo la app con el screen reader activado o viendo un screenshot con la configuración de accesibilidad del sistema activada. Por código estático se puede confirmar que *existe* el prop/mecanismo correspondiente, pero no que la experiencia real funciona bien. Marcar esos casos como 🔍, nunca como ✅, salvo que se haya confirmado en runtime.

## Relación con `fs-mobile-ui-ux`

`fs-mobile-ui-ux` ya tiene controles `UX-A11Y` (contraste, font-scaling) y `UX-TOUCH` (áreas táctiles) como heurísticas de UX generales. Esta skill es la fuente de verdad más profunda y normativa (WCAG) para esos mismos temas más todo lo específico de screen reader — quedan deliberadamente separadas, cada una con su propio criterio; si un mismo proyecto corre ambas auditorías puede haber hallazgos parecidos reportados con distinto nivel de detalle, eso es esperado.

## Fuente de verdad de los controles

`assets/wcag-mobile-checklist.md` — 9 categorías (labels, screen reader, Dynamic Type, contraste, touch, navegación, movimiento reducido, formularios, contenido dinámico), cada control marcado como 📄 estática o 🔍 runtime (o ambas). Si el usuario pide el texto oficial de un criterio WCAG, verificarlo con `WebFetch` sobre `https://www.w3.org/WAI/WCAG21/Understanding/<criterio>` — no citar el archivo local como si fuera el texto oficial.

## Proceso

1. **Ubicar el árbol del proyecto**: `package.json` (confirmar `expo`/React Native), `src/` o raíz del código, componentes de formularios, navegadores, tokens de color (`Colors.js` si existe) para calcular contraste directo.
2. **Pasada estática**: recorrer `assets/wcag-mobile-checklist.md` control por control, aplicando la parte 📄 sobre el código (grep de `accessibilityLabel`/`accessibilityRole`/`accessibilityState`/`allowFontScaling`/`accessibilityLiveRegion`, cálculo de contraste sobre tokens de color, revisión de `onPressIn` vs `onPress` en acciones destructivas).
3. **Pasada runtime**: para los controles 🔍, antes de reportarlos como no verificados, ofrecer levantar la app con la skill `run` y:
   - Activar VoiceOver (iOS) o TalkBack (Android) en el simulador/dispositivo y recorrer las pantallas principales con swipe, confirmando que cada control se anuncia con nombre/rol correcto y en un orden lógico.
   - Activar el tamaño de texto grande del sistema y sacar screenshots de las pantallas con más texto, para confirmar `DYNAMICTYPE-2`.
   Si el usuario no puede/quiere correr esto, dejar esos controles como 🔍 pendiente y explicar qué se necesitaría para confirmarlos — no inventar un veredicto sin haberlo visto.
4. **Registrar por control**:
   - Estado: ✅ cumple / ⚠️ cumple parcialmente / ❌ no cumple / 🔍 pendiente de confirmación runtime / N/A no aplica
   - Evidencia: `archivo:línea` concreto, o descripción de lo observado en VoiceOver/TalkBack/screenshot
   - Sugerencia breve si el estado es ⚠️ o ❌
5. **No aplicar cambios automáticamente** — reportar primero y esperar confirmación, salvo que el usuario ya haya pedido explícitamente que se corrija.

## Formato del reporte

Una tabla por categoría, mismo estilo que `fs-mobile-security`:

| Control | WCAG | Verificación | Estado | Evidencia | Sugerencia |
|---|---|---|---|---|---|
| A11Y-LABELS-1 | 1.1.1 | 📄 | ❌ | `src/screens/HomeScreen.js:34` — `TouchableOpacity` con solo un ícono, sin `accessibilityLabel` | Agregar `accessibilityLabel="Buscar"` |
| A11Y-SCREENREADER-2 | 2.4.3 | 🔍 | 🔍 | Pendiente — requiere recorrer `HomeScreen` con VoiceOver/TalkBack | Confirmar orden de lectura con la skill `run` |

Cerrar con un resumen: cuántos controles evaluados, cuántos ✅/⚠️/❌/🔍 pendiente, y los 2-3 hallazgos de mayor impacto primero (priorizar lo que bloquea completamente una tarea para un usuario de screen reader, no detalles menores).
