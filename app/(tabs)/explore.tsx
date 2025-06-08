import { Platform, StyleSheet } from 'react-native';
import FridgesView, {Fridge, Ingredient} from '../../components/FridgesView';
import { SafeAreaView } from 'react-native-safe-area-context';
import {useState} from "react";


export default function TabTwoScreen() {

    const [fridges, setFridges] = useState<Fridge[]>([]);

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

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <FridgesView
                fridges={fridges}
                onCreate={handleCreateFridge}
                onAddIngredient={handleAddIngredient}
                onClear={handleClearFridge}
                onDelete={handleDeleteFridge}
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
