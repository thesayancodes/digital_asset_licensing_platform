'use client';

// ============================================
// Assets Page (Matches reference design)
// ============================================

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { 
  Plus, 
  ArrowLeft, 
  Upload, 
  FileText, 
  Palette, 
  Loader2, 
  CheckCircle2, 
  Circle,
  HelpCircle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAssets } from '@/features/assets/hooks/useAssets';
import { AssetGrid } from '@/features/assets/ui/AssetGrid';
import { useWalletStore } from '@/features/wallet/store/wallet.store';
import { useTransactionStore, type TransactionStatus } from '@/features/transactions/store/transaction.store';
import { ASSET_REGISTRY_CONTRACT_ID, EXPLORER_URL } from '@/lib/constants';
import type { Asset, AssetType } from '@/features/assets/contracts/asset-registry';

const demoAssets: Asset[] = [
  { id: 1, owner: 'GAQEBOZ...6ZJN', name: 'Neon Cityscape Collection', content_hash: 'QmT5NvU...yhCxM', asset_type: 'Image', status: 'Active', royalty_bps: 500, created_at: Date.now() / 1000 },
  { id: 2, owner: 'GAQEBOZ...6ZJN', name: 'Abstract Wave Series', content_hash: 'QmR7BkD...j4H2m', asset_type: 'Image', status: 'Active', royalty_bps: 750, created_at: Date.now() / 1000 },
  { id: 3, owner: 'GAQEBOZ...6ZJN', name: 'Ambient Soundscapes Vol.1', content_hash: 'QmX9CpE...w8K5n', asset_type: 'Audio', status: 'Active', royalty_bps: 1000, created_at: Date.now() / 1000 },
];

