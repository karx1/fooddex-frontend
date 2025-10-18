import { Bool, Int, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { createDB } from "../../database";
import { type AppContext, Food, FoodUpdate } from "../../types";

export class FoodUpdateEndpoint extends OpenAPIRoute {
    schema = {
        tags: ["Foods"],
        summary: "Update a food by ID",
        request: {
            params: z.object({
                id: Int({ description: "Food ID" }),
            }),
            body: {
                content: {
                    "application/json": {
                        schema: FoodUpdate,
                    },
                },
            },
        },
        responses: {
            "200": {
                description: "Returns the updated food",
                content: {
                    "application/json": {
                        schema: z.object({
                            success: Bool(),
                            result: z.object({
                                food: Food,
                            }),
                        }),
                    },
                },
            },
            "404": {
                description: "Food not found",
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
            .updateTable("foods")
            .set(data.body)
            .where("id", "=", data.params.id)
            .returning([
                "id",
                "rarity",
                "origin",
                "foodname",
            ])
            .executeTakeFirst();

        if (!result) {
            return Response.json(
                {
                    success: false,
                    error: "Food not found",
                },
                {
                    status: 404,
                }
            );
        }

        return {
            success: true,
            result: {
                food: result,
            },
        };
    }
}
