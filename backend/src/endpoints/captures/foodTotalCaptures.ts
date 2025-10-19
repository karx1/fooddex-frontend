import { Bool, OpenAPIRoute, Str, Int } from "chanfana";
import { z } from "zod";
import { createDB } from "../../database";
import { type AppContext, Capture } from "../../types";

export class FoodTotalCaptures extends OpenAPIRoute {
    schema = {
        tags: ["Foods"],
        summary: "Get the number of total captures for a food",
        request: {
            params: z.object({
                id: Str({ description: "Food ID" }),
            }),
        },
        responses: {
            "200": {
                description: "returns a number of captures",
                content: {
                    "application/json": {
                        schema: z.object({
                            success: Bool(),
                            result: z.object({
                                captures: Int(),
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
            .where("food", "=", data.params.id)
            .execute();

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
                captures: capture.length,
            },
        };
    }
}
