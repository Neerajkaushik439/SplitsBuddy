import {create}from 'zustand' 
import { getallfriends, getpendingreq } from '../api/friend';

const useFriendStore=create((set)=>({
    friends:[],
    incoming:[],
    sent:[],
    loading:false,

    // accpeted wala
    fetchFriends:async()=>{
        try{
            set({loading:true})
            const res=await getallfriends();
            console.log("Friends Response:", res.data);
            set({friends:res.data.friends})
        }catch(err){
            console.error("Failed to fetch friends",err)
        }finally{
            set({loading:false})
        }
    },
    // pending wala(incoming+sent)
    fetchPendingRequests:async()=>{
        try{
            set({loading:true})
            const res=await getpendingreq();
            console.log("Pending Requests Response:", res);
            set({
                incoming:res.incoming,
                sent:res.sent
            })
        }catch(err){
            console.error("Failed to fetch pending requests",err)
        }finally{
            set({loading:false})
        }
    },


  // ===== CLEAR STORE (LOGOUT PE) =====
  resetFriends: () => {
    set({
      friends: [],
      incoming: [],
      sent: [],
    });
  },
}));

export default useFriendStore;