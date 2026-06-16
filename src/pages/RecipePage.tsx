type Recipe = {
  id: string;
  name: string;
  image?: string;
  description?: string;
  cookTime: number;
  ingredients: string[];
  allInStock?: boolean;
};

type RecipePageProps = {
  recipe: Recipe;
  fridgeStock: string[];
  onNavigateHome?: () => void;
  onBack?: () => void;
};

const checkMatch = (recipe: Recipe, stock: string[]): { inStock: number; missing: number } => {
  let inStock = 0;
  let missing = 0;
  recipe.ingredients.forEach((ingredient) => {
    const lower = ingredient.toLowerCase();
    if (stock.some((item) => item.toLowerCase().includes(lower) || lower.includes(item.toLowerCase()))) {
      inStock++;
    } else {
      missing++;
    }
  });
  return { inStock, missing };
};

const getHighlights = (recipe: Recipe, stock: string[], match: { inStock: number; missing: number }): string[] => {
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
  if (stockUsed >= 2) highlights.push(`Uses ${stockUsed} from your fridge`);
  if (match.missing === 0) highlights.push('All ingredients in stock');

  return highlights.slice(0, 3);
};

function RecipePage({ recipe, fridgeStock, onNavigateHome, onBack }: RecipePageProps) {
  const match = checkMatch(recipe, fridgeStock);
  const highlights = getHighlights(recipe, fridgeStock, match);

  return (
    <div className="fridge-page">
      <header className="fridge-header">
        <div className="fridge-header-content">
          <div>
            <h1>{recipe.name}</h1>
          </div>
          {onBack && (
            <button className="btn-back-home" onClick={onBack}>
              ← Back
            </button>
          )}
        </div>
      </header>

      <main className="fridge-main">
        <div className="recipe-detail-card">
          {recipe.image && (
            <img src={recipe.image} alt={recipe.name} className="recipe-detail-image" />
          )}

          <div className="recipe-detail-body">
            <div className="recipe-detail-meta">
              <span className="cook-time-badge-lg">⏱ {recipe.cookTime} min</span>
              {highlights.map((h, i) => (
                <span key={i} className="highlight-tag">{h}</span>
              ))}
            </div>

            {recipe.description && <p className="recipe-detail-desc">{recipe.description}</p>}

            <div className="recipe-detail-match">
              <span className="match-item">✓ {match.inStock} in stock</span>
              <span className="match-item">✗ {match.missing} missing</span>
            </div>

            <h3>Ingredients</h3>
            <div className="recipe-ingredient-list">
              {recipe.ingredients.map((ing, i) => {
                const inStock = fridgeStock.some(
                  (item) => item.toLowerCase().includes(ing.toLowerCase()) || ing.toLowerCase().includes(item.toLowerCase())
                );
                return (
                  <div key={i} className={`recipe-ingredient-item ${inStock ? 'in-stock' : 'missing'}`}>
                    <span className="ing-stock-icon">{inStock ? '✓' : '✗'}</span>
                    <span className="ing-name">{ing}</span>
                    <span className="ing-status">{inStock ? 'In stock' : 'Missing'}</span>
                  </div>
                );
              })}
            </div>

            {onNavigateHome && (
              <button className="btn-select-recipe" onClick={onNavigateHome} style={{ marginTop: 24 }}>
                ← Back to home
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default RecipePage;
