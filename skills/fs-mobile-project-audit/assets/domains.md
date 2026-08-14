# Dominios que orquesta fs-mobile-project-audit

Cada dominio corresponde a una skill hermana (`fs-mobile-<dominio>`) ya instalada en la misma colección. Si una carpeta hermana no está presente, ese dominio se marca **no instalado** y se excluye del reporte — nunca se inventan hallazgos para un dominio que no se pudo correr.

| Dominio | Skill | Checklist fuente | Qué cubre |
|---|---|---|---|
| Seguridad | `fs-mobile-security` | `assets/masvs-checklist.md` | OWASP MASVS L1: storage, cripto, auth, red, plataforma, código, privacidad. |
| UI/UX | `fs-mobile-ui-ux` | `assets/ui-ux-checklist.md` | Jerarquía visual, espaciado, touch, navegación, estados, feedback, consistencia. |
| Design system | `fs-mobile-design-system` | `assets/tokens-reference.md` | Drift de tokens (color/tipografía/spacing/radius/sombras) y componentes base reimplementados. |
| Accesibilidad | `fs-mobile-accessibility` | `assets/wcag-mobile-checklist.md` | WCAG 2.1/2.2 AA: labels, screen reader, Dynamic Type, contraste, touch, navegación, formularios. |
| Responsive | `fs-mobile-responsive` | `assets/responsive-checklist.md` | Tamaños de teléfono, tablets, orientación, safe area, notch/Dynamic Island, teclado. |
| Performance | `fs-mobile-performance` | `assets/performance-checklist.md` | Renders, listas, imágenes, memoria, navegación, animaciones, threading, network, bundle. |
| API/networking | `fs-mobile-api` | `assets/api-checklist.md` | Cliente HTTP, timeouts, retry, errores, refresh token, paginación, cache, cancelación. |
| Estados de pantalla | `fs-mobile-state-management-ux` | `assets/states-checklist.md` | Cobertura de los 8 estados (loading/empty/success/error/offline/unauthorized/expired/permission). |
| i18n | `fs-mobile-i18n` | `assets/i18n-checklist.md` | Textos hardcodeados, pluralización, fechas, moneda, timezone, RTL. |
| Storage | `fs-mobile-storage` | `assets/storage-checklist.md` | Elección de tecnología, consistencia de acceso, serialización, cache, limpieza. |

No incluye testing, analytics, específicos de iOS/Android, release/CI, ni ASO — no existen skills `fs-mobile-*` para esos dominios todavía. Si se agregan más adelante, sumarlas a esta tabla.

## Rúbrica de severidad

Las skills de dominio no traen severidad propia (reportan ✅/⚠️/❌/N/A y símbolos de verificación propios de cada una). Clasificar cada hallazgo ❌/⚠️ según su **impacto real**, no según el símbolo crudo:

- 🔴 **Critical** — riesgo de seguridad real (dato sensible expuesto, auth rota), fuga de datos entre usuarios, o algo que rompe un flujo core (login, checkout, la función principal de la app).
- 🟠 **High** — rompe o degrada seriamente una funcionalidad, pero sin exposición de seguridad directa (ej. falta refresh token y desloguea sin avisar, un estado de error no manejado dejando la pantalla en blanco, jank severo en una lista de uso constante).
- 🟡 **Medium** — inconsistencia o deuda de calidad sin daño directo al usuario (drift de design system, texto hardcodeado, falta un `getItemLayout`).
- 🟢 **Good** — controles ✅, se cuentan como "áreas correctas", no como problemas.

Los N/A no cuentan en ningún bucket.

## Fórmula de score

```
score = 100 − (10 × Critical) − (4 × High) − (1 × Medium)
```

Piso en 0. No usar ninguna otra fórmula ni "ajustar a ojo" — tiene que ser reproducible si se vuelve a correr sobre el mismo estado del código.
