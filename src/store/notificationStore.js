import { create } from 'zustand';
import apiinstance from '@/api/axios';

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,


  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiinstance.get('/notifications');
      const notifications = response.data.notifications || [];
      const unreadCount = notifications.filter((n) => !n.isRead).length;
      set({ notifications, unreadCount, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },


  markAsRead: async (id) => {
    try {
      await apiinstance.put(`/notifications/${id}/read`);
      const notifications = get().notifications.map((n) =>
        n._id === id ? { ...n, isRead: true } : n
      );
      const unreadCount = notifications.filter((n) => !n.isRead).length;
      set({ notifications, unreadCount });
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  },


  markAllAsRead:async () => {
    try{
      await apiinstance.put(`/notifications/readAll`);
      const notifications = get().notifications.map((n) => ({ ...n, isRead: true }));
      set({ notifications, unreadCount: 0 });
    }catch (error){
      console.error("Failed to mark all notifications as read", error);
    }
  },
}));

export default useNotificationStore;
