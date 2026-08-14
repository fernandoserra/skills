---
name: fs-mobile-security
description: Audita el código fuente de una app Expo/React Native contra el OWASP MASVS (Mobile Application Security Verification Standard), nivel L1 por defecto. Revisa storage, criptografía, autenticación, red, plataforma, calidad de código y privacidad, y reporta por control con estado, evidencia y remediación. Usar cuando el usuario pida una auditoría de seguridad, un análisis OWASP/MASVS, o revisar vulnerabilidades de una app móvil.
---

# fs-mobile-security

Auditoría **estática** (lectura de código, no dinámica) de una app Expo/React Native contra el [OWASP MASVS](https://mas.owasp.org/MASVS/) v2, nivel **L1 por defecto**.

## Qué NO es esta skill

No reemplaza un pentest ni herramientas de análisis dinámico (MobSF, Frida, un dispositivo rooteado real). Varios controles del MASVS —sobre todo toda la categoría **RESILIENCE**, que es L2— solo se pueden verificar corriendo la app en runtime contra ataques reales. Esta skill puede confirmar si *existe* el código/librería correspondiente, pero no si la protección funciona. Marcar esos casos como 🔍, nunca como ✅.

## Fuente de verdad de los controles

`assets/masvs-checklist.md` trae una **interpretación de trabajo** de cada control (categoría, nivel L1/L2, foco, y qué revisar en un proyecto Expo/RN) — no es una cita textual de OWASP, porque `mas.owasp.org` renderiza el texto de cada control vía JavaScript y no es extraíble con un fetch estático. Si el usuario pide el texto oficial exacto de un control, usar `WebFetch` sobre `https://mas.owasp.org/MASVS/controls/MASVS-<ID>/` en el momento — no citar el archivo local como si fuera el texto de OWASP.

## Nivel: L1 por defecto

Evaluar solo los controles marcados `L1` en `assets/masvs-checklist.md`, salvo que el usuario pida explícitamente **L2** (razonable en apps que manejan dinero, datos financieros o de salud). Si se pide L2, sumar también esos controles — la mayoría requieren evidencia más fuerte y varios (toda `RESILIENCE`) necesitan aclarar que son solo verificables parcialmente de forma estática.

## Proceso

1. **Ubicar el árbol del proyecto**: `package.json` (confirmar que es una app Expo/RN), `app.config.js`/`app.json`, `src/` o raíz del código JS/TS, `android/app/src/main/AndroidManifest.xml`, `ios/*/Info.plist`, archivos `.env*`.
2. **Recorrer `assets/masvs-checklist.md` control por control** (solo `L1` salvo pedido de L2), aplicando la guía de "qué revisar" de cada uno sobre el árbol del proyecto (grep de patrones, lectura de archivos de config, permisos declarados, dependencias).
3. **Registrar por control**:
   - Estado: ✅ cumple / ⚠️ cumple parcialmente / ❌ no cumple / 🔍 requiere test dinámico (no verificable por código) / N/A no aplica a esta app
   - Evidencia: `archivo:línea` concreto, o "no se encontró código relacionado" si aplica
   - Remediación breve si el estado es ⚠️ o ❌
4. **No aplicar fixes automáticamente** — reportar primero y esperar confirmación, salvo que el usuario ya haya pedido explícitamente que se corrija.

## Formato del reporte

Una tabla por categoría, mismo estilo que usa `fs-mobile-scaffold/assets/audit-checklist.md`:

| Control | Nivel | Estado | Evidencia | Remediación |
|---|---|---|---|---|
| MASVS-STORAGE-1 | L1 | ⚠️ | `src/context/AuthContext.js:14` — token en AsyncStorage, no en SecureStore | Migrar el token a `expo-secure-store` |

Cerrar con un resumen: cuántos controles L1 evaluados, cuántos ✅/⚠️/❌/🔍, y los 2-3 hallazgos de mayor riesgo primero.
