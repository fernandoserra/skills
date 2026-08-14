---
name: fs-mobile-state-management-ux
description: Audita si las pantallas de una app Expo/React Native modelan explícitamente los 8 estados de una operación async (loading, empty, success, error, offline, unauthorized, expired, permission_denied) en vez de solo diseñar "loading → success" y tratar todo lo demás como el mismo catch genérico. Revisión estática de código, reportada como una matriz pantalla × estado. Usar cuando el usuario pida auditar manejo de estados, revisar qué pasa cuando falla una request/hay error/no hay conexión/expira la sesión, o evaluar cobertura de casos borde de una pantalla.
---

# fs-mobile-state-management-ux

Auditoría **estática** de cobertura de estados en pantallas/flujos con datos async de una app Expo/React Native. El problema que ataca: la mayoría de las pantallas diseñan **Loading → Success** y tratan vacío, error, offline, sesión expirada, sin permiso y sin autorización como variantes del mismo catch genérico (o directamente los ignoran).

## Los 8 estados

`LOADING`, `EMPTY`, `SUCCESS`, `ERROR`, `OFFLINE`, `UNAUTHORIZED`, `EXPIRED`, `PERMISSION_DENIED` — ver `assets/states-checklist.md` para el criterio de cada uno.

## Relación con otras skills

- `fs-mobile-ui-ux` (`UX-STATES`) ya cubre loading/vacío/error como heurística de UX visual — esta skill es más profunda en dos sentidos: agrega offline/unauthorized/expired/permission_denied (ausentes ahí), y audita la **arquitectura del estado** (¿hay una rama de código por cada caso, o booleans sueltos que permiten combinaciones ambiguas?), no solo si hay un spinner visible.
- `fs-mobile-api` (`API-OFFLINE-1`, `API-REFRESH-1`) verifica que existan los *mecanismos* (detección de conectividad, intento de refresh de token). Esta skill verifica que la *pantalla* use esos mecanismos como ramas de estado distinguibles para el usuario, no que colapsen en el mismo mensaje genérico.

Quedan deliberadamente separadas — puede haber hallazgos parecidos con distinto enfoque si se corren varias.

## Proceso

1. **Ubicar las pantallas/flujos con datos async**: componentes que hacen fetch/consumen queries (`useEffect` con `fetch`/`axios`, hooks de `react-query`/SWR, o el `http.js` del preset `classic-stack` si el proyecto viene de `fs-mobile-scaffold`).
2. **Para cada pantalla/flujo**, recorrer `assets/states-checklist.md` y determinar para cada uno de los 8 estados si:
   - ✅ está modelado como rama propia con UI/mensaje específico
   - ⚠️ existe pero está confundido con otro estado (ej. offline muestra el mismo texto que error genérico)
   - ❌ no está manejado en absoluto
   - N/A no aplica a esa pantalla (ej. una pantalla sin contenido protegido no necesita `UNAUTHORIZED`)
3. **Registrar el mecanismo**, no solo el estado — igual que `fs-mobile-performance`, la evidencia debe explicar *por qué* está mal, no solo señalar la línea (ej. "el `catch` genérico en `fetchProfile` no distingue `TypeError: Network request failed` de un 500, así que offline y error de servidor muestran el mismo texto").
4. **No aplicar fixes automáticamente** — reportar primero y esperar confirmación, salvo que el usuario ya haya pedido explícitamente que se corrija.

## Formato del reporte

Una **matriz pantalla × estado**, no una tabla plana por control — el valor de esta skill está en ver de un vistazo qué cobertura tiene cada pantalla:

| Pantalla | Loading | Empty | Success | Error | Offline | Unauthorized | Expired | Permission |
|---|---|---|---|---|---|---|---|---|
| `HomeScreen` | ✅ | ✅ | ✅ | ⚠️ | ❌ | N/A | N/A | N/A |
| `ProfileScreen` | ✅ | N/A | ✅ | ❌ | ❌ | ❌ | ⚠️ | N/A |

Debajo de la matriz, un hallazgo por cada ⚠️/❌ explicando el mecanismo:

- **`HomeScreen` — Error (⚠️)**: `src/screens/HomeScreen.js:40` — el `catch` muestra siempre "Ocurrió un error" sin distinguir un fallo de red de un 500 del backend.
- **`HomeScreen` — Offline (❌)**: no hay ningún chequeo de conectividad; si no hay internet, cae en el mismo `catch` genérico de arriba.
- **`ProfileScreen` — Expired (⚠️)**: `src/context/AuthContext.js:31-35` — `logout()` se llama pero no hay ningún mensaje que explique al usuario por qué volvió a la pantalla de login.

Cerrar con un resumen: cuántas pantallas auditadas, cobertura promedio (cuántos de los 8 estados aplicables están en ✅), y las 2-3 pantallas con peor cobertura primero.
