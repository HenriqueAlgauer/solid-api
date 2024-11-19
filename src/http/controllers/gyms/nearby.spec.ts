import request from 'supertest'
import { app } from '../../../app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '../../../../utils/test/create-and-authenticate-user'

describe('Search Gyms (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to list nearby gyms', async () => {
        const { token } = await createAndAuthenticateUser(app)

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'php',
                description: 'Olha a desc',
                phone: '4199999999',
                latitude: -25.4361399,
                longitude: -49.3157547,
            })

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Java',
                description: 'Olha a desc do 2',
                phone: '4199999999',
                latitude: -25.6470796,
                longitude: -48.4382606,
            })

        const response = await request(app.server)
            .get('/gyms/nearby')
            .query({
                latitude: -25.4361399,
                longitude: -49.3157547,
            })
            .set('Authorization', `Bearer ${token}`)
            .send()

        expect(response.statusCode).toEqual(200)
        expect(response.body.gyms).toHaveLength(1)
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                title: 'php'
            })
        ])
    })
})
