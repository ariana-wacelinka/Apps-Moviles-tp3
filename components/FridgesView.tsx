import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Modal,
    TextInput,
    TouchableOpacity,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';

export interface Fridge {
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
    onCreate?: (name: string) => void;  // callback para cuando se crea
}

export default function FridgesView({
                                        fridges = [],
                                        onCreate = () => {},
                                    }: FridgesViewProps) {
    const [showModal, setShowModal] = useState(false);
    const [newName, setNewName] = useState('');

    const handleSave = () => {
        if (newName.trim()) {
            onCreate(newName.trim());
            setNewName('');
            setShowModal(false);
        }
    };

    return (
        <View style={styles.container}>
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
                            <ThemedText style={styles.itemText}>{fridge.name}</ThemedText>
                            {fridge.ingredients.map((ing) => (
                                <ThemedText key={ing.id} style={styles.itemText}>
                                    – {ing.name}
                                </ThemedText>
                            ))}
                        </View>
                    ))}
                    {/* botón extra incluso si hay heladeras */}
                    <TouchableOpacity
                        style={styles.floatingButton}
                        onPress={() => setShowModal(true)}
                    >
                        <ThemedText style={styles.floatingButtonText}>＋</ThemedText>
                    </TouchableOpacity>
                </View>
            )}

            {/* Modal para crear */}
            <Modal
                visible={showModal}
                animationType="slide"
                transparent
                onRequestClose={() => setShowModal(false)}
            >
                <KeyboardAvoidingView
                    style={styles.modalFlex}
                    behavior={Platform.select({ ios: 'padding', android: undefined })}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalCard}>
                            <ThemedText style={styles.modalTitle}>
                                Nombre de la heladera
                            </ThemedText>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="Ej. Heladera de casa"
                                value={newName}
                                onChangeText={setNewName}
                                returnKeyType="done"
                                onSubmitEditing={handleSave}
                            />
                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={[styles.modalBtn, styles.modalCancel]}
                                    onPress={() => {
                                        setNewName('');
                                        setShowModal(false);
                                    }}
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
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
    createButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#007AFF',
    },
    createButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
    list: { flex: 1 },
    itemContainer: {
        padding: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc',
    },
    itemText: { fontSize: 16 },

    // botón flotante en lista
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
        elevation: 4,
    },
    floatingButtonText: {
        fontSize: 32,
        lineHeight: 32,
        color: '#fff',
    },

    // modal
    modalFlex: { flex: 1 },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        padding: 24,
    },
    modalCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
    },
    modalTitle: { fontSize: 18, marginBottom: 12 },
    modalInput: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
    },
    modalButtons: { flexDirection: 'row', justifyContent: 'flex-end' },
    modalBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 6 },
    modalCancel: { marginRight: 8 },
    modalBtnDisabled: { opacity: 0.5 },
    modalSaveText: { color: '#007AFF', fontWeight: '600' },
});
