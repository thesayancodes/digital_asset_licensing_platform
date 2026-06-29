import { create } from 'zustand';
import type { License, LicenseTemplate } from '../contracts/license-manager';

interface LicenseStore {
  licenses: Record<number, License>;
  templates: Record<number, LicenseTemplate>;
  isLoading: boolean;

  setLicenses: (licenses: License[]) => void;
  addLicense: (license: License) => void;
  setTemplates: (templates: LicenseTemplate[]) => void;
  addTemplate: (template: LicenseTemplate) => void;
  setLoading: (loading: boolean) => void;
}

export const useLicenseStore = create<LicenseStore>((set) => ({
  licenses: {},
  templates: {},
  isLoading: false,

  setLicenses: (licenses) =>
    set({
      licenses: licenses.reduce(
        (acc, l) => ({ ...acc, [l.id]: l }),
        {}
      ),
    }),

  addLicense: (license) =>
    set((state) => ({
      licenses: { ...state.licenses, [license.id]: license },
    })),

  setTemplates: (templates) =>
    set({
      templates: templates.reduce(
        (acc, t) => ({ ...acc, [t.asset_id]: t }),
        {}
      ),
    }),

  addTemplate: (template) =>
    set((state) => ({
      templates: { ...state.templates, [template.asset_id]: template },
    })),

  setLoading: (isLoading) => set({ isLoading }),
}));
