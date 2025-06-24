import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
    plugins: [vue()],
    test: {
        environment: 'jsdom',
        setupFiles: ['./vitest.setup.ts'],
    },
    resolve: {
        alias: {
            '\\.css$': './__mocks__/styleMock.js',
            '@': resolve(__dirname, 'src')
        }
    }
})
