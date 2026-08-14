# Presets de stack

## classic-stack

Basado en el patrón usado en apps de producción del usuario (ej. Portal 360 Inmobiliario). Pensado para apps con backend REST propio (no BaaS) y necesidad de push notifications / analytics vía Firebase.

### Ejes

| Eje | Elección | Por qué |
|---|---|---|
| Workflow | Bare (prebuild, carpetas `android`/`ios` versionadas) | Necesario para plugins nativos custom (Firebase, mapas, etc.) |
| Navegación | React Navigation (Drawer + Bottom Tabs + Stack anidados) | Control total sobre la transición nativa, patrón ya probado |
| Estado | Context API | Sin dependencias extra; alcanza para auth / theme / config remoto |
| Estilos | Theme system propio (tokens + hook `useAppTheme`) | Sin librería de CSS-in-JS; centralizado y tipado |
| Data fetching | Wrapper propio sobre `fetch` + capa de endpoints centralizada | Backend-agnóstico — solo asume REST + JWT Bearer, no un framework específico |
| Push / analytics | Firebase (`@react-native-firebase/*`) | Estándar de facto en RN para push + crashlytics |
| Storage local | AsyncStorage (datos no sensibles), SecureStore (tokens), SQLite (opcional, cache offline) | Separación por sensibilidad del dato |
| Release | EAS Build (`development`/`preview`/`production`) + EAS Update (OTA) | Estándar actual de Expo |

### Dependencias a instalar

```bash
npx expo install \
  @react-navigation/native @react-navigation/native-stack @react-navigation/drawer @react-navigation/bottom-tabs \
  react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated \
  @react-native-async-storage/async-storage expo-secure-store \
  @react-native-firebase/app @react-native-firebase/analytics @react-native-firebase/crashlytics @react-native-firebase/messaging \
  expo-updates expo-constants expo-splash-screen expo-status-bar
```

Nota: `@react-native-firebase/*` requiere los archivos de config de Google/Apple (`google-services.json` / `GoogleService-Info.plist`) generados desde la consola de Firebase del usuario — el scaffold no puede generarlos ni inventarlos.

### Estructura que copia el scaffold

```
src/
  constants/     Colors.js, Typography.js, Spacing.js, Theme.js
  hooks/         useAppTheme.js
  context/       AuthContext.js, ThemeContext.js
  navigations/   RootNavigator.js, DrawerNavigator.js, TabNavigator.js, StackNavigator.js
  components/    ThemedView.js, ThemedText.js
  utils/         http.js
  values/        endpointsString.js
```

## Agregar un preset nuevo

1. Documentar sus ejes en una tabla nueva en este archivo, siguiendo el mismo formato que `classic-stack`.
2. Crear `assets/templates/<nombre-preset>/` con la misma convención de carpetas (`src/...`, `eas.json`, `app.config.js`, `.env.example`).
3. Sumarlo como opción a preguntar en el paso 1 del modo scaffold de `SKILL.md`.
