
import React from 'react';
import { type Recipe } from '../types';
import RecipeCard from './RecipeCard';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { ChefHatIcon } from './icons/ChefHatIcon';

interface RecipeListProps {
  recipes: Recipe[];
  isLoading: boolean;
  error: string | null;
  savedRecipes: Recipe[];
  onSave: (recipe: Recipe) => void;
  onUnsave: (recipeName: string) => void;
}

const RecipeList: React.FC<RecipeListProps> = ({ recipes, isLoading, error, savedRecipes, onSave, onUnsave }) => {
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <SpinnerIcon className="animate-spin h-12 w-12 text-amber-500 mx-auto" />
        <p className="mt-4 text-lg text-gray-600">Our AI chef is thinking...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 bg-red-50 border border-red-200 rounded-lg max-w-md mx-auto">
        <p className="text-lg font-semibold text-red-700">Oops! Something went wrong.</p>
        <p className="mt-2 text-red-600">{error}</p>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-gray-100 rounded-xl">
        <ChefHatIcon className="mx-auto h-16 w-16 text-gray-400"/>
        <h3 className="mt-4 text-xl font-semibold text-gray-700">Ready for some culinary inspiration?</h3>
        <p className="mt-2 text-gray-500">Your delicious recipes will appear here once you enter your ingredients.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe, index) => {
        const isSaved = savedRecipes.some(saved => saved.recipeName === recipe.recipeName);
        return (
          <RecipeCard 
            key={`${recipe.recipeName}-${index}`} 
            recipe={recipe}
            isSaved={isSaved}
            onSave={onSave}
            onUnsave={onUnsave}
          />
        )
      })}
    </div>
  );
};

export default RecipeList;
