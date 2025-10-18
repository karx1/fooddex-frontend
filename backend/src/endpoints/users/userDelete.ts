import { Bool, Int, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { createDB } from "../../database";
import { type AppContext } from "../../types";

export class UserDelete extends OpenAPIRoute {
    schema = {
        tags: ["Users"],
        summary: "Delete a user by ID",
        request: {
            params: z.object({
                id: Int({ description: "User ID" }),
            }),
        },
        responses: {
            "200": {
                description: "User deleted successfully",
                content: {
                    "application/json": {
                        schema: z.object({
                            success: Bool(),
                        }),
                    },
                },
            },
            "404": {
                description: "User not found",
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
            .deleteFrom("users")
            .where("id", "=", data.params.id)
            .executeTakeFirst();

        if (result.numDeletedRows === BigInt(0)) {
            return Response.json(
                {
                    success: false,
                    error: "User not found",
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
