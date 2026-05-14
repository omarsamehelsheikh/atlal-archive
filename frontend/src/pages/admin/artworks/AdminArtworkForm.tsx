import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminService } from '../../../services/api';
import { ArrowLeft, Save, Upload, Loader2, Plus, Trash2, FileSpreadsheet, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const FormField = ({ label, value, onChange, placeholder = "", dir = "ltr", disabled = false }: any) => (
  <div className="space-y-1">
    <label className="text-[9px] font-black uppercase text-gray-500 ml-1">{label}</label>
    <input 
      value={value || ''} 
      onChange={(e) => onChange(e.target.value)} 
      dir={dir} 
      disabled={disabled}
      className={`w-full bg-white/5 border border-white/10 p-3 rounded-xl text-xs text-white outline-none focus:border-primary transition-all font-bold ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`} 
      placeholder={placeholder}
    />
  </div>
);

const TextAreaField = ({ label, value, onChange, dir = "ltr" }: any) => (
  <div className="space-y-1">
    <label className="text-[9px] font-black uppercase text-gray-500 ml-1">{label}</label>
    <textarea 
      value={value || ''} 
      onChange={(e) => onChange(e.target.value)} 
      dir={dir} 
      className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-xs h-32 text-white outline-none focus:border-primary transition-all font-bold"
    />
  </div>
);

export const AdminArtworkForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState('general');

  const [formData, setFormData] = useState<any>({
    Artwork_ID: '',
    Artist_ID: '',
    Artist_Name: '',
    Title_In_English: '',
    Title_In_Arabic: '',
    Series_ID: '',
    Year_Created: '',
    Year_Finished: '',
    Medium: '',
    Artwork_Dimensions: '',
    Duration: '',
    Artwork_Description_In_English: '',
    Artwork_Description_In_Arabic: '',
    Film_Image_URL: '',
    // Use local state name for the inputs
    Cloudinary_Image_URLs: [''], 
    Section_ID: '',
    Section_Title: '',
    Book_ID: '',
    Status: 'Draft',
    Themes: '', 
    Tags: ''
  });

  useEffect(() => {
    if (id) {
      setFetching(true);
      AdminService.getArtworkById(id).then((res: any) => {
        const actualData = res.data?.data; 
        if (actualData) {
          setFormData({
            ...actualData,
            Themes: Array.isArray(actualData.Themes) ? actualData.Themes.join(', ') : '',
            Tags: Array.isArray(actualData.Tags) ? actualData.Tags.join(', ') : '',
            // Map the DB 'Cloudinary_Images' back to our form field name
            Cloudinary_Image_URLs: actualData.Cloudinary_Images?.length > 0 ? actualData.Cloudinary_Images : ['']
          });
        }
      })
      .catch(() => toast.error("Artwork not found"))
      .finally(() => setFetching(false));
    }
  }, [id]);

  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleImageUrlChange = (index: number, val: string) => {
    const updated = [...formData.Cloudinary_Image_URLs];
    updated[index] = val;
    updateField('Cloudinary_Image_URLs', updated);
  };

  const addImageField = () => {
    updateField('Cloudinary_Image_URLs', [...formData.Cloudinary_Image_URLs, '']);
  };

  const removeImageField = (index: number) => {
    const filtered = formData.Cloudinary_Image_URLs.filter((_: any, i: number) => i !== index);
    updateField('Cloudinary_Image_URLs', filtered.length ? filtered : ['']);
  };

  // Inside handleManualSubmit:
const handleManualSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  const finalImages = formData.Cloudinary_Image_URLs.filter((url: string) => url.trim() !== "");

  const finalData = {
    ...formData,
    Cloudinary_Images: finalImages, // Map local state to Schema key
    Themes: formData.Themes.split(',').map((v: any) => v.trim()).filter((v: any) => v !== ""),
    Tags: formData.Tags.split(',').map((v: any) => v.trim()).filter((v: any) => v !== "")
  };

  delete finalData.Cloudinary_Image_URLs;

  try {
    await AdminService.upsertArtwork(finalData);
    toast.success(id ? "Archive Updated" : "Artwork Cataloged");
    navigate('/admin/artworks');
  } catch (err) {
    toast.error("Manual Entry Failed");
  } finally {
    setLoading(false);
  }
};

  const handleExcelImport = async () => {
    if (!file) return toast.error("Select Excel file first");
    setLoading(true);
    try {
      await AdminService.importData('artwork', file);
      toast.success("Bulk Artwork Import Success");
      navigate('/admin/artworks');
    } catch (err: any) {
      toast.error("Excel Import Failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="h-96 flex items-center justify-center text-primary uppercase font-black text-[10px] tracking-[0.3em]">
      <Loader2 className="animate-spin mr-3" /> Syncing Piece...
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div className="space-y-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">
            <ArrowLeft size={14} /> Back to Gallery
          </button>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            Archive <span className="text-primary">Management</span>
          </h1>
        </div>

        <div className="flex gap-2">
          {['general', 'visuals', 'archive'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-primary text-black shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {!id && (
        <div className="bg-primary/5 border border-primary/20 p-6 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary/20 p-4 rounded-2xl text-primary">
              <FileSpreadsheet size={24} />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase italic">Fast Sync <span className="text-primary">Engine</span></h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Merges duplicate IDs and syncs image arrays automatically</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                onChange={e => setFile(e.target.files?.[0] || null)}
              />
              <div className="bg-black/40 border border-white/10 px-4 py-3 rounded-xl flex items-center justify-between">
                <span className="text-[9px] font-black uppercase text-gray-400 truncate max-w-[150px]">
                  {file ? file.name : "Select artworks.xlsx..."}
                </span>
                <Upload size={14} className="text-primary" />
              </div>
            </div>
            
            <button 
              onClick={handleExcelImport}
              disabled={loading || !file}
              className="bg-primary text-black px-8 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-white transition-all disabled:opacity-20"
            >
              {loading ? "Processing..." : "Run Import Script"}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <form onSubmit={handleManualSubmit} className="bg-[#0f0f0f] border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="p-10">
              <h2 className="text-2xl font-black italic uppercase mb-8">{id ? 'Modify' : 'Manual'} <span className="text-primary">Artwork Piece</span></h2>
              
              {activeTab === 'general' && (
                <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4">
                  <FormField label="Artwork ID" value={formData.Artwork_ID} onChange={(v: string) => updateField('Artwork_ID', v)} disabled={!!id} placeholder="AW000001" />
                  <FormField label="Artist ID" value={formData.Artist_ID} onChange={(v: string) => updateField('Artist_ID', v)} placeholder="ARXX" />
                  <FormField label="Artist Name" value={formData.Artist_Name} onChange={(v: string) => updateField('Artist_Name', v)} />
                  <FormField label="Title (EN)" value={formData.Title_In_English} onChange={(v: string) => updateField('Title_In_English', v)} />
                  <FormField label="Title (AR)" value={formData.Title_In_Arabic} onChange={(v: string) => updateField('Title_In_Arabic', v)} dir="rtl" />
                  <FormField label="Medium" value={formData.Medium} onChange={(v: string) => updateField('Medium', v)} />
                  <FormField label="Duration" value={formData.Duration} onChange={(v: string) => updateField('Duration', v)} />
                  <FormField label="Dimensions" value={formData.Artwork_Dimensions} onChange={(v: string) => updateField('Artwork_Dimensions', v)} />
                  <FormField label="Year Created" value={formData.Year_Created} onChange={(v: string) => updateField('Year_Created', v)} />
                  <FormField label="Year Finished" value={formData.Year_Finished} onChange={(v: string) => updateField('Year_Finished', v)} />
                </div>
              )}

              {activeTab === 'visuals' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase text-gray-500 ml-1">Cloudinary Image Gallery</label>
                    {formData.Cloudinary_Image_URLs.map((url: string, index: number) => (
                      <div key={index} className="flex gap-2 group">
                        <input 
                          value={url}
                          onChange={(e) => handleImageUrlChange(index, e.target.value)}
                          className="flex-1 bg-white/5 border border-white/10 p-3 rounded-xl text-xs text-white outline-none focus:border-primary transition-all font-bold"
                          placeholder="https://res.cloudinary.com/..."
                        />
                        <button type="button" onClick={() => removeImageField(index)} className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={addImageField} className="flex items-center gap-2 text-primary font-black text-[9px] uppercase tracking-widest mt-2 hover:text-white transition-colors">
                      <Plus size={14} /> Add Another Image
                    </button>
                  </div>
                  <TextAreaField label="Description (EN)" value={formData.Artwork_Description_In_English} onChange={(v: string) => updateField('Artwork_Description_In_English', v)} />
                  <TextAreaField label="Description (AR)" value={formData.Artwork_Description_In_Arabic} onChange={(v: string) => updateField('Artwork_Description_In_Arabic', v)} dir="rtl" />
                </div>
              )}

              {activeTab === 'archive' && (
                <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4">
                  <FormField label="Book ID" value={formData.Book_ID} onChange={(v: string) => updateField('Book_ID', v)} />
                  <FormField label="Section ID" value={formData.Section_ID} onChange={(v: string) => updateField('Section_ID', v)} />
                  <FormField label="Series ID" value={formData.Series_ID} onChange={(v: string) => updateField('Series_ID', v)} />
                  <FormField label="Theme IDs (Comma separated)" value={formData.Themes} onChange={(v: string) => updateField('Themes', v)} placeholder="THEME001, THEME002" />
                  <FormField label="Tag IDs (Comma separated)" value={formData.Tags} onChange={(v: string) => updateField('Tags', v)} placeholder="TAG001, TAG002" />
                  <FormField label="Status" value={formData.Status} onChange={(v: string) => updateField('Status', v)} />
                </div>
              )}
            </div>

            <div className="bg-white/5 p-6 border-t border-white/5 flex justify-end">
              <button type="submit" disabled={loading} className="bg-primary text-black px-12 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all shadow-lg">
                {loading ? <Loader2 className="animate-spin inline mr-2" size={16}/> : <Save size={18} className="inline mr-2" />}
                {id ? "Update Archive" : "Catalog Piece"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};