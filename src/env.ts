import { z } from 'zod'

const envSchema = z.object({
	APP_PORT: z.coerce.number().default(3333),
	NODE_ENV: z.enum(['production', 'test', 'development']).default('production'),
	DATABASE_URL: z.string().url().startsWith('postgresql://')
})

export type Env = z.infer<typeof envSchema>

export const env = envSchema.parse(process.env)
