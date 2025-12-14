import { useState, KeyboardEvent } from 'react';
import { ChevronLeft, Code2, Plus, Trash2, Check } from 'lucide-react';
import { ProjectComponentProps } from '../../types';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoListProject({ onBack }: ProjectComponentProps) {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "Apprendre React", completed: true },
    { id: 2, text: "Maîtriser TypeScript", completed: false },
    { id: 3, text: "Créer des projets", completed: false }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const addTodo = () => {
    if (inputValue.trim() === '') return;

    const newTodo: Todo = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false
    };

    setTodos([...todos, newTodo]);
    setInputValue('');
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const getFilteredTodos = (): Todo[] => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const filteredTodos = getFilteredTodos();
  const activeCount = todos.filter(todo => !todo.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-8">
      <button
        onClick={onBack}
        className="mb-8 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
      >
        <ChevronLeft size={20} />
        Retour à l'accueil
      </button>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Todo List</h1>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["map()", "key prop", "Conditional Rendering"].map((concept) => (
                <span key={concept} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                  {concept}
                </span>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ajouter une nouvelle tâche..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={addTodo}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <Plus size={20} />
              Ajouter
            </button>
          </div>

          {/* Filtres */}
          <div className="flex gap-2 mb-6">
            {[
              { key: 'all', label: 'Toutes' },
              { key: 'active', label: 'Actives' },
              { key: 'completed', label: 'Terminées' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as 'all' | 'active' | 'completed')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === key
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Liste des todos */}
          <div className="space-y-2 mb-6">
            {filteredTodos.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-lg">Aucune tâche {filter === 'active' ? 'active' : filter === 'completed' ? 'terminée' : ''}</p>
              </div>
            ) : (
              filteredTodos.map((todo) => (
                <div
                  key={todo.id}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                    todo.completed
                      ? 'bg-green-50 border-green-200'
                      : 'bg-white border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      todo.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 hover:border-orange-500'
                    }`}
                  >
                    {todo.completed && <Check size={16} className="text-white" />}
                  </button>

                  <span
                    className={`flex-1 ${
                      todo.completed
                        ? 'text-gray-500 line-through'
                        : 'text-gray-800'
                    }`}
                  >
                    {todo.text}
                  </span>

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="flex-shrink-0 text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Statistiques */}
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <p className="text-gray-700">
              <strong>{activeCount}</strong> tâche{activeCount !== 1 ? 's' : ''} active{activeCount !== 1 ? 's' : ''} sur <strong>{todos.length}</strong>
            </p>
          </div>

          <div className="mt-8 bg-orange-50 rounded-lg p-6">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Code2 size={20} className="text-orange-500" />
              Concepts React utilisés:
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>Array.map()</strong>: Rendu de listes d'éléments</li>
              <li>• <strong>key prop</strong>: Identification unique des éléments (todo.id)</li>
              <li>• <strong>Conditional Rendering</strong>: Affichage conditionnel du statut</li>
              <li>• <strong>Array Methods</strong>: filter(), map() pour manipuler l'état</li>
              <li>• <strong>Event Handling</strong>: onClick, onChange, onKeyPress</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}