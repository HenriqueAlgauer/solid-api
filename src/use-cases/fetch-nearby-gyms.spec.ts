import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository'
import { expect, describe, it, beforeEach, } from 'vitest'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch nearby gyms use case', () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new FetchNearbyGymsUseCase(gymsRepository)
    })


    it('should be able to fetch nearby gyms', async () => {
        await gymsRepository.create({
            title: 'NEAR gym',
            description: '',
            phone: '',
            latitude: -25.4361399,
            longitude: -49.3157547,
        })

        await gymsRepository.create({
            title: 'FAR gym',
            description: '',
            phone: '',
            latitude: -25.6470796,
            longitude: -48.4382606,
        })

        const { gyms } = await sut.execute({
            userLatitude: -25.4361399,
            userLongitude: -49.3157547
        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'NEAR gym' }),
        ])
    })
})