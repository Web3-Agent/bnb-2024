import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_WEB_THREE_AGENT_NODE_APP || 'http://localhost:3232'
export async function restDataApi(payload) {
    try {
        const { data } = await axios.post(`${BASE_URL}/api/v1/data-api/`, payload);
        return data
    } catch (error) {
        throw error;
    }
}