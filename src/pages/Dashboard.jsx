import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Users, TrendingUp, TrendingDown, Wallet, ArrowRight, LogOut, UserPlus } from "lucide-react";
import { FloatingDoodles } from "@/components/mascots/FloatingDoodles";
import { BuddyBear } from "@/components/mascots/BuddyBear";
import { PennyPiggy } from "@/components/mascots/PennyPiggy";
import { CuteButton } from "@/components/ui/CuteButton";
import { CuteCard } from "@/components/ui/CuteCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { dashboardStore } from "@/store/dashboardStore";
import { authStore } from "@/store/authStore";
import NotificationDropdown  from "@/components/ui/NotificationDropdown";
import useNotificationStore from "@/store/notificationStore";
import { useEffect } from "react";
const Dashboard = () => { 
  const { dashboard, loading, fetchDashboard } = dashboardStore();
  const { fetchNotifications, unreadCount } = useNotificationStore();
  const { user ,logout} = authStore();
  const navigate = useNavigate();
 
useEffect(() => {
  console.log('Fetching dashboard...');
  fetchDashboard();
  fetchNotifications();

  const interval = setInterval(() => {
    fetchNotifications();
  }, 10000); // 10 sec

  return () => clearInterval(interval);
}, []);

if (loading) {
  return <div>Loading dashboard...</div>;
}

const currentUser = user; 
const groups = dashboard?.data?.groups || [];
console.log(dashboard);
  const formatAmount = (amount) => {
    return Intl.NumberFormat("en-IN", {
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(amount);
  };
  // Calculate balances
  const youOwe = dashboard?.data.totalYouOwe || 0;
  console.log(dashboard);  
  const theyOwe = dashboard?.data.totalYouAreOwed || 0;
  
  // frontend pe simple calc OK
  const netBalance = theyOwe - youOwe;


  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen w-full bg-background p-4 md:p-8 relative overflow-x-hidden flex flex-col items-center">
      <FloatingDoodles />

      <motion.div
        className="w-full max-w-6xl relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.header
          className="flex items-center justify-between mb-8"
          variants={itemVariants}
        >
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: [-3, 3, -3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <BuddyBear size={60} mood="happy" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-black text-foreground">
                Hi, {currentUser?.name?.split(" ")[0] || "Buddy"}! 👋
              </h1>
              <p className="text-muted-foreground font-medium">
                Let's check your balances
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <NotificationDropdown />
            <ThemeToggle />
            <CuteButton variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut size={18} />
              Logout
            </CuteButton>
          </div>
        </motion.header>

        {/* Balance Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          variants={itemVariants}
        >
          <CuteCard variant="pink">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-secondary-foreground/70 mb-1">You Owe</p>
                <p className="text-3xl font-black text-foreground">
                  ${youOwe.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-secondary rounded-2xl">
                <TrendingDown className="text-secondary-foreground" size={24} />
              </div>
            </div>
          </CuteCard>

          <CuteCard variant="mint">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-mint-foreground/70 mb-1">You're Owed</p>
                <p className="text-3xl font-black text-foreground">
                  {formatAmount(theyOwe.toFixed(2))}
                </p>
              </div>
              <div className="p-3 bg-mint rounded-2xl">
                <TrendingUp className="text-mint-foreground" size={24} />
              </div>
            </div>
          </CuteCard>

          <CuteCard variant={netBalance >= 0 ? "blue" : "yellow"}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-accent-foreground/70 mb-1">Net Balance</p>
                <p className={`text-3xl font-black ${netBalance >= 0 ? "text-mint" : "text-destructive"}`}>
                {`${netBalance >= 0 ? "+" : "-"}${formatAmount(Math.abs(netBalance).toFixed(2))}`}
                </p>
              </div>
              <div className="p-3 bg-accent rounded-2xl">
                <Wallet className="text-accent-foreground" size={24} />
              </div>
            </div>
          </CuteCard>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="flex flex-wrap gap-3 mb-8"
          variants={itemVariants}
        >
          <CuteButton variant="secondary" onClick={() => navigate("/create-group")}>
            <Users size={20} />
            Create Group
          </CuteButton>
          <CuteButton variant="accent" onClick={() => navigate("/add-expense")}>
            <Plus size={20} />
            Add Expense
            </CuteButton>
          <CuteButton variant="mint" onClick={() => navigate("/friends")}>
            <UserPlus size={20} />
            Friends
          </CuteButton>
        </motion.div>

        {/* Groups Section */}
        <motion.section variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-black text-foreground">Your Groups</h2>
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <PennyPiggy size={50} />
            </motion.div>
          </div>

          {groups.length === 0 ? (
            <EmptyState
              title="No groups yet!"
              description="Create your first group to start splitting expenses with friends."
              action={
                <CuteButton variant="secondary" onClick={() => navigate("/create-group")}>
                  <Plus size={20} />
                  Create Your First Group
                </CuteButton>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groups.map((group, index) => (
                <motion.div
                  key={group.groupId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CuteCard
                    variant={["pink", "blue", "mint", "yellow"][index % 4]}
                    className="cursor-pointer"
                    onClick={() => navigate(`/group/${group.groupId}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{group.groupName}</h3>
                        <p className="text-muted-foreground text-sm">{group.description}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <div className="flex -space-x-2">
                            {group.membersPreview.slice(0, 3).map((member, i) => (
                              <div
                                key={member.id}
                                className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold border-2 border-card"
                              >
                                {member.name.charAt(0)}
                              </div>
                            ))}
                            {group.membersPreview.length > 3 && (
                              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold border-2 border-card">
                                +{group.membersPreview.length - 3}
                              </div>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {group.membersPreview.length} members
                          </span>
                        </div>
                      </div>
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="p-3 bg-card/50 rounded-full"
                      >
                        <ArrowRight size={20} className="text-foreground" />
                      </motion.div>
                    </div>
                  </CuteCard>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </motion.div>
    </div>
  );
};

export default Dashboard;

