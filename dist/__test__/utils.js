"use strict";

var _utils = require("../utils");

test('Extract only provided properties', function () {
  var mockObj = {
    name: 'serv',
    ver: '1',
    key: 'dsfs-3mfa',
    statuscode: 1,
    servertimestamp: '2021-09-02T14:34:42.743Z'
  };
  expect((0, _utils.extractAllowedProperties)(mockObj, ['ver', 'key', 'name'])).toEqual({
    name: mockObj.name,
    ver: mockObj.ver,
    key: mockObj.key
  });
});