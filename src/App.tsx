import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Menu, 
  X, 
  ShoppingBag, 
  BookOpen, 
  Laptop, 
  MapPin, 
  ChevronLeft, 
  ChevronRight,
  Upload,
  User,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Package,
  DollarSign,
  MessageSquare,
  ArrowRightLeft,
  Store
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  hostel: string;
  image: string;
  type: 'buy' | 'rent';
  description?: string;
  seller?: string;
  condition?: string;
  createdAt: string;
}

// --- Mock Data ---
const CATEGORIES = [
  { name: 'Fashion', icon: ShoppingBag },
  { name: 'Academics', icon: BookOpen },
  { name: 'Electronics', icon: Laptop },
  { name: 'Services', icon: Store },
];

const PRODUCTS: Product[] = [
  { 
    id: 1, 
    name: 'Calculus Textbook', 
    price: 2500, 
    category: 'Academics', 
    hostel: 'Hall 1', 
    image: 'https://picsum.photos/seed/book/400/400', 
    type: 'buy',
    description: 'Barely used Calculus textbook by James Stewart. 8th Edition. No markings inside.',
    seller: 'David Chen',
    condition: 'Like New',
    createdAt: '2024-02-20T10:00:00Z'
  },
  { 
    id: 2, 
    name: 'Designer Hoodie', 
    price: 5000, 
    category: 'Fashion', 
    hostel: 'Hall 4', 
    image: 'https://picsum.photos/seed/fashion/400/400', 
    type: 'buy',
    description: 'Oversized black hoodie, very comfortable. Size Large.',
    seller: 'Sarah Ade',
    condition: 'Good',
    createdAt: '2024-02-21T12:00:00Z'
  },
  { 
    id: 3, 
    name: 'Electric Kettle', 
    price: 1500, 
    category: 'Electronics', 
    hostel: 'Hall 2', 
    image: 'https://picsum.photos/seed/kettle/400/400', 
    type: 'rent',
    description: '1.5L Electric kettle. Heats up very fast. Available for weekly rent.',
    seller: 'Michael Obi',
    condition: 'Excellent',
    createdAt: '2024-02-22T09:00:00Z'
  },
  { 
    id: 4, 
    name: 'Scientific Calculator', 
    price: 3000, 
    category: 'Academics', 
    hostel: 'Hall 3', 
    image: 'https://picsum.photos/seed/calc/400/400', 
    type: 'buy',
    description: 'Casio fx-991EX. Perfect for engineering students.',
    seller: 'Amina J.',
    condition: 'New',
    createdAt: '2024-02-23T15:00:00Z'
  },
  { 
    id: 5, 
    name: 'Noise Cancelling Headphones', 
    price: 12000, 
    category: 'Electronics', 
    hostel: 'Hall 1', 
    image: 'https://picsum.photos/seed/audio/400/400', 
    type: 'buy',
    description: 'Sony WH-1000XM4. Amazing sound quality and noise cancellation.',
    seller: 'Tunde W.',
    condition: 'Excellent',
    createdAt: '2024-02-24T11:00:00Z'
  },
  { 
    id: 6, 
    name: 'Vintage Jacket', 
    price: 800, 
    category: 'Fashion', 
    hostel: 'Hall 4', 
    image: 'https://picsum.photos/seed/jacket/400/400', 
    type: 'rent',
    description: 'Cool vintage denim jacket. Rent for your weekend photoshoots!',
    seller: 'Blessing E.',
    condition: 'Vintage',
    createdAt: '2024-02-25T14:00:00Z'
  },
  { 
    id: 7, 
    name: 'Laptop Stand', 
    price: 4500, 
    category: 'Electronics', 
    hostel: 'Hall 3', 
    image: 'https://picsum.photos/seed/stand/400/400', 
    type: 'buy',
    description: 'Ergonomic aluminum laptop stand. Helps with posture.',
    seller: 'Kelechi O.',
    condition: 'New',
    createdAt: '2024-02-26T10:30:00Z'
  },
  { 
    id: 8, 
    name: 'White Sneakers', 
    price: 8500, 
    category: 'Fashion', 
    hostel: 'Hall 2', 
    image: 'https://picsum.photos/seed/shoes/400/400', 
    type: 'buy',
    description: 'Classic white sneakers, very versatile. Size 42.',
    seller: 'Joy A.',
    condition: 'Like New',
    createdAt: '2024-02-26T16:45:00Z'
  },
  { 
    id: 9, 
    name: 'LED Study Lamp', 
    price: 2000, 
    category: 'Electronics', 
    hostel: 'Hall 1', 
    image: 'https://picsum.photos/seed/lamp/400/400', 
    type: 'buy',
    description: 'Rechargeable LED lamp with 3 brightness levels.',
    seller: 'Samuel E.',
    condition: 'Excellent',
    createdAt: '2024-02-27T08:15:00Z'
  },
  { 
    id: 10, 
    name: 'Lab Coat', 
    price: 3500, 
    category: 'Academics', 
    hostel: 'Hall 4', 
    image: 'https://picsum.photos/seed/coat/400/400', 
    type: 'buy',
    description: 'Standard white lab coat for science students. Size Medium.',
    seller: 'Grace P.',
    condition: 'Good',
    createdAt: '2024-02-27T11:20:00Z'
  },
  { 
    id: 11, 
    name: 'Mini Dorm Fridge', 
    price: 15000, 
    category: 'Electronics', 
    hostel: 'Hall 2', 
    image: 'https://picsum.photos/seed/fridge/400/400', 
    type: 'rent',
    description: 'Compact fridge, perfect for keeping drinks and snacks cold.',
    seller: 'Victor M.',
    condition: 'Good',
    createdAt: '2024-02-27T13:00:00Z'
  },
  { 
    id: 12, 
    name: 'Yoga Mat', 
    price: 4000, 
    category: 'Services', 
    hostel: 'Hall 3', 
    image: 'https://picsum.photos/seed/yoga/400/400', 
    type: 'buy',
    description: 'Non-slip purple yoga mat. 6mm thickness.',
    seller: 'Chioma R.',
    condition: 'New',
    createdAt: '2024-02-27T15:30:00Z'
  },
];

