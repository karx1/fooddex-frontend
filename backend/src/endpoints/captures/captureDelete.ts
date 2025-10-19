import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";
import { createDB } from "../../database";
import { type AppContext } from "../../types";

export class CaptureDelete extends OpenAPIRoute {
    schema = {
        tags: ["Captures"],
        summary: "Delete a capture by ID",
        request: {
            params: z.object({
                id: Str({ description: "Capture ID" }),
            }),
        },
        responses: {
            "200": {
                description: "Capture deleted successfully",
                content: {
                    "application/json": {
                        schema: z.object({
                            success: Bool(),
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

        const result = await db
            .deleteFrom("captures")
            .where("id", "=", data.params.id)
            .executeTakeFirst();

        if (result.numDeletedRows === BigInt(0)) {
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
        };
    }
}
