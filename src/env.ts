import { z } from 'zod'

const envSchema = z.object({
	APP_PORT: z.coerce.number().default(3333),
	NODE_ENV: z.enum(['production', 'test', 'development']).default('production'),
	DATABASE_URL: z.string().url().startsWith('postgresql://'),

	CLOUDFLARE_BUCKET: z.string(),
	CLOUDFLARE_PUBLIC_URL: z.string().url(),
	CLOUDFLARE_ACCOUNT_ID: z.string(),
	CLOUDFLARE_ACCESS_KEY_ID: z.string(),
	CLOUDFLARE_SECRET_ACCESS_KEY: z.string()
})

export type Env = z.infer<typeof envSchema>

export const env = envSchema.parse(process.env)
