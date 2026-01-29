

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount } from '../types';
import { MOCK_ACCOUNTS, MOCK_BANDS, ADMIN_ACCOUNT, ADMIN_BANDS, ADMIN_USER } from '../constants';
import { useData } from './DataContext';
import { auth, googleProvider, signInWithPopup, signOut as firebaseSignOut } from '../lib/firebase';

interface AuthContextType {
    currentUser: UserAccount | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isSuperAdmin: boolean; // Added
    login: (email: string, password: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>; // Added
    loginAsDemo: () => Promise<void>;
    logout: () => void;
    register: (name: string, email: string, password: string) => Promise<UserAccount>;
    createTeam: (name: string) => Promise<UserAccount>;
    availableAccounts: UserAccount[];
    switchAccount: (accountId: string) => void;
    isDemoMode: boolean; // Added
}

const mergeUniqueAccounts = (existing: UserAccount[], incoming: UserAccount[]): UserAccount[] => {
    const map = new Map<string, UserAccount>();
    existing.forEach(acc => map.set(acc.id, acc));
    incoming.forEach(acc => map.set(acc.id, acc)); // Incoming overwrites existing if same ID
    return Array.from(map.values());
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { initializeUser, setBands } = useData(); // Added setBands to inject admin bands
    const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
    const [availableAccounts, setAvailableAccounts] = useState<UserAccount[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const isSuperAdmin = currentUser?.email === 'reidgarrett334@gmail.com';
    const isDemoMode = currentUser?.id === 'u-default-person' || currentUser?.id === 'u-default-org';

    // Initialize from LocalStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('tourbridge_user_v2');
        const storedAccounts = localStorage.getItem('tourbridge_accounts_v2');

        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }

        let initialAccounts: UserAccount[] = [];
        if (storedAccounts) {
            initialAccounts = JSON.parse(storedAccounts);
        }

        // ---------------------------------------------------------
        // DEFAULT MOCK ACCOUNTS (Robust Factories)
        // ---------------------------------------------------------
        const DEFAULT_MOCK_USER: UserAccount = {
            id: 'u-default-person',
            name: 'Example Person',
            email: 'person@example.com',
            role: 'Tour Manager',
            avatar: 'https://ui-avatars.com/api/?name=Example+Person&background=0D9488&color=fff',
            type: 'PERSON',
            careerLevel: 'WORKING'
        };

        const DEFAULT_MOCK_ORG: UserAccount = {
            id: 'u-default-org',
            name: 'Example Organization',
            email: 'contact@exampleorg.com',
            role: 'Organization',
            avatar: 'https://ui-avatars.com/api/?name=Example+Organization&background=4F46E5&color=fff&rounded=true',
            type: 'ORGANIZATION',
            careerLevel: 'TOURING'
        };

        // Combine all sources: Stored + Defaults + Constants
        // We prioritize Stored > Defaults > Constants
        const mergedAccounts = mergeUniqueAccounts(initialAccounts, [DEFAULT_MOCK_USER, DEFAULT_MOCK_ORG, ...MOCK_ACCOUNTS]);

        setAvailableAccounts(mergedAccounts);

        // Auto-login to Default Person if no user is stored
        if (!storedUser) {
            setCurrentUser(DEFAULT_MOCK_USER);
            localStorage.setItem('tourbridge_user_v2', JSON.stringify(DEFAULT_MOCK_USER));
        }

        // Ensure defaults are always saved for next time
        if (mergedAccounts.length !== initialAccounts.length || !storedAccounts) {
            localStorage.setItem('tourbridge_accounts_v2', JSON.stringify(mergedAccounts));
        }

        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Allow login as the default users explicitly
            const allPossibleAccounts = availableAccounts; // Already merged in useEffect
            const foundUser = allPossibleAccounts.find(u => u.email.toLowerCase() === email.toLowerCase());

            if (foundUser) {
                setCurrentUser(foundUser);
                localStorage.setItem('tourbridge_user_v2', JSON.stringify(foundUser));

                setAvailableAccounts(prev => {
                    const updated = mergeUniqueAccounts(prev, [foundUser]);
                    localStorage.setItem('tourbridge_accounts_v2', JSON.stringify(updated));
                    return updated;
                });
            } else {
                throw new Error("Invalid credentials");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const loginAsDemo = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));

        // Ensure these exist again here to be safe
        const demoUser: UserAccount = {
            id: 'u-default-person',
            name: 'Example Person',
            email: 'person@example.com',
            role: 'Tour Manager',
            avatar: 'https://ui-avatars.com/api/?name=Example+Person&background=0D9488&color=fff',
            type: 'PERSON',
            careerLevel: 'WORKING'
        };

