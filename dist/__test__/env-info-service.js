"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var axios = _interopRequireWildcard(require("axios"));

var envInfoService = _interopRequireWildcard(require("../env-info-service"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

jest.mock('axios');
afterAll(function () {
  axios.get.mockRestore();
});
var servicesListMock = [{
  "name": "Service 1",
  "description": "Service 1 Description",
  "key": "ss1",
  "url": "https://s1.xenial.com"
}, {
  "name": "Service 2",
  "description": "Service 2 Description",
  "key": "ss2",
  "url": "https://s2.xenial.com"
}, {
  "name": "Service 3",
  "description": "Service 3 Description",
  "key": "ss3",
  "url": "https://s3.xenial.com"
}];
var detailedInfoListMock = [{
  "version": "v1",
  "code": "c1",
  "key": "ss1",
  "statuscode": 1,
  "appversion": 'v1'
}, {
  "version": "v1",
  "appversion": 'v1',
  "statuscode": 2
}];
describe('getListOfServices function', function () {
  test('reject an error when stage is not defined', function (done) {
    envInfoService.getListOfServices().then(function () {}, function (error) {
      return expect(error.message).toBe('Stage is not defined.');
    }).then(done);
  });
  test('returns list of services', function (done) {
    axios.get.mockResolvedValueOnce({
      data: servicesListMock
    });
    envInfoService.getListOfServices('dev').then(function (servicesList) {
      expect(servicesList).toEqual(servicesListMock);
    }).then(done);
  });
});
describe('getServiceDetailedInfo function', function () {
  test('reject an error if service was not passed', function (done) {
    envInfoService.getServiceDetailedInfo().then(function () {}, function (error) {
      return expect(error.message).toBe('Service info can\'t be reached');
    }).then(done);
  });
  test('reject an error on server error', function (done) {
    axios.get.mockRejectedValueOnce();
    envInfoService.getServiceDetailedInfo(servicesListMock[0]).then(function () {}, function (error) {
      return expect(error.message).toBe('Can\'t reach service info.');
    }).then(done);
  });
  test('returns detailed info', function (done) {
    axios.get.mockResolvedValueOnce({
      data: detailedInfoListMock[0]
    });
    envInfoService.getServiceDetailedInfo(servicesListMock[0]).then(function (detailedInfo) {
      expect(detailedInfo).toEqual(detailedInfoListMock[0]);
    }).then(done);
  });
});
describe('getVersionsOnStage function', function () {
  beforeEach(function () {
    axios.get.mockResolvedValueOnce({
      data: servicesListMock
    }).mockResolvedValueOnce({
      data: detailedInfoListMock[0]
    }).mockResolvedValueOnce({
      data: detailedInfoListMock[1]
    }).mockRejectedValueOnce({
      data: detailedInfoListMock[2]
    });
  });
  test('throws an error if stage is not defined', function (done) {
    envInfoService.getVersionsOnStage().then(function () {}, function (error) {
      expect(error.message).toBe('Stage is not defined.');
    }).then(done);
  });
  test('tesolves a list of versions on stage', function (done) {
    var serviceVersionsResultMock = [{
      "code": "c1",
      "key": "ss1",
      "version": "v1"
    }, {
      "code": "N/A",
      "key": "ss2",
      "version": "v1"
    }, {
      "code": "N/A",
      "key": "ss3",
      "version": "N/A"
    }];
    envInfoService.getVersionsOnStage('dev').then(function (serviceVersions) {
      expect(serviceVersions).toEqual(serviceVersionsResultMock);
    }).then(done);
  });
});