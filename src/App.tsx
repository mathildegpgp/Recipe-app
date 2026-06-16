import { useState } from 'react';

type Ingredient = {
  id: string;
  name: string;
  quantity: string;
  source: 'receipt' | 'fridge' | 'manual';
};

type Preferences = {
  effort: string;
  dietaryTags: string[];
  bannedIngredients: string;
  notes: string;
};

const initialPrefs: Preferences = {
  effort: '30 min',
  dietaryTags: [],
  bannedIngredients: '',
  notes: ''
};

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

function App() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [prefs, setPrefs] = useState<Preferences>(initialPrefs);
  const [notes, setNotes] = useState('Enter your receipt or fridge scan data to begin.');
  const [recipe, setRecipe] = useState('');
  const [manualInput, setManualInput] = useState('');
  // Tracks which side of each gate the user picked, e.g. { temperature: 'Hot' }
  const [gates, setGates] = useState<Record<string, string>>({});

  const pickGate = (key: string, choice: string) => {
    setGates((prev) =>
      // Clicking the already-selected option turns it off again.
      prev[key] === choice ? { ...prev, [key]: '' } : { ...prev, [key]: choice }
    );
  };

  const addManualIngredient = () => {
    if (!manualInput.trim()) return;
    setIngredients((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${prev.length}`,
        name: manualInput.trim(),
        quantity: '1',
        source: 'manual'
      }
    ]);
    setManualInput('');
  };

  const removeIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((item) => item.id !== id));
  };

  const generateRecipe = () => {
    const ingredientList = ingredients.map((item) => item.name).join(', ') || 'no ingredients';
    const gateChoices =
      decisionGates
        .map((gate) => gates[gate.key] && `${gate.label}: ${gates[gate.key]}`)
        .filter(Boolean)
        .join(', ') || 'no preference';
    setRecipe(
      `Recipe idea based on ${ingredientList}. Style: ${gateChoices}. Effort: ${prefs.effort}. Dietary tags: ${prefs.dietaryTags.join(
        ', '
      ) || 'none'}. Avoid: ${prefs.bannedIngredients || 'none'}. Notes: ${prefs.notes}`
    );
  };

  return (
    <div className="app-shell">
      <header>
        <h1>Recipe Inventory AI</h1>
        <p>Generate dinner recipes from your receipt, fridge, or manual ingredients.</p>
      </header>

      <main>
        <section className="pane">
          <h2>Inventory</h2>
          <div className="grid">
            <div className="card">
              <h3>Manual ingredient entry</h3>
              <div className="input-row">
                <input
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="e.g. chicken breast"
                />
                <button onClick={addManualIngredient}>Add</button>
              </div>
              <ul className="ingredient-list">
                {ingredients.map((item) => (
                  <li key={item.id}>
                    <span>{item.name}</span>
                    <button onClick={() => removeIngredient(item.id)}>Remove</button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card">
              <h3>Receipt / Fridge Scan</h3>
              <p>{notes}</p>
              <button onClick={() => setNotes('Receipt and fridge scan are coming soon.')}>Simulate scan</button>
            </div>
          </div>
        </section>

        <section className="pane">
          <h2>Preferences</h2>
          <div className="card">
            <label>
              Effort level
              <select value={prefs.effort} onChange={(e) => setPrefs({ ...prefs, effort: e.target.value })}>
                <option>15 min</option>
                <option>30 min</option>
                <option>45 min</option>
                <option>60 min</option>
              </select>
            </label>

            <label>
              Dietary tags
              <div className="tag-row">
                {['Vegetarian', 'Vegan', 'Dairy-free', 'Gluten-free', 'Keto'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={prefs.dietaryTags.includes(tag) ? 'active' : ''}
                    onClick={() => {
                      const nextTags = prefs.dietaryTags.includes(tag)
                        ? prefs.dietaryTags.filter((item) => item !== tag)
                        : [...prefs.dietaryTags, tag];
                      setPrefs({ ...prefs, dietaryTags: nextTags });
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </label>

            <label>
              Banned ingredients
              <input
                value={prefs.bannedIngredients}
                onChange={(e) => setPrefs({ ...prefs, bannedIngredients: e.target.value })}
                placeholder="e.g. dairy, onion"
              />
            </label>

            <label>
              Notes
              <textarea
                value={prefs.notes}
                onChange={(e) => setPrefs({ ...prefs, notes: e.target.value })}
                placeholder="Any food preference notes"
              />
            </label>
          </div>
        </section>

        <section className="pane">
          <h2>Decision Gates</h2>
          <p className="pane-hint">Steer the recipe by choosing a side. Click again to clear.</p>
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

        <section className="pane">
          <h2>Recipe Output</h2>
          <div className="card output-card">
            <button onClick={generateRecipe}>Generate recipe</button>
            <pre>{recipe || 'Your recipe output will appear here.'}</pre>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
