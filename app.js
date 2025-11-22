// app.js (versión mejorada para cargar CSV robustamente)

// --------------------------------------------------
// CREAR 50 FILAS AUTOMÁTICAMENTE
// --------------------------------------------------
function agregarFilas() {
    let tbody = document.getElementById("tbody");

    for (let i = 0; i < 50; i++) {
        let fila = document.createElement("tr");

        for (let j = 0; j < 7; j++) {
            let celda = document.createElement("td");
            celda.contentEditable = "true";
            fila.appendChild(celda);
        }

        tbody.appendChild(fila);
    }
}

// --------------------------------------------------
// PARSEADOR SIMPLE DE CSV que maneja comillas y separador
// --------------------------------------------------
function parseCSV(text) {
    // Normalizar saltos de línea
    text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();

    // Detectar separador: prioriza ; si existe más veces que ,
    const countComma = (text.match(/,/g) || []).length;
    const countSemi = (text.match(/;/g) || []).length;
    const sep = countSemi > countComma ? ';' : ',';

    const rows = [];
    let row = [];
    let cur = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const ch = text[i];

        if (ch === '"') {
            // si siguiente es otra comilla, es comilla escapada
            if (inQuotes && text[i+1] === '"') {
                cur += '"';
                i++; // saltar la comilla escapada
            } else {
                inQuotes = !inQuotes;
            }
            continue;
        }

        if (ch === sep && !inQuotes) {
            row.push(cur);
            cur = '';
            continue;
        }

        if (ch === '\n' && !inQuotes) {
            row.push(cur);
            rows.push(row);
            row = [];
            cur = '';
            continue;
        }

        cur += ch;
    }

    // push último campo/row si existe
    if (cur !== '' || row.length > 0) {
        row.push(cur);
        rows.push(row);
    }

    // limpiar espacios en cada celda
    return rows.map(r => r.map(cell => (cell || '').trim()));
}

// --------------------------------------------------
// CARGAR DATOS DESDE ARCHIVO CSV (mejorado)
// --------------------------------------------------
function cargarCSV() {
    const input = document.getElementById("csvInput");
    const file = input.files[0];
    if (!file) {
        alert("No se seleccionó ningún archivo.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        try {
            const text = e.target.result;
            if (!text || text.trim() === '') {
                alert("El archivo está vacío o no pudo leerse. Verifica la codificación (UTF-8).");
                return;
            }

            const parsed = parseCSV(text);

            if (parsed.length === 0) {
                alert("No se detectaron filas en el CSV.");
                return;
            }

            // Si la primera fila parece encabezado (contiene palabras no numéricas como 'APELLIDOS' o 'NOMBRES'), la omitimos
            const firstRow = parsed[0].map(c => (c || '').toString().toLowerCase());
            const headerKeywords = ['apellidos','nombres','curso','dni','celular','numero','informe','observacion'];
            const isHeader = firstRow.some(cell => headerKeywords.some(k => cell.includes(k)));

            const tbody = document.getElementById("tbody");
            tbody.innerHTML = ""; // limpiar tabla

            const startIndex = isHeader ? 1 : 0;

            for (let r = startIndex; r < parsed.length; r++) {
                const row = parsed[r];

                // Ignorar filas totalmente vacías
                if (row.every(cell => (cell || '').trim() === '')) continue;

                const tr = document.createElement('tr');

                // Rellenar hasta 7 columnas (APELLIDOS, NOMBRES, CURSO, DNI, CELULAR, NUMERO DE INFORME, OBSERVACION)
                for (let c = 0; c < 7; c++) {
                    const td = document.createElement('td');
                    td.contentEditable = "true";
                    td.innerText = (row[c] !== undefined) ? row[c] : '';
                    tr.appendChild(td);
                }

                tbody.appendChild(tr);
            }

            alert("CSV cargado correctamente. Filas añadidas: " + tbody.getElementsByTagName('tr').length);
        } catch (err) {
            console.error(err);
            alert("Ocurrió un error al procesar el CSV: " + err.message);
        } finally {
            // limpiar input para permitir volver a cargar mismo archivo si hace falta
            input.value = "";
        }
    };

    // Intentar leer como texto con UTF-8
    reader.readAsText(file, 'UTF-8');
}

// --------------------------------------------------
// EXPORTAR A EXCEL EN FORMATO REV NOV
// --------------------------------------------------
function exportarExcel() {
    let tbody = document.getElementById("tbody");
    let filas = tbody.getElementsByTagName("tr");

    let datos = [];

    for (let i = 0; i < filas.length; i++) {
        let celdas = filas[i].getElementsByTagName("td");
        let apellidos = celdas[0].innerText.trim();
        let nombres = celdas[1].innerText.trim();
        let curso = celdas[2].innerText.trim();
        let dni = celdas[3].innerText.trim();
        let informe = celdas[5].innerText.trim();
        let obs = celdas[6].innerText.trim();

        if (dni === "") continue; // ignorar si no hay DNI

        // proteger contra valores cortos
        const primeraLetraApellido = apellidos ? apellidos.charAt(0).toUpperCase() : '';
        const primeraLetraNombre  = nombres ? nombres.charAt(0).toUpperCase() : '';

        datos.push({
            username: dni,
            password: dni + primeraLetraApellido + primeraLetraNombre,
            firstname: nombres,
            lastname: apellidos,
            email: dni + "s@actualizar.com",
            city: "LIMA",
            course1: curso,
            group1: informe,
            obs: obs
        });
    }

    if (datos.length === 0) {
        alert("No hay datos válidos para exportar. Asegúrate de cargar o ingresar filas con DNI.");
        return;
    }

    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(datos);
    XLSX.utils.book_append_sheet(wb, ws, "REV NOV");
    XLSX.writeFile(wb, "REV_NOV.xlsx");

    alert("Archivo generado correctamente.");
}

// Ejecutar al inicio
agregarFilas();
