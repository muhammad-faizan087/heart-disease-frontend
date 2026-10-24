# CardioPulse AI - Clinical Diagnostic Frontend

Modern, responsive web interface built with **Next.js**, **React**, and **Tailwind CSS** for interactive cardiovascular risk assessments and clinical report exports.

## Features
- **Dynamic Vitals Input**: Sliders and toggle controls for patient age, blood pressure, cholesterol, ECG, and chest pain parameters.
- **One-Click Presets**: Pre-configured clinical test samples (Healthy, Moderate Concern, High Risk).
- **Real-Time Risk Probability**: Visual probability meter calibrated with supervised machine learning.
- **PDF Report Generation**: Clean, high-contrast A4 clinical report formatted for printing and PDF export without browser headers/footers.

---

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open the application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

> Ensure the FastAPI backend server is running on `http://localhost:8000` to serve prediction requests.
