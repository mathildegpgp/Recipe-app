import { useState } from 'react';

type Ingredient = {
  id: string;
  name: string;
  quantity?: string;
  unit?: string;
  addedDate: Date;
};

type FridgeInventoryProps = {
  onNavigateHome?: () => void;
};

function FridgeInventory({ onNavigateHome }: FridgeInventoryProps) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: '1', name: 'Chicken breast', quantity: '500', unit: 'g', addedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { id: '2', name: 'Milk', quantity: '1', unit: 'L', addedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
    { id: '3', name: 'Broccoli', quantity: '2', unit: 'heads', addedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    { id: '4', name: 'Eggs', quantity: '12', unit: 'count', addedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
  ]);

  const [inputName, setInputName] = useState('');
  const [inputQuantity, setInputQuantity] = useState('');
  const [inputUnit, setInputUnit] = useState('');

  const addIngredient = () => {
    if (!inputName.trim()) return;

    const newIngredient: Ingredient = {
      id: `${Date.now()}`,
      name: inputName.trim(),
      quantity: inputQuantity || undefined,
      unit: inputUnit || undefined,
      addedDate: new Date()
    };

    setIngredients((prev) => [...prev, newIngredient].sort((a, b) => b.addedDate.getTime() - a.addedDate.getTime()));
    setInputName('');
    setInputQuantity('');
    setInputUnit('');
  };

  const removeIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((item) => item.id !== id));
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
                  <button className="btn-remove" onClick={() => removeIngredient(item.id)}>
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
