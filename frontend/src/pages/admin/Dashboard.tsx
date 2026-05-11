import React, { useState, useEffect } from 'react';
import { Users, Image, Book, Database, Layers, Hash, Bookmark } from 'lucide-react';
import axios from 'axios';

export const Dashboard = () => {
  const [data, setData] = useState({
    artists: 0,
    artworks: 0,
    books: 0,
    series: 0,
    sections: 0,
    taxonomy: 0,
    status: 'Connecting...'
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // This endpoint should return an object with all counts
        const response = await axios.get('/api/stats/dashboard-summary');
        setData({
          artists: response.data.artists || 0,
          artworks: response.data.artworks || 0,
          books: response.data.books || 0,
          series: response.data.series || 0,
          sections: response.data.sections || 0,
          taxonomy: response.data.taxonomy || 0,
          status: 'Online'
        });
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        setData(prev => ({ ...prev, status: 'Offline' }));
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    { label: 'Artists', count: data.artists, icon: Users, color: 'text-primary' },
    { label: 'Artworks', count: data.artworks, icon: Image, color: 'text-blue-500' },
    { label: 'Books', count: data.books, icon: Book, color: 'text-green-500' },
    { label: 'Series', count: data.series, icon: Bookmark, color: 'text-purple-500' },
    { label: 'Sections', count: data.sections, icon: Layers, color: 'text-orange-500' },
    { label: 'Taxonomy', count: data.taxonomy, icon: Hash, color: 'text-pink-500' },
    { label: 'System', count: data.status, icon: Database, color: 'text-gray-400' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <h1 className="text-5xl font-black uppercase italic">
          Archive <span className="text-primary">Core</span>
        </h1>
        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 pb-2">
          Control Room v1.0
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div 
            key={s.label} 
            className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 hover:shadow-md transition-shadow duration-300"
          >
            <s.icon className={`${s.color} mb-4`} size={24} />
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
              {s.label}
            </p>
            <p className="text-3xl font-black italic mt-1">
              {s.count}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};