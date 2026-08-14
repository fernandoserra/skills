# Checklist de estados de pantalla para Expo/React Native

El problema típico: la mayoría de las pantallas con datos async solo diseñan **Loading → Success**, y tratan todo lo demás (vacío, error, sin conexión, sesión expirada, sin permiso) como el mismo catch genérico o directamente lo ignoran. Esta skill audita si los 8 estados están **modelados como ramas distintas**, no solo si "hay un try/catch".

Todos los controles son 📄 **estática** (verificables leyendo código).

## STATE-MODEL (arquitectura del estado)

| ID | Foco | Qué revisar en Expo/RN |
|---|---|---|
| STATE-MODEL-1 | La pantalla usa un modelo de estado explícito (enum/discriminated union de status) en vez de múltiples booleans independientes. | `const [loading, setLoading] = useState(false)` + `const [error, setError] = useState(null)` + `const [data, setData] = useState(null)` por separado permite combinaciones ambiguas (`loading=true` con `error` seteado, o ninguno de los dos con `data=null`: ¿qué estado es ese?). Preferible: un único `status` (`"loading" \| "empty" \| "success" \| "error" \| "offline" \| "unauthorized" \| "expired" \| "permission_denied"`). |
| STATE-MODEL-2 | El render cubre cada rama del estado explícitamente. | `switch(status)`/cadena de `if` explícita por cada valor posible, en vez de un fallback implícito tipo "si no está loading y no hay error, asumir success" — ese patrón deja huecos silenciosos (¿y si `data` es `null` sin error explícito? ¿y si está offline?). |

## STATE-LOADING

| ID | Foco | Qué revisar en Expo/RN |
|---|---|---|
| STATE-LOADING-1 | El estado de carga es una rama propia, distinguible del estado inicial/vacío. | Confirmar que "todavía no cargó" (loading) y "cargó y no hay resultados" (empty) no comparten la misma condición de render. |

## STATE-EMPTY

| ID | Foco | Qué revisar en Expo/RN |
|---|---|---|
| STATE-EMPTY-1 | El estado vacío (0 resultados tras un fetch exitoso) es una rama propia, no una variante silenciosa de loading o error. | `data.length === 0` manejado con un mensaje/CTA dedicado, no un `return null` que deja la pantalla en blanco sin explicar por qué. |

## STATE-ERROR

| ID | Foco | Qué revisar en Expo/RN |
|---|---|---|
| STATE-ERROR-1 | Hay una rama de error genérico (fallo del servidor, error inesperado) con opción de reintentar. | El `catch` de la request setea un estado de error visible con acción de retry, no solo loguea o deja la pantalla congelada. |

## STATE-OFFLINE

| ID | Foco | Qué revisar en Expo/RN |
|---|---|---|
| STATE-OFFLINE-1 | Sin conexión es una rama distinta del error genérico del servidor. | El mensaje/acción para "no hay internet" (revisa tu conexión, reintentar cuando vuelva) es distinto del de "el servidor falló". Relacionado con `API-OFFLINE-1` de `fs-mobile-api`: esa verifica que exista *detección* de conectividad a nivel app; esta verifica que la pantalla la use como rama de estado propia en vez de caer en el catch genérico. |

## STATE-UNAUTHORIZED

| ID | Foco | Qué revisar en Expo/RN |
|---|---|---|
| STATE-UNAUTHORIZED-1 | Un 401/403 en una pantalla protegida tiene un manejo específico (redirigir a login), no se confunde con un error genérico. | El usuario no debería ver "algo salió mal" cuando en realidad nunca estuvo autenticado para ver ese contenido — la acción correcta es mandarlo a login, no ofrecerle "reintentar". |

## STATE-EXPIRED

| ID | Foco | Qué revisar en Expo/RN |
|---|---|---|
| STATE-EXPIRED-1 | La sesión expirada se comunica de forma específica, distinta de "nunca logueado" y de un logout silencioso. | Relacionado con `API-REFRESH-1` de `fs-mobile-api`: esa verifica que se intente refrescar el token antes de desloguear; esta verifica que, si el refresh falla y hay que desloguear, el usuario reciba un mensaje ("tu sesión expiró, inicia sesión de nuevo") en vez de aparecer en la pantalla de login sin explicación. |

## STATE-PERMISSION

| ID | Foco | Qué revisar en Expo/RN |
|---|---|---|
| STATE-PERMISSION-1 | Un 403 por falta de permiso (no por sesión expirada) muestra un mensaje distinto de ambos casos anteriores. | "No tienes acceso a esto" en vez de reusar el texto de error genérico o el de sesión expirada — son tres causas distintas que necesitan tres respuestas distintas del usuario. |
| STATE-PERMISSION-2 | Permisos de dispositivo denegados (cámara, ubicación, notificaciones, contactos) tienen una UI de fallback explícita. | `expo-camera`/`expo-location`/`expo-notifications` con el permiso denegado: ¿hay una pantalla/mensaje explicando qué falta y cómo habilitarlo (ir a Settings vía `Linking.openSettings()`), o la feature simplemente no hace nada en silencio? |

## Resumen de categorías

MODEL, LOADING, EMPTY, ERROR, OFFLINE, UNAUTHORIZED, EXPIRED, PERMISSION — 8 categorías, 10 controles. El objetivo no es la profundidad por estado sino la **cobertura**: cuántos de los 8 están modelados como rama propia en cada pantalla/flujo con datos async.
