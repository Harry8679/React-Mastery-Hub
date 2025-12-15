import { useReducer, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { ChevronLeft, Code2, Plus, Trash2, Check, Edit2, X, Save } from 'lucide-react';
import type { ProjectComponentProps } from '../types';

// ==================== TYPES ====================
interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

type FilterType = 'all' | 'active' | 'completed';
type SortType = 'date' | 'priority' | 'alphabetical';

interface TodoState {
  todos: Todo[];
  filter: FilterType;
  sort: SortType;
  editingId: number | null;
}

// ==================== ACTIONS ====================
type TodoAction =
  | { type: 'ADD_TODO'; payload: { text: string; priority: Todo['priority'] } }
  | { type: 'DELETE_TODO'; payload: number }
  | { type: 'TOGGLE_TODO'; payload: number }
  | { type: 'UPDATE_TODO'; payload: { id: number; text: string } }
  | { type: 'SET_FILTER'; payload: FilterType }
  | { type: 'SET_SORT'; payload: SortType }
  | { type: 'START_EDITING'; payload: number }
  | { type: 'CANCEL_EDITING' }
  | { type: 'CLEAR_COMPLETED' }
  | { type: 'TOGGLE_ALL' };

// ==================== REDUCER ====================
function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: Date.now(),
            text: action.payload.text,
            completed: false,
            priority: action.payload.priority,
            createdAt: new Date(),
          },
        ],
      };

    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
      };

    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };

    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? { ...todo, text: action.payload.text }
            : todo
        ),
        editingId: null,
      };

    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload,
      };

    case 'SET_SORT':
      return {
        ...state,
        sort: action.payload,
      };

    case 'START_EDITING':
      return {
        ...state,
        editingId: action.payload,
      };

    case 'CANCEL_EDITING':
      return {
        ...state,
        editingId: null,
      };

    case 'CLEAR_COMPLETED':
      return {
        ...state,
        todos: state.todos.filter(todo => !todo.completed),
      };

    case 'TOGGLE_ALL':
      { const allCompleted = state.todos.every(todo => todo.completed);
      return {
        ...state,
        todos: state.todos.map(todo => ({
          ...todo,
          completed: !allCompleted,
        })),
      }; }

    default:
      return state;
  }
}

// ==================== INITIAL STATE ====================
const initialState: TodoState = {
  todos: [
    {
      id: 1,
      text: "Comprendre useReducer",
      completed: true,
      priority: 'high',
      createdAt: new Date(),
    },
    {
      id: 2,
      text: "Maîtriser les actions et reducers",
      completed: false,
      priority: 'high',
      createdAt: new Date(),
    },
    {
      id: 3,
      text: "Créer une app complexe",
      completed: false,
      priority: 'medium',
      createdAt: new Date(),
    },
  ],
  filter: 'all',
  sort: 'date',
  editingId: null,
};

