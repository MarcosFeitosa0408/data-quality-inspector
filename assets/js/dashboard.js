```javascript
/* ==========================================================
   ENTERPRISE DATA ANALYTICS PLATFORM (EDAP)
   assets/js/dashboard.js
   ========================================================== */

/* ==========================================================
   CONFIGURATION
   ========================================================== */

const CONFIG = {

    DATA_URL: "data/quality_summary.json",

    REFRESH_INTERVAL: 60000,

    ANIMATION_DURATION: 800

};

/* ==========================================================
   APPLICATION
   ========================================================== */

const EDAP = {

    charts: {},

    dataset: null,

    initialized: false

};

/* ==========================================================
   DOM
   ========================================================== */

const DOM = {

    /* Dataset */

    datasetName:
        document.getElementById("dataset-name"),

    datasetRows:
        document.getElementById("dataset-rows"),

    datasetColumns:
        document.getElementById("dataset-columns"),

    /* KPIs */

    kpiRows:
        document.getElementById("kpi-dataset-rows"),

    missing:
        document.getElementById("missing"),

    duplicates:
        document.getElementById("duplicates"),

    valid:
        document.getElementById("valid"),

    score:
        document.getElementById("score"),

    classification:
        document.getElementById("classification"),

    /* Statistics */

    numericColumns:
        document.getElementById("numeric-columns"),

    categoricalColumns:
        document.getElementById("categorical-columns"),

    generatedAt:
        document.getElementById("generated-at"),

    /* Progress */

    progressScore:
        document.getElementById("progress-score"),

    progressValid:
        document.getElementById("progress-valid"),

    progressMissing:
        document.getElementById("progress-missing"),

    /* Charts */

    qualityChart:
        document.getElementById("qualityChart"),

    barChart:
        document.getElementById("barChart"),

    lineChart:
        document.getElementById("lineChart"),

    columnChart:
        document.getElementById("columnChart"),

    scatterChart:
        document.getElementById("scatterChart"),

    /* Insights */

    insights:
        document.getElementById("insights-container"),

    /* Export */

    exportPDF:
        document.getElementById("export-pdf"),

    exportExcel:
        document.getElementById("export-excel"),

    exportCSV:
        document.getElementById("export-csv"),

    exportJSON:
        document.getElementById("export-json"),

    exportHTML:
        document.getElementById("export-html")

};

/* ==========================================================
   INITIALIZATION
   ========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    async () => {

        await initializeApplication();

    }

);

/* ==========================================================
   START
   ========================================================== */

async function initializeApplication(){

    try{

        validateDOM();

        showLoadingState();

        await loadDataset();

        initializeExportEvents();

        startAutoRefresh();

        hideLoadingState();

        EDAP.initialized = true;

        console.log(

            "✅ EDAP Dashboard iniciado."

        );

    }

    catch(error){

        showError(error);

    }

}

/* ==========================================================
   DOM VALIDATION
   ========================================================== */

function validateDOM(){

    Object.entries(DOM).forEach(

        ([key,value])=>{

            if(value===null){

                console.warn(

                    `Elemento não encontrado: ${key}`

                );

            }

        }

    );

}

/* ==========================================================
   LOAD DATA
   ========================================================== */

async function loadDataset(){

    const response = await fetch(

        CONFIG.DATA_URL,

        {

            cache:"no-cache"

        }

    );

    if(!response.ok){

        throw new Error(

            "Falha ao carregar quality_summary.json"

        );

    }

    const data = await response.json();

    EDAP.dataset = data;

    updateDashboard(data);

}

/* ==========================================================
   UPDATE DASHBOARD
   ========================================================== */

function updateDashboard(data){

    updateDataset(data);

    updateKPIs(data);

    updateStatistics(data);

    updateProgressBars(data);

    updateCharts(data);

    updateInsights(data);

}
```
```javascript
/* ==========================================================
   DATASET
   ========================================================== */

function updateDataset(data){

    const dataset = data?.dataset ?? {};

    setText(

        DOM.datasetName,

        dataset.name ?? "--"

    );

    setText(

        DOM.datasetRows,

        formatNumber(

            dataset.rows

        )

    );

    setText(

        DOM.datasetColumns,

        formatNumber(

            dataset.columns

        )

    );

}

/* ==========================================================
   KPIs
   ========================================================== */

function updateKPIs(data){

    const quality = data?.quality ?? {};

    const dataset = data?.dataset ?? {};

    setText(

        DOM.kpiRows,

        formatNumber(

            dataset.rows

        )

    );

    setText(

        DOM.missing,

        formatNumber(

            quality.missing

        )

    );

    setText(

        DOM.duplicates,

        formatNumber(

            quality.duplicates

        )

    );

    setText(

        DOM.valid,

        formatNumber(

            quality.valid

        )

    );

    setText(

        DOM.score,

        formatPercentage(

            quality.score

        )

    );

    setText(

        DOM.classification,

        quality.classification ?? "--"

    );

}

/* ==========================================================
   STATISTICS
   ========================================================== */

function updateStatistics(data){

    const statistics = data?.statistics ?? {};

    setText(

        DOM.numericColumns,

        formatNumber(

            statistics.numeric_columns

        )

    );

    setText(

        DOM.categoricalColumns,

        formatNumber(

            statistics.categorical_columns

        )

    );

    updateGeneratedAt(

        data?.generated_at

    );

}

/* ==========================================================
   PROGRESS BARS
   ========================================================== */

function updateProgressBars(data){

    const quality = data?.quality ?? {};

    const valid = Number(

        quality.valid ?? 0

    );

    const missing = Number(

        quality.missing ?? 0

    );

    const duplicates = Number(

        quality.duplicates ?? 0

    );

    const total =

        valid +
        missing +
        duplicates;

    const validPercent =

        total > 0
            ? (valid / total) * 100
            : 0;

    const missingPercent =

        total > 0
            ? (missing / total) * 100
            : 0;

    const scorePercent =

        Number(

            quality.score ?? 0

        );

    setProgress(

        DOM.progressScore,

        scorePercent

    );

    setProgress(

        DOM.progressValid,

        validPercent

    );

    setProgress(

        DOM.progressMissing,

        missingPercent

    );

}

/* ==========================================================
   GENERATED DATE
   ========================================================== */

function updateGeneratedAt(value){

    const formatted =

        formatDate(value);

    setText(

        DOM.generatedAt,

        formatted

    );

    const footerDate =

        document.getElementById(

            "generated-at-footer"

        );

    if(footerDate){

        footerDate.textContent =

            formatted;

    }

}

/* ==========================================================
   HELPERS
   ========================================================== */

function setText(element,value){

    if(!element){

        return;

    }

    element.textContent =

        value ?? "--";

}

function setProgress(element,value){

    if(!element){

        return;

    }

    const safeValue =

        Math.max(

            0,

            Math.min(

                Number(value) || 0,

                100

            )

        );

    element.style.width =

        `${safeValue.toFixed(1)}%`;

}

function formatNumber(value){

    if(

        value === null ||

        value === undefined ||

        Number.isNaN(Number(value))

    ){

        return "--";

    }

    return Number(value)

        .toLocaleString(

            "pt-BR"

        );

}

function formatPercentage(value){

    if(

        value === null ||

        value === undefined ||

        Number.isNaN(Number(value))

    ){

        return "--";

    }

    return `${Number(value).toFixed(2)}%`;

}

function formatDate(value){

    if(!value){

        return "--";

    }

    const date =

        new Date(value);

    if(

        Number.isNaN(

            date.getTime()

        )

    ){

        return value;

    }

    return date.toLocaleString(

        "pt-BR",

        {

            dateStyle:"short",

            timeStyle:"medium"

        }

    );

}
```
```javascript
/* ==========================================================
   CHARTS
   ========================================================== */

function updateCharts(data){

    if(typeof Chart === "undefined"){

        console.warn(

            "Chart.js não encontrado."

        );

        return;

    }

    const quality = data?.quality ?? {};

    const statistics = data?.statistics ?? {};

    createQualityChart(

        quality

    );

    createBarChart(

        quality

    );

    createLineChart(

        quality

    );

    createColumnChart(

        statistics

    );

    createScatterChart(

        quality

    );

}

/* ==========================================================
   DEFAULT CHART CONFIG
   ========================================================== */

function getChartDefaults(){

    return{

        responsive:true,

        maintainAspectRatio:false,

        animation:{

            duration:

                CONFIG.ANIMATION_DURATION

        },

        interaction:{

            intersect:false,

            mode:"index"

        },

        plugins:{

            legend:{

                labels:{

                    color:"#CBD5E1",

                    font:{

                        family:"Inter",

                        size:13

                    }

                }

            },

            tooltip:{

                backgroundColor:"#1E293B",

                titleColor:"#FFFFFF",

                bodyColor:"#CBD5E1",

                borderColor:"#334155",

                borderWidth:1,

                padding:12

            }

        },

        scales:{

            x:{

                ticks:{

                    color:"#CBD5E1"

                },

                grid:{

                    color:"rgba(255,255,255,.05)"

                }

            },

            y:{

                beginAtZero:true,

                ticks:{

                    color:"#CBD5E1"

                },

                grid:{

                    color:"rgba(255,255,255,.05)"

                }

            }

        }

    };

}

/* ==========================================================
   QUALITY CHART
   ========================================================== */

function createQualityChart(quality){

    if(!DOM.qualityChart){

        return;

    }

    const chartData=[

        Number(

            quality.missing ?? 0

        ),

        Number(

            quality.duplicates ?? 0

        ),

        Number(

            quality.valid ?? 0

        )

    ];

    createOrUpdateChart(

        "qualityChart",

        DOM.qualityChart,

        {

            type:"doughnut",

            data:{

                labels:[

                    "Missing",

                    "Duplicados",

                    "Válidos"

                ],

                datasets:[{

                    data:chartData,

                    backgroundColor:[

                        "#EF4444",

                        "#F59E0B",

                        "#22C55E"

                    ],

                    borderWidth:0

                }]

            },

            options:getChartDefaults()

        }

    );

}

/* ==========================================================
   BAR CHART
   ========================================================== */

function createBarChart(quality){

    if(!DOM.barChart){

        return;

    }

    createOrUpdateChart(

        "barChart",

        DOM.barChart,

        {

            type:"bar",

            data:{

                labels:[

                    "Missing",

                    "Duplicados",

                    "Válidos"

                ],

                datasets:[{

                    label:"Quantidade",

                    data:[

                        quality.missing ?? 0,

                        quality.duplicates ?? 0,

                        quality.valid ?? 0

                    ],

                    backgroundColor:[

                        "#EF4444",

                        "#F59E0B",

                        "#38BDF8"

                    ]

                }]

            },

            options:getChartDefaults()

        }

    );

}

/* ==========================================================
   LINE CHART
   ========================================================== */

function createLineChart(quality){

    if(!DOM.lineChart){

        return;

    }

    const score=

        Number(

            quality.score ?? 0

        );

    createOrUpdateChart(

        "lineChart",

        DOM.lineChart,

        {

            type:"line",

            data:{

                labels:[

                    "Qualidade"

                ],

                datasets:[{

                    label:"Score",

                    data:[

                        score

                    ],

                    borderColor:"#38BDF8",

                    backgroundColor:

                        "rgba(56,189,248,.25)",

                    tension:.35,

                    fill:true

                }]

            },

            options:getChartDefaults()

        }

    );

}

/* ==========================================================
   COLUMN CHART
   ========================================================== */

function createColumnChart(statistics){

    if(!DOM.columnChart){

        return;

    }

    createOrUpdateChart(

        "columnChart",

        DOM.columnChart,

        {

            type:"bar",

            data:{

                labels:[

                    "Numéricas",

                    "Categóricas"

                ],

                datasets:[{

                    label:"Colunas",

                    data:[

                        statistics.numeric_columns ?? 0,

                        statistics.categorical_columns ?? 0

                    ],

                    backgroundColor:[

                        "#8B5CF6",

                        "#22C55E"

                    ]

                }]

            },

            options:getChartDefaults()

        }

    );

}

/* ==========================================================
   SCATTER CHART
   ========================================================== */

function createScatterChart(quality){

    if(!DOM.scatterChart){

        return;

    }

    createOrUpdateChart(

        "scatterChart",

        DOM.scatterChart,

        {

            type:"scatter",

            data:{

                datasets:[{

                    label:"Qualidade",

                    backgroundColor:"#38BDF8",

                    data:[{

                        x:Number(

                            quality.missing ?? 0

                        ),

                        y:Number(

                            quality.score ?? 0

                        )

                    }]

                }]

            },

            options:getChartDefaults()

        }

    );

}

/* ==========================================================
   CHART FACTORY
   ========================================================== */

function createOrUpdateChart(

    key,

    canvas,

    config

){

    if(!canvas){

        return;

    }

    if(

        EDAP.charts[key]

    ){

        EDAP.charts[key].destroy();

    }

    EDAP.charts[key]=

        new Chart(

            canvas,

            config

        );

}
```
```javascript id="wz6r8p"
/* ==========================================================
   INSIGHTS
   ========================================================== */

function updateInsights(data){

    const quality = data?.quality ?? {};

    const score = Number(

        quality.score ?? 0

    );

    const missing = Number(

        quality.missing ?? 0

    );

    const duplicates = Number(

        quality.duplicates ?? 0

    );

    const classification =

        classifyQuality(

            score

        );

    const qualityInsight =

        document.getElementById(

            "quality-insight"

        );

    const integrityInsight =

        document.getElementById(

            "integrity-insight"

        );

    const recommendationInsight =

        document.getElementById(

            "recommendation-insight"

        );

    setText(

        qualityInsight,

        classification.message

    );

    let integrityMessage =

        "Os dados apresentam boa consistência estrutural.";

    if(

        missing > 0 &&

        duplicates > 0

    ){

        integrityMessage =

            `Foram encontrados ${formatNumber(missing)} valores ausentes e ${formatNumber(duplicates)} registros duplicados.`;

    }

    else if(

        missing > 0

    ){

        integrityMessage =

            `Existem ${formatNumber(missing)} valores ausentes que devem ser tratados antes das análises.`;

    }

    else if(

        duplicates > 0

    ){

        integrityMessage =

            `Foram encontrados ${formatNumber(duplicates)} registros duplicados. Recomenda-se deduplicação.`;

    }

    setText(

        integrityInsight,

        integrityMessage

    );

    setText(

        recommendationInsight,

        classification.recommendation

    );

}

/* ==========================================================
   QUALITY CLASSIFICATION
   ========================================================== */

function classifyQuality(score){

    if(score >= 95){

        return{

            level:"Excelente",

            message:

                "Excelente qualidade dos dados. O conjunto está pronto para análises estratégicas.",

            recommendation:

                "Manter o processo atual de governança e monitoramento contínuo."

        };

    }

    if(score >= 85){

        return{

            level:"Boa",

            message:

                "Boa qualidade geral dos dados com pequenas oportunidades de melhoria.",

            recommendation:

                "Corrigir registros inconsistentes e acompanhar indicadores periodicamente."

        };

    }

    if(score >= 70){

        return{

            level:"Regular",

            message:

                "A qualidade dos dados requer atenção antes de análises críticas.",

            recommendation:

                "Executar rotinas de limpeza e validação das principais colunas."

        };

    }

    if(score >= 50){

        return{

            level:"Baixa",

            message:

                "A qualidade dos dados está comprometida.",

            recommendation:

                "Revisar origem dos dados e aplicar tratamento completo antes do uso."

        };

    }

    return{

        level:"Crítica",

        message:

            "A qualidade dos dados é insuficiente para análises confiáveis.",

        recommendation:

            "Interromper o consumo analítico até que o processo de saneamento seja concluído."

    };

}

/* ==========================================================
   LOADING
   ========================================================== */

function showLoadingState(){

    document.body.classList.add(

        "loading"

    );

}

function hideLoadingState(){

    document.body.classList.remove(

        "loading"

    );

}

/* ==========================================================
   ERROR HANDLER
   ========================================================== */

function showError(error){

    console.error(

        "[EDAP]",

        error

    );

    hideLoadingState();

    const container =

        DOM.insights ??

        document.body;

    if(container){

        container.innerHTML = `

            <div class="empty-state">

                <h3>

                    Erro ao carregar o dashboard

                </h3>

                <p>

                    ${error?.message ?? "Erro inesperado."}

                </p>

            </div>

        `;

    }

}
```
```javascript
/* ==========================================================
   EXPORT EVENTS
   ========================================================== */

function initializeExportEvents(){

    bindExportButton(

        DOM.exportPDF,

        exportPDF

    );

    bindExportButton(

        DOM.exportExcel,

        exportExcel

    );

    bindExportButton(

        DOM.exportCSV,

        exportCSV

    );

    bindExportButton(

        DOM.exportJSON,

        exportJSON

    );

    bindExportButton(

        DOM.exportHTML,

        exportHTML

    );

}

function bindExportButton(

    button,

    callback

){

    if(!button){

        return;

    }

    button.addEventListener(

        "click",

        callback

    );

}

/* ==========================================================
   EXPORT PDF
   ========================================================== */

function exportPDF(){

    exportPlaceholder(

        "PDF Executivo"

    );

}

/* ==========================================================
   EXPORT EXCEL
   ========================================================== */

function exportExcel(){

    exportPlaceholder(

        "Excel (.xlsx)"

    );

}

/* ==========================================================
   EXPORT CSV
   ========================================================== */

function exportCSV(){

    exportPlaceholder(

        "CSV Tratado"

    );

}

/* ==========================================================
   EXPORT JSON
   ========================================================== */

function exportJSON(){

    if(

        !EDAP.dataset

    ){

        return;

    }

    const blob =

        new Blob(

            [

                JSON.stringify(

                    EDAP.dataset,

                    null,

                    2

                )

            ],

            {

                type:

                "application/json"

            }

        );

    downloadBlob(

        blob,

        "quality_summary.json"

    );

}

/* ==========================================================
   EXPORT HTML
   ========================================================== */

function exportHTML(){

    exportPlaceholder(

        "Relatório HTML"

    );

}

/* ==========================================================
   PLACEHOLDER
   ========================================================== */

function exportPlaceholder(

    feature

){

    console.info(

        `[EDAP] ${feature} será integrado na próxima versão.`

    );

    alert(

        `${feature} ainda não está disponível.\n\nA arquitetura já está preparada para integração futura.`

    );

}

/* ==========================================================
   DOWNLOAD
   ========================================================== */

function downloadBlob(

    blob,

    filename

){

    const url =

        URL.createObjectURL(

            blob

        );

    const link =

        document.createElement(

            "a"

        );

    link.href =

        url;

    link.download =

        filename;

    document.body.appendChild(

        link

    );

    link.click();

    link.remove();

    URL.revokeObjectURL(

        url

    );

}

/* ==========================================================
   AUTO REFRESH
   ========================================================== */

function startAutoRefresh(){

    if(

        CONFIG.REFRESH_INTERVAL <= 0

    ){

        return;

    }

    setInterval(

        async ()=>{

            try{

                await loadDataset();

                console.info(

                    "[EDAP] Dashboard atualizado."

                );

            }

            catch(error){

                console.error(

                    "[EDAP] Falha na atualização automática.",

                    error

                );

            }

        },

        CONFIG.REFRESH_INTERVAL

    );

}

/* ==========================================================
   APPLICATION HELPERS
   ========================================================== */

function getDataset(){

    return EDAP.dataset ?? {};

}

function hasDataset(){

    return EDAP.dataset !== null;

}

function getQuality(){

    return getDataset().quality ?? {};

}

function getStatistics(){

    return getDataset().statistics ?? {};

}

function getDatasetInfo(){

    return getDataset().dataset ?? {};

}
```
```javascript id="6kq9ta"
/* ==========================================================
   CHART LIFECYCLE
   ========================================================== */

function destroyChart(chartKey){

    const chart = EDAP.charts[chartKey];

    if(

        chart &&

        typeof chart.destroy === "function"

    ){

        chart.destroy();

        EDAP.charts[chartKey] = null;

    }

}

function destroyAllCharts(){

    Object.keys(

        EDAP.charts

    ).forEach(

        destroyChart

    );

}

/* ==========================================================
   APPLICATION VALIDATION
   ========================================================== */

function validateDataset(data){

    if(

        !data ||

        typeof data !== "object"

    ){

        throw new Error(

            "Estrutura do dataset inválida."

        );

    }

    return true;

}

function validateChartCanvas(canvas){

    return (

        canvas instanceof HTMLCanvasElement

    );

}

/* ==========================================================
   SAFE UPDATE
   ========================================================== */

function safeUpdate(callback){

    try{

        callback();

    }

    catch(error){

        console.error(

            "[EDAP]",

            error

        );

    }

}

/* ==========================================================
   MEMORY CLEANUP
   ========================================================== */

window.addEventListener(

    "beforeunload",

    ()=>{

        destroyAllCharts();

    }

);

/* ==========================================================
   VISIBILITY CONTROL
   ========================================================== */

document.addEventListener(

    "visibilitychange",

    ()=>{

        if(

            document.hidden

        ){

            console.info(

                "[EDAP] Dashboard em segundo plano."

            );

        }

    }

);

/* ==========================================================
   RUNTIME VALIDATION
   ========================================================== */

(function runtimeValidation(){

    if(

        typeof Chart === "undefined"

    ){

        console.warn(

            "Chart.js não foi carregado."

        );

    }

    [

        "qualityChart",

        "barChart",

        "lineChart",

        "columnChart",

        "scatterChart"

    ].forEach(

        key=>{

            if(

                DOM[key] &&

                !validateChartCanvas(

                    DOM[key]

                )

            ){

                console.warn(

                    `${key} não é um canvas válido.`

                );

            }

        }

    );

})();

/* ==========================================================
   FINAL NOTES

   EDAP Dashboard Engine

   Camadas implementadas:

   ✔ Inicialização
   ✔ Carregamento do JSON
   ✔ Atualização automática
   ✔ KPIs
   ✔ Estatísticas
   ✔ Barras de progresso
   ✔ Dashboard Charts
   ✔ Insights automáticos
   ✔ Exportações
   ✔ Tratamento de erros
   ✔ Organização modular
   ✔ Arquitetura preparada para evolução

   Próximas versões poderão adicionar:

   - IA para geração de insights
   - Upload de arquivos
   - Filtros dinâmicos
   - Drill Down
   - Cross Filtering
   - Múltiplos datasets
   - ETL em tempo real
   - API REST
   - WebSocket
   - Autenticação
   - Histórico de análises

   ========================================================== */
```
```javascript id="9md7ec"
/* ==========================================================
   EDAP v1.1
   UI MODULES
   ========================================================== */

/* ==========================================================
   SIDEBAR
   ========================================================== */

function initializeSidebar(){

    const sidebar =

        document.getElementById(

            "sidebar"

        );

    const toggle =

        document.getElementById(

            "sidebar-toggle"

        );

    if(

        !sidebar ||

        !toggle

    ){

        return;

    }

    toggle.addEventListener(

        "click",

        ()=>{

            sidebar.classList.toggle(

                "collapsed"

            );

            saveUserPreference(

                "sidebarCollapsed",

                sidebar.classList.contains(

                    "collapsed"

                )

            );

        }

    );

    const collapsed =

        getUserPreference(

            "sidebarCollapsed",

            false

        );

    if(collapsed){

        sidebar.classList.add(

            "collapsed"

        );

    }

}

/* ==========================================================
   DATASET UPLOAD
   ========================================================== */

function initializeUploadModule(){

    const upload =

        document.getElementById(

            "dataset-upload"

        );

    if(!upload){

        return;

    }

    upload.addEventListener(

        "change",

        handleDatasetUpload

    );

}

async function handleDatasetUpload(event){

    const file =

        event.target.files?.[0];

    if(!file){

        return;

    }

    const extension =

        file.name

            .split(".")

            .pop()

            ?.toLowerCase();

    switch(extension){

        case "json":

            await loadJSONDataset(file);

            break;

        case "csv":

            notify(

                "Importação CSV preparada para integração com o backend."

            );

            break;

        case "xlsx":

        case "xls":

            notify(

                "Importação Excel preparada para integração futura."

            );

            break;

        default:

            notify(

                "Formato de arquivo não suportado."

            );

    }

}

async function loadJSONDataset(file){

    const text =

        await file.text();

    const dataset =

        JSON.parse(text);

    validateDataset(dataset);

    EDAP.dataset = dataset;

    refreshDashboard(dataset);

}

/* ==========================================================
   DASHBOARD REFRESH
   ========================================================== */

function refreshDashboard(data){

    safeUpdate(()=>{

        updateDataset(data);

        updateKPIs(data);

        updateStatistics(data);

        updateProgressBars(data);

        updateCharts(data);

        updateInsights(data);

    });

}

/* ==========================================================
   USER PREFERENCES
   ========================================================== */

function saveUserPreference(

    key,

    value

){

    try{

        localStorage.setItem(

            `edap.${key}`,

            JSON.stringify(value)

        );

    }

    catch(error){

        console.warn(

            error

        );

    }

}

function getUserPreference(

    key,

    defaultValue

){

    try{

        const value =

            localStorage.getItem(

                `edap.${key}`

            );

        return value

            ? JSON.parse(value)

            : defaultValue;

    }

    catch{

        return defaultValue;

    }

}

/* ==========================================================
   NOTIFICATIONS
   ========================================================== */

function notify(message){

    console.info(

        `[EDAP] ${message}`

    );

    if(

        "Notification" in window &&

        Notification.permission ===

        "granted"

    ){

        new Notification(

            "Enterprise Data Analytics Platform",

            {

                body:message

            }

        );

    }

}
```
