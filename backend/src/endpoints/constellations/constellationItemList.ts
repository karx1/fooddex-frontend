import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { createDB } from "../../database";
import { type AppContext, ConstellationItem } from "../../types";

export class ConstellationItemList extends OpenAPIRoute {
    schema = {
        tags: ["Constellation Items"],
        summary: "List all constellation items",
        responses: {
            "200": {
                description: "Returns a list of all constellation items",
                content: {
                    "application/json": {
                        schema: z.object({
                            success: Bool(),
                            result: z.object({
                                constellationItems: z.array(ConstellationItem),
                            }),
                        }),
                    },
                },
            },
        },
    };

    async handle(c: AppContext) {
        const db = createDB(c.env.foodex_db);

        const constellationItems = await db.selectFrom("constellation_items").selectAll().execute();

        return {
            success: true,
            result: {
                constellationItems,
            },
        };
    }
}
