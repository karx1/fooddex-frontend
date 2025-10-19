import { useMutation, useQuery, useQueryClient, type UseMutationOptions, type UseQueryOptions } from '@tanstack/react-query';
import { Use } from 'react-native-svg';

// ============================================================================
// Global Variables
// ============================================================================

// In a real application, you would get the current user's ID from an
// authentication context or state management solution.
export const CURRENT_USER_ID = 'user_2a7x1y9w0z8v3q5p'

// ============================================================================
// Types
// ============================================================================

export interface Food {
    id: string;
    rarity: number;
    origin: string;
    foodname: string;
    description: string;
}

export interface FoodCreate {
    rarity: number;
    origin: string;
    foodname: string;
    description: string;
}

export interface FoodUpdate {
    rarity?: number;
    origin?: string;
    foodname?: string;
    description?: string;
}

export interface User {
    id: string;
    username: string;
}

export interface UserCreate {
    username: string;
}

export interface UserUpdate {
    username?: string;
}

export interface Capture {
    id: string;
    food: string;
    date: string;
    user: string;
    image_url: string;
}

export interface CaptureCreate {
    food: string;
    date: string;
    user: string;
    image_url: string;
}

export interface CaptureUpdate {
    food?: string;
    date?: string;
    user?: string;
    image_url?: string;
}

export interface Favorite {
    user: string;
    food: string;
}

export interface Constellation {
    id: string;
    user: string;
}

export interface ConstellationCreate {
    user: string;
}

export interface ConstellationUpdate {
    user?: string;
}

export interface ConstellationItem {
    food: string;
    constellation: string;
}

export interface ApiResponse<T> {
    success: boolean;
    result: T;
}

export type ImageApiResponse<T> = ApiResponse<T> & {
    image_id: string;
}

export interface ApiErrorResponse {
    success: boolean;
    error: string;
}

export interface FoodRecognitionRequest {
    mimetype: string;
    image: string;
}

export type FoodRecognitionData = {
    box_2d: number[];
    label: string;
    relabel: number;
    rel_id: number;
}[];

// ============================================================================
// Configuration
// ============================================================================

// const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8787';
const API_BASE_URL = "https://backend.brandonwees.workers.dev"
// const API_BASE_URL = "http://localhost:8787"

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        ...options,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(error.error || `HTTP error ${response.status}`);
    }

    return response.json();
}

// ============================================================================
// Foods Hooks
// ============================================================================

export function useFoods(options?: UseQueryOptions<ApiResponse<{ foods: Food[] }>, Error>) {
    return useQuery({
        queryKey: ['foods'],
        queryFn: () => fetchApi<ApiResponse<{ foods: Food[] }>>('/api/foods'),
        ...options,
    });
}

export function useFood(id: string, options?: UseQueryOptions<ApiResponse<{ food: Food }>, Error>) {
    return useQuery({
        queryKey: ['foods', id],
        queryFn: () => fetchApi<ApiResponse<{ food: Food }>>(`/api/foods/${id}`),
        enabled: !!id,
        ...options,
    });
}

export function useFoodByName(foodname: string, options?: UseQueryOptions<ApiResponse<{ food: Food }>, Error>) {
    return useQuery({
        queryKey: ['foods', 'name', foodname],
        queryFn: () => fetchApi<ApiResponse<{ food: Food }>>(`/api/foods/foodByName/${encodeURIComponent(foodname)}`),
        enabled: !!foodname,
        ...options,
    });
}

export function useCreateFood(
    options?: UseMutationOptions<ApiResponse<{ food: Food }>, Error, FoodCreate>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: FoodCreate) =>
            fetchApi<ApiResponse<{ food: Food }>>('/api/foods', {
                method: 'POST',
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['foods'] });
        },
        ...options,
    });
}

