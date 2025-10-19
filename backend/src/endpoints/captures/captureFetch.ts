import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";
import { createDB } from "../../database";
import { type AppContext, Capture } from "../../types";

export class CaptureFetch extends OpenAPIRoute {
    schema = {
        tags: ["Captures"],
        summary: "Get a single capture by ID",
        request: {
            params: z.object({
                id: Str({ description: "Capture ID" }),
            }),
        },
        responses: {
            "200": {
                description: "Returns a single capture if found",
                content: {
                    "application/json": {
                        schema: z.object({
                            success: Bool(),
                            result: z.object({
                                capture: Capture,
                            }),
                        }),
                    },
                },
            },
            "404": {
                description: "Capture not found",
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

        const capture = await db
            .selectFrom("captures")
            .selectAll()
            .where("id", "=", data.params.id)
            .executeTakeFirst();

        if (!capture) {
            return Response.json(
                {
                    success: false,
                    error: "Capture not found",
                },
                {
                    status: 404,
                }
            );
        }

        return {
            success: true,
            result: {
                capture,
            },
        };
    }
}
