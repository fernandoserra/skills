# Dónde viven los meta tags OG/Twitter por framework

La API de opengraph.to devuelve un snippet de HTML sugerido (`<meta property="og:..." ...>`). Ese HTML **no se pega literal** en la mayoría de los frameworks modernos — hay que traducirlo a la forma en que cada uno genera el `<head>`. Nunca escribir `<meta>` crudo dentro de un componente si el framework tiene una API dedicada: rompe la deduplicación/merge que el framework hace entre layouts anidados.

| Framework | Dónde mirar | Cómo se setea |
|---|---|---|
| Next.js (App Router) | `app/**/layout.tsx` o `app/**/page.tsx` | `export const metadata: Metadata = { title, description, openGraph: { title, description, images, url, type }, twitter: { card, title, description, images } }`. Si es dinámico, usar `generateMetadata()`. |
| Next.js (Pages Router) | `pages/_document.tsx` (tags globales) o `next/head` dentro de cada página | `<Head><meta property="og:title" content="..." /></Head>` — acá sí es HTML/JSX directo. |
| Nuxt 3 | `app.vue`, `nuxt.config.ts` (`app.head`), o `useSeoMeta()`/`useHead()` en cada página | `useSeoMeta({ ogTitle, ogDescription, ogImage, twitterCard, twitterTitle, ... })` — preferir sobre `useHead` crudo. |
| Remix | `app/root.tsx` o export `meta` en cada ruta | `export const meta: MetaFunction = () => [{ property: "og:title", content: "..." }, ...]`. |
| Astro | `.astro` layout, típicamente `src/layouts/*.astro` en el `<head>` | HTML directo dentro del `<head>` del layout (Astro no tiene API de metadata propia). |
| SvelteKit | Cada `+page.svelte` | `<svelte:head><meta property="og:title" content="..." /></svelte:head>`. |
| Vite/React SPA sin meta-framework | `index.html` en la raíz | HTML directo en el `<head>` — recordar que un SPA sin SSR no sirve OG tags dinámicos por ruta a los crawlers de redes sociales salvo que haya prerender/SSR. |
| HTML estático / sitio sin build | El propio `.html` de cada página | HTML directo en el `<head>`. |
| WordPress u otro CMS | No es código del repo — vía plugin (Yoast, Rank Math) o theme `header.php` | Reportar el fix pero no aplicar: son sistemas de config, no archivos versionados típicamente accesibles. |

## Tags que la API típicamente evalúa

Mínimos Open Graph: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`.
Twitter Card: `twitter:card` (`summary_large_image` recomendado si hay imagen grande), `twitter:title`, `twitter:description`, `twitter:image`.
SEO básico que la API también puede marcar: `<title>`, `<meta name="description">`, tamaño/aspect ratio de `og:image` (ideal 1200x630).
