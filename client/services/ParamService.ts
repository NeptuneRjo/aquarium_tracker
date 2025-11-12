import { Param, ApiResponse } from '../types'

const BASE_ROUTE = process.env.EXPO_PUBLIC_API_URL

const createParam = async (
    clerk_id: string, 
    param_ulid: string, 
    value: number
): Promise<ApiResponse<Param>> => {
    return fetch(`${BASE_ROUTE}/nodes`, {
        method: 'POST',
        headers: {
            'Clerk-Id': clerk_id,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            value,
            param_ulid
        })
    }).then((res) => res.json())
}

const ParamService = {
    createParam
}

export default ParamService