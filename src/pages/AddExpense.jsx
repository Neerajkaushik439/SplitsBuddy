import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, DollarSign, Check, Sparkles, Coins } from "lucide-react";
import { FloatingDoodles } from "@/components/mascots/FloatingDoodles";
import { BuddyBear } from "@/components/mascots/BuddyBear";
import { PennyPiggy } from "@/components/mascots/PennyPiggy";
import { CuteButton } from "@/components/ui/CuteButton";
import { CuteInput } from "@/components/ui/CuteInput";
import { CuteCard } from "@/components/ui/CuteCard";
import { CuteTag } from "@/components/ui/CuteTag";
import { authStore } from "@/store/authStore";
import { dashboardStore } from "@/store/dashboardStore";
import { expenseStore } from "@/store/expenseStore";
import { toast } from "sonner";

const AddExpense = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const groupIdFromUrl = searchParams.get("groupId");
  const {currentUser } = authStore();
const { dashboard } = dashboardStore();
const { addExpense, loading } = expenseStore();
  
  const [selectedGroupId, setSelectedGroupId] = useState(groupIdFromUrl || "");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState(currentUser?.id || "");
  const [splitBetween, setSplitBetween] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const groups = dashboard?.data?.groups || [];
  console.log(groups);
const selectedGroup = groups.find(
  g => String(g.groupId) === String(selectedGroupId)
);
  const tagVariants = ["pink", "blue", "mint", "yellow"];

  useEffect(() => {
    if (selectedGroup && currentUser) {
      // Auto-select all members including current user
      setSplitBetween(selectedGroup.membersPreview.map(m => m._id));
      setPaidBy(currentUser.id);
    }
  }, [selectedGroup, currentUser]);

  const toggleSplitMember = (memberId) => {
    if (splitBetween.includes(memberId)) {
      setSplitBetween(splitBetween.filter(id => id !== memberId));
    } else {
      setSplitBetween([...splitBetween, memberId]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedGroupId) return toast.error("Select group");
    if (!title.trim()) return toast.error("Enter title");
    if (!amount || amount <= 0) return toast.error("Invalid amount");
    if (splitBetween.length === 0) return toast.error("Select members");
  
    const perHeadShare = Number(amount) / splitBetween.length;

    const splitPayload = splitBetween.map(userId => ({
      userId,
      share: perHeadShare,
    }));
    
    const payload = {
      groupId: selectedGroupId,
      title,
      amount: Number(amount),
      paidBy,
      split: splitPayload,
    };    
  
    await addExpense(payload, navigate, groupIdFromUrl);
  };
  
  const splitAmount = amount && splitBetween.length > 0
    ? (parseFloat(amount) / splitBetween.length).toFixed(2)
    : "0.00";

  return (
    <div className="min-h-screen w-full bg-background p-4 md:p-8 relative overflow-x-hidden flex flex-col items-center">
      <FloatingDoodles />

      {/* Success Animation Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], y: [0, -20, 0] }}
                transition={{ duration: 0.6 }}
              >
                <PennyPiggy size={150} hasCoins />
              </motion.div>
              <motion.h2
                className="text-3xl font-black text-foreground mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Expense Added! 🎉
              </motion.h2>
              
              {/* Floating coins animation */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  initial={{
                    x: "50%",
                    y: "50%",
                    scale: 0,
                    opacity: 1
                  }}
                  animate={{
                    x: `${50 + (Math.random() - 0.5) * 100}%`,
                    y: `${50 + (Math.random() - 0.5) * 100}%`,
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    rotate: Math.random() * 360
                  }}
                  transition={{
                    duration: 1,
                    delay: i * 0.1
                  }}
                >
                  <Coins className="text-primary" size={32} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="w-full max-w-3xl relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Header */}
        <motion.header
          className="flex items-center gap-4 mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <CuteButton
            variant="ghost"
            size="sm"
            onClick={() => navigate(groupIdFromUrl ? `/group/${groupIdFromUrl}` : "/dashboard")}
          >
            <ArrowLeft size={20} />
          </CuteButton>
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <BuddyBear size={50} mood="thinking" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-black text-foreground">Add Expense</h1>
              <p className="text-muted-foreground text-sm">Let's split this bill!</p>
            </div>
          </div>
        </motion.header>

        <div className="space-y-6">
          {/* Select Group (if not from URL) */}
          {!groupIdFromUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <CuteCard variant="pink">
                <h2 className="text-lg font-bold mb-4">Select Group</h2>
                <div className="flex flex-wrap gap-2">
                  {groups.map((group, index) => (
                    <motion.button
                      key={group.groupId}
                      className={`px-4 py-2 rounded-full font-bold transition-all ${
                        selectedGroupId === group.groupId
                          ? "bg-secondary text-secondary-foreground shadow-cute"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                      onClick={() => setSelectedGroupId(group.groupId)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {group.groupName}
                    </motion.button>
                  ))}
                </div>
              </CuteCard>
            </motion.div>
          )}

          {/* Expense Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <CuteCard variant="yellow">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <DollarSign size={20} />
                Expense Details
              </h2>
              <div className="space-y-4">
                <CuteInput
                  label="What's this expense for?"
                  placeholder="Pizza Night 🍕"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <CuteInput
                  label="Amount"
                  type="number"
                  placeholder="0.00"
                  icon={<DollarSign size={20} />}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </CuteCard>
          </motion.div>

          {/* Paid By */}
          {selectedGroup && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CuteCard variant="blue">
                <h2 className="text-lg font-bold mb-4">Who paid?</h2>
                <div className="flex flex-wrap gap-2">
                  {selectedGroup.membersPreview.map((member, index) => (
                    <motion.button
                      key={member._id}
                      className={`px-4 py-2 rounded-full font-bold transition-all flex items-center gap-2 ${
                        paidBy === member._id
                          ? "bg-accent text-accent-foreground shadow-cute"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                      onClick={() => setPaidBy(member._id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        ["bg-secondary", "bg-primary", "bg-mint", "bg-accent"][index % 4]
                      }`}>
                        {member.name.charAt(0)}
                      </span>
                      {member.name}
                      {member._id === currentUser?.id && " (You)"}
                    </motion.button>
                  ))}
                </div>
              </CuteCard>
            </motion.div>
          )}

          {/* Split Between */}
          {selectedGroup && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CuteCard variant="mint">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">Split between</h2>
                  {amount && splitBetween.length > 0 && (
                    <CuteTag variant="mint">
                      ${splitAmount} each
                    </CuteTag>
                  )}
                </div>
                <div className="space-y-2">
                  {selectedGroup.membersPreview.map((member, index) => {
                    const isSelected = splitBetween.includes(member._id);
                    return (
                      <motion.button
                        key={member._id}
                        className={`w-full p-3 rounded-2xl flex items-center justify-between transition-all ${
                          isSelected
                            ? "bg-mint/50 border-2 border-mint"
                            : "bg-card border-2 border-transparent hover:border-border"
                        }`}
                        onClick={() => toggleSplitMember(member._id)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                            tagVariants[index % tagVariants.length] === "pink" ? "bg-secondary" :
                            tagVariants[index % tagVariants.length] === "blue" ? "bg-accent" :
                            tagVariants[index % tagVariants.length] === "mint" ? "bg-mint" : "bg-primary"
                          }`}>
                            {member.name.charAt(0)}
                          </div>
                          <span className="font-bold text-foreground">
                            {member.name}
                            {member._id === currentUser?.id && " (You)"}
                          </span>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected ? "bg-mint border-mint" : "border-border"
                        }`}>
                          {isSelected && <Check size={14} className="text-mint-foreground" />}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </CuteCard>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <CuteButton
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={handleSubmit}
              disabled={loading || !selectedGroupId}
            >
              {isSubmitting ? (
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                </motion.span>
              ) : (
                <>
                  <Sparkles size={20} />
                  {loading ? "Adding..." : "Add Expense"}
                </>
              )}
            </CuteButton>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AddExpense;
// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { ArrowLeft, DollarSign, Check, Sparkles, Coins } from "lucide-react";
// import { FloatingDoodles } from "@/components/mascots/FloatingDoodles";
// import { BuddyBear } from "@/components/mascots/BuddyBear";
// import { PennyPiggy } from "@/components/mascots/PennyPiggy";
// import { CuteButton } from "@/components/ui/CuteButton";
// import { CuteInput } from "@/components/ui/CuteInput";
// import { CuteCard } from "@/components/ui/CuteCard";
// import { CuteTag } from "@/components/ui/CuteTag";
// import { authStore } from "@/store/authStore";
// import { dashboardStore } from "@/store/dashboardStore";
// import { expenseStore } from "@/store/expenseStore";
// import { toast } from "sonner";

// const AddExpense = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const groupIdFromUrl = searchParams.get("groupId");

//   const { currentUser } = authStore();
//   const { dashboard } = dashboardStore();
//   const { addExpense, loading } = expenseStore();

//   const [selectedGroupId, setSelectedGroupId] = useState(groupIdFromUrl || "");
//   const [title, setTitle] = useState("");
//   const [amount, setAmount] = useState("");
//   const [paidBy, setPaidBy] = useState("");
//   const [splitBetween, setSplitBetween] = useState([]);

//   const groups = dashboard?.data?.groups || [];

//   const selectedGroup = groups.find(
//     g => g.groupId.toString() === selectedGroupId
//   );

//   const tagVariants = ["pink", "blue", "mint", "yellow"];

//   useEffect(() => {
//     if (selectedGroup && currentUser) {
//       setSplitBetween(
//         selectedGroup.membersPreview.map(m => m._id)
//       );
//       setPaidBy(currentUser.id);
//     }
//   }, [selectedGroup, currentUser]);

//   const toggleSplitMember = (memberId) => {
//     setSplitBetween(prev =>
//       prev.includes(memberId)
//         ? prev.filter(id => id !== memberId)
//         : [...prev, memberId]
//     );
//   };

//   const handleSubmit = async () => {
//     if (!selectedGroupId) return toast.error("Select group");
//     if (!title.trim()) return toast.error("Enter title");
//     if (!amount || amount <= 0) return toast.error("Invalid amount");
//     if (splitBetween.length === 0) return toast.error("Select members");

//     await addExpense(
//       {
//         groupId: selectedGroupId,
//         title,
//         amount: Number(amount),
//         paidBy,
//         split: splitBetween,
//       },
//       navigate,
//       groupIdFromUrl
//     );
//   };

//   const splitAmount =
//     amount && splitBetween.length > 0
//       ? (amount / splitBetween.length).toFixed(2)
//       : "0.00";

//   return (
//     <div className="min-h-screen w-full bg-background p-4 md:p-8 flex justify-center">
//       <FloatingDoodles />

//       <div className="w-full max-w-3xl">
//         {/* Header */}
//         <div className="flex items-center gap-4 mb-8">
//           <CuteButton
//             variant="ghost"
//             size="sm"
//             onClick={() =>
//               navigate(groupIdFromUrl ? `/group/${groupIdFromUrl}` : "/dashboard")
//             }
//           >
//             <ArrowLeft size={20} />
//           </CuteButton>

//           <div className="flex items-center gap-3">
//             <BuddyBear size={50} mood="thinking" />
//             <div>
//               <h1 className="text-2xl font-black">Add Expense</h1>
//               <p className="text-muted-foreground text-sm">
//                 Let's split this bill!
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Select Group */}
//         {!groupIdFromUrl && (
//           <CuteCard variant="pink">
//             <h2 className="font-bold mb-3">Select Group</h2>
//             <div className="flex flex-wrap gap-2">
//               {groups.map(group => (
//                 <button
//                   key={group.groupId}
//                   onClick={() => setSelectedGroupId(group.groupId)}
//                   className={`px-4 py-2 rounded-full font-bold ${
//                     selectedGroupId === group.groupId
//                       ? "bg-secondary"
//                       : "bg-muted"
//                   }`}
//                 >
//                   {group.groupName}
//                 </button>
//               ))}
//             </div>
//           </CuteCard>
//         )}

//         {/* Expense */}
//         <CuteCard variant="yellow" className="mt-6">
//           <CuteInput
//             label="Title"
//             value={title}
//             onChange={e => setTitle(e.target.value)}
//           />
//           <CuteInput
//             label="Amount"
//             type="number"
//             value={amount}
//             onChange={e => setAmount(e.target.value)}
//           />
//         </CuteCard>

//         {/* Paid By */}
//         {selectedGroup && (
//           <CuteCard variant="blue" className="mt-6">
//             <h2 className="font-bold mb-3">Who paid?</h2>
//             <div className="flex flex-wrap gap-2">
//               {selectedGroup.membersPreview.map((m, i) => (
//                 <button
//                   key={m._id}
//                   onClick={() => setPaidBy(m._id)}
//                   className={`px-4 py-2 rounded-full ${
//                     paidBy === m._id ? "bg-accent" : "bg-muted"
//                   }`}
//                 >
//                   {m.name}
//                   {m._id === currentUser?.id && " (You)"}
//                 </button>
//               ))}
//             </div>
//           </CuteCard>
//         )}

//         {/* Split */}
//         {selectedGroup && (
//           <CuteCard variant="mint" className="mt-6">
//             <h2 className="font-bold mb-3">
//               Split between ({splitAmount} each)
//             </h2>

//             {selectedGroup.membersPreview.map((m, i) => (
//               <button
//                 key={m._id}
//                 onClick={() => toggleSplitMember(m._id)}
//                 className={`w-full p-3 rounded-xl flex justify-between ${
//                   splitBetween.includes(m._id)
//                     ? "bg-mint/40"
//                     : "bg-card"
//                 }`}
//               >
//                 {m.name}
//                 {splitBetween.includes(m._id) && <Check size={16} />}
//               </button>
//             ))}
//           </CuteCard>
//         )}

//         {/* Submit */}
//         <CuteButton
//           className="w-full mt-6"
//           disabled={loading || !selectedGroupId}
//           onClick={handleSubmit}
//         >
//           <Sparkles size={20} />
//           {loading ? "Adding..." : "Add Expense"}
//         </CuteButton>
//       </div>
//     </div>
//   );
// };

// export default AddExpense;
