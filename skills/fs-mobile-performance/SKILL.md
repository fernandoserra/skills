---
name: fs-mobile-performance
description: Audita performance de una app Expo/React Native — renders innecesarios, FlatList/FlashList, imágenes, memoria, navegación, animaciones, JS thread/UI thread, network requests y bundle size. Explica el mecanismo causal de cada hallazgo ("este componente re-renderiza porque..."), no solo lo señala. Distingue lo verificable por código de lo que requiere profiling manual (Flipper, Xcode Instruments, Android Studio Profiler) que la skill no puede correr. Usar cuando el usuario pida auditar/mejorar performance, revisar renders innecesarios, optimizar listas/imágenes/animaciones, o reducir bundle size de una app móvil.
---

# fs-mobile-performance

Auditoría de performance de una app Expo/React Native. A diferencia de las demás skills de auditoría, acá una parte real del dominio **no es verificable por código** — hay que ser explícito sobre esa frontera en vez de simularla.

## Qué NO es esta skill

No mide FPS real, renders reales ni crecimiento de memoria real — eso vive en herramientas de profiling con GUI (Perf Monitor de React Native, Flipper, Xcode Instruments, Android Studio Profiler) que esta skill no puede lanzar ni leer. Para los controles marcados 🩺 en `assets/performance-checklist.md`, el reporte debe decir exactamente qué herramienta abrir y qué mirar — nunca inventar un número o una conclusión sin haberlo medido. La única métrica "real" que esta skill sí puede producir por sí misma es el tamaño del bundle (`PERF-BUNDLE-1`), corriendo `npx expo export`.

## Estilo del reporte: explicar el mecanismo, no solo señalar

Cuando el usuario pidió específicamente algo como *"este componente está provocando renders innecesarios porque..."* — cada hallazgo 📄 tiene que completar esa frase. No alcanza con "línea X, mal". La evidencia debe nombrar la causa (qué referencia se recrea, qué dependencia falta, qué prop rompe la memoización) y la consecuencia concreta (qué se re-renderiza/recalcula de más).

## Fuente de verdad de los controles

`assets/performance-checklist.md` — 11 categorías (renders, FlatList/FlashList, imágenes, memoria, navegación, animaciones, JS/UI thread, network, bundle, Context/estado global, Hermes/New Architecture/cold start), cada control marcado:

- 📄 **estática** — leer código y explicar el mecanismo causal.
- 🔧 **comando real** — correr un comando y leer su salida (solo bundle size).
- 🩺 **requiere profiling manual** — no verificable por código; decir qué herramienta usar.

## Proceso

1. **Ubicar el árbol del proyecto**: `package.json` (confirmar `expo`/React Native, dependencias como `@shopify/flash-list`, `expo-image`, `react-native-reanimated`, `@tanstack/react-query`), `app.config.js`/`app.json` (`jsEngine`, `newArchEnabled`), `App.js`/componente raíz, pantallas con listas/imágenes/animaciones.
2. **Pasada estática**: recorrer `assets/performance-checklist.md` categoría por categoría, aplicando cada control 📄 sobre el código. Para cada hallazgo, redactar la evidencia como mecanismo causal (ver sección anterior), no como observación suelta.
3. **Bundle size**: correr `npx expo export` (confirmar sintaxis vigente con `--help` si hace dudar la versión de Expo instalada) y reportar `PERF-BUNDLE-1` con el tamaño real obtenido.
4. **Controles 🩺**: no intentar adivinar el resultado. Reportarlos como pendientes de profiling manual, indicando la herramienta concreta (Perf Monitor / Flipper / Xcode Instruments / Android Studio Profiler) y qué acción del usuario dispararía la medición (ej. "hacer scroll en `FeedScreen` con Perf Monitor activo").
5. **No aplicar fixes automáticamente** — reportar primero y esperar confirmación, salvo que el usuario ya haya pedido explícitamente que se corrija.

## Formato del reporte

Una tabla por categoría:

| Control | Verificación | Estado | Evidencia (mecanismo) | Sugerencia |
|---|---|---|---|---|
| PERF-RENDER-1 | 📄 | ❌ | `src/components/ProductCard.js:8` — `ProductCard` está envuelto en `React.memo`, pero `src/screens/CatalogScreen.js:34` le pasa `onPress={() => addToCart(item.id)}` inline: nueva función en cada render de `CatalogScreen`, así que `ProductCard` se re-renderiza igual para cada item de la lista en cada tecla que se tipea en el buscador de arriba | Envolver el handler en `useCallback` en `CatalogScreen`, o pasar `item.id` y mover `addToCart` a una función estable |
| PERF-THREAD-3 | 🩺 | 🩺 | Pendiente — requiere Perf Monitor de RN mientras se hace scroll en `FeedScreen` | Activar `Cmd+D` → "Show Perf Monitor" y observar FPS de JS/UI durante scroll rápido |
| PERF-BUNDLE-1 | 🔧 | ⚠️ | `npx expo export` → bundle iOS 4.8MB, incluye `moment` completo (~230KB) | Migrar a `dayjs` (ver `PERF-BUNDLE-2`) |

Cerrar con un resumen: cuántos controles evaluados, cuántos ✅/⚠️/❌/🩺 pendiente de profiling, y los 2-3 hallazgos de mayor impacto primero (priorizar lo que afecta pantallas de uso frecuente o listas/loops grandes, no micro-optimizaciones).
