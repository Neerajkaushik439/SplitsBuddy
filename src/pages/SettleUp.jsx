import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Wallet, Users } from "lucide-react";
import { CuteCard } from "@/components/ui/CuteCard";
import { CuteButton } from "@/components/ui/CuteButton";
import { authStore } from "@/store/authStore";
import { dashboardStore } from "@/store/dashboardStore";
import { FloatingDoodles } from "@/components/mascots/FloatingDoodles";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { settleupStore } from "@/store/settleupStore";  

const SettleUp = () => {
  const {
    getGroupById,
    recordPayment,
    initializeSettlement,
    balancesCache,
    settlementsCache,
    fetchSettlementPreview
  } = settleupStore();
  const { dashboard,fetchDashboard } = dashboardStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const groupId = searchParams.get("groupId");
  const {  currentUser } = authStore();
  const [selectedSettlement, setSelectedSettlement] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  useEffect(() => {
    if (!dashboard) {
      fetchDashboard();
    }
  }, [dashboard]);
  useEffect(() => {
  if (groupId) {
    fetchSettlementPreview(groupId);
  }
}, [groupId]);
 console.log("dwfwf",groupId)
 const groups = dashboard?.data?.groups || [];
 console.log("Dashboard data:", dashboard);
 console.log("Dashboard groups:", groups);
 const group = groups.find(g => g.groupId === groupId);
console.log("Group data:", group);
 
  
  const balances = balancesCache[groupId] || {};
  const settlements = settlementsCache[groupId] || [];
  const handleSettleUp = (settlement) => {
    setSelectedSettlement(settlement);
    setIsDialogOpen(true);
  };
  console.log("Balances:", balances);
console.log("Settlements:", settlements);
  const confirmSettlement = () => {
    if (!selectedSettlement) return;

    recordPayment(groupId, {
      from: selectedSettlement.from.id,
      to: selectedSettlement.to.id,
      amount: selectedSettlement.amount,
    });

    toast.success(
      `Payment of $${selectedSettlement.amount.toFixed(2)} recorded! 🎉`,
      { description: `${selectedSettlement.from.name} → ${selectedSettlement.to.name}` }
    );
    
    setIsDialogOpen(false);
    setSelectedSettlement(null);
  };
  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <CuteCard className="p-8 text-center">
          <p className="text-xl font-bold text-foreground">Group not found 😢</p>
          <CuteButton variant="primary" className="mt-4" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </CuteButton>
        </CuteCard>
      </div>
    );
  }

  const allSettled = settlements.length === 0;
  
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingDoodles />

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b-2 border-border"
      >
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/group/${groupId}`)}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <ArrowLeft size={24} className="text-foreground" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-foreground">Settle Up 💰</h1>
              <p className="text-sm text-muted-foreground">{group.name}</p>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-2xl mx-auto px-4 py-6 relative z-10 space-y-6">
        {/* Member Balances Summary */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
            <Users size={20} className="text-primary" />
            Member Balances
          </h2>
          <div className="grid gap-3">
            {Object.values(balances).map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <CuteCard className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">
                          {member.name}
                          {member.id === currentUser?.id && (
                            <span className="text-xs text-muted-foreground ml-2">(you)</span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Paid ${member.paid.toFixed(2)} · Owes ${member.owes.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className={`text-right ${
                      member.balance > 0.01 
                        ? "text-green-600 dark:text-green-400" 
                        : member.balance < -0.01 
                        ? "text-red-500 dark:text-red-400" 
                        : "text-muted-foreground"
                    }`}>
                      <p className="text-lg font-black">
                        {member.balance > 0.01 ? "+" : ""}${member.balance.toFixed(2)}
                      </p>
                      <p className="text-xs">
                        {member.balance > 0.01 ? "gets back" : member.balance < -0.01 ? "owes" : "settled"}
                      </p>
                    </div>
                  </div>
                </CuteCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Settlements */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
            <Wallet size={20} className="text-accent" />
            Suggested Payments
          </h2>

          {allSettled ? (
            <CuteCard className="p-8 text-center bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border-green-300 dark:border-green-700">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center"
              >
                <Check size={32} className="text-white" />
              </motion.div>
              <h3 className="text-xl font-black text-green-700 dark:text-green-300">All Settled Up! 🎉</h3>
              <p className="text-green-600 dark:text-green-400 mt-2">
                Everyone in this group is even. No payments needed!
              </p>
            </CuteCard>
          ) : (
            <div className="space-y-3">
              {settlements.map((settlement, index) => (
                <motion.div
                  key={`${settlement.from.id}-${settlement.to.id}`}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <CuteCard className="p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        {/* From */}
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-orange-400 flex items-center justify-center text-white font-bold">
                            {settlement.from.name.charAt(0)}
                          </div>
                          <span className="font-bold text-foreground hidden sm:inline">
                            {settlement.from.name}
                            {settlement.from.id === currentUser?.id && " (you)"}
                          </span>
                        </div>

                        {/* Arrow */}
                        <div className="flex-1 flex items-center justify-center">
                          <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
                            <span className="text-lg font-black text-foreground">
                              ${settlement.amount.toFixed(2)}
                            </span>
                            <ArrowRight size={16} className="text-primary" />
                          </div>
                        </div>

                        {/* To */}
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground hidden sm:inline">
                            {settlement.to.name}
                            {settlement.to.id === currentUser?.id && " (you)"}
                          </span>
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center text-white font-bold">
                            {settlement.to.name.charAt(0)}
                          </div>
                        </div>
                      </div>

                      <CuteButton
                        variant="primary"
                        size="sm"
                        className="ml-3"
                        onClick={() => handleSettleUp(settlement)}
                      >
                        Settle
                      </CuteButton>
                    </div>
                  </CuteCard>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-2 border-border rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black">Confirm Payment 💸</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Record this payment to settle up between group members.
            </DialogDescription>
          </DialogHeader>

          {selectedSettlement && (
            <div className="py-4">
              <div className="flex items-center justify-center gap-4 p-4 bg-muted rounded-2xl">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-red-400 to-orange-400 flex items-center justify-center text-white font-bold text-lg">
                    {selectedSettlement.from.name.charAt(0)}
                  </div>
                  <p className="mt-1 font-bold text-sm text-foreground">{selectedSettlement.from.name}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-primary">${selectedSettlement.amount.toFixed(2)}</p>
                  <ArrowRight size={24} className="mx-auto text-muted-foreground" />
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center text-white font-bold text-lg">
                    {selectedSettlement.to.name.charAt(0)}
                  </div>
                  <p className="mt-1 font-bold text-sm text-foreground">{selectedSettlement.to.name}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <CuteButton variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </CuteButton>
            <CuteButton variant="mint" onClick={confirmSettlement}>
              <Check size={18} />
              Confirm Payment
            </CuteButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettleUp;