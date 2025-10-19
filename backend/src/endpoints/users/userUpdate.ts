import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";
import { createDB } from "../../database";
import { type AppContext, User, UserUpdate } from "../../types";

export class UserUpdateEndpoint extends OpenAPIRoute {
    schema = {
        tags: ["Users"],
        summary: "Update a user by ID",
        request: {
            params: z.object({
                id: Str({ description: "User ID" }),
            }),
            body: {
                content: {
                    "application/json": {
                        schema: UserUpdate,
                    },
                },
            },
        },
        responses: {
            "200": {
                description: "Returns the updated user",
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

        const result = await db
            .updateTable("users")
            .set(data.body)
            .where("id", "=", data.params.id)
            .returning([
                "id",
                "username",
            ])
            .executeTakeFirst();

        if (!result) {
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
                user: result,
            },
        };
    }
}
