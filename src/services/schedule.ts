import api from "./api";

export const saveUserSchedule = async (data: any) => {
    const res = await api.post('/schedules', data);   
    return res.data;
}

export const getScheduleStats = async () => {
  const response = await api.get("/schedules"); 
  return response.data; 
};