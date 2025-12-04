import api from "./api";

export const saveUserSchedule = async (data: any) => {
    const res = await api.post('/schedules', data);   
    return res.data;
}