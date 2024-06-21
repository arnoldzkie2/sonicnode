import 'dotenv/config'
import axios from "axios"
import { RateLimiterMemory } from "rate-limiter-flexible";

const API_KEY = process.env.API_KEY as string
const API_URL = process.env.API_URL as string
const PAYMONGO_API_URL = process.env.PAYMONGO_API_URL as string
const PAYMONGO_SECRET = process.env.PAYMONGO_SECRET_KEY as string

const setupSonicApi = () => {
    return axios.create({
        baseURL: API_URL,
        headers: {
            Authorization: `Bearer ${API_KEY}`
        }
    })
}

const setupPaymongoApi = () => {
    return axios.create({
        baseURL: PAYMONGO_API_URL,
        headers: {
            Authorization: `Basic ${btoa(`${PAYMONGO_SECRET}:`)}`
        }
    })
}

const opts = {
    points: 3,
    duration: 1 * 30,
};

export const apiLimiter = new RateLimiterMemory(opts);

export const sonicApi = setupSonicApi()
export const paymongoApi = setupPaymongoApi()