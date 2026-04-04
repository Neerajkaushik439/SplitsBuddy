import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Users, DollarSign } from 'lucide-react';
import useNotificationStore from '@/store/notificationStore';
import { formatDistanceToNow } from 'date-fns';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead
  } = useNotificationStore();

  // ✅ FIXED: correct backend types
  const getIcon = (type) => {
    switch (type) {
      case 'EXPENSE_ADDED':
        return <DollarSign className="w-4 h-4 text-green-500" />;

      case 'PAYMENT_RECEIVED':
      case 'DEBT_SETTLED':
        return <DollarSign className="w-4 h-4 text-blue-500" />;

      case 'GROUP_INVITE':
        return <Users className="w-4 h-4 text-purple-500" />;

      default:
        return <Bell className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <div className="relative">
      {/* 🔔 Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full bg-card hover:bg-accent transition-colors border border-border"
      >
        <Bell className="w-5 h-5 text-foreground" />

        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white text-xs font-bold rounded-full flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-80 max-h-96 overflow-hidden bg-card border border-border rounded-2xl shadow-xl z-50"
            >
              {/* Header */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Notifications
                </h3>

                {notifications.length > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    Mark all read
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-72 overflow-y-auto scroll-smooth">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No notifications yet</p>
                  </div>
                ) : (
                  notifications.slice(0, 10).map((notification) => (
                    <motion.div
                      key={notification._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`relative p-4 border-b border-border hover:bg-accent/50 transition-colors cursor-pointer ${
                        !notification.isRead ? 'bg-primary/5' : ''
                      }`}
                      onClick={() => {
                        markAsRead(notification._id);
                        setIsOpen(false); // ✅ close dropdown
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className="p-2 rounded-full bg-background">
                          {getIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            {notification.sender?.name && (
                              <span className="font-bold">
                                {notification.sender.name}:{" "}
                              </span>
                            )}
                            {notification.message}
                          </p>

                          <p className="text-xs text-muted-foreground mt-2">
                            {formatDistanceToNow(
                              new Date(notification.createdAt),
                              { addSuffix: true }
                            )}
                          </p>
                        </div>
                      </div>

                      {/* 🔴 Unread dot */}
                      {!notification.isRead && (
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full" />
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
export default NotificationDropdown;