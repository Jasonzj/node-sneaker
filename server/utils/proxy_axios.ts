import axios from 'axios'
import * as tunnel from 'tunnel'
import config from '../config'

const tunnelingAgent = tunnel.httpsOverHttp({
  proxy: {
    host: '127.0.0.1',
    port: config.proxy_port,
  },
})

const proxyAxios = () => {
  if (!config.proxy) return axios
  return axios.create({
    proxy: false,
    httpsAgent: tunnelingAgent,
  })
}

export default proxyAxios()
