ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS repeat_frequency text CHECK (repeat_frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
  ADD COLUMN IF NOT EXISTS repeat_interval  integer DEFAULT 1 CHECK (repeat_interval > 0);
