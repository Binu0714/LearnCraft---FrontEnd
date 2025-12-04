import api from "./api";

export const setPriorityLevel = async (data: any) => {
    const res = await api.post('/priorities', data);   
    return res.data;
}

export const getPriorityLevel  = async () => {
    const res = await api.get('/priorities');   
    return res.data;
}