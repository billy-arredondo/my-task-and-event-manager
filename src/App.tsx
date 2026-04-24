import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { AppShell } from '@/components/layout/AppShell'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'

const TaskListPage = lazy(() => import('./pages/TaskListPage').then(m => ({ default: m.TaskListPage })))
const NewTaskPage = lazy(() => import('./pages/NewTaskPage').then(m => ({ default: m.NewTaskPage })))

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Suspense fallback={<div />}>
            <Routes>
              <Route path="/" element={<AppShell />}>
                <Route index element={<TaskListPage />} />
                <Route path="new" element={<NewTaskPage />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