// ==================== COMPONENT ====================
export default function UseReducerProject({ onBack }: ProjectComponentProps) {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const [inputValue, setInputValue] = useState('');
  const [priority, setPriority] = useState<Todo['priority']>('medium');
  const [editText, setEditText] = useState('');

  // ==================== HANDLERS ====================
  const handleAddTodo = () => {
    if (inputValue.trim() === '') return;
    dispatch({ type: 'ADD_TODO', payload: { text: inputValue.trim(), priority } });
    setInputValue('');
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAddTodo();
  };

  const handleStartEdit = (todo: Todo) => {
    dispatch({ type: 'START_EDITING', payload: todo.id });
    setEditText(todo.text);
  };

  const handleSaveEdit = (id: number) => {
    if (editText.trim() === '') return;
    dispatch({ type: 'UPDATE_TODO', payload: { id, text: editText.trim() } });
  };

  const handleCancelEdit = () => {
    dispatch({ type: 'CANCEL_EDITING' });
    setEditText('');
  };

  // ==================== FILTERING & SORTING ====================
  const getFilteredAndSortedTodos = (): Todo[] => {
    let filtered = state.todos;

    // Filter
    switch (state.filter) {
      case 'active':
        filtered = filtered.filter(todo => !todo.completed);
        break;
      case 'completed':
        filtered = filtered.filter(todo => todo.completed);
        break;
    }

    // Sort
    const sorted = [...filtered];
    switch (state.sort) {
      case 'priority':
        { const priorityOrder = { high: 0, medium: 1, low: 2 };
        // const priorityOrder = { high: 0, medium: 1, low: 2 };
        sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        break; }
      case 'alphabetical':
        sorted.sort((a, b) => a.text.localeCompare(b.text));
        break;
      case 'date':
        sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
    }

    return sorted;
  };

  const filteredTodos = getFilteredAndSortedTodos();
  const activeCount = state.todos.filter(todo => !todo.completed).length;
  const completedCount = state.todos.filter(todo => todo.completed).length;

  // ==================== PRIORITY COLORS ====================
  const priorityColors = {
    high: 'bg-red-100 text-red-700 border-red-300',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    low: 'bg-green-100 text-green-700 border-green-300',
  };

  // ==================== RENDER ====================
  return (
    <div className="min-h-screen bg-linear-to-br from-yellow-50 to-orange-50 p-8">
      <button
        onClick={onBack}
        className="mb-8 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
      >
        <ChevronLeft size={20} />
        Retour à l'accueil
      </button>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">useReducer - Todo List</h1>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["useReducer", "Complex State", "Actions/Reducers"].map((concept) => (
                <span
                  key={concept}
                  className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{state.todos.length}</div>
              <div className="text-sm text-blue-700">Total</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{completedCount}</div>
              <div className="text-sm text-green-700">Terminées</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{activeCount}</div>
              <div className="text-sm text-orange-700">Actives</div>
            </div>
          </div>

          {/* Input Section */}
          <div className="mb-6">
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ajouter une nouvelle tâche..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <button
                onClick={handleAddTodo}
                className="px-6 py-3 bg-linear-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-105 flex items-center gap-2"
              >
                <Plus size={20} />
                Ajouter
              </button>
            </div>

            {/* Priority Selector */}
            <div className="flex gap-2">
              <span className="text-gray-600 font-medium py-2">Priorité:</span>
              {(['high', 'medium', 'low'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    priority === p
                      ? priorityColors[p]
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {p === 'high' ? 'Haute' : p === 'medium' ? 'Moyenne' : 'Basse'}
                </button>
              ))}
            </div>
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex gap-2">
              <span className="text-gray-600 font-medium py-2">Filtre:</span>
              {(['all', 'active', 'completed'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => dispatch({ type: 'SET_FILTER', payload: f })}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    state.filter === f
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {f === 'all' ? 'Toutes' : f === 'active' ? 'Actives' : 'Terminées'}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <span className="text-gray-600 font-medium py-2">Tri:</span>
              {(['date', 'priority', 'alphabetical'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => dispatch({ type: 'SET_SORT', payload: s })}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    state.sort === s
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {s === 'date' ? 'Date' : s === 'priority' ? 'Priorité' : 'A-Z'}
                </button>
              ))}
            </div>
          </div>

          {/* Bulk Actions */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => dispatch({ type: 'TOGGLE_ALL' })}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
            >
              {state.todos.every(t => t.completed) ? 'Tout décocher' : 'Tout cocher'}
            </button>
            {completedCount > 0 && (
              <button
                onClick={() => dispatch({ type: 'CLEAR_COMPLETED' })}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
              >
                Supprimer terminées ({completedCount})
              </button>
            )}
          </div>

          {/* Todo List */}
          <div className="space-y-2 mb-6">
            {filteredTodos.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-lg">Aucune tâche à afficher</p>
              </div>
            ) : (
              filteredTodos.map((todo) => (
                <div
                  key={todo.id}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                    todo.completed
                      ? 'bg-green-50 border-green-200'
                      : 'bg-white border-gray-200 hover:border-yellow-300'
                  }`}
                >
                  {/* Checkbox */}
                  <button
                    onClick={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
                    className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      todo.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 hover:border-yellow-500'
                    }`}
                  >
                    {todo.completed && <Check size={16} className="text-white" />}
                  </button>

                  {/* Priority Badge */}
                  <span
                    className={`shrink-0 px-2 py-1 rounded text-xs font-bold uppercase ${
                      priorityColors[todo.priority]
                    }`}
                  >
                    {todo.priority[0]}
                  </span>

                  {/* Text or Edit Input */}
                  {state.editingId === todo.id ? (
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit(todo.id)}
                      className="flex-1 px-3 py-1 border border-yellow-500 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      autoFocus
                    />
                  ) : (
                    <span
                      className={`flex-1 ${
                        todo.completed ? 'text-gray-500 line-through' : 'text-gray-800'
                      }`}
                    >
                      {todo.text}
                    </span>
                  )}

                  {/* Actions */}
                  <div className="shrink-0 flex gap-2">
                    {state.editingId === todo.id ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(todo.id)}
                          className="text-green-500 hover:text-green-700 transition-colors"
                        >
                          <Save size={20} />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleStartEdit(todo)}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button
                          onClick={() => dispatch({ type: 'DELETE_TODO', payload: todo.id })}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Explanation */}
          <div className="bg-yellow-50 rounded-lg p-6">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Code2 size={20} className="text-yellow-500" />
              Concepts React utilisés:
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                • <strong>useReducer</strong>: Gestion d'état complexe avec actions typées
              </li>
              <li>
                • <strong>Reducer Function</strong>: Logique centralisée dans todoReducer
              </li>
              <li>
                • <strong>Actions</strong>: 10 types d'actions (ADD, DELETE, TOGGLE, etc.)
              </li>
              <li>
                • <strong>Complex State</strong>: État avec todos, filter, sort, editingId
              </li>
              <li>
                • <strong>Type Safety</strong>: Actions et état fortement typés avec TypeScript
              </li>
              <li>
                • <strong>Derived State</strong>: Filtrage et tri calculés à partir de l'état
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}