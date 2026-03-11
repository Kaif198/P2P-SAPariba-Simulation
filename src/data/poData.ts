import type { PurchaseOrder } from './types';

export const poData: PurchaseOrder[] = [
  {
    id: 'PO-2026-9001',
    poNumber: 'PO-2026-9001',
    supplierName: 'TechCorp Solutions GmbH',
    category: 'IT Hardware',
    totalValue: 12450.00,
    status: 'Goods Received',
    creationDate: '2026-03-01',
    expectedDelivery: '2026-03-10',
    daysOpen: 11,
    currentStepIndex: 3,
    lineItems: [
      { id: 'L1', description: 'ThinkPad T14 Gen 4', quantity: 10, unitPrice: 1200.00, total: 12000.00 },
      { id: 'L2', description: 'Logitech MX Master 3S', quantity: 5, unitPrice: 90.00, total: 450.00 }
    ],
    supplierNotes: 'Delivered in full to central IT hub.',
  },
  {
    id: 'PO-2026-9002',
    poNumber: 'PO-2026-9002',
    supplierName: 'CleanWorks Facility Services',
    category: 'Facilities',
    totalValue: 3500.00,
    status: 'Approved',
    creationDate: '2026-03-05',
    expectedDelivery: '2026-03-15',
    daysOpen: 7,
    currentStepIndex: 1,
    lineItems: [
      { id: 'L1', description: 'Deep Cleaning Services - Region West', quantity: 10, unitPrice: 350.00, total: 3500.00 }
    ],
    actionRequired: 'Awaiting supplier confirmation of service date.',
  },
  {
    id: 'PO-2026-9003',
    poNumber: 'PO-2026-9003',
    supplierName: 'Global Print Media AG',
    category: 'Marketing',
    totalValue: 48500.00,
    status: 'Pending Approval',
    creationDate: '2026-03-11',
    expectedDelivery: '2026-04-01',
    daysOpen: 1,
    currentStepIndex: 0,
    lineItems: [
      { id: 'L1', description: 'Spring Campaign Flyers - DACH Region', quantity: 500000, unitPrice: 0.08, total: 40000.00 },
      { id: 'L2', description: 'In-Store Promotional Banners', quantity: 500, unitPrice: 17.00, total: 8500.00 }
    ],
    actionRequired: 'Requires regional marketing director approval due to high value.',
  },
  {
    id: 'PO-2026-9004',
    poNumber: 'PO-2026-9004',
    supplierName: 'EuroTrans Logistics',
    category: 'Logistics',
    totalValue: 22000.00,
    status: 'Invoiced',
    creationDate: '2026-02-15',
    expectedDelivery: '2026-02-28',
    daysOpen: 25,
    currentStepIndex: 4,
    lineItems: [
      { id: 'L1', description: 'Freight Services - Munich to Berlin Route', quantity: 20, unitPrice: 1100.00, total: 22000.00 }
    ]
  },
  {
    id: 'PO-2026-9005',
    poNumber: 'PO-2026-9005',
    supplierName: 'McKinley Strategy Consultants',
    category: 'Professional Services',
    totalValue: 125000.00,
    status: 'Sent to Supplier',
    creationDate: '2026-03-02',
    expectedDelivery: '2026-06-30',
    daysOpen: 10,
    currentStepIndex: 2,
    lineItems: [
      { id: 'L1', description: 'Supply Chain Optimization Phase 1', quantity: 1, unitPrice: 125000.00, total: 125000.00 }
    ]
  },
  {
    id: 'PO-2026-9006',
    poNumber: 'PO-2026-9006',
    supplierName: 'EcoPack Solutions',
    category: 'Packaging',
    totalValue: 14200.00,
    status: 'Goods Received',
    creationDate: '2026-03-08',
    expectedDelivery: '2026-03-12',
    daysOpen: 4,
    currentStepIndex: 3,
    lineItems: [
      { id: 'L1', description: 'Recyclable Produce Bags', quantity: 200000, unitPrice: 0.071, total: 14200.00 }
    ]
  },
  {
    id: 'PO-2026-9007',
    poNumber: 'PO-2026-9007',
    supplierName: 'TechCorp Solutions GmbH',
    category: 'IT Hardware',
    totalValue: 5600.00,
    status: 'Approved',
    creationDate: '2026-03-10',
    expectedDelivery: '2026-03-20',
    daysOpen: 2,
    currentStepIndex: 1,
    lineItems: [
      { id: 'L1', description: 'Dell UltraSharp Monitors 27"', quantity: 14, unitPrice: 400.00, total: 5600.00 }
    ]
  },
  {
    id: 'PO-2026-9008',
    poNumber: 'PO-2026-9008',
    supplierName: 'SecureIT Networks',
    category: 'IT Hardware',
    totalValue: 8400.00,
    status: 'Closed',
    creationDate: '2026-01-10',
    expectedDelivery: '2026-01-25',
    daysOpen: 45,
    currentStepIndex: 5,
    lineItems: [
      { id: 'L1', description: 'Cisco Meraki Store Routers', quantity: 20, unitPrice: 420.00, total: 8400.00 }
    ]
  },
  {
    id: 'PO-2026-9009',
    poNumber: 'PO-2026-9009',
    supplierName: 'Müller Office Supplies',
    category: 'Facilities',
    totalValue: 850.00,
    status: 'Sent to Supplier',
    creationDate: '2026-03-09',
    expectedDelivery: '2026-03-14',
    daysOpen: 3,
    currentStepIndex: 2,
    lineItems: [
      { id: 'L1', description: 'A4 Copy Paper Pallet', quantity: 5, unitPrice: 170.00, total: 850.00 }
    ]
  },
  {
    id: 'PO-2026-9010',
    poNumber: 'PO-2026-9010',
    supplierName: 'Global Print Media AG',
    category: 'Marketing',
    totalValue: 3200.00,
    status: 'Invoiced',
    creationDate: '2026-02-18',
    expectedDelivery: '2026-02-25',
    daysOpen: 22,
    currentStepIndex: 4,
    lineItems: [
      { id: 'L1', description: 'Store Value Concept Posters', quantity: 1000, unitPrice: 3.20, total: 3200.00 }
    ],
    supplierNotes: 'Invoice generated automatically upon dispatch.',
  },
  {
    id: 'PO-2026-9011',
    poNumber: 'PO-2026-9011',
    supplierName: 'EuroTrans Logistics',
    category: 'Logistics',
    totalValue: 18500.00,
    status: 'Pending Approval',
    creationDate: '2026-03-12',
    expectedDelivery: '2026-03-15',
    daysOpen: 0,
    currentStepIndex: 0,
    lineItems: [
      { id: 'L1', description: 'Emergency Freight - Frozen Goods', quantity: 5, unitPrice: 3700.00, total: 18500.00 }
    ],
    actionRequired: 'Expedited approval required for short-notice cold chain logistics.',
  },
  {
    id: 'PO-2026-9012',
    poNumber: 'PO-2026-9012',
    supplierName: 'LegalEagle Partners',
    category: 'Professional Services',
    totalValue: 9500.00,
    status: 'Goods Received',
    creationDate: '2026-02-20',
    expectedDelivery: '2026-03-05',
    daysOpen: 20,
    currentStepIndex: 3,
    lineItems: [
      { id: 'L1', description: 'Quarterly Contract Review Retainer', quantity: 1, unitPrice: 9500.00, total: 9500.00 }
    ],
    supplierNotes: 'Hours logged and approved in vendor portal.',
  },
  {
    id: 'PO-2026-9013',
    poNumber: 'PO-2026-9013',
    supplierName: 'EcoPack Solutions',
    category: 'Packaging',
    totalValue: 28000.00,
    status: 'Sent to Supplier',
    creationDate: '2026-03-05',
    expectedDelivery: '2026-03-25',
    daysOpen: 7,
    currentStepIndex: 2,
    lineItems: [
      { id: 'L1', description: 'Corrugated Cardboard Trays', quantity: 50000, unitPrice: 0.56, total: 28000.00 }
    ],
    actionRequired: 'Supplier requested update to delivery schedule. Awaiting warehouse confirmation.',
  },
  {
    id: 'PO-2026-9014',
    poNumber: 'PO-2026-9014',
    supplierName: 'TechCorp Solutions GmbH',
    category: 'IT Hardware',
    totalValue: 1850.00,
    status: 'Invoiced',
    creationDate: '2026-02-28',
    expectedDelivery: '2026-03-06',
    daysOpen: 12,
    currentStepIndex: 4,
    lineItems: [
      { id: 'L1', description: 'Server RAM Upgrades 32GB', quantity: 10, unitPrice: 185.00, total: 1850.00 }
    ]
  },
  {
    id: 'PO-2026-9015',
    poNumber: 'PO-2026-9015',
    supplierName: 'CleanWorks Facility Services',
    category: 'Facilities',
    totalValue: 1200.00,
    status: 'Closed',
    creationDate: '2026-01-20',
    expectedDelivery: '2026-01-31',
    daysOpen: 51,
    currentStepIndex: 5,
    lineItems: [
      { id: 'L1', description: 'Window Cleaning HQ', quantity: 1, unitPrice: 1200.00, total: 1200.00 }
    ]
  },
  {
    id: 'PO-2026-9016',
    poNumber: 'PO-2026-9016',
    supplierName: 'MediaBuy Co',
    category: 'Marketing',
    totalValue: 75000.00,
    status: 'Approved',
    creationDate: '2026-03-08',
    expectedDelivery: '2026-04-01',
    daysOpen: 4,
    currentStepIndex: 1,
    lineItems: [
      { id: 'L1', description: 'Q2 TV Advertising Slot Booking', quantity: 1, unitPrice: 75000.00, total: 75000.00 }
    ]
  },
  {
    id: 'PO-2026-9017',
    poNumber: 'PO-2026-9017',
    supplierName: 'EuroTrans Logistics',
    category: 'Logistics',
    totalValue: 5400.00,
    status: 'Goods Received',
    creationDate: '2026-03-06',
    expectedDelivery: '2026-03-10',
    daysOpen: 6,
    currentStepIndex: 3,
    lineItems: [
      { id: 'L1', description: 'Pallet Relocation Inter-Warehouse', quantity: 100, unitPrice: 54.00, total: 5400.00 }
    ],
    supplierNotes: 'Delivery completed ahead of schedule.',
  },
  {
    id: 'PO-2026-9018',
    poNumber: 'PO-2026-9018',
    supplierName: 'CodeCraft Digital',
    category: 'Professional Services',
    totalValue: 18000.00,
    status: 'Sent to Supplier',
    creationDate: '2026-03-01',
    expectedDelivery: '2026-03-31',
    daysOpen: 11,
    currentStepIndex: 2,
    lineItems: [
      { id: 'L1', description: 'E-commerce App Accessibility Audit', quantity: 1, unitPrice: 18000.00, total: 18000.00 }
    ]
  },
  {
    id: 'PO-2026-9019',
    poNumber: 'PO-2026-9019',
    supplierName: 'EcoPack Solutions',
    category: 'Packaging',
    totalValue: 9200.00,
    status: 'Pending Approval',
    creationDate: '2026-03-11',
    expectedDelivery: '2026-03-20',
    daysOpen: 1,
    currentStepIndex: 0,
    lineItems: [
      { id: 'L1', description: 'Bakery Paper Bags', quantity: 400000, unitPrice: 0.023, total: 9200.00 }
    ]
  },
  {
    id: 'PO-2026-9020',
    poNumber: 'PO-2026-9020',
    supplierName: 'TechCorp Solutions GmbH',
    category: 'IT Hardware',
    totalValue: 45000.00,
    status: 'Invoiced',
    creationDate: '2026-02-10',
    expectedDelivery: '2026-02-28',
    daysOpen: 30,
    currentStepIndex: 4,
    lineItems: [
      { id: 'L1', description: 'Cisco Core Switches', quantity: 5, unitPrice: 9000.00, total: 45000.00 }
    ],
    actionRequired: 'Invoice is under review due to price variance vs catalog.',
  }
];