const ADS = [
  { id: 1, title: 'Back to School Sale', subtitle: 'Up to 50% off on all textbooks', color: 'bg-indigo-600', image: 'https://picsum.photos/seed/ad1/800/400' },
  { id: 2, title: 'Rent a Laptop', subtitle: 'Affordable rates for students', color: 'bg-emerald-600', image: 'https://picsum.photos/seed/ad2/800/400' },
  { id: 3, title: 'Fresh Fashion', subtitle: 'New arrivals in campus style', color: 'bg-orange-500', image: 'https://picsum.photos/seed/ad3/800/400' },
];

// --- Components ---

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">{title}</h2>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            {children}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVerifiedSeller, setIsVerifiedSeller] = useState(false);
  const [isSellerMode, setIsSellerMode] = useState(false);
  const [isListingFormOpen, setIsListingFormOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeAd, setActiveAd] = useState(0);
  const [viewType, setViewType] = useState<'buy' | 'rent'>('buy');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high'>('newest');

  // Filtering and Sorting Logic
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesType = product.type === viewType;
    return matchesSearch && matchesCategory && matchesType;
  }).sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === 'price-low') {
      return a.price - b.price;
    } else if (sortBy === 'price-high') {
      return b.price - a.price;
    }
    return 0;
  });

  // Mock Seller Data
  const sellerStats = [
    { label: 'Total Sales', value: '₦45,000', icon: DollarSign, color: 'text-emerald-600' },
    { label: 'Active Listings', value: '3', icon: Package, color: 'text-blue-600' },
    { label: 'Messages', value: '12', icon: MessageSquare, color: 'text-orange-600' },
  ];

  const myListings = PRODUCTS.slice(0, 3);

  // Auto-slide ads
  useEffect(() => {
    if (isSellerMode) return;
    const timer = setInterval(() => {
      setActiveAd((prev) => (prev + 1) % ADS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isSellerMode]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsLoginOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsSellerMode(false);
    setIsProfileOpen(false);
  };

  const handleVerify = () => {
    setIsVerifiedSeller(true);
    setIsVerifyOpen(false);
    setIsSellerMode(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <span className="text-xl font-bold tracking-tight hidden sm:block">Beegee</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search for items, categories..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                {isVerifiedSeller && (
                  <button 
                    onClick={() => setIsSellerMode(!isSellerMode)}
                    className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all border-2 ${isSellerMode ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-900 border-slate-200 hover:border-primary'}`}
                  >
                    <ArrowRightLeft size={16} />
                    {isSellerMode ? 'Switch to Buyer' : 'Switch to Seller'}
                  </button>
                )}
                <button 
                  onClick={() => isVerifiedSeller ? setIsListingFormOpen(true) : setIsVerifyOpen(true)}
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full font-medium text-sm hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  <Plus size={18} />
                  {isVerifiedSeller ? 'List Item' : 'Become a Seller'}
                </button>
                <div 
                  onClick={() => setIsProfileOpen(true)}
                  className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm cursor-pointer hover:bg-slate-200 transition-all"
                >
                  <User size={20} className="text-slate-600" />
                </div>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setIsSignUpOpen(true)}
                  className="px-4 py-2 text-slate-600 font-medium text-sm hover:text-primary transition-colors"
                >
                  Sign Up
                </button>
                <button 
                  onClick={() => setIsLoginOpen(true)}
                  className="hidden sm:block px-4 py-2 bg-slate-100 text-slate-900 rounded-full font-medium text-sm hover:bg-slate-200 transition-colors"
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 border-r border-slate-200 p-6 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
          <div className="space-y-8">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Categories</h3>
              <nav className="space-y-1">
                <button 
                  onClick={() => setSelectedCategory('All')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all group ${selectedCategory === 'All' ? 'text-primary bg-primary/5' : 'text-slate-600 hover:text-primary hover:bg-primary/5'}`}
                >
                  <LayoutDashboard size={20} className="group-hover:scale-110 transition-transform" />
                  <span className="font-medium">All Items</span>
                </button>
                {CATEGORIES.map((cat) => (
                  <button 
                    key={cat.name} 
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all group ${selectedCategory === cat.name ? 'text-primary bg-primary/5' : 'text-slate-600 hover:text-primary hover:bg-primary/5'}`}
                  >
                    <cat.icon size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="font-medium">{cat.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Quick Links</h3>
              <nav className="space-y-1">
                <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:text-primary rounded-xl transition-all">
                  <MapPin size={20} />
                  <span className="font-medium">Nearby Items</span>
                </a>
                <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:text-primary rounded-xl transition-all">
                  <ShoppingBag size={20} />
                  <span className="font-medium">My Orders</span>
                </a>
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          {isSellerMode ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">Seller Dashboard</h1>
                  <p className="text-slate-500">Manage your listings and track your earnings.</p>
                </div>
                <button 
                  onClick={() => setIsListingFormOpen(true)}
                  className="px-6 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                >
                  <Plus size={20} />
                  New Listing
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {sellerStats.map((stat) => (
                  <div key={stat.label} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center ${stat.color}`}>
                      <stat.icon size={28} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                      <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* My Listings */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900">My Listings</h2>
                  <button className="text-primary font-bold text-sm">View All</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myListings.map((product) => (
                    <div key={product.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                      <div className="relative aspect-video">
                        <img src={product.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <div className="absolute top-4 right-4 px-3 py-1 bg-emerald-500 text-white rounded-full text-xs font-bold">Active</div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-slate-900 mb-1">{product.name}</h3>
                        <p className="text-lg font-bold text-primary">₦{product.price.toLocaleString()}</p>
                        <div className="flex gap-2 mt-4">
                          <button className="flex-1 py-2 bg-slate-100 text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all">Edit</button>
                          <button className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-all">Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Hero Slider */}
              <section className="relative h-64 md:h-80 rounded-3xl overflow-hidden mb-12 shadow-xl group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeAd}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="absolute inset-0"
                  >
                    <img 
                      src={ADS[activeAd].image} 
                      alt={ADS[activeAd].title} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-8 md:px-16 text-white">
                      <motion.h2 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl md:text-5xl font-bold mb-2"
                      >
                        {ADS[activeAd].title}
                      </motion.h2>
                      <motion.p 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-lg md:text-xl text-white/80 mb-6"
                      >
                        {ADS[activeAd].subtitle}
                      </motion.p>
                      <motion.button 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="w-fit px-8 py-3 bg-white text-slate-900 rounded-full font-bold hover:scale-105 transition-transform"
                      >
                        Shop Now
                      </motion.button>
                    </div>
                  </motion.div>
                </AnimatePresence>
                
                {/* Slider Controls */}
                <div className="absolute bottom-6 right-8 flex gap-2">
                  {ADS.map((_, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveAd(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${idx === activeAd ? 'w-8 bg-white' : 'bg-white/40'}`}
                    />
                  ))}
                </div>
              </section>

              {/* Toggle and Filters */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto">
                  <button 
                    onClick={() => setViewType('buy')}
                    className={`flex-1 md:w-32 py-2.5 rounded-xl font-bold text-sm transition-all ${viewType === 'buy' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Buy
                  </button>
                  <button 
                    onClick={() => setViewType('rent')}
                    className={`flex-1 md:w-32 py-2.5 rounded-xl font-bold text-sm transition-all ${viewType === 'rent' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Rent
                  </button>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="relative flex-1 md:flex-none">
                    <select 
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full md:w-auto appearance-none flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors outline-none cursor-pointer pr-10"
                    >
                      <option value="All">All Categories</option>
                      {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                  <div className="relative flex-1 md:flex-none">
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="w-full md:w-auto appearance-none flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors outline-none cursor-pointer pr-10"
                    >
                      <option value="newest">Sort: Newest</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <motion.div 
                      layout
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={() => setSelectedProduct(product)}
                      className="group bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer"
                    >
                      <div className="relative aspect-square overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-primary shadow-sm">
                          {product.category}
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-1 text-slate-400 text-xs font-medium mb-2">
                          <MapPin size={12} />
                          <span>📍 {product.hostel}</span>
                        </div>
                        <h3 className="font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-lg font-bold text-slate-900">₦{product.price.toLocaleString()}</span>
                          <button className="p-2 bg-slate-100 text-slate-900 rounded-xl hover:bg-primary hover:text-white transition-all">
                            <Plus size={20} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                      <Search size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">No items found</h3>
                    <p className="text-slate-500">Try adjusting your search or filters to find what you're looking for.</p>
                    <button 
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('All');
                      }}
                      className="mt-6 text-primary font-bold hover:underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {/* State 1: Frictionless Sign-Up Modal */}
      <Modal 
        isOpen={isSignUpOpen} 
        onClose={() => setIsSignUpOpen(false)} 
        title="Create your account"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
            <input 
              type="text" 
              placeholder="John Doe" 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
            <input 
              type="tel" 
              placeholder="080 0000 0000" 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <button className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-primary/20 mt-4">
            Create Account
          </button>
          <p className="text-center text-sm text-slate-500 mt-4">
            Already have an account? <button onClick={() => { setIsSignUpOpen(false); setIsLoginOpen(true); }} className="text-primary font-bold">Login</button>
          </p>
        </div>
      </Modal>

      {/* Login Modal */}
      <Modal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        title="Welcome back"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
            <input 
              type="tel" 
              placeholder="080 0000 0000" 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div className="flex justify-end">
            <button className="text-xs font-bold text-primary">Forgot Password?</button>
          </div>
          <button 
            onClick={handleLogin}
            className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-primary/20 mt-4"
          >
            Login
          </button>
          <p className="text-center text-sm text-slate-500 mt-4">
            Don't have an account? <button onClick={() => { setIsLoginOpen(false); setIsSignUpOpen(true); }} className="text-primary font-bold">Sign Up</button>
          </p>
        </div>
      </Modal>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-6 right-6 z-10 p-3 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full transition-all shadow-lg"
              >
                <X size={24} />
              </button>

              {/* Image Section */}
              <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-bold text-primary shadow-sm">
                  {selectedProduct.category}
                </div>
              </div>

              {/* Content Section */}
              <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto no-scrollbar flex flex-col">
                <div className="flex items-center gap-2 text-slate-400 text-sm font-medium mb-4">
                  <MapPin size={16} />
                  <span>📍 {selectedProduct.hostel}</span>
                  <span className="mx-2">•</span>
                  <span className="text-primary font-bold">{selectedProduct.condition}</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 leading-tight">
                  {selectedProduct.name}
                </h2>
                
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-3xl font-bold text-primary">₦{selectedProduct.price.toLocaleString()}</span>
                  {selectedProduct.type === 'rent' && <span className="text-slate-400 font-medium">/ week</span>}
                </div>

                <div className="space-y-6 flex-1">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h4>
                    <p className="text-slate-600 leading-relaxed">
                      {selectedProduct.description || "No description provided for this item."}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-slate-100">
                      <User className="text-slate-400" size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Seller</p>
                      <p className="font-bold text-slate-900">{selectedProduct.seller || "Anonymous Student"}</p>
                    </div>
                    <button className="ml-auto text-primary font-bold text-sm">View Profile</button>
                  </div>
                </div>

                <div className="mt-12 flex gap-4">
                  <button className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                    {selectedProduct.type === 'buy' ? 'Buy Now' : 'Rent Now'}
                  </button>
                  <button className="px-6 py-4 bg-slate-100 text-slate-900 rounded-2xl font-bold hover:bg-slate-200 transition-all">
                    Chat
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* State 2: Progressive Disclosure Verification Modal */}
      <Modal 
        isOpen={isVerifyOpen} 
        onClose={() => setIsVerifyOpen(false)} 
        title="Ready to start earning?"
      >
        <div className="space-y-6">
          <p className="text-slate-500 text-sm">Let's verify you to ensure a safe marketplace for everyone on campus.</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Matric Number</label>
              <input 
                type="text" 
                placeholder="UG/21/0000" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Hostel Address</label>
              <input 
                type="text" 
                placeholder="Hall 1, Room 204" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Upload Student ID</label>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:bg-white transition-all">
                  <Upload size={24} />
                </div>
                <p className="text-sm font-medium text-slate-600">Click or drag to upload</p>
                <p className="text-xs text-slate-400">PNG, JPG up to 5MB</p>
              </div>
            </div>
          </div>

          <button 
            onClick={handleVerify}
            className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-primary/20"
          >
            Submit for Verification
          </button>
        </div>
      </Modal>

      {/* Comprehensive Listing Form Modal */}
      <AnimatePresence>
        {isListingFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsListingFormOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              className="relative w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Create New Listing</h2>
                  <p className="text-slate-500 text-sm">Fill in the details to list your item or service.</p>
                </div>
                <button 
                  onClick={() => setIsListingFormOpen(false)}
                  className="p-3 hover:bg-slate-100 rounded-full transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column: Media */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Product Images</label>
                      <div className="aspect-square border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-3 bg-slate-50 hover:bg-primary/5 hover:border-primary/50 transition-all cursor-pointer group">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-primary shadow-sm transition-all">
                          <Upload size={32} />
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-slate-900">Upload Images</p>
                          <p className="text-xs text-slate-400">Up to 5 images, max 10MB each</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="aspect-square bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-300">
                          <Plus size={20} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Details */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Item Name</label>
                      <input type="text" placeholder="e.g. Scientific Calculator" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                        <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none appearance-none">
                          <option>Select Category</option>
                          {CATEGORIES.map(c => <option key={c.name}>{c.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Condition</label>
                        <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none appearance-none">
                          <option>New</option>
                          <option>Like New</option>
                          <option>Good</option>
                          <option>Fair</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Price (₦)</label>
                        <input type="number" placeholder="0.00" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Listing Type</label>
                        <div className="flex bg-slate-100 p-1 rounded-xl">
                          <button className="flex-1 py-2 bg-white text-primary rounded-lg font-bold text-xs shadow-sm">Sell</button>
                          <button className="flex-1 py-2 text-slate-500 font-bold text-xs">Rent</button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                      <textarea rows={4} placeholder="Describe your item..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none resize-none"></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Pickup Location (Hostel)</label>
                      <input type="text" placeholder="e.g. Hall 1, Room 302" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-slate-100 flex gap-4">
                <button 
                  onClick={() => setIsListingFormOpen(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-900 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setIsListingFormOpen(false)}
                  className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-primary/20"
                >
                  Post Listing
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Nav (Bottom) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex items-center justify-between z-40">
        <button className="p-2 text-primary"><ShoppingBag size={24} /></button>
        <button className="p-2 text-slate-400"><Search size={24} /></button>
        <button 
          onClick={() => isVerifiedSeller ? setIsListingFormOpen(true) : setIsVerifyOpen(true)}
          className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shadow-lg -mt-8 border-4 border-white"
        >
          <Plus size={24} />
        </button>
        <button className="p-2 text-slate-400"><BookOpen size={24} /></button>
        <button 
          onClick={() => isLoggedIn ? setIsProfileOpen(true) : setIsLoginOpen(true)}
          className="p-2 text-slate-400"
        >
          <User size={24} />
        </button>
      </div>

      {/* Profile Modal */}
      <Modal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        title="My Profile"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-2 border-primary/20 shadow-sm">
              <User size={32} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">John Doe</h3>
              <p className="text-sm text-slate-500">080 1234 5678</p>
              <div className="flex items-center gap-1 mt-1">
                <div className={`w-2 h-2 rounded-full ${isVerifiedSeller ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {isVerifiedSeller ? 'Verified Seller' : 'Buyer Account'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button 
              onClick={() => {
                setIsProfileOpen(false);
                if (isVerifiedSeller) setIsSellerMode(!isSellerMode);
                else setIsVerifyOpen(true);
              }}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Store size={20} />
                </div>
                <span className="font-bold text-slate-700">
                  {isVerifiedSeller ? (isSellerMode ? 'Switch to Buyer Mode' : 'Switch to Seller Mode') : 'Become a Seller'}
                </span>
              </div>
              <ChevronRight size={18} className="text-slate-300" />
            </button>

            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all">
                  <ShoppingBag size={20} />
                </div>
                <span className="font-bold text-slate-700">My Orders</span>
              </div>
              <ChevronRight size={18} className="text-slate-300" />
            </button>

            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all">
                  <MapPin size={20} />
                </div>
                <span className="font-bold text-slate-700">Saved Addresses</span>
              </div>
              <ChevronRight size={18} className="text-slate-300" />
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-4 text-red-600 hover:bg-red-50 rounded-xl transition-all font-bold"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
