# Checklist de performance para Expo/React Native

Cada control indica cómo se verifica:

- 📄 **estática** — se detecta leyendo código, y la evidencia debe explicar el **mecanismo causal** (no solo señalar la línea): qué hace que eso sea lento, no solo que "está mal".
- 🔧 **comando real** — se obtiene corriendo un comando y leyendo su salida, no una inferencia.
- 🩺 **requiere profiling manual** — no verificable por código de ninguna forma. No es un "pendiente" que se resuelve con más tiempo de lectura: hace falta una herramienta de profiling con GUI (Perf Monitor de RN, Flipper, Xcode Instruments, Android Studio Profiler) que esta skill no puede lanzar ni leer. El reporte debe decir exactamente qué herramienta usar y qué mirar, no dejarlo como una casilla vacía.

## PERF-RENDER (renders innecesarios)

| ID | Verificación | Foco | Qué revisar en Expo/RN |
|---|---|---|---|
| PERF-RENDER-1 | 📄 | Props inline (funciones/objetos/arrays creados en cada render) pasadas a un hijo memoizado. | `onPress={() => ...}`, `style={[...]}` con literal, `data={arr.filter(...)}` pasado a un componente envuelto en `React.memo` — nueva referencia en cada render del padre, rompe la memoización del hijo aunque sus props "lógicas" no cambiaron. |
| PERF-RENDER-2 | 📄 | Componentes declarados dentro del render de otro componente. | `function X() {...}` o `const X = () => ...` definido en el cuerpo de un componente padre — se recrea (y remonta, perdiendo estado interno) en cada render del padre. |
| PERF-RENDER-3 | 📄 | `useEffect`/`useMemo`/`useCallback` con array de dependencias mal puesto. | Dependencias faltantes (el efecto no reacciona cuando debería) o dependencias que son objetos/arrays no memoizados (el efecto se re-ejecuta en cada render porque la referencia cambia siempre, aunque el contenido sea el mismo). |
| PERF-RENDER-4 | 📄 | Hijo "puro" sin `React.memo` dentro de un padre que re-renderiza seguido. | Componente cuya salida depende solo de sus props, sin `React.memo`, renderizado dentro de un padre con estado que cambia frecuentemente (input controlado, timer, animación). |

## PERF-LIST (FlatList / FlashList)

| ID | Verificación | Foco | Qué revisar en Expo/RN |
|---|---|---|---|
| PERF-LIST-1 | 📄 | `ScrollView`+`.map()` para listas de tamaño no acotado. | `.map()` sobre un array que viene de una API (puede crecer) dentro de un `ScrollView` — renderiza todos los items de una, sin virtualización. |
| PERF-LIST-2 | 📄 | `FlatList` sin `keyExtractor` o con `renderItem` inline. | Falta `keyExtractor` (cae al índice, rompe con reordenamientos/inserciones); `renderItem` declarado inline en el JSX en vez de una función memoizada (`useCallback`) — se recrea en cada render del padre. |
| PERF-LIST-3 | 📄 | `FlatList` con alto de fila fijo/conocido sin `getItemLayout`. | Si el diseño tiene alto de celda constante, la ausencia de `getItemLayout` obliga a medir cada celda en vez de calcularlo — más lento en listas grandes y rompe `scrollToIndex`. |
| PERF-LIST-4 | 📄 | Listas muy largas (miles de items) usando `FlatList` en vez de `@shopify/flash-list`. | Si hay listas de ese volumen (feeds, chats) y no está `@shopify/flash-list` entre las dependencias, sugerir evaluarlo. Si ya está, confirmar que tiene `estimatedItemSize` — sin eso pierde buena parte del beneficio. |

## PERF-IMAGES (imágenes)

| ID | Verificación | Foco | Qué revisar en Expo/RN |
|---|---|---|---|
| PERF-IMAGES-1 | 📄 | `Image` de `react-native` en vez de `expo-image` para imágenes remotas. | Imports de `Image` desde `"react-native"` — `expo-image` cachea en disco/memoria y decodifica de forma más eficiente. |
| PERF-IMAGES-2 | 📄 | Imágenes remotas sin `resizeMode` ni dimensiones explícitas. | `<Image source={{ uri }}>` sin `resizeMode` (decodifica al tamaño original aunque se muestre chica) ni `width`/`height` (layout shift mientras carga). |
| PERF-IMAGES-3 | 📄 | Assets locales de gran peso sin optimizar. | Archivos en `assets/` con tamaño (`ls -la`) desproporcionado a su uso, o formatos pesados (PNG grande donde WebP/JPEG comprimido alcanzaría). |

