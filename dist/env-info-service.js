"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getVersionsOnStage = getVersionsOnStage;
exports.getListOfServices = getListOfServices;
exports.getServiceDetailedInfo = getServiceDetailedInfo;

var _axios = _interopRequireDefault(require("axios"));

var logger = _interopRequireWildcard(require("./logger.js"));

var _utils = require("./utils.js");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var BASE_URL = 'https://ssr.xenial.com/';
var INFO_PATH = '/info/';
var SERVICES_LIST_LIMIT = process.env.LIMIT;
var NA_MESSAGE = 'N/A';
var ALLOWED_FIELDS = ['version', 'code', 'key'];
var SERVICE_INFO_DEFAULTS = {};
ALLOWED_FIELDS.forEach(function (key) {
  return SERVICE_INFO_DEFAULTS[key] = NA_MESSAGE;
});
/**
 * @param {string} stage - Stage code (e.g. 'dev', 'qa', .etc)
 *
 * @returns {Promise<Array<ServiceVersion>>}
 */

function getVersionsOnStage(stage) {
  return getListOfServices(stage).then(_getServicesListDetailedInfo).then(function (servicesList) {
    return servicesList.map(function (serviceInfo) {
      return (0, _utils.extractAllowedProperties)(serviceInfo, ALLOWED_FIELDS);
    });
  });
}
/**
 * @param {Array<ServiceInfo>} servicesList - Services list
 *
 * @returns {Promise<Array<MergedServiceDetailedInfo>>}
 */


function _getServicesListDetailedInfo(servicesList) {
  var result = [];
  return servicesList.map(function (service) {
    return new Promise(function (resolve) {
      getServiceDetailedInfo(service).then(function (info) {
        resolve(_objectSpread(_objectSpread(_objectSpread({}, SERVICE_INFO_DEFAULTS), service), info));
      }, function (error) {
        logger.error(error);
        resolve(_objectSpread(_objectSpread({}, SERVICE_INFO_DEFAULTS), service));
      });
    });
  }).reduce(function (promiseChain, serviceInfoPromise) {
    return promiseChain.then(function () {
      return serviceInfoPromise;
    }).then(function (info) {
      return result.push(info);
    });
  }, Promise.resolve()).then(function () {
    return result;
  });
}
/**
 * @param {string} stage - Stage code (e.g. 'dev', 'qa', .etc)
 *
 * @returns {Promise<Array<ServiceInfo>>}
 */


function getListOfServices(stage) {
  if (!stage) {
    return Promise.reject(new Error('Stage is not defined.'));
  }

  var servicesListUrl = [BASE_URL, '?env=', stage].join('');
  return _axios["default"].get(servicesListUrl).then(function (response) {
    return response.data || [];
  }).then(function (data) {
    return SERVICES_LIST_LIMIT ? data.slice(0, SERVICES_LIST_LIMIT) : data;
  })["catch"](function (error) {
    logger.error(error);
    new Error('Can\'t reach service list.');
  });
}
/**
 * @param {ServiceInfo} service - Service main info object
 *
 * @returns {Promise<Object<ServiceDetailedInfo>>}
 */


function getServiceDetailedInfo(service) {
  if (!service || !service.url) {
    return Promise.reject(new Error('Service info can\'t be reached'));
  }

  var detailedInfoUrl = [service.url, INFO_PATH].join('');
  return _axios["default"].get(detailedInfoUrl).then(function (response) {
    return response.data || {};
  })["catch"](function (error) {
    logger.error(error);
    new Error('Can\'t reach service info.');
  });
}