export default function AssetsPage() {
  const { assets: storeAssets, registerAsset, isLoading } = useAssets();
  const address = useWalletStore((s) => s.address);
  const transactions = useTransactionStore((s) => s.transactions);
  
  const [view, setView] = useState<'portfolio' | 'register'>('portfolio');
  
  // Form State
  const [fileName, setFileName] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [assetType, setAssetType] = useState<AssetType>('Image');
  const [royaltyPercent, setRoyaltyPercent] = useState(10);
  const [price, setPrice] = useState('50');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['art', 'abstract', 'generative']);
  
  // Transaction Tracking State
  const [activeTxId, setActiveTxId] = useState<string | null>(null);

  // Combine store assets with demo assets
  const allAssets = [...storeAssets, ...demoAssets.filter(demo => !storeAssets.some(store => store.id === demo.id))];

  const currentTx = activeTxId ? transactions.get(activeTxId) : null;
  const txStatus: TransactionStatus | null = currentTx ? currentTx.status : null;

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      // Prepopulate asset name if empty
      if (!name) {
        setName(file.name.substring(0, file.name.lastIndexOf('.')) || file.name);
      }
    }
  };

  // Handle adding tag
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim().toLowerCase())) {
        setTags([...tags, tagInput.trim().toLowerCase()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  // Submit asset registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Generate a mock content hash if not uploaded a real file
    const mockHash = 'QmT' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // Create unique TX ID to track in state
    const txId = `tx_register_${Date.now()}`;
    setActiveTxId(txId);

    try {
      // Temporarily write TX directly to start the UI timeline immediately
      useTransactionStore.getState().addTransaction(
        txId, 
        ASSET_REGISTRY_CONTRACT_ID, 
        'register_asset', 
        `Register: ${name}`
      );

      // Execute on-chain contract method
      await registerAsset({
        name: name.trim(),
        contentHash: mockHash,
        assetType,
        royaltyBps: Math.round(royaltyPercent * 100),
      });

      // Clear states on success
      setTimeout(() => {
        setView('portfolio');
        setName('');
        setDescription('');
        setFileName(null);
        setActiveTxId(null);
      }, 2000);
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  // XLM conversion estimate
  const usdPrice = (Number(price) || 0) * 0.118;

  // Timeline Step Checker helper
  const getStepState = (step: number) => {
    // Steps: 1 = Building, 2 = Simulating, 3 = Signing, 4 = Submitting, 5 = Confirmed
    if (!txStatus) return 'idle';

    if (txStatus === 'failed') return 'failed';

    const statusOrder: Record<TransactionStatus, number> = {
      building: 1,
      simulating: 2,
      signing: 3,
      submitting: 4,
      pending: 4,
      confirmed: 5,
      failed: 0,
    };

    const currentOrder = statusOrder[txStatus];

    if (currentOrder > step) return 'completed';
    if (currentOrder === step) return 'active';
    return 'idle';
  };

  return (
    <AppShell title={view === 'portfolio' ? 'My Assets' : 'Register New Asset'}>
      {view === 'portfolio' ? (
        // ── PORTFOLIO VIEW ──
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-[9px] font-black text-white/30 tracking-widest uppercase -mb-0.5">
                My Assets
              </p>
              <h1 className="text-xl font-extrabold text-white tracking-wide">Registered Assets</h1>
            </div>
            
            <button
              onClick={() => setView('register')}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold
                px-5 py-2.5 rounded-xl hover:from-blue-500 hover:to-indigo-500 hover:shadow-lg 
                hover:shadow-blue-500/20 transition-all text-xs shrink-0"
            >
              <Plus className="w-4 h-4" />
              Register New Asset
            </button>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-20 text-white/40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mr-3" />
                Loading portfolio from Stellar network...
              </div>
            ) : (
              <AssetGrid assets={allAssets} />
            )}
          </div>
        </div>
      ) : (
        // ── REGISTRATION FORM VIEW (TWO COLUMN MATCHING SCREENSHOT) ──
        <div className="space-y-6">
          {/* Back Navigation Header */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => { setView('portfolio'); setActiveTxId(null); }}
              className="p-2 rounded-lg bg-[#090d23] border border-[#141b3a] text-white/60 hover:text-white hover:bg-[#0c1333] transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <p className="text-[9px] font-black text-white/30 tracking-widest uppercase -mb-0.5">
                My Assets
              </p>
              <h1 className="text-xl font-extrabold text-white tracking-wide">Register New Asset</h1>
            </div>
          </div>

          <form onSubmit={handleRegisterSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Left Column - Input Form Fields (span 2) */}
            <div className="lg:col-span-2 bg-[#090d23] border border-[#141b3a] rounded-xl p-6 space-y-5">
              
              {/* File Upload Box */}
              <div>
                <label className="block text-white/50 text-[10px] font-extrabold tracking-wider uppercase mb-2">Asset File</label>
                <div className="relative border border-dashed border-[#17225c] hover:border-blue-500/50 rounded-xl p-8 bg-[#050818] flex flex-col items-center justify-center text-center cursor-pointer transition-all">
                  <input 
                    type="file" 
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="w-12 h-12 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3">
                    <Upload className="w-5 h-5" />
                  </div>
                  {fileName ? (
                    <div>
                      <p className="text-white font-bold text-sm">{fileName}</p>
                      <p className="text-white/30 text-xs mt-1">Click or drag another to replace</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-white font-bold text-xs">
                        Drop your file here or <span className="text-blue-400 underline">browse to upload</span>
                      </p>
                      <p className="text-white/30 text-[10px] font-semibold mt-1">PNG, JPG, MP3, MP4, PDF — up to 100MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Asset Name */}
              <div>
                <label className="block text-white/50 text-[10px] font-extrabold tracking-wider uppercase mb-2">Asset Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Abstract Series #01 — Digital Artwork"
                  className="w-full bg-[#050818] border border-[#141b3a] rounded-lg px-4 py-3 text-white text-xs font-bold placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-white/50 text-[10px] font-extrabold tracking-wider uppercase mb-2">Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A generative digital artwork from the Abstract Series collection..."
                  className="w-full bg-[#050818] border border-[#141b3a] rounded-lg px-4 py-3 text-white text-xs font-bold placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-all resize-none"
                />
              </div>

              {/* Default License Type + Royalty % (Inline) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/50 text-[10px] font-extrabold tracking-wider uppercase mb-2">Default License Type *</label>
                  <div className="relative">
                    <select
                      value={assetType}
                      onChange={(e) => setAssetType(e.target.value as AssetType)}
                      className="w-full bg-[#050818] border border-[#141b3a] rounded-lg px-4 py-3 text-white text-xs font-bold focus:outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
                    >
                      <option value="Image">Commercial</option>
                      <option value="Audio">Personal</option>
                      <option value="Video">Exclusive</option>
                      <option value="Document">Editorial</option>
                      <option value="Other">Enterprise</option>
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-white/50 text-[10px] font-extrabold tracking-wider uppercase mb-2">Royalty % *</label>
                  <div className="relative">
                    <select
                      value={royaltyPercent}
                      onChange={(e) => setRoyaltyPercent(Number(e.target.value))}
                      className="w-full bg-[#050818] border border-[#141b3a] rounded-lg px-4 py-3 text-white text-xs font-bold focus:outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
                    >
                      <option value="5">5%</option>
                      <option value="10">10%</option>
                      <option value="15">15%</option>
                      <option value="20">20%</option>
                      <option value="25">25%</option>
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* License Price + Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/50 text-[10px] font-extrabold tracking-wider uppercase mb-2">License Price (XLM) *</label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="50"
                      className="w-full bg-[#050818] border border-[#141b3a] rounded-lg px-4 py-3 text-white text-xs font-bold focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white/30 uppercase">
                      ≈ ${usdPrice.toFixed(2)} USD
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-white/50 text-[10px] font-extrabold tracking-wider uppercase mb-2">Tags (Press Enter)</label>
                  <div className="flex flex-wrap gap-1.5 items-center bg-[#050818] border border-[#141b3a] rounded-lg p-2.5 min-h-[42px]">
                    {tags.map((tag) => (
                      <span 
                        key={tag}
                        className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1.5"
                      >
                        {tag}
                        <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-blue-300">×</button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder={tags.length === 0 ? "art, photo..." : ""}
                      className="flex-1 min-w-[60px] bg-transparent text-xs text-white placeholder-white/20 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!!activeTxId}
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3.5 px-6 
                  rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all duration-300
                  hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
              >
                {activeTxId ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Registering on Stellar...
                  </>
                ) : (
                  'Register on Stellar →'
                )}
              </button>

            </div>

            {/* Right Column - Summary & Live Transaction Status Timeline */}
            <div className="space-y-6">
              
              {/* Asset Preview Box */}
              <div className="bg-[#090d23] border border-[#141b3a] rounded-xl p-6">
                <h3 className="text-white/50 text-[10px] font-extrabold tracking-wider uppercase mb-4">Asset Preview</h3>
                <div className="h-44 border border-dashed border-[#141b3a] bg-[#050818] rounded-lg flex flex-col items-center justify-center text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3 animate-pulse">
                    <Palette className="w-5 h-5" />
                  </div>
                  <p className="text-white font-bold text-xs">Preview will appear here</p>
                  <p className="text-white/30 text-[9px] font-semibold mt-1">After file selection and upload</p>
                </div>
              </div>

              {/* On-Chain Summary */}
              <div className="bg-[#090d23] border border-[#141b3a] rounded-xl p-6 space-y-4">
                <h3 className="text-white/50 text-[10px] font-extrabold tracking-wider uppercase mb-2">On-Chain Summary</h3>
                <div className="space-y-2.5 text-xs font-semibold">
                  <div className="flex items-center justify-between">
                    <span className="text-white/40">Contract</span>
                    <a 
                      href={`${EXPLORER_URL}/contract/${ASSET_REGISTRY_CONTRACT_ID}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 flex items-center gap-1 hover:underline"
                    >
                      AssetRegistry
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/40">Network</span>
                    <div className="flex items-center gap-1.5 text-white/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Testnet</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/40">Est. fee</span>
                    <span className="text-white/95">0.00001 XLM</span>
                  </div>
                </div>
              </div>

              {/* Transaction Lifecycle Timeline */}
              <div className="bg-[#090d23] border border-[#141b3a] rounded-xl p-6 space-y-4">
                <h3 className="text-white/50 text-[10px] font-extrabold tracking-wider uppercase mb-4">Transaction Lifecycle</h3>
                
                <div className="relative pl-6 space-y-5">
                  {/* Vertical line indicator */}
                  <div className="absolute left-[7px] top-[7px] bottom-[7px] w-0.5 bg-[#141b3a]" />

                  {/* Step 1: Building */}
                  <div className="relative flex gap-3.5">
                    <div className="absolute -left-[23px] top-[1px] bg-[#090d23] rounded-full p-0.5 z-10">
                      {getStepState(1) === 'completed' ? (
                        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 fill-[#090d23]" />
                      ) : getStepState(1) === 'active' ? (
                        <Loader2 className="w-4.5 h-4.5 text-blue-400 animate-spin" />
                      ) : (
                        <Circle className="w-4.5 h-4.5 text-white/20" />
                      )}
                    </div>
                    <div>
                      <p className={cn(
                        "text-xs font-bold leading-none",
                        getStepState(1) === 'completed' ? "text-emerald-400" : getStepState(1) === 'active' ? "text-blue-400" : "text-white/30"
                      )}>Building</p>
                      <p className="text-[10px] text-white/40 mt-1 font-semibold">Transaction constructed</p>
                    </div>
                  </div>

                  {/* Step 2: Simulating */}
                  <div className="relative flex gap-3.5">
                    <div className="absolute -left-[23px] top-[1px] bg-[#090d23] rounded-full p-0.5 z-10">
                      {getStepState(2) === 'completed' ? (
                        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 fill-[#090d23]" />
                      ) : getStepState(2) === 'active' ? (
                        <Loader2 className="w-4.5 h-4.5 text-blue-400 animate-spin" />
                      ) : (
                        <Circle className="w-4.5 h-4.5 text-white/20" />
                      )}
                    </div>
                    <div>
                      <p className={cn(
                        "text-xs font-bold leading-none",
                        getStepState(2) === 'completed' ? "text-emerald-400" : getStepState(2) === 'active' ? "text-blue-400" : "text-white/30"
                      )}>Simulating</p>
                      <p className="text-[10px] text-white/40 mt-1 font-semibold">Pre-flight check passed</p>
                    </div>
                  </div>

                  {/* Step 3: Signing */}
                  <div className="relative flex gap-3.5">
                    <div className="absolute -left-[23px] top-[1px] bg-[#090d23] rounded-full p-0.5 z-10">
                      {getStepState(3) === 'completed' ? (
                        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 fill-[#090d23]" />
                      ) : getStepState(3) === 'active' ? (
                        <Loader2 className="w-4.5 h-4.5 text-blue-400 animate-spin" />
                      ) : (
                        <Circle className="w-4.5 h-4.5 text-white/20" />
                      )}
                    </div>
                    <div>
                      <p className={cn(
                        "text-xs font-bold leading-none",
                        getStepState(3) === 'completed' ? "text-emerald-400" : getStepState(3) === 'active' ? "text-blue-400" : "text-white/30"
                      )}>Signing</p>
                      <p className="text-[10px] text-white/40 mt-1 font-semibold">Awaiting wallet signature...</p>
                    </div>
                  </div>

                  {/* Step 4: Submitting */}
                  <div className="relative flex gap-3.5">
                    <div className="absolute -left-[23px] top-[1px] bg-[#090d23] rounded-full p-0.5 z-10">
                      {getStepState(4) === 'completed' ? (
                        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 fill-[#090d23]" />
                      ) : getStepState(4) === 'active' ? (
                        <Loader2 className="w-4.5 h-4.5 text-blue-400 animate-spin" />
                      ) : (
                        <Circle className="w-4.5 h-4.5 text-white/20" />
                      )}
                    </div>
                    <div>
                      <p className={cn(
                        "text-xs font-bold leading-none",
                        getStepState(4) === 'completed' ? "text-emerald-400" : getStepState(4) === 'active' ? "text-blue-400" : "text-white/30"
                      )}>Submitting</p>
                      <p className="text-[10px] text-white/40 mt-1 font-semibold">Broadcast to Stellar</p>
                    </div>
                  </div>

                  {/* Step 5: Confirmed */}
                  <div className="relative flex gap-3.5">
                    <div className="absolute -left-[23px] top-[1px] bg-[#090d23] rounded-full p-0.5 z-10">
                      {getStepState(5) === 'completed' ? (
                        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 fill-[#090d23]" />
                      ) : getStepState(5) === 'active' ? (
                        <Loader2 className="w-4.5 h-4.5 text-blue-400 animate-spin" />
                      ) : (
                        <Circle className="w-4.5 h-4.5 text-white/20" />
                      )}
                    </div>
                    <div>
                      <p className={cn(
                        "text-xs font-bold leading-none",
                        getStepState(5) === 'completed' ? "text-emerald-400" : "text-white/30"
                      )}>Confirmed</p>
                      <p className="text-[10px] text-white/40 mt-1 font-semibold">Transaction complete</p>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </form>
        </div>
      )}
    </AppShell>
  );
}