## PERF-MEMORY (memoria)

| ID | Verificación | Foco | Qué revisar en Expo/RN |
|---|---|---|---|
| PERF-MEMORY-1 | 📄 | Listeners/suscripciones sin cleanup. | `addEventListener`, `onSnapshot`/`onValue` (Firebase), `Linking.addEventListener`, `AppState.addEventListener`, handlers de WebSocket, sin la función de cleanup correspondiente en el `return` del `useEffect`. |
| PERF-MEMORY-2 | 📄 | Timers/intervalos sin limpiar. | `setInterval`/`setTimeout` sin `clearInterval`/`clearTimeout` en el cleanup del efecto. |
| PERF-MEMORY-3 | 📄 | Estado que crece sin límite durante la sesión. | Arrays de datos (mensajes, resultados, log de eventos) que solo se concatenan (`setState(prev => [...prev, nuevo])`) sin paginación ni límite superior. |
| PERF-MEMORY-4 | 🩺 | Crecimiento real de memoria en uso prolongado. | No verificable por código. Usar Xcode Instruments (Allocations/Leaks) en iOS o Android Studio Memory Profiler en Android, durante una sesión de uso real navegando varias pantallas repetidamente. |

## PERF-NAV (navegación)

| ID | Verificación | Foco | Qué revisar en Expo/RN |
|---|---|---|---|
| PERF-NAV-1 | 📄 | Pantallas pesadas montadas de más por el navigator. | Screens con contenido pesado (video, mapas, listas grandes) fuera de foco sin `unmountOnBlur`, o sin `lazy` en navigators que lo soportan. |
| PERF-NAV-2 | 📄 | `options` del navigator recalculadas en cada render cuando hacen algo costoso. | `options={{ headerTitle: ... }}` como objeto/función inline en el JSX de la screen cuando el header hace cómputo pesado, en vez de memoizarlo o declararlo fuera del render. |
| PERF-NAV-3 | 📄 | Trabajo pesado disparado durante la transición de navegación. | Fetch/cálculo pesado en el `useEffect` de montaje de una pantalla nueva sin `InteractionManager.runAfterInteractions` — compite por el JS thread con la animación de transición y la traba. |

## PERF-ANIMATION (animaciones)

| ID | Verificación | Foco | Qué revisar en Expo/RN |
|---|---|---|---|
| PERF-ANIMATION-1 | 📄 | Animaciones con `Animated` sin `useNativeDriver: true`. | `Animated.timing`/`Animated.spring`/etc. sin `useNativeDriver: true` — corren en el JS thread, se traban si el JS thread está ocupado. |
| PERF-ANIMATION-2 | 📄 | `useNativeDriver: true` sobre propiedades no soportadas por el native driver. | Animaciones de `width`/`height`/`top`/`left` con `useNativeDriver: true` — esas props de layout no las soporta; hay que animar `transform`/`opacity`, o usar Reanimated. |
| PERF-ANIMATION-3 | 📄 | Gestos complejos con `PanResponder`+`setState` en vez de `react-native-reanimated`. | Swipe/drag/pull-to-refresh custom implementado con `setState` en cada evento de movimiento — dispara un render de React por cada frame del gesto, en vez de correr en un worklet del UI thread. |

## PERF-THREAD (JS thread / UI thread)

| ID | Verificación | Foco | Qué revisar en Expo/RN |
|---|---|---|---|
| PERF-THREAD-1 | 📄 | Trabajo síncrono pesado en el JS thread durante interacción. | `JSON.parse` de payloads grandes, `.sort()`/`.filter()`/transformaciones sobre arrays grandes en el render o en un handler de scroll/gesto, sin `InteractionManager.runAfterInteractions`, memoización o paginación. |
| PERF-THREAD-2 | 📄 | Tráfico excesivo por el bridge en eventos frecuentes. | `onScroll` con `setState` en cada evento (ida-y-vuelta JS↔UI por cada frame) en vez de `Animated.event` con `useNativeDriver` o un worklet de Reanimated. |
| PERF-THREAD-3 | 🩺 | FPS real / frames perdidos durante interacciones. | No verificable por código. Usar el Perf Monitor de React Native (menú dev, `Cmd+D`/`Cmd+M` → "Show Perf Monitor") o Flipper/Xcode Instruments durante uso real, sobre todo en scroll y transiciones. |

