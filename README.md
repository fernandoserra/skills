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
| [`fs-mobile-security`](skills/fs-mobile-security) | Audita el código fuente de una app Expo/React Native contra el OWASP MASVS (nivel L1 por defecto): storage, criptografía, auth, red, plataforma, calidad de código y privacidad. |

## Estructura

```
skills/
  <nombre-skill>/
    SKILL.md       # instrucciones + frontmatter (name, description)
    assets/        # templates, checklists y demás material de referencia
```

## Licencia

MIT — ver [LICENSE](LICENSE).
