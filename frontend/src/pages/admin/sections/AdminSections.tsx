import { useEffect, useState } from 'react';
import { AdminService } from '../../../services/api';
import { Plus, Trash2, LayoutGrid, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const AdminSections = () => {
  const [sections, setSections] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  const fetchSections = async () => {
    try {
      const res: any = await AdminService.getAllSections();
      setSections(res.data?.data || []);
    } catch (err) { setSections([]); }
  };

  useEffect(() => { fetchSections(); }, []);

  const handleDelete = async (sectionId: string) => {
    if (!window.confirm(`Permanently delete section ${sectionId}?`)) return;
    try {
      await AdminService.deleteSection(sectionId);
      toast.success("Section Purged");
      fetchSections();
    } catch (err) { toast.error("Delete Failed"); }
  };

  const filtered = sections.filter(s => 
    (s.Section_Title || "").toLowerCase().includes(search.toLowerCase()) || 
    (s.Section_ID || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic text-white">Archive <span className="text-primary">Sections</span></h1>
          <p className="text-gray-500 font-bold uppercase text-[9px] tracking-[0.4em] mt-1">Structural Segments</p>
        </div>
        <Link to="/admin/sections/add" className="bg-primary text-black px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-lg">
          <Plus size={16} className="inline mr-1" /> New Section
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
        <input 
          placeholder="Filter by Section ID or Title..." 
          className="w-full bg-[#0f0f0f] border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-primary text-white text-xs font-bold transition-all"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((sec: any) => (
          <div key={sec._id} className="bg-[#0f0f0f] p-8 rounded-[2.5rem] border border-white/5 flex items-center justify-between group transition-all hover:border-white/10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl"><LayoutGrid className="text-primary" size={20} /></div>
              <div className="min-w-0">
                <span className="text-[9px] text-primary font-black mb-1 block uppercase tracking-widest">{sec.Section_ID}</span>
                <h4 className="font-black uppercase text-xs italic truncate text-white">{sec.Section_Title || 'Untitled Section'}</h4>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to={`/admin/sections/edit/${sec.Section_ID}`} className="px-4 py-3 bg-white/5 rounded-xl text-[9px] font-black uppercase text-gray-300 hover:bg-white hover:text-black transition-all">Modify</Link>
              <button onClick={() => handleDelete(sec.Section_ID)} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};