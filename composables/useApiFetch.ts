import type { UseFetchOptions } from '#app'
import { defu } from 'defu'

export default function useApiFetch<T> (url: string | (() => string), options: UseFetchOptions<T> = {}) {
  // const {data} =useKeycloak()
  const config = useRuntimeConfig()

  const defaults: UseFetchOptions<T> = {
    baseURL: config.public.apiUrl ?? 'http://localhost:8081',
    // url, method, headers, etc. - this should be used with care as the key
    // is how Nuxt decides how responses should be deduplicated between
    // client and server
    key: url as string,

    // set user token if connected
    // headers: data.value?.idToken
      // ? { Authorization: `Bearer ${data.value.idToken}` }
      // : {},

    onResponse (_ctx) {
      // _ctx.response._data = new myBusinessResponse(_ctx.response._data)
    },

    onResponseError (_ctx) {
      // throw new myBusinessError()
    }
  }

  // for nice deep defaults, please use unjs/defu
  const params = defu(options, defaults)

  return useFetch(url, params)
}
