import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Asset } from '../contracts/asset-registry';

interface AssetStore {
  assets: Record<number, Asset>;
  selectedAssetId: number | null;
  isLoading: boolean;

  setAssets: (assets: Asset[]) => void;
  addAsset: (asset: Asset) => void;
  selectAsset: (id: number | null) => void;
  updateAssetStatus: (id: number, status: Asset['status']) => void;
  setLoading: (loading: boolean) => void;
  getAssetsByOwner: (owner: string) => Asset[];
}

export const useAssetStore = create<AssetStore>()(
  persist(
    (set, get) => ({
      assets: {},
      selectedAssetId: null,
      isLoading: false,

      setAssets: (assets) =>
        set({
          assets: assets.reduce((acc, a) => ({ ...acc, [a.id]: a }), {}),
        }),

      addAsset: (asset) =>
        set((state) => ({
          assets: { [asset.id]: asset, ...state.assets },
        })),

      selectAsset: (id) => set({ selectedAssetId: id }),

      updateAssetStatus: (id, status) =>
        set((state) => {
          const asset = state.assets[id];
          if (!asset) return state;
          return {
            assets: { ...state.assets, [id]: { ...asset, status } },
          };
        }),

      setLoading: (isLoading) => set({ isLoading }),

      getAssetsByOwner: (owner) =>
        Object.values(get().assets).filter((a) => a.owner === owner),
    }),
    {
      name: 'lumina-registered-assets',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
