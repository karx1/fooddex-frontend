import { DateTime, Int, Str } from "chanfana";
import type { Context } from "hono";
import { z } from "zod";

export type AppContext = Context<{ Bindings: Env }>;

// Foods Schema
export const Food = z.object({
	id: Int(),
	rarity: Int(),
	origin: Str(),
	foodname: Str(),
	description: Str(),
});

export const FoodCreate = Food.omit({ id: true });
export const FoodUpdate = Food.partial().omit({ id: true });

// Users Schema
export const User = z.object({
	id: Int(),
	username: Str({ example: "byes" }),
});

export const UserCreate = User.omit({ id: true });
export const UserUpdate = User.partial().omit({ id: true });

// Captures Schema
export const Capture = z.object({
	id: Int(),
	food: Int(),
	date: DateTime(),
	user: Int(),
});

export const CaptureCreate = Capture.omit({ id: true });
export const CaptureUpdate = Capture.partial().omit({ id: true });

// Favorites Schema
export const Favorite = z.object({
	user: Int(),
	food: Int(),
});

// Constellations Schema
export const Constellation = z.object({
	id: Int(),
	user: Int(),
});

export const ConstellationCreate = Constellation.omit({ id: true });
export const ConstellationUpdate = Constellation.partial().omit({ id: true });

// Constellation Items Schema
export const ConstellationItem = z.object({
	food: Int(),
	constellation: Int(),
});

// Database table types for Kysely
export interface Database {
	foods: {
		id: number;
		rarity: number;
		origin: string;
		foodname: string;
		description: string;
	};
	captures: {
		id: number;
		food: number;
		date: string;
		user: number;
	};
	users: {
		id: number;
		username: string;
	};
	favorites: {
		user: number;
		food: number;
	};
	constellations: {
		id: number;
		user: number;
	};
	constellation_items: {
		food: number;
		constellation: number;
	};
}
