import { get, post, put, remove } from "./apiRequest";

const endpoint = 'command';

const listCommands = async () => {
    return (await get(endpoint)).data;
}

const getCommandById = async (id) => {
    return (await get(`${endpoint}/${id}`)).data;
}

const runCommandById = async (id) => {
    return (await post(`${endpoint}/${id}/run`)).data;
}

const removeCommandById = async (id) => {
    return await remove(endpoint, id);
}

export {
    listCommands,
    getCommandById,
    runCommandById,
    removeCommandById
}