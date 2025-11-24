// -----------------------------
// script.js (optimizado y corregido)
// -----------------------------

// IMPORTAR CSV
document.getElementById("csvFile").addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (ev) {
        const text = ev.target.result;
        cargarCSVEnTabla(text);
    };
    reader.readAsText(file, "UTF-8");
});

function cargarCSVEnTabla(csvText) {
    const lines = csvText.split(/\r?\n/).filter(l => l.trim() !== "");
    if (lines.length === 0) return;

    const rows = lines.map(line => line.split(";").map(cell => cell.trim()));

    let html = "<table><thead><tr>";
    const header = rows[0];
    header.forEach(h => html += `<th>${h}</th>`);
    html += "</tr></thead><tbody>";

    for (let i = 1; i < rows.length; i++) {
        const cols = rows[i];
        if (cols.length < 8) continue;

        html += "<tr>";
        cols.forEach(col => html += `<td contenteditable="true">${col}</td>`);
        html += "</tr>";
    }

    html += "</tbody></table>";
    document.getElementById("tableContainer").innerHTML = html;
}

// =====================================================
// LEER TABLA COMO OBJETOS
function obtenerDatosDeLaTabla() {
    const table = document.querySelector("#tableContainer table");
    const data = [];
    if (!table) return data;

    const rows = table.querySelectorAll("tbody tr");
    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        if (cells.length < 8) return;

        data.push({
            APELLIDOS: cells[0].innerText.trim(),
            NOMBRES:   cells[1].innerText.trim(),
            CURSO:     cells[2].innerText.trim(),
            DNI:       cells[3].innerText.trim(),
            CELULAR:   cells[4].innerText.trim(),
            FECHA:     cells[5].innerText.trim(),
            INFORME:   cells[6].innerText.trim(),
            OBS:       cells[7].innerText.trim()
        });
    });

    return data;
}

// =====================================================
// HELPERS
function primeraLetraPrimerPalabra(text) {
    if (!text) return "";
    const firstWord = text.trim().split(/\s+/)[0];
    return firstWord.charAt(0).toUpperCase() || "";
}

// DESCARGAR CSV UTF-8 CON BOM
function descargarCSV(filename, headers, rows) {
    const sep = ";";
    const encabezados = headers.join(sep) + "\n";
    const filas = rows.map(r => r.map(c => c ?? "").join(sep)).join("\n");

    const BOM = "\uFEFF";
    const blob = new Blob([BOM + encabezados + filas], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// =====================================================
// EXPORTAR REV_NOV
document.getElementById("exportREV").addEventListener("click", function () {
    const datos = obtenerDatosDeLaTabla();
    if (!datos.length) return alert("No hay datos.");

    const encabezados = ["username","password","firstname","lastname","email","city","course1","group1","obs"];

    const filas = datos.map(d => [
        d.DNI || "",
        ((d.DNI || "") +
         primeraLetraPrimerPalabra(d.APELLIDOS) +
         primeraLetraPrimerPalabra(d.NOMBRES)).toUpperCase(),
        d.NOMBRES || "",
        d.APELLIDOS || "",
        (d.DNI || "") + "s@actualizar.com",
        "LIMA",
        d.CURSO || "",
        d.INFORME || "",
        d.OBS || ""
    ]);

    descargarCSV("REV_NOV.csv", encabezados, filas);
});

// =====================================================
// FILTRAR DUPLICADOS POR CELULAR
function filtrarPorCelularUnico(datos) {
    const vistos = new Set();
    const salida = [];

    datos.forEach(d => {
        const cel = (d.CELULAR || "").trim();
        if (!vistos.has(cel)) {
            vistos.add(cel);
            salida.push(d);
        }
    });
    return salida;
}

// =====================================================
// EXPORTAR CONT_NOV
document.getElementById("exportCONT").addEventListener("click", function () {
    let datos = obtenerDatosDeLaTabla();
    if (!datos.length) return alert("No hay datos.");

    datos = filtrarPorCelularUnico(datos);

    const encabezados = ["Nombre","Apellido","Telefono","correo electronico","Direccion","Cumpleaños","Observaciones"];

    const filas = datos.map(d => [
        "", 
        (d.APELLIDOS + " " + d.NOMBRES + " " + (d.INFORME || "")).trim(),
        d.CELULAR || "",
        (d.CELULAR || "") + "s@actualizar.com",
        "ESTANDAR",
        d.FECHA || "",
        d.INFORME || ""
    ]);

    descargarCSV("CONT_NOV.csv", encabezados, filas);
});
