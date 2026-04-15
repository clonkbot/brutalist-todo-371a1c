import React, { useState, useEffect } from 'react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('brutalist-todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all');

  useEffect(() => {
    localStorage.setItem('brutalist-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      completed: false,
      createdAt: Date.now(),
    };

    setTodos([newTodo, ...todos]);
    setInputValue('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'done') return todo.completed;
    return true;
  });

  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-black font-mono flex flex-col">
      {/* Brutal Header */}
      <header className="border-b-4 border-black bg-black text-[#f5f5f0] p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter">
            TODO_
          </h1>
          <p className="text-xs md:text-sm mt-1 opacity-70 uppercase tracking-widest">
            [ TASK MANAGEMENT SYSTEM v1.0 ]
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-6 lg:p-8">
        {/* Input Form */}
        <form onSubmit={addTodo} className="mb-6 md:mb-8">
          <div className="border-4 border-black bg-white">
            <div className="bg-black text-[#f5f5f0] px-3 py-1 text-xs uppercase tracking-widest">
              + NEW TASK
            </div>
            <div className="flex flex-col sm:flex-row">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="ENTER TASK DESCRIPTION..."
                className="flex-1 p-3 md:p-4 text-base md:text-lg font-mono bg-transparent outline-none placeholder:text-gray-400 uppercase"
              />
              <button
                type="submit"
                className="border-t-4 sm:border-t-0 sm:border-l-4 border-black bg-black text-[#f5f5f0] px-6 py-3 md:py-4 text-base md:text-lg font-black uppercase tracking-wider hover:bg-[#f5f5f0] hover:text-black transition-colors min-h-[48px]"
              >
                ADD
              </button>
            </div>
          </div>
        </form>

        {/* Stats Bar */}
        <div className="flex flex-wrap gap-2 md:gap-4 mb-4 md:mb-6 text-xs md:text-sm">
          <div className="border-2 border-black px-3 py-2 bg-white">
            <span className="opacity-50">TOTAL:</span>{' '}
            <span className="font-black">{todos.length}</span>
          </div>
          <div className="border-2 border-black px-3 py-2 bg-white">
            <span className="opacity-50">ACTIVE:</span>{' '}
            <span className="font-black">{activeCount}</span>
          </div>
          <div className="border-2 border-black px-3 py-2 bg-white">
            <span className="opacity-50">DONE:</span>{' '}
            <span className="font-black">{completedCount}</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex border-4 border-black mb-4 md:mb-6 bg-white overflow-hidden">
          {(['all', 'active', 'done'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 px-3 py-3 text-xs md:text-sm font-black uppercase tracking-wider transition-colors min-h-[48px] ${
                filter === f
                  ? 'bg-black text-[#f5f5f0]'
                  : 'bg-white text-black hover:bg-gray-100'
              } ${f !== 'all' ? 'border-l-4 border-black' : ''}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Todo List */}
        <div className="space-y-3 md:space-y-4">
          {filteredTodos.length === 0 ? (
            <div className="border-4 border-dashed border-gray-400 p-8 md:p-12 text-center">
              <p className="text-gray-500 text-sm md:text-base uppercase tracking-widest">
                {filter === 'all'
                  ? '[ NO TASKS REGISTERED ]'
                  : filter === 'active'
                  ? '[ NO ACTIVE TASKS ]'
                  : '[ NO COMPLETED TASKS ]'
                }
              </p>
            </div>
          ) : (
            filteredTodos.map((todo, index) => (
              <div
                key={todo.id}
                className={`border-4 border-black bg-white group ${
                  todo.completed ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-stretch">
                  {/* Index Number */}
                  <div className="bg-black text-[#f5f5f0] px-3 md:px-4 flex items-center justify-center min-w-[40px] md:min-w-[50px] font-black text-sm md:text-base">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  {/* Checkbox */}
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="border-l-4 border-black px-3 md:px-4 flex items-center justify-center hover:bg-gray-100 transition-colors min-w-[48px]"
                    aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
                  >
                    <div className={`w-5 h-5 md:w-6 md:h-6 border-4 border-black flex items-center justify-center ${
                      todo.completed ? 'bg-black' : 'bg-white'
                    }`}>
                      {todo.completed && (
                        <span className="text-[#f5f5f0] font-black text-xs">X</span>
                      )}
                    </div>
                  </button>

                  {/* Text */}
                  <div className="flex-1 border-l-4 border-black p-3 md:p-4 min-w-0">
                    <p className={`text-sm md:text-base uppercase tracking-wide break-words ${
                      todo.completed ? 'line-through' : ''
                    }`}>
                      {todo.text}
                    </p>
                    <p className="text-[10px] md:text-xs opacity-40 mt-1 uppercase">
                      CREATED: {new Date(todo.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="border-l-4 border-black px-3 md:px-4 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors min-w-[48px]"
                    aria-label="Delete task"
                  >
                    <span className="font-black text-lg md:text-xl">X</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Clear Completed */}
        {completedCount > 0 && (
          <button
            onClick={clearCompleted}
            className="mt-4 md:mt-6 w-full border-4 border-black bg-white px-4 py-3 md:py-4 text-xs md:text-sm font-black uppercase tracking-wider hover:bg-black hover:text-[#f5f5f0] transition-colors min-h-[48px]"
          >
            [ PURGE COMPLETED TASKS ({completedCount}) ]
          </button>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-black bg-black text-[#f5f5f0] p-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] md:text-xs opacity-50 uppercase tracking-widest">
            Requested by @web-user · Built by @clonkbot
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
