import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { createDB } from "../../database";
import { type AppContext, Capture, CaptureCreate } from "../../types";

export class CaptureCreateEndpoint extends OpenAPIRoute {
    schema = {
        tags: ["Captures"],
        summary: "Create a new capture",
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: CaptureCreate,
                    },
                },
            },
        },
        responses: {
            "200": {
                description: "Returns the created capture",
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
        },
    };

    async handle(c: AppContext) {
        const data = await this.getValidatedData<typeof this.schema>();
        const db = createDB(c.env.foodex_db);

        const id = crypto.randomUUID();
        const result = await db
            .insertInto("captures")
            .values({
                ...data.body,
                id,
            })
            .returning([
                "id",
                "food",
                "date",
                "user",
            ])
            .executeTakeFirstOrThrow();

        return {
            success: true,
            result: {
                capture: result,
            },
        };
    }
}
