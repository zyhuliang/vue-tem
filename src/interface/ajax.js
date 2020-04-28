/**
 * ------------------------------------------------------------------
 * api.js
 * ------------------------------------------------------------------
 */
import axios from 'axios'
export default {
  get (url, data = '') {
    return new Promise((resolve, reject) => {
      axios.get(url, { params: data })
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  post (url, params) {
    return new Promise((resolve, reject) => {
      axios.post(url, params)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  put (url, params) {
    return new Promise((resolve, reject) => {
      axios.put(url, params)
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
