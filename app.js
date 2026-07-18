/**
 * Eazi Profit - BS&W & Automated Net Volume Engine
 * Compliant with ASTM D4007 & ASTM D1250-04 Standards
 */

document.addEventListener("DOMContentLoaded", () => {
    const computeBtn = document.getElementById("computeBtn");
    const resetBtn = document.getElementById("resetBtn");
    const copyBtn = document.getElementById("copyBtn");

    computeBtn.addEventListener("click", executeAutomatedVolumeCore);
    resetBtn.addEventListener("click", resetVolumeSuiteDisplay);
    copyBtn.addEventListener("click", copyVolumeLogToClipboard);
});

function executeAutomatedVolumeCore() {
    // 1. Fetch values from interface input nodes
    const tubeA = parseFloat(document.getElementById("tubeAInput").value);
    const tubeB = parseFloat(document.getElementById("tubeBInput").value);
    const grossObsVol = parseFloat(document.getElementById("grossVolInput").value);
    const batchTemp = parseFloat(document.getElementById("batchTempInput").value);
    const baseAPI = parseFloat(document.getElementById("baseApiInput").value);

    // Validate that required entry slots contain valid numbers
    if (isNaN(tubeA) || isNaN(tubeB) || isNaN(grossObsVol) || isNaN(batchTemp) || isNaN(baseAPI)) {
        alert("Execution Error: Missing or invalid laboratory metrics detected.");
        return;
    }

    // 2. ASTM D4007 Core Calculations
    const finalBSWPercent = tubeA + tubeB;

    // 3. AUTOMATED ASTM TABLE 5A VCF COMPUTATION MATRIX
    const K0 = 341.0957;
    const waterDensityBase = 999.016;
    const deltaT = batchTemp - 60.0;

    // Convert standard base API back to base density at 60°F
    const standardSG = 141.5 / (baseAPI + 131.5);
    const standardDensity60 = standardSG * waterDensityBase;

    // Run physics evaluation equations directly using standard density parameters
    const alpha60 = K0 / Math.pow(standardDensity60, 2);
    const volumeCorrectionFactor = Math.exp(-alpha60 * deltaT * (1.0 + 0.8 * alpha60 * deltaT));

    // 4. Sequential Volume Calculations
    const grossStandardVol = grossObsVol * volumeCorrectionFactor;
    const netStandardVol = grossStandardVol * (1.0 - (finalBSWPercent / 100.0));

    // 5. Update Display Nodes on the screen
    document.getElementById("resultBSW").innerText = finalBSWPercent.toFixed(3) + " %";
    document.getElementById("resultGSV").innerText = grossStandardVol.toFixed(2) + " bbl";
    document.getElementById("resultNSV").innerText = netStandardVol.toFixed(2) + " bbl";
    
    // Save calculated VCF into a window variable string so our clipboard function can read it
    window.calculatedVCFState = volumeCorrectionFactor.toFixed(5);
}

function copyVolumeLogToClipboard() {
    const BSW = document.getElementById("resultBSW").innerText;
    const gsv = document.getElementById("resultGSV").innerText;
    const nsv = document.getElementById("resultNSV").innerText;
    const activeVCF = window.calculatedVCFState || "--";

    if (bsw === "--") {
        alert("Copy Canceled: Clear calculations must exist on screen before data export.");
        return;
    }

    const textLedger = 
`--- Eazi Profit Volume Accounting Log ---
Total BS&W Deduction: ${bsw}
Calculated VCF (Table 5A): ${activeVCF}
Gross Standard Vol (GSV): ${gsv}
Net Standard Vol (NSV): ${nsv}
Generated via ASTM D4007 & D1250 Core`;

    navigator.clipboard.writeText(textLedger)
        .then(() => {
            alert("Success: Volume accounting log copied cleanly to clipboard!");
        })
        .catch(err => {
            alert("Clipboard Failure: System stream blocked.");
        });
}

function resetVolumeSuiteDisplay() {
    document.getElementById("tubeAInput").value = "";
    document.getElementById("tubeBInput").value = "";
    document.getElementById("grossVolInput").value = "";
    document.getElementById("batchTempInput").value = "";
    document.getElementById("baseApiInput").value = "";

    document.getElementById("resultBSW").innerText = "--";
    document.getElementById("resultGSV").innerText = "--";
    document.getElementById("resultNSV").innerText = "--";
    window.calculatedVCFState = undefined;
}

// Register Service Worker for total 100% offline capability inside the crude facility
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("sw.js")
            .then(reg => console.log("Eazi Profit Volume Engine: Offline Core Active."))
            .catch(err => console.log("PWA Error: Stream blocked.", err));
    });
}
