import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { createDB } from "../../database";
import { type AppContext, Constellation } from "../../types";

export class ConstellationList extends OpenAPIRoute {
    schema = {
        tags: ["Constellations"],
        summary: "List all constellations",
        responses: {
            "200": {
                description: "Returns a list of all constellations",
                content: {
                    "application/json": {
                        schema: z.object({
                            success: Bool(),
                            result: z.object({
                                constellations: z.array(Constellation),
                            }),
                        }),
                    },
                },
            },
        },
    };

    async handle(c: AppContext) {
        const db = createDB(c.env.foodex_db);

        const constellations = await db.selectFrom("constellations").selectAll().execute();

        return {
            success: true,
            result: {
                constellations,
            },
        };
    }
}
