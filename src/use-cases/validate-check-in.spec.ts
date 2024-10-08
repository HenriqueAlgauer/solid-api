import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '../repositories/in-memory/in-memory-check-ins-repository'
import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFound } from './errors/resource-not-found'

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate Check In Use Case', () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository()
        sut = new ValidateCheckInUseCase(checkInsRepository)
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able to validate check-in', async () => {
        const createdCheckIn = await checkInsRepository.create({
            gym_id: 'gym-01',
            user_id: 'user-01'
        })

        const { checkIn } = await sut.execute({
            checkInId: createdCheckIn.id
        })

        expect(checkIn.validated_at).toEqual(expect.any(Date))
        expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))
    })

    it('should not be able to validate an inexistent check-in', async () => {
        expect(() => sut.execute({
            checkInId: 'inexisting-check-in'
        })).rejects.toBeInstanceOf(ResourceNotFound)
    })

    it('should not be able to validate the check-in after 20 minutes', async () => {
        vi.setSystemTime(new Date(2024, 0, 1, 13, 40))

        const createdCheckIn = await checkInsRepository.create({
            gym_id: 'gym-01',
            user_id: 'user-01'
        })

        const twentOneMinutes = 1000 * 60 * 21

        vi.advanceTimersByTime(twentOneMinutes)

        await expect(() => sut.execute({
            checkInId: createdCheckIn.id
        })).rejects.toBeInstanceOf(Error)
    })
})