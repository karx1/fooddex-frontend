import { fromHono } from "chanfana";
import { Hono } from "hono";

// Food endpoints
import { FoodCreateEndpoint } from "./endpoints/foods/foodCreate";
import { FoodDelete } from "./endpoints/foods/foodDelete";
import { FoodFetch } from "./endpoints/foods/foodFetch";
import { FoodList } from "./endpoints/foods/foodList";
import { FoodUpdateEndpoint } from "./endpoints/foods/foodUpdate";

// Capture endpoints
import { CaptureCreateEndpoint } from "./endpoints/captures/captureCreate";
import { CaptureDelete } from "./endpoints/captures/captureDelete";
import { CaptureFetch } from "./endpoints/captures/captureFetch";
import { CaptureList } from "./endpoints/captures/captureList";
import { CaptureUpdateEndpoint } from "./endpoints/captures/captureUpdate";

// User endpoints
import { UserCreateEndpoint } from "./endpoints/users/userCreate";
import { UserDelete } from "./endpoints/users/userDelete";
import { UserFetch } from "./endpoints/users/userFetch";
import { UserList } from "./endpoints/users/userList";
import { UserUpdateEndpoint } from "./endpoints/users/userUpdate";

// Favorite endpoints
import { FavoriteCreateEndpoint } from "./endpoints/favorites/favoriteCreate";
import { FavoriteDelete } from "./endpoints/favorites/favoriteDelete";
import { FavoriteList } from "./endpoints/favorites/favoriteList";
import { FavoriteListByUser } from "./endpoints/favorites/favoriteListByUser";

// Constellation endpoints
import { ConstellationCreateEndpoint } from "./endpoints/constellations/constellationCreate";
import { ConstellationDelete } from "./endpoints/constellations/constellationDelete";
import { ConstellationFetch } from "./endpoints/constellations/constellationFetch";
import { ConstellationList } from "./endpoints/constellations/constellationList";
import { ConstellationUpdateEndpoint } from "./endpoints/constellations/constellationUpdate";

// Constellation Item endpoints
import { ConstellationItemCreate } from "./endpoints/constellations/constellationItemCreate";
import { ConstellationItemDelete } from "./endpoints/constellations/constellationItemDelete";
import { ConstellationItemList } from "./endpoints/constellations/constellationItemList";
import { ConstellationItemListByConstellation } from "./endpoints/constellations/constellationItemListByConstellation";

import { RecognizeFoodEndpoint } from "./endpoints/imgRecognition/recognizeFoods";

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

// Setup OpenAPI registry
const openapi = fromHono(app, {
	docs_url: "/",
});

// Register Food endpoints
openapi.get("/api/foods", FoodList);
openapi.post("/api/foods", FoodCreateEndpoint);
openapi.get("/api/foods/:id", FoodFetch);
openapi.put("/api/foods/:id", FoodUpdateEndpoint);
openapi.delete("/api/foods/:id", FoodDelete);

// Register Capture endpoints
openapi.get("/api/captures", CaptureList);
openapi.post("/api/captures", CaptureCreateEndpoint);
openapi.get("/api/captures/:id", CaptureFetch);
openapi.put("/api/captures/:id", CaptureUpdateEndpoint);
openapi.delete("/api/captures/:id", CaptureDelete);

// Register User endpoints
openapi.get("/api/users", UserList);
openapi.post("/api/users", UserCreateEndpoint);
openapi.get("/api/users/:id", UserFetch);
openapi.put("/api/users/:id", UserUpdateEndpoint);
openapi.delete("/api/users/:id", UserDelete);

// Register Favorite endpoints
openapi.get("/api/favorites", FavoriteList);
openapi.post("/api/favorites", FavoriteCreateEndpoint);
openapi.get("/api/favorites/user/:userId", FavoriteListByUser);
openapi.delete("/api/favorites/user/:userId/food/:foodId", FavoriteDelete);

// Register Constellation endpoints
openapi.get("/api/constellations", ConstellationList);
openapi.post("/api/constellations", ConstellationCreateEndpoint);
openapi.get("/api/constellations/:id", ConstellationFetch);
openapi.put("/api/constellations/:id", ConstellationUpdateEndpoint);
openapi.delete("/api/constellations/:id", ConstellationDelete);

// Register Constellation Item endpoints
openapi.get("/api/constellation-items", ConstellationItemList);
openapi.post("/api/constellation-items", ConstellationItemCreate);
openapi.get("/api/constellation-items/constellation/:constellationId", ConstellationItemListByConstellation);
openapi.delete("/api/constellation-items/constellation/:constellationId/food/:foodId", ConstellationItemDelete);

openapi.post("/api/recognizeFood", RecognizeFoodEndpoint);

// Export the Hono app
export default app;
