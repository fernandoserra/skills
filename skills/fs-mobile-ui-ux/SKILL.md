---
name: fs-mobile-ui-ux
description: Audita la UI/UX de una app Expo/React Native — jerarquía visual, espaciado, tamaño de botones/áreas táctiles, navegación, estados vacíos/loading/error, feedback visual, consistencia de componentes y colores, tipografía, accesibilidad visual, formularios y safe area. Combina revisión estática de código con una pasada visual sobre screenshots del simulador cuando el control lo requiere. Usar cuando el usuario pida revisar/auditar el diseño, la UX o la UI de una app móvil, o evaluar consistencia visual.
---

# fs-mobile-ui-ux

Auditoría de UI/UX de una app Expo/React Native, combinando revisión **estática** de código/estilos con una pasada **visual** sobre la app corriendo cuando el control lo amerita.

## Qué NO es esta skill

No es un test de usabilidad con usuarios reales ni reemplaza una revisión de un diseñador. Tampoco valida contra un diseño de Figma específico — si el usuario tiene mockups de referencia, pedirlos y comparar explícitamente contra ellos en vez de aplicar solo heurísticas genéricas.

## Fuente de verdad de los controles

`assets/ui-ux-checklist.md` — 11 categorías (jerarquía visual, espaciado, áreas táctiles, navegación, estados, feedback, consistencia, tipografía, accesibilidad visual, formularios, safe area), cada control marcado como:

- 📄 **estática** — verificable leyendo código/estilos.
- 🔍 **visual** — requiere ver la pantalla renderizada; el código da a lo sumo una señal indirecta.

## Proceso

1. **Ubicar el árbol del proyecto**: `package.json` (confirmar dependencia `expo`), `src/` o raíz del código, archivos de `StyleSheet`/theme (`Colors.js`, `Spacing.js`, `Typography.js` si existe el preset `classic-stack` u otro esquema de constantes equivalente).
2. **Pasada estática**: recorrer `assets/ui-ux-checklist.md` control por control, aplicando cada uno (📄 y la parte estática de 📄+🔍) sobre el código — grep de patrones, lectura de componentes de pantalla, navegadores, formularios.
3. **Pasada visual**: para los controles marcados 🔍 (o 📄+🔍), antes de reportarlos como no verificados, ofrecer levantar la app y sacar screenshots con la skill `run` (simulador/dispositivo) de las pantallas relevantes. Si el usuario no quiere correr la app o no es viable en el entorno actual, marcar esos controles como 🔍 pendiente y explicar qué se necesitaría para confirmarlos — no inventar un veredicto visual sin haber visto la pantalla.
4. **Registrar por control**:
   - Estado: ✅ cumple / ⚠️ cumple parcialmente / ❌ no cumple / 🔍 pendiente de revisión visual / N/A no aplica
   - Evidencia: `archivo:línea` concreto, o descripción de lo visto en el screenshot
   - Sugerencia breve si el estado es ⚠️ o ❌
5. **No aplicar cambios automáticamente** — reportar primero y esperar confirmación, salvo que el usuario ya haya pedido explícitamente que se corrija.

## Formato del reporte

Una tabla por categoría, mismo estilo que `fs-mobile-security`:

| Control | Verificación | Estado | Evidencia | Sugerencia |
|---|---|---|---|---|
| UX-SPACING-1 | 📄 | ⚠️ | `src/screens/HomeScreen.js:22-40` — `padding: 13`, `marginTop: 7` sueltos, no usa `Spacing.js` | Migrar a la escala existente en `src/constants/Spacing.js` |
| UX-HIERARCHY-1 | 🔍 | ✅ | Screenshot de `HomeScreen` — el CTA "Comprar" es el único botón con color de acento, se distingue bien | — |

Cerrar con un resumen: cuántos controles evaluados en total, cuántos ✅/⚠️/❌/🔍 pendiente, y los 2-3 hallazgos de mayor impacto primero (priorizar los que afectan tareas core del usuario, no detalles cosméticos menores).
