# App.tsx

`App.tsx` es el punto de entrada de la app. Se compone de:

## 1. **Lazy loading**

`TaskListPage`, `AuthPage`, `ResetPasswordPage` se cargan bajo demanda con `React.lazy`.

Recuerda que cada `lazy()` recibe una función que llama a `import()` dinámico; Vite genera un chunk separado por cada página. Mientras se descargan, React muestra el `<Suspense fallback={<div />}>`. El objetivo es reducir el JS inicial y mejorar la velocidad de carga en móviles (útil en una PWA).

## 2. **AuthProvider**

Arranca la sesión de Supabase al montar, escucha cambios de autenticación y redirige a `/auth/reset-password` si el evento es `PASSWORD_RECOVERY`. Mientras no se haya inicializado (`initialized === false`), renderiza `null` (pantalla en blanco).

## 3. **App** — layout de providers anidados:

- `ErrorBoundary` → captura errores no controlados
- `QueryClientProvider` → React Query con staleTime de 30s
- `BrowserRouter` + `Routes`:
  - `/auth` y `/auth/reset-password` son públicos
  - `/` está envuelto en `AuthGuard` (redirige a login si no hay sesión)
  - Dentro de `AppShell` se renderiza `TaskListPage` como índice
  - Cualquier ruta no coincidente redirige a `/`
