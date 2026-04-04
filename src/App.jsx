import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { authStore } from "@/store/authStore";
import LoginPage from "./pages/LoginPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CreateGroup from "./pages/CreateGroup.jsx";
import GroupDetails from "./pages/GroupDetails.jsx";
import AddExpense from "./pages/AddExpense.jsx";
import NotFound from "./pages/NotFound.jsx";
import SettleUp from "./pages/SettleUp.jsx";
import FriendsPage from "./pages/FriendPage.jsx";
import { useEffect } from "react";
const queryClient = new QueryClient();

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { user ,isloading } = authStore();
  if(isloading)return(<div>Loading...</div>);
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

function App() {
  const {checkAuth} = authStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/create-group"
              element={
                <ProtectedRoute>
                  <CreateGroup />
                </ProtectedRoute>
              }
            />

            <Route
              path="/group/:id"
              element={
                <ProtectedRoute>
                  <GroupDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/add-expense"
              element={
                <ProtectedRoute>
                  <AddExpense />
                  </ProtectedRoute>
          } />
            <Route path="/friends" element={
            <ProtectedRoute>
              <FriendsPage />
                </ProtectedRoute>
              }
            />
                <Route path="/settle-up" element={
            <ProtectedRoute>
              <SettleUp />
            </ProtectedRoute>
          } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
