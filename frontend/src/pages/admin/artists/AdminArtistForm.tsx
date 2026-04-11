import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminService } from '../../../services/api';
import { ArrowLeft, Save, Upload } from 'lucide-react';
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

export const AdminArtistForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState('identity');

  const [formData, setFormData] = useState({
    Artist_ID: '',
    Full_Name: '',
    Full_Name_In_Arabic: '',
    Gender: '',
    Age: '',
    Nationality: '',
    Nationality_In_Arabic: '',
    Birth_Year: '',
    Birth_Country: '',
    Birth_Country_In_Arabic: '',
    Birth_City: '',
    Birth_City_In_Arabic: '',
    Current_Country: '',
    Current_Country_In_Arabic: '',
    Current_City: '',
    Current_City_In_Arabic: '',
    Undergraduate_Degree: '',
    Postgraduate_Degree: '',
    Artistic_Practices: '',
    Fields: '',
    Bio_In_English: '',
    Bio_In_Arabic: '',
    Cloudinary_Image1: '',
    Cloudinary_Image2: '',
    Email: '',
    Website: '',
    Instagram: '',
    Status: 'Complete'
  });

  useEffect(() => {
    if (id) {
      AdminService.getArtistById(id).then((res: any) => {
        const artistData = res.data?.data; 
        if (artistData) {
          setFormData(artistData);
        }
      }).catch(() => toast.error("Record not found"));
    }
  }, [id]);

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await AdminService.upsertArtist(formData);
      toast.success(id ? "Archive Updated" : "Artist Created");
      navigate('/admin/artists');
    } catch (err) {
      toast.error("Operation Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleExcelImport = async () => {
    if (!file) return toast.error("Select file first");
    setLoading(true);
    try {
      await AdminService.importData('artist', file);
      toast.success("Excel Sync Complete");
      navigate('/admin/artists');
    } catch (err) {
      toast.error("Import Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">
          <ArrowLeft size={14} /> Back to Registry
        </button>
        <div className="flex gap-2">
          {['identity', 'origin', 'education', 'bio'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-primary text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
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
              <h2 className="text-2xl font-black italic uppercase mb-8">{id ? 'Edit' : 'Manual'} <span className="text-primary">Artist</span></h2>
              
              {activeTab === 'identity' && (
                <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4">
                  <FormField label="Artist ID" value={formData.Artist_ID} onChange={(v: string) => updateField('Artist_ID', v)} disabled={!!id} placeholder="AR01" />
                  <FormField label="Status" value={formData.Status} onChange={(v: string) => updateField('Status', v)} />
                  <FormField label="Full Name (EN)" value={formData.Full_Name} onChange={(v: string) => updateField('Full_Name', v)} />
                  <FormField label="Full Name (AR)" value={formData.Full_Name_In_Arabic} onChange={(v: string) => updateField('Full_Name_In_Arabic', v)} dir="rtl" />
                  <FormField label="Gender" value={formData.Gender} onChange={(v: string) => updateField('Gender', v)} />
                  <FormField label="Age" value={formData.Age} onChange={(v: string) => updateField('Age', v)} />
                  <FormField label="Email" value={formData.Email} onChange={(v: string) => updateField('Email', v)} />
                  <FormField label="Instagram" value={formData.Instagram} onChange={(v: string) => updateField('Instagram', v)} />
                  <FormField label="Website" value={formData.Website} onChange={(v: string) => updateField('Website', v)} />
                </div>
              )}

              {activeTab === 'origin' && (
                <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4">
                  <FormField label="Birth Year" value={formData.Birth_Year} onChange={(v: string) => updateField('Birth_Year', v)} />
                  <FormField label="Nationality (EN)" value={formData.Nationality} onChange={(v: string) => updateField('Nationality', v)} />
                  <FormField label="Birth Country (EN)" value={formData.Birth_Country} onChange={(v: string) => updateField('Birth_Country', v)} />
                  <FormField label="Birth Country (AR)" value={formData.Birth_Country_In_Arabic} onChange={(v: string) => updateField('Birth_Country_In_Arabic', v)} dir="rtl" />
                  <FormField label="Birth City (EN)" value={formData.Birth_City} onChange={(v: string) => updateField('Birth_City', v)} />
                  <FormField label="Birth City (AR)" value={formData.Birth_City_In_Arabic} onChange={(v: string) => updateField('Birth_City_In_Arabic', v)} dir="rtl" />
                  <FormField label="Current Country (EN)" value={formData.Current_Country} onChange={(v: string) => updateField('Current_Country', v)} />
                  <FormField label="Current City (EN)" value={formData.Current_City} onChange={(v: string) => updateField('Current_City', v)} />
                </div>
              )}

              {activeTab === 'education' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <FormField label="Undergraduate Degree" value={formData.Undergraduate_Degree} onChange={(v: string) => updateField('Undergraduate_Degree', v)} />
                  <FormField label="Postgraduate Degree" value={formData.Postgraduate_Degree} onChange={(v: string) => updateField('Postgraduate_Degree', v)} />
                  <FormField label="Fields" value={formData.Fields} onChange={(v: string) => updateField('Fields', v)} />
                  <FormField label="Artistic Practices" value={formData.Artistic_Practices} onChange={(v: string) => updateField('Artistic_Practices', v)} />
                </div>
              )}

              {activeTab === 'bio' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <FormField label="Cloudinary Image 1" value={formData.Cloudinary_Image1} onChange={(v: string) => updateField('Cloudinary_Image1', v)} />
                  <FormField label="Cloudinary Image 2" value={formData.Cloudinary_Image2} onChange={(v: string) => updateField('Cloudinary_Image2', v)} />
                  <TextAreaField label="Bio (EN)" value={formData.Bio_In_English} onChange={(v: string) => updateField('Bio_In_English', v)} />
                  <TextAreaField label="Bio (AR)" value={formData.Bio_In_Arabic} onChange={(v: string) => updateField('Bio_In_Arabic', v)} dir="rtl" />
                </div>
              )}
            </div>

            <div className="bg-white/5 p-6 border-t border-white/5 flex justify-end">
              <button type="submit" disabled={loading} className="bg-primary text-black px-12 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all">
                <Save size={18} className="inline mr-2" /> {id ? "Update Record" : "Commit to Archive"}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          {!id && (
            <div className="bg-[#0f0f0f] p-8 rounded-[2.5rem] border border-white/5 text-center h-fit sticky top-6">
              <h3 className="text-xs font-black uppercase italic mb-6">Bulk <span className="text-primary">Sync</span></h3>
              <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 relative group mb-4">
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setFile(e.target.files?.[0] || null)} />
                <Upload className="mx-auto text-gray-500 group-hover:text-primary transition-colors mb-2" size={32} />
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">{file ? file.name : 'Excel Sheet'}</p>
              </div>
              <button onClick={handleExcelImport} disabled={loading} className="w-full bg-white/5 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">Process Excel</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};