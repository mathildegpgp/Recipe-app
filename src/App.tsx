import { useState } from 'react';
import { useInventory } from './context/InventoryContext';
import FridgeInventory from './pages/FridgeInventory';
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

const recipeHighlights = (recipe: Recipe, stock: string[], match: { inStock: number; missing: number }): string[] => {
  const highlights: string[] = [];
  const all = recipe.ingredients.map((i) => i.toLowerCase());
  const stockLower = stock.map((i) => i.toLowerCase());

  const hasProtein = all.some((i) => /chicken|beef|pork|salmon|eggs|bacon|turkey|fish|meat/.test(i));
  const hasFiber = all.some((i) => /broccoli|vegetable|spinach|carrot|salad|bean|lentil|pea|kale/.test(i));
  const hasOmega = all.some((i) => /salmon|fish|omega|nuts|seed|avocado/.test(i));
  const hasCalcium = all.some((i) => /milk|cheese|yogurt|cream|parmesan/.test(i));
  const isQuick = recipe.ingredients.length <= 4;

  const stockUsed = recipe.ingredients.filter((ing) =>
    stockLower.some((s) => s.includes(ing.toLowerCase()) || ing.toLowerCase().includes(s))
  ).length;

  if (hasProtein) highlights.push('High in protein');
  if (hasFiber) highlights.push('Packed with fiber');
  if (hasOmega) highlights.push('Rich in omega-3');
  if (hasCalcium) highlights.push('Good source of calcium');
  if (isQuick) highlights.push('Quick meal');
  if (stockUsed >= 2) highlights.push(`Uses ${stockUsed} ingredient${stockUsed > 1 ? 's' : ''} from your fridge`);
  if (match.missing === 0) highlights.push('All ingredients in stock');

  return highlights.slice(0, 3);
};

const recipeOfTheDay: Recipe = sampleRecipes[0];
const alternativeRecipes: Recipe[] = sampleRecipes.slice(1);

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { ingredients } = useInventory();

  const isActive = (page: Page) => currentPage === page;
  const fridgeStock = ingredients.map((i) => i.name);

  return (
    <>
      {currentPage === 'fridge' ? (
        <FridgeInventory onNavigateHome={() => setCurrentPage('home')} />
      ) : currentPage === 'gates' ? (
        <DecisionGates onNavigateHome={() => setCurrentPage('home')} />
      ) : currentPage === 'invoices' ? (
        <SupermarketInvoice onNavigateHome={() => setCurrentPage('home')} />
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
                  <div className="recipe-highlights">
                    {recipeHighlights(recipeOfTheDay, fridgeStock, checkRecipeMatch(recipeOfTheDay, fridgeStock)).map((h, i) => (
                      <span key={i} className="highlight-tag">{h}</span>
                    ))}
                  </div>
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
                        <div className="recipe-highlights-alt">
                          {recipeHighlights(recipe, fridgeStock, match).map((h, i) => (
                            <span key={i} className="highlight-tag-alt">{h}</span>
                          ))}
                        </div>
                        {isAllInStock && <p className="in-stock-badge">✓ Everything in stock</p>}
                        <p className="ingredient-status">✓ {match.inStock} | ✗ {match.missing}</p>
                        <button onClick={() => {}} className="btn-select-alt">
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
