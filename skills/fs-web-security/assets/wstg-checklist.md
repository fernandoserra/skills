# WSTG — checklist curado (estático + pasivo)

**Importante:** este es un subconjunto curado y práctico, no una traducción 1:1 de los ~90 tests oficiales del WSTG (muchos requieren fuzzing/payloads activos contra una app corriendo, fuera del alcance de esta skill). Fuente completa: https://owasp.org/www-project-web-security-testing-guide/ · https://github.com/OWASP/wstg

Cada check indica si es **estático** (código/config) o **pasivo** (requiere URL + autorización confirmada).

## WSTG-INFO — Information Gathering

| Check | Tipo | Qué revisar (genérico) | Dónde mirar (Next.js/Node) |
|---|---|---|---|
| No hay fuga de versión/framework en headers | Pasivo | Header `Server`/`X-Powered-By` revelando versión exacta | `next.config.js` → `poweredByHeader: false`; headers custom en middleware |
| No hay archivos sensibles expuestos | Pasivo | Requests de solo lectura a `/.env`, `/.git/config`, `.git/HEAD` | Confirmar que `public/` no incluye `.env*` ni carpetas de build con source maps de producción |
| Source maps no expuestos en producción | Estático + pasivo | Build de producción sin `.map` públicos, o servidos sin protección | `next.config.js` → `productionBrowserSourceMaps` (debería ser `false` salvo necesidad justificada) |

## WSTG-CONF — Configuration and Deployment Management

| Check | Tipo | Qué revisar (genérico) | Dónde mirar (Next.js/Node) |
|---|---|---|---|
| Headers de seguridad presentes | Pasivo + estático | `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`/`frame-ancestors`, `Strict-Transport-Security`, `Referrer-Policy`, `Permissions-Policy` | `next.config.js` → función `headers()`, o `middleware.ts` |
| CORS no permisivo | Estático + pasivo | `Access-Control-Allow-Origin: *` combinado con `Access-Control-Allow-Credentials: true` | Config de CORS en rutas de API (`app/api/**/route.ts`, `pages/api/**`) o middleware |
| Sin directory listing / archivos de ejemplo | Pasivo | Rutas típicas expuestas por error (`/admin`, `/.well-known`, backups `.zip`/`.sql` en `public/`) | Revisar contenido de `public/` commiteado al repo |
| Métodos HTTP innecesarios deshabilitados | Pasivo | `OPTIONS`/`TRACE` habilitados sin necesidad | Handlers de API que solo deberían responder a métodos específicos |

## WSTG-IDNT — Identity Management

| Check | Tipo | Qué revisar (genérico) | Dónde mirar (Next.js/Node) |
|---|---|---|---|
| Sin enumeración de usuarios | Estático | Mensajes de error idénticos para "usuario no existe" vs "contraseña incorrecta" en login/registro/reset de password | Handler de login/registro — comparar los `return`/mensajes de error |
| Política de contraseña razonable | Estático | Largo mínimo, no solo longitud sin complejidad, sin límite máximo absurdamente bajo | Validación en el endpoint de registro/cambio de contraseña (Zod/Yup schema u otra validación) |
| Rate limiting en endpoints de auth/registro | Estático | Middleware o librería de rate-limit aplicada a login, registro, reset de password | Buscar uso de `rate-limiter`, Upstash, o equivalente en las rutas sensibles |

## WSTG-ATHN — Authentication

| Check | Tipo | Qué revisar (genérico) | Dónde mirar (Next.js/Node) |
|---|---|---|---|
| Credenciales solo viajan por HTTPS | Estático + pasivo | Ningún form/fetch de login apunta a `http://`; sitio fuerza HTTPS | `NEXTAUTH_URL`/`EXPO_PUBLIC_API_URL` u equivalentes siempre `https://` |
| Sin credenciales hardcodeadas/por defecto | Estático | Usuarios/contraseñas de prueba o admin hardcodeados en código o seeds | Grep de `password`, `admin123`, etc. en el repo |
| Passwords hasheadas con algoritmo fuerte | Estático | `bcrypt`/`argon2`/`scrypt`, nunca MD5/SHA1 sin salt | Dependencias (`package.json`) y su uso real en el código de auth |
| Cookie de sesión/JWT con flags correctos | Estático + pasivo | `Secure`, `HttpOnly`, `SameSite` presentes en la cookie de sesión | Config de NextAuth/Auth.js, o `Set-Cookie` manual en API routes |
| Token de reset de password de un solo uso y expira | Estático | El token se invalida tras usarse y tiene TTL corto | Lógica de "forgot password" / tabla de tokens |