## PERF-NETWORK (network requests)

| ID | Verificación | Foco | Qué revisar en Expo/RN |
|---|---|---|---|
| PERF-NETWORK-1 | 📄 | Requests disparados en cada tecla sin debounce. | `onChangeText` conectado directo a un `fetch`/llamada a API (o a un `.filter()` sobre un dataset grande) sin debounce/throttle. |
| PERF-NETWORK-2 | 📄 | Requests secuenciales que podrían paralelizarse. | Varios `await fetch(...)` uno después del otro sin dependencia real entre ellos, en vez de `Promise.all([...])`. |
| PERF-NETWORK-3 | 📄 | Requests repetidos sin cache/dedupe. | El mismo endpoint refetcheado en cada montaje de pantalla sin ninguna capa de cache (`@tanstack/react-query`, SWR, cache manual) — notorio en pantallas a las que se vuelve seguido (tabs, back). |
| PERF-NETWORK-4 | 📄 | Requests sin abort al desmontar. | `fetch`/axios sin `AbortController` ligado al cleanup del `useEffect` — sigue corriendo e intenta hacer `setState` en un componente ya desmontado. |

## PERF-BUNDLE (bundle size)

| ID | Verificación | Foco | Qué revisar en Expo/RN |
|---|---|---|---|
| PERF-BUNDLE-1 | 🔧 | Tamaño real del bundle JS. | Correr `npx expo export` (o con `--platform ios`/`--platform android`) y leer el tamaño de los archivos generados en `dist/`. Es el único número real de esta auditoría que no depende de una GUI externa. |
| PERF-BUNDLE-2 | 📄 | Imports que inflan el bundle innecesariamente. | `import _ from "lodash"` (trae toda la librería) en vez de `import debounce from "lodash/debounce"`; `moment` como dependencia (locales pesados) en vez de `dayjs`/`date-fns`. |
| PERF-BUNDLE-3 | 📄 | Dependencias instaladas y no usadas. | Comparar `package.json` contra imports reales en `src/` — librerías grandes (mapas, gráficos, video) instaladas sin ningún `import` activo. |

## PERF-CONTEXT (Context / estado global)

| ID | Verificación | Foco | Qué revisar en Expo/RN |
|---|---|---|---|
| PERF-CONTEXT-1 | 📄 | `value` de un `Context.Provider` recreado en cada render. | `<MyContext.Provider value={{ user, setUser }}>` con objeto/array literal inline — nueva referencia en cada render del proveedor, re-renderiza a **todos** los consumers aunque el contenido no haya cambiado. Debería envolverse en `useMemo`. |
| PERF-CONTEXT-2 | 📄 | Selectors demasiado amplios en estado global (Redux/Zustand/Jotai). | `useSelector(state => state)` o selección de un slice grande cuando el componente solo necesita un campo — cualquier cambio en el store re-renderiza el componente. |

## PERF-STARTUP (Hermes / New Architecture / cold start)

| ID | Verificación | Foco | Qué revisar en Expo/RN |
|---|---|---|---|
| PERF-STARTUP-1 | 📄 | Hermes activo como motor JS. | `jsEngine: "hermes"` en `app.config.js`/`app.json` (default en SDKs recientes de Expo, pero confirmar que no esté forzado a JSC). |
| PERF-STARTUP-2 | 📄 | Estado de adopción de la New Architecture (Fabric/TurboModules). | `newArchEnabled` en `app.config.js`/`app.json` — no obligatorio, pero relevante mencionarlo si el proyecto tiene problemas de threading/bridge (ver `PERF-THREAD`). |
| PERF-STARTUP-3 | 📄 | Trabajo síncrono pesado antes de ocultar el splash screen. | En el componente raíz (`App.js`), cuánto se hace (fetch de config remota, inicialización de SDKs, lectura de storage) antes de `SplashScreen.hideAsync()` — cada uno suma directo al tiempo de cold start percibido. |

## Resumen de categorías

RENDER, LIST, IMAGES, MEMORY, NAV, ANIMATION, THREAD, NETWORK, BUNDLE, CONTEXT, STARTUP — 11 categorías, 36 controles. Solo `PERF-BUNDLE-1` produce un número real (comando); `PERF-MEMORY-4` y `PERF-THREAD-3` requieren profiling manual con herramientas que esta skill no puede correr; el resto es revisión de código con explicación del mecanismo causal.
