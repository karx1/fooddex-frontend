import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { createDB } from "../../database";
import { type AppContext, Capture } from "../../types";

export class CaptureList extends OpenAPIRoute {
    schema = {
        tags: ["Captures"],
        summary: "List all captures",
        responses: {
            "200": {
                description: "Returns a list of all captures",
                content: {
                    "application/json": {
                        schema: z.object({
                            success: Bool(),
                            result: z.object({
                                captures: z.array(Capture),
                            }),
                        }),
                    },
                },
            },
        },
    };

    async handle(c: AppContext) {
        const db = createDB(c.env.foodex_db);

        const captures = await db.selectFrom("captures").orderBy('captures.date', 'desc').selectAll().execute();

        return {
            success: true,
            result: {
                captures,
            },
        };
    }
}
