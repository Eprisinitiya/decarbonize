# Decarbonize: The OS for Carbon Intelligence

<div align="justify">
A futuristic, data-driven SaaS platform designed for the mining industry to track, analyze, simulate, and report their carbon footprint with unparalleled precision.
In an era where environmental responsibility meets industrial necessity, Decarbonize emerges as the definitive solution for mining operations seeking to transform their carbon management from reactive compliance to proactive strategic advantage. Built specifically for the complexities of extractive industries, this comprehensive platform harnesses cutting-edge technology to deliver real-time carbon intelligence that drives both environmental impact and business value.<br><br><br>
Our platform recognizes that the mining sector faces unique challenges in carbon accounting - from the complexity of multi-source emissions spanning diesel fleets, electrical grids, fugitive methane, and explosive materials, to the need for precise tracking across vast operational landscapes. Decarbonize addresses these challenges by providing an integrated ecosystem where every gram of CO₂ equivalent is captured, analyzed, and transformed into actionable insights that inform million-dollar infrastructure decisions and regulatory compliance strategies. More than just a tracking tool, Decarbonize serves as a strategic command center for sustainability officers, mine operators, and C-suite executives who demand precision, transparency, and forward-looking analytics in their decarbonization journey. With its intuitive interface masking sophisticated algorithms, the platform enables organizations to not only understand their current carbon footprint but to model and optimize their path toward net-zero operations while maintaining operational efficiency and profitability.
</div>


</div>

---

## 📋 Table of Contents

1. The Problem: A Sector at a Crossroads
2. The Solution: Decarbonize
3. How It Works: The Data Intelligence Loop
4. Key Features: A Detailed Breakdown
5. Technology Stack
6. Getting Started: Installation & Setup
7. Project Structure
8. Contributing
9. License

---

## 📉 The Problem: A Sector at a Crossroads

The global mining industry, a cornerstone of modern civilization, is facing unprecedented pressure to decarbonize. In India, with ambitious national climate goals, this pressure is intensifying. Mining operations are complex, involving dozens of emission sources:

* **Siloed & Inaccurate Data:** Emission data from diesel consumption, electricity usage, fugitive methane, and explosives is often tracked in disparate, error-prone spreadsheets.
* **Strategic Paralysis:** Without a clear, unified view of their carbon footprint, operators struggle to make informed, long-term decisions on high-capital investments like fleet electrification or renewable energy adoption.
* **Intensive Reporting Burden:** Generating reports for regulatory bodies, investors, and internal sustainability goals is a manual, time-consuming process that lacks transparency and auditability.
* **Reactive vs. Proactive:** Most companies are stuck in a reactive cycle of reporting past emissions, rather than proactively simulating and planning future reduction pathways.

---

## ✨ The Solution: Decarbonize

**Decarbonize** is a vertically-integrated SaaS platform that transforms carbon accounting from a compliance chore into a strategic advantage. It serves as a **single source of truth** for all emission-related data, providing tools not just for tracking, but for intelligent forecasting and decision-making.

* **📊 Unified Dashboard:** Get a 360-degree view of your carbon performance in real-time.
* **📝 Precision Tracking:** Move beyond estimates with granular data entry for Scope 1, 2, and 3 emissions.
* **🌳 Holistic View:** Account for your positive impact by managing and quantifying carbon sink projects like afforestation.
* **🚀 Future-Proof Strategy:** Use the simulation engine to model the impact of decarbonization levers on your emissions and financials.
* **📄 Automated Reporting:** Generate auditor-ready reports in minutes, not weeks.

---

## 🔄 How It Works: The Data Intelligence Loop

The platform operates on a simple yet powerful four-stage loop that turns raw operational data into actionable strategic intelligence.

1. **INPUT & AGGREGATE**
   * Operators use the **GHG Inventory Explorer** to log data from all sources (e.g., litres of diesel used, kWh of electricity consumed, tonnes of coal mined).
   * The system validates data on entry to ensure accuracy.

2. **ANALYZE & VISUALIZE**
   * The platform instantly processes this data, calculating emissions in tCO₂e based on standardized factors.
   * The **Dashboard** updates in real-time, visualizing KPIs, emission breakdowns, and trends.

3. **SIMULATE & STRATEGIZE**
   * Using the validated historical data as a baseline, managers can use the **Simulation Dashboard** to build future scenarios.
   * They can drag-and-drop mitigation levers (e.g., "Electrify 50% of Fleet by 2028") to see projected impacts on emissions trajectory, NPV, and IRR.

4. **REPORT & COMPLY**
   * Once analysis is complete, the **Report Generation Center** compiles all the data into professional, compliant reports ready for internal stakeholders or external auditors.

---

## 💎 Key Features: A Detailed Breakdown

<details>
<summary><strong>🔑 1. Authentication & User Management</strong></summary>
<br>
<ul>
    <li><strong>Role-Based Access Control:</strong> Distinct permissions for Admins, Mine Operators, and Verifiers/Auditors.</li>
    <li><strong>Secure Login/Signup:</strong> Standard, secure authentication to protect sensitive data.</li>
    <li><strong>Profile Management:</strong> Users can manage their personal and mine-specific details.</li>
    <li><strong>Protected Routes:</strong> Ensures data is only accessible to authenticated users with the correct role.</li>
