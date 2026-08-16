---
name: fs-web-opengraph
description: Audita los meta tags Open Graph, Twitter Card y SEO básico de una o más URLs usando la API pública de opengraph.to (score 0-100, issues detectados, HTML sugerido), y opcionalmente aplica el fix en el código del proyecto detectando el framework (Next.js, Nuxt, Remix, Astro, HTML estático, etc.). Usar cuando el usuario pida revisar o mejorar la previsualización de un link al compartirlo, el Open Graph, el Twitter Card, o el "SEO social" de una página.
---

# fs-web-opengraph

Envoltorio sobre la API pública de [opengraph.to](https://www.opengraph.to/api): `GET https://www.opengraph.to/api/v1/og?url=<url>`. Sin autenticación, gratis, **10 solicitudes por hora por IP**, cache de 5 minutos en la API.

## Qué NO es esta skill

- No es una auditoría SEO completa (schema, sitemap, Core Web Vitals, crawlability) — para eso están las skills `seo-*`. Esta se limita a metadatos de previsualización social (OG/Twitter Card) y lo que la API de opengraph.to reporte como "SEO issues" sobre esos mismos tags.
- No reemplaza al servidor MCP de opengraph.to si el usuario ya lo tiene configurado — si existe una tool MCP equivalente disponible en la sesión, preferirla sobre `curl` a la REST API directamente.
- La API necesita una URL **públicamente accesible**. No sirve para `localhost` ni URLs internas — si el proyecto todavía no está deployado, avisar y pedir una URL de staging/preview, o limitarse a revisar el código estático de los tags sin llamar a la API.

## Rate limit

Antes de arrancar, si el usuario pide auditar más de ~6-8 URLs en una sola sesión, avisar del límite de 10/hora y proponer priorizar cuáles importan más o repartir en más de una tanda. Si la API devuelve "Rate limit exceeded", frenar ahí, reportar cuántas URLs se llegaron a auditar, y sugerir reintentar pasado un rato — no hay retry automático ni backoff, es simplemente esperar a que rote la ventana.

## Proceso

1. **Confirmar la(s) URL(s)** a auditar con el usuario si no las dio explícitamente.
2. **Llamar a la API por cada URL**:
   ```
   curl -s "https://www.opengraph.to/api/v1/og?url=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))" '<url>')"
   ```
   Parsear del JSON: `score`, `summary`, lista de `issues`, y el HTML sugerido para los meta tags.
3. **Reportar por URL** (ver formato abajo). Si esto es todo lo que pidió el usuario, terminar acá.
4. **Si el usuario pide aplicar el fix en el proyecto local**:
   a. Detectar el framework (leer `package.json`: `next`, `nuxt`, `@remix-run/*`, `astro`, `@sveltejs/kit`, `vite`, o ausencia de todo eso → HTML estático).
   b. Ubicar dónde viven los meta tags actuales según `assets/frameworks-reference.md`.
   c. Traducir el HTML sugerido por la API a la forma idiomática del framework (objeto `metadata`, `useSeoMeta`, `meta()`, etc.) — **nunca pegar `<meta>` crudo** en frameworks que tienen API de metadata dedicada (ver la tabla del asset).
   d. Mostrar el diff (tags actuales vs. propuestos) y **esperar confirmación antes de escribir** — mismo criterio que el resto de las skills del repo, nunca sobreescribir código existente sin mostrarlo antes.
   e. Aplicar solo los tags que la API marcó como faltantes o incorrectos; no tocar el resto del archivo.
   f. Si la URL ya circuló antes del fix (compartida en algún chat, post o mensaje), avisar que el código arreglado no alcanza por sí solo: Facebook, Instagram y LinkedIn cachean el preview viejo hasta que alguien fuerza un re-scrape manualmente con su propia sesión logueada — algo que esta skill no puede hacer por el usuario. Indicarle que visite [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) (puede necesitar tocar "Scrape Again" dos o tres veces) y el [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) (cache de hasta 7 días) después de deployar el fix. Para X/Twitter no hay forma de verificar el preview real: el validador oficial está deprecado desde 2022 y no fue reemplazado.

## Formato del reporte

Por cada URL:

```
### https://ejemplo.com — Score: 62/100
```

| Tag | Estado | Valor actual | Sugerido |
|---|---|---|---|
| `og:image` | ❌ falta | — | `https://ejemplo.com/og.png` (usar imagen 1200x630) |
| `og:description` | ⚠️ | "Bienvenido a mi sitio" (genérico) | Descripción específica de la página, 50-160 caracteres |
| `twitter:card` | ✅ | `summary_large_image` | — |

Estado: ✅ correcto / ⚠️ presente pero mejorable / ❌ falta.

Si se auditó más de una URL, cerrar con un resumen: score promedio, y las 2-3 URLs con peor score primero. Si se aplicaron fixes, listar qué archivos se modificaron.
