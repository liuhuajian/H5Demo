import axios from 'axios'
var qs = require('qs');
// import congfig from '../wdb_config'


let server = axios.create({
  // baseURL: "https://api.wdb007.com/wdb007/",
  baseURL:"https://api.wdb007.com/wdb-wxapp-api-test/",
  timeout: 1000,
  headers: {
    'X-Custom-Header': 'foobar',
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  transformRequest: [function (data) {
    data = qs.stringify(data);
    return data;
  }],
});


server.interceptors.request.use(config => {
  config.headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
  return config
}, error => {
  return Promise.reject(error)
})


server.interceptors.response.use(response => {
  return response
}, error => {
  return Promise.resolve(error.response)
})


function get(url, params) {
  let compUrl =  getUrl(url, params)
  return new Promise(function (resolve, reject) {
    server.get(compUrl)
      .then(response => {
        console.log("#server.js_get()_response", response)
        resolve(response.data)
      })
      .catch(error => {
        console.log("#server.js_get()_error", error)
        reject(error)
      })
  })
}

function post(url, params) {
  return new Promise(function (resolve, reject) {
    server.post(url, params)
      .then(response => {
        console.log("#server.js_post()_response", response)
        resolve(response.data)
      })
      .catch(error => {
        console.log("#server.js_post()_error", error)
        reject(error)
      })
  })
}

function getUrl(url, params) {
  url = url.replace('//', '/').replace('//', '/').replace(':/', '://'); //TODO 需后续统一url请求统一去掉//    

  if (!url.endsWith('?')) url += '?'

  for (let key in params) {
      if (typeof (params[key]) !== 'object') {
          url += key + '=' + encodeURIComponent(params[key]) + '&'
      } else {
          url += key + '=' + encodeURIComponent(JSON.stringify(params[key])) + '&'
      }
  }

  if (url.endsWith('&')) url = url.substr(0, url.length - 1)

  return url
}





// module.exports = {
//     get : getMethod  
// }

export default {
  get,
  post
}
