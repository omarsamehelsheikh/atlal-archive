import { useEffect, useState } from 'react';
import { AdminService } from '../../../services/api';
import { Plus, Trash2, User, Search, FileSpreadsheet, Upload, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const AdminArtists = () => {
  const [artists, setArtists] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);

  const fetchData = async () => {
    try {
      const res: any = await AdminService.getAllArtists();
      const actualData = res.data?.data || [];
      setArtists(Array.isArray(actualData) ? actualData : []);
    } catch (err) { 
      setArtists([]); 
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Permanent Archive Deletion?")) return;
    try {
      await AdminService.deleteArtist(id);
      toast.success("Record Deleted");
      fetchData();
    } catch (err) { 
      toast.error("Delete Failed"); 
    }
  };

  const handleExcelImport = async () => {
    if (!file) return toast.error("Select Artist Excel file first");
    setImporting(true);
    try {
      await AdminService.importData('artist', file);
      toast.success("Personnel Registry Synced");
      setFile(null);
      fetchData(); // Refresh the list after import
    } catch (err: any) {
      toast.error("Import Failed");
    } finally {
      setImporting(false);
    }
  };

  const filtered = artists.filter(a => 
    (a.Full_Name || "").toLowerCase().includes(search.toLowerCase()) || 
    (a.Artist_ID || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black uppercase italic text-white">Archive <span className="text-primary">Artists</span></h1>
          <p className="text-gray-500 font-bold uppercase text-[9px] tracking-[0.4em] mt-1">Personnel Registry</p>
        </div>
        <Link to="/admin/artists/add" className="bg-primary text-black px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-lg">
          <Plus size={16} className="inline mr-1" /> Register Artist
        </Link>
      </div>

      {/* FAST SYNC ENGINE - Added here for Artists Registry */}
      <div className="bg-primary/5 border border-primary/20 p-6 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-primary/20 p-4 rounded-2xl text-primary">
            <FileSpreadsheet size={24} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase italic text-white">Registry <span className="text-primary">Sync</span></h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Upload artist_registry.xlsx to bulk update personnel</p>
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
            {importing ? <Loader2 size={14} className="animate-spin" /> : "Sync Registry"}
          </button>
        </div>
      </div>

      {/* SEARCH BOX */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
        <input 
          placeholder="Search Registry by Name or ID..." 
          className="w-full bg-[#0f0f0f] border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-primary text-white text-xs font-bold transition-all"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ARTIST CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((artist: any) => (
          <div key={artist._id} className="bg-[#0f0f0f] p-8 rounded-[2.5rem] border border-white/5 group transition-all hover:border-white/10">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center overflow-hidden border border-white/10">
                {artist.Cloudinary_Image1 || artist.Cloudinary_Image2 ? (
                  <img src={artist.Cloudinary_Image1 || artist.Cloudinary_Image2} className="w-full h-full object-cover" alt="" />
                ) : (
                  <User size={30} className="text-gray-700" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[9px] text-primary font-black mb-1 block uppercase">{artist.Artist_ID}</span>
                <h4 className="font-black uppercase text-sm italic truncate text-white">{artist.Full_Name}</h4>
                <p className="text-[10px] font-bold text-gray-500 uppercase">{artist.Birth_Country || 'Global'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link to={`/admin/artists/edit/${artist.Artist_ID}`} className="py-3 bg-white/5 rounded-xl font-black text-[9px] uppercase text-center text-gray-300 hover:bg-white hover:text-black transition-all">Modify</Link>
              <button onClick={() => handleDelete(artist.Artist_ID)} className="py-3 bg-red-500/10 text-red-500 rounded-xl font-black text-[9px] uppercase hover:bg-red-500 hover:text-white transition-all">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};