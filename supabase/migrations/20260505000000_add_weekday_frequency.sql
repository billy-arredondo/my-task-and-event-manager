ALTER TABLE public.tasks
  DROP CONSTRAINT IF EXISTS tasks_repeat_frequency_check;

ALTER TABLE public.tasks
  ADD CONSTRAINT tasks_repeat_frequency_check
  CHECK (repeat_frequency IN ('daily', 'weekday', 'weekly', 'monthly', 'yearly'));
