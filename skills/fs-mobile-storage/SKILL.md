---
name: fs-mobile-storage
description: Audita las decisiones de storage local en una app Expo/React Native — si la tecnología elegida (AsyncStorage, SecureStore, SQLite, MMKV) es la correcta para cada dato/patrón de acceso, consistencia de la capa de acceso, manejo de errores de serialización, expiración de cache y limpieza al logout. Revisión estática de código. Usar cuando el usuario pida auditar/decidir qué mecanismo de storage usar, revisar AsyncStorage/SecureStore/SQLite/MMKV, o evaluar cache local de datos.
---

# fs-mobile-storage

Auditoría **estática** de decisiones de storage local en una app Expo/React Native — foco en **elegir la tecnología correcta** para cada dato y patrón de acceso, no en si un dato sensible está expuesto (eso es `fs-mobile-security`, categoría `MASVS-STORAGE`).

## Relación con `fs-mobile-security`

`MASVS-STORAGE-1`/`MASVS-STORAGE-2` de `fs-mobile-security` clasifican qué dato es sensible y si está protegido. Esta skill asume esa clasificación como dada y audita algo distinto: dado que un dato es sensible (o grande, o relacional, o de alta frecuencia), ¿la tecnología elegida es la adecuada? Un dato puede estar "seguro" (en `SecureStore`) y aun así ser una mala elección técnica (ej. un objeto de 5KB forzado ahí, cuando debería ser una referencia chica a datos más grandes guardados en SQLite).

## Fuente de verdad de los controles

`assets/storage-checklist.md` — 5 categorías (elección de tecnología, consistencia de acceso, serialización, cache, limpieza), 9 controles, todos verificables por código.

## Proceso

1. **Ubicar los mecanismos de storage del proyecto**: `package.json` (`@react-native-async-storage/async-storage`, `expo-secure-store`, `expo-sqlite`, `react-native-mmkv`), y si el proyecto viene del preset `classic-stack` de `fs-mobile-scaffold`, confirmar el patrón esperado (`SecureStore` para el token en `AuthContext.js`, `AsyncStorage` para el resto).
2. **Recorrer `assets/storage-checklist.md` categoría por categoría**, aplicando cada control sobre el código.
3. **Registrar por control**:
   - Estado: ✅ cumple / ⚠️ cumple parcialmente / ❌ no cumple / N/A no aplica (ej. `STORAGE-CHOICE-5` si el proyecto no usa MMKV)
   - Evidencia: `archivo:línea` concreto
   - Sugerencia breve si el estado es ⚠️ o ❌
4. **No aplicar cambios automáticamente** — reportar primero y esperar confirmación, salvo que el usuario ya haya pedido explícitamente que se corrija.

## Formato del reporte

Una tabla por categoría, mismo estilo que las demás skills de auditoría:

| Control | Estado | Evidencia | Sugerencia |
|---|---|---|---|
| STORAGE-CHOICE-1 | ⚠️ | `src/screens/CatalogScreen.js:20` — guarda el catálogo completo (200+ items) en `AsyncStorage` en cada fetch | Evaluar `expo-sqlite` si necesita filtrar/ordenar localmente, o `react-native-mmkv` si solo necesita lectura/escritura rápida |
| STORAGE-CLEANUP-1 | ❌ | `src/context/AuthContext.js:31-35` — `logout()` solo borra `auth_token` de `SecureStore`, no limpia `AsyncStorage` | Agregar limpieza de las claves de `AsyncStorage` relacionadas al usuario en `logout()` |

Cerrar con un resumen: cuántos controles evaluados, cuántos ✅/⚠️/❌/N/A, y los 2-3 hallazgos de mayor impacto primero (priorizar lo que puede causar fuga de datos entre usuarios o fallas de performance notorias, no preferencias de estilo).
