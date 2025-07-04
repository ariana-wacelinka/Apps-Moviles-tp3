import { CategoriesResponse } from '../types/categories';
import { Meal, MealPreviewsResponse, MealsResponse } from '../types/recipes';

const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1/';

export interface RawIngredient {
    idIngredient: string;
    strIngredient: string;
    strDescription: string | null;
    strType: string | null;
}

export interface IngredientListResponse {
    meals: RawIngredient[] | null;
}

export const searchRecipesByName = async (query: string): Promise<MealsResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}search.php?s=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }
        const data: MealsResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Error al buscar recetas por nombre:', error);
        return { meals: null };
    }
};

export const getAllCategories = async (): Promise<CategoriesResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}categories.php`);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }
        const data: CategoriesResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
        return { categories: [] };
    }
};

export const getAllIngredients = async (): Promise<RawIngredient[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}list.php?i=list`);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }
        const data: IngredientListResponse = await response.json();
        return data.meals ?? [];
    } catch (error) {
        console.error('Error al obtener todos los ingredientes:', error);
        return [];
    }
};

export const getRecipeDetailsById = async (id: string): Promise<Meal | null> => {
    try {
        const response = await fetch(`${API_BASE_URL}lookup.php?i=${id}`);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }
        const data: MealsResponse = await response.json();
        return data.meals && data.meals.length > 0 ? data.meals[0] : null;
    } catch (error) {
        console.error(`Error al obtener detalles de la receta con ID ${id}:`, error);
        return null;
    }
};

export const getRecipesByCategory = async (category: string): Promise<MealPreviewsResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}filter.php?c=${encodeURIComponent(category)}`);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }
        const data: MealPreviewsResponse = await response.json();
        return data;
    } catch (error) {
        console.error(`Error al obtener recetas por categoría ${category}:`, error);
        return { meals: null };
    }
}