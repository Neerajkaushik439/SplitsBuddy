import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, DollarSign, User, Calendar,Trash2,Handshake } from "lucide-react";
import { FloatingDoodles } from "@/components/mascots/FloatingDoodles";
import { PennyPiggy } from "@/components/mascots/PennyPiggy";
import { CuteButton } from "@/components/ui/CuteButton";
import { CuteCard } from "@/components/ui/CuteCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { CuteTag } from "@/components/ui/CuteTag";
import { AlertDialog,AlertDialogTrigger,AlertDialogContent,AlertDialogHeader,AlertDialogTitle,AlertDialogDescription,
  AlertDialogFooter,AlertDialogAction,AlertDialogCancel} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";
import { authStore } from "@/store/authStore";
import { dashboardStore } from "@/store/dashboardStore";
import { expenseStore } from "@/store/expenseStore";

const GroupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = authStore();
  const { dashboard, fetchDashboard } = dashboardStore();
  const { groupExpenses, fetchGroupExpenses,loading,deleteExpense } = expenseStore();
  // const [group, setGroup] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  useEffect(() => {
    if (!dashboard) {
      fetchDashboard();
    }
  }, [dashboard]);

  const groups = dashboard?.data?.groups || [];
  const group = groups.find((g) => g.groupId === id);

  useEffect(() => {
    if (!dashboard) {
      fetchDashboard();
    }
    if(group){
      setInitializing(false);
    }
  }, [dashboard,group]);
 
  useEffect(() => {
    if (id) fetchGroupExpenses(id);
  }, [id]);
  // useEffect(() => {
  //   if (!id) return;
  
  //   // dashboard abhi nahi aaya...
  //   if (!dashboard?.data?.groups) return;

  //   fetchGroupExpenses(id);
  
  //   const g = dashboard.data.groups.find(gr => gr.groupId === id);
  
  //   if (g) {
  //     setGroup({
  //       groupId: g.groupId,
  //       groupName: g.groupName,
  //       description: g.description,
  //       membersPreview: g.membersPreview || [],
  //     });
  //   }
  
  //   setInitializing(false);
  // }, [id, dashboard]);
  
  // useEffect(() => {
  //   if (!group) return;
  
  //   setGroup((prev) => ({
  //     ...prev,
  //     expenses: groupExpenses.map((e) => ({
  //       id: e._id,
  //       title: e.title,
  //       amount: e.amount,
  //       paidBy: e.paidBy._id,
  //       split: e.split.map(s => s.userId._id),
  //       date: new Date(e.createdAt).toLocaleDateString(),
  //     })),
  //   }));
  // }, [groupExpenses]);  

