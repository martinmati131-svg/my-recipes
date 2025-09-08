
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { type Recipe } from './types';
import { generateRecipes } from './services/geminiService';
import IngredientInput from './components/IngredientInput';
import RecipeList from './components/RecipeList';
import RecipeCard from './components/RecipeCard';
import { ChefHatIcon } from './components/icons/ChefHatIcon';
import SearchInput from './components/SearchInput';
import SortControls from './components/SortControls';

const App: React.FC = () => {
  const [ingredients, setIngredients] = useState<string>('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'date' | 'name'>('date');

  const LOCAL_STORAGE_KEY = 'pantryChefSavedRecipes';

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setSavedRecipes(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load recipes from localStorage", e);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedRecipes));
    } catch (e) {
      console.error("Failed to save recipes to localStorage", e);
    }
  }, [savedRecipes]);

  const handleSaveRecipe = (recipeToSave: Recipe) => {
    setSavedRecipes(prev => {
      if (prev.some(r => r.recipeName === recipeToSave.recipeName)) {
        return prev;
      }
      const recipeWithTimestamp = { ...recipeToSave, savedAt: Date.now() };
      return [...prev, recipeWithTimestamp];
    });
  };
  
  const handleUnsaveRecipe = (recipeNameToUnsave: string) => {
    setSavedRecipes(prev => prev.filter(r => r.recipeName !== recipeNameToUnsave));
  };


  const handleGenerateRecipes = useCallback(async () => {
    if (!ingredients.trim()) {
      setError('Please enter some ingredients.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setRecipes([]);

    try {
      const generated = await generateRecipes(ingredients);
      setRecipes(generated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [ingredients]);

  const sortedSavedRecipes = useMemo(() => {
    const sortableRecipes = [...savedRecipes];
    if (sortOrder === 'name') {
      sortableRecipes.sort((a, b) => a.recipeName.localeCompare(b.recipeName));
    } else { // 'date'
      sortableRecipes.sort((a, b) => (b.savedAt ?? 0) - (a.savedAt ?? 0));
    }
    return sortableRecipes;
  }, [savedRecipes, sortOrder]);

  const filteredSavedRecipes = sortedSavedRecipes.filter(recipe => {
    const query = searchQuery.toLowerCase();
    return (
      recipe.recipeName.toLowerCase().includes(query) ||
      recipe.ingredients.some(ingredient => ingredient.name.toLowerCase().includes(query))
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-center space-x-3">
          <ChefHatIcon className="h-8 w-8 text-amber-500" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
            Pantry Chef AI
          </h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">What's in your pantry?</h2>
            <p className="mt-2 text-gray-500">
              Enter the ingredients you have, and our AI will whip up some recipe ideas for you!
            </p>
        </div>

        <div className="max-w-2xl mx-auto mt-8">
          <IngredientInput 
            ingredients={ingredients}
            setIngredients={setIngredients}
            onGenerate={handleGenerateRecipes}
            isLoading={isLoading}
          />
        </div>

        <div className="mt-12">
          <RecipeList 
            recipes={recipes}
            isLoading={isLoading}
            error={error}
            savedRecipes={savedRecipes}
            onSave={handleSaveRecipe}
            onUnsave={handleUnsaveRecipe}
          />
        </div>

        {savedRecipes.length > 0 && (
          <section className="mt-16 pt-8 border-t">
            <div className="max-w-3xl mx-auto text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">My Saved Recipes</h2>
            </div>
            
            <div className="max-w-xl mx-auto mb-8 flex flex-col sm:flex-row gap-4 items-center">
              <div className="w-full sm:flex-grow">
                <SearchInput
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search saved recipes..."
                  aria-label="Search saved recipes"
                />
              </div>
              <SortControls
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
              />
            </div>
            
            {filteredSavedRecipes.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredSavedRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.recipeName}
                    recipe={recipe}
                    isSaved={true}
                    onSave={handleSaveRecipe}
                    onUnsave={handleUnsaveRecipe}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                <p>No saved recipes match your search.</p>
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="text-center py-6 mt-8 text-gray-400 text-sm">
        <p>Powered by Gemini API</p>
      </footer>
    </div>
  );
};

export default App;
