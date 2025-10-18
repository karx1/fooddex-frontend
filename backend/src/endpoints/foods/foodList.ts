import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { createDB } from "../../database";
import { type AppContext, Food } from "../../types";

export class FoodList extends OpenAPIRoute {
    schema = {
        tags: ["Foods"],
        summary: "List all foods",
        responses: {
            "200": {
                description: "Returns a list of all foods",
                content: {
                    "application/json": {
                        schema: z.object({
                            success: Bool(),
                            result: z.object({
                                foods: z.array(Food),
                            }),
                        }),
                    },
                },
            },
        },
    };

    async handle(c: AppContext) {
        const db = createDB(c.env.foodex_db);

        const foods = await db.selectFrom("foods").selectAll().execute();

        return {
            success: true,
            result: {
                foods,
            },
        };
    }
}
