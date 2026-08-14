---
name: fs-mobile-api
description: Audita el diseño de networking/API de una app Expo/React Native — cliente HTTP centralizado, timeouts, retry con backoff, manejo de errores, refresh token, paginación, cache, cancelación de requests y conciencia de conectividad. Revisión estática de código (grep de patrones fetch/axios). Usar cuando el usuario pida auditar/mejorar el cliente de API, revisar manejo de refresh token, timeouts, retry, paginación o caching de requests en una app móvil.
---

# fs-mobile-api

Auditoría **estática** del diseño de networking de una app Expo/React Native — buenas prácticas de cliente HTTP, no seguridad de red (eso es `fs-mobile-security`, categoría `MASVS-NETWORK`) ni causas de lentitud (eso es `fs-mobile-performance`, categoría `PERF-NETWORK`).

## Relación con otras skills

- `fs-mobile-performance` (`PERF-NETWORK`) mira los mismos patrones de red desde el ángulo de performance: por qué algo es lento o desperdicia trabajo. Esta skill los mira desde el ángulo de diseño/robustez del cliente API: si el mecanismo (retry, cache, refresh, cancelación) existe y está bien construido. Quedan deliberadamente separadas — puede haber hallazgos parecidos con distinto enfoque si se corren ambas.
- `fs-mobile-security` (`MASVS-NETWORK`) audita que el tráfico use TLS y no tenga cleartext/pinning ausente — no se solapa con esta skill.

## Fuente de verdad de los controles

`assets/api-checklist.md` — 10 categorías (cliente centralizado, timeouts, retry, errores, refresh token, paginación, cache, cancelación, conciencia de conectividad, organización de endpoints), todas verificables por código estático.

## Proceso

1. **Ubicar el cliente HTTP del proyecto**: buscar un archivo central de networking (`src/utils/http.js` si viene del preset `classic-stack` de `fs-mobile-scaffold`, o `src/api/`, `src/services/`), y si no existe ninguno, confirmarlo explícitamente (`API-CLIENT-1` sale ❌ directo).
2. **Recorrer `assets/api-checklist.md` categoría por categoría**, aplicando cada control sobre el cliente central y sobre las pantallas que hacen fetch directo si no hay uno.
3. **Registrar por control**:
   - Estado: ✅ cumple / ⚠️ cumple parcialmente / ❌ no cumple / N/A no aplica (ej. app sin ninguna operación no idempotente relevante para `API-RETRY-2`)
   - Evidencia: `archivo:línea` concreto
   - Sugerencia breve si el estado es ⚠️ o ❌
4. **No aplicar fixes automáticamente** — reportar primero y esperar confirmación, salvo que el usuario ya haya pedido explícitamente que se corrija.

## Formato del reporte

Una tabla por categoría, mismo estilo que las demás skills de auditoría:

| Control | Estado | Evidencia | Sugerencia |
|---|---|---|---|
| API-TIMEOUT-1 | ❌ | `src/utils/http.js:22` — `fetch(url, {...})` sin `AbortController`/`timeout` | Envolver el `fetch` con un `AbortController` y `setTimeout` (ej. 15s), abortando y lanzando un error distinguible de un 5xx |
| API-REFRESH-1 | ❌ | `src/utils/http.js:27-30` — un 401 se propaga como error genérico, no dispara refresh | Agregar interceptor que detecte 401, llame al endpoint de refresh y reintente una vez antes de desloguear |

Cerrar con un resumen: cuántos controles evaluados, cuántos ✅/⚠️/❌/N/A, y los 2-3 hallazgos de mayor impacto primero (priorizar lo que puede causar pérdida de datos del usuario o logouts inesperados, no detalles menores).
