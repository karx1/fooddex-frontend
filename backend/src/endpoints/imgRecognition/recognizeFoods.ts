import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { type AppContext, FoodRecognitionData, FoodRecognitionRequest } from "../../types";

import { GoogleGenAI, createPartFromBase64, createPartFromText } from "@google/genai";
import { createDB } from "../../database";

import { randomUUID } from "crypto";


const b64toBlob = (base64: string, type: string = 'application/octet-stream') => 
  fetch(`data:${type};base64,${base64}`).then(res => res.blob())


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
        const data = await this.getValidatedData<typeof this.schema>();


        const db = createDB(c.env.foodex_db);

        const result = await db.selectFrom("foods").selectAll().execute();


        const ai = new GoogleGenAI({ apiKey: c.env.GEMINI_KEY });
        let foodSt = "";
        result.forEach((item, i) => {
            foodSt += `${i}:${item.foodname},`
        })


        const prompt = `
            Return square bounding boxes around objects identified as 'food'
            as a JSON array with labels. Do NOT use 'food', 'meal', etc. as the label.
            The bounding box can be as large as necessary to neccessitate these conditions:

            - The box must encapture the entire object.
            - The box MUST be square. Height of the box MUST equal width.

            Never return masks or code fencing. Limit to 25 objects/foods. Include as many
            objects as you can identify on the table.

            Here is a list of food labels.:
            
            ${foodSt}
            
            The label for each box returned should be an identifying name for the food detected.
            Identify the food as one of these labels. If the food item cannot be reasonably
            matched to one of the labels, make a best attempt to 'round' to the most similar
            food in the label list, and set the relabel value to 1 to indicate you forced this rounding.
            The label for every food MUST be labeled with one from the list

            We also want to store which index in the list of food labels our label resides in as rel_id, 0 indexed.
            For example, if the first label in the list is the correct label, return 0 as rel_id.

            
            The format should be as follows: [{"box_2d": [ymin, xmin, ymax, xmax],
            "label": <label for the object>, "rel_id": <index in list>, 
            "relabel": <relabel value 0 or 1>}]
            normalized to 0-1000. The values in
            box_2d, rel_id, and point must only be integers
        `.trim();

        const uuid = randomUUID();
        const imgBlob = await b64toBlob(data.body.image, data.body.image);
        const img = await c.env.food_pictures.put(uuid, imgBlob)


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


        return {
            success: true,
            result: JSON.parse(response.text),
        };
    }
}
