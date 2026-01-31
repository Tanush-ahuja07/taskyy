// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

// Helper to get auth token
const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Helper to make authenticated requests
const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  return fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });
};

// Auth API
export const authApi = {
  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await authFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await authFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  },

  getProfile: async (): Promise<{ user: User }> => {
    const response = await authFetch('/auth/profile');

    if (!response.ok) {
      throw new Error('Failed to get profile');
    }

    return response.json();
  },
};

// Tasks API
export const tasksApi = {
  getAll: async (): Promise<Task[]> => {
    const response = await authFetch('/tasks');

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch tasks');
    }

    return response.json();
  },

  getById: async (id: string): Promise<Task> => {
    const response = await authFetch(`/tasks/${id}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch task');
    }

    const tasks = await response.json();
    return Array.isArray(tasks) ? tasks[0] : tasks;
  },

  create: async (task: { title: string; description?: string; status?: string }): Promise<Task> => {
    const response = await authFetch('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create task');
    }

    return response.json();
  },

  update: async (id: string, task: Partial<Task>): Promise<Task> => {
    const response = await authFetch(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update task');
    }

    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await authFetch(`/tasks/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete task');
    }
  },
};
