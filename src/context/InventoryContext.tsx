import { createContext, useContext, useState, ReactNode } from 'react';

export type IngredientCategory = 'bread' | 'meat' | 'vegetables' | 'dairy' | 'other';

// One shared ingredient that any page can read or update.
export type Ingredient = {
  id: string;
  name: string;
  quantity?: string;
  unit?: string;
  category: IngredientCategory;
  addedDate: Date;
};

// Guess a category from the ingredient name so every source (fridge, gates,
// future receipt scan) categorizes consistently.
export const categorizeIngredient = (name: string): IngredientCategory => {
  const lowerName = name.toLowerCase();
  if (lowerName.match(/bread|toast|bagel|baguette|croissant|roll|bun/)) return 'bread';
  if (lowerName.match(/chicken|beef|pork|turkey|lamb|fish|salmon|steak|meat/)) return 'meat';
  if (lowerName.match(/broccoli|tomato|carrot|lettuce|spinach|pepper|onion|garlic|vegetable|cucumber|zucchini/)) return 'vegetables';
  if (lowerName.match(/milk|cheese|yogurt|butter|cream|dairy|ice cream/)) return 'dairy';
  return 'other';
};

type InventoryContextValue = {
  ingredients: Ingredient[];
  addIngredient: (name: string, quantity?: string, unit?: string) => void;
  removeIngredient: (id: string) => void;
};

const InventoryContext = createContext<InventoryContextValue | undefined>(undefined);

const seedIngredients: Ingredient[] = [
  { id: '1', name: 'Chicken breast', quantity: '500', unit: 'g', category: 'meat', addedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
  { id: '2', name: 'Milk', quantity: '1', unit: 'L', category: 'dairy', addedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
  { id: '3', name: 'Broccoli', quantity: '2', unit: 'heads', category: 'vegetables', addedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
  { id: '4', name: 'Eggs', quantity: '12', unit: 'count', category: 'dairy', addedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
  { id: '5', name: 'Sourdough bread', quantity: '1', unit: 'loaf', category: 'bread', addedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
  { id: '6', name: 'Salmon', quantity: '400', unit: 'g', category: 'meat', addedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
  { id: '7', name: 'Tomato', quantity: '3', unit: 'count', category: 'vegetables', addedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) }
];

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [ingredients, setIngredients] = useState<Ingredient[]>(seedIngredients);

  const addIngredient = (name: string, quantity?: string, unit?: string) => {
    if (!name.trim()) return;
    const next: Ingredient = {
      id: `${Date.now()}`,
      name: name.trim(),
      quantity: quantity || undefined,
      unit: unit || undefined,
      category: categorizeIngredient(name),
      addedDate: new Date()
    };
    setIngredients((prev) => [...prev, next].sort((a, b) => b.addedDate.getTime() - a.addedDate.getTime()));
  };

  const removeIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <InventoryContext.Provider value={{ ingredients, addIngredient, removeIngredient }}>
      {children}
    </InventoryContext.Provider>
  );
}

// Small helper so pages can grab the shared inventory with one call.
export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) {
    throw new Error('useInventory must be used inside an InventoryProvider');
  }
  return ctx;
}
