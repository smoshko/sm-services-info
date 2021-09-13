"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _globals = require("@jest/globals");

var logger = _interopRequireWildcard(require("../logger"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

describe('Logger', function () {
  beforeAll(function () {
    _globals.jest.spyOn(global.console, 'error').mockImplementation(_globals.jest.fn());

    _globals.jest.spyOn(global.console, 'log').mockImplementation(_globals.jest.fn());
  });
  afterAll(function () {
    global.console.error.mockRestore();
    global.console.log.mockRestore();
  });
  test('Error level messages are not logged without ERROR_LEVEL env var', function () {
    logger.error('error message');
    var errorCalls = global.console.error.mock.calls;
    expect(errorCalls.length).toBe(0);
  });
  test('Error level messages are logged', function () {
    process.env.ERROR_LEVEL = 'error';
    logger.error('error message');
    var errorCalls = global.console.error.mock.calls;
    expect(errorCalls.length).toBe(3);
    expect(errorCalls[0][0]).toEqual('--- Error ---');
    expect(errorCalls[1][0]).toEqual('error message');
    expect(errorCalls[2][0]).toEqual('--- /Error ---');
  });
  test('Info level messages are logged', function () {
    logger.info('info message');
    var infoCalls = global.console.log.mock.calls;
    expect(infoCalls.length).toBe(3);
    expect(infoCalls[0][0]).toEqual('--- Info ---');
    expect(infoCalls[1][0]).toEqual('info message');
    expect(infoCalls[2][0]).toEqual('--- /Info ---');
  });
});