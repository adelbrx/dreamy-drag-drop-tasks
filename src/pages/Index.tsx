
import React, { useState, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Plus, SortAsc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Todo, TodoFilters } from '@/types/todo';
import TodoForm from '@/components/TodoForm';
import TodoFiltersComponent from '@/components/TodoFilters';
import TodoCard from '@/components/TodoCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Index = () => {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: '1',
      title: 'Préparer la présentation client',
      description: 'Finaliser les slides et préparer la démonstration',
      category: 'Pro' as const,
      priority: 'Haute' as const,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24), // Tomorrow
      completed: false,
      createdAt: new Date(),
    },
    {
      id: '2',
      title: 'Faire les courses',
      description: 'Acheter les ingrédients pour le dîner de ce soir',
      category: 'Perso' as const,
      priority: 'Moyenne' as const,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // In 3 days
      completed: false,
      createdAt: new Date(),
    },
    {
      id: '3',
      title: 'Réviser le code du projet',
      description: 'Effectuer une revue de code complète',
      category: 'Pro' as const,
      priority: 'Basse' as const,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // In 1 week
      completed: true,
      createdAt: new Date(),
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [filters, setFilters] = useState<TodoFilters>({});
  const [sortBy, setSortBy] = useState<'priority' | 'dueDate' | 'created'>('priority');

  const addTodo = (todoData: Omit<Todo, 'id' | 'createdAt' | 'completed'>) => {
    const newTodo: Todo = {
      ...todoData,
      id: Date.now().toString(),
      completed: false,
      createdAt: new Date(),
    };
    setTodos([newTodo, ...todos]);
    setShowForm(false);
    toast({
      title: "Tâche créée !",
      description: "Votre nouvelle tâche a été ajoutée avec succès.",
    });
  };

  const updateTodo = (todoData: Omit<Todo, 'id' | 'createdAt' | 'completed'>) => {
    if (!editingTodo) return;
    
    setTodos(todos.map(todo =>
      todo.id === editingTodo.id 
        ? { ...todo, ...todoData }
        : todo
    ));
    setEditingTodo(null);
    toast({
      title: "Tâche modifiée !",
      description: "Votre tâche a été mise à jour avec succès.",
    });
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
    toast({
      title: "Tâche supprimée !",
      description: "La tâche a été supprimée de votre liste.",
    });
  };

  const toggleComplete = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(filteredAndSortedTodos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update the original todos array to maintain the new order
    const reorderedIds = items.map(item => item.id);
    const newTodos = [...todos];
    newTodos.sort((a, b) => {
      const aIndex = reorderedIds.indexOf(a.id);
      const bIndex = reorderedIds.indexOf(b.id);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });

    setTodos(newTodos);
    toast({
      title: "Tâches réorganisées !",
      description: "L'ordre de vos tâches a été mis à jour.",
    });
  };

  const filteredAndSortedTodos = useMemo(() => {
    let filtered = todos.filter(todo => {
      const matchesSearch = !filters.search || 
        todo.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        (todo.description && todo.description.toLowerCase().includes(filters.search.toLowerCase()));
      
      const matchesCategory = !filters.category || todo.category === filters.category;
      const matchesPriority = !filters.priority || todo.priority === filters.priority;
      
      return matchesSearch && matchesCategory && matchesPriority;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { 'Haute': 3, 'Moyenne': 2, 'Basse': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      } else if (sortBy === 'dueDate') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return filtered;
  }, [todos, filters, sortBy]);

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;
  const urgentCount = todos.filter(todo => {
    const daysUntil = Math.ceil((todo.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil <= 2 && daysUntil >= 0 && !todo.completed;
  }).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Gestionnaire de Tâches
          </h1>
          <p className="text-slate-300 text-lg mb-6">
            Organisez vos tâches avec priorités, catégories et échéances
          </p>
          
          <div className="flex justify-center gap-6">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span className="text-white font-medium">
                {completedCount} / {totalCount} terminées
              </span>
            </div>
            {urgentCount > 0 && (
              <div className="inline-flex items-center px-4 py-2 bg-red-500/20 backdrop-blur-sm rounded-full border border-red-500/30">
                <span className="text-red-300 font-medium">
                  {urgentCount} urgente{urgentCount > 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Add Task Button */}
        <div className="mb-6 text-center">
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle tâche
          </Button>
        </div>

        {/* Form */}
        {(showForm || editingTodo) && (
          <div className="mb-8">
            <TodoForm
              onSubmit={editingTodo ? updateTodo : addTodo}
              onCancel={() => {
                setShowForm(false);
                setEditingTodo(null);
              }}
              initialData={editingTodo || undefined}
              isEditing={!!editingTodo}
            />
          </div>
        )}

        {/* Filters */}
        <TodoFiltersComponent filters={filters} onFiltersChange={setFilters} />

        {/* Sort Controls */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <SortAsc className="h-4 w-4 text-white" />
              <span className="text-white">Trier par:</span>
              <Select value={sortBy} onValueChange={(value: 'priority' | 'dueDate' | 'created') => setSortBy(value)}>
                <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="priority" className="text-white hover:bg-slate-700">Priorité</SelectItem>
                  <SelectItem value="dueDate" className="text-white hover:bg-slate-700">Date d'échéance</SelectItem>
                  <SelectItem value="created" className="text-white hover:bg-slate-700">Date de création</SelectItem>
                </SelectContent>
              </Select>
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
                {filteredAndSortedTodos.map((todo, index) => (
                  <Draggable key={todo.id} draggableId={todo.id} index={index}>
                    {(provided, snapshot) => (
                      <TodoCard
                        todo={todo}
                        onToggleComplete={toggleComplete}
                        onEdit={setEditingTodo}
                        onDelete={deleteTodo}
                        provided={provided}
                        snapshot={snapshot}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                
                {filteredAndSortedTodos.length === 0 && (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {todos.length === 0 ? 'Aucune tâche' : 'Aucun résultat'}
                    </h3>
                    <p className="text-slate-400">
                      {todos.length === 0 
                        ? 'Créez votre première tâche pour commencer !' 
                        : 'Essayez de modifier vos filtres.'
                      }
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
            Glissez-déposez pour réorganiser • Cliquez pour modifier • Gestionnaire de tâches avancé
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
