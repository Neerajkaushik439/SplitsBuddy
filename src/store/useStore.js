import { create } from 'zustand';

// Sample users for demo
const sampleUsers = [
  { id: '1', name: 'Buddy Bear', email: 'buddy@splitbuddy.com' },
  { id: '2', name: 'Penny Piggy', email: 'penny@splitbuddy.com' },
  { id: '3', name: 'Charlie Chick', email: 'charlie@splitbuddy.com' },
  { id: '4', name: 'Danny Duck', email: 'danny@splitbuddy.com' },
  { id: '5', name: 'Fiona Fox', email: 'fiona@splitbuddy.com' },
];

// Sample notifications
const sampleNotifications = [
  {
    id: 'n1',
    type: 'expense_added',
    title: 'New Expense Added',
    message: 'Penny Piggy added "Groceries" ($120) in Weekend Trip 🏖️',
    groupId: '1',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
  },
  {
    id: 'n2',
    type: 'expense_added',
    title: 'New Expense Added',
    message: 'Charlie Chick added "Gas" ($60) in Weekend Trip 🏖️',
    groupId: '1',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: 'n3',
    type: 'member_joined',
    title: 'New Member',
    message: 'Danny Duck joined Roommates 🏠',
    groupId: '2',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
];

// Sample data
const sampleGroups = [
  {
    id: '1',
    name: 'Weekend Trip 🏖️',
    description: 'Beach vacation expenses',
    members: [sampleUsers[0], sampleUsers[1], sampleUsers[2]],
    expenses: [
      { id: 'e1', title: 'Beach House Rental', amount: 450, paidBy: '1', splitBetween: ['1', '2', '3'], date: '2024-01-15', groupId: '1' },
      { id: 'e2', title: 'Groceries', amount: 120, paidBy: '2', splitBetween: ['1', '2', '3'], date: '2024-01-16', groupId: '1' },
      { id: 'e3', title: 'Gas', amount: 60, paidBy: '3', splitBetween: ['1', '2', '3'], date: '2024-01-15', groupId: '1' },
    ],
    createdAt: '2024-01-14',
  },
  {
    id: '2',
    name: 'Roommates 🏠',
    description: 'Monthly apartment expenses',
    members: [sampleUsers[0], sampleUsers[3]],
    expenses: [
      { id: 'e4', title: 'Electricity Bill', amount: 85, paidBy: '1', splitBetween: ['1', '4'], date: '2024-01-20', groupId: '2' },
      { id: 'e5', title: 'Internet', amount: 50, paidBy: '4', splitBetween: ['1', '4'], date: '2024-01-22', groupId: '2' },
    ],
    createdAt: '2024-01-01',
  },
  {
    id: '3',
    name: 'Foodie Friends 🍕',
    description: 'Restaurant adventures',
    members: [sampleUsers[0], sampleUsers[1], sampleUsers[4]],
    expenses: [
      { id: 'e6', title: 'Pizza Night', amount: 45, paidBy: '5', splitBetween: ['1', '2', '5'], date: '2024-01-25', groupId: '3' },
    ],
    createdAt: '2024-01-20',
  },
];

const useStoreBase = create((set, get) => ({
  currentUser: null,
  groups: [],
  notifications: [],
  isAuthenticated: false,

  // login: (email, password) => {
  //   // Simulate login - in real app, this would call an API
  //   const user = sampleUsers.find(u => u.email === email) || {
  //     id: '1',
  //     name: 'Buddy Bear',
  //     email: email,
  //   };
  //   set({ currentUser: user, isAuthenticated: true, groups: sampleGroups, notifications: sampleNotifications });
  // },

  // signup: (name, email, password) => {
  //   const newUser = {
  //     id: Date.now().toString(),
  //     name,
  //     email,
  //   };
  //   set({ currentUser: newUser, isAuthenticated: true, groups: [], notifications: [] });
  // },

  // logout: () => {
  //   set({ currentUser: null, isAuthenticated: false, groups: [], notifications: [] });
  // },

  createGroup: (name, description, members) => {
    const currentUser = get().currentUser;
    if (!currentUser) return;

    const newGroup = {
      id: Date.now().toString(),
      name,
      description,
      members: [currentUser, ...members],
      expenses: [],
      createdAt: new Date().toISOString().split('T')[0],
    };

    set(state => ({ groups: [...state.groups, newGroup] }));
  },

  addExpense: (groupId, expense) => {
    const currentUser = get().currentUser;
    const group = get().getGroupById(groupId);
    
    const newExpense = {
      ...expense,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      groupId,
    };

    // Create notification for all group members (except the one who added)
    const notification = {
      id: `n-${Date.now()}`,
      type: 'expense_added',
      title: 'New Expense Added',
      message: `${currentUser?.name || 'Someone'} added "${expense.title}" ($${expense.amount}) in ${group?.name || 'a group'}`,
      groupId,
      read: false,
      createdAt: new Date().toISOString(),
    };

    set(state => ({
      groups: state.groups.map(g =>
        g.id === groupId
          ? { ...g, expenses: [...g.expenses, newExpense] }
          : g
      ),
      notifications: [notification, ...state.notifications],
    }));
  },

  getGroupById: (id) => {
    return get().groups.find(group => group.id === id);
  },

  // Notification actions
  markNotificationAsRead: (notificationId) => {
    set(state => ({
      notifications: state.notifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      ),
    }));
  },

  markAllNotificationsAsRead: () => {
    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, read: true })),
    }));
  },

  clearNotification: (notificationId) => {
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== notificationId),
    }));
  },

  addNotification: (notification) => {
    const newNotification = {
      ...notification,
      id: `n-${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    set(state => ({
      notifications: [newNotification, ...state.notifications],
    }));
  },
  recordPayment: (groupId, payment) => {
    const currentUser = get().currentUser;
    const group = get().getGroupById(groupId);
    
    // Create a settlement expense (negative expense that cancels out debt)
    const settlementExpense = {
      id: `settlement-${Date.now()}`,
      title: `Settlement Payment`,
      amount: payment.amount,
      paidBy: payment.from,
      splitBetween: [payment.to],
      date: new Date().toISOString().split('T')[0],
      groupId,
      isSettlement: true,
    };
    // Create notification
    const fromMember = group?.members.find(m => m.id === payment.from);
    const toMember = group?.members.find(m => m.id === payment.to);
    
    const notification = {
      id: `n-${Date.now()}`,
      type: 'payment_recorded',
      title: 'Payment Recorded',
      message: `${fromMember?.name || 'Someone'} paid $${payment.amount.toFixed(2)} to ${toMember?.name || 'someone'} in ${group?.name || 'a group'}`,
      groupId,
      read: false,
      createdAt: new Date().toISOString(),
    };
    set(state => ({
      groups: state.groups.map(g =>
        g.id === groupId
          ? { ...g, expenses: [...g.expenses, settlementExpense] }
          : g
      ),
      notifications: [notification, ...state.notifications],
    }));
  },
}));

// Export the store directly - Zustand v5 handles this correctly
export const useStore = useStoreBase;

// Helper to get available users for adding to groups
export const getAvailableUsers = () => sampleUsers;
