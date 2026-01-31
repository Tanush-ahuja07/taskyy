import { useState } from 'react';
import { tasksApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Loader2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreateTaskFormProps {
  onTaskCreated: () => void;
}

const CreateTaskForm = ({ onTaskCreated }: CreateTaskFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast({
        title: 'Title required',
        description: 'Please enter a task title',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      await tasksApi.create({ title: title.trim(), description: description.trim() });
      setTitle('');
      setDescription('');
      setIsOpen(false);
      onTaskCreated();
      toast({
        title: 'Task created',
        description: 'Your new task has been added',
      });
    } catch (error) {
      toast({
        title: 'Failed to create task',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Task
      </Button>
    );
  }

  return (
    <Card className="animate-fade-in">
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            autoFocus
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={2}
          />
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsOpen(false);
                setTitle('');
                setDescription('');
              }}
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Task
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateTaskForm;