</ul>
</details>

<details>
<summary><strong>📊 2. Dashboard Home</strong></summary>
<br>
<ul>
    <li><strong>KPI Cards:</strong> At-a-glance metrics for Total GHG Emissions, Net Carbon Balance, and Emission Intensity.</li>
    <li><strong>Interactive Emissions Chart:</strong> A donut chart breaking down emissions by scope and source.</li>
    <li><strong>Recent Activity Feed:</strong> A live feed of the latest data entries and reports generated across the platform.</li>
    <li><strong>Dynamic Time Filters:</strong> View data by month, quarter, year-to-date, or custom ranges.</li>
</ul>
</details>

<details>
<summary><strong>📝 3. GHG Inventory Explorer</strong></summary>
<br>
<ul>
    <li><strong>Source-Specific Forms:</strong> Dedicated data entry for fuel, electricity, fugitive methane, explosives, and more.</li>
    <li><strong>Automated Validation:</strong> Prevents common data entry errors by flagging anomalous values.</li>
    <li><strong>Tiered Workflow:</strong> Prompts for more detailed data to enable higher-fidelity Tier 2 & Tier 3 calculations.</li>
    <li><strong>Live Analysis Charts:</strong> Bar, pie, and line charts that update instantly as new data is submitted.</li>
</ul>
</details>

<details>
<summary><strong>🌳 4. Carbon Sink / Sequestration Manager</strong></summary>
<br>
<ul>
    <li><strong>Project Management:</strong> Log and manage afforestation and ecological reclamation projects.</li>
    <li><strong>Interactive Map Integration:</strong> Utilizes Leaflet.js to plot and visualize land areas under reclamation.</li>
    <li><strong>Species Database:</strong> Automatically calculates sequestration rates based on native Indian tree species.</li>
    <li><strong>Cumulative Impact Tracking:</strong> View yearly and total absorbed CO₂ for all sink projects.</li>
</ul>
</details>

<details>
<summary><strong>🚀 5. Simulation & Scenario Dashboard</strong></summary>
<br>
<ul>
    <li><strong>Scenario Builder:</strong> Create and name different strategic scenarios (e.g., "Business as Usual," "Aggressive Electrification").</li>
    <li><strong>Interactive Mitigation Levers:</strong> Drag-and-drop levers like renewable adoption or methane capture onto a timeline.</li>
    <li><strong>Comparative Analysis:</strong> Side-by-side comparison of emission trajectories and financial summaries (NPV, IRR, Payback Period).</li>
    <li><strong>Abatement Cost Curve:</strong> Automatically ranks strategies by their cost-effectiveness.</li>
</ul>
</details>

<details>
<summary><strong>📄 6. Report Generation Center</strong></summary>
<br>
<ul>
    <li><strong>Template Library:</strong> Pre-built templates for internal reviews, corporate sustainability reports, and auditors.</li>
    <li><strong>Deep Customization:</strong> Select scopes, time periods, and specific mines to include in the report.</li>
    <li><strong>Multi-Format Export:</strong> Download presentation-ready PDFs or raw CSV files for further analysis.</li>
</ul>
</details>

---

## 💻 Technology Stack

This project is built with a modern, fast, and scalable front-end stack.

* **Framework:** React
* **Build Tool:** Vite
* **Routing:** React Router DOM
* **Styling:** CSS Modules & Global Variables
* **Charting:** Recharts (or similar library)
* **Mapping:** Leaflet.js

---

## 🛠️ Getting Started: Installation & Setup

Follow these steps to get a local copy of the project up and running.

### Prerequisites

* [Node.js](https://nodejs.org/en/) (v16 or higher)
* `npm` or `yarn` package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Eprisinitiya/decarbonize.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd decarbonize
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

### Running the Development Server

1. **Start the Vite dev server:**
   ```bash
   npm run dev
   ```
2. Open your browser and navigate to `http://localhost:5173` (or the port specified in your terminal). The app will hot-reload as you make changes.

### Building for Production

1. **Create a production-ready build:**
   ```bash
   npm run build
   ```
2. This command bundles the app into static files in the `/dist` directory, which can then be deployed to any static hosting service.

---

## 📁 Project Structure

The codebase is organized into a modular structure for scalability and maintainability.

<details>
<summary>Click to view the file structure</summary>

```
/
├── public/
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── main.css         # Global styles and CSS variables
│   ├── components/
│   │   ├── Authentication/      # Login, Signup components
│   │   ├── Dashboard/           # Dashboard Home component
│   │   ├── GHGInventory/        # Data entry components
│   │   ├── Layout/              # Navbar, Sidebar
│   │   ├── Reporting/           # Report Generation components
│   │   ├── Sequestration/       # Sequestration Manager components
│   │   └── Simulation/          # Simulation Dashboard components
│   ├── pages/
│   │   ├── DashboardPage.jsx    # Main layout pages
│   │   ├── HomePage.jsx
│   │   └── LoginPage.jsx
│   ├── App.jsx                  # Main application component with routing
│   └── main.jsx                 # Entry point of the React application
├── .gitignore
├── index.html
├── package.json
└── README.md
```

</details>

---

---

## 📜 License

This project is distributed under the MIT License. See `LICENSE` for more information.
