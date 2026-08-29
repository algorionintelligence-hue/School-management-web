import {z} from 'zod'

const createSchoolDto = z.object({
    domain: z
        .string()
        .min(3)
        .max(255)
        .transform((value) =>
            value.toLowerCase().trim()
        ),

    name: z
        .string()
        .min(2)
        .max(150)
        .trim(),

    legalName: z
        .string()
        .min(2)
        .max(200)
        .trim(),

    email: z
        .string()
        .email()
        .transform((value) =>
            value.toLowerCase().trim()
        ),

    phone: z
        .string()
        .min(7)
        .max(30)
        .trim(),

    address: z.object({
        street: z.string().min(1).trim(),

        city: z.string().min(1).trim(),

        state: z.string().min(1).trim(),

        country: z.string().min(1).trim(),

        postalCode: z.string().min(1).trim(),
    }),

    logo: z
        .string()
        .url()
        .optional()
        .nullable(),

    timezone: z
        .string()
        .default("Asia/Karachi"),

    currency: z
        .string()
        .length(3)
        .transform((value) =>
            value.toUpperCase()
        )
        .default("PKR"),

    locale: z
        .string()
        .default("en-PK"),
});

module.exports = createSchoolDto;