# ALDI SÜD SAP Ariba P2P Simulation Platform

This project is a professional, single-page React application that simulates the core operational workflows and analytics of an enterprise-grade **SAP Ariba Purchase-to-Pay (P2P)** environment, scaled for ALDI SÜD.

Rather than being a static dashboard, this platform is a working process intelligence tool designed for procurement managers, P2P specialists, and senior stakeholders. It provides immediate insights into the organization's purchasing lifecycle, identifies operational bottlenecks, and highlights critical exceptions requiring manual resolution.

## 🔥 Key Features & Modules

1. **Executive Overview**: High-level KPI tiles tracking total spend, active Purchase Orders (POs), P2P cycle time, invoice exception rates, and delivery rates. It includes benchmarks and visual indicators of process health.
2. **Requisition & PO Management**: A live interactive data table of active POs. A slide-in detail panel visualizes the end-to-end P2P lifecycle timeline for any order, along with line-item financial breakdowns and action-required alerts.
3. **Invoice Matching & Exceptions**: An Accounts Payable queue for handling invoices failing the automated 3-way match (PO vs. Goods Receipt vs. Invoice). Features side-by-side mismatch comparisons (highlighting price or quantity variances) and suggests resolution paths.
4. **Supplier Performance**: A Vendor Management scorecard evaluating suppliers on On-Time Delivery, Accuracy, and Lead Time. Drill-down views show 6-month historical trends, contract compliance (Met/Breached), and an open dispute tracker.
5. **Process Improvement Tracker**: A Kanban-style transformation pipeline tracking internal P2P initiatives from identification to completion, monitoring expected savings and operational impact.
6. **Process Documentation Hub**: A searchable directory of ALDI SÜD Standard Operating Procedures (SOPs), featuring an integrated markdown reader for playbooks and guidelines.

## 🛠️ Technology Stack

- **Frontend**: React 18
- **TypeScript**: Strict typing for data integrity and application structure
- **Build Tool**: Vite for rapid development and optimized production bundling
- **Styling**: Tailwind CSS (extensively customized for the ALDI SÜD Light-Mode aesthetic)
- **Routing**: React Router v6
- **Data Visualization**: Recharts
- **Icons**: Lucide-React
- **State Management**: React Context API for handling complex cross-module state (PO Approvals, Invoice Resolutions, Global View filters)

## 🎨 Design System

The application utilizes a tailored design system:
- **Primary Color**: Deep Blue (`#003B7A`)
- **Accent Color**: Light Blue (`#0069B4`)
- **Typography**: `Inter` font family for maximum readability.
- **Aesthetic**: Flat, professional styling utilizing spacious padding (`gap-6`, `p-6`), subtle shadow transitions (`transition-smooth`), and CSS border-radius curves. No emojis, gradients, or glassmorphism.

## 🚀 Running the Application Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/Kaif198/P2P-SAPariba-Simulation.git
   ```
2. Navigate into the project directory:
   ```bash
   cd "P2P Project"
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the local development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173`.
