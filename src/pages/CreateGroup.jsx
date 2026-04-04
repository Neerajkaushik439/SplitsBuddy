import { useState,useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Users, FileText, ArrowLeft, Sparkles, Check } from "lucide-react";
import { FloatingDoodles } from "@/components/mascots/FloatingDoodles";
import { BuddyBear } from "@/components/mascots/BuddyBear";
import { CuteButton } from "@/components/ui/CuteButton";
import { CuteInput } from "@/components/ui/CuteInput";
import { CuteCard } from "@/components/ui/CuteCard";
import { CuteTag } from "@/components/ui/CuteTag";
import { groupStore } from "@/store/groupStore";
import { toast } from "sonner";
import { authStore } from "../store/authStore";
import useFriendStore from"../store/friendStore"

const CreateGroup = () => {
  const navigate = useNavigate();
  const {currentUser} = authStore();
  const { createGroup,loading} = groupStore();
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [step, setStep] = useState(1);

  const { friends, fetchFriends } = useFriendStore();
  useEffect(() => {
    fetchFriends();
  }, []);
  const availableUsers = friends;
  const tagVariants = ["pink", "blue", "mint", "yellow"];
  console.log("Available Users:", availableUsers);
  const toggleMember = (user) => {
    if (selectedMembers.find(m => m._id === user._id)) {
      setSelectedMembers(selectedMembers.filter(m => m._id !== user._id));
    } else {
      setSelectedMembers([...selectedMembers, user]);
    }
  };

  const handleSubmit = async () => {
    if (!groupName.trim()) {
      toast.error("Please enter a group name!");
      return;
    }

    
  await createGroup(
    {
      name: groupName,
      description,
      members: selectedMembers.map((member) => member._id),
    },
    navigate("/dashboard")
  );

  toast.success("Group created! 🎉");
};

  const nextStep = () => {
    if (step === 1 && !groupName.trim()) {
      toast.error("Please enter a group name first!");
      return;
    }
    setStep(step + 1);
  };

  return (
    <div className="min-h-screen w-full bg-background p-4 md:p-8 relative overflow-x-hidden flex flex-col items-center">
      <FloatingDoodles />

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
          <CuteButton variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft size={20} />
          </CuteButton>
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <BuddyBear size={50} mood="excited" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-black text-foreground">Create a Group</h1>
              <p className="text-muted-foreground text-sm">Let's gather your friends!</p>
            </div>
          </div>
        </motion.header>

        {/* Progress Indicator */}
        <motion.div
          className="flex items-center gap-2 mb-8"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {[1, 2, 3].map((s) => (
            <motion.div
              key={s}
              className={`flex-1 h-3 rounded-full transition-all duration-500 ${
                s <= step ? "bg-secondary" : "bg-muted"
              }`}
              animate={s === step ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.5, repeat: s === step ? Infinity : 0 }}
            />
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Step 1: Group Name */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
            >
              <CuteCard variant="pink">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Users size={24} />
                  What's your group called?
                </h2>
                <CuteInput
                  label="Group Name"
                  placeholder="Weekend Trip 🏖️"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
                <CuteButton
                  variant="secondary"
                  size="lg"
                  className="w-full mt-6"
                  onClick={nextStep}
                >
                  Next Step →
                </CuteButton>
              </CuteCard>
            </motion.div>
          )}

          {/* Step 2: Description */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
            >
              <CuteCard variant="blue">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <FileText size={24} />
                  Add a description
                </h2>
                <CuteInput
                  label="Description (optional)"
                  placeholder="Beach vacation expenses"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <div className="flex gap-3 mt-6">
                  <CuteButton variant="outline" onClick={() => setStep(1)}>
                    ← Back
                  </CuteButton>
                  <CuteButton
                    variant="accent"
                    size="lg"
                    className="flex-1"
                    onClick={nextStep}
                  >
                    Next Step →
                  </CuteButton>
                </div>
              </CuteCard>
            </motion.div>
          )}

          {/* Step 3: Members */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
            >
              <CuteCard variant="mint">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Users size={24} />
                  Who's in this group?
                </h2>

                {/* Selected Members */}
                {selectedMembers.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    <AnimatePresence>
                      {selectedMembers.map((member, index) => (
                        <CuteTag
                          key={member._id}
                          variant={tagVariants[index % tagVariants.length]}
                          removable
                          onRemove={() => toggleMember(member)}
                        >
                          {member.name}
                        </CuteTag>
                      ))}
                    </AnimatePresence>
                  </div>
                )}

                {/* Available Members */}
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {availableUsers.map((user, index) => {
                    const isSelected = selectedMembers.find(m => m._id === user._id);
                    return (
                      <motion.button
                        key={user._id}
                        className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all duration-300 ${
                          isSelected
                            ? "bg-secondary/50 border-2 border-secondary"
                            : "bg-card border-2 border-transparent hover:border-border"
                        }`}
                        onClick={() => toggleMember(user)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                            isSelected ? "bg-secondary" : "bg-muted"
                          }`}>
                            {user.email.charAt(0).toUpperCase()}
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-foreground">{user.username || user.email.split("@")[0]}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center"
                          >
                            <Check size={14} className="text-secondary-foreground" />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                <div className="flex gap-3 mt-6">
                  <CuteButton variant="outline" onClick={() => setStep(2)}>
                    ← Back
                  </CuteButton>
                  <CuteButton
                    variant="secondary"
                    size="lg"
                    className="flex-1"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <motion.div
                        className="flex items-center gap-2"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      >
                      </motion.div>
                    ) : (
                      <>
                        <Sparkles size={20} />
                        Create Group!
                      </>
                    )}
                  </CuteButton>
                </div>
              </CuteCard>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default CreateGroup;
