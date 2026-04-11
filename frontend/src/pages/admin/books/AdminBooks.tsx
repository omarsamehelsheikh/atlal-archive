import { useEffect, useState } from 'react';
import { AdminService } from '../../../services/api';
import { Plus, Trash2, Book as BookIcon, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const AdminBooks = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    try {
      const res: any = await AdminService.getAllBooks();
      setBooks(res.data?.data || []);
    } catch (err) { setBooks([]); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this book?")) return;
    try {
      await AdminService.deleteBook(id);
      toast.success("Book Removed");
      fetchData();
    } catch (err) { toast.error("Delete Failed"); }
  };

  const filtered = books.filter(b => 
    (b.Book_Title || "").toLowerCase().includes(search.toLowerCase()) || 
    (b.Book_ID || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black uppercase italic text-white tracking-tighter">Archive <span className="text-primary">Books</span></h1>
          <p className="text-gray-500 font-bold uppercase text-[9px] tracking-[0.4em] mt-1">Volume Management</p>
        </div>
        <Link to="/admin/books/add" className="bg-primary text-black px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-lg">
          <Plus size={16} className="inline mr-1" /> Create Book
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
        <input 
          placeholder="Search by Book ID or Title..." 
          className="w-full bg-[#0f0f0f] border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-primary text-white text-xs font-bold transition-all"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((b: any) => (
          <div key={b._id} className="bg-[#0f0f0f] p-8 rounded-[2.5rem] border border-white/5 group transition-all hover:border-white/10">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 text-primary"><BookIcon size={20} /></div>
              <div className="flex-1 min-w-0">
                <span className="text-[9px] text-primary font-black mb-1 block uppercase tracking-widest">{b.Book_ID}</span>
                <h4 className="font-black uppercase text-xs italic truncate text-white">{b.Book_Title || 'Untitled'}</h4>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to={`/admin/books/edit/${b.Book_ID}`} className="flex-1 py-3 bg-white/5 rounded-xl font-black text-[9px] uppercase text-center text-gray-300 hover:bg-white hover:text-black transition-all">Modify</Link>
              <button onClick={() => handleDelete(b.Book_ID)} className="px-4 py-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 transition-all"><Trash2 size={14}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};