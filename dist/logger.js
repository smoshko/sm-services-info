"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.error = error;
exports.info = info;

function error(message) {
  if (!process.env.ERROR_LEVEL || process.env.ERROR_LEVEL !== 'error') {
    return;
  }

  console.error('--- Error ---');
  console.error(message);
  console.error('--- /Error ---');
}

function info(message) {
  console.log('--- Info ---');
  console.log(message);
  console.log('--- /Info ---');
}