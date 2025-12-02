import api from "./api";

export const createSubject = async (data: any) => {
    const res = await api.post('/subjects', data);   
    return res.data;
};

export const getSubjects = async () => {
    const res = await api.get('/subjects');   
    return res.data;
}
