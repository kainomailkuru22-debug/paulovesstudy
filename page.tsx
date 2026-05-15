"use client";
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StudyTracker() {
  const [startTime, setStartTime] = useState(null);
  const [logs, setLogs] = useState([]);

  // 保存データの読み込み
  useEffect(() => {
    const savedLogs = localStorage.getItem('study-logs-v2');
    if (savedLogs) setLogs(JSON.parse(savedLogs));
  }, []);

  // データの保存
  useEffect(() => {
    localStorage.setItem('study-logs-v2', JSON.stringify(logs));
  }, [logs]);

  const startStudy = () => setStartTime(new Date());

  const endStudy = () => {
    if (!startTime) return;
    const endTime = new Date();
    const minutes = Math.round((endTime - startTime) / 1000 / 60);
    
    const newLog = {
      fullDate: new Date().toISOString().split('T')[0], // "2026-05-15" 形式
      minutes: minutes === 0 ? 1 : minutes 
    };

    setLogs([...logs, newLog]);
    setStartTime(null);
  };

  // --- ★ここがポイント：日付ごとに集計して「時間」に変換 ---
  const dailyData = () => {
    const aggregates = {};
    logs.forEach(log => {
      aggregates[log.fullDate] = (aggregates[log.fullDate] || 0) + log.minutes;
    });

    return Object.keys(aggregates).map(date => ({
      date: date.slice(5), // "05-15" のように短く表示
      hours: parseFloat((aggregates[date] / 60).toFixed(2)) // 分を時間に変換（小数点2位まで）
    })).sort((a, b) => a.date > b.date ? 1 : -1);
  };

  return (
    <div className="min-h-screen bg-blue-50 p-4 md:p-8 text-slate-800 font-sans">
      <div className="max-w-2xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-2">勉強時間計測</h1>
          <p className="text-blue-600">自分だけの学習ログを積み上げよう</p>
        </header>
        
        {/* 計測エリア */}
        <div className="bg-white p-10 rounded-3xl shadow-xl border-4 border-blue-200 text-center mb-10">
          {!startTime ? (
            <button onClick={startStudy} className="bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-6 px-12 rounded-2xl shadow-lg transition-transform active:scale-95">
              学習を開始する
            </button>
          ) : (
            <div>
              <div className="text-2xl font-bold text-orange-500 mb-6 animate-bounce">🔥 集中タイム！</div>
              <button onClick={endStudy} className="bg-red-500 hover:bg-red-600 text-white text-xl font-bold py-6 px-12 rounded-2xl shadow-lg transition-transform active:scale-95">
                学習を終了する
              </button>
            </div>
          )}
        </div>

        {/* グラフエリア */}
        <div className="bg-white p-6 rounded-3xl shadow-lg mb-10">
          <h2 className="text-lg font-bold mb-6 text-slate-700 underline decoration-blue-300">日別の学習時間（時間）</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis unit="h" stroke="#94a3b8" />
                <Tooltip unit="時間" />
                <Line type="stepAfter" dataKey="hours" stroke="#2563eb" strokeWidth={4} dot={{ r: 8, fill: '#2563eb' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ユーザー案内 */}
        <div className="bg-blue-900 text-white p-6 rounded-2xl shadow-lg">
          <h3 className="font-bold mb-2 flex items-center gap-2">
            <span>🌐</span> 1万人対応ロードマップ
          </h3>
          <p className="text-sm text-blue-200">
            現在はあなたのブラウザにのみ保存されています。1万人対応（ログイン機能）にするには、次に<b>Supabase</b>というサービスと連携させます。準備ができたら教えてください！
          </p>
        </div>
      </div>
    </div>
  );
}