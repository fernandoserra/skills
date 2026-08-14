---
name: fs-web-security
description: Audita una aplicación web contra el OWASP Web Security Testing Guide (WSTG) mediante revisión estática de código/configuración y checks pasivos no destructivos contra una URL. Cubre las 12 categorías del WSTG (info gathering, config, identidad, auth, autorización, sesión, input validation, error handling, criptografía, lógica de negocio, client-side, API). Usar cuando el usuario pida una auditoría de seguridad web, un análisis OWASP/WSTG, o revisar vulnerabilidades de una app/API web.
---

# fs-web-security

Auditoría de una app web contra el [OWASP WSTG](https://owasp.org/www-project-web-security-testing-guide/) mediante dos técnicas, **nunca** envío de payloads de explotación:

1. **Revisión estática** — leer código y configuración del repo.
2. **Checks pasivos** contra una URL — solo requests de lectura (GET/HEAD) a rutas normales o conocidas (headers de respuesta, TLS, `robots.txt`, rutas típicamente expuestas por error). Nada de fuzzing, inyección de payloads (SQLi/XSS/etc.), ni cualquier cosa que altere estado o pruebe explotar una vulnerabilidad.

## Qué NO es esta skill

- **No es un pentest.** El WSTG real tiene ~90 tests repartidos en 12 categorías, muchos de ellos (la mayoría de `WSTG-INPV`, todo `WSTG-BUSL`) solo se pueden ejecutar mandando payloads activos contra una app corriendo y evaluando el comportamiento — eso queda fuera de esta skill a propósito, no por limitación técnica sino porque una skill pública no debe traer capacidad de explotación activa sin un engagement de por medio.
- **No cubre 1:1 los ~90 tests oficiales.** `assets/wstg-checklist.md` es un **subconjunto curado** de checks verificables por código o de forma pasiva — no una traducción completa del estándar. Para cobertura exhaustiva o testing activo, remitir a la guía oficial y herramientas de pentest dedicadas (Burp Suite, OWASP ZAP), no a esta skill.
- **Antes de correr cualquier check contra una URL en vivo**, confirmar explícitamente con el usuario que es una app propia o que tiene autorización para probarla. Si no está claro, preguntar antes de tocar nada en vivo — la revisión estática de código no tiene este problema y se puede hacer siempre.

## Proceso

1. **Detectar el stack**: leer `package.json` (¿`next`, `express`, `fastify`, otro?). Si es Next.js/Node, usar la columna "Dónde mirar (Next.js/Node)" de `assets/wstg-checklist.md` para ubicar archivos concretos (`next.config.js`, `middleware.ts`, rutas de API, etc.). Si es otro stack o no se detecta ninguno conocido, usar la columna "Qué revisar (genérico)" y hacer grep amplio del patrón sobre todo el árbol del proyecto.
2. **Recorrer `assets/wstg-checklist.md` categoría por categoría**, aplicando cada check contra el código.
3. **Si el usuario dio una URL y confirmó autorización**, sumar los checks pasivos marcados como tal en el checklist (headers de seguridad, TLS, rutas expuestas) — con requests de solo lectura.
4. **Registrar por check**:
   - Estado: ✅ cumple / ⚠️ cumple parcialmente / ❌ no cumple / 🔍 fuera de alcance estático (requiere testing activo/manual) / N/A no aplica
   - Evidencia: `archivo:línea`, header de respuesta observado, o "no se encontró código relacionado"
   - Remediación breve si el estado es ⚠️ o ❌
5. **No aplicar fixes automáticamente** — reportar primero y esperar confirmación.

## Formato del reporte

Una tabla por categoría, mismo estilo que `fs-mobile-security`:

| Check | Estado | Evidencia | Remediación |
|---|---|---|---|
| Cookies de sesión con `Secure`/`HttpOnly`/`SameSite` | ⚠️ | `middleware.ts:22` — falta `SameSite` | Agregar `SameSite=Lax` o `Strict` según el flujo |

Cerrar con un resumen: cuántos checks evaluados, cuántos ✅/⚠️/❌/🔍, y los 2-3 hallazgos de mayor riesgo primero.
