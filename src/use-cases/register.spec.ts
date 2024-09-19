import { compare } from 'bcryptjs'
import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'

describe('Register Use Case', () => {
    it('should hash user password upon registration', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUseCase(usersRepository)

        const { user } = await registerUseCase.execute({
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
        const usersRepository = new InMemoryUsersRepository()
        const registerUseCase = new RegisterUseCase(usersRepository)

        const email = 'john@test.com'

        await registerUseCase.execute({
            name: 'John Doe',
            email,
            password: '123456'
        })


        expect(() => {
            registerUseCase.execute({
                name: 'John Doe',
                email,
                password: '123456'
            })
        }).toBe(true)
    })
})