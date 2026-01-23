import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { WorkoutStats, ExerciseType } from '../types';
import { generateWorkoutSummary } from '../services/geminiService';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';

const Dashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [lastWorkout, setLastWorkout] = useState<WorkoutStats | null>(null);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    if (location.state?.lastWorkout) {
        setLastWorkout(location.state.lastWorkout);
        fetchSummary(location.state.lastWorkout);
    }
  }, [location]);

  const fetchSummary = async (stats: WorkoutStats) => {
    setLoadingAi(true);
    const summary = await generateWorkoutSummary(stats);
    setAiSummary(summary);
    setLoadingAi(false);
  };

  const chartData = lastWorkout ? [
    { name: 'Push-Ups', value: lastWorkout.repsByExercise['Push-Ups'], color: '#ef4444' },
    { name: 'Dips', value: lastWorkout.repsByExercise['Dips'], color: '#3b82f6' },
    { name: 'Crunches', value: lastWorkout.repsByExercise['Crunches'], color: '#a855f7' },
    { name: 'Burpees', value: lastWorkout.repsByExercise['Burpees'], color: '#a3e635' },
  ] : [];

  return (
    <div className="min-h-screen bg-deck-dark text-white p-6 overflow-y-auto pb-24">
        <header className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-black tracking-tighter">THE DECK</h1>
                <p className="text-zinc-500 text-sm">OPERATOR DASHBOARD</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                <span className="font-bold">OP</span>
            </div>
        </header>

        {lastWorkout ? (
            <div className="space-y-6 animate-fade-in-up">
                {/* Hero Stat */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <h2 className="text-zinc-400 text-sm font-mono uppercase mb-1">Mission Status</h2>
                    <div className="text-4xl font-black text-white mb-2">COMPLETE</div>
                    <div className="flex gap-4 text-sm font-mono text-zinc-300">
                        <span>TIME: {Math.floor(lastWorkout.duration / 60)}m {lastWorkout.duration % 60}s</span>
                        <span>•</span>
                        <span>REPS: {lastWorkout.totalReps}</span>
                    </div>

                    {/* AI Summary Section */}
                    <div className="mt-6 pt-4 border-t border-zinc-800">
                        <h3 className="text-xs font-bold text-deck-purple mb-2 flex items-center">
                             <span className="w-2 h-2 bg-deck-purple rounded-full mr-2 animate-pulse"></span>
                             AI DEBRIEF
                        </h3>
                        {loadingAi ? (
                            <p className="text-zinc-500 text-sm italic">Decrypting transmission...</p>
                        ) : (
                            <p className="text-zinc-300 text-sm italic border-l-2 border-deck-purple pl-3">
                                "{aiSummary}"
                            </p>
                        )}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                     <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                        <div className="h-32">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={chartData} innerRadius={30} outerRadius={50} paddingAngle={5} dataKey="value">
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-center text-xs text-zinc-500 mt-2">VOLUME SPLIT</p>
                     </div>
                     <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-center items-center">
                        <span className="text-4xl font-black text-green-400">{lastWorkout.averageFormScore}%</span>
                        <span className="text-xs text-zinc-500 uppercase mt-1">Form Score</span>
                     </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="text-zinc-400 text-sm font-mono uppercase mb-4">Rep Breakdown</h3>
                    <div className="h-40">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <XAxis dataKey="name" tick={{fill: '#71717a', fontSize: 10}} axisLine={false} tickLine={false} />
                                <Tooltip 
                                    contentStyle={{backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px'}}
                                    itemStyle={{color: '#fff'}}
                                    cursor={{fill: 'transparent'}}
                                />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        ) : (
            <div className="text-center mt-20">
                <div className="w-20 h-20 bg-zinc-800 rounded-full mx-auto flex items-center justify-center mb-4">
                     <span className="text-4xl">🃏</span>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">No Recent Missions</h2>
                <p className="text-zinc-500 max-w-xs mx-auto mb-8">Initiate a workout to generate performance data.</p>
            </div>
        )}

        <button 
            onClick={() => navigate('/workout')}
            className="fixed bottom-24 left-6 right-6 bg-white text-black font-black text-lg py-4 rounded-xl shadow-xl active:scale-95 transition-transform"
        >
            START NEW WORKOUT
        </button>
    </div>
  );
};

export default Dashboard;
