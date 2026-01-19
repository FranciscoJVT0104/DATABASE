// -----------------------------
// script.js (FINAL)
// -----------------------------

// ==============================
// IMPORTAR CSV
document.getElementById("csvFile").addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (ev) {
        cargarCSVEnTabla(ev.target.result);
    };
    reader.readAsText(file, "UTF-8");
});

function cargarCSVEnTabla(csvText) {
    const lines = csvText.split(/\r?\n/).filter(l => l.trim() !== "");
    if (!lines.length) return;

    const rows = lines.map(l => l.split(";").map(c => c.trim()));

    let html = "<table><thead><tr>";
    rows[0].forEach(h => html += `<th>${h}</th>`);
    html += "</tr></thead><tbody>";

    for (let i = 1; i < rows.length; i++) {
        if (rows[i].length < 9) continue;
        html += "<tr>";
        rows[i].forEach(col => html += `<td contenteditable="true">${col}</td>`);
        html += "</tr>";
    }

    html += "</tbody></table>";
    document.getElementById("tableContainer").innerHTML = html;
}

// =====================================================
// LEER TABLA COMO OBJETOS
function obtenerDatosDeLaTabla() {
    const table = document.querySelector("#tableContainer table");
    if (!table) return [];

    const data = [];
    table.querySelectorAll("tbody tr").forEach(row => {
        const c = row.querySelectorAll("td");
        if (c.length < 9) return;

        data.push({
            APELLIDOS: c[0].innerText.trim(),
            NOMBRES: c[1].innerText.trim(),
            CURSO: c[2].innerText.trim(),
            CARRERA: c[3].innerText.trim(),
            DNI: normalizarDocumento(c[4].innerText),
            CELULAR: c[5].innerText.trim(),
            FECHA: c[6].innerText.trim(),
            INFORME: c[7].innerText.trim(),
            OBS: c[8].innerText.trim()
        });
    });

    return data;
}

// =====================================================
// HELPERS

function primeraLetraPrimerPalabra(text) {
    if (!text) return "";
    return text.trim().split(/\s+/)[0].charAt(0).toUpperCase();
}

// -------- NORMALIZAR DOCUMENTO (DNI / CE)
function normalizarDocumento(doc) {
    if (!doc) return "";
    const num = doc.toString().replace(/\D/g, "");
    if (num.length === 7) return "0" + num;
    if (num.length === 8) return num;
    if (num.length >= 9) return num.substring(0, 9);
    return num;
}

// -------- NORMALIZAR TEXTO (CURSOS)
function normalizarTexto(txt) {
    return (txt || "")
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[.,()]/g, "")
        .replace(/[^A-Z0-9\s]/gi, "")
        .replace(/\s+/g, " ")
        .trim()
        .toUpperCase();
}

// -------- LIMPIAR CARRERA DEL NOMBRE DEL CURSO
function limpiarCursoDeCarrera(curso) {
    if (!curso) return "";
    return curso
        .replace(/\(.*?\)/g, "")
        .trim();
}


const MAPA_CARRERAS = {
    "ENFERMERIA": "ENF",
    "FISIOTERAPIA": "FIS",
    "FARMACIA": "FAR",
    "LABORATORIO": "LAB",
    "ODONTOLOGIA": "DEN",
    "PROTESIS DENTAL": "PRO"
};

function normalizarCarrera(carrera) {
    const carreraNorm = normalizarTexto(carrera);
    return MAPA_CARRERAS[carreraNorm] || carreraNorm;
}


