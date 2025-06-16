
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Plus, Check, X } from 'lucide-react';
import { Todo } from '@/types/todo';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TodoFormProps {
  onSubmit: (todo: Omit<Todo, 'id' | 'createdAt' | 'completed'>) => void;
  onCancel?: () => void;
  initialData?: Todo;
  isEditing?: boolean;
}

const TodoForm: React.FC<TodoFormProps> = ({ onSubmit, onCancel, initialData, isEditing = false }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState<'Perso' | 'Pro' | 'Autre'>(initialData?.category || 'Perso');
  const [priority, setPriority] = useState<'Haute' | 'Moyenne' | 'Basse'>(initialData?.priority || 'Moyenne');
  const [dueDate, setDueDate] = useState<Date | undefined>(initialData?.dueDate);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!title || title.trim().length < 3) {
      newErrors.title = 'Le titre doit contenir au moins 3 caractères';
    }
    
    if (!dueDate) {
      newErrors.dueDate = 'La date d\'échéance est obligatoire';
    } else if (dueDate <= new Date()) {
      newErrors.dueDate = 'La date d\'échéance doit être future';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && dueDate) {
      onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        priority,
        dueDate
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Haute': return 'text-red-500 border-red-500';
      case 'Moyenne': return 'text-yellow-500 border-yellow-500';
      case 'Basse': return 'text-green-500 border-green-500';
      default: return 'text-gray-500 border-gray-500';
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white">
          {isEditing ? 'Modifier la tâche' : 'Nouvelle tâche'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-white">Titre *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de la tâche (min. 3 caractères)"
              className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
            />
            {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <Label htmlFor="description" className="text-white">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (facultative)"
              className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white">Catégorie</Label>
              <Select value={category} onValueChange={(value: 'Perso' | 'Pro' | 'Autre') => setCategory(value)}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="Perso" className="text-white hover:bg-slate-700">Perso</SelectItem>
                  <SelectItem value="Pro" className="text-white hover:bg-slate-700">Pro</SelectItem>
                  <SelectItem value="Autre" className="text-white hover:bg-slate-700">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-white">Priorité</Label>
              <Select value={priority} onValueChange={(value: 'Haute' | 'Moyenne' | 'Basse') => setPriority(value)}>
                <SelectTrigger className={`bg-white/10 border-white/20 ${getPriorityColor(priority)}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="Haute" className="text-red-400 hover:bg-slate-700">🔴 Haute</SelectItem>
                  <SelectItem value="Moyenne" className="text-yellow-400 hover:bg-slate-700">🟡 Moyenne</SelectItem>
                  <SelectItem value="Basse" className="text-green-400 hover:bg-slate-700">🟢 Basse</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-white">Date d'échéance *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white/10 border-white/20 text-white",
                    !dueDate && "text-slate-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "dd/MM/yyyy") : "Sélectionner une date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-600">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  disabled={(date) => date <= new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {errors.dueDate && <p className="text-red-400 text-sm mt-1">{errors.dueDate}</p>}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              {isEditing ? <Check className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
              {isEditing ? 'Modifier' : 'Créer'}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="border-white/30 text-white hover:bg-white/10"
              >
                <X className="mr-2 h-4 w-4" />
                Annuler
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TodoForm;
