import { uploadImage } from '@/app/functions/upload-image'
import type { FastifyInstance } from 'fastify'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const uploadImageRoute: FastifyPluginAsyncZod = async (
	server: FastifyInstance
) => {
	server.post(
		'/uploads',
		{
			schema: {
				summary: 'Upload an image',
				consumes: ['multipart/form-data'],
				response: {
					201: z.object({ uploadId: z.string() }),
					409: z
						.object({ message: z.string() })
						.describe('Upload already exists.')
				}
			}
		},
		async (request, reply) => {
			const uploadedFile = await request.file({
				limits: {
					fieldSize: 1024 * 1024 * 2 // 2mb
				}
			})

			if (!uploadedFile) {
				return reply.status(400).send({ message: 'File is required.' })
			}

			await uploadImage({
				fileName: uploadedFile.filename,
				contentType: uploadedFile.mimetype,
				contentStream: uploadedFile.file
			})

			return reply.status(201).send({ uploadId: '' })
		}
	)
}
