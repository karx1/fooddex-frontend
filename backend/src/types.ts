import { Arr, DateTime, Int, Obj, Str } from "chanfana";
import type { Context } from "hono";
import { z } from "zod";

export type AppContext = Context<{ Bindings: Env }>;

// Foods Schema
export const Food = z.object({
	id: Str(),
	rarity: Int(),
	origin: Str(),
	foodname: Str(),
	description: Str(),
});

export const FoodCreate = Food.omit({ id: true });
export const FoodUpdate = Food.partial().omit({ id: true });

// Users Schema
export const User = z.object({
	id: Str(),
	username: Str({ example: "byes" }),
});

export const UserCreate = User.omit({ id: true });
export const UserUpdate = User.partial().omit({ id: true });

// Captures Schema
export const Capture = z.object({
	id: Str(),
	food: Str(),
	date: DateTime(),
	user: Str(),
});

export const CaptureCreate = Capture.omit({ id: true });
export const CaptureUpdate = Capture.partial().omit({ id: true });

// Favorites Schema
export const Favorite = z.object({
	user: Str(),
	food: Str(),
});

// Constellations Schema
export const Constellation = z.object({
	id: Str(),
	user: Str(),
});

export const ConstellationCreate = Constellation.omit({ id: true });
export const ConstellationUpdate = Constellation.partial().omit({ id: true });

// Constellation Items Schema
export const ConstellationItem = z.object({
	food: Str(),
	constellation: Str(),
});

export const FoodRecognitionRequest = z.object({
	image: Str(),
	mimetype: Str(),
})

/*
[
  {
	"box_2d": [150, 539, 285, 775],
	"label": "Pumpkin Pie",
	"relabel": 1
  },
  {
	"box_2d": [210, 207, 424, 545],
	"label": "Dinner Rolls",
	"relabel": 1
  },
  {
	"box_2d": [356, 104, 542, 412],
	"label": "Pumpkin Bread",
	"relabel": 1
  },
  {
	"box_2d": [448, 448, 599, 706],
	"label": "Green Beans",
	"relabel": 1
  },
  {
	"box_2d": [396, 720, 533, 963],
	"label": "Mashed Potatoes",
	"relabel": 1
  },
  {
	"box_2d": [538, 142, 714, 414],
	"label": "Stuffing",
	"relabel": 1
  },
  {
	"box_2d": [656, 350, 935, 792],
	"label": "Sliced Turkey",
	"relabel": 1
  },
  {
	"box_2d": [724, 33, 883, 271],
	"label": "Corn",
	"relabel": 1
  },
  {
	"box_2d": [564, 836, 638, 970],
	"label": "Gravy",
	"relabel": 1
  },
  {
	"box_2d": [672, 812, 742, 924],
	"label": "Cranberry Sauce",
	"relabel": 1
  }
]
*/

export const FoodRecognitionData = z.object({
	imageUrl: Str(),
	detections: Arr(Obj({
		box_2d: Arr(Int()),
		label: Str(),
		relabel: Int()
	}))
})

// Database table types for Kysely
export interface Database {
	foods: {
		id: string;
		rarity: number;
		origin: string;
		foodname: string;
		description: string;
	};
	captures: {
		id: string;
		food: string;
		date: string;
		user: string;
	};
	users: {
		id: string;
		username: string;
	};
	favorites: {
		user: string;
		food: string;
	};
	constellations: {
		id: string;
		user: string;
	};
	constellation_items: {
		food: string;
		constellation: string;
	};
}