// =====================================================
// MAPA DE CURSOS → SHORTNAME
const MAPA_CURSOS_RAW = {
    // POR CARRERA
    "ESTUDIO ESTRUCTURAL Y FUNCIONAL DEL SER HUMANO I|FIS": "EEY-01-FIS",
    "ESTUDIO ESTRUCTURAL Y FUNCIONAL DEL SER HUMANO I|ENF": "ESH-01-TOD",
    "ESTUDIO ESTRUCTURAL Y FUNCIONAL DEL SER HUMANO|ENF": "ESH-01-TOD",
    "ESTUDIO ESTRUCTURAL Y FUNCIONAL DEL SER HUMANO|FAR": "ESH-01-TOD",

    "CRECIMIENTO Y DESARROLLO HUMANO|ENF": "CDH-04-ENF",
    "CRECIMIENTO Y DESARROLLO HUMANO|FIS": "CYD-02-FIS",

    "DESARROLLO PSICOMOTOR|FIS": "DPS-03-FIS",

    // UNICOS
    "APLICACION DE BASES FARMACOLOGICAS DE LOS MEDICAMENTOS I": "ABF-03-FAR",
    "BASES FARMACOLOGICAS DE LOS MEDICAMENTOS": "ABF-03-FAR",
    "ASISTENCIA BASICA HOSPITALARIA": "ABH-03-ENF",
    "APLICACION DE BASES FARMACOLOGICAS DE LOS MEDICAMENTOS II": "ABM-04-FAR",
    "ADMINISTRACION Y GESTION DE NEGOCIOS": "ADG-02-TOD",
    "ALTERACIONES DEL DESARROLLO PSICOMOTOR": "ADP-03-FIS",
    "ALMACENAMIENTO DISTRIBUCION Y TRANSPORTE DE PRODUCTOS FARMACEUTICOS DISPOSITIVOS MEDICOS Y PRODUCTOS SANITARIOS": "ADTPF-04-FAR",
    "ALMACENAMIENTO DISTRIBUCION Y TRANSPORTE DE PRODUCTOS FARMACEUTICOS DISPOSITIVOS MEDICOS Y PRODUCTOS": "ADTPF-04-FAR",
    "ALMACENAMIENTODISTRIBUCIÓN Y TRANSPORTE DE PRODUCTOS FARMACÉUTICOSDISPOSITIVOS MÉDICOS Y PRODUCTOS SANITARIOS": "ADTPF-04-FAR",
    "ASISTENCIA EN MEDICINA TRADICIONAL Y ALTERNATIVA": "AEM-II-FAR",
    "ACTIVIDADES EN SALUD COMUNITARIA": "AES-01-TOD",
    "INTRODUCCION A LA SALUD COMUNITARIA": "AES-01-TOD",
    "ASISTENCIA DE ENFERMERIA EN SALUD MENTAL": "AES-06-ENF",
    "ANATOMIA Y FISIOLOGIA BUCODENTARIA": "AFB-02-DEN",
    "AGENTES FISICOS II": "AFI-06-FIS",
    "ANATOMIA FUNCIONAL NEUROENDOCRINA": "AFN-03-TOD",
    "ANATOMINA FUNCIONAL NEUROENDOCRINA": "AFN-03-TOD",
    "AGENTES FISICOS I": "AGF-05-FIS",
    "ASISTENCIA GINECO OBSTETRICA": "AGO-05-FIS",
    "ASISTENCIA EN ENFERMERIA ALTERNATIVA Y COMPLEMENTARIA": "AMALC-06-ENF",
    "ASISTENCIA EN MEDICINA ALTERNATIVA Y COMPLEMENTARIA": "AMALC-06-ENF",
    "ATENCION DE MEDICAMENTOS ESENCIALES": "AME-04-FAR",
    "ADMINISTRACION DE MEDICAMENTOS EXTRACCION Y RECOLECCION DE MUESTRAS": "AMRM",
    "TECNICAS DE ADMINISTRACION DE MEDICAMENTOS": "AMRM",
    "ANATOMIA FUNCIONAL": "ANF-01-TOD",
    "APARATOLOGIA DE ORTODONCIA FIJA": "AORFJ-05-PROT",
    "APARATOLOGIA DE ORTODONCIA REMOVIBLE II": "AORII-05-PRO",
    "ACTIVIDADES DE EPIDEMIOLOGIA": "API-01-TOD",
    "ACTIVIDADES EN EPIDEMIOLOGIA": "API-01-TOD",
    "FUNDAMENTOS DE EPIDEMIOLOGIA": "API-01-TOD",
    "ARTE Y TALLADO DENTARIO II": "ARD-02-DEN",
    "ADQUISICION RECEPCION Y EXPENDIO DE PRODUCTOS FARMACEUTICOS DISPOSITIVOS MEDICOS Y PRODUCTOS SANITARIOS": "AREPF-03-FAR",
    "ADQUISION RECEPCION Y EXPENDIO DE PRODUCTOS FARMACEUTICOS DISPOSITIVOS MEDICOS Y PRODUCTOS SANITARIOS": "AREPF-03-FAR",
    "ADQUISISCION RECEPCION Y EXPENDIO DE PRODUCTOS FARMACEUTICOS DISPOSITIVOS MEDICOS Y PRODUCTOS SANITARIOS": "AREPF-03-FAR",
    "ARTE Y DETALLADO DENTARIA I": "AR-Y-DE",
    "ARTE Y TALLADO DENTARIO": "AR-Y-DE",
    "ASISTENCIA AL ADULTO MAYOR": "ASA-05-ENF",
    "ASISTENCIA EN SALUD BUCAL": "ASB-06-ENF",
    "ASISTENCIA EN FISIOTERAPIA Y REHABILITACION": "ASFIS-06-ENF",
    "ASISTENCIA EN FISIOTERAPIA Y REHABLITACION": "ASFIS-06-ENF",
    "ASISTENCIA EN SALUD MATERNA": "ASM-05-ENF",
    "ATENCION EN SALUD MATERNA": "ASM-05-ENF",
    "ATENCION EN SALUD MATERNA Y NEONATAL": "ASM-05-ENF",
    "ACTIVIDAD EN SALUD PUBLICA": "ASP-01-TOD",
    "ACTIVIDADES EN SALUD PUBLICA": "ASP-01-TOD",
    "INTRODUCCION A LA SALUD PUBLICA": "ASP-01-TOD",
    "ACTIVIDADES EN SALUD PUBLICA Y COMUNITARIA": "ASP-04-ENF",
    "ASISTENCIA AL USUARIO CON PATOLOGIA": "ASPAT-03-ENF",
    "ATENCION BASICA DE URGENCIA Y EMERGENCIA": "AUE-01-TOD",
    "ATENCION BASICA DE URGENCIAS Y EMERGENCIAS": "AUE-01-TOD",
    "ASISTENCIA AL USUARIO ONCOLOGICO": "AUO-05-ENF",
    "ASISTENCIA AL USUARIO QUIRURGICO": "AUQ-05-ENF",
    "ACTIVIDADES FARMACEUTICAS EN SALUD COMUNITARIA": "AUQ-05-ENF_1",
    "AYUDAS BIOMECANICAS": "AYBM-04-FIS",
    "BACTERIOLOGIA CLINICA": "BATCL-04-LAB",
    "BASES CONCEPTAULES DE LAS ENFERMEDADES": "BCENF-TOD",
    "BASES CONCEPTUALES DE LAS ENFERMEDADES": "BCENF-TOD",
    "BASES CONCEPTUALESDE LAS ENFERMEDADES": "BCENF-TOD",
    "BIOQUIMICA CLINICA BASICA": "BCLB-05-LAB",
    "BACTERIOLOGIA GENERAL": "BCTG-03-LAB",
    "BIOMECANICA": "BIM-05-FIS",
    "BIOLOGIA": "BIO-01-TOD",
    "BIOSEGURIDAD DE LABORATORIO DENTAL": "BIO-DEN-IV",
    "BIOQUIMICA GENERAL": "BIQ-03-TOD",
    "BUENAS PRACTICAS DE ELABORACION ROTULADO Y ENVASADO DE FORMULAS MAGISTRALES Y PREPARADOS OFICINAL": "BPEF-05-FAR",
    "BUENAS PRACTICAS DE ELABORACION ROTULADO Y ENVASADO DE FORMULAS MAGISTRALES Y PREPARADOS OFICINALES": "BPEF-05-FAR",
    "BUENAS PRACTICAS DE MANUFACTURA EN EL LABORATORIO FARMACEUTICO": "BPML-06-FAR",
    "CONTROL DE CALIDAD EN EL LABORATORIO CLINICO": "CCLBC-05-LAB",
    "CONTROL DE CALIDAD EN LABORATORIO CLINICO": "CCLBC-05-LAB",
    "CITOLOGIA EXFOLIATIVA": "CEX-05-LAB",
    "CITOTECNOLOGIA EXFOLIATIVA": "CEX-05-LAB",
    "COMUNICACION EFECTIVA": "CME-01-TOD",
    "DETERMINACION DE PERFILES BIOQUIMICOS EN MUESTRAS BIOLOGICAS HUMANAS I": "DBH-05-LAB",
    "DOCUMENTOS CONTABLES EN UNA OFICINA FARMACEUTICA": "DCF-06-FAR",
    "DISEÑO EN PROTESIS DENTAL": "DEP-01-DEN",
    "BIOQUIMICA CLINICA ESPECIALIZADA": "DPB-06-LAB",
    "DETERMINACION DE PERFILES BIOQUIMICOS EN MUESTRAS BIOLOGICAS HUMANAS II": "DPB-06-LAB",
    "DIBUJO TECNICO DENTARIO": "DTD-I-DENT",
    "EQUIPOS E INSTRUMENTOS DE LABORATORIO CLINICO Y MICROSCOPIA": "EBM-03-LAB",
    "ETICA Y CIUDADANIA": "EC",
    "EDUCACION Y COMUNICACION EN SALUD": "ECS-01-TOD",
    "EPIDEMIOLOGIA DE ENFERMEDADES TRANSMISIBLES": "EET-04-TOD",
    "ESTUDIO ESTRUCTURAL Y FUNCIONAL DEL SER HUMANO II": "EEYII-II.ENFER",
    "MORFOFISIOLOGIA HUMANA": "EEYII-II.ENFER",
    "MORFOFISIOLOGÍA HUMANA": "EEYII-II.ENFER",
    "ELABORACION DE FORMAS FARMACEUTICAS": "EFF-04-FAR",
    "EQUIPOS E INSTRUMENTOS DEL AREA DE BIOQUIMICA Y CONTROL DE CALIDAD": "EIB-05-LAB",
    "EJERCICIOS TERAPEUTICOS": "EJT-04-FIS",
    "ETICA Y LEGISLACION FARMACEUTICA": "ELF-06-FAR",
    "EMERGENCIAS EXTRAHOSPITALARIAS": "EME-06-ENF",
    "EMPRENDIMIENTO": "EMPREN-TOD",
    "ESTADISTICA GENERAL": "ESG-02-TOD",
    "ESTUDIO DE ENFERMEDADES Y SU TRATAMIENTO FARMACOLOGICO": "ETF-05-FAR",
    "FARMACOLOGIA APLICADA A ENFERMERIA": "FAE-04-ENF",
    "FARMACOLOGIA": "FAL-05-ENF",
    "FARMACOTECNIA": "FAT-03-FAR",
    "FARMACOTECNIA I": "FAT-03-FAR",
    "FUNDAMENTOS BASICOS DE TOXICOLOGIA": "FBD-01-TOD",
    "FUNDAMENTOS BIOLOGICOS Y QUIMICOS DEL SER HUMANO": "FBH-01-TOD",
    "FUNDAMENTOS BIOLOGICOS Y QUIMICOS EN EL SER HUMANO": "FBH-01-TOD",
    "FISIOTERAPIA DEPORTIVA": "FDEP-06-FIS",
    "FISICA APLICADA A LA PROTESIS DENTAL": "FISPROT-01.PRO",
    "FARMACOTECNIA II": "FRMT-06-FAR",
    "GESTION DOCUMENTARIA EN ESTABLECIMIENTOS FARMACEUTICOS": "GDEF-04-FAR",
    "GESTION DE EXISTENCIAS Y OPERACIONES BASICAS EN LABORATORIO": "GEO-01-TOD",
    "GESTION Y AUTOMATIZACION EN LABORATORIO CLINICO": "GULC-06-LAB",
    "HIGIENE Y SANEAMIENTO EN LOS ESTABLECIMIENTOS FARMACEUTICOS": "HAEF-06-FAR",
    "HEMATOTERAPIA Y BANCO DE SANGRE": "HBS-06-LAB",
    "HEMOTERAPIA Y BANCO DE SANGRE 1° ETAPA": "HBS-06-LAB",
    "HEMOTERAPIA Y BANCO DE SANGRE 2° ETAPA": "HEB-06-LAB",
    "HEMATOLOGIA Y CITOLOGIA SANGUINEA 1° ETAPA": "HYC-05-LAB",
    "HEMATOLOGIA Y CITOLOGIA SANGUINEA 2° ETAPA": "HEC-05-LAB",
    "HERRAMIENTA INFORMATICAS": "HIS-01-TOD",
    "HERRAMIENTAS INFORMATICAS": "HIS-01-TOD",
    "HEMATOLOGIA Y CITOLOGIA SANGUINEA": "HYC-05-LAB",
    "INTRODUCCION A LA FISIOTERAPIA I": "IAL-01-FIS",
    "INTRODUCCION A LA FISIOTERAPIA Y LA REHABILITACION I": "IAL-01-FIS",
    "INTRODUCCION A LA FISIOTERAPIA Y REHABILITACION I": "IAL-01-FIS",
    "INTRODUCCION A LA FISIOTERAPIA Y LA REHABILITACION II": "IALII-01-FIS",
    "INTRODUCCION A LA FISIOTERAPIA Y REHABILITACION II": "IALII-01-FIS",
    "INFORMATICA E INTERNET": "IEI-01-TOD",
    "INFORMATICA FARMACEUTICA": "IFA-06-FAR",
    "INMUNODIAGNOSTICO": "INDG-04-LAB",
    "COMUNICACION BASICA EN INGLES": "ING-01-TOD",
    "INGLES I": "ING-01-TOD",
    "INGLES II": "ING-02-TOD",
    "INGLES III": "ING-03-TOD",
    "INMUNOLOGIA Y SERODIAGNOSTICO": "INM-04-LAB",
    "INMUNOLOGIA GENERAL": "INMG-03-LAB",
    "INNOVACION": "INV-TOD-EFPL",
    "INYECTOTERAPIA": "INY-02-TOD",
    "INTERPRETACION DE PRUEBA DE LABORATORIO": "IPL-06-LAB",
    "INTERPRETACION DE PRUEBAS DE LABORATORIO": "IPL-06-LAB",
    "INTERPRETACION Y PRODUCCION DE TEXTOS": "IPT-02-TOD",
    "LABORATORIO FORENSE": "LBFC-05-LAB",
    "LABORATORIO DENTAL": "LD1-02-DEN",
    "LEGISLACION E INSERCION LABORAL": "LEP-06-ENF",
    "LEGISLACION Y ETICA PROFESIONAL": "LEP-06-ENF",
    "LOGICA Y FUNCIONES": "LYF-01-TOD",
    "MEDICINA ALTERNATIVA Y COMPLEMENTARIA": "MAC-06-FAR",
    "MASOTERAPIA": "MAS-03-FIS",
    "MASOTERAPIA I": "MAS-03-FIS",
    "MASOTERAPIA II": "MAT-04-FIS",
    "MICROBIOLOGIA": "MBI-02-TOD",
    "MANEJO DE CONTROL E INVENTARIO DE EQUIPO MATERIALES E INSUMOS FARMACEUTICOS": "MCMIF-05-FAR",
    "MANEJO CONTROL E INVENTARIO DE EQUIPOS MATERIALES E INSUMOS FARMACEUTICOS": "MCMIF-05-FAR",
    "MATERIALES DENTALES": "MD-01-PR",
    "MORFOLOGIA DENTARIA EN MICROESTRUCTURAS": "MDM-04-PRO",
    "MEDIO AMBIENTE Y DESARROLLO SOSTENIBLE": "MED-DES-SOS",
    "METODOS DE EXTRACCION E IDENTIFICACION": "MEI-06-FAR",
    "METODOS DE EXTRACCION E IDENTIFICACION DE RECURSOS NATURALES": "MEI-06-FAR",
    "MARKETING": "MKT-03-TOD",
    "METODOS Y TECNICAS DE ESTUDIO MICROBIOLOGICO I": "MT1-03-LAB",
    "MATEMATICA APLICADA": "MTA-01-TOD",
    "METODOS Y TECNICAS DE ESTUDIO PARASITOLOGICO I": "MYP-04-LAB",
    "METODOS Y TECNICAS DE ESTUDIO MICROBIOLOGICO II": "MYT-04-LAB",
    "METODOS Y TECNICAS DEL EXAMEN COMPLETO DE ORINA": "MYT-06-LAB",
    "METODOS Y TECNICAS DE ESTUDIO PARASITOLOGICO II": "MYT-IV-LAB",
    "MICOLOGIA Y VIROLOGIA": "MYV-04-LAB",
    "MICOLOGIA-VIROLOGIA CLINICA": "MYV-04-LAB",
    "NEUROFISIOLOGIA II": "NEF-04-FIS",
    "NEUROFISIOLOGIA I": "NEU-03-FIS",
    "NUTRICION ESPECIALIZADA": "NUE-06-FIS",
    "NUTRICION Y DIETAS": "NYD-06-ENF",
    "OCLUSION DENTARIA II": "OCLU-DEN-II",
    "OCLUSION DENTARIA": "ODI-03-DEN",
    "OCLUSION DENTARIA I": "ODI-03-DEN",
    "ORGANIZACION EN LABORATORIO DENTAL": "OEL-06-DEN",
    "ORGANIZACION Y ADMINISTRACION DEL LABORATORIO DENTAL": "OEL-06-DEN",
    "OFIMATICA": "OFI-02-TOD",
    "ORTODONCIA": "ORT-06-PROT",
    "APARATOLOGIA DE ORTOPEDIA FUNCIONAL": "ORTP-05-PROT",
    "ORTOPEDIA": "ORTP-05-PROT",
    "PROTESIS ADHESIVA": "PADH-06-PRO",
    "PROTESIS DENTAL ADHESIVA": "PADH-06-PRO",
    "PATOLOGIA GENERAL": "PAG-03-TOD",
    "PATOLOGIA II": "PAL-04-ENF",
    "PATOLOGIA I": "PAT-03-ENF",
    "PRINCIPIOS BASICOS DE ADMINISTRACION Y LEGISLACION FARMACEUTICA": "PBALF-04-FAR",
    "PRINCIPIOS BASICOS DE BIOSEGURIDAD": "PBB-01-LAB",
    "PROTESIS DENTAL PARCIAL REMOVIBLE DENTOSOPORTADA": "PDDSOP-03-PRO",
    "PETITORIO NACIONAL DE MEDICAMENTOS ESCENCIALES": "PETM-03-FAR",
    "PETITORIO NACIONAL DE MEDICAMENTOS ESENCIALES": "PETM-03-FAR",
    "PROTESIS FIJA III": "PF-06-DEN",
    "PROTESIS FIJA II": "PF2-05-DEN",
    "PROCESAMIENTO DE PRODUCTOS GALENICOS NATURALES COSMETICOS Y AFINES": "PGN-05-FAR",
    "PROCEDIMIENTOS INVASIVOS Y NO INVASIVOS": "PIN-04-ENF",
    "PARASITOLOGIA DE METAZOOS": "PMTZ-04-LAB",
    "PROTESIS PARCIAL REMOVIBLE II": "PPR-04-DEN",
    "PROTESIS DENTAL PARCIAL REMOVIBLE BASE ACRILICA": "PPRBA-03-PRO",
    "PROTESIS PARCIAL REMOVIBLE BASE ACRILICA": "PPRBA-03-PRO",
    "PARASITOLOGIA DE PROTOZOOS": "PPTZ-03-LAB",
    "PRIMEROS AUXILIOS": "PRA-01-TOD",
    "PROTESIS PARCIAL REMOVIBLE BASE FLEXIBLE": "PRBF-03-PRO",
    "PROYECTO EMPRESARIAL": "PRE-06-TOD",
    "PROYECTOS EMPRESARIALES": "PRE-06-TOD",
    "EQUIPOS E INSTRUMENTOS DE LABORATORIO CLINICO": "PRELAB-02-LAB",
    "PREANALITICA E INSTRUMENTACION EN EL LABORATORIO CLINICO": "PRELAB-02-LAB",
    "PREANALITICA E INSTRUMENTACION EN LABORATORIO CLINICO": "PRELAB-02-LAB",
    "PROTESIS FIJA I": "PRFI-04-PRDE",
    "PROTESIS INTEGRAL ESPECIALIZADA": "PRO- IN-ESP",
    "PROTESIS DENTAL TOTAL POLIPLANO": "PRO-DEN-TO-POL",
    "PROTESIS FIJA II SEGUNDA ETAPA": "PRO-FI-II",
    "PROTESIS FIJA II 2° ETAPA": "PRO-FI-II",
    "PROTESIS DENTAL TOTAL MONOPLANO": "PRO-II-MONOP",
    "PROTESIS DENTAL PARCIAL REMOVIBLE DENTOMUCOSOPORTADA": "PRTDENTO-III",
    "PROTESIS PARCIAL REMOVIBLE DENTOMUCOSOPORTADA": "PRTDENTO-III",
    "PSICOLOGIA CLINICA": "PSC-02-TOD",
    "PSICOLOGIA DEL DISCAPACITADO": "PSD-04-FIS",
    "PROTESIS DENTAL SOMATICA": "PSI-06-DEN",
    "PROTESIS SOMATICA": "PSI-06-DEN",
    "PROTESIS TOTAL III": "P-T-III",
    "PUENTES DENTALES": "PUDE-04-PRO",
    "PRUEBAS DE VALORACION FUNCIONAL MUSCULAR": "PVFM",
    "QUIMICA": "QUI-02-TOD",
    "REPARACIONES Y AGREGACION EN PROTESIS TOTALES": "RAPT-06-PRO",
    "REHABILITACION GRUPAL": "REG-06-FIS",
    "REHABILITACION INDIVIDUAL": "REI-06-FIS",
    "REHABILITACION INTEGRAL": "REI-06-FIS",
    "RETENEDORES EXTRACORONARIOS": "REXC-04-PRO",
    "REPARACIONES DE PROTESIS PARCIAL REMOVIBLE": "RPOPAR-06-PRO",
    "RETENEDORES INTRARADICULARES E INTRACORONARIOS": "RRACO-04-PRO",
    "SEMIOLOGIA DEL APARATO LOCOMOTOR": "SAL-03-FIS",
    "SEMIOLOGIA": "SEM-03-ENF",
    "SEMIOLOGIA BASICA": "SEM-03-ENF",
    "SALUD DEL NINO Y ADOLESCENTE": "SNA-05-ENF",
    "SALUD AL NINO Y ADOLESCENTE": "SNA-05-ENF",
    "TECNICAS DE CONTROL DE CALIDAD EN LA INDUSTRIA FARMACEUTICA": "TCI-05-FAR",
    "TECNICAS DE CONTROL DE LA CALIDAD EN LA INDUSTRIA FARMACEUTICA": "TCI-05-FAR",
    "TECNICAS DE COMUNICACION": "TEC-01-TOD",
    "TERAPIA EN GERIATRIA": "TEG-05-FIS",
    "TERAPIA OCUPACIONAL": "TEO-05-FIS",
    "TERMINOLOGIA EN SALUD": "TES-01-TOD",
    "TOXICOLOGIA": "TOX-05-FAR",
    "TERAPIA DE LENGUAJE": "TPL-06-FIS",
    "TERAPIA EN PATOLOGIAS DEL LENGUAJE": "TPL-06-FIS",
    "TERAPIA EN PATOLOGIA NEUROLOGICA": "TPN-05-FIS",
    "TERAPIA Y PATOLOGIA NEUROLOGICA": "TPN-05-FIS",
    "TERAPIA EN PATOLOGIA REUMATOLOGICA": "TPR-04-FIS",
    "TECNICAS DE TRANSFORMACION DE RECURSOS NATURALES": "TRN-05-FAR",
    "TERAPIA EN TRAUMATOLOGIA Y ORTOPEDIA": "TTYOP-06-FIS",
    "TECNICAS DE VENTA DE PRODUCTOS FARMACEUTICOS DISPOSITIVOS MEDICOS Y PRODUCTOS SANITARIOS": "TVPF-03-FAR",
    "TECNICAS DE VENTAS DE PRODUCTOS FARMACEUTICOS DISPOSITIVOS MEDICOS Y PRODUCTOS SANITARIOS": "TVPF-03-FAR",
    "TRAUMATOLOGIA Y ORTOPEDIA EXTRA": "TYO-06-FIS",
    "UROANALISIS Y FLUIDOS BIOLOGICOS": "UROFB-06-LAB",
    "VENTA Y DISPENSACION DE MEDICAMENTOS Y PRODUCTOS AFINES": "VMP-04-FAR"
};

