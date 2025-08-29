import React, { useState, useEffect } from 'react';
import { Monitor, Clock, AlertCircle } from 'lucide-react';

const TOKENS_KEY = 'hospital_tokens';

const DisplayBoard = ({ tokens }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [allTokens, setAllTokens] = useState(tokens || []);

  useEffect(() => {
    if (tokens && tokens.length > 0) {
      setAllTokens(tokens);
    } else {
      const stored = localStorage.getItem(TOKENS_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored).map(t => ({
            ...t,
            generatedAt: new Date(t.generatedAt),
          }));
          setAllTokens(parsed);
        } catch (e) {
          console.error("Failed to parse stored tokens:", e);
          setAllTokens([]);
        }
      } else {
        setAllTokens([]);
      }
    }
  }, [tokens]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter tokens: only waiting (normal + emergency) and called
  const waitingTokens = allTokens.filter(token => token.status === 'waiting');
  const calledTokens = allTokens.filter(token => token.status === 'called').slice(0, 3);
  const displayTokens = [...waitingTokens, ...calledTokens];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E1630] to-[#1a2847] text-white p-2 sm:p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6">
        <h1 className=" sm:text-l md:text-xl lg:text-2xl font-bold mb-1 sm:mb-2 text-[var(--accent-color)]">
          Hospital Queue Management
        </h1>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs sm:text-base">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{currentTime.toLocaleTimeString()}</span>
          </div>
          <span className="mx-1 hidden sm:inline">|</span>
          <span className="text-center">{currentTime.toLocaleDateString()}</span>
        </div>
      </div>

      {/* Table for Waiting and Called Tokens */}
      <div className="w-full max-w-full sm:max-w-4xl md:max-w-5xl lg:max-w-6xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-4 border border-white/20">
        <h2 className=" sm:text-l md:text-l font-bold mb-2 sm:mb-4 text-[var(--color-surface)] text-start">
          Waiting and Recently Called Tokens
        </h2>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="min-w-full bg-white/5 rounded-lg overflow-hidden">
            <thead className="bg-white/10">
              <tr>
                <th className="py-1.5 px-2 sm:py-2 sm:px-4 text-left text-[10px] sm:text-xs md:text-sm font-medium">Token</th>
                <th className="py-1.5 px-2 sm:py-2 sm:px-4 text-left text-[10px] sm:text-xs md:text-sm font-medium">Patient</th>
                <th className="py-1.5 px-2 sm:py-2 sm:px-4 text-left text-[10px] sm:text-xs md:text-sm font-medium">Department</th>
                <th className="py-1.5 px-2 sm:py-2 sm:px-4 text-left text-[10px] sm:text-xs md:text-sm font-medium">Doctor</th>
                <th className="py-1.5 px-2 sm:py-2 sm:px-4 text-left text-[10px] sm:text-xs md:text-sm font-medium">Priority</th>
                <th className="py-1.5 px-2 sm:py-2 sm:px-4 text-left text-[10px] sm:text-xs md:text-sm font-medium">Status</th>
                <th className="py-1.5 px-2 sm:py-2 sm:px-4 text-left text-[10px] sm:text-xs md:text-sm font-medium">Estimated</th>
              </tr>
            </thead>
            <tbody>
              {displayTokens.length > 0 ? (
                displayTokens.map((token) => (
                  <tr key={token.id} className="border-b border-white/10 hover:bg-white/5">
                    <td className="py-1.5 px-2 sm:py-2 sm:px-4 text-[10px] sm:text-xs md:text-sm">{token.tokenNumber}</td>
                    <td className="py-1.5 px-2 sm:py-2 sm:px-4 text-[10px] sm:text-xs md:text-sm">{token.patientName}</td>
                    <td className="py-1.5 px-2 sm:py-2 sm:px-4 text-[10px] sm:text-xs md:text-sm">{token.departmentLabel || token.department}</td>
                    <td className="py-1.5 px-2 sm:py-2 sm:px-4 text-[10px] sm:text-xs md:text-sm">{token.doctorName}</td>
                    <td className="py-1.5 px-2 sm:py-2 sm:px-4">
                      <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 sm:gap-1 sm:px-2 sm:py-1 rounded-full text-[8px] sm:text-xs font-medium ${
                        token.priority === 'emergency' ? 'bg-red-500' : 'bg-green-500'
                      }`}>
                        <AlertCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        {token.priority}
                      </span>
                    </td>
                    <td className="py-1.5 px-2 sm:py-2 sm:px-4">
                      <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 sm:gap-1 sm:px-2 sm:py-1 rounded-full text-[8px] sm:text-xs font-medium ${
                        token.status === 'called' ? 'bg-blue-500' : 'bg-gray-500'
                      }`}>
                        {token.status}
                      </span>
                    </td>
                    <td className="py-1.5 px-2 sm:py-2 sm:px-4 text-[10px] sm:text-xs md:text-sm">{token.estimatedTime}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-4 text-center text-gray-400 text-xs sm:text-sm">
                    No tokens to display
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DisplayBoard;
