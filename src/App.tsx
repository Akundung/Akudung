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
  Store,
  Wallet,
  CheckCircle,
  Clock,
  AlertCircle,
  Star,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  runTransaction,
  increment,
  or
} from './firebase';

// --- Types ---
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  hostel: string;
  image: string;
  type: 'buy' | 'rent';
  description?: string;
  sellerId: string;
  sellerName?: string;
  condition?: string;
  rating?: number;
  createdAt: any;
}

interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  productId: string;
  productName: string;
  amount: number;
  status: 'locked' | 'released' | 'cancelled';
  createdAt: any;
}

interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  balance: number;
  isVerifiedSeller: boolean;
  bankName?: string;
  accountNumber?: string;
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
    id: '1',
    name: 'Calculus Textbook',
    price: 2500,
    category: 'Academics',
    hostel: 'Hall 1',
    image: 'https://picsum.photos/seed/book/400/400',
    type: 'buy',
    description: 'Barely used Calculus textbook by James Stewart. 8th Edition. No markings inside.',
    sellerId: 'mock-1',
    sellerName: 'David Chen',
    condition: 'Like New',
    createdAt: { seconds: Date.now() / 1000 }
  },
  {
    id: '2',
    name: 'Designer Hoodie',
    price: 5000,
    category: 'Fashion',
    hostel: 'Hall 4',
    image: 'https://picsum.photos/seed/fashion/400/400',
    type: 'buy',
    description: 'Oversized black hoodie, very comfortable. Size Large.',
    sellerId: 'mock-2',
    sellerName: 'Sarah Ade',
    condition: 'Good',
    createdAt: { seconds: Date.now() / 1000 }
  },
  {
    id: '3',
    name: 'Electric Kettle',
    price: 1500,
    category: 'Electronics',
    hostel: 'Hall 2',
    image: 'https://picsum.photos/seed/kettle/400/400',
    type: 'rent',
    description: '1.5L Electric kettle. Heats up very fast. Available for weekly rent.',
    sellerId: 'mock-3',
    sellerName: 'Michael Obi',
    condition: 'Excellent',
    createdAt: { seconds: Date.now() / 1000 }
  },
  {
    id: '4',
    name: 'Scientific Calculator',
    price: 3000,
    category: 'Academics',
    hostel: 'Hall 3',
    image: 'https://picsum.photos/seed/calc/400/400',
    type: 'buy',
    description: 'Casio fx-991EX. Perfect for engineering students.',
    sellerId: 'mock-4',
    sellerName: 'Amina J.',
    condition: 'New',
    createdAt: { seconds: Date.now() / 1000 }
  },
  {
    id: '5',
    name: 'Noise Cancelling Headphones',
    price: 12000,
    category: 'Electronics',
    hostel: 'Hall 1',
    image: 'https://picsum.photos/seed/audio/400/400',
    type: 'buy',
    description: 'Sony WH-1000XM4. Amazing sound quality and noise cancellation.',
    sellerId: 'mock-5',
    sellerName: 'Tunde W.',
    condition: 'Excellent',
    createdAt: { seconds: Date.now() / 1000 }
  },
  {
    id: '6',
    name: 'Vintage Jacket',
    price: 800,
    category: 'Fashion',
    hostel: 'Hall 4',
    image: 'https://picsum.photos/seed/jacket/400/400',
    type: 'rent',
    description: 'Cool vintage denim jacket. Rent for your weekend photoshoots!',
    sellerId: 'mock-6',
    sellerName: 'Blessing E.',
    condition: 'Vintage',
    createdAt: { seconds: Date.now() / 1000 }
  },
  {
    id: '7',
    name: 'Laptop Stand',
    price: 4500,
    category: 'Electronics',
    hostel: 'Hall 3',
    image: 'https://picsum.photos/seed/stand/400/400',
    type: 'buy',
    description: 'Ergonomic aluminum laptop stand. Helps with posture.',
    sellerId: 'mock-7',
    sellerName: 'Kelechi O.',
    condition: 'New',
    createdAt: { seconds: Date.now() / 1000 }
  },
  {
    id: '8',
    name: 'White Sneakers',
    price: 8500,
    category: 'Fashion',
    hostel: 'Hall 2',
    image: 'https://picsum.photos/seed/shoes/400/400',
    type: 'buy',
    description: 'Classic white sneakers, very versatile. Size 42.',
    sellerId: 'mock-8',
    sellerName: 'Joy A.',
    condition: 'Like New',
    createdAt: { seconds: Date.now() / 1000 }
  },
  {
    id: '9',
    name: 'LED Study Lamp',
    price: 2000,
    category: 'Electronics',
    hostel: 'Hall 1',
    image: 'https://picsum.photos/seed/lamp/400/400',
    type: 'buy',
    description: 'Rechargeable LED lamp with 3 brightness levels.',
    sellerId: 'mock-9',
    sellerName: 'Samuel E.',
    condition: 'Excellent',
    createdAt: { seconds: Date.now() / 1000 }
  },
  {
    id: '10',
    name: 'Lab Coat',
    price: 3500,
    category: 'Academics',
    hostel: 'Hall 4',
    image: 'https://picsum.photos/seed/coat/400/400',
    type: 'buy',
    description: 'Standard white lab coat for science students. Size Medium.',
    sellerId: 'mock-10',
    sellerName: 'Grace P.',
    condition: 'Good',
    createdAt: { seconds: Date.now() / 1000 }
  },
  {
    id: '11',
    name: 'Mini Dorm Fridge',
    price: 15000,
    category: 'Electronics',
    hostel: 'Hall 2',
    image: 'https://picsum.photos/seed/fridge/400/400',
    type: 'rent',
    description: 'Compact fridge, perfect for keeping drinks and snacks cold.',
    sellerId: 'mock-11',
    sellerName: 'Victor M.',
    condition: 'Good',
    createdAt: { seconds: Date.now() / 1000 }
  },
  {
    id: '12',
    name: 'Yoga Mat',
    price: 4000,
    category: 'Services',
    hostel: 'Hall 3',
    image: 'https://picsum.photos/seed/yoga/400/400',
    type: 'buy',
    description: 'Non-slip purple yoga mat. 6mm thickness.',
    sellerId: 'mock-12',
    sellerName: 'Chioma R.',
    condition: 'New',
    createdAt: { seconds: Date.now() / 1000 }
  },
  {
    id: '13',
    name: 'Gaming Mouse',
    price: 12000,
    category: 'Electronics',
    hostel: 'Hall 1',
    image: 'https://picsum.photos/seed/mouse/400/400',
    type: 'buy',
    description: 'Logitech G502 Hero. High performance gaming mouse.',
    sellerId: 'mock-13',
    sellerName: 'Femi A.',
    condition: 'New',
    rating: 4.8,
    createdAt: { seconds: Date.now() / 1000 }
  },
  {
    id: '14',
    name: 'Dumbbell Set',
    price: 500,
    category: 'Services',
    hostel: 'Hall 5',
    image: 'https://picsum.photos/seed/gym/400/400',
    type: 'rent',
    description: '2x 5kg dumbbells. Rent for your home workouts.',
    sellerId: 'mock-14',
    sellerName: 'Emeka N.',
    condition: 'Good',
    rating: 4.3,
    createdAt: { seconds: Date.now() / 1000 }
  },
  {
    id: '15',
    name: 'Electric Iron',
    price: 3500,
    category: 'Electronics',
    hostel: 'Hall 2',
    image: 'https://picsum.photos/seed/iron/400/400',
    type: 'buy',
    description: 'Dry iron with non-stick soleplate. Very reliable.',
    sellerId: 'mock-15',
    sellerName: 'Bisi O.',
    condition: 'Excellent',
    rating: 4.6,
    createdAt: { seconds: Date.now() / 1000 }
  },
  {
    id: '16',
    name: 'Power Bank',
    price: 1000,
    category: 'Electronics',
    hostel: 'Hall 4',
    image: 'https://picsum.photos/seed/power/400/400',
    type: 'rent',
    description: '20,000mAh power bank. Rent for long study nights.',
    sellerId: 'mock-16',
    sellerName: 'Chidi K.',
    condition: 'Excellent',
    rating: 4.7,
    createdAt: { seconds: Date.now() / 1000 }
  },
  {
    id: '17',
    name: 'Novel Collection',
    price: 2500,
    category: 'Academics',
    hostel: 'Hall 3',
    image: 'https://picsum.photos/seed/novels/400/400',
    type: 'buy',
    description: 'A set of 5 classic African literature novels.',
    sellerId: 'mock-17',
    sellerName: 'Ngozi U.',
    condition: 'Good',
    rating: 4.5,
    createdAt: { seconds: Date.now() / 1000 }
  },
  {
    id: '18',
    name: 'Bicycle',
    price: 2000,
    category: 'Services',
    hostel: 'Hall 1',
    image: 'https://picsum.photos/seed/bike/400/400',
    type: 'rent',
    description: 'Mountain bike for easy campus commute. Weekly rent.',
    sellerId: 'mock-18',
    sellerName: 'Uche V.',
    condition: 'Fair',
    rating: 4.1,
    createdAt: { seconds: Date.now() / 1000 }
  },
  {
    id: '19',
    name: 'Canvas Painting',
    price: 15000,
    category: 'Fashion',
    hostel: 'Hall 5',
    image: 'https://picsum.photos/seed/art/400/400',
    type: 'buy',
    description: 'Original hand-painted abstract art on canvas.',
    sellerId: 'mock-19',
    sellerName: 'Kemi L.',
    condition: 'New',
    rating: 5.0,
    createdAt: { seconds: Date.now() / 1000 }
  },
  {
    id: '20',
    name: 'Projector',
    price: 5000,
    category: 'Electronics',
    hostel: 'Hall 2',
    image: 'https://picsum.photos/seed/projector/400/400',
    type: 'rent',
    description: 'HD Projector for movie nights or presentations. Daily rent.',
    sellerId: 'mock-20',
    sellerName: 'Sola M.',
    condition: 'Excellent',
    rating: 4.9,
    createdAt: { seconds: Date.now() / 1000 }
  },
  {
    id: '21',
    name: 'Desk Chair',
    price: 18000,
    category: 'Services',
    hostel: 'Hall 4',
    image: 'https://picsum.photos/seed/chair/400/400',
    type: 'buy',
    description: 'Ergonomic office chair with lumbar support.',
    sellerId: 'mock-21',
    sellerName: 'Segun T.',
    condition: 'Like New',
    rating: 4.7,
    createdAt: { seconds: Date.now() / 1000 }
  },
  {
    id: '22',
    name: 'Microwave',
    price: 3000,
    category: 'Electronics',
    hostel: 'Hall 3',
    image: 'https://picsum.photos/seed/microwave/400/400',
    type: 'rent',
    description: '700W Microwave. Perfect for reheating meals. Weekly rent.',
    sellerId: 'mock-22',
    sellerName: 'Abiola S.',
    condition: 'Good',
    rating: 4.4,
    createdAt: { seconds: Date.now() / 1000 }
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
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isSellerMode, setIsSellerMode] = useState(false);
  const [isListingFormOpen, setIsListingFormOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isInsufficientFundsOpen, setIsInsufficientFundsOpen] = useState(false);
  const [isConfirmPurchaseOpen, setIsConfirmPurchaseOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeAd, setActiveAd] = useState(0);
  const [viewType, setViewType] = useState<'buy' | 'rent'>('buy');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high'>('newest');
  const [loading, setLoading] = useState(false);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Sync user profile
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          const newProfile: UserProfile = {
            uid: currentUser.uid,
            displayName: currentUser.displayName || 'Anonymous',
            email: currentUser.email || '',
            balance: 0,
            isVerifiedSeller: false
          };
          await setDoc(userRef, newProfile);
          setUserProfile(newProfile);
        } else {
          // Listen for profile changes (balance updates)
          onSnapshot(userRef, (doc) => {
            setUserProfile(doc.data() as UserProfile);
          });
        }

        // Listen for user's orders (both as buyer and seller)
        const ordersQuery = query(
          collection(db, 'orders'),
          or(
            where('buyerId', '==', currentUser.uid),
            where('sellerId', '==', currentUser.uid)
          )
        );
        onSnapshot(ordersQuery, (snapshot) => {
          setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
        });
      } else {
        setUserProfile(null);
        setOrders([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Products Listener
  useEffect(() => {
    const q = collection(db, 'products');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const firestoreProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      // Merge mock products with firestore products
      setProducts([...PRODUCTS, ...firestoreProducts]);
    });
    return () => unsubscribe();
  }, []);

  // Filtering and Sorting Logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesType = product.type === viewType;
    return matchesSearch && matchesCategory && matchesType;
  }).sort((a, b) => {
    if (sortBy === 'newest') {
      return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
    } else if (sortBy === 'price-low') {
      return a.price - b.price;
    } else if (sortBy === 'price-high') {
      return b.price - a.price;
    }
    return 0;
  });

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsSellerMode(false);
    setIsProfileOpen(false);
  };

  const handleTopUp = async (amount: number) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    try {
      await setDoc(userRef, {
        balance: increment(amount)
      }, { merge: true });
      alert(`₦${amount.toLocaleString()} added to your wallet!`);
    } catch (error) {
      console.error("Top up failed", error);
      alert("Top up failed");
    }
  };

  const handleBuyNow = (product: Product) => {
    if (!user) {
      alert("Please login to buy items");
      return;
    }
    if (user.uid === product.sellerId) {
      alert("You cannot buy your own item");
      return;
    }
    if ((userProfile?.balance || 0) < product.price) {
      setIsInsufficientFundsOpen(true);
      return;
    }
    setIsConfirmPurchaseOpen(true);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedProduct || !user) return;

    setLoading(true);
    try {
      await runTransaction(db, async (transaction) => {
        const buyerRef = doc(db, 'users', user.uid);
        const buyerSnap = await transaction.get(buyerRef);
        const currentBalance = buyerSnap.data()?.balance || 0;

        if (currentBalance < selectedProduct.price) {
          throw new Error("Insufficient balance");
        }

        // 1. Deduct from buyer
        transaction.set(buyerRef, { balance: currentBalance - selectedProduct.price }, { merge: true });

        // 2. Create Order (Locked status)
        const orderRef = doc(collection(db, 'orders'));
        transaction.set(orderRef, {
          buyerId: user.uid,
          sellerId: selectedProduct.sellerId,
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          amount: selectedProduct.price,
          status: 'locked',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      });
      alert("Purchase successful! Funds are locked in escrow until you receive the item.");
      setIsConfirmPurchaseOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Transaction failed: ", error);
      alert("Transaction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsReceived = async (order: Order) => {
    setLoading(true);
    try {
      await runTransaction(db, async (transaction) => {
        const orderRef = doc(db, 'orders', order.id);
        const sellerRef = doc(db, 'users', order.sellerId);
        
        const sellerSnap = await transaction.get(sellerRef);
        const sellerBalance = sellerSnap.data()?.balance || 0;

        // 1. Update Order status
        transaction.update(orderRef, { 
          status: 'released',
          updatedAt: serverTimestamp()
        });

        // 2. Add funds to seller
        if (sellerSnap.exists()) {
          transaction.update(sellerRef, { balance: sellerBalance + order.amount });
        } else {
          // For mock sellers, we create the profile if it doesn't exist so the transaction succeeds
          transaction.set(sellerRef, { 
            balance: sellerBalance + order.amount,
            uid: order.sellerId,
            displayName: 'Mock Seller',
            isVerifiedSeller: true
          }, { merge: true });
        }
      });
      alert("Funds released to seller. Thank you for your purchase!");
    } catch (error) {
      console.error("Release failed: ", error);
      alert("Failed to release funds.");
    } finally {
      setLoading(false);
    }
  };

  const handlePostListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    const formData = new FormData(e.target as HTMLFormElement);
    const newProduct = {
      name: formData.get('name'),
      price: Number(formData.get('price')),
      category: formData.get('category'),
      condition: formData.get('condition'),
      description: formData.get('description'),
      hostel: formData.get('hostel'),
      type: viewType,
      image: `https://picsum.photos/seed/${Math.random()}/400/400`,
      sellerId: user.uid,
      sellerName: user.displayName,
      rating: 4 + Math.random(), // Random rating between 4 and 5 for new items
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, 'products'), newProduct);
      setIsListingFormOpen(false);
      alert("Item listed successfully!");
    } catch (error) {
      console.error("Listing failed", error);
    }
  };

  const handleWithdraw = async (amount: number) => {
    if (!userProfile || userProfile.balance < amount) {
      alert("Insufficient balance");
      return;
    }
    if (!userProfile.accountNumber) {
      alert("Please add your bank details in your profile first.");
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, 'users', userProfile.uid);
      await setDoc(userRef, {
        balance: increment(-amount)
      }, { merge: true });
      alert(`Withdrawal of ₦${amount.toLocaleString()} to ${userProfile.bankName} initiated!`);
    } catch (error) {
      console.error("Withdrawal failed", error);
      alert("Withdrawal failed");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBankDetails = async (bankName: string, accountNumber: string) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        bankName,
        accountNumber
      });
      alert("Bank details updated!");
    } catch (error) {
      console.error("Update failed", error);
      alert("Failed to update bank details");
    }
  };

  // Seller Data
  const sellerProducts = products.filter(p => p.sellerId === user?.uid);
  const sellerOrders = orders.filter(o => o.sellerId === user?.uid);
  
  const sellerStats = [
    { label: 'Total Sales', value: `₦${sellerOrders.reduce((acc, o) => acc + (o.status === 'released' ? o.amount : 0), 0).toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600' },
    { label: 'Active Listings', value: sellerProducts.length.toString(), icon: Package, color: 'text-blue-600' },
    { label: 'Messages', value: '0', icon: MessageSquare, color: 'text-orange-600' },
  ];

  const myListings = sellerProducts.slice(0, 3);

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
            {user ? (
              <>
                <div 
                  onClick={() => setIsWalletOpen(true)}
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full font-bold text-sm cursor-pointer hover:bg-emerald-100 transition-all border border-emerald-100"
                >
                  <Wallet size={16} />
                  ₦{userProfile?.balance?.toLocaleString() || 0}
                </div>
                {userProfile?.isVerifiedSeller && (
                  <button 
                    onClick={() => setIsSellerMode(!isSellerMode)}
                    className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all border-2 ${isSellerMode ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-900 border-slate-200 hover:border-primary'}`}
                  >
                    <ArrowRightLeft size={16} />
                    {isSellerMode ? 'Switch to Buyer' : 'Switch to Seller'}
                  </button>
                )}
                <button 
                  onClick={() => userProfile?.isVerifiedSeller ? setIsListingFormOpen(true) : setIsVerifyOpen(true)}
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full font-medium text-sm hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  <Plus size={18} />
                  {userProfile?.isVerifiedSeller ? 'List Item' : 'Become a Seller'}
                </button>
                <div 
                  onClick={() => setIsProfileOpen(true)}
                  className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm cursor-pointer hover:bg-slate-200 transition-all"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} className="w-full h-full rounded-full" referrerPolicy="no-referrer" />
                  ) : (
                    <User size={20} className="text-slate-600" />
                  )}
                </div>
              </>
            ) : (
              <>
                <button 
                  onClick={handleLogin}
                  className="px-4 py-2 text-slate-600 font-medium text-sm hover:text-primary transition-colors"
                >
                  Sign Up
                </button>
                <button 
                  onClick={handleLogin}
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
                  {sellerProducts.map((product) => (
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
                        <div className="flex items-center gap-1 text-slate-400 text-xs font-medium mb-1">
                          <MapPin size={12} />
                          <span>📍 {product.hostel}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={12} 
                              className={i < Math.floor(product.rating || 4.5) ? "fill-amber-400 text-amber-400" : "text-slate-200"} 
                            />
                          ))}
                          <span className="text-[10px] font-bold text-slate-400 ml-1">({(product.rating || 4.5).toFixed(1)})</span>
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

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 flex items-center justify-between z-40">
        <button 
          onClick={() => setIsSellerMode(false)}
          className={`flex flex-col items-center gap-1 ${!isSellerMode ? 'text-primary' : 'text-slate-400'}`}
        >
          <ShoppingBag size={24} />
          <span className="text-[10px] font-bold">Shop</span>
        </button>
        <button 
          onClick={() => {
            if (userProfile?.isVerifiedSeller) setIsSellerMode(true);
            else setIsVerifyOpen(true);
          }}
          className={`flex flex-col items-center gap-1 ${isSellerMode ? 'text-primary' : 'text-slate-400'}`}
        >
          <LayoutDashboard size={24} />
          <span className="text-[10px] font-bold">Sell</span>
        </button>
        <button 
          onClick={() => user ? setIsProfileOpen(true) : handleLogin()}
          className="flex flex-col items-center gap-1 text-slate-400"
        >
          <User size={24} />
          <span className="text-[10px] font-bold">{user ? 'Profile' : 'Login'}</span>
        </button>
      </div>


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
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        className={i < Math.floor(selectedProduct.rating || 4.5) ? "fill-amber-400 text-amber-400" : "text-slate-200"} 
                      />
                    ))}
                    <span className="text-xs font-bold text-slate-500 ml-1">({(selectedProduct.rating || 4.5).toFixed(1)})</span>
                  </div>
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
                      <p className="font-bold text-slate-900">{selectedProduct.sellerName || "Anonymous Student"}</p>
                    </div>
                    <button className="ml-auto text-primary font-bold text-sm">View Profile</button>
                  </div>
                </div>

                <div className="mt-12 flex gap-4">
                  <button 
                    disabled={loading}
                    onClick={() => handleBuyNow(selectedProduct)}
                    className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : (selectedProduct.type === 'buy' ? 'Buy Now' : 'Rent Now')}
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
            onClick={async () => {
              if (!user) return;
              await updateDoc(doc(db, 'users', user.uid), {
                isVerifiedSeller: true
              });
              setIsVerifyOpen(false);
              setIsSellerMode(true);
              alert("Verification submitted! You are now a verified seller.");
            }}
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

              <form onSubmit={handlePostListing} className="flex-1 overflow-y-auto p-8 no-scrollbar">
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
                      <input name="name" required type="text" placeholder="e.g. Scientific Calculator" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                        <select name="category" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none appearance-none">
                          <option>Select Category</option>
                          {CATEGORIES.map(c => <option key={c.name}>{c.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Condition</label>
                        <select name="condition" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none appearance-none">
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
                        <input name="price" required type="number" placeholder="0.00" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Listing Type</label>
                        <div className="flex bg-slate-100 p-1 rounded-xl">
                          <button type="button" onClick={() => setViewType('buy')} className={`flex-1 py-2 rounded-lg font-bold text-xs shadow-sm ${viewType === 'buy' ? 'bg-white text-primary' : 'text-slate-500'}`}>Sell</button>
                          <button type="button" onClick={() => setViewType('rent')} className={`flex-1 py-2 rounded-lg font-bold text-xs ${viewType === 'rent' ? 'bg-white text-primary' : 'text-slate-500'}`}>Rent</button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                      <textarea name="description" rows={4} placeholder="Describe your item..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none resize-none"></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Pickup Location (Hostel)</label>
                      <input name="hostel" required type="text" placeholder="e.g. Hall 1, Room 302" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" />
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsListingFormOpen(false)}
                    className="flex-1 py-4 bg-slate-100 text-slate-900 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-primary/20"
                  >
                    Post Listing
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Profile Modal */}
      <Modal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        title="My Profile"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-2 border-primary/20 shadow-sm overflow-hidden">
              {user?.photoURL ? (
                <img src={user.photoURL} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <User size={32} className="text-primary" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{userProfile?.displayName || 'User'}</h3>
              <p className="text-sm text-slate-500">{userProfile?.email}</p>
              <div className="flex items-center gap-1 mt-1">
                <div className={`w-2 h-2 rounded-full ${userProfile?.isVerifiedSeller ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {userProfile?.isVerifiedSeller ? 'Verified Seller' : 'Buyer Account'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button 
              onClick={() => setIsWalletOpen(true)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <Wallet size={20} />
                </div>
                <span className="font-bold text-slate-700">My Wallet (₦{userProfile?.balance?.toLocaleString()})</span>
              </div>
              <ChevronRight size={18} className="text-slate-300" />
            </button>

            <button 
              onClick={() => {
                setIsProfileOpen(false);
                if (userProfile?.isVerifiedSeller) setIsSellerMode(!isSellerMode);
                else setIsVerifyOpen(true);
              }}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Store size={20} />
                </div>
                <span className="font-bold text-slate-700">
                  {userProfile?.isVerifiedSeller ? (isSellerMode ? 'Switch to Buyer Mode' : 'Switch to Seller Mode') : 'Become a Seller'}
                </span>
              </div>
              <ChevronRight size={18} className="text-slate-300" />
            </button>

            {/* Escrow Orders Section */}
            <div className="pt-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-4">My Escrow Orders</h4>
              <div className="space-y-3">
                {orders.length > 0 ? orders.map(order => {
                  const isBuyer = order.buyerId === user?.uid;
                  return (
                    <div key={order.id} className="p-4 border border-slate-100 rounded-2xl bg-white shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900">{order.productName}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {isBuyer ? 'Purchase' : 'Sale'}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                          order.status === 'locked' ? 'bg-orange-100 text-orange-600' : 
                          order.status === 'released' ? 'bg-emerald-100 text-emerald-600' : 
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-primary">₦{order.amount.toLocaleString()}</span>
                        {order.status === 'locked' && isBuyer && (
                          <button 
                            disabled={loading}
                            onClick={() => handleMarkAsReceived(order)}
                            className="text-xs font-bold bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50"
                          >
                            Mark as Received
                          </button>
                        )}
                        {order.status === 'locked' && !isBuyer && (
                          <span className="text-[10px] font-bold text-slate-400 italic">Awaiting buyer confirmation</span>
                        )}
                      </div>
                    </div>
                  );
                }) : (
                  <p className="text-center text-sm text-slate-400 py-4">No active orders</p>
                )}
              </div>
            </div>
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

      {/* Wallet Modal */}
      <Modal 
        isOpen={isWalletOpen} 
        onClose={() => setIsWalletOpen(false)} 
        title="My Wallet"
      >
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-primary to-indigo-700 p-8 rounded-[2rem] text-white shadow-xl shadow-primary/20 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-white/60 text-sm font-medium mb-1">Available Balance</p>
              <h2 className="text-4xl font-bold">₦{userProfile?.balance?.toLocaleString() || 0}</h2>
            </div>
            <Wallet className="absolute -right-4 -bottom-4 text-white/10 w-32 h-32 rotate-12" />
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-slate-900">Top Up Wallet</h4>
            <div className="grid grid-cols-3 gap-3">
              {[1000, 5000, 10000].map(amount => (
                <button 
                  key={amount}
                  onClick={() => handleTopUp(amount)}
                  className="py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:border-primary hover:text-primary transition-all"
                >
                  +₦{amount.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-slate-900">Withdraw Funds</h4>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const amount = Number(formData.get('withdrawAmount'));
              handleWithdraw(amount);
            }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Bank Name</label>
                  <input 
                    name="bankName"
                    id="wallet-bank-name"
                    defaultValue={userProfile?.bankName}
                    placeholder="e.g. GTBank"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Account Number</label>
                  <input 
                    name="accountNumber"
                    id="wallet-account-number"
                    defaultValue={userProfile?.accountNumber}
                    placeholder="0123456789"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <button 
                type="button"
                onClick={() => {
                  const bankName = (document.getElementById('wallet-bank-name') as HTMLInputElement).value;
                  const accountNumber = (document.getElementById('wallet-account-number') as HTMLInputElement).value;
                  handleUpdateBankDetails(bankName, accountNumber);
                }}
                className="text-xs font-bold text-primary hover:underline"
              >
                Update Bank Details
              </button>
              <div className="flex gap-2">
                <input 
                  name="withdrawAmount"
                  type="number"
                  placeholder="Amount to withdraw"
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
                >
                  Withdraw
                </button>
              </div>
            </form>
          </div>

          <div className="p-4 bg-blue-50 rounded-2xl flex gap-3">
            <AlertCircle className="text-blue-600 shrink-0" size={20} />
            <p className="text-xs text-blue-700 leading-relaxed">
              Funds added to your wallet can be used to purchase items. When you buy, funds are held in <strong>Escrow</strong> and only released to the seller after you confirm receipt.
            </p>
          </div>
        </div>
      </Modal>

      {/* Insufficient Funds Modal */}
      <Modal 
        isOpen={isInsufficientFundsOpen} 
        onClose={() => setIsInsufficientFundsOpen(false)} 
        title="Insufficient Funds"
      >
        <div className="space-y-6 text-center">
          <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle size={40} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Not enough money in wallet</h3>
            <p className="text-slate-500 text-sm">
              You need ₦{((selectedProduct?.price || 0) - (userProfile?.balance || 0)).toLocaleString()} more to purchase this item.
            </p>
          </div>
          <div className="space-y-3">
            <button 
              onClick={() => {
                setIsInsufficientFundsOpen(false);
                setIsWalletOpen(true);
              }}
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-primary/20"
            >
              Top Up Wallet
            </button>
            <button 
              onClick={() => setIsInsufficientFundsOpen(false)}
              className="w-full py-4 bg-slate-100 text-slate-900 rounded-2xl font-bold hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Confirm Purchase Modal */}
      <Modal 
        isOpen={isConfirmPurchaseOpen} 
        onClose={() => setIsConfirmPurchaseOpen(false)} 
        title="Confirm Purchase"
      >
        {selectedProduct && (
          <div className="space-y-6">
            <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl">
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.name} 
                className="w-20 h-20 object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1">
                <h3 className="font-bold text-slate-900">{selectedProduct.name}</h3>
                <p className="text-sm text-slate-500 line-clamp-2">{selectedProduct.description}</p>
                <p className="text-primary font-bold mt-1">₦{selectedProduct.price.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Item Price</span>
                <span className="font-medium text-slate-900">₦{selectedProduct.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Service Fee</span>
                <span className="font-medium text-slate-900">₦0</span>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="font-bold text-slate-900">Total to Pay</span>
                <span className="text-xl font-bold text-primary">₦{selectedProduct.price.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-2xl flex gap-3">
              <ShieldCheck className="text-blue-600 shrink-0" size={20} />
              <p className="text-xs text-blue-700 leading-relaxed">
                Your money is safe! Funds will be held in <strong>Escrow</strong> and only released to the seller after you confirm you've received the item.
              </p>
            </div>

            <div className="space-y-3">
              <button 
                disabled={loading}
                onClick={handleConfirmPurchase}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Confirm & Pay Now'}
              </button>
              <button 
                onClick={() => setIsConfirmPurchaseOpen(false)}
                className="w-full py-4 bg-slate-100 text-slate-900 rounded-2xl font-bold hover:bg-slate-200 transition-all"
              >
                Go Back
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
