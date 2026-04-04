import { useState,useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus, Users, Mail, Check, X, Clock, Trash2, Send, Loader2,Search } from "lucide-react";
import { FloatingDoodles } from "@/components/mascots/FloatingDoodles";
import { BuddyBear } from "@/components/mascots/BuddyBear";
import { CuteButton } from "@/components/ui/CuteButton";
import { CuteCard } from "@/components/ui/CuteCard";
import { CuteInput } from "@/components/ui/CuteInput";
import { EmptyState } from "@/components/ui/EmptyState";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { addfriendbyemail,acceptfriendreq,removefriend } from "@/api/friend";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import useFriendsStore from "../store/friendStore";


const FriendsPage = () => {
  const navigate = useNavigate();
  const [isSending, setIsSending] = useState(false);

  const [newFriendEmail, setNewFriendEmail] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [friendToRemove, setFriendToRemove] = useState(null);
  const [activeTab, setActiveTab] = useState("friends");
  const [searchQuery, setSearchQuery] = useState("");
  const {
    friends,
    incoming,
    sent,
    fetchFriends,
    fetchPendingRequests,
  } = useFriendsStore();
  useEffect(() => {
    fetchFriends();
    fetchPendingRequests();
  }, []);
  const filteredFriends = friends.filter((f) =>
    f.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (f.username || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const filteredIncoming = incoming.filter((req) =>
    req.requester.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (req.requester.username || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const filteredSent = sent.filter((req) =>
    req.receiver.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (req.receiver.username || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );
  const handleSendFriendRequest = async (e) => {
    e.preventDefault();
  
    if (!newFriendEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newFriendEmail.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }
  
    const existingFriend = friends.find(
      (f) => f.email.toLowerCase() === newFriendEmail.toLowerCase().trim()
    );
    if (existingFriend) {
      toast.error("This person is already your friend or has a pending request");
      return;
    }
  
    try {
      setIsSending(true);
  
      // 🔥 REAL BACKEND CALL
      await addfriendbyemail(newFriendEmail.trim());
      await fetchPendingRequests();
      toast.success(`Friend request sent to ${newFriendEmail.trim()}`);
  
      setNewFriendEmail("");
      setIsAddDialogOpen(false);
      setActiveTab("pending");
  
      // ⚠️ For now UI stays same
      // Next step: we will refetch pending from backend
    } catch (err) {
      toast.error(err.message || "Failed to send invite");
    } finally {
      setIsSending(false);
    }
  };
  
  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setNewFriendEmail("");
  };

  const handleAcceptRequest = async (friendId) => {
    await acceptfriendreq(friendId);
    toast.success("Friend request accepted");
    fetchFriends();
    fetchPendingRequests();
  };

  const handleRejectRequest = (requestId) => {
    const request = fetchPendingRequests.find(r => r.id === requestId);
    setPendingRequests(fetchPendingRequests.filter(r => r.id !== requestId));
    toast.info(`Friend request from ${request?.name} rejected`);
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      // ⚠️ agar backend API hai to yahan call karo
      // await removeFriend(friendId);
      await removefriend(friendId); 
  
      toast.success("Friend removed");
  
      // 🔁 zustand store refresh
      await fetchFriends();
  
      setFriendToRemove(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove friend");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  console.log("friends:", friends);
  return (
    <div 
      className="min-h-screen bg-background p-4 md:p-8 relative overflow-hidden"
      style={{ minHeight: '100vh', padding: '1rem' }}
    >
      <div className="hidden sm:block">
        <FloatingDoodles />
      </div>

      <motion.div
        className="max-w-2xl mx-auto relative z-10"
        style={{ maxWidth: '42rem', marginLeft: 'auto', marginRight: 'auto', position: 'relative', zIndex: 10 }}
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
            <CuteButton variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft size={20} />
            </CuteButton>
            <motion.div
              animate={{ rotate: [-3, 3, -3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <BuddyBear size={50} mood="happy" />
            </motion.div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-foreground">Friends</h1>
              <p className="text-muted-foreground text-sm">Manage your friends list</p>
            </div>
          </div>
          <ThemeToggle />
        </motion.header>

        {/* Add Friend Button */}
        <motion.div className="mb-6" variants={itemVariants}>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => open ? setIsAddDialogOpen(true) : handleCloseDialog()}>
            <DialogTrigger asChild>
              <CuteButton variant="secondary" className="w-full">
                <UserPlus size={20} />
                Add Friend by Email
              </CuteButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Add a Friend</DialogTitle>
                <DialogDescription>
                  Enter your friend's email address to send them a friend request.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSendFriendRequest} className="space-y-4 mt-4">
                <CuteInput
                  icon={Mail}
                  type="email"
                  placeholder="friend@example.com"
                  value={newFriendEmail}
                  onChange={(e) => setNewFriendEmail(e.target.value)}
                  disabled={isSending}
                />
                <div className="flex gap-3">
                  <CuteButton type="button" variant="ghost" className="flex-1" onClick={handleCloseDialog} disabled={isSending}>
                    Cancel
                  </CuteButton>
                  <CuteButton type="submit" variant="secondary" className="flex-1" disabled={isSending}>
                    {isSending ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Send Invite
                      </>
                    )}
                  </CuteButton>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>
            {/* Search Input */}
            <motion.div className="mb-4" variants={itemVariants}>
          <CuteInput
            icon={Search}
            placeholder="Search friends by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </motion.div>
        {/* Tabs */}
        <motion.div className="flex gap-2 mb-6" variants={itemVariants}>
          <CuteButton
            variant={activeTab === "friends" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("friends")}
          >
            <Users size={18} />
            Friends ({filteredFriends.length})
          </CuteButton>
          <CuteButton
            variant={activeTab === "pending" ? "accent" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("pending")}
          >
            <Clock size={18} />
            Pending ({filteredIncoming.length + filteredSent.length})
          </CuteButton>
        </motion.div>

        {/* Friends List */}
        {activeTab === "friends" && (
          <motion.section variants={itemVariants}>
            {filteredFriends.length === 0 ? (
              <EmptyState
                title="No friends yet!"
                description="Add friends by their email to start splitting expenses together."
                action={
                  <CuteButton variant="secondary" onClick={() => setIsAddDialogOpen(true)}>
                    <UserPlus size={20} />
                    Add Your First Friend
                  </CuteButton>
                }
              />
            ) : (
              <div className="space-y-3">
                {filteredFriends.map((friend, index) => (
                  <motion.div
                    key={friend._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <CuteCard variant={["pink", "blue", "mint", "yellow"][index % 4]}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-lg font-bold">
                            {friend.avatar}
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground">{friend.name}</h3>
                            <p className="text-sm text-muted-foreground">{friend.email}</p>
                          </div>
                        </div>
                        <CuteButton
                          variant="ghost"
                          size="sm"
                          onClick={() => setFriendToRemove(friend)}
                        >
                          <Trash2 size={18} className="text-destructive" />
                        </CuteButton>
                      </div>
                    </CuteCard>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>
        )}

        {/* Pending Requests */}
        {activeTab === "pending" && (
          <motion.section variants={itemVariants} className="space-y-6">
            {/* Incoming Requests */}
            {filteredIncoming.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-foreground mb-3">Incoming Requests</h3>
                <div className="space-y-3">
                  {filteredIncoming.map((req, index) => (
                    <motion.div
                      key={req._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <CuteCard variant="yellow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-lg font-bold">
                            {req.requester.email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-bold text-foreground">{req.requester.email.split("@")[0]}</h3>
                              <p className="text-sm text-muted-foreground">{req.requester.email}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <CuteButton
                              variant="accent"
                              size="sm"
                              onClick={() => handleAcceptRequest(req._id)}
                            >
                              <Check size={16} />
                            </CuteButton>
                            <CuteButton
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRejectRequest(req._id)}
                            >
                              <X size={16} />
                            </CuteButton>
                          </div>
                        </div>
                      </CuteCard>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Sent Requests */}
            {filteredSent.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-foreground mb-3">Sent Requests</h3>
                <div className="space-y-3">
                  {filteredSent.map((req, index) => (
                    <motion.div
                      key={req._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <CuteCard variant="blue">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-lg font-bold">
                            {req.receiver.email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-bold text-foreground">{req.receiver.email.split("@")[0]}</h3>
                              <p className="text-sm text-muted-foreground">{req.receiver.email}</p>
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock size={14} />
                            Pending
                          </span>
                        </div>
                      </CuteCard>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {filteredIncoming.length === 0 && filteredSent.length === 0 && (
              <EmptyState
              title={searchQuery ? "No results found" : "No pending requests"}
              description={searchQuery ? "Try a different search term." : "You don't have any pending friend requests at the moment."}
              />
            )}
          </motion.section>
        )}
      </motion.div>

      {/* Remove Friend Confirmation Dialog */}
      <AlertDialog open={!!friendToRemove} onOpenChange={() => setFriendToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Friend</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {friendToRemove?.name} from your friends? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => handleRemoveFriend(friendToRemove?._id)}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FriendsPage;