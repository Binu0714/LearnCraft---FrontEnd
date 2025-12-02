import api from "./api";

export const createSubject = async (data: any) => {
    const res = await api.post('/subjects', data);   
    return res.data;
};

export const getSubjects = async () => {
    const res = await api.get('/subjects');   
    return res.data;
}

export const deleteSubject = async (subjectId: string) => {
    const res = await api.delete(`/subjects/${subjectId}`);   
    return res.data;
}

export const updateSubject = async (subjectId: string, data: any) => {
    const res = await api.put(`/subjects/${subjectId}`, data);   
    return res.data;
}
