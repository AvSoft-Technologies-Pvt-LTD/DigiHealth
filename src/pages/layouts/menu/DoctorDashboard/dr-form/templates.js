// ------------------------------
// File: DrForm/templates.js
// ------------------------------
// This file contains the HTML templates used for printing. Kept as plain functions so they can be tested.
export const getVitalsTemplate = (d = {}) => `
  <h4 style="color:#16a085;">Vitals Report</h4>
  <table style="width:100%;border-collapse:collapse;margin-top:10px;">
    <thead>
      <tr>
        <th style="border:1px solid #ddd;padding:10px;background:#f8f9fa;text-align:left;font-weight:bold;">Heart Rate</th>
        <th style="border:1px solid #ddd;padding:10px;background:#f8f9fa;text-align:left;font-weight:bold;">Temperature</th>
        <th style="border:1px solid #ddd;padding:10px;background:#f8f9fa;text-align:left;font-weight:bold;">Blood Sugar</th>
        <th style="border:1px solid #ddd;padding:10px;background:#f8f9fa;text-align:left;font-weight:bold;">Blood Pressure</th>
        <th style="border:1px solid #ddd;padding:10px;background:#f8f9fa;text-align:left;font-weight:bold;">Height</th>
        <th style="border:1px solid #ddd;padding:10px;background:#f8f9fa;text-align:left;font-weight:bold;">Weight</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="border:1px solid #ddd;padding:10px;background:#fff;">${d.heartRate || "-"}</td>
        <td style="border:1px solid #ddd;padding:10px;background:#fff;">${d.temperature || "-"}</td>
        <td style="border:1px solid #ddd;padding:10px;background:#fff;">${d.bloodSugar || "-"}</td>
        <td style="border:1px solid #ddd;padding:10px;background:#fff;">${d.bloodPressure || "-"}</td>
        <td style="border:1px solid #ddd;padding:10px;background:#fff;">${d.height || "-"}</td>
        <td style="border:1px solid #ddd;padding:10px;background:#fff;">${d.weight || "-"}</td>
      </tr>
    </tbody>
  </table>
`;

export const getClinicalNotesTemplate = (d = {}) => `
  <h4 style="color:#2980b9;">Clinical Notes</h4>
  <table style="width:100%;border-collapse:collapse;margin-top:10px;">
    <thead>
      <tr>
        <th>Chief Complaint</th><th>History</th><th>Advice</th><th>Plan</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${d.chiefComplaint || "-"}</td>
        <td>${d.history || "-"}</td>
        <td>${d.advice || "-"}</td>
        <td>${d.plan || "-"}</td>
      </tr>
    </tbody>
  </table>
`;

export const getLabResultsTemplate = (d = {}) => `
  <h4 style="color:#8e44ad;">Lab Results</h4>
  <table style="width:100%;border-collapse:collapse;margin-top:10px;">
    <thead><tr><th>Test Name</th><th>Code</th><th>Instructions</th></tr></thead>
    <tbody>
      ${(d.selectedTests || []).map(t=>`<tr><td>${t.name||"-"}</td><td>${t.code||"-"}</td><td>${t.instructions||"-"}</td></tr>`).join("")}
    </tbody>
  </table>
`;

export const getDentalTemplate = (d = {}) => `
  <h4 style="color:#e67e22;">Dental Problem Action Plan</h4>
  <table style="width:100%;border-collapse:collapse;margin-top:10px;">
    <thead><tr><th>Teeth Numbers</th><th>Problems</th><th>Action Plans</th><th>Positions</th></tr></thead>
    <tbody>
      ${(d.plans||[]).map(p=>`<tr><td>${(p.teeth||[]).join(", ")||"-"}</td><td>${(p.problems||[]).join(", ")||"-"}</td><td>${(p.actions||[]).join(", ")||"-"}</td><td>${(p.positions||[]).join(", ")||"-"}</td></tr>`).join("")}
    </tbody>
  </table>
`;

export const getEyeTestTemplate = (d = {}) => `
  <h4 style="color:#1976d2;">Eye Test Report</h4>
  <table style="width:100%;border-collapse:collapse;margin-top:10px;">
    <thead><tr><th>Test Date</th><th>Vision Type</th><th>Eye</th><th>SPH</th><th>CYL</th><th>V/A</th><th>AXIS</th><th>Prev.VA</th><th>Remarks</th><th>Product</th></tr></thead>
    <tbody>
      ${(d.rows||[]).map(r=>`<tr><td>${r.testDate||"-"}</td><td>${r.visionType||"-"}</td><td>Right Eye</td><td>${r.od_sph||"-"}</td><td>${r.od_cyl||"-"}</td><td>${r.od_va||"-"}</td><td>${r.od_axis||"-"}</td><td>${r.od_prev_va||"-"}</td><td>${r.remarks||"-"}</td><td>${r.product||"-"}</td></tr><tr><td>${r.testDate||"-"}</td><td>${r.visionType||"-"}</td><td>Left Eye</td><td>${r.os_sph||"-"}</td><td>${r.os_cyl||"-"}</td><td>${r.os_va||"-"}</td><td>${r.os_axis||"-"}</td><td>${r.os_prev_va||"-"}</td><td>${r.remarks||"-"}</td><td>${r.product||"-"}</td></tr>`).join("")}
    </tbody>
  </table>
`;

export const getPrescriptionTemplate = (prescriptions = []) => {
  const rows = prescriptions.map((m) => ({ ...m }));
  return `
    <h4 style="color:#2980b9;">Prescription</h4>
    <table style="width:100%;border-collapse:collapse;margin-top:10px;">
      <thead><tr><th>Medicine</th><th>Dosage</th><th>Frequency</th><th>Intake</th><th>Duration</th></tr></thead>
      <tbody>
        ${rows.map(m=>`<tr><td>${m.drugName||"-"}</td><td>${m.dosage||"-"}</td><td>${m.frequency||"-"}</td><td>${m.intake||"-"}</td><td>${m.duration||"-"} day(s)</td></tr>`).join("")}
      </tbody>
    </table>
  `;
};

export const getStyledPrescriptionHTML = (doctor, patient, signature, logoUrl, formContent) => `
  <div style="width:800px;font-family:'Poppins',sans-serif;padding:40px;box-sizing:border-box;border:2px solid #0e1630;background:#fff;">${formContent}</div>
`;
