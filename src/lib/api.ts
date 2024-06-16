import 'dotenv/config'
import axios from "axios"
const API_KEY = process.env.API_KEY as string
const API_URL = process.env.API_URL as string

const setupAxios = () => {
    return axios.create({
        baseURL: API_URL,
        headers: {
            Authorization: `Bearer ${API_KEY}`
        }
    })
}

export const sonicApi = setupAxios()