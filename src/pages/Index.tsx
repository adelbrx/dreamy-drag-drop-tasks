
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Plus, Trash2, Edit3, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

const Index = () => {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: '1',
      text: 'Welcome to your beautiful todo app!',
      completed: false,
      createdAt: new Date(),
    },
    {
      id: '2',
      text: 'Try dragging this task around',
      completed: false,
      createdAt: new Date(),
    },
    {
      id: '3',
      text: 'Mark this task as complete',
      completed: true,
      createdAt: new Date(),
    },
  ]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date(),
      };
      setTodos([todo, ...todos]);
      setNewTodo('');
      toast({
        title: "Task added!",
        description: "Your new task has been added successfully.",
      });
    }
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
    toast({
      title: "Task deleted!",
      description: "The task has been removed from your list.",
    });
  };

  const toggleComplete = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const startEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = () => {
    if (editText.trim()) {
      setTodos(todos.map(todo =>
        todo.id === editingId ? { ...todo, text: editText.trim() } : todo
      ));
      setEditingId(null);
      setEditText('');
      toast({
        title: "Task updated!",
        description: "Your task has been updated successfully.",
      });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTodos(items);
    toast({
      title: "Task reordered!",
      description: "Your tasks have been reordered successfully.",
    });
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Beautiful Todo
          </h1>
          <p className="text-slate-300 text-lg">
            Organize your tasks with style and efficiency
          </p>
          <div className="mt-6 inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <span className="text-white font-medium">
              {completedCount} of {totalCount} tasks completed
            </span>
          </div>
        </div>

        {/* Add Todo */}
        <Card className="mb-8 bg-white/10 backdrop-blur-sm border-white/20 shadow-2xl">
          <CardContent className="p-6">
            <div className="flex gap-3">
              <Input
                placeholder="What needs to be done?"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400"
              />
              <Button
                onClick={addTodo}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 shadow-lg transition-all duration-200 hover:scale-105"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Todo List */}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="todos">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`space-y-4 transition-all duration-200 ${
                  snapshot.isDraggingOver ? 'bg-white/5 rounded-lg p-4' : ''
                }`}
              >
                {todos.map((todo, index) => (
                  <Draggable key={todo.id} draggableId={todo.id} index={index}>
                    {(provided, snapshot) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`bg-white/10 backdrop-blur-sm border-white/20 shadow-lg transition-all duration-200 hover:bg-white/15 hover:scale-[1.02] hover:shadow-xl ${
                          snapshot.isDragging ? 'rotate-3 shadow-2xl bg-white/20' : ''
                        } ${todo.completed ? 'opacity-75' : ''}`}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            {/* Completion Checkbox */}
                            <button
                              onClick={() => toggleComplete(todo.id)}
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-110 ${
                                todo.completed
                                  ? 'bg-green-500 border-green-500'
                                  : 'border-white/40 hover:border-white/60'
                              }`}
                            >
                              {todo.completed && <Check className="h-3 w-3 text-white" />}
                            </button>

                            {/* Todo Text */}
                            <div className="flex-1">
                              {editingId === todo.id ? (
                                <div className="flex gap-2">
                                  <Input
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                                    className="bg-white/20 border-white/30 text-white"
                                    autoFocus
                                  />
                                  <Button
                                    onClick={saveEdit}
                                    size="sm"
                                    className="bg-green-500 hover:bg-green-600"
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    onClick={cancelEdit}
                                    size="sm"
                                    variant="outline"
                                    className="border-white/30 text-white hover:bg-white/10"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ) : (
                                <p
                                  className={`text-white transition-all duration-200 ${
                                    todo.completed ? 'line-through text-slate-400' : ''
                                  }`}
                                >
                                  {todo.text}
                                </p>
                              )}
                            </div>

                            {/* Action Buttons */}
                            {editingId !== todo.id && (
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => startEdit(todo.id, todo.text)}
                                  size="sm"
                                  variant="ghost"
                                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/20"
                                >
                                  <Edit3 className="h-4 w-4" />
                                </Button>
                                <Button
                                  onClick={() => deleteTodo(todo.id)}
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-400 hover:text-red-300 hover:bg-red-400/20"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                
                {todos.length === 0 && (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">✨</div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      No tasks yet
                    </h3>
                    <p className="text-slate-400">
                      Add your first task above to get started!
                    </p>
                  </div>
                )}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-slate-400">
            Drag and drop to reorder • Click to edit • Built with ❤️
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
