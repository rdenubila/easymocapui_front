import { baseUrl, get, post, put, remove, } from "./apiRequest";

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

const extractAnimationVideo = async (id) => {
    return (await post(`${endpoint}/${id}/extract`)).data;
}

const smplReconstruction = async (id, values) => {
    return (await post(`${endpoint}/${id}/smpl`, values)).data;
}

const bvhExport = async (id) => {
    return (await post(`${endpoint}/${id}/bvh`)).data;
}

const bvhLink = (folder, file) => {
    return `${baseUrl.replace("api", "files")}animation/${folder}/output/bvh/${file}`;
}

export {
    saveAnimation,
    listAnimation,
    removeAnimation,
    getAnimationDetail,
    extractAnimationVideo,
    smplReconstruction,
    bvhExport,
    bvhLink
}