
import React from 'react';
import { type Recipe } from '../types';
import { BookmarkIcon } from './icons/BookmarkIcon';

interface RecipeCardProps {
  recipe: Recipe;
  isSaved: boolean;
  onSave: (recipe: Recipe) => void;
  onUnsave: (recipeName: string) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, isSaved, onSave, onUnsave }) => {
  
  const handleSaveToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSaved) {
      onUnsave(recipe.recipeName);
    } else {
      onSave(recipe);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300 flex flex-col relative">
      <button
        onClick={handleSaveToggle}
        aria-label={isSaved ? 'Unsave recipe' : 'Save recipe'}
        className="absolute top-3 right-3 z-10 p-2 bg-white/80 rounded-full text-amber-500 hover:bg-white hover:text-amber-600 transition-colors backdrop-blur-sm"
      >
        <BookmarkIcon filled={isSaved} className="h-6 w-6" />
      </button>
      <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
        {recipe.imageUrl ? (
          <img 
            className="w-full h-full object-cover" 
            src={recipe.imageUrl} 
            alt={recipe.recipeName} 
          />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )}
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-gray-800">{recipe.recipeName}</h3>
        <p className="text-gray-600 mt-2 text-sm flex-grow">{recipe.description}</p>
        
        <div className="mt-6">
          <h4 className="font-semibold text-gray-700 border-b pb-2 mb-2">Ingredients</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
            {recipe.ingredients.map((ingredient, i) => (
              <li key={i}>
                <span className="font-semibold">{ingredient.quantity}</span> {ingredient.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <h4 className="font-semibold text-gray-700 border-b pb-2 mb-2">Instructions</h4>
          <ol className="list-decimal list-inside space-y-2 text-gray-600 text-sm">
            {recipe.instructions.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
