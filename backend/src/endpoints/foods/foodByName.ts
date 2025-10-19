import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";
import { createDB } from "../../database";
import { type AppContext, Food } from "../../types";

export class FoodFetchByName extends OpenAPIRoute {
    schema = {
        tags: ["Foods"],
        summary: "Get a single food by name",
        request: {
            params: z.object({
                foodname: Str({ description: "Food name" }),
            }),
        },
        responses: {
            "200": {
                description: "Returns a single food if found",
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

        const food = await db
            .selectFrom("foods")
            .selectAll()
            .where("foodname", "=", data.params.foodname)
            .executeTakeFirst();

        if (!food) {
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
                food,
            },
        };
    }
}
