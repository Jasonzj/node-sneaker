/* eslint-disable */
const md5 = require('md5')

function sign(t) {
  var s = Object.keys(t)
      .sort()
      .reduce(function (key, m) {
        return void 0 === t[m]
          ? key
          : ''
              .concat(key)
              .concat(m)
              .concat(
                (function (value) {
                  if (null === value) {
                    return ''
                  }
                  if (value instanceof Array) {
                    /** @type {string} */
                    var ret = ''
                    return (
                      value.forEach(function (col) {
                        if (ret.length > 0) {
                          ret = ret + ','
                        }
                        /** @type {string} */
                        ret = ret + JSON.stringify(col)
                      }),
                      ret
                    )
                  }
                  return value instanceof Object ? JSON.stringify(value) : value.toString()
                })(t[m]),
              )
      }, ''),
    s = s + '19bc545a393a25177083d4a748807cc0'
  return s
}

export default (query) => {
  return md5(sign(query))
}
