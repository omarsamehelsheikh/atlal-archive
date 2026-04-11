import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminService } from '../../../services/api';
import { ArrowLeft, Save, Upload, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const FormField = ({ label, value, onChange, dir = "ltr", disabled = false }: any) => (
  <div className="space-y-1">
    <label className="text-[9px] font-black uppercase text-gray-500 ml-1 tracking-widest">{label}</label>
    <input 
      value={value || ''} 
      onChange={(e) => onChange(e.target.value)} 
      dir={dir} 
      disabled={disabled}
      className={`w-full bg-white/5 border border-white/10 p-3 rounded-xl text-xs text-white outline-none focus:border-primary transition-all font-bold ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`} 
    />
  </div>
);

export const AdminBookForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    Book_ID: '',
    Book_Title: '',
    Title_In_Arabic: '',
    Description: ''
  });

  useEffect(() => {
    if (id && id !== 'undefined') {
      setFetching(true);
      AdminService.getBookById(id)
        .then((res: any) => {
          const bookData = res.data?.data || res.data;
          if (bookData) {
            setFormData({
              Book_ID: bookData.Book_ID || '',
              Book_Title: bookData.Book_Title || '',
              Title_In_Arabic: bookData.Title_In_Arabic || '',
              Description: bookData.Description || ''
            });
          }
        })
        .catch(() => toast.error("Failed to load book data"))
        .finally(() => setFetching(false));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.Book_ID) return toast.error("Book ID is required");
    
    setLoading(true);
    try {
      await AdminService.upsertBook(formData);
      toast.success(id ? "Book Updated" : "Book Created");
      navigate('/admin/books');
    } catch (err) { 
      toast.error("Save Failed"); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleImport = async () => {
    if (!file) return toast.error("Select file first");
    setLoading(true);
    try {
      await AdminService.importData('book', file);
      toast.success("Bulk Sync Complete");
      navigate('/admin/books');
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
        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Loading Book Details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-700">
      <button 
        onClick={() => navigate('/admin/books')} 
        className="flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors"
      >
        <ArrowLeft size={14} /> Back to Books
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="bg-[#0f0f0f] border border-white/5 rounded-[2.5rem] p-10">
            <h2 className="text-2xl font-black italic uppercase mb-8">
              {id ? 'Modify' : 'New'} <span className="text-primary">Book Entry</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <FormField label="Book ID" value={formData.Book_ID} onChange={(v: string) => setFormData({...formData, Book_ID: v})} disabled={!!id} />
              <FormField label="Title (EN)" value={formData.Book_Title} onChange={(v: string) => setFormData({...formData, Book_Title: v})} />
              <FormField label="Title (AR)" value={formData.Title_In_Arabic} onChange={(v: string) => setFormData({...formData, Title_In_Arabic: v})} dir="rtl" />
            </div>

            <div className="space-y-1 mb-8">
              <label className="text-[9px] font-black uppercase text-gray-500 ml-1 tracking-widest">Description</label>
              <textarea 
                value={formData.Description} 
                onChange={(e) => setFormData({...formData, Description: e.target.value})} 
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs h-32 text-white outline-none focus:border-primary transition-all font-bold resize-none" 
              />
            </div>

            <button type="submit" disabled={loading} className="bg-primary text-black px-12 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all disabled:opacity-50">
              {loading ? 'Processing...' : (id ? 'Update Book' : 'Save Book')}
            </button>
          </form>
        </div>

        {!id && (
          <div className="bg-[#0f0f0f] p-8 rounded-[2.5rem] border border-white/5 text-center h-fit sticky top-6">
            <h3 className="text-[10px] font-black uppercase italic mb-6">Bulk <span className="text-primary">Sync</span></h3>
            <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 relative mb-4 group hover:border-primary/50 transition-all cursor-pointer">
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setFile(e.target.files?.[0] || null)} />
              <Upload className="mx-auto text-gray-500 mb-2 group-hover:text-primary transition-colors" size={32} />
              <p className="text-[9px] font-black text-gray-500 uppercase truncate">{file ? file.name : 'Upload Books Tab'}</p>
            </div>
            <button onClick={handleImport} disabled={loading || !file} className="w-full bg-white/5 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">Run Excel Import</button>
          </div>
        )}
      </div>
    </div>
  );
};