const MAPA_CURSOS = normalizarMapaCursos(MAPA_CURSOS_RAW);

function normalizarMapaCursos(mapa) {
    const nuevo = {};
    for (const k in mapa) {
        const partes = k.split("|");
        if (partes.length === 2) {
            nuevo[
                normalizarTexto(partes[0]) + "|" + normalizarTexto(partes[1])
            ] = mapa[k];
        } else {
            nuevo[normalizarTexto(k)] = mapa[k];
        }
    }
    return nuevo;
}


// =====================================================
// OBTENER SHORTNAME
function obtenerShortnameCurso(curso, carrera) {
    const cursoLimpio = limpiarCursoDeCarrera(curso);
    const cursoNorm = normalizarTexto(cursoLimpio);

    // 1️⃣ Intentar con carrera
    if (carrera) {
        const carreraCodigo = normalizarCarrera(carrera);
        const claveConCarrera = `${cursoNorm}|${carreraCodigo}`;

        if (MAPA_CURSOS[claveConCarrera]) {
            return MAPA_CURSOS[claveConCarrera];
        }
    }

    // 2️⃣ Intentar sin carrera
    if (MAPA_CURSOS[cursoNorm]) {
        return MAPA_CURSOS[cursoNorm];
    }

    // 3️⃣ No encontrado
    console.warn("Curso no mapeado:", {
        cursoOriginal: curso,
        cursoNormalizado: cursoNorm,
        carrera: carrera
    });

    return "";
}

