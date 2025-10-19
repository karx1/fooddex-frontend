import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";
import { createDB } from "../../database";
import { type AppContext, Constellation, ConstellationUpdate } from "../../types";

export class ConstellationUpdateEndpoint extends OpenAPIRoute {
    schema = {
        tags: ["Constellations"],
        summary: "Update a constellation by ID",
        request: {
            params: z.object({
                id: Str({ description: "Constellation ID" }),
            }),
            body: {
                content: {
                    "application/json": {
                        schema: ConstellationUpdate,
                    },
                },
            },
        },
        responses: {
            "200": {
                description: "Returns the updated constellation",
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

        const result = await db
            .updateTable("constellations")
            .set(data.body)
            .where("id", "=", data.params.id)
            .returning([
                "id",
                "user",
                "name",
            ])
            .executeTakeFirst();

        if (!result) {
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
                constellation: result,
            },
        };
    }
}
