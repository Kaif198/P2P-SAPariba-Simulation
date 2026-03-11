import type { InvoiceException } from './types';

export const invoiceExceptions: InvoiceException[] = [
  {
    id: 'INV-E-1001',
    invoiceNumber: 'INV-2026-0841',
    supplierName: 'TechCorp Solutions GmbH',
    poReference: 'PO-2026-9020',
    invoicedAmount: 47500.00,
    poAmount: 45000.00,
    varianceAmount: 2500.00,
    variancePercentage: 5.56,
    mismatchReason: 'Price Variance',
    status: 'Under Review',
    recommendedResolution: 'The supplier invoiced €9,500 per unit instead of the agreed €9,000. Request a credit note for the €2,500 difference or verify if a newer hardware model was substituted and approved.',
    dateFlagged: '2026-03-10',
    invoiceLineItems: [
      { id: 'INV-L1', description: 'Cisco Core Switches (Model B)', quantity: 5, unitPrice: 9500.00, total: 47500.00 }
    ],
    poLineItems: [
      { id: 'PO-L1', description: 'Cisco Core Switches', quantity: 5, unitPrice: 9000.00, total: 45000.00 }
    ]
  },
  {
    id: 'INV-E-1002',
    invoiceNumber: 'INV-2026-0842',
    supplierName: 'EuroTrans Logistics',
    poReference: 'PO-2026-9004',
    invoicedAmount: 22000.00,
    poAmount: 22000.00,
    varianceAmount: 0,
    variancePercentage: 0,
    mismatchReason: 'Missing Goods Receipt',
    status: 'Escalated',
    recommendedResolution: 'The invoice matches the PO amount perfectly, but the Logistics category manager has not entered the service receipt confirmation in Ariba. Escalate to the category manager to confirm services were rendered.',
    dateFlagged: '2026-03-09',
    invoiceLineItems: [
      { id: 'INV-L1', description: 'Freight Services - Munich to Berlin Route', quantity: 20, unitPrice: 1100.00, total: 22000.00 }
    ],
    poLineItems: [
      { id: 'PO-L1', description: 'Freight Services - Munich to Berlin Route', quantity: 20, unitPrice: 1100.00, total: 22000.00 }
    ]
  },
  {
    id: 'INV-E-1003',
    invoiceNumber: 'INV-2026-0850',
    supplierName: 'EcoPack Solutions',
    poReference: 'PO-2026-8940',
    invoicedAmount: 18000.00,
    poAmount: 15000.00,
    varianceAmount: 3000.00,
    variancePercentage: 20.0,
    mismatchReason: 'Quantity Mismatch',
    status: 'Under Review',
    recommendedResolution: 'The supplier invoiced for 240,000 bags but the goods receipt record shows only 200,000 were confirmed as received at the warehouse. Either request a credit note for the 40,000-unit difference or confirm with the warehouse team whether the remaining units arrived.',
    dateFlagged: '2026-03-11',
    invoiceLineItems: [
      { id: 'INV-L1', description: 'Storage Bags', quantity: 240000, unitPrice: 0.075, total: 18000.00 }
    ],
    poLineItems: [
      { id: 'PO-L1', description: 'Storage Bags', quantity: 200000, unitPrice: 0.075, total: 15000.00 }
    ]
  },
  {
    id: 'INV-E-1004',
    invoiceNumber: 'INV-2026-0811',
    supplierName: 'McKinley Strategy Consultants',
    poReference: 'PO-2026-8951',
    invoicedAmount: 60000.00,
    poAmount: 60000.00,
    varianceAmount: 0,
    variancePercentage: 0,
    mismatchReason: 'Contract Terms Mismatch',
    status: 'Resolved',
    recommendedResolution: 'The invoice requested Net 15 payment terms, but the master service agreement stipulates Net 45. The invoice has been automatically flagged to prevent early payment. Notify the supplier of the contract terms.',
    dateFlagged: '2026-03-05',
    invoiceLineItems: [
      { id: 'INV-L1', description: 'Consulting Retainer - Feb', quantity: 1, unitPrice: 60000.00, total: 60000.00 }
    ],
    poLineItems: [
      { id: 'PO-L1', description: 'Consulting Retainer - Feb', quantity: 1, unitPrice: 60000.00, total: 60000.00 }
    ]
  },
  {
    id: 'INV-E-1005',
    invoiceNumber: 'INV-2026-0888',
    supplierName: 'Global Print Media AG',
    poReference: 'PO-2026-9010',
    invoicedAmount: 3200.00,
    poAmount: 3200.00,
    varianceAmount: 0,
    variancePercentage: 0,
    mismatchReason: 'Duplicate Invoice',
    status: 'Under Review',
    recommendedResolution: 'This invoice number and amount perfectly matches an invoice already processed on 2026-02-28. Reject this submission as a duplicate to prevent double payment.',
    dateFlagged: '2026-03-12',
    invoiceLineItems: [
      { id: 'INV-L1', description: 'Store Value Concept Posters', quantity: 1000, unitPrice: 3.20, total: 3200.00 }
    ],
    poLineItems: [
      { id: 'PO-L1', description: 'Store Value Concept Posters', quantity: 1000, unitPrice: 3.20, total: 3200.00 }
    ]
  }
];

export const invoiceStats = {
  totalInvoicesThisPeriod: 4820,
  autoMatched: 3615,
  underReview: 1085,
  escalated: 120
};
