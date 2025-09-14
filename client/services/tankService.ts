import { ApiResponse, Tank } from "../types"
import Config from "react-native-config"

const BASE_ROUTE = Config.EXPO_PUBLIC_API_URL

const getAllTanks = async (clerk_id: string): Promise<ApiResponse<Tank[]>> => {
    return fetch(`${BASE_ROUTE}/api/tanks`, { 
        headers: { 'Clerk-Id': clerk_id }, 
        method: 'GET'
    }).then(res => res.json())
}

const getTank = async (clerk_id: string, ulid: string): Promise<ApiResponse<Tank>> => {
    return fetch(`${BASE_ROUTE}/api/tanks/${ulid}`, {
        headers: { 'Clerk-Id': clerk_id },
        method: 'GET'
    }).then(res => res.json())
}

const TankService = {
    getAllTanks,
    getTank
}

export default TankService