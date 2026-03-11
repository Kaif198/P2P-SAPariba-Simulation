import type { SupplierPerformance } from './types';

export const supplierData: SupplierPerformance[] = [
  {
    id: 'SUP-001',
    supplierName: 'TechCorp Solutions GmbH',
    category: 'IT Hardware',
    onTimeDeliveryRate: 94.5,
    invoiceAccuracyRate: 88.0,
    averageLeadTimeDays: 14,
    contractComplianceScore: 92.0,
    overallScore: 91.5,
    riskRating: 'Medium',
    riskExplanation: 'This supplier is rated Medium Risk due to a slight decline in invoice accuracy and price variances on recent IT hardware orders. No immediate action is required but catalog pricing should be reviewed.',
    contractTerms: [
      { term: 'Net 45 Payment Terms', isMeeting: true },
      { term: 'Minimum 95% On-Time Delivery', isMeeting: false },
      { term: 'Quarterly Catalog Price Refresh', isMeeting: false }
    ],
    openIssues: [
      { id: 'ISS-01', description: 'Price variance dispute on PO-2026-9020', dateOpened: '2026-03-10', status: 'Under Investigation' }
    ],
    performanceTrend: [
      { month: 'Oct', onTimeDelivery: 96, invoiceAccuracy: 95, leadTime: 12 },
      { month: 'Nov', onTimeDelivery: 97, invoiceAccuracy: 94, leadTime: 12 },
      { month: 'Dec', onTimeDelivery: 94, invoiceAccuracy: 92, leadTime: 13 },
      { month: 'Jan', onTimeDelivery: 95, invoiceAccuracy: 90, leadTime: 14 },
      { month: 'Feb', onTimeDelivery: 93, invoiceAccuracy: 88, leadTime: 14 },
      { month: 'Mar', onTimeDelivery: 94.5, invoiceAccuracy: 88, leadTime: 14 }
    ],
    trendNarratives: {
      delivery: 'Delivery performance remains somewhat stable but slightly below the 95% SLA target.',
      accuracy: 'Invoice accuracy has trended downward over the last quarter due to outdated catalog pricing.',
      leadTime: 'Average lead times have slightly increased due to global supply chain constraints on semiconductors.'
    }
  },
  {
    id: 'SUP-002',
    supplierName: 'EuroTrans Logistics',
    category: 'Logistics',
    onTimeDeliveryRate: 98.2,
    invoiceAccuracyRate: 99.1,
    averageLeadTimeDays: 2,
    contractComplianceScore: 98.5,
    overallScore: 98.6,
    riskRating: 'Low',
    riskExplanation: 'This supplier is performing exceptionally well across all metrics. Freight schedules are reliably met and invoicing is highly automated and accurate.',
    contractTerms: [
      { term: 'Net 30 Payment Terms', isMeeting: true },
      { term: 'Minimum 98% On-Time Delivery', isMeeting: true },
      { term: 'Real-time GPS Tracking Integration', isMeeting: true }
    ],
    openIssues: [],
    performanceTrend: [
      { month: 'Oct', onTimeDelivery: 98, invoiceAccuracy: 99, leadTime: 2 },
      { month: 'Nov', onTimeDelivery: 97.5, invoiceAccuracy: 99, leadTime: 2 },
      { month: 'Dec', onTimeDelivery: 98.1, invoiceAccuracy: 98.5, leadTime: 3 },
      { month: 'Jan', onTimeDelivery: 99.0, invoiceAccuracy: 99.5, leadTime: 2 },
      { month: 'Feb', onTimeDelivery: 98.5, invoiceAccuracy: 99.0, leadTime: 2 },
      { month: 'Mar', onTimeDelivery: 98.2, invoiceAccuracy: 99.1, leadTime: 2 }
    ],
    trendNarratives: {
      delivery: 'Consistently exceeding the 98% on-time delivery target across all regional routes.',
      accuracy: 'High invoice accuracy sustained via EDI integration with Ariba.',
      leadTime: 'Lead times remain stable at the 48-hour routing SLA.'
    }
  },
  {
    id: 'SUP-003',
    supplierName: 'Global Print Media AG',
    category: 'Marketing',
    onTimeDeliveryRate: 85.0,
    invoiceAccuracyRate: 92.5,
    averageLeadTimeDays: 21,
    contractComplianceScore: 88.0,
    overallScore: 88.5,
    riskRating: 'High',
    riskExplanation: 'Rated High Risk due to severe drops in on-time delivery affecting regional marketing campaigns. Urgent supplier review meeting needed.',
    contractTerms: [
      { term: 'Net 60 Payment Terms', isMeeting: true },
      { term: 'Minimum 95% On-Time Delivery', isMeeting: false },
      { term: 'Sustainable Sourcing Certification', isMeeting: true }
    ],
    openIssues: [
      { id: 'ISS-02', description: 'Spring campaign materials delayed by 6 days', dateOpened: '2026-03-05', status: 'Escalated to Management' },
      { id: 'ISS-03', description: 'Duplicate invoice submitted for Q1 Posters', dateOpened: '2026-03-12', status: 'Under Investigation' }
    ],
    performanceTrend: [
      { month: 'Oct', onTimeDelivery: 95, invoiceAccuracy: 96, leadTime: 14 },
      { month: 'Nov', onTimeDelivery: 92, invoiceAccuracy: 95, leadTime: 16 },
      { month: 'Dec', onTimeDelivery: 90, invoiceAccuracy: 93, leadTime: 18 },
      { month: 'Jan', onTimeDelivery: 88, invoiceAccuracy: 94, leadTime: 20 },
      { month: 'Feb', onTimeDelivery: 82, invoiceAccuracy: 92, leadTime: 22 },
      { month: 'Mar', onTimeDelivery: 85, invoiceAccuracy: 92.5, leadTime: 21 }
    ],
    trendNarratives: {
      delivery: 'Sharp drop in delivery reliability since December due to raw material shortages at their central printing facility.',
      accuracy: 'Frequent manual re-invoicing adjustments have slightly impacted accuracy scores.',
      leadTime: 'Average turnaround time has increased by a full week compared to Q4 last year.'
    }
  },
  {
    id: 'SUP-004',
    supplierName: 'McKinley Strategy Consultants',
    category: 'Professional Services',
    onTimeDeliveryRate: 100.0,
    invoiceAccuracyRate: 81.0,
    averageLeadTimeDays: 0,
    contractComplianceScore: 90.0,
    overallScore: 90.2,
    riskRating: 'Medium',
    riskExplanation: 'Professional services are delivered on schedule, but the supplier frequently submits invoices with mismatched payment terms or before POs are fully approved.',
    contractTerms: [
      { term: 'Net 45 Payment Terms', isMeeting: false },
      { term: 'Quarterly Executive Briefings', isMeeting: true }
    ],
    openIssues: [
      { id: 'ISS-04', description: 'Invoice submitted with Net 15 terms (Contract explicitly states Net 45)', dateOpened: '2026-03-05', status: 'Resolved' }
    ],
    performanceTrend: [
      { month: 'Oct', onTimeDelivery: 100, invoiceAccuracy: 85, leadTime: 0 },
      { month: 'Nov', onTimeDelivery: 100, invoiceAccuracy: 88, leadTime: 0 },
      { month: 'Dec', onTimeDelivery: 100, invoiceAccuracy: 82, leadTime: 0 },
      { month: 'Jan', onTimeDelivery: 100, invoiceAccuracy: 80, leadTime: 0 },
      { month: 'Feb', onTimeDelivery: 100, invoiceAccuracy: 78, leadTime: 0 },
      { month: 'Mar', onTimeDelivery: 100, invoiceAccuracy: 81, leadTime: 0 }
    ],
    trendNarratives: {
      delivery: 'Consulting milestones are consistently met on agreed timelines.',
      accuracy: 'Invoice exception rates remain high primarily due to administrative errors overriding master agreement payment terms.',
      leadTime: 'N/A for professional services retainers.'
    }
  },
  {
    id: 'SUP-005',
    supplierName: 'CleanWorks Facility Services',
    category: 'Facilities',
    onTimeDeliveryRate: 99.0,
    invoiceAccuracyRate: 98.0,
    averageLeadTimeDays: 5,
    contractComplianceScore: 100.0,
    overallScore: 99.0,
    riskRating: 'Low',
    riskExplanation: 'Highly reliable facility management partner with perfect contract compliance and minimal exceptions.',
    contractTerms: [
      { term: 'Net 30 Payment Terms', isMeeting: true },
      { term: 'ISO 14001 Environmental Standard', isMeeting: true },
      { term: '24/7 Support SLA Coverage', isMeeting: true }
    ],
    openIssues: [],
    performanceTrend: [
      { month: 'Oct', onTimeDelivery: 99, invoiceAccuracy: 97, leadTime: 5 },
      { month: 'Nov', onTimeDelivery: 99.5, invoiceAccuracy: 98, leadTime: 5 },
      { month: 'Dec', onTimeDelivery: 98, invoiceAccuracy: 99, leadTime: 4 },
      { month: 'Jan', onTimeDelivery: 99, invoiceAccuracy: 98, leadTime: 5 },
      { month: 'Feb', onTimeDelivery: 100, invoiceAccuracy: 98, leadTime: 5 },
      { month: 'Mar', onTimeDelivery: 99, invoiceAccuracy: 98, leadTime: 5 }
    ],
    trendNarratives: {
      delivery: 'Service delivery is extremely reliable across all regional offices.',
      accuracy: 'Invoicing is consolidated monthly and matches Blanket POs accurately.',
      leadTime: 'Ad-hoc service requests are fulfilled well within SLA.'
    }
  },
  {
    id: 'SUP-006',
    supplierName: 'EcoPack Solutions',
    category: 'Packaging',
    onTimeDeliveryRate: 96.0,
    invoiceAccuracyRate: 85.5,
    averageLeadTimeDays: 12,
    contractComplianceScore: 94.0,
    overallScore: 91.8,
    riskRating: 'Medium',
    riskExplanation: 'Good delivery reliability but facing recurring issues with quantity mismatches on invoices versus actual warehouse receipts.',
    contractTerms: [
      { term: 'Net 60 Payment Terms', isMeeting: true },
      { term: 'Zero Defect Policy', isMeeting: true },
      { term: 'VMI (Vendor Managed Inventory) Integration', isMeeting: false }
    ],
    openIssues: [
      { id: 'ISS-05', description: 'Quantity mismatch of 40,000 bags on PO-2026-8940', dateOpened: '2026-03-11', status: 'Under Investigation' }
    ],
    performanceTrend: [
      { month: 'Oct', onTimeDelivery: 97, invoiceAccuracy: 92, leadTime: 10 },
      { month: 'Nov', onTimeDelivery: 96, invoiceAccuracy: 90, leadTime: 11 },
      { month: 'Dec', onTimeDelivery: 98, invoiceAccuracy: 88, leadTime: 12 },
      { month: 'Jan', onTimeDelivery: 95, invoiceAccuracy: 86, leadTime: 12 },
      { month: 'Feb', onTimeDelivery: 97, invoiceAccuracy: 84, leadTime: 12 },
      { month: 'Mar', onTimeDelivery: 96, invoiceAccuracy: 85.5, leadTime: 12 }
    ],
    trendNarratives: {
      delivery: 'Packaging supply remains steady, avoiding stockouts.',
      accuracy: 'Consistent issues with part-deliveries resulting in complex invoice reconciliations.',
      leadTime: 'Lead times slightly elevated but within acceptable limits.'
    }
  },
  {
    id: 'SUP-007',
    supplierName: 'CodeCraft Digital',
    category: 'Professional Services',
    onTimeDeliveryRate: 98.0,
    invoiceAccuracyRate: 100.0,
    averageLeadTimeDays: 3,
    contractComplianceScore: 100.0,
    overallScore: 99.3,
    riskRating: 'Low',
    riskExplanation: 'Excellent digital agency partner. Perfect invoicing accuracy and high reliability.',
    contractTerms: [
      { term: 'Net 30 Payment Terms', isMeeting: true },
      { term: 'IP Assignment Clause', isMeeting: true }
    ],
    openIssues: [],
    performanceTrend: [
      { month: 'Oct', onTimeDelivery: 95, invoiceAccuracy: 100, leadTime: 4 },
      { month: 'Nov', onTimeDelivery: 100, invoiceAccuracy: 100, leadTime: 3 },
      { month: 'Dec', onTimeDelivery: 98, invoiceAccuracy: 100, leadTime: 3 },
      { month: 'Jan', onTimeDelivery: 100, invoiceAccuracy: 100, leadTime: 3 },
      { month: 'Feb', onTimeDelivery: 100, invoiceAccuracy: 100, leadTime: 3 },
      { month: 'Mar', onTimeDelivery: 98, invoiceAccuracy: 100, leadTime: 3 }
    ],
    trendNarratives: {
      delivery: 'Sprints and digital audits delivered on time.',
      accuracy: 'Flawless invoice matching through fixed-bid SOWs.',
      leadTime: 'Rapid project mobilization.'
    }
  },
  {
    id: 'SUP-008',
    supplierName: 'Müller Office Supplies',
    category: 'Facilities',
    onTimeDeliveryRate: 91.0,
    invoiceAccuracyRate: 96.0,
    averageLeadTimeDays: 5,
    contractComplianceScore: 92.0,
    overallScore: 93.3,
    riskRating: 'Medium',
    riskExplanation: 'Standard catalog items are occasionally delayed. Overall risk is low due to the non-critical nature of the goods, but SLA is technically breached.',
    contractTerms: [
      { term: 'Net 30 Payment Terms', isMeeting: true },
      { term: 'Next-Day Delivery for Catalog A items', isMeeting: false }
    ],
    openIssues: [],
    performanceTrend: [
      { month: 'Oct', onTimeDelivery: 98, invoiceAccuracy: 95, leadTime: 3 },
      { month: 'Nov', onTimeDelivery: 95, invoiceAccuracy: 97, leadTime: 4 },
      { month: 'Dec', onTimeDelivery: 90, invoiceAccuracy: 96, leadTime: 5 },
      { month: 'Jan', onTimeDelivery: 88, invoiceAccuracy: 96, leadTime: 6 },
      { month: 'Feb', onTimeDelivery: 92, invoiceAccuracy: 96, leadTime: 5 },
      { month: 'Mar', onTimeDelivery: 91, invoiceAccuracy: 96, leadTime: 5 }
    ],
    trendNarratives: {
      delivery: 'Struggling to meet the next-day delivery SLA for standard office supplies.',
      accuracy: 'Invoice matching is robust due to punch-out catalog integration.',
      leadTime: 'Average delivery takes almost a week instead of the contracted 2 days.'
    }
  }
];
