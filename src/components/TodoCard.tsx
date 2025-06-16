
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Edit3, Trash2, Calendar, AlertTriangle } from 'lucide-react';
import { Todo } from '@/types/todo';
import { format, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TodoCardProps {
  todo: Todo;
  onToggleComplete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  provided?: any;
  snapshot?: any;
}

const TodoCard: React.FC<TodoCardProps> = ({ 
  todo, 
  onToggleComplete, 
  onEdit, 
  onDelete, 
  provided, 
  snapshot 
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Haute': return 'border-l-red-500 bg-red-500/10';
      case 'Moyenne': return 'border-l-yellow-500 bg-yellow-500/10';
      case 'Basse': return 'border-l-green-500 bg-green-500/10';
      default: return 'border-l-gray-500 bg-gray-500/10';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Haute': return '🔴';
      case 'Moyenne': return '🟡';
      case 'Basse': return '🟢';
      default: return '⚪';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Pro': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Perso': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Autre': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const daysUntilDue = differenceInDays(todo.dueDate, new Date());
  const isUrgent = daysUntilDue <= 2 && daysUntilDue >= 0;
  const isOverdue = daysUntilDue < 0;

  return (
    <Card
      ref={provided?.innerRef}
      {...provided?.draggableProps}
      {...provided?.dragHandleProps}
      className={`
        ${getPriorityColor(todo.priority)}
        border-l-4 bg-white/10 backdrop-blur-sm border-white/20 shadow-lg 
        transition-all duration-200 hover:bg-white/15 hover:scale-[1.02] hover:shadow-xl
        ${snapshot?.isDragging ? 'rotate-3 shadow-2xl bg-white/20' : ''}
        ${todo.completed ? 'opacity-75' : ''}
        ${isUrgent || isOverdue ? 'ring-2 ring-red-400/50' : ''}
      `}
    >
      <CardContent className="p-4">
        {(isUrgent || isOverdue) && (
          <div className="flex items-center gap-2 mb-2 text-red-400 text-sm">
            <AlertTriangle className="h-4 w-4" />
            {isOverdue ? 'En retard' : 'Urgent - échéance proche'}
          </div>
        )}
        
        <div className="flex items-start gap-3">
          <button
            onClick={() => onToggleComplete(todo.id)}
            className={`
              w-6 h-6 rounded-full border-2 flex items-center justify-center 
              transition-all duration-200 hover:scale-110 mt-1
              ${todo.completed 
                ? 'bg-green-500 border-green-500' 
                : 'border-white/40 hover:border-white/60'
              }
            `}
          >
            {todo.completed && <Check className="h-3 w-3 text-white" />}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{getPriorityIcon(todo.priority)}</span>
              <span className={`px-2 py-1 rounded-full text-xs border ${getCategoryColor(todo.category)}`}>
                {todo.category}
              </span>
            </div>

            <h3 className={`
              text-white font-medium mb-1 transition-all duration-200
              ${todo.completed ? 'line-through text-slate-400' : ''}
            `}>
              {todo.title}
            </h3>

            {todo.description && (
              <p className={`
                text-slate-300 text-sm mb-2 transition-all duration-200
                ${todo.completed ? 'line-through text-slate-500' : ''}
              `}>
                {todo.description}
              </p>
            )}

            <div className="flex items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span className={isOverdue ? 'text-red-400' : isUrgent ? 'text-orange-400' : ''}>
                  {format(todo.dueDate, 'dd MMM yyyy', { locale: fr })}
                </span>
              </div>
              <span>Priorité: {todo.priority}</span>
            </div>
          </div>

          <div className="flex gap-1">
            <Button
              onClick={() => onEdit(todo)}
              size="sm"
              variant="ghost"
              className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/20 h-8 w-8 p-0"
            >
              <Edit3 className="h-3 w-3" />
            </Button>
            <Button
              onClick={() => onDelete(todo.id)}
              size="sm"
              variant="ghost"
              className="text-red-400 hover:text-red-300 hover:bg-red-400/20 h-8 w-8 p-0"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoCard;
