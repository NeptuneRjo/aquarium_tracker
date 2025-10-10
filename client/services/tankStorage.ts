import { Tank, Tanks } from "../types";
import StorageService from "./asyncStorageService";

const storeTank = async (data: Tank) => {
    const json = JSON.stringify(data)
    await StorageService.setData(`tank-${data.ulid}`, json)
}  

const getTank = async (ulid: string) => {
    return await StorageService.getData(`tank-${ulid}`)
}

const removeTank = async (ulid: string) => {
    await StorageService.removeData(`tank-${ulid}`)
}

const storeAllTanks = async (data: Tanks[]) => {
    const json = JSON.stringify(data)
    await StorageService.setData('tanks', json)
}

const getAllTanks = async () => {
    return await StorageService.getData('tanks')
}

const removeAllTanks = async () => {
    await StorageService.removeData('tanks')
}

const TankStorage = {
    storeTank,
    getTank,
    removeTank,
    getAllTanks,
    storeAllTanks,
    removeAllTanks
}

export default TankStorage