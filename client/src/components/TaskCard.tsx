import { useState } from 'react';
import { Task, tasksApi } from '@/lib/api';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Pencil, Trash2, Check, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TaskCardProps {
  task: Task;
  onUpdate: () => void;
  onDelete: () => void;
}

const statusLabels = {
  pending: 'Pending',
  'in-progress': 'In Progress',
  completed: 'Completed',
};

const TaskCard = ({ task, onUpdate, onDelete }: TaskCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState(task.status);
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await tasksApi.update(task._id, { status: newStatus as Task['status'] });
      onUpdate();
    } catch (error) {
      toast({
        title: 'Failed to update status',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: 'Title required',
        description: 'Please enter a task title',
        variant: 'destructive',
      });
      return;
    }

    setIsUpdating(true);
    try {
      await tasksApi.update(task._id, { title, description, status });
      setIsEditing(false);
      onUpdate();
      toast({
        title: 'Task updated',
        description: 'Your changes have been saved',
      });
    } catch (error) {
      toast({
        title: 'Failed to update',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await tasksApi.delete(task._id);
      onDelete();
      toast({
        title: 'Task deleted',
        description: 'The task has been removed',
      });
    } catch (error) {
      toast({
        title: 'Failed to delete',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setIsEditing(false);
  };

  const getStatusClass = (s: string) => {
    switch (s) {
      case 'pending':
        return 'status-pending';
      case 'in-progress':
        return 'status-in-progress';
      case 'completed':
        return 'status-completed';
      default:
        return '';
    }
  };

  if (isEditing) {
    return (
      <Card className="animate-fade-in">
        <CardContent className="pt-4 space-y-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={2}
          />
          <Select value={status} onValueChange={(val) => setStatus(val as Task['status'])}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isUpdating}>
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Save
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-foreground leading-tight">{task.title}</h3>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {task.description && (
          <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
        )}
        <Select value={task.status} onValueChange={handleStatusChange} disabled={isUpdating}>
          <SelectTrigger className="w-[140px] h-8 text-xs">
            <SelectValue>
              <span className={`status-badge ${getStatusClass(task.status)}`}>
                {statusLabels[task.status]}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">
              <span className="status-badge status-pending">Pending</span>
            </SelectItem>
            <SelectItem value="in-progress">
              <span className="status-badge status-in-progress">In Progress</span>
            </SelectItem>
            <SelectItem value="completed">
              <span className="status-badge status-completed">Completed</span>
            </SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
