---
name: fs-mobile-responsive
description: Audita la adaptabilidad de una app Expo/React Native a distintos tamaños y formas de pantalla — iPhones chicos y grandes, Android fragmentado, tablets (iPad/Android), orientación portrait/landscape, safe areas, notch, Dynamic Island y comportamiento del teclado. Combina revisión estática de código (valores hardcodeados vs. hooks reactivos como useWindowDimensions/useSafeAreaInsets) con una pasada visual sobre un set de simuladores representativo. Usar cuando el usuario pida revisar/auditar responsive, adaptabilidad, soporte de tablets, orientación, safe areas, notch o Dynamic Island en una app móvil.
---

# fs-mobile-responsive

Auditoría de adaptabilidad de una app Expo/React Native a distintos tamaños/formas de pantalla, combinando revisión **estática** de código con una pasada **visual** sobre un set de simuladores cuando el control lo amerita.

## Qué NO es esta skill

No reemplaza probar en dispositivos físicos reales — los simuladores no capturan del todo diferencias de refresco, rendimiento o gestos táctiles reales. Tampoco cubre foldables (Galaxy Fold y similares) como categoría propia; si el usuario los necesita, tratarlos como una extensión de `RESP-TABLET` (cambio de ancho en runtime) y avisar que no hay un check dedicado.

## Relación con otras skills

`fs-mobile-ui-ux` ya tiene `UX-SAFEAREA-1` (safe area básico) y `fs-mobile-accessibility` tiene `A11Y-DYNAMICTYPE-2` (layout roto con texto grande) — quedan deliberadamente separadas de esta skill, cada una con su propio criterio (mismo enfoque que la separación entre `fs-mobile-ui-ux` y `fs-mobile-accessibility`). Puede haber hallazgos parecidos reportados con distinto nivel de detalle si se corren varias auditorías sobre el mismo proyecto — es esperado.

## Fuente de verdad de los controles

`assets/responsive-checklist.md` — 6 categorías (tamaños de teléfono, tablets, orientación, safe areas, notch/Dynamic Island, teclado), cada control marcado 📄 estática o 🔍 visual. Trae también el set mínimo de simuladores recomendado para la pasada visual.

## Proceso

1. **Ubicar el árbol del proyecto**: `package.json` (confirmar `expo`/React Native), `app.config.js`/`app.json` (`orientation`), `src/` o raíz del código, pantallas con formularios/listas/contenido pegado a los bordes.
2. **Pasada estática**: recorrer `assets/responsive-checklist.md` control por control, aplicando la parte 📄 sobre el código — grep de dimensiones/paddings hardcodeados, uso de `Dimensions.get` vs. `useWindowDimensions()`, uso de `useSafeAreaInsets()`/`SafeAreaView`, manejo de `KeyboardAvoidingView`.
3. **Pasada visual**: para los controles 🔍, ofrecer levantar la app con la skill `run` sobre el set mínimo de simuladores de `assets/responsive-checklist.md` y sacar screenshots de las pantallas con más contenido (formularios largos, listas, detalle). Si el usuario no puede/quiere correr esto, dejar esos controles como 🔍 pendiente y explicar qué se necesitaría para confirmarlos — no inventar un veredicto sin haberlo visto.
4. **Registrar por control**:
   - Estado: ✅ cumple / ⚠️ cumple parcialmente / ❌ no cumple / 🔍 pendiente de revisión visual / N/A no aplica
   - Evidencia: `archivo:línea` concreto, o descripción de lo visto en el screenshot (indicando el modelo/simulador usado)
   - Sugerencia breve si el estado es ⚠️ o ❌
5. **No aplicar cambios automáticamente** — reportar primero y esperar confirmación, salvo que el usuario ya haya pedido explícitamente que se corrija.

## Formato del reporte

Una tabla por categoría, mismo estilo que las demás skills de auditoría:

| Control | Verificación | Estado | Evidencia | Sugerencia |
|---|---|---|---|---|
| RESP-SAFEAREA-2 | 📄 | ❌ | `src/screens/HomeScreen.js:12` — `paddingTop: 44` fijo en vez de `insets.top` | Reemplazar por `useSafeAreaInsets().top` |
| RESP-PHONE-3 | 🔍 | ✅ | Screenshot iPhone SE y iPhone 16 Pro Max de `ProfileScreen` — sin overflow ni texto cortado en ninguno | — |

Cerrar con un resumen: cuántos controles evaluados, cuántos ✅/⚠️/❌/🔍 pendiente, y los 2-3 hallazgos de mayor impacto primero (priorizar lo que rompe o tapa contenido, no ajustes cosméticos menores).
