// -----------------------------
// script.js (actualizado)
// -----------------------------

// IDs esperados en index.html:
// <input id="csvFile">, <div id="tableContainer">,
// <button id="exportREV">, <button id="exportCONT">

// ===============================
// CARGAR CSV (separador ;)
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

    // separador esperado: ;
    const rows = lines.map(line => line.split(";").map(cell => cell.trim()));

    // Crear tabla HTML
    let html = "<table><thead><tr>";
    // Si el CSV tiene encabezados en la primera fila, los usamos; si no, se pueden personalizar.
    const header = rows[0];
    header.forEach(h => html += `<th>${h}</th>`);
    html += "</tr></thead><tbody>";

    for (let i = 1; i < rows.length; i++) {
        const cols = rows[i];
        // Si la fila no tiene suficientes columnas la saltamos
        if (cols.length < 8) continue;
        html += "<tr>";
        cols.forEach(col => {
            html += `<td contenteditable="true">${col}</td>`;
        });
        html += "</tr>";
    }

    html += "</tbody></table>";
    document.getElementById("tableContainer").innerHTML = html;
}

// ===============================
// LEER TABLA COMO OBJETOS
function obtenerDatosDeLaTabla() {
    const table = document.querySelector("#tableContainer table");
    const data = [];
    if (!table) return data;

    const rows = table.querySelectorAll("tbody tr");
    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        // Esperamos 8 columnas: APELLIDOS|NOMBRES|CURSO|DNI|CELULAR|FECHA|NUMERO DE INFORME|OBSERVACION
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

// ===============================
// HELPERS
function primeraLetraPrimerPalabra(text) {
    if (!text) return "";
    const firstWord = text.trim().split(/\s+/)[0];
    return firstWord.charAt(0).toUpperCase() || "";
}

// Exportar CSV con ; y BOM UTF-8
function descargarCSV(filename, encabezadosArray, filasArray) {
    const sep = ";";
    const encabezados = encabezadosArray.join(sep) + "\n";
    const filas = filasArray.map(r => r.map(cell => (cell !== undefined && cell !== null) ? String(cell) : "").join(sep)).join("\n");
    const contenido = encabezados + filas;

    // BOM para compatibilidad con Excel y tildes/ñ
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + contenido], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ===============================
// EXPORTAR REV_NOV (sin FECHA)
// Encabezados:
// username|password|firstname|lastname|email|city|course1|group1|obs
document.getElementById("exportREV").addEventListener("click", function () {
    const datos = obtenerDatosDeLaTabla();
    if (!datos.length) {
        alert("No hay datos en la tabla. Primero importa un CSV.");
        return;
    }

    const encabezados = ["username","password","firstname","lastname","email","city","course1","group1","obs"];

    const filas = datos.map(d => {
        const primeraLetraApellido = primeraLetraPrimerPalabra(d.APELLIDOS);
        const primeraLetraNombre   = primeraLetraPrimerPalabra(d.NOMBRES);

        return [
            d.DNI || "",                                              // username = DNI
            (d.DNI || "") + primeraLetraApellido + primeraLetraNombre, // password = DNI + 1ª letra 1ºapellido + 1ª letra 1ºnombre
            d.NOMBRES || "",                                          // firstname = NOMBRES
            d.APELLIDOS || "",                                        // lastname = APELLIDOS
            (d.DNI || "") + "s@actualizar.com",                       // email = DNI + "s@actualizar.com"
            "LIMA",                                                   // city
            d.CURSO || "",                                            // course1 = CURSO
            d.INFORME || "",                                          // group1 = N° INFORME
            d.OBS || ""                                               // obs = OBSERVACION
        ];
    });

    descargarCSV("REV_NOV.csv", encabezados, filas);
});

// ===============================
// FILTRAR CELULARES (solo primera aparición)
// ===============================
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

// ===============================
// EXPORTAR CONT_NOV
// Encabezados:
// Nombre|Apellido|Telefono|correo electronico|Direccion|Cumpleaños|Observaciones
// Valores:
// Nombre = APELLIDOS + NOMBRES + NUMERO DE INFORME
// Apellido = (se dejó vacío según tu pedido anterior) -> lo dejamos como APELLIDOS + " " + NOMBRES? Aquí lo dejamos vacío como antes
// Telefono = CELULAR
// correo electronico = CELULARs@gmail.com
// Direccion = ESTANDAR
// Cumpleaños = FECHA
// Observaciones = OBS
document.getElementById("exportCONT").addEventListener("click", function () {
    let datos = obtenerDatosDeLaTabla();
    if (!datos.length) {
        alert("No hay datos en la tabla. Primero importa un CSV.");
        return;
    }

    // filtrar duplicados por CELULAR, manteniendo la primera aparición
    datos = filtrarPorCelularUnico(datos);

    const encabezados = ["Nombre","Apellido","Telefono","correo electronico","Direccion","Cumpleaños","Observaciones"];

    const filas = datos.map(d => [
        "", // Nombre (vacío)
        (d.APELLIDOS + " " + d.NOMBRES + " " + (d.INFORME || "")).trim(), // Nombre = APELLIDOS + NOMBRES + NUMERO DE INFORME
        d.CELULAR || "",                                                  // Telefono
        (d.CELULAR || "") + "s@gmail.com",                                // correo electronico
        "ESTANDAR",                                                       // Direccion
        d.FECHA || "",                                                    // Cumpleaños = FECHA
        (d.INFORME) || ""                                                 // Observaciones
    ]);

    descargarCSV("CONT_NOV.csv", encabezados, filas);
});
