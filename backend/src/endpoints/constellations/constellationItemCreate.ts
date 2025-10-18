import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { createDB } from "../../database";
import { type AppContext, ConstellationItem } from "../../types";

export class ConstellationItemCreate extends OpenAPIRoute {
    schema = {
        tags: ["Constellation Items"],
        summary: "Create a new constellation item",
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: ConstellationItem,
                    },
                },
            },
        },
        responses: {
            "200": {
                description: "Returns the created constellation item",
                content: {
                    "application/json": {
                        schema: z.object({
                            success: Bool(),
                            result: z.object({
                                constellationItem: ConstellationItem,
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
            .insertInto("constellation_items")
            .values(data.body)
            .returning([
                "food",
                "constellation",
            ])
            .executeTakeFirstOrThrow();

        return {
            success: true,
            result: {
                constellationItem: result,
            },
        };
    }
}
