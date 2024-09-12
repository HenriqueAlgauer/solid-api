export class UserAlredyExists extends Error {
    constructor() {
        super('Email alredy exists')
    }
}