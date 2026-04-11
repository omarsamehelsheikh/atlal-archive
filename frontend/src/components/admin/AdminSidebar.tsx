import { Link, useLocation } from 'react-router-dom';
import { User, Image, Book, LayoutDashboard, Database, Layers, Hash, ArrowRight } from 'lucide-react';
import { cn } from '../../utils/helpers';

const menuItems = [
  { icon: LayoutDashboard, label: 'Control Room', path: '/admin' },
  { icon: User, label: 'Artists', path: '/admin/artists' },
  { icon: Image, label: 'Artworks', path: '/admin/artworks' },
  { icon: Layers, label: 'Series', path: '/admin/series' },
  { icon: Book, label: 'Books', path: '/admin/books' },
  { icon: Database, label: 'Sections', path: '/admin/sections' },
  { icon: Hash, label: 'Taxonomy', path: '/admin/taxonomy' },
];

export const AdminSidebar = () => {
  const { pathname } = useLocation();
  return (
    <aside className="w-72 h-screen fixed left-0 top-0 bg-white border-r border-gray-100 p-8 flex flex-col">
      <div className="mb-12 flex items-center gap-3">
        <div className="w-8 h-8 bg-black rounded flex items-center justify-center font-black text-white italic text-xs">AA</div>
        <h2 className="text-sm font-black uppercase tracking-tighter italic">Atlal <span className="text-primary">Admin</span></h2>
      </div>
      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => (
          <Link key={item.path} to={item.path} className={cn("flex items-center justify-between p-4 rounded-2xl transition-all group", pathname.startsWith(item.path) ? "bg-black text-white shadow-xl" : "text-gray-400 hover:bg-gray-50 hover:text-black")}>
            <div className="flex items-center gap-3">
              <item.icon size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
            </div>
            <ArrowRight size={14} className={cn("opacity-0 group-hover:opacity-100 transition-all", pathname.startsWith(item.path) && "opacity-100")} />
          </Link>
        ))}
      </nav>
    </aside>
  );
};