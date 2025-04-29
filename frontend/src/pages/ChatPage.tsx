import React from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Chat from "../components/Chat";

const ChatPage = () => {
  const { otherUserId } = useParams<{ otherUserId: string }>();
  const { user } = useAuth();

  if (!user) {
    return <div>Please log in to access chat</div>;
  }

  // Convert otherUserId to number
  const selectedUserId = otherUserId ? parseInt(otherUserId) : undefined;

  return (
    <div className="container mx-auto px-4">
      <Chat 
        currentUserId={user.user_id} 
        selectedUserId={selectedUserId}
      />
    </div>
  );
};

export default ChatPage;