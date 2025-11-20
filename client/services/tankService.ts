import { ApiResponse, Tank, Tanks } from "../types"

const BASE_ROUTE = process.env.EXPO_PUBLIC_API_URL

const getAllTanks = async (
    clerk_id: string
): Promise<ApiResponse<Tanks[]>> => {
    return fetch(`${BASE_ROUTE}/api/tanks`, { 
        headers: { 'Clerk-Id': clerk_id }, 
        method: 'GET'
    }).then(res => res.json())
}

const getTank = async (
    clerk_id: string, 
    ulid: string
): Promise<ApiResponse<Tank>> => {
    return fetch(`${BASE_ROUTE}/api/tanks/${ulid}`, {
        headers: { 'Clerk-Id': clerk_id },
        method: 'GET'
    }).then(res => res.json())
}

const createTank = async (
    clerk_id: string, 
    item: { name: string, description: string | undefined }
): Promise<ApiResponse<Tank>> => {
    return fetch(`${BASE_ROUTE}/api/tanks`, {
        headers: { 
            'Clerk-Id': clerk_id, 
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(item)
    }).then(res => res.json())
}

const updateTank = async (
    clerk_id: string, 
    tank_ulid: string, 
    item: { name: string | undefined, description: string | undefined}
): Promise<ApiResponse<Tank>> => {
    return fetch(`${BASE_ROUTE}/api/tanks/${tank_ulid}`, {
        headers: { 
            'Clerk-Id': clerk_id,
            'Content-Type': 'application/json'
        },
        method: 'PATCH',
        body: JSON.stringify(item)
    }).then(res => res.json())
}

const deleteTank = async (
    clerk_id: string, 
    tank_ulid: string
): Promise<ApiResponse<null>> => {
    return fetch(`${BASE_ROUTE}/api/tanks/${tank_ulid}`, {
        headers: { 'Clerk-Id': clerk_id },
        method: 'DELETE'
    }).then(res => res.json())
}

const TankService = {
    getAllTanks,
    getTank,
    updateTank,
    createTank,
    deleteTank
}

export default TankService