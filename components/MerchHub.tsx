
import React, { useState, useMemo, useEffect } from 'react';
import {
   Package, ShoppingCart, BarChart3, Plus, Trash2,
   TrendingUp, RefreshCcw, Settings, ChevronRight, X,
   Store, CreditCard, Banknote, Smartphone, CheckCircle,
   ChevronLeft, PlusCircle, Edit3, Image as ImageIcon, LayoutGrid, List, DollarSign, Calendar,
   ArrowRight, PieChart, Activity, Layers, Tag, ChevronDown, Upload
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { MerchItem, MerchSale, SizeKey, PaymentMethod, Tour, TourDay } from '../types';
import { US_STATE_TAX_RATES } from '../constants';

const INITIAL_MERCH: MerchItem[] = [
   { id: 'm1', name: 'ZDubs Logo Tee', category: 'Shirts & Tanks', costPrice: 8.50, salePrice: 30.00, stock: { S: 10, M: 25, L: 40, XL: 20, XXL: 5, OS: 0 }, reorderLevel: 50, imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&h=200&fit=crop' },
   { id: 'm2', name: 'Heavy Hitters Hoodie', category: 'Shirts & Tanks', costPrice: 22.00, salePrice: 60.00, stock: { S: 5, M: 10, L: 15, XL: 5, XXL: 2, OS: 0 }, reorderLevel: 20, imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&h=200&fit=crop' },
   { id: 'm3', name: 'ZDubs Vinyl', category: 'Music', costPrice: 12.00, salePrice: 35.00, stock: { S: 0, M: 0, L: 0, XL: 0, XXL: 0, OS: 24 }, reorderLevel: 10, imageUrl: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=200&h=200&fit=crop' },
   { id: 'm4', name: 'DZD Logo Red', category: 'Stickers', costPrice: 1.20, salePrice: 10.00, stock: { S: 0, M: 0, L: 0, XL: 0, XXL: 0, OS: 150 }, reorderLevel: 50, imageUrl: 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=200&h=200&fit=crop' },
];

const INITIAL_CATEGORIES = ['Shirts & Tanks', 'Hats', 'Apparel', 'Sweatshirts', 'Music', 'Vinyl', 'CDs', 'Stickers', 'Accessories'];

const getCategoryType = (category: string): 'SOFT' | 'HARD' | 'MUSIC' => {
   const softCategories = ['Shirts & Tanks', 'Hats', 'Apparel', 'Sweatshirts'];
   const musicCategories = ['Music', 'Vinyl', 'CDs'];
   if (softCategories.includes(category)) return 'SOFT';
   if (musicCategories.includes(category)) return 'MUSIC';
   return 'HARD';
};

interface CartItem {
   cartId: string;
   itemId: string;
   name: string;
   size: SizeKey;
   timestamp: string;
   orderId: string; // Crucial for grouping
   tourDayId: string;
   source: 'MANUAL' | 'API';
   price: number;
   paymentMethod: PaymentMethod;
   discountType: 'NONE' | 'HALF' | 'CREW' | 'COMP';
}

interface VenueSettings {
   softCut: number; // Percentage 0-100
   hardCut: number; // Percentage 0-100
   musicCut: number; // Percentage 0-100
   taxRate: number; // Percentage 0-100
}

interface MerchHubProps {
   tours: Tour[];
   salesHistory: MerchSale[];
   onUpdateSales: (sales: MerchSale[]) => void;
   onBack?: () => void;
}

const MerchHub: React.FC<MerchHubProps> = ({ tours, salesHistory, onUpdateSales, onBack }) => {
   const { isDemoMode } = useAuth();
   const [view, setView] = useState<'SALES' | 'ORDERS' | 'INVENTORY' | 'ANALYTICS' | 'SETTLEMENT'>('SALES');
   const [venueSettings, setVenueSettings] = useState<VenueSettings>({ softCut: 20, hardCut: 10, musicCut: 0, taxRate: 8.25 });
   const [items, setItems] = useState<MerchItem[]>(INITIAL_MERCH);

   // Category Management
   const [managedCategories, setManagedCategories] = useState<string[]>(INITIAL_CATEGORIES);
   const [isManagingCategories, setIsManagingCategories] = useState(false);
   const [activeCategory, setActiveCategory] = useState<string | 'ALL'>('ALL');

   // Tour Selection State
   const [selectedTourId, setSelectedTourId] = useState<string>(tours[0]?.id || '');
   const selectedTour = useMemo(() => tours.find(t => t.id === selectedTourId) || tours[0], [selectedTourId, tours]);

   const [selectedDayId, setSelectedDayId] = useState<string>(selectedTour?.days[0]?.id || '');

   // Reset selected day when tour changes
   useEffect(() => {
      if (selectedTour?.days.length > 0) {
         setSelectedDayId(selectedTour.days[0].id);
      }
   }, [selectedTourId, selectedTour]);


   // Cart / Order State
   const [cart, setCart] = useState<CartItem[]>([]);

   // Admin / Edit State
   const [isEditing, setIsEditing] = useState(false);
   const [editingItem, setEditingItem] = useState<MerchItem | null>(null);

   const selectedDay = useMemo(() =>
      selectedTour?.days.find(d => d.id === selectedDayId),
      [selectedDayId, selectedTour]);

   // Smart Tax Automation
   useEffect(() => {
      if (selectedDay?.state) {
         const autoRate = US_STATE_TAX_RATES[selectedDay.state];
         if (autoRate !== undefined) {
            setVenueSettings(prev => ({ ...prev, taxRate: autoRate }));
         }
      }
   }, [selectedDayId, selectedDay?.state]);

   const categories = useMemo(() => {
      return ['ALL', ...managedCategories];
   }, [managedCategories]);

   const filteredItems = useMemo(() => {
      if (activeCategory === 'ALL') return items;
      return items.filter(i => i.category === activeCategory);
   }, [items, activeCategory]);

   const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.price, 0), [cart]);

   // Analytics for the whole run
   const globalAnalytics = useMemo(() => {
      const totalSales = salesHistory.reduce((acc, s) => acc + s.totalAmount, 0);
      const totalCost = salesHistory.reduce((acc, s) => {
         const item = items.find(i => i.id === s.itemId);
         return acc + (item ? item.costPrice * s.quantity : 0);
      }, 0);
      const profit = totalSales - totalCost;
      const itemPerf = items.map(item => {
         const itemSales = salesHistory.filter(s => s.itemId === item.id);
         const qty = itemSales.reduce((acc, s) => acc + s.quantity, 0);
         const rev = itemSales.reduce((acc, s) => acc + s.totalAmount, 0);
         return { ...item, totalSold: qty, revenue: rev };
      }).sort((a, b) => b.revenue - a.revenue);

      return { totalSales, totalCost, profit, itemPerf };
   }, [salesHistory, items]);

   // Analytics for the SELECTED NIGHT
   const nightlyAnalytics = useMemo(() => {
      const nightSales = salesHistory.filter(s => s.tourDayId === selectedDayId);
      const gross = nightSales.reduce((acc, s) => acc + s.totalAmount, 0);
      const units = nightSales.reduce((acc, s) => acc + s.quantity, 0);

      const paymentBreakdown = {
         CASH: nightSales.filter(s => s.paymentMethod === 'CASH').reduce((a, b) => a + b.totalAmount, 0),
         VENMO: nightSales.filter(s => s.paymentMethod === 'VENMO').reduce((a, b) => a + b.totalAmount, 0),
         CARD: nightSales.filter(s => s.paymentMethod === 'CARD').reduce((a, b) => a + b.totalAmount, 0),
      };

      const sizeBreakdown: Record<string, number> = {};
      nightSales.forEach(s => {
         sizeBreakdown[s.size] = (sizeBreakdown[s.size] || 0) + s.quantity;
      });

      const cost = nightSales.reduce((acc, s) => {
         const item = items.find(i => i.id === s.itemId);
         return acc + (item ? item.costPrice * s.quantity : 0);
      }, 0);

      return { gross, units, paymentBreakdown, sizeBreakdown, profit: gross - cost, history: nightSales };
   }, [salesHistory, selectedDayId, items]);

   const groupedOrders = useMemo(() => {
      const groups: Record<string, MerchSale[]> = {};
      nightlyAnalytics.history.forEach(sale => {
         if (!groups[sale.orderId]) groups[sale.orderId] = [];
         groups[sale.orderId].push(sale);
      });
      return Object.values(groups).sort((a, b) =>
         new Date(b[0].timestamp).getTime() - new Date(a[0].timestamp).getTime()
      );
   }, [nightlyAnalytics.history]);

   const settlementAnalytics = useMemo(() => {
      const getCategoryTotal = (catType: 'SOFT' | 'HARD' | 'MUSIC') => {
         return nightlyAnalytics.history
            .filter(s => getCategoryType(items.find(i => i.id === s.itemId)?.category || '') === catType && s.discountType !== 'COMP')
            .reduce((a, b) => a + b.totalAmount, 0);
      };

      const grossSoft = getCategoryTotal('SOFT');
      const grossHard = getCategoryTotal('HARD');
      const grossMusic = getCategoryTotal('MUSIC');

      const taxRateDec = venueSettings.taxRate / 100;
      const afterTaxMultiplier = 1 - taxRateDec;

      const feeSoft = grossSoft * afterTaxMultiplier * (venueSettings.softCut / 100);
      const feeHard = grossHard * afterTaxMultiplier * (venueSettings.hardCut / 100);
      const feeMusic = grossMusic * afterTaxMultiplier * (venueSettings.musicCut / 100);

      const totalVenueFee = feeSoft + feeHard + feeMusic;

      // Tax Liability: simple calculation based on Gross for now. 
      // If tax is deduced from gross to find net: Tax = Gross * TaxRate? No, usually Net * TaxRate = Tax. 
      // User Logic: "Deducted before venue cuts".
      // We will stick to the previous logic: Est Tax Liability = Gross * TaxRate% (as displayed in previous code)
      const estTaxLiability = nightlyAnalytics.gross * taxRateDec;

      return {
         grossSoft,
         grossHard,
         grossMusic,
         feeSoft,
         feeHard,
         feeMusic,
         totalVenueFee,
         estTaxLiability
      };
   }, [nightlyAnalytics, items, venueSettings]);

   const addToCart = (item: MerchItem, size: SizeKey) => {
      if (item.stock[size] <= 0) {
         alert("Out of stock!");
         return;
      }
      setCart(prev => [...prev, {
         cartId: Math.random().toString(36).substr(2, 9),
         itemId: item.id,
         name: item.name,
         size,
         price: item.salePrice,
         paymentMethod: 'CASH',
         discountType: 'NONE',
         timestamp: new Date().toISOString(),
         orderId: `TEMP-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`, // Temp order ID for cart
         tourDayId: selectedDayId,
         source: 'MANUAL'
      }]);
   };

   const removeFromCart = (cartId: string) => {
      setCart(prev => prev.filter(i => i.cartId !== cartId));
   };

   const updateCartItemPayment = (cartId: string, method: PaymentMethod) => {
      setCart(prev => prev.map(i => i.cartId === cartId ? { ...i, paymentMethod: method } : i));
   };

   const submitOrder = () => {
      if (cart.length === 0) return;

      const orderId = `ORD-${Date.now()}`;
      const newSales: MerchSale[] = cart.map(cartItem => {
         const originalItem = items.find(i => i.id === cartItem.itemId);
         return {
            id: `SALE-${Math.random().toString(36).substr(2, 9)}`,
            itemId: cartItem.itemId,
            itemName: cartItem.name,
            size: cartItem.size,
            quantity: 1,
            totalAmount: cartItem.discountType === 'COMP' ? 0 :
               cartItem.discountType === 'HALF' ? cartItem.price * 0.5 :
                  cartItem.discountType === 'CREW' ? (originalItem?.costPrice || 10) :
                     cartItem.price,
            paymentMethod: cartItem.paymentMethod,
            timestamp: new Date().toISOString(),
            orderId,
            tourDayId: selectedDayId,
            source: 'MANUAL',
            discountType: cartItem.discountType
         };
      });

      setItems(prev => prev.map(item => {
         const soldThisItem = cart.filter(ci => ci.itemId === item.id);
         if (soldThisItem.length === 0) return item;
         const newStock = { ...item.stock };
         soldThisItem.forEach(ci => {
            newStock[ci.size] = Math.max(0, newStock[ci.size] - 1);
         });
         return { ...item, stock: newStock };
      }));

      onUpdateSales([...newSales, ...salesHistory]);
      setCart([]);
   };

   const deleteOrder = (orderId: string) => {
      const salesToDelete = salesHistory.filter(s => s.orderId === orderId);
      if (salesToDelete.length === 0) return;

      setItems(prev => {
         const next = [...prev];
         salesToDelete.forEach(sale => {
            const idx = next.findIndex(i => i.id === sale.itemId);
            if (idx !== -1) {
               const newStock = { ...next[idx].stock };
               newStock[sale.size] = (newStock[sale.size] || 0) + sale.quantity;
               next[idx] = { ...next[idx], stock: newStock };
            }
         });
         return next;
      });
      onUpdateSales(salesHistory.filter(s => s.orderId !== orderId));
   };

   const deleteSaleItem = (saleId: string) => {
      const sale = salesHistory.find(s => s.id === saleId);
      if (!sale) return;
      if (confirm('Remove this item? Stock will be replenished.')) {
         setItems(prev => prev.map(item => {
            if (item.id === sale.itemId) {
               const newStock = { ...item.stock };
               newStock[sale.size] = (newStock[sale.size] || 0) + sale.quantity;
               return { ...item, stock: newStock };
            }
            return item;
         }));
         onUpdateSales(salesHistory.filter(s => s.id !== saleId));
      }
   };

   const updateOrderPayment = (orderId: string, method: PaymentMethod) => {
      onUpdateSales(salesHistory.map(s => s.orderId === orderId ? { ...s, paymentMethod: method } : s));
   };

   const updateSalePrice = (saleId: string, newPrice: number) => {
      onUpdateSales(salesHistory.map(s => s.id === saleId ? { ...s, totalAmount: newPrice } : s));
   };

   const updateSaleSize = (saleId: string, newSize: SizeKey) => {
      const sale = salesHistory.find(s => s.id === saleId);
      if (!sale || sale.size === newSize) return;

      setItems(prev => prev.map(item => {
         if (item.id === sale.itemId) {
            const newStock = { ...item.stock };
            newStock[sale.size] = (newStock[sale.size] || 0) + sale.quantity;
            newStock[newSize] = (newStock[newSize] || 0) - sale.quantity;
            return { ...item, stock: newStock };
         }
         return item;
      }));
      onUpdateSales(salesHistory.map(s => s.id === saleId ? { ...s, size: newSize } : s));
   };

   const updateSaleItem = (saleId: string, newItemId: string) => {
      const sale = salesHistory.find(s => s.id === saleId);
      const newItem = items.find(i => i.id === newItemId);
      if (!sale || !newItem || sale.itemId === newItemId) return;

      setItems(prev => prev.map(item => {
         // Return stock to OLD item
         if (item.id === sale.itemId) {
            const newStock = { ...item.stock };
            newStock[sale.size] = (newStock[sale.size] || 0) + sale.quantity;
            return { ...item, stock: newStock };
         }
         // Take stock from NEW item
         if (item.id === newItemId) {
            const newStock = { ...item.stock };
            newStock[sale.size] = (newStock[sale.size] || 0) - sale.quantity;
            return { ...item, stock: newStock };
         }
         return item;
      }));

      onUpdateSales(salesHistory.map(s => s.id === saleId ? {
         ...s,
         itemId: newItemId,
         itemName: newItem.name,
         totalAmount: newItem.salePrice * s.quantity
      } : s));
   };

   const openEditor = (item?: MerchItem) => {
      setEditingItem(item || {
         id: `m${Date.now()}`,
         name: '',

         category: managedCategories[0] || 'Shirts & Tanks',
         costPrice: 0,
         salePrice: 0,
         stock: { S: 0, M: 0, L: 0, XL: 0, XXL: 0, OS: 0 },
         reorderLevel: 10,
         imageUrl: ''
      });
      setIsEditing(true);
   };

   const saveItem = () => {
      if (isDemoMode) {
         alert("Feature Disabled in Demo Account");
         return;
      }
      if (!editingItem) return;
      setItems(prev => {
         const exists = prev.some(i => i.id === editingItem.id);
         if (exists) return prev.map(i => i.id === editingItem.id ? editingItem : i);
         return [...prev, editingItem];
      });
      setIsEditing(false);
      setEditingItem(null);
   };

   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
         if (typeof reader.result === 'string') {
            setEditingItem(prev => prev ? { ...prev, imageUrl: reader.result } : null);
         }
      };
      reader.readAsDataURL(file);
   };

   // ... handlePaste is here ...

   const addCategory = () => {
      const cat = prompt("Enter new category name:");
      if (cat && !managedCategories.includes(cat)) {
         setManagedCategories(prev => [...prev, cat]);
      }
   };

   const removeCategory = (cat: string) => {
      if (confirm(`Delete category "${cat}"?`)) {
         setManagedCategories(prev => prev.filter(c => c !== cat));
         if (activeCategory === cat) setActiveCategory('ALL');
      }
   };

   const handlePaste = (e: React.ClipboardEvent) => {
      const items = e.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
         if (items[i].type.indexOf('image') !== -1) {
            const blob = items[i].getAsFile();
            if (blob) {
               const reader = new FileReader();
               reader.onloadend = () => {
                  if (typeof reader.result === 'string') {
                     setEditingItem(prev => prev ? { ...prev, imageUrl: reader.result } : null);
                  }
               };
               reader.readAsDataURL(blob);
               e.preventDefault();
            }
         }
      }
   };

   return (
      <div className="flex flex-col h-full bg-black overflow-hidden relative">
         {/* Top Header */}
         <div className="h-16 border-b border-gray-900 bg-gray-950 flex items-center justify-between px-8 shrink-0">
            <div className="flex items-center gap-6">
               {onBack && (
                  <button onClick={onBack} className="p-2 bg-gray-900 rounded-xl text-gray-500 hover:text-white border border-gray-800">
                     <ChevronLeft size={20} />
                  </button>
               )}
               <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <Store className="text-emerald-500" size={20} />
               </div>
               <div className="flex items-center gap-4">
                  <div>
                     <h2 className="text-xl font-black text-white uppercase tracking-tighter leading-none">Merch Tactical</h2>
                     <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Scale Operations</p>
                  </div>

                  {/* Tour Switcher Dropdown */}
                  <div className="relative group/select ml-4">
                     <select
                        value={selectedTourId}
                        onChange={(e) => setSelectedTourId(e.target.value)}
                        className="appearance-none bg-gray-900 border border-gray-800 rounded-xl py-2 pl-4 pr-10 text-xs font-black text-white uppercase tracking-tight focus:outline-none focus:border-emerald-500/50 transition-all cursor-pointer"
                     >
                        {tours.map(t => (
                           <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                     </select>
                     <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-hover/select:text-emerald-500 transition-colors" size={14} />
                  </div>
               </div>
            </div>

            <div className="flex bg-gray-900 p-1 rounded-xl border border-gray-800">
               {(['SALES', 'ORDERS', 'INVENTORY', 'ANALYTICS', 'SETTLEMENT'] as const).map(v => (
                  <button key={v} onClick={() => setView(v)} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${view === v ? 'bg-white text-black shadow-xl shadow-white/5' : 'text-gray-500 hover:text-white'}`}>{v}</button>
               ))}
            </div>
         </div>

         <div className="flex-1 flex overflow-hidden">
            {/* LEFT COLUMN: Itinerary & Categories */}
            <div className="w-64 border-r border-gray-900 bg-gray-950 flex flex-col shrink-0">
               <div className="p-5 border-b border-gray-900">
                  <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-4 flex items-center gap-2"><Calendar size={12} /> Itinerary Select</h3>
                  <div className="space-y-1.5 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                     {selectedTour?.days.map(day => (
                        <button
                           key={day.id}
                           onClick={() => setSelectedDayId(day.id)}
                           className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col ${selectedDayId === day.id ? 'bg-white/10 border-white/20 ring-1 ring-white/10' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                        >
                           <div className="flex justify-between items-center mb-1">
                              <span className="text-[8px] font-black text-gray-500 uppercase">{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                              {day.status === 'SHOW' && <div className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                           </div>
                           <p className="text-[10px] font-black text-white uppercase truncate">{day.cityName}</p>
                           <p className="text-[8px] text-gray-600 font-bold uppercase truncate">{day.venueName || 'Travel stop'}</p>
                        </button>
                     ))}
                  </div>
               </div>

               <div className="p-5 flex-1 overflow-y-auto custom-scrollbar">
                  <div className="flex justify-between items-center mb-4 px-1">
                     <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Gear Filter</h3>
                     <button onClick={addCategory} className="text-[9px] font-bold text-blue-500 hover:text-white uppercase">+ Add Filter</button>
                  </div>
                  <div className="space-y-1">
                     {categories.map(cat => (
                        <div key={cat} className="group/cat relative">
                           <button
                              onClick={() => setActiveCategory(cat)}
                              className={`w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all ${activeCategory === cat ? 'bg-emerald-500 text-black' : 'text-gray-400 hover:bg-white/5'}`}
                           >
                              {cat}
                           </button>
                           {cat !== 'ALL' && (
                              <button
                                 onClick={(e) => { e.stopPropagation(); removeCategory(cat); }}
                                 className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-600 hover:text-red-500 opacity-0 group-hover/cat:opacity-100 transition-opacity"
                              >
                                 <X size={10} />
                              </button>
                           )}
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* CENTER COLUMN: Main Workspace */}
            <div className="flex-1 bg-black overflow-y-auto custom-scrollbar">
               {view === 'SALES' && (
                  <div className="p-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in duration-500">
                     {filteredItems.map(item => (
                        <div key={item.id} className="bg-gray-950 border border-gray-800 rounded-[2.5rem] overflow-hidden group hover:border-emerald-500/30 transition-all shadow-2xl flex flex-col">
                           <div className="relative h-44 bg-gray-900 overflow-hidden">
                              {item.imageUrl ? (
                                 <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                              ) : (
                                 <div className="w-full h-full flex items-center justify-center opacity-10"><Package size={48} /></div>
                              )}
                              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full">
                                 <p className="text-sm font-black text-emerald-500">${item.salePrice.toFixed(0)}</p>
                              </div>
                           </div>
                           <div className="p-6 flex flex-col flex-1">
                              <h3 className="text-base font-black text-white uppercase tracking-tight mb-6 leading-tight h-10 line-clamp-2">{item.name}</h3>

                              <div className="mt-auto">
                                 <p className="text-[8px] font-black text-gray-600 uppercase mb-3 tracking-[0.2em]">Select Size to Add</p>
                                 <div className="grid grid-cols-3 gap-2">
                                    {(['S', 'M', 'L', 'XL', 'XXL', 'OS'] as SizeKey[]).map(size => {
                                       const count = item.stock[size];
                                       if (count === 0 && size !== 'OS') return null;
                                       if (size === 'OS' && count === 0) return null;

                                       return (
                                          <button
                                             key={size}
                                             onClick={() => addToCart(item, size)}
                                             className={`flex flex-col items-center justify-center py-2.5 rounded-xl border transition-all active:scale-90 relative overflow-hidden ${count > 0 ? 'bg-gray-900 border-gray-800 text-white hover:bg-emerald-500 hover:text-black hover:border-emerald-500' : 'opacity-10 border-transparent text-gray-700 pointer-events-none grayscale'}`}
                                          >
                                             <span className="text-[10px] font-black z-10">{size}</span>
                                             <span className="text-[7px] font-bold z-10 opacity-60">STK: {count}</span>
                                          </button>
                                       );
                                    })}
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               )}

               {view === 'ORDERS' && (
                  <div className="p-8 space-y-8 animate-in slide-in-from-bottom-4">
                     <div className="flex justify-between items-center bg-gray-900/50 p-8 rounded-[3rem] border border-gray-800">
                        <div>
                           <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Order History</h3>
                           <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Manage & Correct Sales for {selectedDay?.cityName}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Transactions</p>
                           <p className="text-2xl font-black text-white">{new Set(nightlyAnalytics.history.map(s => s.orderId)).size}</p>
                        </div>
                     </div>

                     <div className="space-y-6">
                        {nightlyAnalytics.history.length === 0 ? (
                           <div className="p-20 text-center opacity-30">
                              <ShoppingCart size={48} className="mx-auto mb-4 text-gray-500" />
                              <p className="text-xl font-black text-white uppercase tracking-tight">No Orders Yet</p>
                              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-2">Start selling to see ledger here</p>
                           </div>
                        ) : (
                           groupedOrders.map(group => {
                              const orderTotal = group.reduce((sum, s) => sum + s.totalAmount, 0);
                              const firstSale = group[0];
                              return (
                                 <div key={firstSale.orderId} className="bg-gray-950 border border-gray-900 p-8 rounded-[2.5rem] group hover:border-gray-800 transition-all">
                                    {/* Order Header */}
                                    <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-900">
                                       <div className="flex items-center gap-4">
                                          <div className="p-3 bg-gray-900 rounded-xl text-gray-500">
                                             <Package size={20} />
                                          </div>
                                          <div>
                                             <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Order ID: {firstSale.orderId.slice(-6)}</p>
                                             <p className="text-xs font-black text-white uppercase tracking-tight">{new Date(firstSale.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                          </div>
                                       </div>

                                       <div className="flex items-center gap-6">
                                          {/* Global Payment Edit */}
                                          <div className="flex bg-black p-1 rounded-xl border border-gray-800">
                                             {[
                                                { method: 'CASH', icon: Banknote, label: 'Cash' },
                                                { method: 'VENMO', icon: Smartphone, label: 'Venmo' },
                                                { method: 'CARD', icon: CreditCard, label: 'Card' }
                                             ].map(p => (
                                                <button
                                                   key={p.method}
                                                   onClick={() => updateOrderPayment(firstSale.orderId, p.method as PaymentMethod)}
                                                   className={`p-2 rounded-lg transition-all ${firstSale.paymentMethod === p.method ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-gray-700 hover:text-gray-400'}`}
                                                   title={`Set Order to ${p.label}`}
                                                >
                                                   <p.icon size={14} />
                                                </button>
                                             ))}
                                          </div>

                                          <div className="text-right">
                                             <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total</p>
                                             <p className="text-xl font-black text-white">${orderTotal.toFixed(2)}</p>
                                          </div>

                                          <button
                                             onClick={() => deleteOrder(firstSale.orderId)}
                                             className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 transition-all ml-4"
                                             title="Delete Entire Order"
                                          >
                                             <Trash2 size={16} />
                                          </button>
                                       </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="space-y-3">
                                       {group.map(sale => (
                                          <div key={sale.id} className="flex items-center justify-between bg-black/20 p-4 rounded-2xl border border-white/5">
                                             <div className="flex items-center gap-4 flex-1">
                                                {/* Edit Size */}
                                                <div className="relative group/size">
                                                   <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center border border-gray-800 cursor-pointer hover:border-blue-500 transition-colors">
                                                      <span className="text-xs font-black text-white">{sale.size}</span>
                                                   </div>
                                                   <div className="absolute top-0 left-0 w-full h-full opacity-0">
                                                      <select
                                                         value={sale.size}
                                                         onChange={(e) => updateSaleSize(sale.id, e.target.value as SizeKey)}
                                                         className="w-full h-full opacity-0 cursor-pointer"
                                                      >
                                                         {(['S', 'M', 'L', 'XL', 'XXL', 'OS'] as SizeKey[]).map(s => (
                                                            <option key={s} value={s}>{s}</option>
                                                         ))}
                                                      </select>
                                                   </div>
                                                </div>

                                                <div className="relative group/name flex-1 min-w-0">
                                                   <p className="text-sm font-bold text-gray-300 uppercase truncate group-hover/name:opacity-0 transition-opacity">{sale.itemName}</p>
                                                   <select
                                                      value={sale.itemId}
                                                      onChange={(e) => updateSaleItem(sale.id, e.target.value)}
                                                      className="absolute inset-0 w-full h-full bg-transparent text-sm font-bold text-emerald-500 opacity-0 group-hover/name:opacity-100 cursor-pointer"
                                                   >
                                                      {items.map(i => (
                                                         <option key={i.id} value={i.id} className="text-black">{i.name}</option>
                                                      ))}
                                                   </select>
                                                </div>
                                             </div>

                                             <div className="flex items-center gap-6">
                                                {/* Edit Price */}
                                                <div className="flex items-center gap-2 bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-800 focus-within:border-blue-500">
                                                   <span className="text-gray-500 text-xs">$</span>
                                                   <input
                                                      type="number"
                                                      value={sale.totalAmount}
                                                      onChange={(e) => updateSalePrice(sale.id, parseFloat(e.target.value) || 0)}
                                                      className="w-16 bg-transparent text-sm font-black text-white outline-none text-right"
                                                   />
                                                </div>

                                                <button
                                                   onClick={() => deleteSaleItem(sale.id)}
                                                   className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                                                   title="Remove Item"
                                                >
                                                   <X size={14} />
                                                </button>
                                             </div>
                                          </div>
                                       ))}
                                    </div>
                                 </div>
                              );
                           })
                        )}
                     </div>
                  </div>
               )}

               {view === 'INVENTORY' && (
                  <div className="p-8 space-y-10 animate-in slide-in-from-bottom-4">
                     <div className="flex justify-between items-center bg-gray-900/50 p-8 rounded-[3rem] border border-gray-800">
                        <div>
                           <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Stock Hub</h3>
                           <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Global supply line management</p>
                        </div>
                        <button onClick={() => openEditor()} className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-white/5">
                           <PlusCircle size={20} /> Add Gear
                        </button>
                     </div>

                     <div className="grid grid-cols-1 gap-4">
                        {items.map(item => (
                           <div key={item.id} className="bg-gray-950 border border-gray-800 p-6 rounded-[2.5rem] flex items-center justify-between group hover:border-blue-500/20 transition-all shadow-xl">
                              <div className="flex items-center gap-6">
                                 <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-gray-800 overflow-hidden">
                                    <img src={item.imageUrl} className="w-full h-full object-cover" />
                                 </div>
                                 <div>
                                    <h4 className="text-lg font-black text-white uppercase tracking-tight">{item.name}</h4>
                                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{item.category}</p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-12 px-12 border-x border-gray-900 flex-1 justify-center">
                                 <div className="text-center">
                                    <p className="text-[8px] font-black text-gray-600 uppercase mb-1">In Stock</p>
                                    <p className="text-sm font-black text-white">{Object.values(item.stock).reduce((a: number, b: number) => a + b, 0)}</p>
                                 </div>
                                 <div className="text-center">
                                    <p className="text-[8px] font-black text-gray-600 uppercase mb-1">Mgn</p>
                                    <p className="text-sm font-black text-emerald-500">{(((item.salePrice - item.costPrice) / (item.salePrice || 1)) * 100).toFixed(0)}%</p>
                                 </div>
                              </div>
                              <div className="flex gap-2">
                                 <button onClick={() => openEditor(item)} className="p-4 bg-gray-900 text-gray-500 hover:text-white border border-gray-800 rounded-2xl transition-all"><Edit3 size={18} /></button>
                                 <button onClick={() => setItems(prev => prev.filter(i => i.id !== item.id))} className="p-4 bg-gray-900 text-gray-500 hover:text-red-500 border border-gray-800 rounded-2xl transition-all"><Trash2 size={18} /></button>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {view === 'ANALYTICS' && (
                  <div className="p-8 space-y-12">
                     {/* Nightly Summary Hero */}
                     <section className="animate-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center justify-between mb-8">
                           <div>
                              <h3 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                                 <Activity className="text-emerald-500" /> Nightly Performance
                              </h3>
                              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">
                                 {selectedDay?.cityName} @ {selectedDay?.venueName || 'Unknown Stop'} • {new Date(selectedDay?.date || '').toLocaleDateString()}
                              </p>
                           </div>
                           <div className="bg-emerald-500/10 border border-emerald-500/30 px-6 py-3 rounded-2xl flex items-center gap-4 shadow-lg shadow-emerald-500/5">
                              <div>
                                 <p className="text-[8px] font-black text-emerald-600 uppercase tracking-[0.2em]">Nightly Profit</p>
                                 <p className="text-2xl font-black text-white tracking-tighter">${nightlyAnalytics.profit.toFixed(2)}</p>
                              </div>
                              <TrendingUp className="text-emerald-500" size={24} />
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                           <div className="bg-gray-950 border border-gray-900 p-8 rounded-[2.5rem] shadow-2xl">
                              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3">Gross Rev</p>
                              <p className="text-4xl font-black text-white tracking-tighter">${nightlyAnalytics.gross.toFixed(2)}</p>
                           </div>
                           <div className="bg-gray-950 border border-gray-900 p-8 rounded-[2.5rem] shadow-2xl">
                              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3">Units Moved</p>
                              <p className="text-4xl font-black text-white tracking-tighter">{nightlyAnalytics.units}</p>
                           </div>
                           <div className="bg-gray-950 border border-gray-900 p-8 rounded-[2.5rem] shadow-2xl">
                              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3">Avg Transaction</p>
                              <p className="text-4xl font-black text-white tracking-tighter">
                                 ${(nightlyAnalytics.gross / (nightlyAnalytics.history.length || 1)).toFixed(2)}
                              </p>
                           </div>
                           <div className="bg-gray-950 border border-gray-900 p-8 rounded-[2.5rem] shadow-2xl">
                              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3">Stock Efficiency</p>
                              <p className="text-4xl font-black text-blue-500 tracking-tighter">
                                 {((nightlyAnalytics.profit / (nightlyAnalytics.gross || 1)) * 100).toFixed(0)}%
                              </p>
                           </div>
                        </div>

                        {/* Nightly Detail Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                           {/* Payment Methods */}
                           <div className="bg-gray-950 border border-gray-900 rounded-[3rem] p-10 flex flex-col">
                              <h4 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                                 <PieChart size={16} className="text-blue-500" /> Payment Split
                              </h4>
                              <div className="space-y-6 flex-1 justify-center flex flex-col">
                                 {Object.entries(nightlyAnalytics.paymentBreakdown).map(([method, amount]) => (
                                    <div key={method}>
                                       <div className="flex justify-between items-center mb-2">
                                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{method}</span>
                                          <span className="text-sm font-black text-white">${amount.toFixed(2)}</span>
                                       </div>
                                       <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                                          <div
                                             className={`h-full transition-all duration-1000 ${method === 'CARD' ? 'bg-blue-500' : method === 'VENMO' ? 'bg-sky-400' : 'bg-emerald-500'}`}
                                             style={{ width: `${(amount / (nightlyAnalytics.gross || 1)) * 100}%` }}
                                          />
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </div>

                           {/* Size Distribution */}
                           <div className="bg-gray-950 border border-gray-900 rounded-[3rem] p-10">
                              <h4 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                                 <Layers size={16} className="text-purple-500" /> Size Demand
                              </h4>
                              <div className="grid grid-cols-2 gap-4">
                                 {Object.entries(nightlyAnalytics.sizeBreakdown).map(([size, count]) => (
                                    <div key={size} className="bg-black/40 border border-gray-800 p-4 rounded-2xl flex items-center justify-between">
                                       <span className="text-xl font-black text-white">{size}</span>
                                       <div className="text-right">
                                          <p className="text-lg font-black text-purple-400">{count}</p>
                                          <p className="text-[8px] font-black text-gray-600 uppercase">Sold</p>
                                       </div>
                                    </div>
                                 ))}
                                 {Object.keys(nightlyAnalytics.sizeBreakdown).length === 0 && (
                                    <div className="col-span-full py-12 text-center opacity-20"><p className="text-[10px] font-black uppercase">No Size Data</p></div>
                                 )}
                              </div>
                           </div>

                           {/* Night Log */}
                           <div className="bg-gray-950 border border-gray-900 rounded-[3rem] p-10 overflow-hidden flex flex-col">
                              <h4 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Transaction Log</h4>
                              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                                 {nightlyAnalytics.history.map(sale => (
                                    <div key={sale.id} className="bg-black/30 p-4 rounded-2xl border border-gray-800 flex items-center justify-between group hover:border-emerald-500/20 transition-all">
                                       <div>
                                          <p className="text-[10px] font-black text-white uppercase truncate w-32">{sale.itemName}</p>
                                          <p className="text-[8px] text-gray-600 font-bold uppercase">{sale.size} • {new Date(sale.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                       </div>
                                       <div className="text-right">
                                          <p className="text-[10px] font-black text-emerald-500">${sale.totalAmount}</p>
                                          <div className="flex justify-end gap-1 mt-1 opacity-40">
                                             {sale.paymentMethod === 'CARD' ? <CreditCard size={10} /> : sale.paymentMethod === 'CASH' ? <Banknote size={10} /> : <Smartphone size={10} />}
                                          </div>
                                       </div>
                                    </div>
                                 ))}
                                 {nightlyAnalytics.history.length === 0 && (
                                    <div className="h-full flex items-center justify-center opacity-20"><p className="text-[10px] font-black uppercase">Ledger Clear</p></div>
                                 )}
                              </div>
                           </div>
                        </div>
                     </section>

                     <hr className="border-gray-900" />

                     {/* Global Run Metrics */}
                     <section>
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-10">Run-to-Date Performance</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                           <div className="bg-gray-900/40 border border-gray-800 p-10 rounded-[3rem]">
                              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Total Run Rev</p>
                              <p className="text-6xl font-black text-white tracking-tighter">${globalAnalytics.totalSales.toFixed(2)}</p>
                           </div>
                           <div className="bg-emerald-500/10 border border-emerald-500/20 p-10 rounded-[3rem]">
                              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-4">Total Profit</p>
                              <p className="text-6xl font-black text-white tracking-tighter">${globalAnalytics.profit.toFixed(2)}</p>
                           </div>
                           <div className="bg-gray-900/40 border border-gray-800 p-10 rounded-[3rem]">
                              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Run Burn</p>
                              <p className="text-6xl font-black text-white tracking-tighter">{salesHistory.length} Items</p>
                           </div>
                        </div>
                     </section>
                  </div>
               )}

               {/* SETTLEMENT VIEW */}
               {view === 'SETTLEMENT' && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                     <div className="flex items-center justify-between">
                        <div>
                           <h2 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Nightly Settlement</h2>
                           <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">{selectedDay?.location || 'Select a Date'} • {selectedDay?.date}</p>
                        </div>
                        <div className="flex gap-4">
                           <div className="bg-gray-900 border border-gray-800 p-4 rounded-2xl flex flex-col justify-center gap-2 min-h-[100px]">
                              <div className="flex items-center justify-between w-full">
                                 <span className="text-[10px] font-black text-gray-500 uppercase">Sales Tax</span>
                                 {selectedDay?.state && US_STATE_TAX_RATES[selectedDay.state] !== undefined && (
                                    <span className="text-[8px] font-bold text-emerald-500 uppercase bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                       Auto: {selectedDay.state}
                                    </span>
                                 )}
                              </div>
                              <div className="flex items-center gap-2">
                                 <input
                                    type="number"
                                    value={venueSettings.taxRate}
                                    onChange={(e) => setVenueSettings(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                                    className="w-16 bg-black border border-gray-700 rounded-lg p-2 text-center text-sm font-bold text-white focus:border-emerald-500 outline-none"
                                 />
                                 <span className="text-lg font-black text-gray-600">%</span>
                              </div>
                              {selectedDay?.state && (
                                 <a
                                    href={`https://www.google.com/search?q=sales+tax+rate+${selectedDay.cityName}+${selectedDay.state}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[9px] font-bold text-blue-500 hover:text-blue-400 hover:underline uppercase flex items-center gap-1"
                                 >
                                    Verify Local Rate <ArrowRight size={10} />
                                 </a>
                              )}
                           </div>
                           <div className="bg-gray-900 border border-gray-800 p-4 rounded-2xl flex items-center gap-4">
                              <span className="text-[10px] font-black text-gray-500 uppercase">Soft Goods</span>
                              <div className="flex items-center gap-2">
                                 <input
                                    type="number"
                                    value={venueSettings.softCut}
                                    onChange={(e) => setVenueSettings(prev => ({ ...prev, softCut: parseFloat(e.target.value) || 0 }))}
                                    className="w-12 bg-black border border-gray-700 rounded-lg p-2 text-center text-sm font-bold text-white focus:border-emerald-500 outline-none"
                                 />
                                 <span className="text-lg font-black text-gray-600">%</span>
                              </div>
                           </div>
                           <div className="bg-gray-900 border border-gray-800 p-4 rounded-2xl flex items-center gap-4">
                              <span className="text-[10px] font-black text-gray-500 uppercase">Hard Goods</span>
                              <div className="flex items-center gap-2">
                                 <input
                                    type="number"
                                    value={venueSettings.hardCut}
                                    onChange={(e) => setVenueSettings(prev => ({ ...prev, hardCut: parseFloat(e.target.value) || 0 }))}
                                    className="w-12 bg-black border border-gray-700 rounded-lg p-2 text-center text-sm font-bold text-white focus:border-emerald-500 outline-none"
                                 />
                                 <span className="text-lg font-black text-gray-600">%</span>
                              </div>
                           </div>
                           <div className="bg-gray-900 border border-gray-800 p-4 rounded-2xl flex items-center gap-4">
                              <span className="text-[10px] font-black text-gray-500 uppercase">Music</span>
                              <div className="flex items-center gap-2">
                                 <input
                                    type="number"
                                    value={venueSettings.musicCut}
                                    onChange={(e) => setVenueSettings(prev => ({ ...prev, musicCut: parseFloat(e.target.value) || 0 }))}
                                    className="w-12 bg-black border border-gray-700 rounded-lg p-2 text-center text-sm font-bold text-white focus:border-emerald-500 outline-none"
                                 />
                                 <span className="text-lg font-black text-gray-600">%</span>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Breakdown Table */}
                        <div className="bg-gray-950 border border-gray-900 rounded-[3rem] p-10">
                           <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-8">Revenue Breakdown</h3>
                           <div className="space-y-6">
                              {/* Soft Goods Row */}
                              <div className="flex justify-between items-center p-4 bg-gray-900/50 rounded-2xl border border-dashed border-gray-800">
                                 <div>
                                    <p className="text-xs font-black text-white uppercase tracking-widest">Soft Goods</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase">Apparel, Hats</p>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-xl font-black text-white">${settlementAnalytics.grossSoft.toFixed(2)}</p>
                                    <p className="text-[10px] font-black text-red-500 uppercase">- ${settlementAnalytics.feeSoft.toFixed(2)} (Venue)</p>
                                 </div>
                              </div>

                              {/* Hard Goods Row */}
                              <div className="flex justify-between items-center p-4 bg-gray-900/50 rounded-2xl border border-dashed border-gray-800">
                                 <div>
                                    <p className="text-xs font-black text-white uppercase tracking-widest">Hard Goods</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase">Stickers, Pins</p>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-xl font-black text-white">${settlementAnalytics.grossHard.toFixed(2)}</p>
                                    <p className="text-[10px] font-black text-red-500 uppercase">- ${settlementAnalytics.feeHard.toFixed(2)} (Venue)</p>
                                 </div>
                              </div>

                              {/* Music Row */}
                              <div className="flex justify-between items-center p-4 bg-gray-900/50 rounded-2xl border border-dashed border-gray-800">
                                 <div>
                                    <p className="text-xs font-black text-white uppercase tracking-widest">Music</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase">Vinyl, CDs</p>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-xl font-black text-white">${settlementAnalytics.grossMusic.toFixed(2)}</p>
                                    <p className="text-[10px] font-black text-red-500 uppercase">- ${settlementAnalytics.feeMusic.toFixed(2)} (Venue)</p>
                                 </div>
                              </div>

                              <hr className="border-gray-800" />

                              <div className="flex justify-between items-center">
                                 <p className="text-sm font-black text-gray-500 uppercase tracking-widest">Total Venue Cut</p>
                                 <p className="text-3xl font-black text-red-500 tracking-tighter">
                                    ${settlementAnalytics.totalVenueFee.toFixed(2)}
                                 </p>
                              </div>
                              <div className="flex justify-between items-center mt-2">
                                 <p className="text-sm font-black text-gray-500 uppercase tracking-widest">Est. Tax Liability</p>
                                 <p className="text-xl font-black text-yellow-500 tracking-tighter">
                                    ${settlementAnalytics.estTaxLiability.toFixed(2)}
                                 </p>
                              </div>
                           </div>
                        </div>

                        {/* Cash Reconciliation */}
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-[3rem] p-10 flex flex-col justify-between">
                           <div>
                              <h3 className="text-xl font-black text-emerald-500 uppercase tracking-tighter mb-8">Cash Reconciliation</h3>
                              <div className="space-y-4">
                                 <div className="flex justify-between">
                                    <span className="text-xs font-bold text-gray-400 uppercase">Total Cash Collected</span>
                                    <span className="text-xs font-black text-white uppercase">${nightlyAnalytics.paymentBreakdown.CASH.toFixed(2)}</span>
                                 </div>
                                 <div className="flex justify-between">
                                    <div className="flex flex-col">
                                       <span className="text-xs font-bold text-gray-400 uppercase">Venue Cut Owed</span>
                                       <span className="text-[8px] text-gray-600 uppercase">After Tax Deduction</span>
                                    </div>
                                    <span className="text-xs font-black text-red-400 uppercase">
                                       -${settlementAnalytics.totalVenueFee.toFixed(2)}
                                    </span>
                                 </div>
                              </div>
                           </div>

                           <div className="pt-8 border-t border-emerald-500/20 mt-8">
                              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-2">Net Cash To Keep</p>
                              <p className="text-6xl font-black text-white tracking-tighter">
                                 ${(nightlyAnalytics.paymentBreakdown.CASH - settlementAnalytics.totalVenueFee).toFixed(2)}
                              </p>
                              <p className="text-[9px] text-gray-500 mt-4 uppercase font-bold max-w-xs leading-relaxed">
                                 * If negative, venue owes you from credit card sales. If positive, pay this amount from cash drawer.
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>
               )}
            </div>

            {/* RIGHT COLUMN: POS Checkout */}
            {view === 'SALES' && (
               <div className="w-96 border-l border-gray-900 bg-gray-950 flex flex-col shrink-0 animate-in slide-in-from-right-4 duration-500">
                  <div className="p-8 border-b border-gray-900 bg-black/40 flex justify-between items-center shrink-0">
                     <div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-none">Order Queue</h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Live Transaction Flow</p>
                     </div>
                     <button onClick={() => setCart([])} className="p-3 bg-gray-900 text-gray-600 hover:text-white rounded-xl transition-all shadow-lg hover:bg-red-500/10 hover:text-red-500">
                        <Trash2 size={18} />
                     </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-black/20">
                     {cart.length > 0 ? cart.map(ci => (
                        <div key={ci.cartId} className="bg-gray-900 border border-gray-800 rounded-[2rem] p-5 shadow-2xl group hover:border-emerald-500/30 transition-all">
                           <div className="flex justify-between items-start mb-4">
                              <div>
                                 <p className="text-xs font-black text-white uppercase tracking-tight leading-tight">{ci.name}</p>
                                 <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Size: <span className="text-emerald-500">{ci.size}</span></p>
                              </div>
                              <button onClick={() => removeFromCart(ci.cartId)} className="p-1.5 text-gray-700 hover:text-red-500 transition-colors bg-gray-950 rounded-lg">
                                 <X size={12} />
                              </button>
                           </div>

                           <div className="flex items-center justify-between mt-6">
                              <p className="text-base font-black text-white ml-auto mr-4">
                                 {ci.discountType === 'COMP' ? <span className="text-blue-400">COMP $0</span> :
                                    ci.discountType === 'HALF' ? <span className="text-yellow-400">HALF ${(ci.price / 2).toFixed(0)}</span> :
                                       ci.discountType === 'CREW' ? <span className="text-purple-400">CREW ${(items.find(i => i.id === ci.itemId)?.costPrice || 10).toFixed(0)}</span> :
                                          `$${ci.price}`}
                              </p>

                              {/* Discount Cycle Button */}
                              <button
                                 onClick={() => {
                                    const types: ('NONE' | 'HALF' | 'CREW' | 'COMP')[] = ['NONE', 'HALF', 'CREW', 'COMP'];
                                    const nextType = types[(types.indexOf(ci.discountType) + 1) % types.length];
                                    setCart(prev => prev.map(i => i.cartId === ci.cartId ? { ...i, discountType: nextType } : i));
                                 }}
                                 className={`p-3 rounded-lg mr-2 transition-all ${ci.discountType === 'COMP' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' :
                                    ci.discountType === 'HALF' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' :
                                       ci.discountType === 'CREW' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50' :
                                          'bg-gray-950 text-gray-700 hover:text-white'
                                    }`}
                                 title="Cycle Discount: Full -> Half -> Crew -> Comp"
                              >
                                 <Tag size={20} />
                              </button>

                              {/* 3 Choice Payment Method Switcher */}
                              <div className="flex bg-black p-1 rounded-xl border border-gray-800 shadow-inner gap-1">
                                 {[
                                    { method: 'CASH', icon: Banknote, label: 'Cash' },
                                    { method: 'VENMO', icon: Smartphone, label: 'Venmo / App' },
                                    { method: 'CARD', icon: CreditCard, label: 'Card Reader' }
                                 ].map(p => (
                                    <div key={p.method} className="relative group/tooltip">
                                       <button
                                          onClick={() => updateCartItemPayment(ci.cartId, p.method as PaymentMethod)}
                                          className={`p-3 rounded-lg transition-all ${ci.paymentMethod === p.method ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/40' : 'text-gray-600 hover:text-gray-300'}`}
                                       >
                                          <p.icon size={20} />
                                       </button>
                                       <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-[9px] font-bold uppercase tracking-widest rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                          {p.label}
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </div>
                     )) : (
                        <div className="h-full flex flex-col items-center justify-center opacity-20 text-center px-10">
                           <ShoppingCart size={48} className="mb-6 text-gray-500" />
                           <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">Add items to build<br />this customer's order</p>
                        </div>
                     )}
                  </div>

                  <div className="p-8 border-t border-gray-900 bg-gray-950 shrink-0">
                     <div className="flex justify-between items-center mb-8">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Transaction Total</p>
                        <p className="text-4xl font-black text-white tracking-tighter">${cartTotal.toFixed(0)}</p>
                     </div>
                     <button
                        onClick={submitOrder}
                        disabled={cart.length === 0}
                        className="w-full py-5 bg-emerald-500 text-black rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-emerald-500/20 active:scale-95 disabled:opacity-20 transition-all flex items-center justify-center gap-3"
                     >
                        <CheckCircle size={20} /> Submit Order
                     </button>
                  </div>
               </div>
            )}
         </div>

         {/* ITEM EDITOR MODAL */}
         {isEditing && editingItem && (
            <div className="fixed inset-0 z-[2500] bg-black/95 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in zoom-in-95 duration-300">
               <div className="w-full max-w-4xl bg-gray-950 border border-gray-800 rounded-[3.5rem] p-12 relative shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                  <button onClick={() => setIsEditing(false)} className="absolute top-10 right-10 p-3 bg-gray-900 rounded-full text-gray-500 hover:text-white"><X size={24} /></button>

                  <div className="flex items-center gap-6 mb-12">
                     <div className="p-5 bg-blue-500/10 rounded-3xl border border-blue-500/20">
                        <Edit3 className="text-blue-500" size={32} />
                     </div>
                     <div>
                        <h3 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Gear Designer</h3>
                        <p className="text-xs text-blue-400 font-black uppercase tracking-widest mt-1">Editing SKU: {editingItem.id}</p>
                     </div>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar space-y-10 pr-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                           <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2 px-2"><ImageIcon size={14} /> Brand Details</h4>
                           <div className="space-y-4" onPaste={handlePaste}>
                              <input
                                 value={editingItem.name}
                                 onChange={e => setEditingItem({ ...editingItem, name: e.target.value })}
                                 placeholder="Item Name (e.g. ZDubs Logo Tee)"
                                 className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-5 text-sm text-white focus:border-blue-500/50 outline-none"
                              />
                              <select
                                 value={editingItem.category}
                                 onChange={e => setEditingItem({ ...editingItem, category: e.target.value })}
                                 className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-5 text-sm text-white focus:border-blue-500/50 outline-none appearance-none font-bold"
                              >
                                 {managedCategories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                 ))}
                              </select>

                              <div className="relative">
                                 <input
                                    value={editingItem.imageUrl}
                                    onChange={e => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                                    placeholder="Paste Image Layer or URL..."
                                    className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-5 text-xs text-blue-400 focus:border-blue-500/50 outline-none pr-12"
                                 />
                                 <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                    <label className="p-2 cursor-pointer bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors">
                                       <Upload size={14} />
                                       <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    </label>
                                 </div>
                              </div>
                              <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest pl-2">Tip: Click invalid URL field and paste image directly (Ctrl+V)</p>
                           </div>
                        </div>

                        <div className="space-y-6">
                           <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2 px-2"><DollarSign size={14} /> Price Points</h4>
                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                 <label className="text-[8px] font-black text-gray-500 uppercase mb-2 block ml-1">Cost To Band</label>
                                 <input type="number" value={editingItem.costPrice} onChange={e => setEditingItem({ ...editingItem, costPrice: parseFloat(e.target.value) || 0 })} className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-5 text-sm text-white" />
                              </div>
                              <div>
                                 <label className="text-[8px] font-black text-gray-500 uppercase mb-2 block ml-1">Retail Price</label>
                                 <input type="number" value={editingItem.salePrice} onChange={e => setEditingItem({ ...editingItem, salePrice: parseFloat(e.target.value) || 0 })} className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-5 text-sm text-white" />
                              </div>
                           </div>
                           <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-3xl flex justify-between items-center">
                              <span className="text-[10px] font-black text-emerald-500 uppercase">Profit Margin / Unit</span>
                              <span className="text-2xl font-black text-white">${(editingItem.salePrice - editingItem.costPrice).toFixed(2)}</span>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-6 pt-10 border-t border-gray-900">
                        <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2"><List size={14} /> Starting Stock (Grid)</h4>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                           {(['S', 'M', 'L', 'XL', 'XXL', 'OS'] as SizeKey[]).map(size => (
                              <div key={size} className="bg-gray-900 border border-gray-800 p-5 rounded-3xl text-center focus-within:border-blue-500 transition-all shadow-inner">
                                 <p className="text-[10px] font-black text-gray-500 uppercase mb-3">{size}</p>
                                 <input
                                    type="number"
                                    value={editingItem.stock[size]}
                                    onChange={e => setEditingItem({
                                       ...editingItem,
                                       stock: { ...editingItem.stock, [size]: parseInt(e.target.value) || 0 }
                                    })}
                                    className="w-full bg-transparent text-center text-xl font-black text-white outline-none"
                                 />
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="flex gap-4 mt-12 pt-8 border-t border-gray-900">
                     <button onClick={() => setIsEditing(false)} className="px-10 py-5 text-xs font-black uppercase text-gray-500 hover:text-white transition-colors">Discard</button>
                     <button onClick={saveItem} className="flex-1 py-5 bg-emerald-500 text-black rounded-3xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-emerald-500/20 hover:scale-[1.02] transition-all">Lock Into Database</button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default MerchHub;
