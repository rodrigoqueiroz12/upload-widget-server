import { db, pg } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeRight } from '@/infra/shared/either'
import { ilike } from 'drizzle-orm'
import { z } from 'zod'

const getUploadsInput = z.object({
	searchQuery: z.string().optional()
})

type GetUploadsInput = z.input<typeof getUploadsInput>
type GetUploadsOutput = {
	exportUrl: string
}

export async function exportUploads(
	input: GetUploadsInput
): Promise<Either<never, GetUploadsOutput>> {
	const { searchQuery } = getUploadsInput.parse(input)

	const { sql, params } = db
		.select({
			id: schema.uploads.id,
			name: schema.uploads.name,
			remoteUrl: schema.uploads.remoteUrl,
			createdAt: schema.uploads.createdAt
		})
		.from(schema.uploads)
		.where(
			searchQuery ? ilike(schema.uploads.name, `%${searchQuery}%`) : undefined
		)
		.toSQL()

	const cursor = pg.unsafe(sql, params as string[]).cursor(2)

	for await (const row of cursor) {
		console.log(row)
	}

	return makeRight({ exportUrl: '' })
}
