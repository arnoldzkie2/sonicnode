import 'dotenv/config'
import axios from "axios"
import { RateLimiterMemory } from "rate-limiter-flexible";

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

const opts = {
    points: 5,
    duration: 1 * 30,
};

export const apiLimiter = new RateLimiterMemory(opts);

export const sonicApi = setupAxios()