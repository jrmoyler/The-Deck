import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { WorkoutStats } from '../types';
import { generateWorkoutSummary } from '../services/geminiService';
import { getWorkoutHistory } from '../services/storageService';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';

const Dashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [history, setHistory] = useState<WorkoutStats[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutStats | null>(null);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    const workoutHistory = getWorkoutHistory();
    setHistory(workoutHistory);
    
    // Default to the one just finished if available, otherwise latest from history
    if (location.state?.lastWorkout) {
        setSelectedWorkout(location.state.lastWorkout);
    } else if (workoutHistory.length > 0) {
        setSelectedWorkout(workoutHistory[0]);
    }
  }, [location]);

  useEffect(() => {
    if (selectedWorkout) {
        fetchSummary(selectedWorkout);
    }
  }, [selectedWorkout]);

  const fetchSummary = async (stats: WorkoutStats) => {
    setLoadingAi(true);
    const summary = await generateWorkoutSummary(stats);
    setAiSummary(summary);
    setLoadingAi(false);
  };

  const chartData = selectedWorkout ? [
    { name: 'Push-Ups', value: selectedWorkout.repsByExercise['Push-Ups'] || 0, color: '#ef4444' },
    { name: 'Dips', value: selectedWorkout.repsByExercise['Dips'] || 0, color: '#3b82f6' },
    { name: 'Crunches', value: selectedWorkout.repsByExercise['Crunches'] || 0, color: '#a855f7' },
    { name: 'Burpees', value: selectedWorkout.repsByExercise['Burpees'] || 0, color: '#a3e635' },
  ] : [];

  const formatDate = (ts: number) => {
      const d = new Date(ts);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-deck-dark text-white p-6 overflow-y-auto pb-32 scroll-smooth">
        <header className="flex justify-between items-center mb-10">
            <div className="group cursor-pointer">
                <h1 className="text-4xl font-black tracking-tighter leading-none group-hover:italic transition-all">THE DECK</h1>
                <p className="text-zinc-500 text-[10px] font-mono tracking-[0.4em] uppercase mt-1">Operator Profile</p>
            </div>
            <div className="flex gap-3">
                 <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shadow-lg active:scale-95 transition-transform">
                    <span className="font-black text-xs">LOG</span>
                </div>
            </div>
        </header>

        {selectedWorkout ? (
            <div className="space-y-8 animate-fade-in-up">
                {/* Hero Stat */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-deck-purple/10 rounded-full blur-[80px] -mr-16 -mt-16"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest mb-1">Session ID: {selectedWorkout.id.slice(0, 8)}</h2>
                            <div className="text-5xl font-black text-white italic tracking-tighter">SUCCESS</div>
                        </div>
                        <div className="bg-zinc-800/50 px-3 py-1 rounded-full border border-zinc-700">
                            <span className="text-[10px] font-mono text-zinc-400">{formatDate(selectedWorkout.date)}</span>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-zinc-800/30 p-4 rounded-2xl border border-zinc-800">
                             <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mb-1">Total_Reps</p>
                             <p className="text-3xl font-black font-mono">{selectedWorkout.totalReps}</p>
                        </div>
                        <div className="bg-zinc-800/30 p-4 rounded-2xl border border-zinc-800">
                             <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mb-1">Duration</p>
                             <p className="text-3xl font-black font-mono">{Math.floor(selectedWorkout.duration / 60)}m</p>
                        </div>
                    </div>

                    {/* AI Summary Section */}
                    <div className="mt-8 pt-6 border-t border-zinc-800/50">
                        <div className="flex items-center gap-2 mb-3">
                             <div className="w-2 h-2 bg-deck-purple rounded-full animate-pulse"></div>
                             <h3 className="text-[10px] font-black text-deck-purple uppercase tracking-widest">AI Performance Debrief</h3>
                        </div>
                        {loadingAi ? (
                            <div className="space-y-2">
                                <div className="h-4 bg-zinc-800 rounded w-full animate-pulse"></div>
                                <div className="h-4 bg-zinc-800 rounded w-4/5 animate-pulse"></div>
                            </div>
                        ) : (
                            <p className="text-zinc-300 text-sm italic font-medium leading-relaxed border-l-2 border-deck-purple pl-4">
                                "{aiSummary}"
                            </p>
                        )}
                    </div>
                </div>

                {/* Performance Charts */}
                <div className="grid grid-cols-2 gap-6">
                     <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl">
                        <div className="h-32 mb-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={chartData} innerRadius={35} outerRadius={50} paddingAngle={4} dataKey="value">
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-center text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Muscle Focus</p>
                     </div>
                     <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col justify-center items-center shadow-xl">
                        <div className="relative">
                            <svg className="w-24 h-24 transform -rotate-90">
                                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-zinc-800" />
                                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={251} strokeDashoffset={251 - (251 * selectedWorkout.averageFormScore) / 100} className="text-green-500 transition-all duration-1000" />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-xl font-black font-mono">{selectedWorkout.averageFormScore}%</span>
                        </div>
                        <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-3">AI_Form_Score</span>
                     </div>
                </div>

                {/* Rep Breakdown */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-xl">
                    <h3 className="text-zinc-400 text-[10px] font-mono uppercase tracking-[0.2em] mb-8">Volumetric Distribution</h3>
                    <div className="h-48">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <XAxis dataKey="name" tick={{fill: '#71717a', fontSize: 10, fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                                <Tooltip 
                                    contentStyle={{backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', padding: '10px'}}
                                    itemStyle={{color: '#fff', fontSize: '12px'}}
                                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* History List */}
                {history.length > 1 && (
                    <div className="space-y-4 pt-4">
                        <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest ml-1">Recent Missions</h3>
                        <div className="space-y-3">
                            {history.map((item) => (
                                <div 
                                    key={item.id}
                                    onClick={() => setSelectedWorkout(item)}
                                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${selectedWorkout.id === item.id ? 'bg-zinc-800 border-zinc-600' : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800/50'}`}
                                >
                                    <div>
                                        <p className="text-xs font-bold text-white">{formatDate(item.date)}</p>
                                        <p className="text-[10px] text-zinc-500 font-mono">{item.totalReps} Reps // {item.cardsCompleted} Cards</p>
                                    </div>
                                    <div className="text-zinc-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center mt-32 animate-pulse">
                <div className="w-24 h-24 bg-zinc-900 border-2 border-dashed border-zinc-800 rounded-3xl flex items-center justify-center mb-6">
                     <span className="text-4xl">💀</span>
                </div>
                <h2 className="text-2xl font-black text-white mb-2 tracking-tight">NO DATA ACQUIRED</h2>
                <p className="text-zinc-500 font-mono text-[10px] max-w-xs text-center uppercase tracking-widest px-8">Complete your first mission to initialize the tracking engine.</p>
            </div>
        )}

        {/* Global Action Button */}
        <div className="fixed bottom-24 left-6 right-6">
             <button 
                onClick={() => navigate('/workout')}
                className="w-full bg-white text-black font-black text-lg py-5 rounded-2xl shadow-[0_10px_30px_rgba(255,255,255,0.2)] active:scale-95 active:shadow-none transition-all border-b-4 border-zinc-300"
            >
                ENGAGE NEW DECK
            </button>
        </div>
    </div>
  );
};

export default Dashboard;
