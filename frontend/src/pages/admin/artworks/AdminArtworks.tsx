import { useEffect, useState } from 'react';
import { AdminService } from '../../../services/api';
import { Plus, Trash2, Search, FileSpreadsheet, Upload, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const AdminArtworks = () => {
  const [artworks, setArtworks] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);

  const fetchData = async () => {
    try {
      const res: any = await AdminService.getAllArtworks();
      setArtworks(res.data?.data || []);
    } catch (err) { 
      setArtworks([]); 
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Permanent Archive Deletion?")) return;
    try {
      await AdminService.deleteArtwork(id);
      toast.success("Piece Removed");
      fetchData();
    } catch (err) { 
      toast.error("Delete Failed"); 
    }
  };

  const handleExcelImport = async () => {
    if (!file) return toast.error("Select Artwork Excel file first");
    setImporting(true);
    try {
      // Changed to 'artwork' to target the correct endpoint
      await AdminService.importData('artwork', file);
      toast.success("Gallery Registry Synced");
      setFile(null);
      fetchData();
    } catch (err: any) {
      toast.error("Import Failed");
    } finally {
      setImporting(false);
    }
  };

  const filtered = artworks.filter(art => 
    (art.Title_In_English || "").toLowerCase().includes(search.toLowerCase()) || 
    (art.Artwork_ID || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black uppercase italic text-white tracking-tighter">Gallery <span className="text-primary">Artworks</span></h1>
          <p className="text-gray-500 font-bold uppercase text-[9px] tracking-[0.4em] mt-1">Visual Content Management</p>
        </div>
        <Link to="/admin/artworks/add" className="bg-primary text-black px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-lg">
          <Plus size={16} className="inline mr-1" /> Catalog Piece
        </Link>
      </div>

      {/* GALLERY SYNC ENGINE - Switched to Artworks */}
      <div className="bg-primary/5 border border-primary/20 p-6 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-primary/20 p-4 rounded-2xl text-primary">
            <FileSpreadsheet size={24} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase italic text-white">Gallery <span className="text-primary">Sync</span></h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Upload artwork_registry.xlsx to bulk update catalog</p>
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
                {file ? file.name : "Select Spreadsheet..."}
              </span>
              <Upload size={14} className="text-primary" />
            </div>
          </div>
          
          <button 
            onClick={handleExcelImport}
            disabled={importing || !file}
            className="bg-primary text-black px-8 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-white transition-all disabled:opacity-20 flex items-center gap-2"
          >
            {importing ? <Loader2 size={14} className="animate-spin" /> : "Sync Gallery"}
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
        <input 
          placeholder="Filter by ID or English Title..." 
          className="w-full bg-[#0f0f0f] border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-primary text-white text-xs font-bold transition-all"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((art: any) => (
          <div key={art._id} className="bg-[#0f0f0f] rounded-[2.5rem] overflow-hidden border border-white/5 group hover:border-white/10 transition-all">
            <div className="h-56 bg-white/5 flex items-center justify-center overflow-hidden relative">
              <img src={art.Cloudinary_Image_URL || art.Film_Image_URL} className="w-full h-full object-cover" alt="" />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-[9px] font-black uppercase text-primary tracking-widest">{art.Artwork_ID}</div>
            </div>
            <div className="p-8">
              <h4 className="font-black uppercase text-xs italic truncate text-white mb-1">{art.Title_In_English || 'Untitled Piece'}</h4>
              <p className="text-[10px] font-bold text-gray-500 mb-6 uppercase tracking-widest">Artist: {art.Artist_Name || art.Artist_ID}</p>
              <div className="flex gap-2">
                <Link to={`/admin/artworks/edit/${art.Artwork_ID}`} className="flex-1 py-3 bg-white/5 rounded-xl font-black text-[9px] uppercase text-center text-gray-300 hover:bg-white hover:text-black transition-all">Modify</Link>
                <button onClick={() => handleDelete(art.Artwork_ID)} className="px-4 py-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 transition-all"><Trash2 size={14}/></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};