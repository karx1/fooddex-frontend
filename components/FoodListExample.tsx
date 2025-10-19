/**
 * Example component demonstrating how to use the API hooks
 * This shows a simple food list with create, update, and delete functionality
 */

import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useCreateFood, useDeleteFood, useFoods, useUpdateFood } from '../hooks/useApi';

export function FoodListExample() {
    const [newFoodName, setNewFoodName] = useState('');
    const [newFoodOrigin, setNewFoodOrigin] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);

    // Query: Fetch all foods
    const { data: foodsData, isLoading, error } = useFoods();

    // Mutation: Create new food
    const createFood = useCreateFood({
        onSuccess: () => {
            setNewFoodName('');
            setNewFoodOrigin('');
            console.log('Food created successfully!');
        },
        onError: (error) => {
            console.error('Failed to create food:', error.message);
        },
    });

    // Mutation: Update food
    const updateFood = useUpdateFood({
        onSuccess: () => {
            setEditingId(null);
            console.log('Food updated successfully!');
        },
    });

    // Mutation: Delete food
    const deleteFood = useDeleteFood({
        onSuccess: () => {
            console.log('Food deleted successfully!');
        },
    });

    const handleCreateFood = () => {
        if (!newFoodName || !newFoodOrigin) return;

        createFood.mutate({
            foodname: newFoodName,
            origin: newFoodOrigin,
            rarity: 3,
            description: `Delicious ${newFoodName} from ${newFoodOrigin}`,
        });
    };

    const handleUpdateFood = (id: string, newName: string) => {
        updateFood.mutate({
            id,
            data: { foodname: newName },
        });
    };

    const handleDeleteFood = (id: string) => {
        deleteFood.mutate(id);
    };

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Loading foods...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Error: {error.message}</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Food List Example</Text>

            {/* Create Food Form */}
            <View style={styles.form}>
                <Text style={styles.formTitle}>Add New Food</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Food name"
                    value={newFoodName}
                    onChangeText={setNewFoodName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Origin"
                    value={newFoodOrigin}
                    onChangeText={setNewFoodOrigin}
                />
                <TouchableOpacity
                    style={[styles.button, (createFood.isPending || !newFoodName || !newFoodOrigin) && styles.buttonDisabled]}
                    onPress={handleCreateFood}
                    disabled={createFood.isPending || !newFoodName || !newFoodOrigin}
                >
                    <Text style={styles.buttonText}>
                        {createFood.isPending ? 'Creating...' : 'Create Food'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Food List */}
            <View style={styles.foodList}>
                {foodsData?.result.foods.map((food) => (
                    <View key={food.id} style={styles.foodItem}>
                        <View style={styles.foodInfo}>
                            {editingId === food.id ? (
                                <TextInput
                                    style={styles.input}
                                    defaultValue={food.foodname}
                                    onSubmitEditing={(e) => {
                                        handleUpdateFood(food.id, e.nativeEvent.text);
                                    }}
                                    autoFocus
                                />
                            ) : (
                                <>
                                    <Text style={styles.foodName}>{food.foodname}</Text>
                                    <Text style={styles.foodDetails}>
                                        Origin: {food.origin} | Rarity: {food.rarity}
                                    </Text>
                                    {food.description && (
                                        <Text style={styles.foodDescription}>{food.description}</Text>
                                    )}
                                </>
                            )}
                        </View>

                        <View style={styles.actions}>
                            {editingId === food.id ? (
                                <TouchableOpacity
                                    style={[styles.button, styles.buttonSmall]}
                                    onPress={() => setEditingId(null)}
                                >
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                            ) : (
                                <>
                                    <TouchableOpacity
                                        style={[styles.button, styles.buttonSmall]}
                                        onPress={() => setEditingId(food.id)}
                                        disabled={updateFood.isPending}
                                    >
                                        <Text style={styles.buttonText}>Edit</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.button, styles.buttonSmall, styles.buttonDanger]}
                                        onPress={() => handleDeleteFood(food.id)}
                                        disabled={deleteFood.isPending}
                                    >
                                        <Text style={styles.buttonText}>Delete</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View>
                ))}
            </View>

            {foodsData?.result.foods.length === 0 && (
                <Text style={styles.emptyText}>No foods yet. Create one above!</Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    loadingText: {
        marginTop: 8,
    },
    errorText: {
        color: 'red',
    },
    form: {
        backgroundColor: '#f5f5f5',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    formTitle: {
        fontWeight: 'bold',
        marginBottom: 8,
    },
    input: {
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 8,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 4,
        alignItems: 'center',
    },
    buttonSmall: {
        padding: 8,
        marginHorizontal: 4,
    },
    buttonDanger: {
        backgroundColor: '#FF3B30',
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    foodList: {
        gap: 8,
    },
    foodItem: {
        backgroundColor: '#f5f5f5',
        padding: 12,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    foodInfo: {
        flex: 1,
    },
    foodName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    foodDetails: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    foodDescription: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    actions: {
        flexDirection: 'row',
    },
    emptyText: {
        textAlign: 'center',
        color: '#888',
        marginTop: 16,
    },
});
