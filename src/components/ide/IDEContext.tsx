import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface IDEState {
  failedAttempts: number;
  hintLevel: number;
  isSolved: boolean;
  chatHistory: Message[];
  currentProblemId: string;
  currentCode: string;
  currentLanguage: string;
}

interface IDEContextType {
  state: IDEState;
  incrementFailedAttempts: () => void;
  incrementHintLevel: () => void;
  markAsSolved: () => void;
  addChatMessage: (msg: Omit<Message, 'id' | 'timestamp'>) => void;
  setCurrentCode: (code: string, language: string) => void;
  resetState: (problemId: string) => void;
}

const initialState: IDEState = {
  failedAttempts: 0,
  hintLevel: 0,
  isSolved: false,
  chatHistory: [],
  currentProblemId: '',
  currentCode: '',
  currentLanguage: 'javascript'
};

const IDEContext = createContext<IDEContextType | undefined>(undefined);

export const IDEProvider: React.FC<{ children: ReactNode, initialProblemId?: string }> = ({ 
  children, 
  initialProblemId = 'default-problem' 
}) => {
  const [state, setState] = useState<IDEState>({
    ...initialState,
    currentProblemId: initialProblemId
  });

  const incrementFailedAttempts = () => {
    setState(prev => ({ ...prev, failedAttempts: prev.failedAttempts + 1 }));
  };

  const incrementHintLevel = () => {
    setState(prev => ({ 
      ...prev, 
      hintLevel: Math.min(prev.hintLevel + 1, 3) 
    }));
  };

  const markAsSolved = () => {
    setState(prev => ({ ...prev, isSolved: true }));
  };

  const addChatMessage = (msg: Omit<Message, 'id' | 'timestamp'>) => {
    setState(prev => ({
      ...prev,
      chatHistory: [
        ...prev.chatHistory,
        {
          ...msg,
          id: Math.random().toString(36).substring(7),
          timestamp: Date.now()
        }
      ]
    }));
  };

  const setCurrentCode = (code: string, language: string) => {
    setState(prev => ({
      ...prev,
      currentCode: code,
      currentLanguage: language
    }));
  };

  const resetState = (problemId: string) => {
    setState({
      ...initialState,
      currentProblemId: problemId
    });
  };

  return (
    <IDEContext.Provider value={{
      state,
      incrementFailedAttempts,
      incrementHintLevel,
      markAsSolved,
      addChatMessage,
      setCurrentCode,
      resetState
    }}>
      {children}
    </IDEContext.Provider>
  );
};

export const useIDE = () => {
  const context = useContext(IDEContext);
  if (context === undefined) {
    throw new Error('useIDE must be used within an IDEProvider');
  }
  return context;
};
