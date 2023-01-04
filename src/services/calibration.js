import { get, post, remove } from "./apiRequest";

const endpoint = 'camera-calibration';

const saveCalibration = async (data) => {
    return (await post(endpoint, data)).data;
}

const extractCalibrationVideo = async (id) => {
    return (await post(`${endpoint}/${id}/extract`)).data;
}

const detectChessboard = async (id) => {
    return (await post(`${endpoint}/${id}/chessboard`)).data;
}

const calibrate = async (id) => {
    return (await post(`${endpoint}/${id}/calibrate`)).data;
}

const listCalibrationImages = async (id) => {
    return (await get(`${endpoint}/${id}/images`)).data;
}

const setCalibrationImage = async (id, type, folder, cam, image) => {
    return (await post(`${endpoint}/${id}/images`, {
        type, folder, cam, image
    })).data;
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
    removeCalibration,
    extractCalibrationVideo,
    listCalibrationImages,
    setCalibrationImage,
    calibrate,
    detectChessboard
}