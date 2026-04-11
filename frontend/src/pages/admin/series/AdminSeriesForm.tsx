import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminService } from '../../../services/api';
import { ArrowLeft, Save, Upload, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const FormField = ({ label, value, onChange, placeholder = "", dir = "ltr", disabled = false }: any) => (
  <div className="space-y-1">
    <label className="text-[9px] font-black uppercase text-gray-500 ml-1 tracking-widest">{label}</label>
    <input 
      value={value || ''} 
      onChange={(e) => onChange(e.target.value)} 
      dir={dir} 
      disabled={disabled}
      className={`w-full bg-[#111] border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-primary font-bold transition-all ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`} 
      placeholder={placeholder} 
    />
  </div>
);

const TextAreaField = ({ label, value, onChange, dir = "ltr" }: any) => (
  <div className="space-y-1">
    <label className="text-[9px] font-black uppercase text-gray-500 ml-1 tracking-widest">{label}</label>
    <textarea 
      value={value || ''} 
      onChange={(e) => onChange(e.target.value)} 
      dir={dir} 
      className="w-full bg-[#111] border border-white/10 p-4 rounded-xl text-xs h-32 text-white outline-none focus:border-primary transition-all font-bold resize-none" 
    />
  </div>
);

export const AdminSeriesForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  // UPDATED: State field names to match your Mongoose Schema exactly
  const [formData, setFormData] = useState({
    Series_ID: '',
    Artist_ID: '',
    Series_Title_En: '',
    Series_Title_Ar: '',
    Description_En: '',
    Description_Ar: ''
  });

  useEffect(() => {
    if (id && id !== 'undefined') {
      setFetching(true);
      AdminService.getSeriesById(id)
        .then((res: any) => {
          const serverData = res.data?.data || res.data;
          
          if (serverData) {
            // MAPPING: Database -> Form State
            setFormData({
              Series_ID: serverData.Series_ID || id,
              Artist_ID: serverData.Artist_ID || '',
              Series_Title_En: serverData.Series_Title_En || '',
              Series_Title_Ar: serverData.Series_Title_Ar || '',
              Description_En: serverData.Description_En || '',
              Description_Ar: serverData.Description_Ar || ''
            });
          }
        })
        .catch(() => toast.error("Archive record not found"))
        .finally(() => setFetching(false));
    }
  }, [id]);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.Series_ID) return toast.error("Series ID is required");
    
    setLoading(true);
    try {
      await AdminService.upsertSeries(formData);
      toast.success(id ? "Archive Updated" : "Series Created");
      navigate('/admin/series');
    } catch (err) { 
      toast.error("Submission Failed"); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleExcelImport = async () => {
    if (!file) return toast.error("Please select a file first");
    setLoading(true);
    try {
      await AdminService.importData('series', file);
      toast.success("Bulk Synchronization Complete");
      navigate('/admin/series');
    } catch (err) { 
      toast.error("Excel Import Failed"); 
    } finally { 
      setLoading(false); 
    }
  };

  if (fetching) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#050505] text-primary">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Pulling from Archive...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-700">
      <button onClick={() => navigate('/admin/series')} className="flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">
        <ArrowLeft size={14} /> Return to Series List
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <form onSubmit={handleManualSubmit} className="bg-[#0f0f0f] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
            <h2 className="text-2xl font-black italic uppercase mb-8">
              {id ? 'Modify' : 'Manual'} <span className="text-primary">Series Entry</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <FormField 
                label="Series ID" 
                value={formData.Series_ID} 
                onChange={(v: string) => setFormData({...formData, Series_ID: v})} 
                disabled={!!id} 
                placeholder="e.g., S001" 
              />
              <FormField 
                label="Artist ID (Reference)" 
                value={formData.Artist_ID} 
                onChange={(v: string) => setFormData({...formData, Artist_ID: v})} 
                placeholder="e.g., AR42" 
              />
              <FormField 
                label="Series Title (EN)" 
                value={formData.Series_Title_En} 
                onChange={(v: string) => setFormData({...formData, Series_Title_En: v})} 
              />
              <FormField 
                label="Series Title (AR)" 
                value={formData.Series_Title_Ar} 
                onChange={(v: string) => setFormData({...formData, Series_Title_Ar: v})} 
                dir="rtl" 
              />
            </div>

            <div className="space-y-6 mb-8">
              <TextAreaField label="Description (EN)" value={formData.Description_En} onChange={(v: string) => setFormData({...formData, Description_En: v})} />
              <TextAreaField label="Description (AR)" value={formData.Description_Ar} onChange={(v: string) => setFormData({...formData, Description_Ar: v})} dir="rtl" />
            </div>

            <button type="submit" disabled={loading} className="bg-primary text-black px-12 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all shadow-lg">
              {loading ? <Loader2 className="animate-spin inline mr-2" size={16} /> : <Save size={18} className="inline mr-2" />}
              {id ? 'Commit Changes' : 'Commit Entry'}
            </button>
          </form>
        </div>

        {!id && (
          <div className="bg-[#0f0f0f] p-8 rounded-[2.5rem] border border-white/5 text-center h-fit sticky top-6">
            <h3 className="text-xs font-black uppercase italic mb-6 text-white tracking-widest">Bulk <span className="text-primary">Import</span></h3>
            <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 relative mb-4 group hover:border-primary/50 transition-all cursor-pointer">
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={e => setFile(e.target.files?.[0] || null)} />
              <Upload className="mx-auto text-gray-500 mb-2 group-hover:text-primary transition-colors" size={32} />
              <p className="text-[9px] font-black text-gray-500 uppercase truncate px-2">{file ? file.name : 'Drop Spreadsheet'}</p>
            </div>
            <button onClick={handleExcelImport} disabled={loading || !file} className="w-full bg-white/5 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all disabled:opacity-30">Run Sync</button>
          </div>
        )}
      </div>
    </div>
  );
};