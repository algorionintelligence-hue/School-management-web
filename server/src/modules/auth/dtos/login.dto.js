
const loginDto = z.object({
    email: z
        .string()
        .email()
        .transform((value) => value.toLowerCase().trim()),

    password: z
        .string()
        .min(8, "Password must contain at least 8 characters"),

    domain: z
        .string()
        .min(1, "Domain is required")
        .transform((value) => value.toLowerCase().trim()),
});

module.exports = loginDto;