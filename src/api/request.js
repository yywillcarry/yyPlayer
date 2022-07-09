import axios from 'axios'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
// http://localhost:3000
const request = axios.create({
    baseURL: process.env.VUE_APP_BASE_API_URL,
    withCredentials: true,

})
request.interceptors.request.use((config) => {
    nprogress.start()

    return config
})
request.interceptors.response.use((response) => {
    nprogress.done()
    if (response.status === 200) {
        return response.data
    }
    return Promise.reject(response)

}, (err) => {

    return err
})
export default request