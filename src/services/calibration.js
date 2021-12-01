import { get, post, remove } from "./apiRequest";

const endpoint = 'camera-calibration';

const saveCalibration = async (data) => {
    return (await post(endpoint, data)).data;
}

const listCalibration = async () => {
    return (await get(endpoint)).data;
}

const getCalibrationById = async (id) => {
    return (await get(`${endpoint}/${id}`)).data;
}

const removeCalibration = async (id) => {
    return await remove(endpoint, id);
}

export {
    saveCalibration,
    listCalibration,
    getCalibrationById,
    removeCalibration
}