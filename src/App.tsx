import { useState } from 'react';
import InvoiceUpload from './InvoiceUpload';

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

function App() {
  const [tab, setTab] = useState<'recipe' | 'invoices'>('recipe');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [prefs, setPrefs] = useState<Preferences>(initialPrefs);
  const [notes, setNotes] = useState('Enter your receipt or fridge scan data to begin.');
  const [recipe, setRecipe] = useState('');
  const [manualInput, setManualInput] = useState('');

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
    setRecipe(
      `Recipe idea based on ${ingredientList}. Effort: ${prefs.effort}. Dietary tags: ${prefs.dietaryTags.join(
        ', '
      ) || 'none'}. Avoid: ${prefs.bannedIngredients || 'none'}. Notes: ${prefs.notes}`
    );
  };

  return (
    <div className="app-shell">
      <header>
        <h1>Recipe Inventory AI</h1>
        <p>Generate dinner recipes from your receipt, fridge, or manual ingredients.</p>
        <nav className="tabs">
          <button className={tab === 'recipe' ? 'active' : ''} onClick={() => setTab('recipe')}>
            Recipes
          </button>
          <button className={tab === 'invoices' ? 'active' : ''} onClick={() => setTab('invoices')}>
            Invoices
          </button>
        </nav>
      </header>

      <main>
        {tab === 'invoices' && <InvoiceUpload />}

        {tab === 'recipe' && (
        <>
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
          <h2>Recipe Output</h2>
          <div className="card output-card">
            <button onClick={generateRecipe}>Generate recipe</button>
            <pre>{recipe || 'Your recipe output will appear here.'}</pre>
          </div>
        </section>
        </>
        )}
      </main>
    </div>
  );
}

export default App;
