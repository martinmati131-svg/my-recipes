
export interface Ingredient {
  name: string;
  quantity: string;
}

export interface Recipe {
  recipeName: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  tipsAndVariations?: string[];
  imageUrl?: string;
  savedAt?: number;
}