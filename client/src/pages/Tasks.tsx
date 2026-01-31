import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Task, tasksApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import TaskCard from '@/components/TaskCard';
import CreateTaskForm from '@/components/CreateTaskForm';
import { ListTodo, LogOut, Search, Loader2 } from 'lucide-react';

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { user, logout, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const fetchTasks = async () => {
    try {
      const data = await tasksApi.getAll();
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchQuery, statusFilter]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListTodo className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold text-foreground">TaskFlow</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user?.name}
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Create Task */}
        <div className="mb-6">
          <CreateTaskForm onTaskCreated={fetchTasks} />
        </div>

        {/* Task List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {tasks.length === 0
                ? 'No tasks yet. Create your first task above!'
                : 'No tasks match your search or filter.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onUpdate={fetchTasks}
                onDelete={fetchTasks}
              />
            ))}
          </div>
        )}

        {/* Task Count */}
        {tasks.length > 0 && (
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {filteredTasks.length} of {tasks.length} task{tasks.length !== 1 ? 's' : ''}
          </div>
        )}
      </main>
    </div>
  );
};

export default Tasks;
