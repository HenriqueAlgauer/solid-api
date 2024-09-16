import { compare } from 'bcryptjs'
import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register'

describe('Register Use Case', () => {
    it('should hash user password upon registration', async () => {
        const registerUseCase = new RegisterUseCase({
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            async findByEmail(email) {
                return null
            },

            async create(data) {
                return {
                    id: 'user-1',
                    name: data.name,
                    email: data.email,
                    password_hash: data.password_hash,
                    created_at: new Date()
                }
            }
        })

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
})