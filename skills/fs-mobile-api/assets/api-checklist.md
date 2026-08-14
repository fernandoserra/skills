# Checklist de networking/API para Expo/React Native

Todos los controles son 📄 **estática** (verificables leyendo código) salvo que se indique lo contrario.

## API-CLIENT (cliente HTTP centralizado)

| ID | Foco | Qué revisar en Expo/RN |
|---|---|---|
| API-CLIENT-1 | Existe una capa centralizada sobre `fetch`/`axios`, en vez de requests dispersos por todo el código. | Grep de `fetch(`/`axios.` fuera de un archivo cliente central (ej. `src/utils/http.js` del preset `classic-stack`, o `src/api/`) — señal de que cada pantalla arma sus propios requests con headers/manejo de error repetidos. |
| API-CLIENT-2 | Headers comunes (`Content-Type`, `Authorization`) se arman en un solo lugar. | Headers repetidos manualmente en múltiples llamadas vs. una función central (ver `buildHeaders` en `http.js` del preset) que los arma una sola vez. |

## API-TIMEOUT (timeouts)

| ID | Foco | Qué revisar en Expo/RN |
|---|---|---|
| API-TIMEOUT-1 | Los requests tienen timeout configurado. | `fetch` sin `AbortController`+`setTimeout` combinados, o instancia de `axios` sin `timeout:`. Sin esto, una request colgada (backend caído, red mala) nunca resuelve y deja al usuario esperando indefinidamente sin feedback. |

## API-RETRY (reintentos)

| ID | Foco | Qué revisar en Expo/RN |
|---|---|---|
| API-RETRY-1 | Hay estrategia de retry con backoff para errores transitorios (timeout, 5xx, sin conexión) en operaciones idempotentes (`GET`). | Ausencia total de retry, o retry sin backoff (reintento inmediato en loop que puede saturar el backend en una caída). |
| API-RETRY-2 | Operaciones no idempotentes (`POST` de pago, envío único, creación de recursos) no se reintentan automáticamente sin protección contra duplicados. | Retry genérico aplicado indiscriminadamente a todos los métodos HTTP incluyendo `POST`/`PUT` sin idempotency key ni chequeo de si la operación ya se ejecutó del lado del servidor. |

## API-ERRORS (manejo de errores)

| ID | Foco | Qué revisar en Expo/RN |
|---|---|---|
| API-ERRORS-1 | Los errores de red distinguen tipo (timeout, sin conexión, 4xx, 5xx, error de parseo) en vez de un catch genérico. | `catch (e) { ... }` que trata todo error igual y muestra el mismo mensaje ("algo salió mal") sin diferenciar "sin internet" de "el servidor rechazó el request" — el usuario no sabe si reintentar sirve de algo. |
| API-ERRORS-2 | Los errores 4xx (validación del backend) se propagan con el mensaje/campo específico al UI. | Se descarta el body de la respuesta de error y solo se muestra un mensaje genérico, en vez de parsear y mostrar lo que el backend realmente devolvió (ej. "el email ya está registrado"). |

## API-REFRESH (refresh token)

| ID | Foco | Qué revisar en Expo/RN |
|---|---|---|
| API-REFRESH-1 | Al recibir 401, se intenta refrescar el token antes de forzar logout. | Interceptor/wrapper que detecta 401, llama al endpoint de refresh, reintenta el request original una vez, y solo desloguea si el refresh también falla. El `http.js` del preset `classic-stack` **no** lo tiene por defecto — es un candidato típico a señalar como ❌ si no se agregó. |
| API-REFRESH-2 | Requests concurrentes durante un refresh en curso no disparan múltiples refresh en paralelo. | Si varios requests fallan con 401 al mismo tiempo (ej. una pantalla que dispara 3 fetches juntos), confirmar que solo se dispara un refresh y los demás esperan ese resultado (deduplicación), no N refreshes simultáneos compitiendo. |

## API-PAGINATION (paginación)

| ID | Foco | Qué revisar en Expo/RN |
|---|---|---|
| API-PAGINATION-1 | Listas que pueden crecer mucho usan paginación/infinite scroll en vez de traer todo de una. | Endpoint de listado sin parámetros de `page`/`limit`/`cursor`, combinado con un `FlatList` que recibe el dataset completo de entrada. |
| API-PAGINATION-2 | `onEndReached` no dispara fetches duplicados si se llama varias veces antes de que resuelva el anterior. | Falta de un flag ("cargando siguiente página") que evite pedir la misma página dos veces en un scroll rápido. |

## API-CACHE (cache)

| ID | Foco | Qué revisar en Expo/RN |
|---|---|---|
| API-CACHE-1 | Hay alguna capa de cache/dedupe de requests en vez de refetch en cada montaje de pantalla. | Mismo endpoint refetcheado cada vez que se visita una pantalla sin `@tanstack/react-query`/SWR/cache manual. Relacionado con `PERF-NETWORK-3` de `fs-mobile-performance` — esa skill lo mira desde el ángulo de performance (por qué es lento), esta desde el ángulo de diseño del cliente API (falta la capa). |
| API-CACHE-2 | Hay invalidación de cache tras mutaciones. | Tras un `POST`/`PUT`/`DELETE` exitoso, ¿se invalida/actualiza la data cacheada relacionada, o queda desactualizada hasta el próximo refetch manual del usuario? |

## API-CANCEL (cancelación)

| ID | Foco | Qué revisar en Expo/RN |
|---|---|---|
| API-CANCEL-1 | Requests se cancelan al desmontar el componente o al reemplazarse por uno nuevo (ej. buscador con cada tecla). | `AbortController` ligado al cleanup del `useEffect`, o su ausencia en componentes con fetch propio. Relacionado con `PERF-NETWORK-4` de `fs-mobile-performance` (mismo patrón, ángulo distinto: ahí es sobre desperdicio de trabajo, acá sobre requests en carrera que pueden pisar una respuesta más nueva con una más vieja que llega tarde). |

## API-OFFLINE (conciencia de conectividad)

| ID | Foco | Qué revisar en Expo/RN |
|---|---|---|
| API-OFFLINE-1 | La app detecta pérdida de conectividad y lo comunica, en vez de dejar que cada fetch falle con un error genérico. | Uso de `@react-native-community/netinfo` (o equivalente) para mostrar un estado "sin conexión" claro. No cubre sincronización/cola offline completa — eso queda fuera de alcance de esta skill. |

## API-ENDPOINTS (organización)

| ID | Foco | Qué revisar en Expo/RN |
|---|---|---|
| API-ENDPOINTS-1 | URLs de endpoints centralizadas, no strings sueltos por el código. | `fetch("https://...")` con URL literal inline vs. referencia a un archivo de constantes (`src/values/endpointsString.js` del preset `classic-stack`, o equivalente). |

## Resumen de categorías

CLIENT, TIMEOUT, RETRY, ERRORS, REFRESH, PAGINATION, CACHE, CANCEL, OFFLINE, ENDPOINTS — 10 categorías, 16 controles.