export function useUpdateFood(
    options?: UseMutationOptions<ApiResponse<{ food: Food }>, Error, { id: string; data: FoodUpdate }>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: FoodUpdate }) =>
            fetchApi<ApiResponse<{ food: Food }>>(`/api/foods/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['foods'] });
            queryClient.invalidateQueries({ queryKey: ['foods', variables.id] });
        },
        ...options,
    });
}

export function useDeleteFood(
    options?: UseMutationOptions<ApiResponse<Record<string, never>>, Error, string>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) =>
            fetchApi<ApiResponse<Record<string, never>>>(`/api/foods/${id}`, {
                method: 'DELETE',
            }),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['foods'] });
            queryClient.invalidateQueries({ queryKey: ['foods', id] });
        },
        ...options,
    });
}

// ============================================================================
// Captures Hooks
// ============================================================================

export function useCaptures(options?: UseQueryOptions<ApiResponse<{ captures: Capture[] }>, Error>) {
    return useQuery({
        queryKey: ['captures'],
        queryFn: () => fetchApi<ApiResponse<{ captures: Capture[] }>>('/api/captures'),
        ...options,
    });
}

export function useCapture(id: string, options?: UseQueryOptions<ApiResponse<{ capture: Capture }>, Error>) {
    return useQuery({
        queryKey: ['captures', id],
        queryFn: () => fetchApi<ApiResponse<{ capture: Capture }>>(`/api/captures/${id}`),
        enabled: !!id,
        ...options,
    });
}

export function useCreateCapture(
    options?: UseMutationOptions<ApiResponse<{ capture: Capture }>, Error, CaptureCreate>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CaptureCreate) =>
            fetchApi<ApiResponse<{ capture: Capture }>>('/api/captures', {
                method: 'POST',
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['captures'] });
        },
        ...options,
    });
}

export function useUpdateCapture(
    options?: UseMutationOptions<ApiResponse<{ capture: Capture }>, Error, { id: string; data: CaptureUpdate }>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: CaptureUpdate }) =>
            fetchApi<ApiResponse<{ capture: Capture }>>(`/api/captures/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['captures'] });
            queryClient.invalidateQueries({ queryKey: ['captures', variables.id] });
        },
        ...options,
    });
}

export function useDeleteCapture(
    options?: UseMutationOptions<ApiResponse<Record<string, never>>, Error, string>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) =>
            fetchApi<ApiResponse<Record<string, never>>>(`/api/captures/${id}`, {
                method: 'DELETE',
            }),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['captures'] });
            queryClient.invalidateQueries({ queryKey: ['captures', id] });
        },
        ...options,
    });
}

export function useFoodTotalCaptures(
    id: string | undefined,
    options?: Omit<UseQueryOptions<ApiResponse<{ captures: number }>, Error>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: ['foods', id, 'captures'],
        queryFn: () => fetchApi<ApiResponse<{ captures: number }>>(`/api/foods/${id}/captures`),
        ...options,
    });
}

// ============================================================================
// Users Hooks
// ============================================================================

export function useUsers(options?: UseQueryOptions<ApiResponse<{ users: User[] }>, Error>) {
    return useQuery({
        queryKey: ['users'],
        queryFn: () => fetchApi<ApiResponse<{ users: User[] }>>('/api/users'),
        ...options,
    });
}

export function useUser(id: string, options?: UseQueryOptions<ApiResponse<{ user: User }>, Error>) {
    return useQuery({
        queryKey: ['users', id],
        queryFn: () => fetchApi<ApiResponse<{ user: User }>>(`/api/users/${id}`),
        enabled: !!id,
        ...options,
    });
}

export function useCreateUser(
    options?: UseMutationOptions<ApiResponse<{ user: User }>, Error, UserCreate>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UserCreate) =>
            fetchApi<ApiResponse<{ user: User }>>('/api/users', {
                method: 'POST',
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        ...options,
    });
}

export function useUpdateUser(
    options?: UseMutationOptions<ApiResponse<{ user: User }>, Error, { id: string; data: UserUpdate }>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UserUpdate }) =>
            fetchApi<ApiResponse<{ user: User }>>(`/api/users/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
        },
        ...options,
    });
}

export function useDeleteUser(
    options?: UseMutationOptions<ApiResponse<Record<string, never>>, Error, string>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) =>
            fetchApi<ApiResponse<Record<string, never>>>(`/api/users/${id}`, {
                method: 'DELETE',
            }),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['users', id] });
        },
        ...options,
    });
}

// ============================================================================
// Favorites Hooks
// ============================================================================

export function useFavorites(options?: UseQueryOptions<ApiResponse<{ favorites: Favorite[] }>, Error>) {
    return useQuery({
        queryKey: ['favorites'],
        queryFn: () => fetchApi<ApiResponse<{ favorites: Favorite[] }>>('/api/favorites'),
        ...options,
    });
}

export function useFavoritesByUser(userId: string, options?: UseQueryOptions<ApiResponse<{ favorites: Favorite[] }>, Error>) {
    return useQuery({
        queryKey: ['favorites', 'user', userId],
        queryFn: () => fetchApi<ApiResponse<{ favorites: Favorite[] }>>(`/api/favorites/user/${userId}`),
        enabled: !!userId,
        ...options,
    });
}

export function useCreateFavorite(
    options?: UseMutationOptions<ApiResponse<{ favorite: Favorite }>, Error, Favorite>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Favorite) =>
            fetchApi<ApiResponse<{ favorite: Favorite }>>('/api/favorites', {
                method: 'POST',
                body: JSON.stringify(data),
            }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
            queryClient.invalidateQueries({ queryKey: ['favorites', 'user', variables.user] });
        },
        ...options,
    });
}

export function useDeleteFavorite(
    options?: UseMutationOptions<ApiResponse<Record<string, never>>, Error, { userId: string; foodId: string }>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, foodId }: { userId: string; foodId: string }) =>
            fetchApi<ApiResponse<Record<string, never>>>(`/api/favorites/user/${userId}/food/${foodId}`, {
                method: 'DELETE',
            }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
            queryClient.invalidateQueries({ queryKey: ['favorites', 'user', variables.userId] });
        },
        ...options,
    });
}

// ============================================================================
// Constellations Hooks
// ============================================================================

export function useConstellations(options?: UseQueryOptions<ApiResponse<{ constellations: Constellation[] }>, Error>) {
    return useQuery({
        queryKey: ['constellations'],
        queryFn: () => fetchApi<ApiResponse<{ constellations: Constellation[] }>>('/api/constellations'),
        ...options,
    });
}

export function useConstellation(id: string, options?: UseQueryOptions<ApiResponse<{ constellation: Constellation }>, Error>) {
    return useQuery({
        queryKey: ['constellations', id],
        queryFn: () => fetchApi<ApiResponse<{ constellation: Constellation }>>(`/api/constellations/${id}`),
        enabled: !!id,
        ...options,
    });
}

export function useCreateConstellation(
    options?: UseMutationOptions<ApiResponse<{ constellation: Constellation }>, Error, ConstellationCreate>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ConstellationCreate) =>
            fetchApi<ApiResponse<{ constellation: Constellation }>>('/api/constellations', {
                method: 'POST',
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['constellations'] });
        },
        ...options,
    });
}

export function useUpdateConstellation(
    options?: UseMutationOptions<ApiResponse<{ constellation: Constellation }>, Error, { id: string; data: ConstellationUpdate }>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: ConstellationUpdate }) =>
            fetchApi<ApiResponse<{ constellation: Constellation }>>(`/api/constellations/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['constellations'] });
            queryClient.invalidateQueries({ queryKey: ['constellations', variables.id] });
        },
        ...options,
    });
}

