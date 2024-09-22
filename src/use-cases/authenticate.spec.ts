import { expect, describe, it, } from 'vitest'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentials } from './errors/invalid-credentials'

describe('Autheticate Use Case', () => {
    it('should be able to authenticate', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const sut = new AuthenticateUseCase(usersRepository)

        await usersRepository.create({
            name: 'John',
            email: 'john@email.com',
            password_hash: await hash('123456', 6),
        })

        const { user } = await sut.execute({
            email: 'john@email.com',
            password: '123456'
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('should not be able to authenticate with wrong email', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const sut = new AuthenticateUseCase(usersRepository)

        expect(() =>
            sut.execute({
                email: 'john@email.com',
                password: '123456'
            })
        ).rejects.toBeInstanceOf(InvalidCredentials)
    })

    it('should not be able to authenticate with wrong password', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const sut = new AuthenticateUseCase(usersRepository)

        await usersRepository.create({
            name: 'John',
            email: 'john@email.com',
            password_hash: await hash('123456', 6),
        })

        expect(() =>
            sut.execute({
                email: 'john@email.com',
                password: 'lkvakvavmopn'
            })
        ).rejects.toBeInstanceOf(InvalidCredentials)
    })
})