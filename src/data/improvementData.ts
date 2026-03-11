import type { ProcessImprovement } from './types';

export const improvementInitiatives: ProcessImprovement[] = [
  {
    id: 'INIT-001',
    title: 'Automate 3-way match for standard goods',
    processArea: 'Invoice to Payment',
    owner: 'Sarah Jenkins',
    expectedBenefit: 'Redirect 30% of manual review time toward exception handling',
    status: 'In Progress',
    problemStatement: 'Currently, invoice processors manually check every invoice against the PO and goods receipt record, even for low-variation, high-volume standard catalog items. This process is highly manual and prone to human error, creating a bottleneck at month-end.',
    approach: 'Configure Ariba invoice reconciliation (IR) rules to automatically approve standard goods invoices where the price and quantity exactly match the approved PO and the confirmed Goods Receipt. Exceptions will still route to manual queues.',
    timeline: 'Target pilot completion: End of Q2. Rollout to all categories: End of Q3.',
    impactStatement: 'By automating this for standard catalogue items, the team can redirect approximately 30% of manual review time toward higher-value exception handling and supplier relationship work.'
  },
  {
    id: 'INIT-002',
    title: 'Standardise supplier invoice templates',
    processArea: 'PO to Invoice',
    owner: 'Markus Weber',
    expectedBenefit: 'Reduce format-related exceptions and OCR failures by 40%',
    status: 'Piloting',
    problemStatement: 'Suppliers are submitting PDF invoices in wildly different formats. The OCR (Optical Character Recognition) tool frequently misreads line-item totals or PO reference numbers, forcing a manual data entry step before matching can even begin.',
    approach: 'Deploy a standardized PDF invoice template to the top 50 highest-volume suppliers. For suppliers unable to use the template, mandate submission directly through the Ariba Supplier Network (ASN) portal rather than email.',
    timeline: 'Piloting with top 10 Logistics and IT suppliers now. Assessing OCR accuracy improvements before wider mandate in August.',
    impactStatement: 'Early pilot data shows a 40% reduction in OCR read failures, dropping the time required simply to digitize an invoice from 3 minutes to under 30 seconds.'
  },
  {
    id: 'INIT-003',
    title: 'Implement auto-escalation for overdue approvals',
    processArea: 'Requisition to PO',
    owner: 'Elena Rostova',
    expectedBenefit: 'Reduce average approval cycle time by 2.5 days',
    status: 'Identified',
    problemStatement: 'Purchase requisitions exceeding \u20ac50,000 frequently stagnate in regional director approval queues. Requisitioners must manually chase approvers via email, leading to process delays and frustrated business stakeholders.',
    approach: 'Implement a time-based escalation rule in the approval workflow. If a requisition sits unapproved for 48 hours, generate an automated reminder. At 96 hours, escalate to the approver\'s delegate or line manager automatically.',
    timeline: 'Requirements gathering phase. Slated for Q4 IT sprint block.',
    impactStatement: 'Expected to cut the "dead time" where a request is waiting for a simple sign-off, directly accelerating the Requisition-to-PO cycle time benchmark toward the 14-day target.'
  },
  {
    id: 'INIT-004',
    title: 'Update overdue contract terms in Ariba',
    processArea: 'Supplier Management',
    owner: 'David Chen',
    expectedBenefit: 'Eliminate 15% of false-positive "Contract Mismatch" invoice exceptions',
    status: 'Completed',
    problemStatement: '12 major suppliers had their master agreements renewed recently with updated payment terms (e.g., Net 45 instead of Net 30), but these updates were never reflected in the Ariba system. This caused valid invoices to be flagged and blocked.',
    approach: 'Conduct a one-off audit of the top 100 supplier contracts. Bulk-update the payment term master data for any discrepancies found between the legal repository and the Ariba vendor master file.',
    timeline: 'Audit completed March 1st. System update deployed March 5th.',
    impactStatement: 'Successfully eliminated a major source of false-positive invoice blocks. Processors no longer have to manually verify payment terms for these 12 strategic suppliers.'
  }
];
