import fetch from 'node-fetch'
import querystring from 'query-string'

const
  maybeAddAuthorizationHeader = (options, accessToken) => (
    accessToken ? ({
      ...options,
      headers: {
        Authorization: "Bearer " + accessToken,
        ...options.headers
      }
    }) : options
  ),
  trailingSlash = path => (
    path.substr(-1) === '/' ? path : path + '/'
  ),
  leadingSlash = path => (
    path[0] === '/' ? path : '/' + path
  ),
  buildUrl = (base, path, params) => (
    trailingSlash(base) +
    'api' +
    leadingSlash(path) +
    '?' +
    querystring.stringify(params)
  )

export default class TelldusSession {
  constructor (deviceUrl) {
    this.fetch = (url, params = {}, options = {}) => fetch(
      buildUrl(deviceUrl, url, params),
      options
    )
  }

  api (endpoint = "", params = {}, options = {}, accessToken) {
    accessToken = accessToken || this.accessToken
    options = maybeAddAuthorizationHeader(options, accessToken)
    return this
      .fetch(endpoint, params, options)
      .then(resp => resp.json())
  }

  invoke (endpoint, params = {}) {
    return this.api(endpoint, params)
  }

  authorize (app) {
    return this.api(
      '/token',
      {},
      {
        method: 'PUT',
        body: querystring.stringify({ app }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' }
      }
    )
  }

  loginWithAccessToken (accessToken, { refresh = true } = {}) {
    return this.api('/devices/list', {}, {}, accessToken)
      .then(resp => {
        if (resp.device) {
          this.accessToken = accessToken
          return { success: true, token: accessToken }
        }
        else {
          throw resp
        }
      })
  }

  loginWithToken (token, { refresh = true } = {}) {
    return this.api('/token', { token })
      .then(resp => {
        if (resp.token && resp.expires) {
          return this.loginWithAccessToken(resp.token)
        }
        throw resp
      })
  }

  logout () {

  }
}
