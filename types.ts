
export interface Ingredient {
  name: string;
  quantity: string;
}

export interface Recipe {
  recipeName: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  imageUrl?: string;
  savedAt?: number;
}
