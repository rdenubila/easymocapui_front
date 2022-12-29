import { get, post, put, remove } from "./apiRequest";

const endpoint = 'device';

const saveDevice = async (data, id) => {
    if (id)
        return (await put(`${endpoint}/${id}`, data)).data;
    else
        return (await post(endpoint, data)).data;
}

const listDevice = async () => {
    return (await get(endpoint)).data;
}

const getDeviceDetail = async (id) => {
    return (await get(`${endpoint}/${id}`)).data;
}

const removeDevice = async (id) => {
    return await remove(endpoint, id);
}

export {
    saveDevice,
    listDevice,
    removeDevice,
    getDeviceDetail
}