import api from "./api";

export const createRoutine = async (data: any) => {
    const res = await api.post('/routines', data);   
    return res.data;
}

export const getRoutines = async () => {
    const res = await api.get('/routines');   
    return (res.data);
}

export const deleteRoutine = async (id: string) => {
    const res = await api.delete(`/routines/${id}`);   
    return res.data;
}