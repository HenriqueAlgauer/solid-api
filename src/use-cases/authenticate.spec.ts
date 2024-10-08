import { expect, describe, it, beforeEach, } from 'vitest'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentials } from './errors/invalid-credentials'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Autheticate Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new AuthenticateUseCase(usersRepository)
    })

    it('should be able to authenticate', async () => {
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
        expect(() =>
            sut.execute({
                email: 'john@email.com',
                password: '123456'
            })
        ).rejects.toBeInstanceOf(InvalidCredentials)
    })

    it('should not be able to authenticate with wrong password', async () => {
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