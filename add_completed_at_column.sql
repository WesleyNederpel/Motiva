-- Add completed_at column to tasks table
ALTER TABLE public.tasks
ADD COLUMN completed_at timestamptz;

COMMENT ON COLUMN public.tasks.completed_at IS 'Timestamp when the task was marked completed (null while incomplete)';
