const { range } = require('lodash')
module.exports = function generateLoopOptions({ limit, total }) {
  return range(Math.ceil(total / limit))
    .map(i => ({ limit, offset: i * limit }))
}