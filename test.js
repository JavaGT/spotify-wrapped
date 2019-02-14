let Spotify = require('./index.js')
let s = new Spotify(require('./secret'))
s.init().then(() => {
  // s.getPlaylistWithTracks('77fnHKzZdoxl5lROVewC3p').then(console.log).catch(console.log)
  // s.getArtistWithAlbums('0du5cEVh5yTK9QJze8zA0C').then(console.log).catch(console.log)
  s.getAlbumWithTracks('4MgtwNYjD89Oj2km6eFRYd').then(console.log).catch(console.log)
  // s.getAlbum('4MgtwNYjD89Oj2km6eFRYd').then(console.log).catch(console.log)
})