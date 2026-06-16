import { useState } from 'react';
import FridgeInventory from './pages/FridgeInventory';

type Page = 'home' | 'fridge' | 'recipe' | 'scan';

type Recipe = {
  id: string;
  name: string;
  image?: string;
  description?: string;
};

const sampleRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Garlic Butter Chicken',
    description: 'Juicy pan-seared chicken with garlic and herbs',
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop'
  },
  {
    id: '2',
    name: 'Vegetable Stir-fry',
    description: 'Fresh vegetables with a savory sauce',
    image: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b6?w=400&h=300&fit=crop'
  },
  {
    id: '3',
    name: 'Pasta Carbonara',
    description: 'Creamy Italian pasta with bacon',
    image: 'https://images.unsplash.com/photo-1612874742237-6526221fcf4f?w=400&h=300&fit=crop'
  },
  {
    id: '4',
    name: 'Grilled Salmon',
    description: 'Omega-3 rich salmon with lemon',
    image: 'https://images.unsplash.com/photo-1580959375944-abd7e991f971?w=400&h=300&fit=crop'
  },
  {
    id: '5',
    name: 'Thai Green Curry',
    description: 'Spicy and aromatic coconut curry',
    image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1ae15f?w=400&h=300&fit=crop'
  }
];

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
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [recipeOfTheDay, setRecipeOfTheDay] = useState<Recipe>(sampleRecipes[0]);
  const [alternativeRecipes, setAlternativeRecipes] = useState<Recipe[]>(sampleRecipes.slice(1));
  const selectRecipe = (recipe: Recipe) => {
    setRecipeOfTheDay(recipe);
    setAlternativeRecipes(sampleRecipes.filter((r) => r.id !== recipe.id));
  };

  return (
    <>
      {currentPage === 'fridge' ? (
        <FridgeInventory onNavigateHome={() => setCurrentPage('home')} />
      ) : (
        <div className="app-shell">
          <header>
            <h1>Scan-and-snack</h1>
            <nav className="header-nav">
              <button onClick={() => setCurrentPage('home')} className={currentPage === 'home' ? 'active' : ''}>
                Home
              </button>
              <button onClick={() => setCurrentPage('fridge')} className={currentPage === 'fridge' ? 'active' : ''}>
                🧊 My Fridge
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
                </div>
              </div>
            </section>

            <section className="alternatives">
              <h3>Or choose from these alternatives</h3>
              <div className="recipe-list">
                {alternativeRecipes.map((recipe) => (
                  <div key={recipe.id} className="recipe-card-alt">
                    {recipe.image && <img src={recipe.image} alt={recipe.name} className="recipe-thumb" />}
                    <div className="recipe-alt-info">
                      <h4>{recipe.name}</h4>
                      {recipe.description && <p>{recipe.description}</p>}
                      <button onClick={() => selectRecipe(recipe)} className="btn-select-alt">
                        Choose
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>
      )}
    </>
  );
}

export default App;
