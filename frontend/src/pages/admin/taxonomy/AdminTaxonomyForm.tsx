import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminService } from '../../../services/api';
import { ArrowLeft, Save, Upload, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminTaxonomyForm = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({ id: '', name: '', nameAr: '' });

  useEffect(() => {
    if (id && id !== 'undefined') {
      setFetching(true);
      AdminService.getTaxonomyById(id, type!)
        .then((res: any) => {
          const data = res.data?.data;
          if (data) {
            setFormData({
              id: type === 'theme' ? data.Theme_ID : data.Tag_ID,
              name: type === 'theme' ? data.Theme_Name : data.Tag_Name,
              nameAr: type === 'theme' ? (data.Theme_Name_In_Arabic || '') : (data.Tag_Name_In_Arabic || '')
            });
          }
        })
        .finally(() => setFetching(false));
    }
  }, [id, type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id.trim() || !formData.name.trim()) return toast.error("ID and Name are required");

    const payload = type === 'theme' 
      ? { Theme_ID: formData.id, Theme_Name: formData.name, Theme_Name_In_Arabic: formData.nameAr, type }
      : { Tag_ID: formData.id, Tag_Name: formData.name, Tag_Name_In_Arabic: formData.nameAr, type };

    setLoading(true);
    try {
      await AdminService.upsertTaxonomy(payload);
      toast.success(id ? "Archive Updated" : "Archive Registered");
      navigate('/admin/taxonomy');
    } catch (err) { toast.error("Save failed"); } 
    finally { setLoading(false); }
  };

  const handleImport = async () => {
    if (!file) return toast.error("Select file first");
    setLoading(true);
    try {
      await AdminService.importData(type!, file);
      toast.success("Bulk Sync Complete");
      navigate('/admin/taxonomy');
    } catch (err) { toast.error("Import Failed"); } 
    finally { setLoading(false); }
  };

  if (fetching) return <div className="h-screen flex items-center justify-center text-primary font-black uppercase text-[10px] tracking-widest">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-700">
      <button onClick={() => navigate('/admin/taxonomy')} className="flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">
        <ArrowLeft size={14} /> Back to Taxonomy
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="bg-[#0f0f0f] border border-white/5 rounded-[2.5rem] p-10 space-y-8">
            <h2 className="text-2xl font-black italic uppercase">
              {id ? 'Modify' : 'Register New'} <span className="text-primary">{type}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-500 ml-1">Unique ID</label>
                <input value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} disabled={!!id} className={`w-full bg-[#111] border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-primary font-bold ${id ? 'opacity-40 cursor-not-allowed' : ''}`} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-gray-500 ml-1">Display Name (EN)</label>
                <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#111] border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-primary font-bold" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-[9px] font-black uppercase text-gray-500 ml-1 text-right block">Arabic Translation</label>
                <input value={formData.nameAr} onChange={e => setFormData({...formData, nameAr: e.target.value})} dir="rtl" className="w-full bg-[#111] border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-primary font-bold text-right" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="bg-primary text-black px-12 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all">
              {loading ? <Loader2 className="animate-spin inline mr-2" size={16}/> : <Save size={16} className="inline mr-2"/>} {id ? "Update Entry" : "Commit to Archive"}
            </button>
          </form>
        </div>

        <div className="bg-[#0f0f0f] p-8 rounded-[2.5rem] border border-white/5 text-center h-fit sticky top-6">
          <h3 className="text-[10px] font-black uppercase italic mb-6 text-white">Bulk <span className="text-primary">Sync</span></h3>
          <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 relative mb-4 group hover:border-primary/50 transition-all cursor-pointer">
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={e => setFile(e.target.files?.[0] || null)} />
            <Upload className="mx-auto text-gray-500 mb-2 group-hover:text-primary transition-colors" size={32} />
            <p className="text-[9px] font-black text-gray-500 uppercase truncate px-2">{file ? file.name : 'Drop Sheet'}</p>
          </div>
          <button onClick={handleImport} disabled={loading || !file} className="w-full bg-white/5 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-white transition-all disabled:opacity-30">Process</button>
        </div>
      </div>
    </div>
  );
};