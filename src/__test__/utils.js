import {extractAllowedProperties} from "../utils"

test('Extract only provided properties', () => {
  const mockObj = {
      name: 'serv',
      ver: '1',
      key: 'dsfs-3mfa',
      statuscode: 1,
      servertimestamp: '2021-09-02T14:34:42.743Z'
  }

  expect(extractAllowedProperties(mockObj, ['ver', 'key', 'name'])).toEqual({
      name: mockObj.name,
      ver: mockObj.ver,
      key: mockObj.key
  })
})