
import React from 'react';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface IngredientInputProps {
  ingredients: string;
  setIngredients: (value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const IngredientInput: React.FC<IngredientInputProps> = ({ ingredients, setIngredients, onGenerate, isLoading }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-2">
        Enter your ingredients (e.g., chicken breast, broccoli, rice, soy sauce)
      </label>
      <textarea
        id="ingredients"
        rows={4}
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-150 ease-in-out placeholder-gray-400"
        placeholder="What do you have on hand?"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        disabled={isLoading}
      />
      <button
        onClick={onGenerate}
        disabled={isLoading || !ingredients.trim()}
        className="mt-4 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <>
            <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
            Generating...
          </>
        ) : (
          'Generate Recipes'
        )}
      </button>
    </div>
  );
};

export default IngredientInput;
