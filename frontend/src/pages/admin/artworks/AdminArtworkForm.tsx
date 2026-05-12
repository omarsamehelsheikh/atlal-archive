import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminService } from '../../../services/api';
import { ArrowLeft, Save, Upload, Loader2, Plus, Trash2 } from 'lucide-react';
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
    Student: '',
    Artist_ID: '',
    Artist_Name: '',
    Title_In_English: '',
    Title_In_Arabic: '',
    Internal_Place_Holder_Title: '',
    Series_ID: '',
    Year_Created: '',
    Year_Finished: '',
    Medium: '',
    Artwork_Dimensions: '',
    Duration: '',
    Artwork_Description_In_English: '',
    Artwork_Description_In_Arabic: '',
    Film_Image_Description_In_English: '',
    Film_Image_Description_In_Arabic: '',
    Film_Image_Resolution: '',
    Film_Image_URL: '',
    Film_Image_Source: '',
    // UPDATED: Now managed as an array in state
    Cloudinary_Image_URLs: [''], 
    Section_ID: '',
    Section_Title: '',
    Book_ID: '',
    Status: 'Complete',
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
            // Ensure we have at least one empty field if empty
            Cloudinary_Image_URLs: actualData.Cloudinary_Image_URLs?.length > 0 ? actualData.Cloudinary_Image_URLs : ['']
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

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const finalData = {
      ...formData,
      Themes: formData.Themes.split(',').map((v: any) => v.trim()).filter((v: any) => v !== ""),
      Tags: formData.Tags.split(',').map((v: any) => v.trim()).filter((v: any) => v !== ""),
      Cloudinary_Image_URLs: formData.Cloudinary_Image_URLs.filter((url: string) => url.trim() !== "")
    };

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
      <div className="flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">
          <ArrowLeft size={14} /> Back to Gallery
        </button>
        <div className="flex gap-2">
          {['general', 'visuals', 'archive'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-primary text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

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

        <div className="space-y-6">
          {!id && (
            <div className="bg-[#0f0f0f] p-8 rounded-[2.5rem] border border-white/5 text-center h-fit sticky top-6">
              <h3 className="text-xs font-black uppercase italic mb-6">Bulk <span className="text-primary">Sync</span></h3>
              <div className="border-2 border-dashed border-white/10 rounded-2xl p-10 relative group mb-4 cursor-pointer hover:border-primary/50 transition-all">
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer z-20" 
                  onChange={e => {
                    const selected = e.target.files?.[0] || null;
                    setFile(selected);
                  }} 
                />
                <Upload className="mx-auto text-gray-500 group-hover:text-primary transition-colors mb-4" size={32} />
                <p className="text-[9px] font-black text-gray-500 uppercase truncate px-2">
                  {file ? file.name : 'Drop Spreadsheet'}
                </p>
              </div>
              <button 
                onClick={handleExcelImport} 
                disabled={loading || !file} 
                className="w-full bg-white/5 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all disabled:opacity-30"
              >
                {loading ? 'Processing...' : 'Process'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};