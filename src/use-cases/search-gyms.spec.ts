import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository'
import { expect, describe, it, beforeEach, } from 'vitest'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search gyms use case', () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new SearchGymsUseCase(gymsRepository)
    })


    it('should be able to search for gyms', async () => {
        await gymsRepository.create({
            title: 'Js gym',
            description: '',
            phone: '',
            latitude: -25.4361399,
            longitude: -49.3157547,
        })

        await gymsRepository.create({
            title: 'Ts gym',
            description: '',
            phone: '',
            latitude: -25.4361399,
            longitude: -49.3157547,
        })

        const { gyms } = await sut.execute({
            query: 'Js',
            page: 1
        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'Js gym' }),
        ])
    })

    it('should be able to fetch paginated gyms', async () => {
        for (let i = 1; i <= 22; i++) {
            await gymsRepository.create({
                title: `Js gym-${i}`,
                description: '',
                phone: '',
                latitude: -25.4361399,
                longitude: -49.3157547,
            })
        }

        const { gyms } = await sut.execute({
            query: 'Js',
            page: 2
        })

        expect(gyms).toHaveLength(2)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'Js gym-21' }),
            expect.objectContaining({ title: 'Js gym-22' })
        ])
    })


})