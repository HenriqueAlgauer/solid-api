import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeFetchCheckInsHistoryUseCase } from '../../../use-cases/factories/make-fetch-user-check-ins-history'

export async function history(request: FastifyRequest, reply: FastifyReply) {
    const checkInHistoryQueySchema = z.object({
        page: z.coerce.number().min(1).default(1),
    })

    const { page } = checkInHistoryQueySchema.parse(request.query)

    const fetchCheckInsHistoryUseCase = makeFetchCheckInsHistoryUseCase()

    const { checkIns } = await fetchCheckInsHistoryUseCase.execute({
        userId: request.user.sub,
        page
    })

    return reply.status(200).send(
        checkIns,
    )
}