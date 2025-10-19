import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { type AppContext, FoodRecognitionData, FoodRecognitionRequest } from "../../types";

import { GoogleGenAI, createPartFromBase64, createPartFromText } from "@google/genai";


export class RecognizeFoodEndpoint extends OpenAPIRoute {
    schema = {
        tags: ["ImgRecognition"],
        summary: "Recognize foods from an image",
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: FoodRecognitionRequest,
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
                            result: FoodRecognitionData,
                        }),
                    },
                },
            },
        },
    };

    async handle(c: AppContext) {
        console
        const data = await this.getValidatedData<typeof this.schema>();

        const queries = ['pizza', 'soup'];

        const ai = new GoogleGenAI({ apiKey: c.env.GEMINI_KEY });

        const prompt = `
            Return square bounding boxes around objects identified as 'food'
            as a JSON array with labels. Do NOT use 'food', 'meal', etc. as the label.
            The bounding box can be as large as necessary to neccessitate these conditions:

            - The box must encapture the entire object.
            - The box MUST be square. Height of the box MUST equal width.

            Never return masks or code fencing. Limit to 25 objects/foods. Include as many
            objects as you can identify on the table.

            Here is a list of food labels: ${queries.join(',')}.
            The label for each box returned should be an identifying name for the food detected.
            Prioritize labels drawn from the list of food labels, but be at liberty
            to create new labels to describe the food if absolutely necessary
            should none in the list match. In the case of a new label, make the relabel value in the JSON
            1. Otherwise, set relabel to 0.

            
            The format should be as follows: [{"box_2d": [ymin, xmin, ymax, xmax],
            "label": <label for the object>, "relabel": <relabel value 0 or 1>}]
            normalized to 0-1000. The values in
            box_2d and point must only be integers
        `.trim();


        const response = await ai.models.generateContent({
            model: "gemini-robotics-er-1.5-preview",
            contents: [createPartFromText(prompt), createPartFromBase64(data.body.image, data.body.mimetype)],
            config: {
                temperature: 0.5,
                thinkingConfig: {
                    thinkingBudget: 0
                },
                responseMimeType: "application/json"
            }
        });

        console.log(response.text)


        return {
            success: true,
            result: JSON.parse(response.text),
        };

    }
}
