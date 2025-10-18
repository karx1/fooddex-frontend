import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { createDB } from "../../database";
import { type AppContext, Favorite } from "../../types";

export class FavoriteList extends OpenAPIRoute {
    schema = {
        tags: ["Favorites"],
        summary: "List all favorites",
        responses: {
            "200": {
                description: "Returns a list of all favorites",
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
        const db = createDB(c.env.foodex_db);

        const favorites = await db.selectFrom("favorites").selectAll().execute();

        return {
            success: true,
            result: {
                favorites,
            },
        };
    }
}