if (initializing) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      Loading group...
    </div>
  );
}
  if (!group) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <EmptyState
          title="Group not found"
          description="This group doesn't exist or you don't have access to it."
          action={
            <CuteButton variant="secondary" onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </CuteButton>
          }
        />
      </div>
    );
  }

  // Calculate member balances
  const calculateMemberBalances = () => {
    const balances = {};
  
    // initialize all members
    group.membersPreview.forEach(member => {
      balances[member._id] = 0;
    });
  
    groupExpenses.forEach(expense => {
  
      const payerId = expense.paidBy._id;
  
      // 1️⃣ credit payer full amount
      balances[payerId] += expense.amount;
  
      // 2️⃣ debit split users
      expense.split.forEach(s => {
        const memberId = s.userId._id;
        balances[memberId] -= s.share;
      });
  
    });
  
    return balances;
  };
  const balances = calculateMemberBalances();
  const totalExpenses = groupExpenses.reduce((sum, e) => sum + e.amount, 0);
  const tagVariants = ["pink", "blue", "mint", "yellow"];

  return (
    <div className="min-h-screen w-full bg-background p-4 md:p-8 relative overflow-x-hidden flex flex-col items-center">
      <FloatingDoodles />

      <motion.div
        className="w-full max-w-6xl relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Header */}
        <motion.header
          className="flex items-center gap-4 mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <CuteButton variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft size={20} />
          </CuteButton>
          <div className="flex-1">
            <h1 className="text-3xl font-black text-foreground">{group.groupName}</h1>
            <p className="text-muted-foreground">{group.description}</p>
          </div>
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <PennyPiggy size={60} hasCoins />
          </motion.div>
        </motion.header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <CuteCard variant="yellow">
              <p className="text-sm font-bold text-foreground/70 mb-1">Total Expenses</p>
              <p className="text-3xl font-black text-foreground">${totalExpenses.toFixed(2)}</p>
            </CuteCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CuteCard variant="pink">
              <p className="text-sm font-bold text-foreground/70 mb-1">Transactions</p>
              <p className="text-3xl font-black text-foreground">{groupExpenses.length}</p>
            </CuteCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <CuteCard variant="blue">
              <p className="text-sm font-bold text-foreground/70 mb-1">Members</p>
              <p className="text-3xl font-black text-foreground">{group.membersPreview.length}</p>
            </CuteCard>
          </motion.div>
        </div>

        {/* Add Expense Button && SettleUp Button */}
        <motion.div
          className="mb-8 gap-3 flex flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <CuteButton
            variant="secondary"
            size="lg"
            onClick={() => navigate(`/add-expense?groupId=${group.groupId}`)}
          >
            <Plus size={20} />
            Add Expense
          </CuteButton>

          <CuteButton
            variant="mint"
            size="lg"
            onClick={() => navigate(`/settle-up?groupId=${group.groupId}`)}
          >
            <Handshake size={20} />
            Settle Up
          </CuteButton>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Member Balances */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-black text-foreground mb-4 flex items-center gap-2">
              <User size={24} />
              Member Balances
            </h2>
            <CuteCard variant="default" className="space-y-3">
              {group.membersPreview.map((member, index) => {
                const balance = balances[member._id] || 0;
                const isPositive = balance >= 0;
                
                return (
                  <motion.div
                    key={member._id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-muted/50"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        ["bg-secondary", "bg-accent", "bg-mint", "bg-primary"][index % 4]
                      }`}>
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">
                          {member.name}
                          {member._id === currentUser?.id && " (You)"}
                        </p>
                      </div>
                    </div>
                    <CuteTag variant={isPositive ? "mint" : "pink"}>
                      {isPositive ? "+" : ""}{balance.toFixed(2)}
                    </CuteTag>
                  </motion.div>
                );
              })}
            </CuteCard>
          </motion.section>

          {/* Expenses List */}
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-black text-foreground mb-4 flex items-center gap-2">
              <DollarSign size={24} />
              Expenses
            </h2>
            
            {groupExpenses.length === 0 ? (
              <CuteCard variant="default">
                <EmptyState
                  title="No expenses yet!"
                  description="Add your first expense to start tracking."
                  action={
                    <CuteButton
                      variant="mint"
                      size="sm"
                      onClick={() => navigate(`/add-expense?groupId=${group.groupId}`)}
                    >
                      <Plus size={16} />
                      Add Expense
                    </CuteButton>
                  }
                />
              </CuteCard>
            ) : (
              <div className="space-y-3">
                {groupExpenses.map((expense, index) => {
                  const payer = group.membersPreview.find(m => m._id === expense.paidBy._id);
                  return (
                    <motion.div
                      key={expense._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <CuteCard
                        variant={tagVariants[index % tagVariants.length]}
                        className="!p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-card flex items-center justify-center">
                              <DollarSign size={24} className="text-foreground" />
                            </div>
                            <div>
                              <p className="font-bold text-foreground">{expense.title}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>Paid by {payer?.name || "Unknown"}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Calendar size={12} />
                                  {expense.createdAt.split("T")[0].slice(0, 10)}
                                </span>
                              </div>
                            </div>
                          </div>
                          {/* <div className="text-right">
                            <p className="text-xl font-black text-foreground">
                              ${expense.amount.toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Split by {expense.split.length}
                            </p> */}
                            <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-xl font-black text-foreground">
                                ${expense.amount.toFixed(2)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Split by {expense.split.length}
                              </p>
                            </div>
                            <AlertDialog 
                              open={expenseToDelete === expense._id} 
                              onOpenChange={(open) => setExpenseToDelete(open ? expense._id : null)}
                            >
                              <AlertDialogTrigger asChild>
                                <button
                                  className="p-2 rounded-xl hover:bg-destructive/10 transition-colors group"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpenseToDelete(expense._id);
                                  }}
                                >
                                  <Trash2 size={18} className="text-muted-foreground group-hover:text-destructive transition-colors" />
                                </button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-card border-2 border-border rounded-3xl">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-xl font-black">Delete "{expense.title}"?</AlertDialogTitle>
                                  <AlertDialogDescription className="text-muted-foreground">
                                    This will permanently remove this expense from the group. This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => {
                                      console.log("Deleting expense with ID:", expense._id);
                                      console.log("Group ID:", group.groupId);
                                      deleteExpense(expense._id)
                                        .then(() => {
                                          console.log("Expense deleted successfully");
                                          fetchGroupExpenses(group.groupId);
                                        })
                                        .catch((error) => {
                                          console.error("Error deleting expense:", error);
                                        });
                                      setExpenseToDelete(null);
                                    }}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full"
                                  >
                                    Delete Expense
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CuteCard>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.section>
        </div>
      </motion.div>
    </div>
  );
};

export default GroupDetails;
