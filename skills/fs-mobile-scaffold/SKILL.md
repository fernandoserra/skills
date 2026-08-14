---
name: fs-mobile-scaffold
description: Crea una app nueva de Expo/React Native a partir de un preset de stack predefinido, o audita un proyecto Expo existente para detectar dependencias desactualizadas y errores de configuración. Usar cuando el usuario pida crear/iniciar una nueva app de Expo o React Native, o pida verificar/revisar que un proyecto Expo esté al día / sin errores.
---

# fs-mobile-scaffold

Dos modos. Detectar cuál aplica antes de actuar:

1. **Modo scaffold** — el usuario quiere una app nueva, o el directorio de destino no tiene un proyecto Expo (`package.json` sin dependencia `expo`, o no existe `package.json`).
2. **Modo audit** — el directorio ya tiene un proyecto Expo (`package.json` con dependencia `expo`) y el usuario pide verificar que esté al día / sin errores.

Si hay ambigüedad sobre cuál modo aplica, preguntar en vez de asumir.

## Antes de tocar la CLI: verificar sintaxis vigente

Expo y React Native cambian rápido — el SDK y las flags de la CLI en este momento pueden no coincidir con lo que dice el entrenamiento del modelo. Antes de correr `create-expo-app`, `expo-doctor` o cualquier comando de la CLI, correr `--help` (ej. `npx create-expo-app@latest --help`) para confirmar la sintaxis actual. Si el proyecto tiene documentación local (`node_modules/expo/dist/docs/`, `AGENTS.md`, `CLAUDE.md`), priorizarla sobre la memoria del modelo.

## Modo scaffold

### 1. Recolectar datos

Preguntar lo que no haya venido ya en el mensaje del usuario:
- Nombre de la app (display name) y slug técnico (kebab-case)
- Bundle identifier iOS (`com.empresa.app`) y package name Android
- Preset de stack — hoy solo existe `classic-stack` (ver `assets/stacks.md`). Si en el futuro hay más de uno, preguntar cuál usar.

### 2. Crear el proyecto base

```bash
npx create-expo-app@latest <slug> --template blank-typescript
```

Confirmar flags vigentes con `--help` antes de correrlo (ver sección anterior).

### 3. Aplicar el preset

Leer `assets/stacks.md` para la lista de dependencias del preset elegido e instalarlas con `npx expo install <paquetes>` — no `npm install` a secas, porque `expo install` resuelve versiones compatibles con el SDK instalado.

Copiar `assets/templates/<preset>/src/` dentro de `src/` del proyecto nuevo y `assets/templates/<preset>/App.js` sobre el `App.js` que generó `create-expo-app`, reemplazando los placeholders (`__APP_NAME__`, `__SLUG__`, `__BUNDLE_ID__`, `__API_URL__`) por los valores recolectados en el paso 1. `App.js` conecta `AuthProvider` con `RootNavigator` — si el preset no trae pantallas reales todavía, dejar los placeholders `HomeScreen`/`LoginScreen` señalados en `TabNavigator.js`/`RootNavigator.js` y avisar al usuario que hay que crearlas.

### 4. Configurar EAS y app.config

Copiar `eas.json` y `app.config.js` del template (mismo preset), reemplazando placeholders. Preguntar si ya existe un proyecto EAS (`eas init`) o si hay que crear uno nuevo.

### 5. Cerrar

1. Copiar `.env.example` del template.
2. Correr `npx expo-doctor` una vez para confirmar que el scaffold quedó sano.
3. Resumir qué se creó y los pasos manuales que quedan pendientes (archivos de config de Firebase, ícono/splash, `eas init`, etc.) — no inventar que quedaron hechos si requieren acción manual del usuario (ej. Firebase no se puede configurar sin acceso a su consola).

## Modo audit

Ver `assets/audit-checklist.md` para el detalle de cada chequeo. Resumen:

1. `npx expo install --check` — dependencias desalineadas del SDK instalado
2. `npx expo-doctor` — chequeos oficiales de salud del proyecto
3. `npx tsc --noEmit` (solo si existe `tsconfig.json`)
4. `npx eslint .` (solo si existe config de ESLint)

Presentar los resultados como una tabla ✅/⚠️/❌ con el fix sugerido para cada ítem que falle. No aplicar fixes automáticos sin confirmar con el usuario — excepción: `npx expo install --fix` puede ofrecerse directamente si el usuario ya pidió "arregla todo" o similar.
