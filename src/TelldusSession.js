import fetch from 'isomorphic-fetch'
import querystring from 'query-string'
import jwtDecode from 'jwt-decode'

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
  TEN_MINUTES_MS = 60 * 10 * 1000,
  shouldRefreshToken = (token) => (
    (jwtDecode(token, { header: true }).exp * 1000) < (Date.now() + TEN_MINUTES_MS)
  )

export default class TelldusSession {
  constructor (deviceUrl) {
    this.fetch = (url, params = {}, options = {}) => fetch(
      trailingSlash(deviceUrl) +
      'api' +
      leadingSlash(url) +
      '?' +
      querystring.stringify(params),
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
    if (shouldRefreshToken(this.accessToken)) {
      return this.refreshToken()
        .then(() => this.invoke(endpoint, params))
        .catch(() => this.invoke(endpoint, params))
    }

    return this.api(endpoint, params).then(resp => { console.log(endpoint, JSON.stringify(resp)); return resp; })
  }

  initLogin (app) {
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

  resumeLogin (token) {
    return this
      .api('/token', { token })
      .then(resp => {
        if (resp.token) {
          return this.loginWithAccessToken(resp.token, { skipVerify: true })
        }
        throw resp
      })
  }

  loginWithAccessToken (accessToken, { skipVerify = false } = {}) {
    if (skipVerify) {
      this.accessToken = accessToken
      return new Promise(function (resolve) {
        resolve({
          success: true,
          token: accessToken
        })
      })
    }

    return this
      .api('/devices/list', {}, {}, accessToken)
      .then(resp => {
        this.accessToken = accessToken;
        return { success: true, token: accessToken }
      })
  }

  refreshToken () {
    return this
      .api('/refreshToken')
      .then(resp => {
        if (resp.accessToken) {
          this.accessToken = resp.accessToken
        }
        throw resp
      })
  }
}
