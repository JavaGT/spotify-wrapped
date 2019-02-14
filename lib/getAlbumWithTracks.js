const { flatten } = require('lodash')
const generateLoopOptions = require('./_generateLoopOptions');

module.exports = (q) => async function(id) {
  let info = Object.assign((
    await q(() => this._api.getAlbum(id))).body, {
    tracks: (await q(() => this._api.getAlbumTracks(id))).body
  })

  let { limit, total } = info.tracks

  let loopOptions = generateLoopOptions({ limit, total })

  let trackArray = flatten(await Promise.all(loopOptions
    .map(async opts =>
      (await q(() => this._api.getAlbumTracks(id, opts))).body.items)
  ))

  return Object.assign(info, { tracks: { items: trackArray, limit: total, total, offset: 0 } })
}