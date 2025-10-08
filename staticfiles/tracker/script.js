const API_URL = "/api/batches/";

const form = document.getElementById("batchForm");
const dateEl = document.getElementById("date");
const batchIdEl = document.getElementById("batchId");
const amlaInputEl = document.getElementById("amlaInput");
const slicesWeightEl = document.getElementById("slicesWeight");
const sugarAddedEl = document.getElementById("sugarAdded");
const applyRecBtn = document.getElementById("applyRecommended");
const marinatedEl = document.getElementById("marinatedWeight");
const syrupEl = document.getElementById("syrupGenerated");
const finalEl = document.getElementById("finalWeight");
const remarksEl = document.getElementById("remarks");
const saveBtn = document.getElementById("saveBtn");
const resetBtn = document.getElementById("resetBtn");
const loadExampleBtn = document.getElementById("loadExample");
const exportCSVBtn = document.getElementById("exportCSV");
const clearAllBtn = document.getElementById("clearAll");
const tableBody = document.querySelector("#batchesTable tbody");
const summaryContent = document.getElementById("summaryContent");

let batches = [];
let editingId = null;

function fetchBatches() {
    fetch(API_URL)
    .then(res => res.json())
    .then(data => {
        batches = data;
        render();
    });
}

function render() {
    tableBody.innerHTML = "";
    batches.forEach((b) => {
        const tr = document.createElement("tr");
        const yieldPct = (b.final_weight && b.slices_weight) ? ((b.final_weight / b.slices_weight) * 100).toFixed(2) : "-";
        tr.innerHTML = `
            <td>${b.date}</td>
            <td>${b.batch_id}</td>
            <td>${b.amla_input ?? "-"}</td>
            <td>${b.slices_weight ?? "-"}</td>
            <td>${b.sugar_added ?? "-"}</td>
            <td>${b.marinated_weight ?? "-"}</td>
            <td>${b.syrup_generated ?? "-"}</td>
            <td>${b.final_weight ?? "-"}</td>
            <td>${yieldPct}%</td>
            <td>
                <button onclick="editBatch(${b.id})">✏️</button>
                <button onclick="deleteBatch(${b.id})">🗑️</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });

    const totals = batches.reduce((acc, b) => {
        acc.amla += b.amla_input || 0;
        acc.slices += b.slices_weight || 0;
        acc.sugar += b.sugar_added || 0;
        acc.marinated += b.marinated_weight || 0;
        acc.syrup += b.syrup_generated || 0;
        acc.final += b.final_weight || 0;
        return acc;
    }, {amla:0,slices:0,sugar:0,marinated:0,syrup:0,final:0});

    const totalYieldPct = totals.slices ? ((totals.final / totals.slices) * 100).toFixed(2) : "-";
    summaryContent.innerHTML = `
        <p><strong>Total Batches:</strong> ${batches.length}</p>
        <p><strong>Total raw amla:</strong> ${totals.amla.toFixed(3)} kg</p>
        <p><strong>Total slices:</strong> ${totals.slices.toFixed(3)} kg</p>
        <p><strong>Total sugar used:</strong> ${totals.sugar.toFixed(3)} kg</p>
        <p><strong>Total syrup generated:</strong> ${totals.syrup.toFixed(3)} kg</p>
        <p><strong>Total final candy:</strong> ${totals.final.toFixed(3)} kg</p>
        <p><strong>Overall yield:</strong> ${totalYieldPct}%</p>
    `;
}

// Form submit
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {
        date: dateEl.value,
        batch_id: batchIdEl.value,
        amla_input: parseFloat(amlaInputEl.value) || 0,
        slices_weight: parseFloat(slicesWeightEl.value) || 0,
        sugar_added: parseFloat(sugarAddedEl.value) || 0,
        marinated_weight: parseFloat(marinatedEl.value) || 0,
        syrup_generated: parseFloat(syrupEl.value) || 0,
        final_weight: parseFloat(finalEl.value) || 0,
        remarks: remarksEl.value
    };
    let method = "POST", url = API_URL;
    if (editingId) {
        method = "PUT";
        url += editingId + "/";
    }
    fetch(url, {
        method,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }).then(() => {
        editingId = null;
        form.reset();
        fetchBatches();
    });
});

function editBatch(id) {
    const b = batches.find(x => x.id === id);
    if (!b) return;
    editingId = id;
    dateEl.value = b.date;
    batchIdEl.value = b.batch_id;
    amlaInputEl.value = b.amla_input;
    slicesWeightEl.value = b.slices_weight;
    sugarAddedEl.value = b.sugar_added;
    marinatedEl.value = b.marinated_weight;
    syrupEl.value = b.syrup_generated;
    finalEl.value = b.final_weight;
    remarksEl.value = b.remarks;
}

function deleteBatch(id) {
    if (!confirm("Delete this batch?")) return;
    fetch(API_URL + id + "/", { method: "DELETE" })
    .then(() => fetchBatches());
}

function applyRecommendedSugar() {
    const slices = parseFloat(slicesWeightEl.value) || 0;
    sugarAddedEl.value = (slices * 1.2).toFixed(3);
}

applyRecBtn.addEventListener("click", applyRecommendedSugar);

fetchBatches();
