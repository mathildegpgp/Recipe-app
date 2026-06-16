import { useState, useMemo } from 'react';

export type IngredientCategory = 'bread' | 'meat' | 'vegetables' | 'dairy' | 'other';

export type Ingredient = {
  id: string;
  name: string;
  quantity?: string;
  unit?: string;
  category: IngredientCategory;
  addedDate: Date;
};

const categoryColors: Record<IngredientCategory, string> = {
  bread: '#f59e0b',
  meat: '#ef4444',
  vegetables: '#22c55e',
  dairy: '#3b82f6',
  other: '#8b5cf6'
};

export const categorizeIngredient = (name: string): IngredientCategory => {
  const lowerName = name.toLowerCase();
  
  if (lowerName.match(/bread|toast|bagel|baguette|croissant|roll|bun/)) return 'bread';
  if (lowerName.match(/chicken|beef|pork|turkey|lamb|fish|salmon|steak|meat|mince/)) return 'meat';
  if (lowerName.match(/broccoli|tomato|carrot|lettuce|spinach|pepper|onion|garlic|vegetable|cucumber|zucchini|potato|salad|avocado|mushroom/)) return 'vegetables';
  if (lowerName.match(/milk|cheese|yogurt|butter|cream|dairy|ice cream/)) return 'dairy';
  
  return 'other';
};

type FridgeInventoryProps = {
  ingredients: Ingredient[];
  onAddIngredient: (ingredient: Ingredient) => void;
  onRemoveIngredient: (id: string) => void;
  onNavigateHome?: () => void;
};

function FridgeInventory({ ingredients, onAddIngredient, onRemoveIngredient, onNavigateHome }: FridgeInventoryProps) {
  const [inputName, setInputName] = useState('');
  const [inputQuantity, setInputQuantity] = useState('');
  const [inputUnit, setInputUnit] = useState('');

  const categorySummary = useMemo(() => {
    const summary: Record<IngredientCategory, number> = {
      bread: 0,
      meat: 0,
      vegetables: 0,
      dairy: 0,
      other: 0
    };
    
    ingredients.forEach((item) => {
      summary[item.category]++;
    });
    
    return summary;
  }, [ingredients]);

  const addIngredient = () => {
    if (!inputName.trim()) return;

    const category = categorizeIngredient(inputName);
    const newIngredient: Ingredient = {
      id: `${Date.now()}`,
      name: inputName.trim(),
      quantity: inputQuantity || undefined,
      unit: inputUnit || undefined,
      category,
      addedDate: new Date()
    };

    onAddIngredient(newIngredient);
    setInputName('');
    setInputQuantity('');
    setInputUnit('');
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'yesterday';
    } else {
      const daysAgo = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      return `${daysAgo} days ago`;
    }
  };

  return (
    <div className="fridge-page">
      <header className="fridge-header">
        <div className="fridge-header-content">
          <div>
            <h1>🧊 What's in my fridge?</h1>
            <p>Manage your available ingredients and groceries here.</p>
          </div>
          {onNavigateHome && (
            <button className="btn-back-home" onClick={onNavigateHome}>
              ← Back to home
            </button>
          )}
        </div>
      </header>

      <main className="fridge-main">
        <section className="category-summary">
          <h2>What you have</h2>
          <div className="summary-cards">
            {Object.entries(categorySummary).map(([category, count]) => (
              <div
                key={category}
                className="summary-card"
                style={{ borderColor: categoryColors[category as IngredientCategory] }}
              >
                <div className="category-icon" style={{ backgroundColor: categoryColors[category as IngredientCategory] }}></div>
                <div className="summary-info">
                  <p className="category-name">{category.charAt(0).toUpperCase() + category.slice(1)}</p>
                  <p className="item-count">{count} {count === 1 ? 'item' : 'items'}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="add-ingredient-section">
          <h2>Add new ingredient</h2>
          <div className="add-form">
            <input
              type="text"
              placeholder="Ingredient name (e.g., Tomato)"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addIngredient()}
            />
            <input
              type="number"
              placeholder="Quantity"
              value={inputQuantity}
              onChange={(e) => setInputQuantity(e.target.value)}
            />
            <input
              type="text"
              placeholder="Unit (e.g., g, L, count)"
              value={inputUnit}
              onChange={(e) => setInputUnit(e.target.value)}
            />
            <button className="btn-add" onClick={addIngredient}>
              + Add
            </button>
          </div>
        </section>

        <section className="inventory-section">
          <h2>Your inventory ({ingredients.length})</h2>

          {ingredients.length === 0 ? (
            <div className="empty-state">
              <p>No ingredients yet. Start by adding some!</p>
            </div>
          ) : (
            <div className="ingredient-cards">
              {ingredients.map((item) => (
                <div key={item.id} className="ingredient-card">
                  <div className="ingredient-info">
                    <h3>{item.name}</h3>
                    <p className="ingredient-details">
                      {item.quantity && item.unit ? (
                        <>
                          <span className="quantity">{item.quantity} {item.unit}</span>
                          <span className="separator">•</span>
                        </>
                      ) : null}
                      <span className="date">Added {formatDate(item.addedDate)}</span>
                    </p>
                  </div>
                  <button className="btn-remove" onClick={() => onRemoveIngredient(item.id)}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default FridgeInventory;