// =====================================================
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
document.getElementById("exportREV").addEventListener("click", () => {
    const datos = obtenerDatosDeLaTabla();
    if (!datos.length) return alert("No hay datos");

    const headers = ["username", "password", "firstname", "lastname", "email", "city", "course1", "group1", "obs"];

    const filas = datos.map(d => [
        d.DNI,
        (d.DNI + primeraLetraPrimerPalabra(d.APELLIDOS) + primeraLetraPrimerPalabra(d.NOMBRES)).toUpperCase(),
        d.NOMBRES,
        d.APELLIDOS,
        d.DNI + "s@actualizar.com",
        "LIMA",
        obtenerShortnameCurso(d.CURSO, d.CARRERA),
        d.INFORME,
        d.OBS
    ]);

    descargarCSV("REV_NOV.csv", headers, filas);
});

// =====================================================
// NORMALIZAR CELULAR (SOLO 9 DÍGITOS)
function normalizarCelular(cel) {
    if (!cel) return "";

    // eliminar TODO lo que no sea número (espacios incluidos)
    let num = cel.toString().replace(/[^0-9]/g, "");

    // eliminar prefijo Perú 51
    if (num.startsWith("51") && num.length > 9) {
        num = num.substring(2);
    }

    // quedarse con los últimos 9 dígitos
    if (num.length > 9) {
        num = num.slice(-9);
    }

    // validar
    return num.length === 9 ? num : "";
}

