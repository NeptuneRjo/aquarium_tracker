import { Tank, Tanks } from "../types";
import StorageService from "./asyncStorageService";

const storeTank = async (data: Tank) => {
    await StorageService.setData(`tank-${data.ulid}`, data)
}  

const getTank = async (ulid: string) => {
    return await StorageService.getData(`tank-${ulid}`)
}

const removeTank = async (ulid: string) => {
    await StorageService.removeData(`tank-${ulid}`)
}

const storeAllTanks = async (data: Tanks[]) => {
    await StorageService.setData('tanks', data)
}

const getAllTanks = async (): Promise<Tanks[] | null> => {
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