# MASVS v2 — checklist de trabajo para Expo/React Native

**Importante:** las columnas "Foco" son una interpretación de trabajo de cada control (categoría + patrón general del estándar), no una cita textual de OWASP — `mas.owasp.org` renderiza el texto de cada control vía JavaScript y no es extraíble por fetch estático. Antes de citar el texto oficial de un control en un reporte, verificarlo con `WebFetch` sobre `https://mas.owasp.org/MASVS/controls/MASVS-<ID>/`.

Fuente: https://mas.owasp.org/MASVS/ · https://mas.owasp.org/checklists/

## MASVS-STORAGE (datos en reposo)

| ID | Nivel | Foco (interpretación) | Qué revisar en Expo/RN |
|---|---|---|---|
| MASVS-STORAGE-1 | L1 | Datos sensibles no se guardan en texto plano; si hace falta persistirlos, usar el keystore/keychain del sistema. | Buscar `AsyncStorage.setItem` / `expo-sqlite` guardando tokens, contraseñas, PII o datos financieros sin cifrar. Ese tipo de dato debería ir por `expo-secure-store` (iOS Keychain / Android Keystore). |
| MASVS-STORAGE-2 | L1 | Datos sensibles no se filtran por canales del sistema no pensados para eso (logs, backups automáticos, capturas en el app-switcher, caché de teclado, portapapeles). | `console.log`/`console.error` con tokens o payloads sensibles; `android:allowBackup` en `AndroidManifest.xml`/`app.config.js` (`android.allowBackup`); `autoCorrect`/`secureTextEntry` en inputs de contraseñas; snapshot de la app en background sin blur/oscurecer pantallas sensibles. |

## MASVS-CRYPTO (criptografía)

| ID | Nivel | Foco (interpretación) | Qué revisar en Expo/RN |
|---|---|---|---|
| MASVS-CRYPTO-1 | L1 | Usar primitivas criptográficas estándar y bien mantenidas, no implementaciones propias ni algoritmos obsoletos. | Dependencias de crypto custom o algoritmos como MD5/SHA1/DES para algo que no sea solo checksums no sensibles; uso de `Math.random()` para generar tokens/claves (no es criptográficamente seguro) en vez de `expo-crypto`. |
| MASVS-CRYPTO-2 | L2 | Gestión robusta de claves: no hardcodeadas en el código/bundle, generadas y almacenadas vía el keystore del sistema. | Grep de API keys/secrets hardcodeados en `src/`, `app.config.js`, `.env` commiteado al repo; claves de cifrado embebidas en el JS bundle (visible con solo descompilar el APK/IPA). |

## MASVS-AUTH (autenticación y autorización)

| ID | Nivel | Foco (interpretación) | Qué revisar en Expo/RN |
|---|---|---|---|
| MASVS-AUTH-1 | L1 | Autenticación y gestión de sesión apropiadas: tokens manejados de forma segura, invalidados correctamente en logout. | Cómo se guarda/limpia el token (ver STORAGE-1); si `logout()` efectivamente borra el token del storage seguro y del estado en memoria (ver patrón `setAuthToken(null)` en `http.js` si se usó el preset `classic-stack`); expiración/refresh de tokens. |
| MASVS-AUTH-2 | L1 | Autenticación local (biometría/PIN) usando las APIs seguras del sistema, no una implementación propia. | Uso de `expo-local-authentication` (o equivalente) vs. lógica de PIN/patrón hecha a mano y guardada en AsyncStorage. |
| MASVS-AUTH-3 | L2 | Reautenticación ("step-up") para operaciones de alto riesgo, no alcanza con la sesión general. | Para apps que manejan dinero/datos sensibles: ¿se pide login/biometría de nuevo antes de una transferencia, cambio de datos de cuenta, etc., o alcanza con estar "logueado"? |

## MASVS-NETWORK (comunicación de red)

| ID | Nivel | Foco (interpretación) | Qué revisar en Expo/RN |
|---|---|---|---|
| MASVS-NETWORK-1 | L1 | Todo el tráfico usa TLS, sin fallback a HTTP en claro. | URLs `http://` hardcodeadas o en `.env` (`EXPO_PUBLIC_API_URL` debería ser siempre `https://`); `android:usesCleartextTraffic="true"` o `NSAppTransportSecurity` con excepciones amplias en `app.config.js`/plugins nativos. |
| MASVS-NETWORK-2 | L2 | Certificate pinning para conexiones al backend propio, mitiga MITM aunque una CA esté comprometida. | ¿Existe alguna implementación de pinning (ej. `react-native-ssl-pinning` o config nativa)? Ausencia total no es automáticamente ❌ si la app no maneja datos de alto riesgo — evaluar en contexto. |

## MASVS-PLATFORM (interacción con la plataforma)

