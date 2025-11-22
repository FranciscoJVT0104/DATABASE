document.getElementById("excelFile").addEventListener("change", function (e) {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {
        const data = event.target.result;

        // Leer el archivo Excel
        const workbook = XLSX.read(data, { type: "binary" });

        // Tomar la primera hoja del Excel
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convertir la hoja en HTML
        const html = XLSX.utils.sheet_to_html(sheet);

        // Mostrar la tabla en pantalla
        document.getElementById("tableContainer").innerHTML = html;
    };

    reader.readAsBinaryString(file);
});
