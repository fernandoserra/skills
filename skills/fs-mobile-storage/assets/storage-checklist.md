# Checklist de storage local para Expo/React Native

Todos los controles son 📄 **estática** (verificables leyendo código). Esta skill audita si la **tecnología elegida** es la correcta para el dato/patrón de acceso — no si un dato sensible está expuesto (eso es `fs-mobile-security`, categoría `MASVS-STORAGE`).

## STORAGE-CHOICE (elección de tecnología)

| ID | Foco | Qué revisar en Expo/RN |
|---|---|---|
| STORAGE-CHOICE-1 | Datos grandes o de escritura muy frecuente no van en `AsyncStorage`. | `AsyncStorage.setItem` con blobs grandes (listas/catálogos completos) o llamado en loops/alta frecuencia (cada tecla, cada scroll) — serializa todo a JSON en cada write y no está indexado, es notoriamente lento a esa escala. Candidato a `react-native-mmkv` (key-value rápido) o `expo-sqlite` (datos estructurados). |
| STORAGE-CHOICE-2 | Datos sensibles (tokens, credenciales, PII) usan `SecureStore`, no `AsyncStorage`. | Relacionado con `MASVS-STORAGE-1` de `fs-mobile-security` — esa skill es la autoridad en qué dato cuenta como sensible; esta solo confirma que, dado que algo ya se identificó como sensible, la tecnología elegida es la correcta. |
| STORAGE-CHOICE-3 | Valores grandes no se fuerzan dentro de `SecureStore`. | `SecureStore.setItemAsync` con `JSON.stringify` de objetos grandes — el Keychain de iOS tiene un límite práctico por entrada (~2KB); pasarse puede fallar silenciosamente o degradar performance. `SecureStore` es para secretos chicos (tokens, PIN), no para "guardar algo seguro" en general. |
| STORAGE-CHOICE-4 | Datos estructurados/relacionales (con necesidad de filtrar, ordenar, hacer join) no viven en `AsyncStorage` como si fuera una base de datos. | Un array grande guardado entero en `AsyncStorage` que se filtra/ordena en JS cada vez que se necesita, en vez de `expo-sqlite` con queries reales — reescribe el array completo en cada mutación. |
| STORAGE-CHOICE-5 | `react-native-mmkv` (u otro módulo nativo de storage) es compatible con el workflow del proyecto. | MMKV es un módulo nativo — no funciona en Expo Go puro. Si está entre las dependencias, confirmar que el proyecto usa development build (`expo-dev-client`) o está prebuildeado (carpetas `android`/`ios` versionadas, como el preset `classic-stack`), no Expo Go managed sin prebuild. |

## STORAGE-CONSISTENCY (consistencia de acceso)

| ID | Foco | Qué revisar en Expo/RN |
|---|---|---|
| STORAGE-CONSISTENCY-1 | Un mismo tipo de dato no se guarda con más de un mecanismo distinto en distintas partes del código. | Grep de `AsyncStorage`/`SecureStore`/otra lib usados para la misma clave lógica (ej. preferencias de usuario) en múltiples archivos — señal de que no hay una capa de storage centralizada. |
| STORAGE-CONSISTENCY-2 | El acceso a storage está centralizado en un módulo, no disperso. | Llamadas directas a `AsyncStorage.getItem`/`setItem` repartidas por pantallas/componentes en vez de un wrapper (`src/storage/` o similar). Mismo principio que `API-CLIENT-1` de `fs-mobile-api`, aplicado a storage en vez de red. |

## STORAGE-SERIALIZATION (serialización)

| ID | Foco | Qué revisar en Expo/RN |
|---|---|---|
| STORAGE-SERIALIZATION-1 | `JSON.parse`/`JSON.stringify` de datos de storage con manejo de error. | `JSON.parse(await AsyncStorage.getItem(key))` sin try/catch — si el dato quedó corrupto o el shape cambió entre versiones de la app, esto crashea en vez de degradar con gracia (volver a un default). |
| STORAGE-SERIALIZATION-2 | Cambios de shape en los datos guardados tienen alguna forma de migración. | Si el objeto guardado cambió de forma entre versiones de la app (ej. se agregó un campo que el código nuevo asume presente), ¿hay algún versionado/migración, o una instalación con datos viejos puede romper al leerlos con el código actual? |

## STORAGE-CACHE (cache local de datos remotos)

| ID | Foco | Qué revisar en Expo/RN |
|---|---|---|
| STORAGE-CACHE-1 | Datos remotos cacheados localmente tienen expiración/invalidación, no quedan indefinidamente. | Respuesta de una API guardada en `AsyncStorage`/SQLite sin timestamp ni política de expiración (TTL) — puede mostrar datos desactualizados por tiempo indefinido si no hay conexión para refrescar. |

## STORAGE-CLEANUP (limpieza)

| ID | Foco | Qué revisar en Expo/RN |
|---|---|---|
| STORAGE-CLEANUP-1 | El logout limpia todo el storage relacionado al usuario, no solo el token de auth. | `logout()` que borra el token (ver `SecureStore.deleteItemAsync(TOKEN_KEY)` del preset `classic-stack`) pero deja en `AsyncStorage`/SQLite datos de sesión del usuario anterior (preferencias, cache de perfil, borradores) — riesgo de que el siguiente usuario en el mismo dispositivo vea datos ajenos. |

## Resumen de categorías

CHOICE, CONSISTENCY, SERIALIZATION, CACHE, CLEANUP — 5 categorías, 9 controles.
