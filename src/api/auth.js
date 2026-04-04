
import apiinstance from "./axios";  

export const login = (data) => {
    return apiinstance.post("/auth/login", data);
}

export const googleLogin = (data) => {
    return apiinstance.post("/auth/google", data);
}

export const signup = (data) => {
    return apiinstance.post("/auth/signup", data);
}

export const checkAuth = (config) => {
    return apiinstance.get("/auth/me",config);
}