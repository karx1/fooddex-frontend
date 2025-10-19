import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { createDB } from "../../database";
import { type AppContext, Food, FoodCreate } from "../../types";

export class FoodCreateEndpoint extends OpenAPIRoute {
    schema = {
        tags: ["Foods"],
        summary: "Create a new food",
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: FoodCreate,
                    },
                },
            },
        },
        responses: {
            "200": {
                description: "Returns the created food",
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
        },
    };

    async handle(c: AppContext) {
        const data = await this.getValidatedData<typeof this.schema>();
        const db = createDB(c.env.foodex_db);

        const id = crypto.randomUUID();
        const result = await db
            .insertInto("foods")
            .values({
                ...data.body,
                id,
            })
            .returning([
                "id",
                "rarity",
                "origin",
                "foodname",
                "description",
            ])
            .executeTakeFirstOrThrow();

        return {
            success: true,
            result: {
                food: result,
            },
        };
    }
}
