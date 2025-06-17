import { StyleSheet } from 'react-native';
import FridgesView, {Fridge, Ingredient} from '../../components/FridgesView';
import { SafeAreaView } from 'react-native-safe-area-context';
import {useEffect, useState} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function TabTwoScreen() {

    const [fridges, setFridges] = useState<Fridge[]>([]);

    useEffect(() => {
        (async () => {
            try {
                const json = await AsyncStorage.getItem('@my_fridges');
                if (json) {
                    setFridges(JSON.parse(json));
                }
            } catch (e) {
                console.error('Error cargando heladeras:', e);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                await AsyncStorage.setItem('@my_fridges', JSON.stringify(fridges));
            } catch (e) {
                console.error('Error guardando heladeras:', e);
            }
        })();
    }, [fridges]);

    const handleCreateFridge = (name: string) => {
        const newFridge: Fridge = {
            id: ((fridges?.length ?? 0) +1).toString(), // Simple ID generation
            name,
            ingredients: [],
        };
        setFridges(current => [newFridge, ...current || []]);
    }
    const handleAddIngredient = (fridgeId: string, ingredient: Ingredient) => {
        setFridges(current =>
            current?.map(f =>
                f.id === fridgeId
                    ? { ...f, ingredients: [...f.ingredients, ingredient] }
                    : f
            )
        );
    };

    const handleClearFridge = (fridgeId: string) => {
        setFridges(current =>
            current?.map(f =>
                f.id === fridgeId
                    ? { ...f, ingredients: [] }
                    : f
            )
        );
    };

    const handleDeleteFridge = (fridgeId: string) => {
        setFridges(current => current?.filter(f => f.id !== fridgeId));
    };

    const handleRemoveIngredient = (fridgeId: string, ingredientId: string) => {
        setFridges(current =>
            current.map(f =>
                f.id === fridgeId
                    ? {
                        ...f,
                        ingredients: f.ingredients.filter(i => i.id !== ingredientId)
                    }
                    : f
            )
        );
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <FridgesView
                fridges={fridges}
                onCreate={handleCreateFridge}
                onAddIngredient={handleAddIngredient}
                onClearFridge={handleClearFridge}
                onDelete={handleDeleteFridge}
                onRemoveIngredient={handleRemoveIngredient}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
    safeArea: {
        flex: 1,
        backgroundColor: 'transparent',
    },
});
