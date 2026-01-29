
import React, { useState } from 'react';
import { Send, Search, User, MoreVertical } from 'lucide-react';
import { Conversation, Message } from '../types';
import { useAuth } from '../contexts/AuthContext';

const MessageSection: React.FC = () => {
  const { currentUser } = useAuth();
  const [conversations] = useState<Conversation[]>([
    {
      id: 'c1',
      participants: ['me', 'v1'],
      participantNames: ['Echo & The Waves', 'The Red Room Manager'],
      lastMessage: 'Your tech rider looks good. See you at load-in!',
      messages: [
        { id: 'm1', senderId: 'me', senderName: 'Echo & The Waves', text: 'Hey, checking in on the backline situation for Friday.', timestamp: '10:00 AM' },
        { id: 'm2', senderId: 'v1', senderName: 'The Red Room', text: 'Your tech rider looks good. See you at load-in!', timestamp: '10:45 AM' }
      ]
    },
    {
      id: 'c2',
      participants: ['me', 'p1'],
      participantNames: ['Echo & The Waves', 'Sarah (Photo)'],
      lastMessage: 'I can do the shoot for $200.',
      messages: []
    }
  ]);

  const [activeId, setActiveId] = useState<string | null>('c1');
  const [messageText, setMessageText] = useState('');

  const handleSendMessage = () => {
    if (!messageText.trim() || !activeId) return;

    // In a real app, this would update central state/DB
    const activeConv = conversations.find(c => c.id === activeId);
    if (activeConv) {
      activeConv.messages.push({
        id: `m-${Date.now()}`,
        senderId: currentUser?.id || 'me',
        senderName: currentUser?.name || 'Me',
        text: messageText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      activeConv.lastMessage = messageText;
    }
    setMessageText('');
  };

  const activeConversation = conversations.find(c => c.id === activeId);

  return (
    <div className="flex h-full bg-black overflow-hidden">
      {/* Sidebar */}
      <div className="w-full md:w-80 border-r border-gray-800 flex flex-col bg-gray-950">
        <div className="p-4 border-b border-gray-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full bg-gray-900 border border-gray-800 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={`w-full p-4 flex gap-3 border-b border-gray-900 transition-colors ${activeId === c.id ? 'bg-white/5 border-l-4 border-l-white' : 'hover:bg-gray-900'}`}
            >
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                <User size={20} className="text-gray-400" />
              </div>
              <div className="text-left overflow-hidden">
                <p className="font-bold text-white text-sm truncate">{c.participantNames[1]}</p>
                <p className="text-xs text-gray-500 truncate mt-1">{c.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="hidden md:flex flex-1 flex-col bg-black relative">
        {activeConversation ? (
          <>
            <div className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-950">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                  <User size={16} />
                </div>
                <h3 className="font-bold text-white">{activeConversation.participantNames[1]}</h3>
              </div>
              <button className="text-gray-500 hover:text-white"><MoreVertical size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeConversation.messages.map(m => (
                <div key={m.id} className={`flex flex-col ${m.senderId === (currentUser?.id || 'me') ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${m.senderId === (currentUser?.id || 'me') ? 'bg-white text-black rounded-tr-none' : 'bg-gray-800 text-white rounded-tl-none'}`}>
                    {m.text}
                  </div>
                  <span className="text-[10px] text-gray-600 mt-1 uppercase font-bold">{m.timestamp}</span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-gray-950 border-t border-gray-800">
              <div className="flex gap-2 bg-gray-900 rounded-xl p-2 border border-gray-800">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent border-none px-4 text-sm focus:outline-none"
                />
                <button onClick={handleSendMessage} className="bg-white text-black p-2 rounded-lg hover:bg-gray-200 transition-colors">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mb-4">
              <Send size={32} className="text-gray-600" />
            </div>
            <h3 className="text-xl font-bold text-white">Your Backstage Inbox</h3>
            <p className="text-gray-500 mt-2 max-w-xs">Select a conversation to coordinate your tour logistics, booking, and production needs.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageSection;
