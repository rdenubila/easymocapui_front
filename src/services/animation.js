import { get, post, remove } from "./apiRequest";

const endpoint = 'animation';

const saveAnimation = async (data) => {
    return (await post(endpoint, data)).data;
}

const listAnimation = async () => {
    return (await get(endpoint)).data;
}

const removeAnimation = async (id) => {
    return await remove(endpoint, id);
}

export {
    saveAnimation,
    listAnimation,
    removeAnimation
}