        const demoOrg: UserAccount = {
            id: 'u-default-org',
            name: 'Example Organization',
            email: 'contact@exampleorg.com',
            role: 'Organization',
            avatar: 'https://ui-avatars.com/api/?name=Example+Organization&background=4F46E5&color=fff&rounded=true',
            type: 'ORGANIZATION',
            careerLevel: 'TOURING'
        };

        setCurrentUser(demoUser);
        localStorage.setItem('tourbridge_user_v2', JSON.stringify(demoUser));

        // Grant access to both Person and Org
        setAvailableAccounts(prev => {
            const updated = mergeUniqueAccounts(prev, [demoUser, demoOrg]);
            localStorage.setItem('tourbridge_accounts_v2', JSON.stringify(updated));
            return updated;
        });

        setIsLoading(false);
    };



    const register = async (name: string, email: string, password: string) => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newUser: UserAccount = {
            id: `u-${Date.now()}`,
            name,
            email,
            role: 'Artist Manager', // Default role
            avatar: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=random`,
            type: 'PERSON'
        };

        setCurrentUser(newUser);

        setAvailableAccounts(prev => {
            const updated = mergeUniqueAccounts(prev, [newUser]);
            localStorage.setItem('tourbridge_accounts_v2', JSON.stringify(updated));
            return updated;
        });

        localStorage.setItem('tourbridge_user_v2', JSON.stringify(newUser));

        // Initialize User Data (AI Onboarding)
        initializeUser(newUser);

        setIsLoading(false);
        return newUser;
    };

    const createTeam = async (name: string) => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));

        const newTeam: UserAccount = {
            id: `team-${Date.now()}`,
            name: name,
            email: `team@${name.toLowerCase().replace(/\s+/g, '')}.com`,
            role: 'Organization',
            avatar: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=random&rounded=true`,
            type: 'ORGANIZATION'
        };

        setAvailableAccounts(prev => {
            const updated = mergeUniqueAccounts(prev, [newTeam]);
            localStorage.setItem('tourbridge_accounts_v2', JSON.stringify(updated));
            return updated;
        });

        setIsLoading(false);
        return newTeam;
    };

    const loginWithGoogle = async () => {
        setIsLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            if (user) {
                const googleUser: UserAccount = {
                    id: user.uid,
                    name: user.displayName || 'Google User',
                    email: user.email || '',
                    role: 'Artist Manager',
                    avatar: user.photoURL || `https://ui-avatars.com/api/?name=${(user.displayName || 'G').replace(' ', '+')}`,
                    type: 'PERSON'
                };

                setCurrentUser(googleUser);
                localStorage.setItem('tourbridge_user_v2', JSON.stringify(googleUser));

                setAvailableAccounts(prev => {
                    const updated = mergeUniqueAccounts(prev, [googleUser]);
                    localStorage.setItem('tourbridge_accounts_v2', JSON.stringify(updated));
                    return updated;
                });
            }
        } catch (error) {
            console.error("Google Login Error", error);
            throw error; // Re-throw to handle in UI
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => { // Made async
        await firebaseSignOut(auth);
        setCurrentUser(null);
        localStorage.removeItem('tourbridge_user_v2');
    };

    const switchAccount = (accountId: string) => {
        const account = availableAccounts.find(a => a.id === accountId);
        // Fallback checks
        const orgAccount = MOCK_BANDS.find(b => b.id === accountId) || ADMIN_BANDS.find(b => b.id === accountId);

        if (account) {
            setCurrentUser(account);
            localStorage.setItem('tourbridge_user_v2', JSON.stringify(account));
        } else if (orgAccount) {
            const orgUser: UserAccount = {
                id: orgAccount.id,
                name: orgAccount.name,
                email: `management@${orgAccount.name.replace(' ', '').toLowerCase()}.com`,
                role: 'Organization',
                avatar: orgAccount.avatar,
                type: 'ORGANIZATION'
            };
            setCurrentUser(orgUser);

            setAvailableAccounts(prev => {
                const updated = mergeUniqueAccounts(prev, [orgUser]);
                localStorage.setItem('tourbridge_accounts_v2', JSON.stringify(updated));
                return updated;
            });

            localStorage.setItem('tourbridge_user_v2', JSON.stringify(orgUser));
        }
    };

    return (
        <AuthContext.Provider value={{
            currentUser,
            isAuthenticated: !!currentUser,
            isLoading,
            isSuperAdmin,
            isDemoMode,

            login,
            loginWithGoogle,
            loginAsDemo,
            logout,
            register,
            createTeam,
            availableAccounts,
            switchAccount
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
