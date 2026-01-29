
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Tour, BandProfile, MerchSale, GigOpportunity, TourInvitation, Conversation, Message, UserAccount } from '../types';
import { MOCK_TOURS, MOCK_BANDS, MOCK_INVITATIONS, CURRENT_USER } from '../constants';

interface DataContextType {
    // Data
    tours: Tour[];
    bands: BandProfile[];
    salesHistory: MerchSale[];
    pipelineOpportunities: GigOpportunity[];
    invitations: TourInvitation[];
    conversations: Conversation[];

    // Modifiers
    setTours: React.Dispatch<React.SetStateAction<Tour[]>>;
    setBands: React.Dispatch<React.SetStateAction<BandProfile[]>>;
    setSalesHistory: React.Dispatch<React.SetStateAction<MerchSale[]>>;
    setPipelineOpportunities: React.Dispatch<React.SetStateAction<GigOpportunity[]>>;
    setInvitations: React.Dispatch<React.SetStateAction<TourInvitation[]>>;

    // Actions
    addMessage: (conversationId: string, text: string, sender: UserAccount) => void;
    createConversation: (participants: UserAccount[]) => void;
    initializeUser: (user: UserAccount) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tours, setTours] = useState<Tour[]>(MOCK_TOURS);
    const [bands, setBands] = useState<BandProfile[]>(MOCK_BANDS);
    const [salesHistory, setSalesHistory] = useState<MerchSale[]>([]);

    // Pipeline State
    const [pipelineOpportunities, setPipelineOpportunities] = useState<GigOpportunity[]>([
        { id: '1', venueName: 'Music Farm', city: 'Charleston, SC', date: '2024-10-12', status: 'CONFIRMED', fee: 500, contactName: 'Mark Smith', contactEmail: 'mark@musicfarm.com', dealTerms: '$500 vs 70% door', capacity: 600 },
        { id: '2', venueName: 'Terminal West', city: 'Atlanta, GA', date: '2024-10-15', status: 'HOLD_1', fee: 750, contactName: 'Sarah Jenkins', contactEmail: 'sarah@terminalwest.com', dealTerms: '$750 Guarantee', capacity: 800 },
        { id: '3', venueName: 'Exit/In', city: 'Nashville, TN', date: '2024-10-22', status: 'PITCHED', fee: 0, contactName: 'Tommy Gunn', contactEmail: 'booking@exitin.com', dealTerms: 'TBD', capacity: 500 },
        { id: '4', venueName: '9:30 Club', city: 'Washington, DC', date: '2024-10-25', status: 'LEAD', fee: 0, contactName: 'Seth Hurwitz', contactEmail: 'seth@imp.com', capacity: 1200 }
    ]);

    const [invitations, setInvitations] = useState<TourInvitation[]>(MOCK_INVITATIONS);

    // Messages State
    const [conversations, setConversations] = useState<Conversation[]>([
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

    const addMessage = (conversationId: string, text: string, sender: UserAccount) => {
        setConversations(prev => prev.map(c => {
            if (c.id === conversationId) {
                const newMessage: Message = {
                    id: `m-${Date.now()}`,
                    senderId: sender.id,
                    senderName: sender.name,
                    text,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                return {
                    ...c,
                    lastMessage: text,
                    messages: [...c.messages, newMessage]
                };
            }
            return c;
        }));
    };

    const createConversation = (participants: UserAccount[]) => {
        // Logic to create new conversation
    };

    const initializeUser = (user: UserAccount) => {
        // Check if user already has the AI welcome message
        const aiConvId = `ai-onboard-${user.id}`;
        const exists = conversations.find(c => c.id === aiConvId);

        if (!exists) {
            const aiConversation: Conversation = {
                id: aiConvId,
                participants: [user.id, 'ai-bot'],
                participantNames: [user.name, 'TourBridge Guardian'],
                lastMessage: 'Welcome to TourBridge!',
                messages: [
                    {
                        id: 'ai-welcome-1',
                        senderId: 'ai-bot',
                        senderName: 'TourBridge Guardian',
                        text: `Welcome to TourBridge, ${user.name}! I'm here to help you route your tour, advance shows, and manage your budget. Ask me anything!`,
                        timestamp: new Date().toLocaleTimeString()
                    }
                ]
            };
            setConversations(prev => [aiConversation, ...prev]);
        }
    };

    return (
        <DataContext.Provider value={{
            tours, bands, salesHistory, pipelineOpportunities, invitations, conversations,
            setTours, setBands, setSalesHistory, setPipelineOpportunities, setInvitations,
            addMessage, createConversation, initializeUser
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
