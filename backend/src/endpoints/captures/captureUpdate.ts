import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";
import { createDB } from "../../database";
import { type AppContext, Capture, CaptureUpdate } from "../../types";

export class CaptureUpdateEndpoint extends OpenAPIRoute {
    schema = {
        tags: ["Captures"],
        summary: "Update a capture by ID",
        request: {
            params: z.object({
                id: Str({ description: "Capture ID" }),
            }),
            body: {
                content: {
                    "application/json": {
                        schema: CaptureUpdate,
                    },
                },
            },
        },
        responses: {
            "200": {
                description: "Returns the updated capture",
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

        const result = await db
            .updateTable("captures")
            .set(data.body)
            .where("id", "=", data.params.id)
            .returning([
                "id",
                "food",
                "date",
                "user",
            ])
            .executeTakeFirst();

        if (!result) {
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
                capture: result,
            },
        };
    }
}
