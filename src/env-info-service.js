import axios from "axios";
import * as logger from './logger.js'
import { extractAllowedProperties } from './utils.js'

const BASE_URL = 'https://ssr.xenial.com/'
const INFO_PATH = '/info/'
const SERVICES_LIST_LIMIT = process.env.LIMIT
const NA_MESSAGE = 'N/A'
const ALLOWED_FIELDS = ['version', 'code', 'key']
const SERVICE_INFO_DEFAULTS = {}

ALLOWED_FIELDS.forEach((key) => SERVICE_INFO_DEFAULTS[key] = NA_MESSAGE)

/**
 * @param {string} stage - Stage code (e.g. 'dev', 'qa', .etc)
 *
 * @returns {Promise<Array<ServiceVersion>>}
 */
function getVersionsOnStage(stage) {
    return getListOfServices(stage)
        .then(_getServicesListDetailedInfo)
        .then((servicesList) =>
            servicesList
                .map((serviceInfo) => extractAllowedProperties(serviceInfo, ALLOWED_FIELDS))
        )
}

/**
 * @param {Array<ServiceInfo>} servicesList - Services list
 *
 * @returns {Promise<Array<MergedServiceDetailedInfo>>}
 */
function _getServicesListDetailedInfo(servicesList) {
    const result = []
    return servicesList
        .map((service) => {
            return new Promise((resolve) => {
                getServiceDetailedInfo(service)
                    .then((info) => {
                        resolve({...SERVICE_INFO_DEFAULTS,  ...service, ...info})
                    }, error => {
                        logger.error(error)
                        resolve({...SERVICE_INFO_DEFAULTS, ...service})
                    })
            })
        })
        .reduce((promiseChain, serviceInfoPromise) => {
            return promiseChain
                .then(function() {
                    return serviceInfoPromise
                })
                .then((info) => result.push(info))
        }, Promise.resolve())
        .then(() => result)
}

/**
 * @param {string} stage - Stage code (e.g. 'dev', 'qa', .etc)
 *
 * @returns {Promise<Array<ServiceInfo>>}
 */
function getListOfServices(stage) {
    if (!stage) {
        return Promise.reject(new Error('Stage is not defined.'))
    }
    const servicesListUrl = [BASE_URL, '?env=', stage].join('')
    return axios
        .get(servicesListUrl)
        .then((response) => response.data || [])
        .then((data) => SERVICES_LIST_LIMIT ? data.slice(0, SERVICES_LIST_LIMIT) : data)
        .catch((error) => {
            logger.error(error)
            new Error('Can\'t reach service list.')
        })
}

/**
 * @param {ServiceInfo} service - Service main info object
 *
 * @returns {Promise<Object<ServiceDetailedInfo>>}
 */
function getServiceDetailedInfo(service) {
    if (!service || !service.url) {
        return Promise.reject(new Error('Service info can\'t be reached'))
    }
    const detailedInfoUrl = [service.url, INFO_PATH].join('')

    return axios
        .get(detailedInfoUrl)
        .then((response) => response.data || {})
        .catch((error) => {
            logger.error(error)
            new Error('Can\'t reach service info.')
        })
}

export { getVersionsOnStage, getListOfServices, getServiceDetailedInfo }
