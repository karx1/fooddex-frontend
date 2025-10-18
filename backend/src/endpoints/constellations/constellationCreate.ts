import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { createDB } from "../../database";
import { type AppContext, Constellation, ConstellationCreate } from "../../types";

export class ConstellationCreateEndpoint extends OpenAPIRoute {
    schema = {
        tags: ["Constellations"],
        summary: "Create a new constellation",
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: ConstellationCreate,
                    },
                },
            },
        },
        responses: {
            "200": {
                description: "Returns the created constellation",
                content: {
                    "application/json": {
                        schema: z.object({
                            success: Bool(),
                            result: z.object({
                                constellation: Constellation,
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
            .insertInto("constellations")
            .values(data.body)
            .returning([
                "id",
                "user",
            ])
            .executeTakeFirstOrThrow();

        return {
            success: true,
            result: {
                constellation: result,
            },
        };
    }
}