// =====================================================
// FILTRAR DUPLICADOS POR CELULAR (USANDO CELULAR LIMPIO)
function filtrarPorCelularUnico(datos) {
    const vistos = new Set();
    const salida = [];

    datos.forEach(d => {
        const celLimpio = normalizarCelular(d.CELULAR);

        // ignorar celulares inválidos
        if (!celLimpio) return;

        // evitar duplicados reales
        if (!vistos.has(celLimpio)) {
            vistos.add(celLimpio);
            d.CELULAR = celLimpio;

            salida.push(d);
        }
    });

    return salida;
}

// =====================================================
// EXPORTAR CONT_NOV
document.getElementById("exportCONT").addEventListener("click", function () {
    let datos = obtenerDatosDeLaTabla();
    if (!datos.length) {
        alert("No hay datos.");
        return;
    }

    // filtrar duplicados y normalizar celulares
    datos = filtrarPorCelularUnico(datos);

    const encabezados = [
        "Nombre",
        "Apellido",
        "Telefono",
        "correo electronico",
        "Direccion",
        "Cumpleaños",
        "Observaciones"
    ];

    const filas = datos.map(d => [
        "",
        (d.APELLIDOS + " " + d.NOMBRES + " " + (d.INFORME || "")).trim(),
        d.CELULAR,                       // ← SOLO 9 DÍGITOS
        d.CELULAR + "s@actualizar.com",
        "ESTANDAR",
        d.FECHA || "",
        d.INFORME || ""
    ]);

    descargarCSV("CONT_NOV.csv", encabezados, filas);
});
