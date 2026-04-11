import { useEffect, useState } from 'react';
import { AdminService } from '../../../services/api';
import { Plus, Trash2, Layers, Hash, Search, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const AdminTaxonomy = () => {
  const [data, setData] = useState<any>({ themes: [], tags: [] });
  const [search, setSearch] = useState('');

  const fetchAll = async () => {
    try {
      const res: any = await AdminService.getAllTaxonomy();
      setData(res.data?.data || { themes: [], tags: [] });
    } catch (err) { toast.error("Sync Failed"); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleDelete = async (id: string, type: 'theme' | 'tag') => {
    if (!window.confirm(`Delete this ${type}?`)) return;
    try {
      await AdminService.deleteTaxonomy(id, type);
      toast.success("Purged");
      fetchAll();
    } catch (err) { toast.error("Delete failed"); }
  };

  const filterList = (list: any[], key: string) => 
    list.filter(item => (item[key] || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-10 animate-in fade-in duration-500 p-4">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black uppercase italic text-white tracking-tighter">
            Archive <span className="text-primary">Taxonomy</span>
          </h1>
          <p className="text-gray-500 font-bold uppercase text-[9px] tracking-[0.4em] mt-1">Classification Management</p>
        </div>
        
        {/* FIXED: Buttons are now always visible with primary background */}
        <div className="flex gap-4">
          <Link to="/admin/taxonomy/add/theme" className="bg-primary text-black px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-white transition-all shadow-lg shadow-primary/10">
            <Plus size={16} strokeWidth={3} /> New Theme
          </Link>
          <Link to="/admin/taxonomy/add/tag" className="bg-primary text-black px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-white transition-all shadow-lg shadow-primary/10">
            <Plus size={16} strokeWidth={3} /> New Tag
          </Link>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary group-focus-within:text-white transition-colors" size={20} />
        <input 
          placeholder="Filter database by classification name..." 
          className="w-full bg-[#0f0f0f] border border-white/5 p-6 pl-16 rounded-[2rem] outline-none focus:border-primary/50 text-white text-xs font-bold transition-all"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* THEMES SECTION */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <Layers className="text-primary" size={18} />
            <h3 className="font-black uppercase text-xs tracking-[0.2em] italic text-gray-400">Themes</h3>
          </div>
          
          <div className="grid gap-3">
            {filterList(data.themes, 'Theme_Name').map((t: any) => (
              <div key={t._id} className="bg-[#0f0f0f] p-5 rounded-[1.5rem] border border-white/5 flex justify-between items-center hover:border-primary/30 transition-all group">
                <div>
                  <span className="text-[9px] font-black text-primary block tracking-widest mb-1">{t.Theme_ID}</span>
                  <span className="text-sm font-black text-white uppercase italic">{t.Theme_Name}</span>
                </div>
                <div className="flex gap-1">
                   <Link to={`/admin/taxonomy/edit/theme/${t._id}`} className="p-2 text-gray-500 hover:text-primary transition-colors">
                     <Edit3 size={16} />
                   </Link>
                   <button onClick={() => handleDelete(t._id, 'theme')} className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                     <Trash2 size={16} />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TAGS SECTION - Updated to match Theme layout style */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <Hash className="text-primary" size={18} />
            <h3 className="font-black uppercase text-xs tracking-[0.2em] italic text-gray-400">Tags</h3>
          </div>
          
          <div className="grid gap-3">
            {filterList(data.tags, 'Tag_Name').map((t: any) => (
              <div key={t._id} className="bg-[#0f0f0f] p-5 rounded-[1.5rem] border border-white/5 flex justify-between items-center hover:border-primary/30 transition-all">
                <div>
                  <span className="text-[9px] font-black text-primary block tracking-widest mb-1">{t.Tag_ID}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white uppercase italic">#{t.Tag_Name}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                   <Link to={`/admin/taxonomy/edit/tag/${t._id}`} className="p-2 text-gray-500 hover:text-primary transition-colors">
                     <Edit3 size={16} />
                   </Link>
                   <button onClick={() => handleDelete(t._id, 'tag')} className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                     <Trash2 size={16} />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};