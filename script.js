document.getElementById("csvFile").addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
        const text = event.target.result;
        loadCSVtoTable(text);
    };
    reader.readAsText(file, "UTF-8");
});


function loadCSVtoTable(csvText) {
    const rows = csvText.split("\n").map(row => row.split(";"));

    let html = "<table><thead><tr>";
    rows[0].forEach(h => html += `<th>${h}</th>`);
    html += "</tr></thead><tbody>";

    for (let i = 1; i < rows.length; i++) {
        if (rows[i].length < 2) continue;
        html += "<tr>";
        rows[i].forEach(col => {
            html += `<td contenteditable="true">${col.trim()}</td>`;
        });
        html += "</tr>";
    }

    html += "</tbody></table>";
    document.getElementById("tableContainer").innerHTML = html;
}


document.getElementById("exportBtn").addEventListener("click", function () {
    const table = document.querySelector("table");
    if (!table) {
        alert("Primero carga un archivo CSV.");
        return;
    }

    const rows = [...table.querySelectorAll("tbody tr")];
    const exportData = [];

    rows.forEach(row => {
        const cols = [...row.children].map(td => td.innerText.trim());

        const apellidos = cols[0];
        const nombres = cols[1];
        const curso = cols[2];
        const dni = cols[3];
        const informe = cols[5];
        const obs = cols[6];

        const letraApellido = apellidos.charAt(0).toUpperCase();
        const letraNombre = nombres.charAt(0).toUpperCase();

        exportData.push({
            username: dni,
            password: dni + letraApellido + letraNombre,
            firstname: nombres,
            lastname: apellidos,
            email: dni + "s@actualizar.com",
            city: "LIMA",
            course1: curso,
            group1: informe,
            obs: obs
        });
    });

    exportToExcel(exportData);
});


function exportToExcel(jsonData) {
    const ws = XLSX.utils.json_to_sheet(jsonData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "REV NOV");

    XLSX.writeFile(wb, "REV_NOV.xlsx");
}
