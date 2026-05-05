-- Add reward column to tasks table
ALTER TABLE public.tasks 
ADD COLUMN reward text;

-- Add comment to describe the reward column
COMMENT ON COLUMN public.tasks.reward IS 'Optional reward text for completing the task';
