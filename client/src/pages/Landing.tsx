import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, ListTodo, Clock } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListTodo className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold text-foreground">TaskFlow</span>
          </div>
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-xl text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            TaskFlow
          </h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Simple task management for focused work.<br />
            Write your tasks. Track progress. Get things done.
          </p>
          <Link to="/register">
            <Button size="lg" className="px-8">
              Get Started
            </Button>
          </Link>
        </div>
      </main>

      {/* Features */}
      <section className="border-t border-border py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-secondary mb-2">
                <ListTodo className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-foreground">Create Tasks</h3>
              <p className="text-sm text-muted-foreground">Quickly add and organize your tasks</p>
            </div>
            <div className="space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-secondary mb-2">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-foreground">Track Progress</h3>
              <p className="text-sm text-muted-foreground">Move tasks through status stages</p>
            </div>
            <div className="space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-secondary mb-2">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-foreground">Complete Goals</h3>
              <p className="text-sm text-muted-foreground">Mark done and celebrate wins</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center">
        <p className="text-sm text-muted-foreground">© 2026 TaskFlow. Keep it simple.</p>
      </footer>
    </div>
  );
};

export default Landing;
