import fastifyCors from '@fastify/cors'
import fastify from 'fastify'
import {
	hasZodFastifySchemaValidationErrors,
	serializerCompiler,
	validatorCompiler
} from 'fastify-type-provider-zod'
import { uploadImageRoute } from './routes/upload-image'

const server = fastify()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.setErrorHandler((error, _, reply) => {
	if (hasZodFastifySchemaValidationErrors(error)) {
		return reply.status(400).send({
			message: 'Validation error.',
			issues: error.validation
		})
	}

	// Send error to an observability tool like Sentry, Datadog, Grafana, OTel

	console.log(error)

	return reply.status(500).send({ message: 'Internal server error.' })
})

server.register(fastifyCors, { origin: '*' })

server.register(uploadImageRoute)

server.listen({ port: 3333, host: '0.0.0.0' }).then(_ => {
	console.log('Server is running!')
})
