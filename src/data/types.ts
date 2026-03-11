export type POCategory = 
  | 'IT Hardware' 
  | 'Facilities' 
  | 'Marketing' 
  | 'Logistics' 
  | 'Professional Services' 
  | 'Packaging';

export type POStatus = 
  | 'Pending Approval' 
  | 'Approved' 
  | 'Sent to Supplier' 
  | 'Goods Received' 
  | 'Invoiced' 
  | 'Closed';

export interface POLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierName: string;
  category: POCategory;
  totalValue: number;
  status: POStatus;
  creationDate: string;
  expectedDelivery: string;
  daysOpen: number;
  lineItems: POLineItem[];
  supplierNotes?: string;
  actionRequired?: string;
  currentStepIndex: number; // 0: Requisition Created, 1: Approved, 2: PO Issued, 3: Goods Received, 4: Invoice Received, 5: Payment Processed
}

// Invoice types
export type InvoiceMismatchReason = 
  | 'Price Variance' 
  | 'Quantity Mismatch' 
  | 'Duplicate Invoice' 
  | 'Missing Goods Receipt' 
  | 'Contract Terms Mismatch';

export type InvoiceStatus = 'Auto-Matched' | 'Under Review' | 'Escalated' | 'Resolved';

export interface InvoiceException {
  id: string;
  invoiceNumber: string;
  supplierName: string;
  poReference: string;
  invoicedAmount: number;
  poAmount: number;
  varianceAmount: number;
  variancePercentage: number;
  mismatchReason: InvoiceMismatchReason;
  status: InvoiceStatus;
  recommendedResolution: string;
  dateFlagged: string;
  // Details for side-by-side comparison
  invoiceLineItems: POLineItem[];
  poLineItems: POLineItem[];
}

// Supplier Performance types
export type RiskRating = 'Low' | 'Medium' | 'High';

export interface ContractTerm {
  term: string;
  isMeeting: boolean;
}

export interface OpenIssue {
  id: string;
  description: string;
  dateOpened: string;
  status: string;
}

export interface PerformanceTrendPoint {
  month: string;
  onTimeDelivery: number;
  invoiceAccuracy: number;
  leadTime: number;
}

export interface SupplierPerformance {
  id: string;
  supplierName: string;
  category: POCategory;
  onTimeDeliveryRate: number; // percentage
  invoiceAccuracyRate: number; // percentage
  averageLeadTimeDays: number;
  contractComplianceScore: number; // percentage
  overallScore: number;
  riskRating: RiskRating;
  riskExplanation: string;
  contractTerms: ContractTerm[];
  openIssues: OpenIssue[];
  performanceTrend: PerformanceTrendPoint[];
  trendNarratives: {
    delivery: string;
    accuracy: string;
    leadTime: string;
  };
}

// Process Improvement types
export type ImprovementStatus = 'Identified' | 'In Progress' | 'Piloting' | 'Completed';

export interface ProcessImprovement {
  id: string;
  title: string;
  processArea: string;
  owner: string;
  expectedBenefit: string;
  status: ImprovementStatus;
  problemStatement: string;
  approach: string;
  timeline: string;
  impactStatement: string;
  targetDate?: string;
  actualImpact?: string;
}

// Process Documentation types
export type DocCategory = 
  | 'P2P Standard Operating Procedures' 
  | 'Supplier Onboarding Guidelines' 
  | 'Exception Handling Playbooks' 
  | 'System Configuration Notes';

export interface ProcessDocument {
  id: string;
  title: string;
  category: DocCategory;
  description: string;
  tags: string[];
  version: string;
  lastUpdated: string;
  owner: string;
  content: string; // Markdown or HTML-like structure string for inline view
}
