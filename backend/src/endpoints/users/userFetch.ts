import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";
import { createDB } from "../../database";
import { type AppContext, User } from "../../types";

export class UserFetch extends OpenAPIRoute {
    schema = {
        tags: ["Users"],
        summary: "Get a single user by ID",
        request: {
            params: z.object({
                id: Str({ description: "User ID" }),
            }),
        },
        responses: {
            "200": {
                description: "Returns a single user if found",
                content: {
                    "application/json": {
                        schema: z.object({
                            success: Bool(),
                            result: z.object({
                                user: User,
                            }),
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

        const user = await db
            .selectFrom("users")
            .selectAll()
            .where("id", "=", data.params.id)
            .executeTakeFirst();

        if (!user) {
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
            result: {
                user,
            },
        };
    }
}
