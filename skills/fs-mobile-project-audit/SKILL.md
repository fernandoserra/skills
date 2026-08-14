---
name: fs-mobile-project-audit
description: Orquesta las skills fs-mobile-* de auditoría (seguridad, UI/UX, design system, accesibilidad, responsive, performance, API, estados de pantalla, i18n, storage) sobre un proyecto Expo/React Native y devuelve un reporte único consolidado, con severidad Critical/High/Medium/Good y un score /100. Usar cuando el usuario pida una auditoría completa/general del proyecto, un "health check" de la app, o un reporte único que junte varias auditorías fs-mobile-* en vez de correrlas una por una.
---

# fs-mobile-project-audit

Orquesta las demás skills `fs-mobile-*` de auditoría sobre un mismo proyecto Expo/React Native y consolida los resultados en un único reporte priorizado, con score.

## Qué NO es esta skill

No reemplaza correr una skill de dominio individual cuando se necesita el detalle completo (cada control, con evidencia línea por línea) — esta skill prioriza una vista consolidada y accionable, no repite las 150+ filas de controles de las diez skills. Para profundizar en un dominio puntual, correr esa skill directamente. Tampoco cubre dominios sin skill propia todavía (testing, analytics, específicos de iOS/Android, release/CI, ASO) — ver `assets/domains.md`.

## Fuente de los dominios

`assets/domains.md` — qué skill/checklist corresponde a cada dominio, la rúbrica de severidad y la fórmula de score. Leerlo antes de arrancar.

## Proceso

1. **Confirmar que es un proyecto Expo/React Native** (`package.json` con dependencia `expo`/`react-native`).
2. **Detectar qué dominios están disponibles**: ubicar el directorio donde está instalada esta skill y buscar carpetas hermanas `fs-mobile-<dominio>` al mismo nivel, según la tabla de `assets/domains.md`. Un dominio sin carpeta hermana instalada queda excluido del reporte — nunca inventar hallazgos para un dominio que no se pudo correr.
3. **Confirmar alcance con el usuario** si no lo especificó ya en el pedido (ej. "audita todo" vs. "solo seguridad y performance") — preguntar qué dominios incluir, default: todos los disponibles.
4. **Ejecutar cada dominio incluido**:
   - Si el entorno soporta delegar en subagentes/tareas en paralelo, delegar cada dominio a uno distinto, briefeado con el `SKILL.md` y el checklist de esa skill puntual, pidiéndole que devuelva su tabla de resultados en formato compacto (control/estado/evidencia corta/sugerencia) — así el contexto de la conversación principal no se infla con diez auditorías completas en paralelo.
   - Si no hay soporte de subagentes, recorrer cada dominio secuencialmente en la misma conversación, aplicando el `SKILL.md`/checklist de esa skill como si se la invocara directamente.
5. **Clasificar severidad**: cada hallazgo ❌/⚠️ que devolvió cada dominio se reclasifica en 🔴/🟠/🟡 según la rúbrica de `assets/domains.md` (impacto real, no el símbolo crudo de la skill de origen). Los ✅ se cuentan como 🟢.
6. **Calcular el score** con la fórmula de `assets/domains.md`.
7. **No aplicar fixes automáticamente** — el reporte es de lectura, no dispara correcciones salvo pedido explícito posterior.

## Formato del reporte

```
MOBILE PROJECT AUDIT
────────────────────
🔴 Critical    N problemas
🟠 High        N problemas
🟡 Medium      N problemas
🟢 Good        N áreas correctas

Score: XX/100
```

Seguido de una tabla por dominio:

| Dominio | 🔴 | 🟠 | 🟡 | 🟢 | No instalado |
|---|---|---|---|---|---|
| Seguridad | 1 | 2 | 3 | 11 | |
| Performance | 0 | 1 | 4 | 6 | |
| Testing | | | | | ✅ (sin skill instalada) |

Y luego el detalle de cada hallazgo 🔴/🟠 (los de mayor severidad primero, con `archivo:línea` y el mecanismo/causa igual que hace cada skill de origen — no diluir la evidencia al consolidar). Los 🟡 pueden resumirse en una lista más corta al final si son muchos.

Cerrar con: qué dominios se corrieron, cuáles quedaron fuera por no estar instalados, y — si el usuario pidió explícitamente priorizar — cuáles 2-3 hallazgos 🔴 atacar primero.
