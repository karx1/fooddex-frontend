import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { createDB } from "../../database";
import { type AppContext, User } from "../../types";

export class UserList extends OpenAPIRoute {
    schema = {
        tags: ["Users"],
        summary: "List all users",
        responses: {
            "200": {
                description: "Returns a list of all users",
                content: {
                    "application/json": {
                        schema: z.object({
                            success: Bool(),
                            result: z.object({
                                users: z.array(User),
                            }),
                        }),
                    },
                },
            },
        },
    };

    async handle(c: AppContext) {
        const db = createDB(c.env.foodex_db);

        const users = await db.selectFrom("users").selectAll().execute();

        return {
            success: true,
            result: {
                users,
            },
        };
    }
}
