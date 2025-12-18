import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// ==================== TYPES ====================
interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
}

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface AppState {
  // User
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;

  // Tasks
  tasks: Task[];
  addTask: (title: string, priority: Task['priority']) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  clearCompleted: () => void;

  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Counter (example)
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

// ==================== STORE ====================
export const useStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        // User State
        user: null,
        setUser: (user) => set({ user }),
        logout: () => set({ user: null }),

        // Tasks State
        tasks: [],
        addTask: (title, priority) =>
          set((state) => ({
            tasks: [
              ...state.tasks,
              {
                id: `${Date.now()}-${Math.random()}`,
                title,
                completed: false,
                priority,
                createdAt: Date.now(),
              },
            ],
          })),
        toggleTask: (id) =>
          set((state) => ({
            tasks: state.tasks.map((task) =>
              task.id === id ? { ...task, completed: !task.completed } : task
            ),
          })),
        deleteTask: (id) =>
          set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== id),
          })),
        clearCompleted: () =>
          set((state) => ({
            tasks: state.tasks.filter((task) => !task.completed),
          })),

        // Theme State
        theme: 'light',
        toggleTheme: () =>
          set((state) => ({
            theme: state.theme === 'light' ? 'dark' : 'light',
          })),

        // Counter State
        count: 0,
        increment: () => set((state) => ({ count: state.count + 1 })),
        decrement: () => set((state) => ({ count: state.count - 1 })),
        reset: () => set({ count: 0 }),
      }),
      {
        name: 'zustand-demo-storage',
      }
    )
  )
);