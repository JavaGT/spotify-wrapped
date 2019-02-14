const { flatten } = require('lodash')
const generateLoopOptions = require('./_generateLoopOptions');

module.exports = (q) => async function(id) {
  let info = Object.assign((
    await q(() => this._api.getArtist(id))).body, {
    albums: (await q(() => this._api.getArtistAlbums(id))).body
  })

  let { limit, total } = info.albums

  let loopOptions = generateLoopOptions({ limit, total })

  let albumArray = flatten(await Promise.all(loopOptions
    .map(async opts =>
      (await q(() => this._api.getArtistAlbums(id, opts))).body.items)
  ))

  return Object.assign(info, { albums: { items: albumArray, limit: total, total, offset: 0 } })
}