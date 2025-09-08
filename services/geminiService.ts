import { GoogleGenAI, Type } from "@google/genai";
import { type Recipe } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const recipeSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      recipeName: {
        type: Type.STRING,
        description: "The creative and appealing name of the recipe.",
      },
      description: {
        type: Type.STRING,
        description: "A short, one-sentence, enticing description of the dish."
      },
      ingredients: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: {
              type: Type.STRING,
              description: "The name of the ingredient (e.g., 'all-purpose flour', 'chicken breast')."
            },
            quantity: {
              type: Type.STRING,
              description: "The measurement for the ingredient (e.g., '1 cup', '2 tbsp', '500g')."
            }
          },
          required: ["name", "quantity"],
        },
        description: "A list of all ingredients required for the recipe, including their name and quantity.",
      },
      instructions: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
        },
        description: "Detailed, step-by-step instructions to prepare the dish, including cooking times, temperatures, and specific techniques where applicable.",
      },
    },
    required: ["recipeName", "description", "ingredients", "instructions"],
  },
};

export const generateRecipes = async (ingredients: string): Promise<Recipe[]> => {
  const prompt = `
    You are a creative chef. Based on the following ingredients, generate 3 diverse and delicious recipes. 
    The ingredients I have are: ${ingredients}.
    Feel free to include common pantry staples (like salt, pepper, oil, flour, sugar, spices) if needed, but prioritize the provided ingredients.
    For each recipe, provide a creative name, a short description, a list of all required ingredients with their specific quantities (as an array of objects, where each object has a "name" and a "quantity" property), and clear, detailed step-by-step instructions. Include specific cooking times and temperatures where appropriate. Each step should be a distinct action.
    Ensure the output is a valid JSON array.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
      },
    });

    const jsonText = response.text.trim();
    let recipes: Recipe[] = JSON.parse(jsonText);

    // Generate images for each recipe in parallel
    const imagePromises = recipes.map(async (recipe) => {
      try {
        const imageResponse = await ai.models.generateImages({
          model: 'imagen-4.0-generate-001',
          prompt: `A delicious, professional food photograph of "${recipe.recipeName}", realistic, high-quality.`,
          config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '4:3',
          },
        });
        
        const base64ImageBytes: string | undefined = imageResponse.generatedImages?.[0]?.image.imageBytes;
        if (base64ImageBytes) {
          return `data:image/jpeg;base64,${base64ImageBytes}`;
        }
      } catch (imageError) {
        console.error(`Failed to generate image for ${recipe.recipeName}:`, imageError);
      }
      return undefined;
    });

    const imageUrls = await Promise.all(imagePromises);

    // Combine recipes with their images
    recipes = recipes.map((recipe, index) => ({
      ...recipe,
      imageUrl: imageUrls[index],
    }));

    return recipes;

  } catch (error) {
    console.error("Error generating recipes:", error);
    throw new Error("Failed to generate recipes. The AI chef might be busy. Please try again later.");
  }
};