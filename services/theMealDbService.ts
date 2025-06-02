import { CategoriesResponse } from '../types/categories';
import { Meal, MealsResponse } from '../types/recipes';

const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1/';

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

export const getRecipesByCategory = async (category: string): Promise<MealsResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}filter.php?c=${encodeURIComponent(category)}`);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }
        const data: MealsResponse = await response.json();
        return data;
    } catch (error) {
        console.error(`Error al obtener recetas por categoría ${category}:`, error);
        return { meals: null };
    }
}