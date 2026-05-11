import React, { useState, useEffect } from 'react';
import { Users, Image, Book, Database, Layers, Hash, Bookmark } from 'lucide-react';
import axios from 'axios';

// Define a type for our data to keep things clean
interface DashboardData {
  artists: number;
  artworks: number;
  books: number;
  series: number;
  sections: number;
  taxonomy: number;
  status: string;
}

export const Dashboard = () => {
  const [data, setData] = useState<DashboardData>({
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
        // Pointing specifically to the new port 5050 if needed
        // Replace '54.174.102.52' with your domain if you've set one up
        const API_URL = process.env.NODE_ENV === 'production' 
          ? 'http://54.174.102.52:5050/api' 
          : '/api';

        const response = await axios.get(`${API_URL}/stats/dashboard-summary`);
        
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
        <h1 className="text-5xl font-black uppercase italic tracking-tighter">
          Archive <span className="text-primary">Core</span>
        </h1>
        <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 pb-2 border-b-2 border-primary">
          Control Room v1.0
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div 
            key={s.label} 
            className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:border-primary/20 hover:shadow-xl transition-all duration-500 group"
          >
            <div className="flex justify-between items-start">
              <s.icon className={`${s.color} mb-4 group-hover:scale-110 transition-transform duration-500`} size={28} />
              <div className="w-2 h-2 rounded-full bg-gray-100 group-hover:bg-primary transition-colors" />
            </div>
            
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">
              {s.label}
            </p>
            <p className="text-4xl font-black italic mt-2 tracking-tighter">
              {typeof s.count === 'number' ? s.count.toLocaleString() : s.count}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};