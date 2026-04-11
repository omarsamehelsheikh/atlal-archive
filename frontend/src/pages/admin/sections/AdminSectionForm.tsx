import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminService } from '../../../services/api';
import { ArrowLeft, Save, Upload, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const FormField = ({ label, value, onChange, dir = "ltr", disabled = false, placeholder = "" }: any) => (
  <div className="space-y-1">
    <label className="text-[9px] font-black uppercase text-gray-500 ml-1 tracking-widest">{label}</label>
    <input 
      value={value || ''} 
      onChange={(e) => onChange(e.target.value)} 
      dir={dir} 
      disabled={disabled}
      placeholder={placeholder}
      className={`w-full bg-white/5 border border-white/10 p-3 rounded-xl text-xs text-white outline-none focus:border-primary transition-all font-bold ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`} 
    />
  </div>
);

export const AdminSectionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    Section_ID: '',
    Book_ID: '',
    Section_Title: '',
    Section_Title_In_Arabic: '',
    Section_Order: '0'
  });

  useEffect(() => {
    if (id && id !== 'undefined') {
      setFetching(true);
      AdminService.getSectionById(id)
        .then((res: any) => {
          const data = res.data?.data || res.data;
          if (data) {
            setFormData({
              Section_ID: data.Section_ID || '',
              Book_ID: data.Book_ID || '',
              Section_Title: data.Section_Title || '',
              Section_Title_In_Arabic: data.Section_Title_In_Arabic || '',
              Section_Order: data.Section_Order?.toString() || '0'
            });
          }
        })
        .catch(() => toast.error("Failed to load section data"))
        .finally(() => setFetching(false));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.Section_ID) return toast.error("Section ID is required");
    
    setLoading(true);
    try {
      await AdminService.upsertSection(formData);
      toast.success(id ? "Section Updated" : "Section Created Successfully");
      navigate('/admin/sections');
    } catch (err: any) { 
      const msg = err.response?.data?.error || "Failed to save section";
      toast.error(msg); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleImport = async () => {
    if (!file) return toast.error("Select file first");
    setLoading(true);
    try {
      await AdminService.importData('section', file);
      toast.success("Bulk Sync Complete");
      navigate('/admin/sections');
    } catch (err) { 
      toast.error("Import Failed"); 
    } finally { 
      setLoading(false); 
    }
  };

  if (fetching) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-primary">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Loading Architecture...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-700">
      <button onClick={() => navigate('/admin/sections')} className="flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">
        <ArrowLeft size={14} /> Back to Sections
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="bg-[#0f0f0f] border border-white/5 rounded-[2.5rem] p-10">
            <h2 className="text-2xl font-black italic uppercase mb-8">
              Section <span className="text-primary">{id ? 'Modification' : 'Architecture'}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <FormField label="Section ID" value={formData.Section_ID} onChange={(v: string) => setFormData({...formData, Section_ID: v})} disabled={!!id} placeholder="e.g., SEC001" />
              <FormField label="Book ID (Parent)" value={formData.Book_ID} onChange={(v: string) => setFormData({...formData, Book_ID: v})} placeholder="e.g., BOOK01" />
              <FormField label="Title (EN)" value={formData.Section_Title} onChange={(v: string) => setFormData({...formData, Section_Title: v})} />
              <FormField label="Title (AR)" value={formData.Section_Title_In_Arabic} onChange={(v: string) => setFormData({...formData, Section_Title_In_Arabic: v})} dir="rtl" />
              <FormField label="Order Number" value={formData.Section_Order} onChange={(v: string) => setFormData({...formData, Section_Order: v})} />
            </div>
            <button type="submit" disabled={loading} className="bg-primary text-black px-12 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all">
              {loading ? 'Processing...' : (id ? 'Commit Changes' : 'Create Section')}
            </button>
          </form>
        </div>

        {!id && (
          <div className="bg-[#0f0f0f] p-8 rounded-[2.5rem] border border-white/5 text-center h-fit sticky top-6">
            <h3 className="text-[10px] font-black uppercase italic mb-6 text-white">Bulk <span className="text-primary">Sync</span></h3>
            <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 relative mb-4 group hover:border-primary/50 transition-all cursor-pointer">
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={e => setFile(e.target.files?.[0] || null)} />
              <Upload className="mx-auto text-gray-500 mb-2 group-hover:text-primary transition-colors" size={32} />
              <p className="text-[9px] font-black text-gray-500 uppercase truncate px-2">{file ? file.name : 'Drop Sections Tab'}</p>
            </div>
            <button onClick={handleImport} disabled={loading || !file} className="w-full bg-white/5 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-white transition-all">Process Sheet</button>
          </div>
        )}
      </div>
    </div>
  );
};