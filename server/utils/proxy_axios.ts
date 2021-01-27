import axios from 'axios'
import * as tunnel from 'tunnel'
import config from '../config'

const tunnelingAgent = tunnel.httpsOverHttp({
  proxy: {
    host: config.PROXY_HOST,
    port: config.PROXY_PORT,
  },
})

const proxyAxios = () => {
  if (!(config.PROXY_PORT && config.PROXY_HOST)) return axios
  return axios.create({
    proxy: false,
    httpsAgent: tunnelingAgent,
  })
}

export default proxyAxios()
