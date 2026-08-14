# Skills

Colección personal de [Agent Skills](https://www.skills.sh/) — capacidades reutilizables para Claude Code y otros agentes compatibles con la especificación de Agent Skills.

## Instalación

```bash
npx skills add fernandoserra/skills
```

También se puede instalar una skill puntual:

```bash
npx skills add fernandoserra/skills/skills/fs-mobile-scaffold
```

## Skills disponibles

| Skill | Descripción |
|---|---|
| [`fs-mobile-scaffold`](skills/fs-mobile-scaffold) | Crea una app nueva de Expo/React Native a partir de un preset de stack predefinido, o audita un proyecto Expo existente (dependencias desactualizadas, errores de config). |
| [`fs-mobile-accessibility`](skills/fs-mobile-accessibility) | Audita la accesibilidad de una app Expo/React Native contra WCAG 2.1/2.2 AA: labels, VoiceOver/TalkBack, Dynamic Type, contraste, áreas táctiles, navegación por accesibilidad, movimiento reducido y formularios accesibles. |
| [`fs-mobile-design-system`](skills/fs-mobile-design-system) | Crea/completa o audita un design system consistente entre proyectos Expo/React Native: colores, tipografía, spacing, radius, sombras, íconos y componentes base (Button, Input, Card, Modal). |
| [`fs-mobile-responsive`](skills/fs-mobile-responsive) | Audita la adaptabilidad de una app Expo/React Native a distintos tamaños de pantalla: iPhones/Android, tablets, orientación, safe areas, notch, Dynamic Island y comportamiento del teclado. |
| [`fs-mobile-performance`](skills/fs-mobile-performance) | Audita performance de una app Expo/React Native: renders innecesarios, FlatList/FlashList, imágenes, memoria, navegación, animaciones, JS/UI thread, network requests y bundle size, explicando el mecanismo causal de cada hallazgo. |
| [`fs-mobile-security`](skills/fs-mobile-security) | Audita el código fuente de una app Expo/React Native contra el OWASP MASVS (nivel L1 por defecto): storage, criptografía, auth, red, plataforma, calidad de código y privacidad. |
| [`fs-mobile-ui-ux`](skills/fs-mobile-ui-ux) | Audita la UI/UX de una app Expo/React Native: jerarquía visual, espaciado, áreas táctiles, navegación, estados vacíos/loading/error, feedback visual, consistencia, tipografía, accesibilidad visual y formularios. |
| [`fs-web-security`](skills/fs-web-security) | Audita una app web contra el OWASP WSTG mediante revisión estática de código/config y checks pasivos no destructivos: headers de seguridad, auth, sesión, autorización, input validation, criptografía y más. |

## Estructura

```
skills/
  <nombre-skill>/
    SKILL.md       # instrucciones + frontmatter (name, description)
    assets/        # templates, checklists y demás material de referencia
```

## Licencia

MIT — ver [LICENSE](LICENSE).
