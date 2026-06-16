import { useState } from 'react';
import { generateRecipe } from '../lib/generateRecipe';
import { useInventory } from '../context/InventoryContext';

// Each decision gate is an either/or choice that steers the recipe.
type Gate = {
  key: string;
  label: string;
  options: [string, string];
};

const decisionGates: Gate[] = [
  { key: 'temperature', label: 'Temperature', options: ['Hot', 'Cold'] },
  { key: 'flavor', label: 'Flavor', options: ['Sweet', 'Savory'] },
  { key: 'complexity', label: 'Complexity', options: ['Simple', 'Elaborate'] },
  { key: 'time', label: 'Time', options: ['Quick', 'Slow-cooked'] }
];

type DecisionGatesProps = {
  onNavigateHome?: () => void;
};

function DecisionGates({ onNavigateHome }: DecisionGatesProps) {
  // Shared inventory — same list the My Fridge page (and future receipt scan) fills.
  const { ingredients, addIngredient: addToInventory, removeIngredient } = useInventory();

  // Tracks which side of each gate the user picked, e.g. { temperature: 'Hot' }
  const [gates, setGates] = useState<Record<string, string>>({});
  const [ingredientInput, setIngredientInput] = useState('');
  const [recipe, setRecipe] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const pickGate = (key: string, choice: string) => {
    setGates((prev) =>
      // Clicking the already-selected option turns it off again.
      prev[key] === choice ? { ...prev, [key]: '' } : { ...prev, [key]: choice }
    );
  };

  const addIngredient = () => {
    if (!ingredientInput.trim()) return;
    addToInventory(ingredientInput);
    setIngredientInput('');
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setRecipe('');
    try {
      const result = await generateRecipe({
        ingredients: ingredients.map((item) => item.name),
        gates
      });
      setRecipe(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fridge-page">
      <header className="fridge-header">
        <div className="fridge-header-content">
          <div>
            <h1>🍳 Decision gates</h1>
            <p>Choose what you have and how you want it, then generate a recipe.</p>
          </div>
          {onNavigateHome && (
            <button className="btn-back-home" onClick={onNavigateHome}>
              ← Back to home
            </button>
          )}
        </div>
      </header>

      <main className="fridge-main">
        <section className="gates-section">
          <h2>What do you have?</h2>
          <div className="card">
            <div className="ingredient-input-row">
              <input
                type="text"
                placeholder="e.g. chicken, rice, broccoli"
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addIngredient()}
              />
              <button className="btn-add-ingredient" onClick={addIngredient}>
                + Add
              </button>
            </div>
            {ingredients.length > 0 && (
              <div className="ingredient-chips">
                {ingredients.map((item) => (
                  <span className="ingredient-chip" key={item.id}>
                    {item.name}
                    <button onClick={() => removeIngredient(item.id)} aria-label={`Remove ${item.name}`}>
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="gates-section">
          <h2>How do you want it?</h2>
          <p className="pane-hint">Pick a side for each. Click again to clear.</p>
          <div className="card">
            {decisionGates.map((gate) => (
              <div className="gate-row" key={gate.key}>
                <span className="gate-label">{gate.label}</span>
                <div className="gate-options">
                  {gate.options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={gates[gate.key] === option ? 'gate-btn active' : 'gate-btn'}
                      onClick={() => pickGate(gate.key, option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="gates-section">
          <button className="btn-generate" onClick={handleGenerate} disabled={loading}>
            {loading ? 'Cooking up an idea…' : 'Generate recipe'}
          </button>

          {error && <div className="recipe-error">{error}</div>}

          {recipe && (
            <div className="card recipe-result">
              <h2>Your recipe</h2>
              <pre>{recipe}</pre>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default DecisionGates;
