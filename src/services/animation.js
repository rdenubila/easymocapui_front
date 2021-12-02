import { get, post, put, remove } from "./apiRequest";

const endpoint = 'animation';

const saveAnimation = async (data, id) => {
    if (id)
        return (await put(`${endpoint}/${id}`, data)).data;
    else
        return (await post(endpoint, data)).data;
}

const listAnimation = async () => {
    return (await get(endpoint)).data;
}

const getAnimationDetail = async (id) => {
    return (await get(`${endpoint}/${id}`)).data;
}

const removeAnimation = async (id) => {
    return await remove(endpoint, id);
}

export {
    saveAnimation,
    listAnimation,
    removeAnimation,
    getAnimationDetail
}