## WSTG-ATHZ — Authorization

| Check | Tipo | Qué revisar (genérico) | Dónde mirar (Next.js/Node) |
|---|---|---|---|
| Control de acceso server-side, no solo UI | Estático | Rutas/API que ocultan un botón en el cliente pero no validan el permiso en el servidor | Cada handler de API que modifica/lee datos sensibles — ¿verifica rol/dueño antes de actuar? |
| Protección contra IDOR | Estático | Un endpoint que recibe un `id` en la URL/body verifica que el recurso pertenece al usuario autenticado antes de devolverlo/modificarlo | Handlers tipo `/api/orders/[id]`, `/api/users/[id]` — buscar si comparan `resource.userId === session.user.id` |
| Sin path traversal en endpoints que sirven archivos | Estático | Inputs de nombre de archivo/ruta se validan/sanitizan antes de usarse en `fs.readFile` o similar | Cualquier endpoint que arme una ruta de archivo a partir de un parámetro del request |

## WSTG-SESS — Session Management

| Check | Tipo | Qué revisar (genérico) | Dónde mirar (Next.js/Node) |
|---|---|---|---|
| Session ID se regenera tras login | Estático | Nueva sesión/token emitido al autenticarse, no se reutiliza uno anterior | Config de la librería de sesión/auth usada |
| Expiración de sesión configurada | Estático | TTL razonable, no sesiones infinitas por defecto | Config de NextAuth (`session.maxAge`) o JWT `exp` |
| Protección CSRF en requests que cambian estado | Estático | Token CSRF, o cookies `SameSite=Lax/Strict` + verificación de origen en mutaciones (POST/PUT/DELETE) | Middleware de CSRF, o si se depende solo de `SameSite` confirmar que cubre todos los métodos mutables |

## WSTG-INPV — Input Validation (subconjunto — la mayoría del estándar real requiere fuzzing activo, fuera de alcance)

| Check | Tipo | Qué revisar (genérico) | Dónde mirar (Next.js/Node) |
|---|---|---|---|
| Sin SQL armado por concatenación de strings | Estático | Queries construidas con template strings/concatenación usando input del usuario en vez de queries parametrizadas/ORM | Uso de Prisma/Drizzle/Knex vs. `db.query(\`SELECT ... ${input}\`)` |
| Salida escapada antes de renderizar contenido de usuario (XSS) | Estático | `dangerouslySetInnerHTML`, `innerHTML`, o `eval` con datos no confiables sin sanitizar | Grep de `dangerouslySetInnerHTML` en componentes React/Next |
| Validación server-side de todo input, no solo cliente | Estático | Cada API route valida el body/query (Zod/Yup/manual) en vez de confiar en la validación del formulario del cliente | Handlers de API — ¿hay un `schema.parse()`/equivalente antes de usar el input? |
| Sin SSRF en fetches server-side a URLs de usuario | Estático | El servidor hace `fetch()`/`axios` a una URL provista por el usuario sin allowlist de dominios | Cualquier endpoint tipo "importar desde URL", webhooks, proxies |
| Sin command injection | Estático | `exec`/`spawn`/`execSync` de Node con input no sanitizado interpolado en el comando | Grep de `child_process` en el repo |
| Dependencias sin CVEs conocidos | Estático | `npm audit` limpio o con solo vulnerabilidades de bajo riesgo aceptadas conscientemente | Correr `npm audit` / revisar Dependabot |

## WSTG-ERRH — Error Handling

