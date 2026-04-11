import { Users, Image, Book, Database } from 'lucide-react';

export const Dashboard = () => {
  const stats = [
    { label: 'Artists', count: '66', icon: Users, color: 'text-primary' },
    { label: 'Works', count: '198', icon: Image, color: 'text-blue-500' },
    { label: 'Volumes', count: '14', icon: Book, color: 'text-green-500' },
    { label: 'System', count: 'Online', icon: Database, color: 'text-gray-400' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <h1 className="text-5xl font-black uppercase italic">Archive <span className="text-primary">Core</span></h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50">
            <s.icon className={`${s.color} mb-4`} size={24} />
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{s.label}</p>
            <p className="text-3xl font-black italic mt-1">{s.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
};