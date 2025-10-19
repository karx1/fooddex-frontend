import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";
import { createDB } from "../../database";
import { type AppContext, Favorite } from "../../types";

export class FavoriteListByUser extends OpenAPIRoute {
    schema = {
        tags: ["Favorites"],
        summary: "Get all favorites for a user",
        request: {
            params: z.object({
                userId: Str({ description: "User ID" }),
            }),
        },
        responses: {
            "200": {
                description: "Returns all favorites for the user",
                content: {
                    "application/json": {
                        schema: z.object({
                            success: Bool(),
                            result: z.object({
                                favorites: z.array(Favorite),
                            }),
                        }),
                    },
                },
            },
        },
    };

    async handle(c: AppContext) {
        const data = await this.getValidatedData<typeof this.schema>();
        const db = createDB(c.env.foodex_db);

        const favorites = await db
            .selectFrom("favorites")
            .selectAll()
            .where("user", "=", data.params.userId)
            .execute();

        return {
            success: true,
            result: {
                favorites,
            },
        };
    }
}
