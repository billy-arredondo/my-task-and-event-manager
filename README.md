# Task & Event Manager

React + TypeScript + Vite.

## Setup

```bash
npm install
npm run dev
```

## Agent Skills (skills.sh / Claude Code)

Este proyecto usa [skills.sh](https://skills.sh) para gestionar skills de agentes IA.
El archivo `skills-lock.json` está versionado — funciona igual que `package-lock.json`.

### Instalar skills tras clonar

```bash
skills install
```

Esto descarga el contenido en `.agents/skills/` y crea los symlinks en `.claude/skills/` y `.commandcode/skills/`.
Esos directorios están en `.gitignore` — no los subas.

### Agregar un skill nuevo

```bash
skills add <nombre-del-skill>
git add skills-lock.json
git commit -m "chore: add <nombre-del-skill> skill"
```

### Qué versionar y qué no

| Archivo | Git |
|---|---|
| `skills-lock.json` | Versionar — define qué skills usa el equipo |
| `.agents/` | Ignorado — contenido descargado, regenerable |
| `.claude/skills/` | Ignorado — symlinks auto-generados |
| `.commandcode/skills/` | Ignorado — symlinks auto-generados |
| `.claude/settings.local.json` | Ignorado — config personal de cada dev |
| `.claude/launch.json` | Versionado — config del dev server para Claude Code |

### Variables de entorno / credenciales

Si algún skill requiere tokens o API keys, defínelas en `.env.local` (ya en `.gitignore`).
Nunca las pongas en `skills-lock.json` ni en archivos de configuración versionados.
