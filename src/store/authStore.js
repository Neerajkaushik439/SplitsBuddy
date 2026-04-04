import { create } from "zustand";
import { login as loginApi, signup as signupApi,checkAuth as checkAuthApi } from "@/api/auth";
import axios from "axios";

export const authStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isloading:true,

  login: async (email, password) => {
   
    const res = await loginApi({email, password});
    localStorage.setItem("token", res.data.token);

    set({
      user: res.data.user,
      isAuthenticated: true,
      isloading:false,
    });
    return res.data.user;
  },

  googleLogin: async (data) => {
    const { googleLogin: googleLoginApi } = await import("@/api/auth");
    const res = await googleLoginApi(data);
    localStorage.setItem("token", res.data.token);

    set({
      user: res.data.user,
      isAuthenticated: true,
      isloading: false,
    });
    return res.data.user;
  },

  signup: async (name, email, password) => {
    const res = await signupApi(name, email, password);
    localStorage.setItem("token", res.data.token);

    set({
      user: res.data.user,
      isAuthenticated: true,
      isloading:false,
    });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, isAuthenticated: false });
  },

  checkAuth:async ()=>{
    const token=localStorage.getItem('token')
    if(!token){
      set({user:null,isloading:false})
      return; 
    }
    try{
      const res=await checkAuthApi({
        headers:{
          Authorization:`Bearer ${token}` 
        },
      });
      set({ user: res.data.user,isloading:false });
      // console.log(res.data.user);
    }catch(err){
      console.log(err)
      localStorage.removeItem('token')
      set({user:null,isloading:false})
    }
  },  
}));
