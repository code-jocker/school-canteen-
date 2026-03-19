import { useState, useEffect, useRef } from 'react';
import { chatAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Send, MessageCircle, Users } from 'lucide-react';

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchData();
    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchData = async () => {
    try {
      const [messagesRes, usersRes] = await Promise.all([
        chatAPI.getMessages(),
        chatAPI.getChatUsers()
      ]);
      setMessages(messagesRes.data.messages);
      setUsers(usersRes.data.users);
    } catch (error) {
      console.error('Error fetching chat data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await chatAPI.getMessages();
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await chatAPI.sendMessage({
        message: newMessage,
        recipientId: selectedUser?._id || null,
        recipientName: selectedUser?.name || 'All'
      });
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      alert(error.response?.data?.message || 'Error sending message');
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    return date.toLocaleDateString();
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'superadmin':
        return 'bg-purple-100 text-purple-800';
      case 'dean-admin':
        return 'bg-blue-100 text-blue-800';
      case 'canteen':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rwanda-blue"></div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full">
      <h1 className="text-2xl font-bold text-rwanda-dark mb-6">Chat System</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        {/* Users List */}
        <div className="card overflow-hidden">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b">
            <Users size={20} className="text-rwanda-blue" />
            <h2 className="font-semibold">Users</h2>
          </div>
          <div className="space-y-2 overflow-y-auto max-h-[calc(100%-60px)]">
            <button
              onClick={() => setSelectedUser(null)}
              className={`w-full text-left px-3 py-2 rounded transition-colors ${
                !selectedUser ? 'bg-rwanda-blue text-white' : 'hover:bg-gray-100'
              }`}
            >
              <span className="font-medium">All Users</span>
              <span className="block text-xs opacity-75">Broadcast message</span>
            </button>
            {users
              .filter((u) => u._id !== user?.id)
              .map((u) => (
                <button
                  key={u._id}
                  onClick={() => setSelectedUser(u)}
                  className={`w-full text-left px-3 py-2 rounded transition-colors ${
                    selectedUser?._id === u._id ? 'bg-rwanda-blue text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  <span className="font-medium">{u.name}</span>
                  <span className={`block text-xs px-2 py-0.5 rounded mt-1 w-fit ${
                    selectedUser?._id === u._id ? 'bg-white/20' : getRoleBadge(u.role)
                  }`}>
                    {u.role === 'superadmin' ? 'Admin' : u.role === 'dean-admin' ? 'Dean' : 'Canteen'}
                  </span>
                </button>
              ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3 card flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="pb-3 border-b mb-4">
            <h2 className="font-semibold">
              {selectedUser ? `Chat with ${selectedUser.name}` : 'Broadcast to All'}
            </h2>
            <p className="text-sm text-gray-500">
              {selectedUser
                ? `${selectedUser.role === 'superadmin' ? 'Admin' : selectedUser.role === 'dean-admin' ? 'Dean' : 'Canteen Staff'}`
                : 'Send message to all users'}
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <MessageCircle size={48} className="mx-auto mb-2 text-gray-300" />
                <p>No messages yet</p>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isOwnMessage = msg.sender === user?.id;
                const showDate = index === 0 || 
                  new Date(msg.createdAt).toDateString() !== 
                  new Date(messages[index - 1].createdAt).toDateString();

                return (
                  <div key={msg._id}>
                    {showDate && (
                      <div className="text-center text-xs text-gray-400 my-2">
                        {formatDate(msg.createdAt)}
                      </div>
                    )}
                    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-lg ${
                          isOwnMessage
                            ? 'bg-rwanda-blue text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {!isOwnMessage && (
                          <div className={`text-xs mb-1 ${
                            isOwnMessage ? 'text-blue-200' : 'text-gray-500'
                          }`}>
                            {msg.senderName}
                          </div>
                        )}
                        <p>{msg.message}</p>
                        <div className={`text-xs mt-1 ${
                          isOwnMessage ? 'text-blue-200' : 'text-gray-400'
                        }`}>
                          {formatTime(msg.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="flex gap-2 pt-3 border-t">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="input flex-1"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="btn btn-primary px-4 disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
