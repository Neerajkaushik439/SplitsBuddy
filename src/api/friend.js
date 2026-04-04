import apiinstance from "./axios";

export const addfriendbyemail = async (email) => {
 
        const res= await apiinstance.post("/friends/addfriendbyemail", {email});
        return res.data;
}
export const getpendingreq=async()=>{
    const res=await apiinstance.get("/friends/pendingrequests");
    return res.data;
}
export const acceptfriendreq=async(id)=>{
    const res=await apiinstance.put(`/friends/acceptfriendrequest/${id}`);

    return res.data;
}

export const getallfriends=async()=>{
    const res=await apiinstance.get("/friends/getallfriends");
    return res;
}

export const removefriend=async(friendId)=>{
    const res=await apiinstance.delete(`/friends/removefriend/${friendId}`);
    return res.data;
}

