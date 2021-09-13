import { jest } from '@jest/globals'
import * as logger from '../logger'

describe('Logger', () => {
    beforeAll(() => {
        jest.spyOn(global.console, 'error').mockImplementation(jest.fn())
        jest.spyOn(global.console, 'log').mockImplementation(jest.fn())
    })

    afterAll(() => {
        global.console.error.mockRestore()
        global.console.log.mockRestore()
    })

    test('Error level messages are not logged without ERROR_LEVEL env var', () => {
        logger.error('error message')
        const errorCalls = global.console.error.mock.calls

        expect(errorCalls.length).toBe(0)
    })

    test('Error level messages are logged', () => {
        process.env.ERROR_LEVEL = 'error'
        logger.error('error message')
        const errorCalls = global.console.error.mock.calls

        expect(errorCalls.length).toBe(3)
        expect(errorCalls[0][0]).toEqual('--- Error ---')
        expect(errorCalls[1][0]).toEqual('error message')
        expect(errorCalls[2][0]).toEqual('--- /Error ---')
    })

    test('Info level messages are logged', () => {
        logger.info('info message')
        const infoCalls = global.console.log.mock.calls

        expect(infoCalls.length).toBe(3)
        expect(infoCalls[0][0]).toEqual('--- Info ---')
        expect(infoCalls[1][0]).toEqual('info message')
        expect(infoCalls[2][0]).toEqual('--- /Info ---')
    })
})
