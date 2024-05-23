import axios, { AxiosResponse } from "axios";

const Instance = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export const userLogin = async (data: any) =>
  await Instance.post("/user/login", data);

export const getForm = async (params: any) =>
  await Instance.get("/node/form-data", { params });

export const getUserTracking = async (query: any) =>
  await Instance.get("/node/node-tracking", { params: query });

export const createRequest = async (data:any) => await Instance.put('/tracking-node-input', data)