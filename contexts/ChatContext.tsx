import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ChatContextType {
    startNewChat: () => void;
    setStartNewChatHandler: (handler: () => void) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // This state holds a reference to the function that can start a new chat.
    // The function itself is implemented within ChatPage.tsx.
    const [handler, setHandler] = useState<(() => void) | null>(null);

    // This is the function that components like the sidebar will call.
    const startNewChat = useCallback(() => {
        if (handler) {
            handler();
        } else {
            // Fallback or error if the handler hasn't been set yet.
            // This can happen if the button is clicked before ChatPage mounts.
            console.warn('startNewChat handler is not set yet.');
        }
    }, [handler]);

    // This function allows ChatPage to register its internal `handleNewChat` function.
    const setStartNewChatHandler = useCallback((newHandler: (() => void) | null) => {
        // We wrap the handler function in another function to avoid issues with stale closures
        // and ensure the latest version of the handler is always available.
        setHandler(() => newHandler);
    }, []);

    return (
        <ChatContext.Provider value={{ startNewChat, setStartNewChatHandler }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChatActions = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChatActions must be used within a ChatProvider');
    }
    return context;
};