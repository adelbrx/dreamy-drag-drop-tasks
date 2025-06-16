
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TodoFilters } from '@/types/todo';

interface TodoFiltersProps {
  filters: TodoFilters;
  onFiltersChange: (filters: TodoFilters) => void;
}

const TodoFiltersComponent: React.FC<TodoFiltersProps> = ({ filters, onFiltersChange }) => {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value || undefined });
  };

  const handleCategoryChange = (value: string) => {
    onFiltersChange({ ...filters, category: value === 'all' ? undefined : value });
  };

  const handlePriorityChange = (value: string) => {
    onFiltersChange({ ...filters, priority: value === 'all' ? undefined : value });
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-6">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-white mb-2 block">Recherche</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Rechercher dans les tâches..."
                value={filters.search || ''}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <Label className="text-white mb-2 block">Catégorie</Label>
            <Select value={filters.category || 'all'} onValueChange={handleCategoryChange}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all" className="text-white hover:bg-slate-700">Toutes</SelectItem>
                <SelectItem value="Perso" className="text-white hover:bg-slate-700">Perso</SelectItem>
                <SelectItem value="Pro" className="text-white hover:bg-slate-700">Pro</SelectItem>
                <SelectItem value="Autre" className="text-white hover:bg-slate-700">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-white mb-2 block">Priorité</Label>
            <Select value={filters.priority || 'all'} onValueChange={handlePriorityChange}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all" className="text-white hover:bg-slate-700">Toutes</SelectItem>
                <SelectItem value="Haute" className="text-red-400 hover:bg-slate-700">🔴 Haute</SelectItem>
                <SelectItem value="Moyenne" className="text-yellow-400 hover:bg-slate-700">🟡 Moyenne</SelectItem>
                <SelectItem value="Basse" className="text-green-400 hover:bg-slate-700">🟢 Basse</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoFiltersComponent;