export function useDeleteConstellation(
    options?: UseMutationOptions<ApiResponse<Record<string, never>>, Error, string>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) =>
            fetchApi<ApiResponse<Record<string, never>>>(`/api/constellations/${id}`, {
                method: 'DELETE',
            }),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['constellations'] });
            queryClient.invalidateQueries({ queryKey: ['constellations', id] });
        },
        ...options,
    });
}

// ============================================================================
// Constellation Items Hooks
// ============================================================================

export function useConstellationItems(options?: UseQueryOptions<ApiResponse<{ constellationItems: ConstellationItem[] }>, Error>) {
    return useQuery({
        queryKey: ['constellationItems'],
        queryFn: () => fetchApi<ApiResponse<{ constellationItems: ConstellationItem[] }>>('/api/constellation-items'),
        ...options,
    });
}

export function useConstellationItemsByConstellation(
    constellationId: string,
    options?: UseQueryOptions<ApiResponse<{ constellationItems: ConstellationItem[] }>, Error>
) {
    return useQuery({
        queryKey: ['constellationItems', 'constellation', constellationId],
        queryFn: () => fetchApi<ApiResponse<{ constellationItems: ConstellationItem[] }>>(`/api/constellation-items/constellation/${constellationId}`),
        enabled: !!constellationId,
        ...options,
    });
}

export function useCreateConstellationItem(
    options?: UseMutationOptions<ApiResponse<{ constellationItem: ConstellationItem }>, Error, ConstellationItem>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ConstellationItem) =>
            fetchApi<ApiResponse<{ constellationItem: ConstellationItem }>>('/api/constellation-items', {
                method: 'POST',
                body: JSON.stringify(data),
            }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['constellationItems'] });
            queryClient.invalidateQueries({ queryKey: ['constellationItems', 'constellation', variables.constellation] });
        },
        ...options,
    });
}

export function useDeleteConstellationItem(
    options?: UseMutationOptions<ApiResponse<Record<string, never>>, Error, { constellationId: string; foodId: string }>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ constellationId, foodId }: { constellationId: string; foodId: string }) =>
            fetchApi<ApiResponse<Record<string, never>>>(`/api/constellation-items/constellation/${constellationId}/food/${foodId}`, {
                method: 'DELETE',
            }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['constellationItems'] });
            queryClient.invalidateQueries({ queryKey: ['constellationItems', 'constellation', variables.constellationId] });
        },
        ...options,
    });
}


export function useRecognizeFood(
    request: FoodRecognitionRequest | null, options?: UseMutationOptions<ImageApiResponse<FoodRecognitionData>, Error>
) {
    return useQuery({
        queryKey: ['recognizeFood', request],
        queryFn: () =>
            fetchApi<ImageApiResponse<FoodRecognitionData>>('/api/recognizeFood', {
                method: 'POST',
                body: JSON.stringify(request),
            }),
        enabled: request !== null,
        ...options,
    });
}