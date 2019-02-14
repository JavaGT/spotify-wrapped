const Spotify = require('spotify-web-api-node')
const pQueue = require('p-queue')
const functionPriorities = require('./functionPriorities')

module.exports = function(credentials) {
  this._api = new Spotify(credentials)
  this._queue = new pQueue({ interval: 1000, intervalCap: 3, concurrency: 9 })
  let q = this._queue.add.bind(this._queue)

  let authenticate = () => this._api
    .clientCredentialsGrant()
    .then(data => data.body.access_token)
    .then(token => this._api.setAccessToken(token))

  // Custom helper function for maintaining authentication
  this.init = () => {
    setInterval(authenticate, 60 * 60 * 1000 - 3000)
    return authenticate()
  }

  // Helper functions to get pagnated information
  this.getAlbumWithTracks = require('./lib/getAlbumWithTracks')(q)
  this.getArtistWithAlbums = require('./lib/getArtistWithAlbums')(q)
  this.getPlaylistWithTracks = require('./lib/getPlaylistWithTracks')(q)

  // Expose spotify-web-api-node functions
  functionPriorities.highPriority.forEach(key => {
    this[key] = function(...args) {
      return q(() => this._api[key](...args), { priority: 2 }).then(a => a.body)
    }
  })
  functionPriorities.priority.forEach(key => {
    this[key] = function(...args) {
      return q(() => this._api[key](...args), { priority: 1 }).then(a => a.body)
    }
  })
  functionPriorities.regular.forEach(key => {
    this[key] = function(...args) {
      return q(() => this._api[key](...args), { priority: 0 }).then(a => a.body)
    }
  })
}