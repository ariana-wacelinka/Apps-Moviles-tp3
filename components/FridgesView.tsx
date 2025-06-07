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
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export interface Fridge {
    id: string;
    name: string;
    ingredients: Ingredient[];
}
interface Ingredient { id: string; name: string }

interface FridgesViewProps {
    fridges?: Fridge[];
    onCreate?: (name: string) => void;
}

export default function FridgesView({
                                        fridges = [],
                                        onCreate = () => {},
                                    }: FridgesViewProps) {
    const [showModal, setShowModal] = useState(false);
    const [newName, setNewName] = useState('');
    const { colors } = useTheme();
    const  [expandedFridgeId, setExpandedFridge] = useState<string | null>(null);

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

    return (
        <ThemedView style={styles.container}>
            <ThemedText style={styles.title}>Mis heladeras</ThemedText>

            {fridges.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <ThemedText style={styles.emptyText}>
                        No tenés heladeras creadas.
                    </ThemedText>
                    <TouchableOpacity
                        style={styles.createButton}
                        onPress={() => setShowModal(true)}
                    >
                        <ThemedText style={styles.createButtonText}>
                            Crear nueva heladera
                        </ThemedText>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.list}>
                    {fridges.map((fridge) => (
                        <View key={fridge.id} style={styles.itemContainer}>
                            <TouchableOpacity onPress={() => toggleFridge(fridge.id)}>
                                <ThemedText style={styles.itemText}>{fridge.name}</ThemedText>
                            </TouchableOpacity>

                            {expandedFridgeId === fridge.id && (
                                <View style={styles.expandedSection}>
                                    {fridge.ingredients.map((ing) => (
                                        <ThemedText key={ing.id} style={styles.ingredientText}>
                                            – {ing.name}
                                        </ThemedText>
                                    ))}

                                    <TouchableOpacity style={styles.button}>
                                        <ThemedText style={styles.buttonText}>Agregar ingrediente</ThemedText>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.button}>
                                        <ThemedText style={styles.buttonText}>Eliminar todos</ThemedText>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.buttonDelete}>
                                        <ThemedText style={styles.buttonText}>Eliminar heladera</ThemedText>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    ))}
                    {/* Botón flotante para crear */}
                    <TouchableOpacity
                        style={styles.floatingButton}
                        onPress={() => setShowModal(true)}
                    >
                        <ThemedText style={styles.floatingButtonText}>＋</ThemedText>
                    </TouchableOpacity>
                </View>
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
                                { backgroundColor: colors.card, shadowColor: colors.text },
                            ]}
                        >
                            <ThemedText style={styles.modalTitle}>
                                Nombre de la heladera
                            </ThemedText>
                            <TextInput
                                style={[
                                    styles.modalInput,
                                    { borderColor: colors.border, color: colors.text },
                                ]}
                                placeholder="Ej. Heladera de casa"
                                placeholderTextColor={colors.text + '99'}
                                value={newName}
                                onChangeText={setNewName}
                                returnKeyType="done"
                                onSubmitEditing={handleSave}
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalBtn}
                                    onPress={() => setShowModal(false)}
                                >
                                    <ThemedText>Cancelar</ThemedText>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.modalBtn,
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
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },

    // overlay fullscreen semitransparente
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },

    modalFlex: { flex: 1, justifyContent: 'center' },
    modalWrapper: {
        marginHorizontal: 24,
        borderRadius: 12,
        overflow: 'hidden',
    },
    modalCard: {
        padding: 16,
        borderRadius: 12,
        // sombra iOS/Android
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 6,
    },

    modalTitle: { fontSize: 18, marginBottom: 12 },
    modalInput: {
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 6,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
    },

    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    modalBtn: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginLeft: 8,
    },
    modalBtnDisabled: { opacity: 0.5 },
    modalSaveText: { fontWeight: '600' },
    // Cuando no hay heladeras
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    emptyText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
        color: '#888888',
    },
    createButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
    },
    createButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },

    // Listado de heladeras
    list: {
        flex: 1,
        paddingBottom: 16,
    },
    itemContainer: {
        padding: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#CCCCCC',
    },
    itemText: {
        fontSize: 16,
        color: '#333333',
    },

    // Botón flotante “＋”
    floatingButton: {
        position: 'absolute',
        right: 24,
        bottom: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,               // sombra Android
        shadowColor: '#000000',     // sombra iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    floatingButtonText: {
        fontSize: 32,
        lineHeight: 32,
        color: '#FFFFFF',
    },
    expandedSection: {
        marginTop: 8,
        paddingLeft: 10,
    },
    ingredientText: {
        fontSize: 16,
        marginVertical: 2,
    },
    button: {
        marginTop: 8,
        padding: 8,
        backgroundColor: '#4CAF50',
        borderRadius: 6,
    },
    buttonDelete: {
        marginTop: 8,
        padding: 8,
        backgroundColor: '#F44336',
        borderRadius: 6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
    },
});
