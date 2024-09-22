import { compare } from 'bcryptjs'
import { expect, describe, it, beforeEach, } from 'vitest'
import { RegisterUseCase } from './register'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { UserAlredyExists } from './errors/user-alredy-exists'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new RegisterUseCase(usersRepository)
    })

    it('should be able to register', async () => {


        const { user } = await sut.execute({
            name: 'John Doe',
            email: 'johndoe@exaple.com',
            password: '123456'
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('should hash user password upon registration', async () => {

        const { user } = await sut.execute({
            name: 'John Doe',
            email: 'Johndoe@email.com',
            password: '123456'
        })

        const isPasswordHashed = await compare(
            '123456',
            user.password_hash
        )

        expect(isPasswordHashed).toBe(true)
    })

    it('should not be able to register with same email twice', async () => {

        const email = 'joh@test.com'

        await sut.execute({
            name: 'John Doe',
            email,
            password: '123456'
        })


        await expect(
            sut.execute({
                name: 'John Doe',
                email,
                password: '123456'
            })
        ).rejects.toBeInstanceOf(UserAlredyExists)

    })
})