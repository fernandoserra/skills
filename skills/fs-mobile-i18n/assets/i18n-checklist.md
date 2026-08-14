# Checklist de internacionalización para Expo/React Native

Todos los controles son 📄 **estática** (verificables leyendo código).

## I18N-SETUP (mecanismo centralizado)

| ID | Foco | Qué revisar en Expo/RN |
|---|---|---|
| I18N-SETUP-1 | Existe un mecanismo de i18n centralizado. | Presencia de `i18next`/`react-i18next`, `expo-localization` + `intl-messageformat`/FormatJS, o un sistema custom de diccionarios — vs. ausencia total, con texto hardcodeado disperso por todo el código. Si no existe nada, el resto de los controles de esta categoría van a salir ❌ casi siempre. |

## I18N-STRINGS (textos hardcodeados)

| ID | Foco | Qué revisar en Expo/RN |
|---|---|---|
| I18N-STRINGS-1 | Texto visible al usuario pasa por la función de traducción, no está hardcodeado en el JSX. | `<Text>Comprar ahora</Text>` literal, o `placeholder="Buscar..."`/`title="Guardar"` con string fijo, en vez de `t("checkout.buy_now")` (o equivalente). |
| I18N-STRINGS-2 | Mensajes de error/validación del lado del cliente también pasan por i18n. | Strings de validación hechos a mano (`"Este campo es requerido"`) sin `t()` — distinto de mensajes que vienen del backend, que no controla esta skill. |

## I18N-PLURALIZATION (pluralización)

| ID | Foco | Qué revisar en Expo/RN |
|---|---|---|
| I18N-PLURALIZATION-1 | La pluralización usa las reglas del idioma, no concatenación manual. | `` `${count} ${count === 1 ? "item" : "items"}` `` hecho a mano (solo cubre singular/plural en inglés/español, rompe en idiomas con más formas plurales) en vez de `t("items", { count })` con las reglas de pluralización de la librería de i18n. |

## I18N-DATES (fechas)

| ID | Foco | Qué revisar en Expo/RN |
|---|---|---|
| I18N-DATES-1 | Las fechas se formatean con una librería locale-aware, no con construcción manual de string. | `` `${day}/${month}/${year}` `` armado a mano (asume DD/MM/AAAA, incorrecto en locales que usan MM/DD/AAAA) en vez de `Intl.DateTimeFormat` o `dayjs`/`date-fns` con el locale del usuario. |

## I18N-CURRENCY (moneda)

| ID | Foco | Qué revisar en Expo/RN |
|---|---|---|
| I18N-CURRENCY-1 | Los montos se formatean con `Intl.NumberFormat` (o equivalente) considerando moneda y locale. | `` `$${price}` `` o `` `${price} USD` `` hardcodeado en vez de `Intl.NumberFormat(locale, { style: "currency", currency })`, que además resuelve separador decimal/de miles según el locale. |

## I18N-TIMEZONE (zona horaria)

| ID | Foco | Qué revisar en Expo/RN |
|---|---|---|
| I18N-TIMEZONE-1 | Las fechas/horas se guardan y transmiten en UTC, y se muestran convertidas a la zona horaria local del dispositivo. | Timestamps guardados/enviados sin normalizar a UTC, o mostrados tal cual vienen del backend sin convertir — un evento a las 20:00 puede mostrarse distinto según en qué timezone esté el usuario si no se maneja explícitamente. |

## I18N-RTL (right-to-left)

| ID | Foco | Qué revisar en Expo/RN |
|---|---|---|
| I18N-RTL-1 | El layout no asume left-to-right cuando la app declara soporte de idiomas RTL (árabe, hebreo). | Si `app.config.js`/`app.json` no declara idiomas RTL entre los soportados, este control es N/A. Si los declara: grep de `marginLeft`/`paddingLeft`/`left:` hardcodeados en vez de `marginStart`/`paddingStart` o lógica condicionada a `I18nManager.isRTL`. |
| I18N-RTL-2 | Íconos direccionales (flecha de "volver", "siguiente") se espejan en RTL. | Ícono de flecha fijo (mismo `name`/rotación) sin condicional por `I18nManager.isRTL` cuando la app soporta RTL. |

## Resumen de categorías

SETUP, STRINGS, PLURALIZATION, DATES, CURRENCY, TIMEZONE, RTL — 7 categorías, 9 controles.
