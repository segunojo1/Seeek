import { create } from "zustand";
import {
  ImageScanResponse,
  QrCodeAnalysisResponse,
} from "@/services/products.service";
import { productService } from "@/services/products.service";
import { useUserStore } from "@/store/user.store";

interface ScanStore {
  scanResult: ImageScanResponse | null;
  scannedImageUrl: string | null;
  isScanning: boolean;
  error: string | null;
  barcodeResult: QrCodeAnalysisResponse | null;
  isBarcodeMode: boolean;
  scanImage: (file: File) => Promise<ImageScanResponse | null>;
  scanBarcode: (file: File) => Promise<QrCodeAnalysisResponse | null>;
  clearScan: () => void;
}

function extractNdc(decodedText: string): string {
  const clean = decodedText.replace(/\D/g, "");

  // 12-digit UPC (Standard Retail) — NDC is the 10 digits between first and last
  if (clean.length === 12) {
    return clean.substring(1, 11);
  }

  // GS1 DataMatrix (Complex Healthcare barcode)
  if (clean.length > 12) {
    return clean.substring(2, 12);
  }

  return clean; // Fallback for 10/11 digit codes
}

function formatNdc(ndc: string): string {
  const digits = ndc.replace(/\D/g, "");
  if (digits.length === 10) {
    return `${digits.substring(0, 4)}-${digits.substring(4, 8)}-${digits.substring(8, 10)}`;
  }
  return digits;
}

async function extractBarcodeData(file: File): Promise<string> {
  const { Html5Qrcode } = await import("html5-qrcode");
  const imageUrl = URL.createObjectURL(file);
  try {
    const html5Qrcode = new Html5Qrcode("__qr-reader-hidden");
    const result = await html5Qrcode.scanFileV2(file, /* showImage= */ false);
    return result.decodedText;
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

export const useScanStore = create<ScanStore>((set) => ({
  scanResult: null,
  scannedImageUrl: null,
  isScanning: false,
  error: null,
  barcodeResult: null,
  isBarcodeMode: false,

  scanImage: async (file: File) => {
    const { isScanning } = useScanStore.getState();
    if (isScanning) return null;
    set({ isScanning: true, error: null, isBarcodeMode: false });

    // Create a preview URL for the scanned image
    const imageUrl = URL.createObjectURL(file);

    try {
      const { data, error } = await productService.scanImage(file);

      if (error || !data) {
        set({ isScanning: false, error: error || "Scan failed" });
        return null;
      }

      // Normalize: ensure data has { response: {...} } shape
      const normalized = data.response
        ? data
        : ({ response: data } as unknown as typeof data);

      set({
        scanResult: normalized,
        scannedImageUrl: imageUrl,
        isScanning: false,
        error: null,
      });

      return normalized;
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
      barcodeResult: null,
      isBarcodeMode: false,
    });
  },

  scanBarcode: async (file: File) => {
    const { isScanning } = useScanStore.getState();
    if (isScanning) return null;
    set({ isScanning: true, error: null, isBarcodeMode: true });
    const imageUrl = URL.createObjectURL(file);

    try {
      // Extract barcode/QR code data from the image
      const rawData = await extractBarcodeData(file);

      if (!rawData) {
        set({
          isScanning: false,
          error: "No barcode or QR code found in the image",
        });
        return null;
      }

      // Extract and format NDC from raw barcode
      const ndc = extractNdc(rawData);
      const scanData = formatNdc(ndc);

      // Get user allergies from the user store
      const user = useUserStore.getState().user;
      const userProfile = {
        allergies: user?.allergies || [],
        isPregnant: false,
      };

      // Send extracted data to the API
      const { data, error } = await productService.analyzeQrCode(
        scanData,
        userProfile,
      );

      if (error || !data) {
        set({ isScanning: false, error: error || "Analysis failed" });
        return null;
      }

      set({
        barcodeResult: data,
        scanResult: null,
        scannedImageUrl: imageUrl,
        isScanning: false,
        error: null,
      });

      return data;
    } catch (err: any) {
      set({
        isScanning: false,
        error:
          err.message === "No barcode or QR code found in the image"
            ? err.message
            : "Could not read barcode from this image. Please try a clearer photo.",
      });
      return null;
    }
  },
}));
