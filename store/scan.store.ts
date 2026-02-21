import { create } from "zustand";
import { ImageScanResponse } from "@/services/products.service";
import { productService } from "@/services/products.service";

interface ScanStore {
  scanResult: ImageScanResponse | null;
  scannedImageUrl: string | null;
  isScanning: boolean;
  error: string | null;
  scanImage: (file: File) => Promise<ImageScanResponse | null>;
  clearScan: () => void;
}

export const useScanStore = create<ScanStore>((set) => ({
  scanResult: null,
  scannedImageUrl: null,
  isScanning: false,
  error: null,

  scanImage: async (file: File) => {
    set({ isScanning: true, error: null });

    // Create a preview URL for the scanned image
    const imageUrl = URL.createObjectURL(file);

    try {
      const { data, error } = await productService.scanImage(file);

      if (error || !data) {
        set({ isScanning: false, error: error || "Scan failed" });
        return null;
      }

      set({
        scanResult: data,
        scannedImageUrl: imageUrl,
        isScanning: false,
        error: null,
      });

      return data;
    } catch (err: any) {
      set({
        isScanning: false,
        error: err.message || "Failed to scan image",
      });
      return null;
    }
  },

  clearScan: () => {
    set({
      scanResult: null,
      scannedImageUrl: null,
      isScanning: false,
      error: null,
    });
  },
}));
