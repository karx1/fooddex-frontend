import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";
import { createDB } from "../../database";
import { type AppContext, Constellation } from "../../types";

export class ConstellationFetch extends OpenAPIRoute {
    schema = {
        tags: ["Constellations"],
        summary: "Get a single constellation by ID",
        request: {
            params: z.object({
                id: Str({ description: "Constellation ID" }),
            }),
        },
        responses: {
            "200": {
                description: "Returns a single constellation if found",
                content: {
                    "application/json": {
                        schema: z.object({
                            success: Bool(),
                            result: z.object({
                                constellation: Constellation,
                            }),
                        }),
                    },
                },
            },
            "404": {
                description: "Constellation not found",
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

        const constellation = await db
            .selectFrom("constellations")
            .selectAll()
            .where("id", "=", data.params.id)
            .executeTakeFirst();

        if (!constellation) {
            return Response.json(
                {
                    success: false,
                    error: "Constellation not found",
                },
                {
                    status: 404,
                }
            );
        }

        return {
            success: true,
            result: {
                constellation,
            },
        };
    }
}
