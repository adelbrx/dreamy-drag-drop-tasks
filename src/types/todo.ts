
export interface Todo {
  id: string;
  title: string;
  description?: string;
  category: 'Perso' | 'Pro' | 'Autre';
  priority: 'Haute' | 'Moyenne' | 'Basse';
  dueDate: Date;
  completed: boolean;
  createdAt: Date;
}

export interface TodoFilters {
  category?: string;
  priority?: string;
  search?: string;
}