| ID | Nivel | Foco (interpretación) | Qué revisar en Expo/RN |
|---|---|---|---|
| MASVS-PLATFORM-1 | L1 | Permisos e IPC (deep links, intents) usados con el mínimo necesario y con validación de lo que llega por ahí. | Permisos declarados en `app.config.js` (`ios.infoPlist`, `android.permissions`) vs. los que la app realmente usa; manejo del `scheme`/deep link (`Linking.addEventListener`) sin validar el payload recibido. |
| MASVS-PLATFORM-2 | L1 | WebViews configuradas de forma segura, sin exponer bridges nativos a contenido no confiable. | Uso de `react-native-webview` con `javaScriptEnabled` + carga de URLs externas/no controladas; `injectedJavaScript` o `onMessage` exponiendo funciones nativas sensibles sin validar el origen. |
| MASVS-PLATFORM-3 | L1 | La app no expone funcionalidad sensible sin querer a otras apps del dispositivo. | Deep links / custom URL schemes que disparan acciones sensibles (login automático, cambios de datos) sin ningún tipo de verificación. |

## MASVS-CODE (calidad de código)

| ID | Nivel | Foco (interpretación) | Qué revisar en Expo/RN |
|---|---|---|---|
| MASVS-CODE-1 | L1 | Build de producción sin flags/código de debug, sin exponer info sensible en errores. | `console.log` de datos sensibles que sobreviven al build de producción; manejo de errores que muestra stack traces o payloads de API al usuario; `__DEV__` mal usado dejando código de debug activo. |
| MASVS-CODE-2 | L1 | Validar todo input no confiable (deep links, respuesta de servidor, contenido de WebView) antes de usarlo. | Uso de datos de `Linking`/respuestas HTTP directamente en `eval`, construcción dinámica de queries, o renderizado sin sanitizar (ej. `react-native-render-html` con contenido no confiable). |
| MASVS-CODE-3 | L1 | Dependencias de terceros sin vulnerabilidades conocidas y razonablemente actualizadas. | `npm audit` / `npx expo install --check` — dependencias con CVEs conocidos o muy desactualizadas respecto al SDK de Expo. |
| MASVS-CODE-4 | L1 | Mínima superficie de debug expuesta en el build de release. | Source maps subidos/expuestos públicamente; logs verbose (`socket.io` debug, librerías de red) activos en producción. |

## MASVS-RESILIENCE (anti reverse engineering / tampering) — toda L2

| ID | Nivel | Foco (interpretación) | Qué revisar en Expo/RN |
|---|---|---|---|
| MASVS-RESILIENCE-1 | L2 | Detección de dispositivo rooteado/jailbreakeado con respuesta apropiada. | Solo verificable estáticamente si *existe* una librería de detección (ej. `jail-monkey`) — su efectividad real requiere test dinámico. Marcar 🔍 salvo ausencia total, que sí es ❌ para apps que la necesiten. |
| MASVS-RESILIENCE-2 | L2 | Verificación de integridad del código/recursos (anti-tampering). | Mismo criterio: solo se puede confirmar presencia/ausencia de mecanismos, no su efectividad. 🔍. |
| MASVS-RESILIENCE-3 | L2 | Resistencia a debugging/instrumentación en runtime (Frida, etc.). | No verificable por código estático. 🔍 siempre, salvo que se pida explícitamente un test dinámico fuera del alcance de esta skill. |
| MASVS-RESILIENCE-4 | L2 | Ofuscación de código y recursos. | Verificar si el build de producción usa Hermes + minificación/ofuscación (config por defecto de RN/Expo) vs. bundle JS legible sin ofuscar. |

## MASVS-PRIVACY (privacidad)

| ID | Nivel | Foco (interpretación) | Qué revisar en Expo/RN |
|---|---|---|---|
| MASVS-PRIVACY-1 | L1 | Minimización de datos: solo se recolecta lo necesario, con propósito claro. | Qué campos pide la app al usuario y si todos se usan realmente; datos enviados a analytics (Firebase Analytics, etc.) más allá de lo necesario. |
| MASVS-PRIVACY-2 | L1 | Permisos solicitados son solo los necesarios para la funcionalidad ofrecida. | Comparar `app.config.js` (permisos de cámara, ubicación, contactos, etc.) contra las features reales de la app. |
| MASVS-PRIVACY-3 | L1 | Transparencia: la app informa qué datos recolecta y para qué. | Existencia de política de privacidad enlazada/mostrada en la app, avisos de consentimiento antes de pedir permisos sensibles. |
| MASVS-PRIVACY-4 | L1 | Datos personales no se comparten con terceros sin base legal/consentimiento. | SDKs de analytics/ads/crash reporting (Firebase, etc.) — si envían PII y si hay algún mecanismo de opt-out/consentimiento. |

## Resumen de alcance por nivel

- **L1 (default de esta skill)**: STORAGE-1, STORAGE-2, CRYPTO-1, AUTH-1, AUTH-2, NETWORK-1, PLATFORM-1, PLATFORM-2, PLATFORM-3, CODE-1, CODE-2, CODE-3, CODE-4, PRIVACY-1, PRIVACY-2, PRIVACY-3, PRIVACY-4 (17 controles)
- **L2 (solo si se pide explícitamente)**: CRYPTO-2, AUTH-3, NETWORK-2, RESILIENCE-1 a 4 (6 controles, la mayoría solo verificables parcialmente por código estático)
