import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";
import { createDB } from "../../database";
import { type AppContext, ConstellationItem } from "../../types";

export class ConstellationItemListByConstellation extends OpenAPIRoute {
    schema = {
        tags: ["Constellation Items"],
        summary: "Get all items in a constellation",
        request: {
            params: z.object({
                constellationId: Str({ description: "Constellation ID" }),
            }),
        },
        responses: {
            "200": {
                description: "Returns all items in the constellation",
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
        const data = await this.getValidatedData<typeof this.schema>();
        const db = createDB(c.env.foodex_db);

        const constellationItems = await db
            .selectFrom("constellation_items")
            .selectAll()
            .where("constellation", "=", data.params.constellationId)
            .execute();

        return {
            success: true,
            result: {
                constellationItems,
            },
        };
    }
}
