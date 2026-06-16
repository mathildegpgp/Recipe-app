import { useState } from 'react';
import FridgeInventory, { Ingredient } from './pages/FridgeInventory';
import DecisionGates from './pages/DecisionGates';
import SupermarketInvoice from './pages/SupermarketInvoice';

type Page = 'home' | 'fridge' | 'recipe' | 'scan' | 'gates' | 'invoices';

type Recipe = {
  id: string;
  name: string;
  image?: string;
  description?: string;
  ingredients: string[];
  allInStock?: boolean;
};

const sampleRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Garlic Butter Chicken',
    description: 'Juicy pan-seared chicken with garlic and herbs',
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop',
    ingredients: ['chicken breast', 'garlic', 'butter', 'herbs', 'salt', 'pepper']
  },
  {
    id: '2',
    name: 'Simple Veggie Toss',
    description: 'Fresh tomato and broccoli with garlic',
    image: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b6?w=400&h=300&fit=crop',
    ingredients: ['broccoli', 'tomato', 'garlic', 'salt', 'pepper'],
    allInStock: true
  },
  {
    id: '3',
    name: 'Pasta Carbonara',
    description: 'Creamy Italian pasta with bacon',
    image: 'https://images.unsplash.com/photo-1612874742237-6526221fcf4f?w=400&h=300&fit=crop',
    ingredients: ['pasta', 'eggs', 'bacon', 'parmesan', 'black pepper']
  },
  {
    id: '4',
    name: 'Grilled Salmon',
    description: 'Omega-3 rich salmon with lemon',
    image: 'https://images.unsplash.com/photo-1580959375944-abd7e991f971?w=400&h=300&fit=crop',
    ingredients: ['salmon', 'lemon', 'olive oil', 'salt', 'pepper']
  },
  {
    id: '5',
    name: 'Thai Green Curry',
    description: 'Spicy and aromatic coconut curry',
    image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1ae15f?w=400&h=300&fit=crop',
    ingredients: ['coconut milk', 'curry paste', 'chicken', 'basil', 'lime']
  }
];

const checkRecipeMatch = (recipe: Recipe, stock: string[]): { inStock: number; missing: number } => {
  let inStock = 0;
  let missing = 0;
  
  recipe.ingredients.forEach((ingredient) => {
    const lowerIngredient = ingredient.toLowerCase();
    if (stock.some((item) => item.toLowerCase().includes(lowerIngredient) || lowerIngredient.includes(item.toLowerCase()))) {
      inStock++;
    } else {
      missing++;
    }
  });
  
  return { inStock, missing };
};

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [recipeOfTheDay, setRecipeOfTheDay] = useState<Recipe>(sampleRecipes[0]);
  const [alternativeRecipes, setAlternativeRecipes] = useState<Recipe[]>(sampleRecipes.slice(1));
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: '1', name: 'Chicken breast', quantity: '500', unit: 'g', category: 'meat', addedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { id: '2', name: 'Milk', quantity: '1', unit: 'L', category: 'dairy', addedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
    { id: '3', name: 'Broccoli', quantity: '2', unit: 'heads', category: 'vegetables', addedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    { id: '4', name: 'Eggs', quantity: '12', unit: 'count', category: 'dairy', addedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
    { id: '5', name: 'Sourdough bread', quantity: '1', unit: 'loaf', category: 'bread', addedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
    { id: '6', name: 'Salmon', quantity: '400', unit: 'g', category: 'meat', addedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    { id: '7', name: 'Tomato', quantity: '3', unit: 'count', category: 'vegetables', addedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
  ]);

  const selectRecipe = (recipe: Recipe) => {
    setRecipeOfTheDay(recipe);
    setAlternativeRecipes(sampleRecipes.filter((r) => r.id !== recipe.id));
  };

  const isActive = (page: Page) => currentPage === page;

  const fridgeStock = ingredients.map((i) => i.name);

  const addIngredient = (ingredient: Ingredient) => {
    setIngredients((prev) => [...prev, ingredient].sort((a, b) => b.addedDate.getTime() - a.addedDate.getTime()));
  };

  const addIngredients = (items: Ingredient[]) => {
    setIngredients((prev) => [...prev, ...items].sort((a, b) => b.addedDate.getTime() - a.addedDate.getTime()));
  };

  const removeIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <>
      {currentPage === 'fridge' ? (
        <FridgeInventory
          ingredients={ingredients}
          onAddIngredient={addIngredient}
          onRemoveIngredient={removeIngredient}
          onNavigateHome={() => setCurrentPage('home')}
        />
      ) : currentPage === 'gates' ? (
        <DecisionGates onNavigateHome={() => setCurrentPage('home')} />
      ) : currentPage === 'invoices' ? (
        <SupermarketInvoice
          ingredients={ingredients}
          onAddIngredients={addIngredients}
          onNavigateHome={() => setCurrentPage('home')}
        />
      ) : (
        <div className="app-shell">
          <header>
            <h1>Scan-and-snack</h1>
            <nav className="header-nav">
              <button onClick={() => setCurrentPage('home')} className={isActive('home') ? 'active' : ''}>
                Home
              </button>
              <button onClick={() => setCurrentPage('fridge')} className={isActive('fridge') ? 'active' : ''}>
                🧊 My Fridge
              </button>
              <button onClick={() => setCurrentPage('invoices')} className={isActive('invoices') ? 'active' : ''}>
                🧾 Invoices
              </button>
              <button onClick={() => setCurrentPage('gates')} className={isActive('gates') ? 'active' : ''}>
                🍳 Decision Gates
              </button>
            </nav>
          </header>

          <main className="home-page">
            <section className="recipe-of-the-day">
              <div className="recipe-card-featured">
                {recipeOfTheDay.image && (
                  <img src={recipeOfTheDay.image} alt={recipeOfTheDay.name} className="recipe-image" />
                )}
                <div className="recipe-info">
                  <p className="recipe-label">Recipe of the day</p>
                  <h2>{recipeOfTheDay.name}</h2>
                  {recipeOfTheDay.description && <p className="recipe-description">{recipeOfTheDay.description}</p>}
                  <button className="btn-select-recipe">Select this recipe</button>
                  <div className="ingredient-match">
                    <span className="match-item">✓ {checkRecipeMatch(recipeOfTheDay, fridgeStock).inStock} in stock</span>
                    <span className="match-item">✗ {checkRecipeMatch(recipeOfTheDay, fridgeStock).missing} missing</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="alternatives">
              <h3>Or choose from these alternatives</h3>
              <div className="recipe-list">
                {alternativeRecipes.map((recipe) => {
                  const match = checkRecipeMatch(recipe, fridgeStock);
                  const isAllInStock = match.missing === 0;
                  return (
                    <div key={recipe.id} className={`recipe-card-alt ${isAllInStock ? 'all-in-stock' : ''}`}>
                      {recipe.image && <img src={recipe.image} alt={recipe.name} className="recipe-thumb" />}
                      <div className="recipe-alt-info">
                        <h4>{recipe.name}</h4>
                        {isAllInStock && <p className="in-stock-badge">✓ Everything in stock</p>}
                        <p className="ingredient-status">✓ {match.inStock} | ✗ {match.missing}</p>
                        <button onClick={() => selectRecipe(recipe)} className="btn-select-alt">
                          Choose
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="grocery-summary">
              <div className="grocery-card">
                <p className="grocery-label">Total groceries in fridge</p>
                <p className="grocery-count">{ingredients.length} items</p>
              </div>
            </section>
          </main>
        </div>
      )}
    </>
  );
}

export default App;
