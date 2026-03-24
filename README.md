
# TT Xpress Workshop Portal

A React.js-based workshop portal for **vehicle service intake** and **inspection report generation**.

This project was built as an assignment for a logistics / fleet service workflow. It includes:

- Service Intake Form
- Conditional General Service fields
- Inspection Report Generator
- Downloadable PDF report
- Local report history
- Search and filter for reports
- Recent reports preview and delete action

---

## Features

### 1. Service Intake Form
Capture vehicle service intake details with validation.

**Base fields:**
- Vehicle Number
- Company Name
- Fleet Owner Name
- Fleet Owner Contact
- Fleet Owner Email
- Issue Description
- Job Type

**Conditional fields for General Service:**
- Exterior Body Condition
- Paint Condition
- Battery Health
- Tyre Pressure

### 2. Conditional Rendering
When **General Service** is selected, additional inspection-related fields are shown dynamically.

### 3. Validation
The form uses validation for:
- required fields
- email format
- phone/contact format
- numeric range for battery health

### 4. Inspection Report Generator
A second page allows users to:
- create a service inspection report
- add short inspection summary
- add recommended work
- include general service remarks
- generate a professional final report

### 5. General Service Detail Support
When the intake is linked to a **General Service** record, the report automatically includes:
- Exterior Body Condition
- Paint Condition
- Battery Health
- Tyre Pressure
- Additional General Service Remark

### 6. PDF Download
Generated reports can be downloaded as PDF.

### 7. Report History
Reports are saved locally in browser storage and users can:
- search reports
- filter by job type
- load a previous report into preview
- delete a report

### 8. Dashboard Stats
The reports page shows summary stats like:
- total reports
- reports generated this month
- quick service reports
- general service reports

---

## Tech Stack

- **React.js**
- **Vite**
- **Tailwind CSS v4**
- **React Hook Form**
- **Zod**
- **React Router DOM**
- **jsPDF**
- **html2canvas-pro**
- **localStorage** for persistence

---

## Project Structure

```bash
src/
  components/
    form/
      ServiceIntakeForm.jsx
    layout/
      AppShell.jsx
      PageHeader.jsx
    report/
      PdfInspectionReport.jsx
      ReportPreview.jsx

  pages/
    ServiceIntakePage.jsx
    InspectionReportsPage.jsx

  utils/
    buildReportData.js
    generateIntakeId.js
    storage.js

  App.jsx
  main.jsx
  index.css
````

---

## Pages

### `/`

**Service Intake Form**

* Add vehicle and owner details
* Choose job type
* Fill conditional fields for General Service
* Submit intake
* Generate intake preview

### `/reports`

**Inspection Reports**

* Create inspection report
* Select intake record or enter manually
* Add inspection summary and recommended work
* Include General Service detail notes
* Download branded PDF
* Search, filter, preview, and delete reports

---

## Installation

### 1. Clone the project

```bash
git clone <your-repo-url>
cd ttx-service-intake
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run development server

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

---

## Required Packages

```bash
npm install react-router-dom react-hook-form zod @hookform/resolvers jspdf html2canvas-pro lucide-react clsx
```

---

## Why `html2canvas-pro` is used

Tailwind CSS v4 uses modern color functions like `oklch()`, which can cause issues with the standard `html2canvas` package during PDF generation.

To avoid the error:

```bash
Attempting to parse an unsupported color function "oklch"
```

this project uses:

* `html2canvas-pro`

for more reliable PDF rendering.

---

## Data Storage

This project currently uses **browser localStorage**.

### Stored items:

* Service intake records
* Generated inspection reports

This makes the project simple to run without a backend.

---

## Future Improvements

Possible next upgrades:

* MongoDB backend integration
* User authentication
* Admin dashboard
* Report edit/update feature
* Print-friendly PDF templates
* TT Xpress logo integration
* Cloud storage for reports
* Report export as image / email
* Better analytics dashboard

---

## Assignment Objective Covered

This project demonstrates:

* React form architecture
* conditional rendering
* validation handling
* state management
* report generation
* downloadable output
* user-friendly business workflow
* local persistence and search/filter functionality

---

## Notes

This is currently a **frontend-first implementation**.
Backend is not required for the current assignment, but the structure can be extended to MongoDB and Node.js later.

---

## Author

Developed as a workshop/logistics service assignment in React.js.

````

A slightly more polished title section can also be used at the top:

```md
# TT Xpress Workshop Portal
### Vehicle Service Intake & Inspection Report Generator
````

I can also turn this into a **stronger GitHub-style professional README** with screenshots section, feature cards, and demo instructions.
