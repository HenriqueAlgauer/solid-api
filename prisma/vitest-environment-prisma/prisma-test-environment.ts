import { Environment } from 'vitest/environments';

export default <Environment><unknown>{
    name: 'prisma',
    async setup() {
        console.log('Executou');

        return {
            async teardown() {
                console.log('Hei');

            }
        };
    },
    transformMode: 'web'
}