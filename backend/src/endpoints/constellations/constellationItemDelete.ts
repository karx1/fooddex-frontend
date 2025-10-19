import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";
import { createDB } from "../../database";
import { type AppContext } from "../../types";

export class ConstellationItemDelete extends OpenAPIRoute {
    schema = {
        tags: ["Constellation Items"],
        summary: "Delete a constellation item",
        request: {
            params: z.object({
                constellationId: Str({ description: "Constellation ID" }),
                foodId: Str({ description: "Food ID" }),
            }),
        },
        responses: {
            "200": {
                description: "Constellation item deleted successfully",
                content: {
                    "application/json": {
                        schema: z.object({
                            success: Bool(),
                        }),
                    },
                },
            },
            "404": {
                description: "Constellation item not found",
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
            .deleteFrom("constellation_items")
            .where("constellation", "=", data.params.constellationId)
            .where("food", "=", data.params.foodId)
            .executeTakeFirst();

        if (result.numDeletedRows === BigInt(0)) {
            return Response.json(
                {
                    success: false,
                    error: "Constellation item not found",
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
