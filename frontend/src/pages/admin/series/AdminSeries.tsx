import { useEffect, useState } from 'react';
import { AdminService } from '../../../services/api';
import { Plus, Trash2, Layers, Search, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const AdminSeries = () => {
  const [series, setSeries] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    try {
      const res: any = await AdminService.getAllSeries();
      setSeries(res.data?.data || []);
    } catch (err) { setSeries([]); }
  };

  useEffect(() => { fetchData(); }, []);

  // UPDATED: Handle deletion using the best available ID
  const handleDelete = async (s: any) => {
    const identifier = s.Series_ID || s._id;
    if (!window.confirm(`Permanently delete this series record?`)) return;
    
    try {
      await AdminService.deleteSeries(identifier);
      toast.success("Archive Purged");
      fetchData();
    } catch (err) { toast.error("Delete Failed"); }
  };

  const filtered = series.filter(s => 
    (s.Series_Name || "").toLowerCase().includes(search.toLowerCase()) || 
    (s.Series_ID || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black uppercase italic text-white tracking-tighter">
            Archive <span className="text-primary">Series</span>
          </h1>
          <p className="text-gray-500 font-bold uppercase text-[9px] tracking-[0.4em] mt-1">Collection Management</p>
        </div>
        <Link to="/admin/series/add" className="bg-primary text-black px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-lg shadow-primary/10">
          <Plus size={16} strokeWidth={3} /> Create Series
        </Link>
      </div>

      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" size={20} />
        <input 
          placeholder="Search collections by name or serial ID..." 
          className="w-full bg-[#0f0f0f] border border-white/10 p-6 pl-16 rounded-[2rem] outline-none focus:border-primary text-white text-xs font-bold transition-all"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((s: any) => (
          <div key={s._id} className="bg-[#0f0f0f] p-8 rounded-[2.5rem] border border-white/5 group hover:border-primary/20 transition-all">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 text-primary">
                <Layers size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-black text-primary block tracking-widest mb-1">
                  {s.Series_ID || "NO-ID-DETECTED"}
                </span>
                <h4 className="font-black uppercase text-sm italic truncate text-white">
                  {s.Series_Name || 'UNTITLED RECORD'}
                </h4>
                <p className="text-[9px] font-bold text-gray-500 uppercase">Artist: {s.Artist_ID || 'TEST'}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Link 
                // Fallback to _id so the form can still load the record even if Series_ID is missing
                to={`/admin/series/edit/${s.Series_ID || s._id}`} 
                className="flex-1 py-4 bg-white/5 rounded-2xl font-black text-[9px] uppercase text-center text-gray-300 hover:bg-white hover:text-black transition-all"
              >
                Modify
              </Link>
              <button 
                onClick={() => handleDelete(s)} 
                className="px-5 py-4 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
              >
                <Trash2 size={16}/>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};