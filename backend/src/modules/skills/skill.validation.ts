import { z } from 'zod';

export const skillSchema = z.object({
    body: z.object({
        skillsToTeach: z
            .array(
                z.string({
                    error: "Each skill to teach must be a string",
                })
                    .trim()
                    .toLowerCase()
            )
            .optional(),

        skillsToLearn: z
            .array(
                z.string({
                    error: "Each skill to learn must be a string",
                })
                    .trim()
                    .toLowerCase()
            )
            .optional() // Yeh bhi completely optional hai partial updates ke liye
    })
});

