import axios from "axios";

const baseUrl = process.env.REACT_APP_API_URL.replace("{host}", window.location.hostname);

var queryStringConverter = (params) => params ? '?' + Object.keys(params).map(key => key + '=' + params[key]).join('&') : '';

const get = async (endpoint, params) => {
    try {
        const data = await axios.get(`${baseUrl}${endpoint}${queryStringConverter(params)}`);
        return data.data;
    } catch (e) {
        throw e;
    }
}

const post = async (endpoint, data, config = {}) => {
    try {
        const response = await axios.post(
            `${baseUrl}${endpoint}`,
            data,
            config
        );
        return response.data;
    } catch (e) {
        throw e;
    }
}

const put = async (endpoint, data, config = {}) => {
    try {
        const response = await axios.put(
            `${baseUrl}${endpoint}`,
            data,
            config
        );
        return response.data;
    } catch (e) {
        throw e;
    }
}

const remove = async (endpoint, id) => {
    try {
        await axios.delete(`${baseUrl}${endpoint}/${id}`);
    } catch (e) {
        throw e;
    }
}

export {
    post,
    put,
    get,
    remove,
    baseUrl
}
