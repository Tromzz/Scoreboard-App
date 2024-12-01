import React, { createContext, useState } from 'react';

export const ScoreContext = createContext();

export const ScoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [matchHistory, setMatchHistory] = useState([]); // Initialize match history

  return (
    <ScoreContext.Provider value={[matchHistory, setMatchHistory]}>
      {children}
    </ScoreContext.Provider>
  );
};
  