import { create } from "zustand";
import {
  ImageScanResponse,
  QrCodeAnalysisResponse,
} from "@/services/products.service";
import { productService } from "@/services/products.service";

interface ScanStore {
  scanResult: ImageScanResponse | null;
  scannedImageUrl: string | null;
  isScanning: boolean;
  error: string | null;
  barcodeResult: QrCodeAnalysisResponse | null;
  scanImage: (file: File) => Promise<ImageScanResponse | null>;
  scanBarcode: (file: File) => Promise<QrCodeAnalysisResponse | null>;
  clearScan: () => void;
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
      barcodeResult: null,
    });
  },

  scanBarcode: async (file: File) => {
    set({ isScanning: true, error: null });
    const imageUrl = URL.createObjectURL(file);

    try {
      // Extract barcode/QR code data from the image
      const scanData = await extractBarcodeData(file);

      if (!scanData) {
        set({
          isScanning: false,
          error: "No barcode or QR code found in the image",
        });
        return null;
      }

      // Send extracted data to the API
      const { data, error } = await productService.analyzeQrCode(scanData);

      if (error || !data) {
        set({ isScanning: false, error: error || "Analysis failed" });
        return null;
      }

      set({
        barcodeResult: data,
        scanResult: data as unknown as ImageScanResponse,
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
