import React from 'react';
import { StyleSheet, View } from 'react-native';
import {ThemedText} from "@/components/ThemedText";

export interface Fridge{
    id: string;
    name: string;
    ingredients: Ingredient[];
}
interface Ingredient {
    id: string;
    name: string;
}

interface FridgesViewProps {
    fridges?: Fridge[];
}

export default function FridgesView({ fridges = [] }: FridgesViewProps) {
    const renderItem = ({ item }: { item: Fridge }) => {
        <View style={styles.container}>
            <ThemedText style={styles.itemText}>{item.name}</ThemedText>
        </View>
    }
    return(
        <View style={styles.container}>
            <ThemedText style={styles.title}>Mis heladeras</ThemedText>
            {fridges.length === 0 ? (
                <ThemedText style={styles.empty}>No tenés heladeras creadas.</ThemedText>
            ) : (
                <View style={styles.list}>
                    {fridges.map((fridge) => (
                        <View key={fridge.id} style={styles.itemContainer}>
                            <ThemedText style={styles.itemText}>{fridge.name}</ThemedText>
                            {fridge.ingredients.map((ingredient) => (
                                <ThemedText key={ingredient.id} style={styles.itemText}>
                                    - {ingredient.name}
                                </ThemedText>
                            ))}
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff', // o usando tema
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    list: {
        paddingBottom: 16,
    },
    itemContainer: {
        padding: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc',
    },
    itemText: {
        fontSize: 16,
    },
    empty: {
        textAlign: 'center',
        marginTop: 20,
        color: '#666',
    },
});