| Check | Tipo | Qué revisar (genérico) | Dónde mirar (Next.js/Node) |
|---|---|---|---|
| Sin stack traces ni info interna en errores de producción | Estático + pasivo | Página/respuesta de error genérica al usuario, detalle completo solo en logs del servidor | `next.config.js` en modo producción; handler global de errores en API routes |
| Respuestas de error consistentes (no filtran existencia de recursos) | Estático | Mismo formato de error para "no autorizado" y "no existe" en endpoints sensibles | Comparar respuestas 401/403/404 de un mismo endpoint |

## WSTG-CRYP — Weak Cryptography

| Check | Tipo | Qué revisar (genérico) | Dónde mirar (Next.js/Node) |
|---|---|---|---|
| Todo el tráfico es HTTPS + HSTS | Pasivo | Header `Strict-Transport-Security` presente, sin redirect a HTTP en ningún punto | Config del hosting/CDN, o header seteado en `next.config.js`/middleware |
| Sin algoritmos débiles/obsoletos | Estático | MD5/SHA1/DES para algo sensible (passwords, tokens, firmas) | Grep de `crypto.createHash('md5'`/`'sha1'` en el repo |
| Secrets fuera del código | Estático | API keys/claves de cifrado en variables de entorno, no hardcodeadas ni commiteadas | `.env` en `.gitignore`; grep de strings que parecen API keys en `src/` |

## WSTG-BUSL — Business Logic (mayormente fuera de alcance automatizable)

| Check | Tipo | Qué revisar (genérico) | Dónde mirar (Next.js/Node) |
|---|---|---|---|
| Validación server-side de reglas de negocio críticas | Estático | Precios, cantidades, límites o pasos de un flujo (ej. checkout) validados en el servidor, no solo confiando en lo que manda el cliente | Endpoints de checkout/pago/transferencia — ¿el monto/cantidad se recalcula server-side? |
| El resto de Business Logic | 🔍 | Requiere entender las reglas específicas de la app y probarlas manualmente (saltarse pasos de un flujo, abusar de límites, condiciones de carrera) | Marcar como "requiere revisión manual específica del negocio" — no generalizable |

## WSTG-CLNT — Client-side Testing

| Check | Tipo | Qué revisar (genérico) | Dónde mirar (Next.js/Node) |
|---|---|---|---|
| Protección contra clickjacking | Estático + pasivo | `X-Frame-Options` o CSP `frame-ancestors` | Mismo lugar que headers de CONF |
| CSP presente y razonablemente estricta | Estático + pasivo | `Content-Security-Policy` sin `unsafe-inline`/`unsafe-eval` innecesarios | `next.config.js` → `headers()` |
| Datos sensibles no viven en `localStorage`/`sessionStorage` | Estático | Tokens de sesión en storage accesible por JS (vulnerable a XSS) en vez de cookies `HttpOnly` | Grep de `localStorage.setItem` con tokens/credenciales |
| `postMessage` valida el origen | Estático | Handlers de `window.addEventListener('message', ...)` verifican `event.origin` antes de confiar en el payload | Cualquier integración con iframes/widgets embebidos |

## WSTG-APIT — API Testing

| Check | Tipo | Qué revisar (genérico) | Dónde mirar (Next.js/Node) |
|---|---|---|---|
| Toda ruta de API requiere autenticación salvo la que sea explícitamente pública | Estático | Cada handler de API verifica sesión/token antes de actuar, ninguna ruta sensible quedó sin el middleware de auth | `app/api/**/route.ts` / `pages/api/**` — ¿todas pasan por el chequeo de sesión? |
| Sin mass assignment | Estático | El body del request no se pasa entero a un `update()`/`create()` de la DB sin filtrar campos permitidos | Handlers que hacen `db.update({ ...req.body })` sin whitelist de campos |
| Rate limiting en la API | Estático | Límite de requests por IP/usuario en endpoints costosos o sensibles | Middleware de rate-limit aplicado globalmente o por ruta |

## Resumen

- **Estático**: siempre se puede correr, sin restricciones.
- **Pasivo**: requiere una URL y confirmación explícita del usuario de que tiene autorización para probarla — solo requests de lectura (GET/HEAD), nunca payloads.
- **🔍**: fuera de alcance de esta skill (requiere testing activo o revisión manual específica del negocio).
