import type { ProcessDocument } from './types';

export const documentHub: ProcessDocument[] = [
  {
    id: 'DOC-001',
    title: '3-Way Invoice Match Exception Handling Playbook',
    category: 'Exception Handling Playbooks',
    description: 'This playbook details the step-by-step resolution process for processors when an invoice fails the automated 3-way match against the Purchase Order and Goods Receipt.',
    tags: ['Exception', 'Invoice', '3-Way Match', 'Price Variance', 'SOP'],
    version: '1.2',
    lastUpdated: '2025-11-15',
    owner: 'P2P Process Excellence Team',
    content: `
# 3-Way Invoice Match Exception Handling Playbook

## 1. Overview
The 3-way match ensures that ALDI SÜD only pays for goods that were ordered and received. An invoice must match the **Purchase Order** (price and authorized quantity) and the **Goods Receipt** (actual quantity delivered). When a mismatch occurs, the invoice is routed to the Exception Queue.

## 2. Standard Exception Types

### 2.1 Price Variance
**Trigger**: The unit price on the invoice exceeds the unit price on the PO by more than the allowed tolerance (1% or €50, whichever is lower).
**Resolution Steps**:
1. Check if an updated catalog price was recently loaded but not applied to the backdated PO.
2. Contact the requisitioner to confirm if a price increase was verbally agreed upon due to supply constraints.
3. If unauthorized, use the "Dispute Invoice" action in Ariba and request a credit note from the supplier for the variance amount.

### 2.2 Quantity Mismatch
**Trigger**: The invoiced quantity is greater than the Goods Receipt quantity.
**Resolution Steps**:
1. Verify with the receiving warehouse if a partial delivery was made but the goods receipt was accidentally closed.
2. If goods are confirmed missing, contact the supplier to ask for a credit note or proof of a secondary shipment en route.
3. **Do not** adjust the Goods Receipt manually without warehouse manager sign-off.

### 2.3 System Contract Terms Mismatch
**Trigger**: Supplier submits an invoice with payment terms (e.g., Net 15) that conflict with the master data (e.g., Net 45).
**Resolution Steps**:
1. Our master data dictates the payment date, not the supplier's printout.
2. The system will automatically schedule payment according to the master data (Net 45).
3. Notify the supplier via the portal message function that their invoice payment date has been adjusted to comply with the master agreement.

## 3. Escalation Rules
If a supplier disputes a rejected invoice or refuses to issue a credit note for >7 days, escalate the ticket to the Category Manager.
    `
  },
  {
    id: 'DOC-002',
    title: 'Supplier Onboarding Checklist',
    category: 'Supplier Onboarding Guidelines',
    description: 'The mandatory checklist and data requirements for adding a new supplier to the Ariba Procurement system, ensuring compliance and accurate master data.',
    tags: ['Supplier', 'Onboarding', 'Master Data', 'Compliance', 'ESG'],
    version: '2.0',
    lastUpdated: '2026-01-10',
    owner: 'Vendor Master Data Team',
    content: `
# Supplier Onboarding Checklist

## 1. Purpose
This checklist outlines the mandatory steps required before a new supplier can be activated in the ALDI SÜD SAP Ariba procurement environment. No purchase orders can be generated until all steps are marked complete.

## 2. Information Gathering
The business sponsor must collect the following from the prospective supplier:
- [ ] Completed **Supplier Profile Questionnaire (SPQ)**.
- [ ] Official Company Registration Document (Handelsregisterauszug or equivalent).
- [ ] Tax Identification / VAT Number.
- [ ] Banking details on official company letterhead, signed by a finance director.

## 3. Compliance and Risk Checks
The Vendor Master Data Team will execute the following validations:
- [ ] **Sanctions Screening**: Ensure the entity and its directors do not appear on any global sanctions lists.
- [ ] **Financial Health Check**: Run a standard credit risk report (e.g., Dun & Bradstreet) if expected annual spend > €100,000.
- [ ] **Sustainability Audit**: For direct materials, confirm receipt of the completed Environmental & Social Governance (ESG) self-assessment.

## 4. System Setup
Once approved, configure the supplier in Ariba:
1. Create the Vendor Master Record.
2. Assign the primary purchasing category.
3. Set the default payment terms as negotiated by procurement (standard is Net 45 unless otherwise agreed).
4. Send the Ariba Supplier Network (ASN) invitation link to the vendor's primary contact for digital invoicing enrollment.

## 5. Final Activation
Only the Master Data Lead can flip the status from \`Pending\` to \`Active\`.
    `
  },
  {
    id: 'DOC-003',
    title: 'Emergency Requisition Bypass Protocol',
    category: 'P2P Standard Operating Procedures',
    description: 'Procedure for raising after-the-fact POs when emergency services (e.g., critical facility repairs) are procured outside normal business hours.',
    tags: ['Emergency', 'Requisition', 'Bypass', 'Policy'],
    version: '1.0',
    lastUpdated: '2025-08-22',
    owner: 'Procurement Operations',
    content: `
# Emergency Requisition Bypass Protocol

## 1. Definition of Emergency
An emergency requisition is only permitted when a delay in procurement would result in:
- Significant risk to employee health or safety.
- Severe disruption to store operations or logistics hubs.
- Imminent loss of critical IT infrastructure.

## 2. The Protocol
In such events, goods or services may be procured immediately without a prior PO. On the **next business day**, the following must occur:
1. The business user must raise a requisition in Ariba.
2. The user must attach the supplier's job sheet or quote, clearly marking the requisition title with "[EMERGENCY - AFTER FACT]".
3. The Category Manager must approve the requisition, converting it to a PO.
4. Provide the PO number to the supplier so they can reference it on their invoice.

**Note**: Repeated abuse of this protocol for poor planning will result in budget-holder disciplinary review.
    `
  }
];
