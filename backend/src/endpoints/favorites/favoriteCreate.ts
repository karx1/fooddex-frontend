import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { createDB } from "../../database";
import { type AppContext, Favorite } from "../../types";

export class FavoriteCreateEndpoint extends OpenAPIRoute {
    schema = {
        tags: ["Favorites"],
        summary: "Create a new favorite",
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: Favorite,
                    },
                },
            },
        },
        responses: {
            "200": {
                description: "Returns the created favorite",
                content: {
                    "application/json": {
                        schema: z.object({
                            success: Bool(),
                            result: z.object({
                                favorite: Favorite,
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

        const result = await db
            .insertInto("favorites")
            .values(data.body)
            .returning([
                "user",
                "food",
            ])
            .executeTakeFirstOrThrow();

        return {
            success: true,
            result: {
                favorite: result,
            },
        };
    }
}
