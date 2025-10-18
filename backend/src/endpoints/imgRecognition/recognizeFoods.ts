import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { createDB } from "../../database";
import { type AppContext, User, UserCreate } from "../../types";

export class UserCreateEndpoint extends OpenAPIRoute {
    schema = {
        tags: ["ImgRecognition"],
        summary: "Recognize foods from an image",
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: UserCreate,
                    },
                },
            },
        },
        responses: {
            "200": {
                description: "Returns the created user",
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
        },
    };

    async handle(c: AppContext) {
        const data = await this.getValidatedData<typeof this.schema>();
        const db = createDB(c.env.foodex_db);

        const result = await db
            .insertInto("users")
            .values(data.body)
            .returning([
                "id",
                "username",
            ])
            .executeTakeFirstOrThrow();

        return {
            success: true,
            result: {
                user: result,
            },
        };
    }
}
