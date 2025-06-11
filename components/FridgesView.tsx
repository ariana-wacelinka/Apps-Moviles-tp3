import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Modal,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Platform,
    KeyboardAvoidingView,
    ScrollView, ActivityIndicator, FlatList,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {getAllIngredients, searchRecipesByName} from "@/services/theMealDbService";

export interface Fridge {
    id: string;
    name: string;
    ingredients: Ingredient[];
}

export interface Ingredient {
    id: string; 
    name: string;
}

interface FridgesViewProps {
    fridges?: Fridge[];
    onCreate?: (name: string) => void;
    onAddIngredient?: (fridgeId: string, ingredient: Ingredient) => void;
    onClearFridge?: (fridgeId: string) => void;
    onDelete?: (fridgeId: string) => void;
    onRemoveIngredient?: (fridgeId: string, ingredientId: string) => void;
}

export default function FridgesView({
    fridges = [],
    onCreate = () => {},
    onAddIngredient = () => {},
    onClearFridge = () => {},
    onDelete = () => {},
    onRemoveIngredient = () => {},
}: FridgesViewProps) {
    const [showModal, setShowModal] = useState(false);
    const [newName, setNewName] = useState('');
    const { colors } = useTheme();
    const [expandedFridgeId, setExpandedFridge] = useState<string | null>(null);
    const [searchModalVisible, setSearchModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Ingredient[]>([]);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [currentFridgeId, setCurrentFridgeId] = useState<string | null>(null);

    const toggleFridge = (fridgeId: string) => {
        setExpandedFridge(prev => prev === fridgeId ? null : fridgeId);
    };

    const handleSave = () => {
        if (newName.trim()) {
            onCreate(newName.trim());
            setNewName('');
            setShowModal(false);
        }
    };

    const openSearchModal = (fridgeId: string) => {
        setCurrentFridgeId(fridgeId);
        setSearchQuery('');
        setSearchResults([]);
        setSearchModalVisible(true);
    };

    /** Llama a tu API para buscar ingredientes */
    const searchIngredients = async () => {
        if (!searchQuery.trim()) return;
        setLoadingSearch(true);

        try {
            // 1) Obtiene todo el catálogo de ingredientes
            const all = await getAllIngredients();

            // 2) Filtra por la query (case-insensitive)
            const filtered = all.filter(item =>
                item.strIngredient
                    .toLowerCase()
                    .includes(searchQuery.trim().toLowerCase())
            );

            // 3) Mapea al tipo que usa tu UI
            const items: Ingredient[] = filtered.map(item => ({
                id: item.idIngredient,
                name: item.strIngredient,
            }));

            setSearchResults(items);
        } catch (error) {
            console.error('Error al filtrar ingredientes:', error);
            setSearchResults([]);
        } finally {
            setLoadingSearch(false);
        }
    };


    /** Cuando el usuario elige un ingrediente de la lista */
    const handleSelectIngredient = (ingredient: Ingredient) => {
        if (currentFridgeId && onAddIngredient) {
            onAddIngredient(currentFridgeId, ingredient);
        }
        setSearchModalVisible(false);
    };

    const handleClearFridge = (fridgeId: string) => {
        if (onClearFridge) {
            onClearFridge(fridgeId);
        }
    }

    const handleDeleteFridge = (fridgeId: string) => {
        if (onDelete) {
            onDelete(fridgeId);
        }
        setExpandedFridge(null); // Cierra la sección si estaba abierta
        setSearchModalVisible(false); // Cierra el modal de búsqueda si estaba abierto
    }

    const handleRemoveIngredient = (fridgeId: string, ingredientId: string) => {
        if (onRemoveIngredient) {
            onRemoveIngredient(fridgeId, ingredientId);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <View style={styles.titleContainer}>
                <MaterialCommunityIcons 
                    name="fridge" 
                    size={28} 
                    color={colors.primary}
                    style={styles.titleIcon}
                />
                <ThemedText style={styles.title}>Mis Heladeras</ThemedText>
            </View>

            {fridges.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <MaterialCommunityIcons 
                        name="fridge-off" 
                        size={80} 
                        color={colors.text + '40'}
                        style={styles.emptyIcon}
                    />
                    <ThemedText style={[styles.emptyText, { color: colors.text + 'AA' }]}>
                        No tenés heladeras creadas
                    </ThemedText>
                    <ThemedText style={[styles.emptySubtext, { color: colors.text + '80' }]}>
                        Creá tu primera heladera para empezar a organizarte
                    </ThemedText>
                    <TouchableOpacity
                        style={[styles.createButton, { backgroundColor: colors.primary }]}
                        onPress={() => setShowModal(true)}
                    >
                        <MaterialIcons name="add" size={20} color="#FFFFFF" />
                        <ThemedText style={styles.createButtonText}>
                            Crear Nueva Heladera
                        </ThemedText>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
                    {fridges.map((fridge) => (
                        <ThemedView 
                            key={fridge.id} 
                            style={[
                                styles.fridgeCard,
                                { 
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                }
                            ]}
                        >
                            <TouchableOpacity 
                                onPress={() => toggleFridge(fridge.id)}
                                style={styles.fridgeHeader}
                                activeOpacity={0.7}
                            >
                                <View style={styles.fridgeInfo}>
                                    <View style={[styles.fridgeIconContainer, { backgroundColor: colors.primary }]}>
                                        <MaterialCommunityIcons 
                                            name="fridge" 
                                            size={24} 
                                            color="#fff"
                                        />
                                    </View>
                                    <View style={styles.fridgeDetails}>
                                        <ThemedText style={styles.fridgeName}>
                                            {fridge.name}
                                        </ThemedText>
                                        <ThemedText style={[styles.fridgeCount, { color: colors.text + '80' }]}>
                                            {fridge.ingredients.length} ingredientes
                                        </ThemedText>
                                    </View>
                                </View>
                                <MaterialIcons 
                                    name={expandedFridgeId === fridge.id ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                                    size={24} 
                                    color={colors.text + '60'}
                                />
                            </TouchableOpacity>

                            {expandedFridgeId === fridge.id && (
                                <View style={[styles.fridgeContent, { borderTopColor: colors.border }]}>
                                    {fridge.ingredients.length === 0 ? (
                                        <View style={styles.noIngredientsContainer}>
                                            <MaterialCommunityIcons 
                                                name="food-off" 
                                                size={24} 
                                                color={colors.text + '60'}
                                            />
                                            <ThemedText style={[styles.noIngredientsText, { color: colors.text + '80' }]}>
                                                No hay ingredientes
                                            </ThemedText>
                                        </View>
                                    ) : (
                                        fridge.ingredients.map((ing) => (
                                            <View key={ing.id} style={styles.ingredientRow}>
                                                <MaterialIcons
                                                    name="fiber-manual-record"
                                                    size={6}
                                                    color={colors.primary}
                                                    style={styles.bulletIcon}
                                                />
                                                <ThemedText style={[styles.ingredientText, { color: colors.text }]}>
                                                    {ing.name}
                                                </ThemedText>

                                                {/* Botón para eliminar solo este ingrediente */}
                                                <TouchableOpacity
                                                    style={styles.removeIngredientButton}
                                                    onPress={() => handleRemoveIngredient?.(fridge.id, ing.id)}
                                                >
                                                    <MaterialIcons name="delete" size={18} color="#F44336" />
                                                </TouchableOpacity>
                                            </View>
                                        ))
                                    )}

                                    <View style={styles.actionsContainer}>
                                        <TouchableOpacity
                                           style={[styles.actionButton, { backgroundColor: colors.primary + '15' }]}
                                           onPress={() => openSearchModal(fridge.id)}
                                         >
                                            <MaterialIcons name="add" size={16} color={colors.text} />
                                            <ThemedText style={[styles.actionButtonText, { color: colors.text }]}>
                                                Agregar Ingrediente
                                            </ThemedText>
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#FF9800' + '15' }]}
                                                          onPress={() => handleClearFridge(fridge.id)}>
                                            <MaterialIcons name="clear-all" size={16} color="#FF9800" />
                                            <ThemedText style={[styles.actionButtonText, { color: '#FF9800' }]}>
                                                Vaciar
                                            </ThemedText>
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#F44336' + '15' }]}
                                                          onPress={() => handleDeleteFridge(fridge.id)}>
                                            <MaterialIcons name="delete" size={16} color="#F44336" />
                                            <ThemedText style={[styles.actionButtonText, { color: '#F44336' }]}>
                                                Eliminar
                                            </ThemedText>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </ThemedView>
                    ))}
                </ScrollView>
            )}

            {fridges.length > 0 && (
                <TouchableOpacity
                    style={[styles.floatingButton, { backgroundColor: colors.primary }]}
                    onPress={() => setShowModal(true)}
                >
                    <MaterialIcons name="add" size={28} color="#FFFFFF" />
                </TouchableOpacity>
            )}

            <Modal
                visible={showModal}
                animationType="fade"
                transparent
                onRequestClose={() => setShowModal(false)}
            >
                <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>

                <KeyboardAvoidingView
                    style={styles.modalFlex}
                    behavior={Platform.select({ ios: 'padding' })}
                >
                    <View style={styles.modalWrapper}>
                        <ThemedView
                            style={[
                                styles.modalCard,
                                { 
                                    backgroundColor: colors.card, 
                                    shadowColor: colors.text,
                                    borderColor: colors.border,
                                },
                            ]}
                        >
                            <View style={styles.modalHeader}>
                                <MaterialCommunityIcons 
                                    name="plus" 
                                    size={24} 
                                    color={colors.primary}
                                />
                                <ThemedText style={[styles.modalTitle, { color: colors.text }]}>
                                    Nueva Heladera
                                </ThemedText>
                            </View>
                            
                            <TextInput
                                style={[
                                    styles.modalInput,
                                    { 
                                        borderColor: colors.border, 
                                        color: colors.text,
                                        backgroundColor: colors.background,
                                    },
                                ]}
                                placeholder="Ej. Heladera de casa"
                                placeholderTextColor={colors.text + '60'}
                                value={newName}
                                onChangeText={setNewName}
                                returnKeyType="done"
                                onSubmitEditing={handleSave}
                                autoFocus
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={[styles.modalBtn, { backgroundColor: colors.text + '10' }]}
                                    onPress={() => setShowModal(false)}
                                >
                                    <ThemedText style={{ color: colors.text }}>Cancelar</ThemedText>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.modalBtn,
                                        { backgroundColor: colors.primary },
                                        !newName.trim() && styles.modalBtnDisabled,
                                    ]}
                                    onPress={handleSave}
                                    disabled={!newName.trim()}
                                >
                                    <ThemedText style={styles.modalSaveText}>Guardar</ThemedText>
                                </TouchableOpacity>
                            </View>
                        </ThemedView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
            <Modal
                visible={searchModalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setSearchModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setSearchModalVisible(false)}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>
                <KeyboardAvoidingView
                    style={styles.modalFlex}
                    behavior={Platform.select({ ios: 'padding' })}
                >
                    <View style={styles.modalWrapper}>
                        <ThemedView style={[styles.modalCard, {
                            backgroundColor: colors.card,
                            shadowColor: colors.text,
                            borderColor: colors.border,
                        }]}>
                            <View style={styles.modalHeader}>
                                <MaterialCommunityIcons name="food" size={24} color={colors.primary} />
                                <ThemedText style={[styles.modalTitle, { color: colors.text }]}>
                                    Buscar Ingrediente
                                </ThemedText>
                            </View>

                            <TextInput
                                style={[styles.modalInput, {
                                    borderColor: colors.border,
                                    color: colors.text,
                                    backgroundColor: colors.background,
                                }]}
                                placeholder="Ej. Tomate"
                                placeholderTextColor={colors.text + '60'}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                returnKeyType="search"
                                onSubmitEditing={searchIngredients}
                            />

                            {loadingSearch ? (
                                <ActivityIndicator style={{ marginVertical: 20 }} />
                            ) : (
                                <FlatList
                                    data={searchResults}
                                    keyExtractor={item => item.id}
                                    style={{ maxHeight: 200 }}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={styles.searchItem}
                                            onPress={() => handleSelectIngredient(item)}
                                        >
                                            <ThemedText style={[styles.ingredientText, { color: colors.text }]}>
                                                {item.name}
                                            </ThemedText>
                                        </TouchableOpacity>
                                    )}
                                    ListEmptyComponent={() =>
                                        searchQuery ? (
                                            <ThemedText style={[styles.emptySubtext, { color: colors.text + '80' }]}>
                                                No se encontraron resultados
                                            </ThemedText>
                                        ) : null
                                    }
                                />
                            )}

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={[styles.modalBtn, { backgroundColor: colors.text + '10' }]}
                                    onPress={() => setSearchModalVisible(false)}
                                >
                                    <ThemedText style={{ color: colors.text }}>Cancelar</ThemedText>
                                </TouchableOpacity>
                            </View>
                        </ThemedView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 16,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    titleIcon: {
        marginRight: 12,
    },
    title: { 
        fontSize: 28, 
        fontWeight: 'bold',
    },

    // Estado vacío
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    emptyIcon: {
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: 14,
        marginBottom: 32,
        textAlign: 'center',
        lineHeight: 20,
    },
    createButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    createButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },

    // Lista de heladeras
    list: {
        flex: 1,
    },
    itemContainer: {
        marginBottom: 12,
        borderRadius: 12,
        borderWidth: 1,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    fridgeCard: {
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 1,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    fridgeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
    },
    fridgeInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    fridgeIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    fridgeDetails: {
        flex: 1,
    },
    fridgeName: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 2,
    },
    fridgeCount: {
        fontSize: 14,
        fontWeight: '400',
    },
    fridgeContent: {
        borderTopWidth: 1,
        padding: 20,
        paddingTop: 16,
    },
    
    // Sección expandida
    expandedSection: {
        paddingTop: 16,
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderTopWidth: 1,
    },
    noIngredientsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 8,
    },
    noIngredientsText: {
        fontSize: 14,
        fontStyle: 'italic',
    },
    ingredientRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        paddingLeft: 8,
    },
    bulletIcon: {
        marginRight: 12,
    },
    ingredientText: {
        fontSize: 15,
        flex: 1,
    },

    // Acciones
    actionsContainer: {
        marginTop: 16,
        gap: 8,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        gap: 6,
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '500',
    },

    // Botón flotante
    floatingButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },

    // Modal
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalFlex: { 
        flex: 1, 
        justifyContent: 'center',
    },
    modalWrapper: {
        marginHorizontal: 24,
        borderRadius: 16,
        overflow: 'hidden',
    },
    modalCard: {
        padding: 24,
        borderRadius: 16,
        borderWidth: 1,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 8,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 12,
    },
    modalTitle: { 
        fontSize: 20, 
        fontWeight: '600',
    },
    modalInput: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 14,
        fontSize: 16,
        marginBottom: 24,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    modalBtn: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        minWidth: 80,
        alignItems: 'center',
    },
    modalBtnDisabled: { 
        opacity: 0.5,
    },
    modalSaveText: { 
        fontWeight: '600', 
        color: '#FFFFFF',
    },
    searchItem: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderColor: '#DDD',
    },
    removeIngredientButton: {
        marginLeft: 12,
        padding: 4,
    },
});