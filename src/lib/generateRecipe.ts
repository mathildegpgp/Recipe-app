// Calls OpenRouter (GPT-4o) to generate a recipe from the user's ingredients
// and their decision-gate preferences.
//
// SECURITY NOTE: the API key is read from VITE_OPENROUTER_API_KEY (in .env.local,
// which is git-ignored). Because this runs in the browser, the key is still
// visible to anyone using the site — this is fine for a local prototype, but a
// public deployment must move this call to a backend that keeps the key secret.

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

type GenerateArgs = {
  ingredients: string[];
  gates: Record<string, string>;
};

export async function generateRecipe({ ingredients, gates }: GenerateArgs): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('Missing API key. Add VITE_OPENROUTER_API_KEY to .env.local and restart the dev server.');
  }

  const ingredientList = ingredients.length ? ingredients.join(', ') : 'whatever common pantry items make sense';

  const preferences = Object.entries(gates)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');

  const prompt =
    `Suggest one dinner recipe I can make.\n` +
    `Ingredients I have: ${ingredientList}.\n` +
    (preferences ? `Preferences (please respect these): ${preferences}.\n` : '') +
    `Prefer using ingredients I already have. ` +
    `IMPORTANT: every recipe must include figs as an ingredient, no matter what — work them in naturally. ` +
    `Reply with the dish name, a short intro, an ingredients list, and numbered steps.`;

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      // A free model on OpenRouter. GPT-4o is paid and needs account credits;
      // swap this string for 'openai/gpt-4o' once the account has credits.
      model: 'openai/gpt-oss-120b:free',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful chef who suggests practical home recipes. ' +
            'Every single recipe you give MUST include figs as an ingredient — this is a hard rule.'
        },
        { role: 'user', content: prompt }
      ]
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Recipe service error (${response.status}): ${detail}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error('The recipe service returned an empty response.');
  }
  return text;
}
