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
// CARGAR DATOS DESDE ARCHIVO CSV
// --------------------------------------------------
function cargarCSV() {
    const file = document.getElementById("csvInput").files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const rows = text.split("\n").map(r => r.split(","));

        const tbody = document.getElementById("tbody");
        tbody.innerHTML = ""; // Limpiar tabla

        rows.forEach(row => {
            if (row.length < 5) return;

            let fila = document.createElement("tr");

            for (let i = 0; i < 7; i++) {
                let celda = document.createElement("td");
                celda.contentEditable = "true";
                celda.innerText = row[i] ? row[i].trim() : "";
                fila.appendChild(celda);
            }

            tbody.appendChild(fila);
        });

        alert("CSV cargado correctamente.");
    };

    reader.readAsText(file);
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

        if (dni === "") continue;

        let primeraLetraApellido = apellidos.charAt(0).toUpperCase();
        let primeraLetraNombre  = nombres.charAt(0).toUpperCase();

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

    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(datos);
    XLSX.utils.book_append_sheet(wb, ws, "REV NOV");
    XLSX.writeFile(wb, "REV_NOV.xlsx");

    alert("Archivo generado correctamente.");
}

// Crear 50 filas automáticamente al abrir
agregarFilas();
