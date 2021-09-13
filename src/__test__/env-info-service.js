import * as axios from "axios"
import * as envInfoService from '../env-info-service'

jest.mock('axios')

afterAll(() => {
    axios.get.mockRestore()
})

const servicesListMock = [
    {
        "name": "Service 1",
        "description":"Service 1 Description",
        "key":"ss1",
        "url":"https://s1.xenial.com"
    },
    {
        "name": "Service 2",
        "description":"Service 2 Description",
        "key":"ss2",
        "url":"https://s2.xenial.com"
    },
    {
        "name": "Service 3",
        "description":"Service 3 Description",
        "key":"ss3",
        "url":"https://s3.xenial.com"
    },
]
const detailedInfoListMock = [
    {
        "version": "v1",
        "code": "c1",
        "key": "ss1",
        "statuscode": 1,
        "appversion": 'v1'
    },
    {
        "version": "v1",
        "appversion": 'v1',
        "statuscode": 2,
    },
]

describe('getListOfServices function', () => {
    test('reject an error when stage is not defined', (done) => {
        envInfoService.getListOfServices()
            .then(() => {},
                (error) => expect(error.message).toBe('Stage is not defined.'))
            .then(done)
    })

    test('returns list of services', (done) => {
        axios.get.mockResolvedValueOnce({data: servicesListMock})
        envInfoService.getListOfServices('dev')
            .then((servicesList) => {
                expect(servicesList).toEqual(servicesListMock)
            })
            .then(done)
    })
})

describe('getServiceDetailedInfo function', () => {
    test('reject an error if service was not passed', (done) => {
        envInfoService.getServiceDetailedInfo()
            .then(() => {},
                (error) => expect(error.message).toBe('Service info can\'t be reached'))
            .then(done)
    })

    test('reject an error on server error', (done) => {
        axios.get.mockRejectedValueOnce()
        envInfoService.getServiceDetailedInfo(servicesListMock[0])
            .then(() => {},
                (error) => expect(error.message).toBe('Can\'t reach service info.'))
            .then(done)
    })

    test('returns detailed info', (done) => {
        axios.get.mockResolvedValueOnce({data: detailedInfoListMock[0]})
        envInfoService.getServiceDetailedInfo(servicesListMock[0])
            .then((detailedInfo) => {
                expect(detailedInfo).toEqual(detailedInfoListMock[0])
            })
            .then(done)
    })
})

describe('getVersionsOnStage function', () => {
    beforeEach(() => {
        axios.get
            .mockResolvedValueOnce({data: servicesListMock})
            .mockResolvedValueOnce({data: detailedInfoListMock[0]})
            .mockResolvedValueOnce({data: detailedInfoListMock[1]})
            .mockRejectedValueOnce({data: detailedInfoListMock[2]})
    })

    test('throws an error if stage is not defined', (done) => {
        envInfoService.getVersionsOnStage()
            .then(()=>{}, (error) => {
                expect(error.message).toBe('Stage is not defined.')
            })
            .then(done)
    })

    test('tesolves a list of versions on stage', (done) => {
        const serviceVersionsResultMock = [
            {
                "code": "c1",
                "key": "ss1",
                "version": "v1",
            },
            {
                "code": "N/A",
                "key": "ss2",
                "version": "v1",
            },
            {
                "code": "N/A",
                "key": "ss3",
                "version": "N/A",
            }
        ]
        envInfoService.getVersionsOnStage('dev')
            .then(serviceVersions => {
                expect(serviceVersions).toEqual(serviceVersionsResultMock)
            })
            .then(done)
    })
})
