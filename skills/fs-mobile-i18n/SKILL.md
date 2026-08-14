---
name: fs-mobile-i18n
description: Audita internacionalización en una app Expo/React Native — textos hardcodeados, pluralización, formato de fechas/moneda, zona horaria y soporte RTL. Revisión estática de código. Usar cuando el usuario pida auditar/preparar una app móvil para múltiples idiomas, revisar textos hardcodeados, formato de fechas/moneda por locale, o soporte de idiomas RTL (árabe, hebreo).
---

# fs-mobile-i18n

Auditoría **estática** de internacionalización de una app Expo/React Native — no traduce contenido ni genera diccionarios de idiomas, audita si el código está *preparado* para soportarlos.

## Qué NO es esta skill

No traduce textos ni genera archivos de idioma (`es.json`, `en.json`, etc.) — eso requiere decisiones de copy que le corresponden al usuario o a un traductor. Señala dónde falta el mecanismo (`t("...")`) y qué texto quedaría por traducir, no inventa las traducciones.

## Fuente de verdad de los controles

`assets/i18n-checklist.md` — 7 categorías (mecanismo centralizado, textos hardcodeados, pluralización, fechas, moneda, zona horaria, RTL), 9 controles, todos verificables por código.

## Proceso

1. **Ubicar el mecanismo de i18n del proyecto**: `package.json` (`i18next`/`react-i18next`/`expo-localization`/etc.), archivos de diccionario si existen (`locales/`, `i18n/`), `app.config.js`/`app.json` (idiomas declarados, en particular si hay alguno RTL como `ar` o `he`).
2. **Recorrer `assets/i18n-checklist.md` categoría por categoría**, aplicando cada control sobre `src/`. Si no hay ningún mecanismo de i18n (`I18N-SETUP-1` ❌), igual recorrer el resto marcando cuántos strings hardcodeados hay como evidencia del volumen de trabajo pendiente si se decide internacionalizar.
3. **Registrar por control**:
   - Estado: ✅ cumple / ⚠️ cumple parcialmente / ❌ no cumple / N/A no aplica (ej. `I18N-RTL` si la app no declara idiomas RTL)
   - Evidencia: `archivo:línea` concreto (para `I18N-STRINGS-1`, si hay muchos casos, listar los primeros y dar un conteo total en vez de listar cada uno)
   - Sugerencia breve si el estado es ⚠️ o ❌
4. **No aplicar cambios automáticamente** — reportar primero y esperar confirmación, salvo que el usuario ya haya pedido explícitamente que se corrija (y en ese caso, migrar a `t("...")` con claves razonables, no traducir el contenido).

## Formato del reporte

Una tabla por categoría, mismo estilo que las demás skills de auditoría:

| Control | Estado | Evidencia | Sugerencia |
|---|---|---|---|
| I18N-SETUP-1 | ❌ | No se encontró `i18next`/`expo-localization` ni ningún sistema de diccionarios en `package.json` | Evaluar `react-i18next` + `expo-localization` como base |
| I18N-STRINGS-1 | ❌ | 34 ocurrencias de texto literal en `src/screens/` (ej. `HomeScreen.js:12`, `ProfileScreen.js:8`) | Migrar a `t("...")` una vez definido el mecanismo de `I18N-SETUP-1` |
| I18N-CURRENCY-1 | ⚠️ | `src/utils/format.js:5` — `` `$${price}` `` hardcodeado, no usa `Intl.NumberFormat` | Reemplazar por `Intl.NumberFormat(locale, { style: "currency", currency: "USD" }).format(price)` |

Cerrar con un resumen: cuántos controles evaluados, cuántos ✅/⚠️/❌/N/A, y si `I18N-SETUP-1` es ❌, aclarar que el resto de los hallazgos son "volumen de trabajo pendiente" más que bugs puntuales — la prioridad es resolver el mecanismo primero.
