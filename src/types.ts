export type ProductType =
  | "banner"
  | "flyers"
  | "cards"
  | "vinyl"
  | "manuals"
  | "tampography"
  | "mugs"
  | "rollup";

export interface ProductExampleItem {
  title: string;
  subtitle: string;
  description: string;
  context?: string;
  imageUrl?: string;
  tags: string[];
  recommendedFinish?: string;
}

export interface ProductConfig {
  id: ProductType;
  name: string;
  description: string;
  icon: string;
  basePrice: number; // Base rate in S/.
  unitLabel: string;
  imageUrl?: string;
  examples?: ProductExampleItem[];
}

export type OrderStage = "received" | "prepress" | "printing" | "delivery";

export interface WorkshopPhoto {
  id: string;
  imageUrl: string;
  stage: OrderStage;
  title: string;
  operatorNote: string;
  timestamp: string;
}

export interface TrackerOrder {
  id: string;
  customerName: string;
  companyName?: string;
  phone: string;
  productName: string;
  specs: string;
  quantity: number;
  totalPrice: number;
  currentStage: OrderStage;
  estimatedDelivery: string;
  createdAt: string;
  photos: WorkshopPhoto[];
}

export interface ValidationResult {
  fileName: string;
  fileSizeMb: number;
  dimensionsPx: { width: number; height: number };
  aspectRatio: number;
  colorSpace: "CMYK" | "RGB";
  dpi: number;
  hasBleed: boolean;
  bleedMarginMm: number;
  issues: ValidationIssue[];
  score: number; // 0 to 100
  fileType?: string; // e.g. "PDF", "PNG", "JPG", "WEBP", "TIFF", "AI"
  previewUrl?: string; // Object URL or base64 preview
}

export interface ValidationIssue {
  type: "error" | "warning" | "success";
  title: string;
  description: string;
  recommendation: string;
}

export interface QuoteData {
  proformaId: string;
  productType: ProductType;
  productName: string;
  customerName: string;
  customerCompany: string;
  descriptionSpecs: string;
  specialNotes?: string;
  subtotalNoIGV: number;
  igvAmount: number;
  finalTotal: number;
  includeIGV: boolean;
  isExpress: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
}
