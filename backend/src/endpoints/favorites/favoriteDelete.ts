import { Bool, Int, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { createDB } from "../../database";
import { type AppContext } from "../../types";

export class FavoriteDelete extends OpenAPIRoute {
    schema = {
        tags: ["Favorites"],
        summary: "Delete a favorite by user ID and food ID",
        request: {
            params: z.object({
                userId: Int({ description: "User ID" }),
                foodId: Int({ description: "Food ID" }),
            }),
        },
        responses: {
            "200": {
                description: "Favorite deleted successfully",
                content: {
                    "application/json": {
                        schema: z.object({
                            success: Bool(),
                        }),
                    },
                },
            },
            "404": {
                description: "Favorite not found",
                content: {
                    "application/json": {
                        schema: z.object({
                            success: Bool(),
                            error: z.string(),
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
            .deleteFrom("favorites")
            .where("user", "=", data.params.userId)
            .where("food", "=", data.params.foodId)
            .executeTakeFirst();

        if (result.numDeletedRows === BigInt(0)) {
            return Response.json(
                {
                    success: false,
                    error: "Favorite not found",
                },
                {
                    status: 404,
                }
            );
        }

        return {
            success: true,
        };
    }
}
