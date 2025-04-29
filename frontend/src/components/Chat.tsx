import React, { useState, useEffect, useRef } from "react";
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { IoSend } from "react-icons/io5";
import { BsChatDots } from "react-icons/bs";
import { AiOutlineSearch } from "react-icons/ai";
import { RiUserSmileLine } from "react-icons/ri";

interface Message {
  chat_id: number;
  sender: number;
  receiver: number;
  message: string;
  sent_at: string;
}

interface ChatUser {
  user_id: number;
  name: string;
  email: string;
}

interface ApiError {
  response?: {
    status: number;
    data: any;
  };
  message: string;
}

interface ChatProps {
  currentUserId: number;
  selectedUserId?: number;
}

const Chat: React.FC<ChatProps> = ({ currentUserId, selectedUserId }) => {
  console.log('Current User ID:', currentUserId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | undefined>(selectedUserId);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (selectedUserId) {
      setSelectedUser(selectedUserId);
    }
  }, [selectedUserId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchChatUsers = async () => {
      try {
        const response = await api.get('/chat/users/');
        setChatUsers(response.data);

        if (selectedUserId && !response.data.find((u: ChatUser) => u.user_id === selectedUserId)) {
          try {
            const userResponse = await api.get(`/users/${selectedUserId}/`);
            setChatUsers([...response.data, userResponse.data]);
          } catch (error: unknown) {
            const apiError = error as ApiError;
            console.error('Error fetching selected user:', apiError);
          }
        }
      } catch (error) {
        console.error('Error fetching chat users:', error);
      }
    };
    fetchChatUsers();
  }, [selectedUserId]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedUser) {
        try {
          console.log('Fetching messages for user:', selectedUser);
          const response = await api.get(`/chat/messages/?other_user_id=${selectedUser}`);
          setMessages(response.data);
          scrollToBottom();
        } catch (error) {
          console.error('Error fetching messages:', error);
          if ((error as ApiError).response?.status === 404) {
            setMessages([]);
          }
        }
      }
    };

    if (selectedUser) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 2000);
      return () => clearInterval(interval);
    }
  }, [selectedUser]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !newMessage.trim()) return;

    try {
      const response = await api.post('/chat/', {
        receiver_id: selectedUser,
        message: newMessage.trim()
      });

      setMessages([...messages, response.data]);
      setNewMessage('');
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const capitalizeFirstLetter = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const filteredChatUsers = chatUsers.filter((user) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="flex h-[calc(100vh-100px)]">
      {/* Left sidebar - Chat Users List */}
      <div className="w-1/4 border-r bg-white overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <BsChatDots className="text-2xl text-[#0084ff]" />
            <h2 className="text-xl font-semibold">Chats</h2>
          </div>
          
          {/* Updated search bar with functionality */}
          <div className="relative mb-4">
            <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {filteredChatUsers.map((chatUser) => (
            <div
              key={chatUser.user_id}
              onClick={() => setSelectedUser(chatUser.user_id)}
              className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 rounded-lg mb-2 ${
                selectedUser === chatUser.user_id ? 'bg-gray-100' : ''
              }`}
            >
              <div className={`w-10 h-10 rounded-full bg-[#0084ff] flex items-center justify-center text-white`}>
                <RiUserSmileLine className="text-xl" />
              </div>
              <div>
                <div className="font-medium">{capitalizeFirstLetter(chatUser.name)}</div>
                <div className="text-sm text-gray-500">{chatUser.email}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right side - Chat Messages */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white border-b flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full bg-[#0084ff] flex items-center justify-center text-white`}>
                <RiUserSmileLine className="text-xl" />
              </div>
              <h3 className="font-medium">
                {capitalizeFirstLetter(
                  chatUsers.find(user => user.user_id === selectedUser)?.name || ''
                )}
              </h3>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((message) => {
                const isCurrentUser = message.sender === currentUserId;
                console.log('Full message object:', message);
                console.log('Message comparison:', {
                  messageSenderId: message.sender,
                  currentUserId,
                  isCurrentUser
                });
                return (
                  <div
                    key={message.chat_id}
                    className={`flex items-end gap-2 mb-4 ${
                      isCurrentUser ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {/* Avatar */}
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        isCurrentUser ? 'bg-[#0084ff] text-white' : 'bg-gray-300 text-gray-700'
                      }`}
                    >
                      {capitalizeFirstLetter(
                        chatUsers.find(user => user.user_id === message.sender)?.name?.charAt(0) || ''
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`max-w-[60%] px-4 py-2 rounded-2xl ${
                        isCurrentUser
                          ? 'bg-[#0084ff] text-white rounded-tr-sm'  // Sender: Blue bubble with white text
                          : 'bg-[#e4e6eb] text-gray-700 rounded-tl-sm'  // Receiver: Gray bubble with gray text
                      }`}
                    >
                      <p className={`break-words ${isCurrentUser ? 'text-white' : 'text-gray-700'}`}>
                        {message.message}
                      </p>
                      <p 
                        className={`text-[11px] mt-1 ${
                          isCurrentUser ? 'text-[#ffffff80]' : 'text-[#65676b]'
                        }`}
                      >
                        {new Date(message.sent_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t">
              <form onSubmit={sendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-[#0084ff] text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <span>Send</span>
                  <IoSend />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <BsChatDots className="text-6xl mb-4 text-[#0084ff]" />
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
