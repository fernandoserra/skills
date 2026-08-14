# Checklist de auditoría (modo audit)

Para cada ítem: comando, qué significa que falle, y el fix sugerido. No corregir nada sin mostrar el resultado y confirmar con el usuario — salvo que haya pedido explícitamente "arregla todo" o similar.

## 1. Dependencias desalineadas del SDK

```bash
npx expo install --check
```

Lista paquetes cuya versión instalada no coincide con la que espera el SDK de Expo del proyecto. Fix: `npx expo install --fix` (reescribe `package.json` a las versiones esperadas).

## 2. Salud general del proyecto

```bash
npx expo-doctor
```

Corre los chequeos oficiales de Expo (config nativa vs `app.json`/`app.config.js`, plugins mal instalados, paquetes incompatibles con la New Architecture, etc.). Reportar cada fallo tal cual lo devuelve el comando — no reinterpretar el mensaje.

## 3. Errores de TypeScript

Solo si existe `tsconfig.json` en la raíz:

```bash
npx tsc --noEmit
```

## 4. Lint

Solo si existe config de ESLint (`.eslintrc*`, `eslint.config.*`, o clave `eslintConfig` en `package.json`):

```bash
npx eslint .
```

## 5. Formato del reporte final

| Check | Estado | Detalle |
|---|---|---|
| Dependencias SDK | ✅/⚠️/❌ | ... |
| expo-doctor | ✅/⚠️/❌ | ... |
| TypeScript | ✅/⚠️/❌ | ... |
| Lint | ✅/⚠️/❌ | ... |

Si todo pasa: confirmar que el proyecto está sano, sin agregar recomendaciones extra que no se pidieron.
