document.getElementById("inputExcel").addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (evt) {
        const arrayBuffer = evt.target.result;

        // Leer el archivo Excel desde ArrayBuffer
        const workbook = XLSX.read(arrayBuffer, { type: "array" });

        // Tomar la primera hoja
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convertir hoja a HTML
        const htmlTable = XLSX.utils.sheet_to_html(sheet);

        // Mostrar tabla
        document.getElementById("tableContainer").innerHTML = htmlTable;
    };

    // Leer usando ArrayBuffer (método recomendado)
    reader.readAsArrayBuffer(file);
});
