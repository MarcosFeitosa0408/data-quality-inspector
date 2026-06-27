// ======================================================
// EDAP - Enterprise Data Analytics Platform
// Dashboard Engine
// ======================================================

async function loadDashboard() {

    try {

        const response = await fetch("data/quality_summary.json");

        const data = await response.json();

        // =========================
        // DATASET
        // =========================

        document.getElementById("dataset-name").innerText =
            data.dataset.name;

        document.getElementById("dataset-rows").innerText =
            data.dataset.rows;

        document.getElementById("dataset-columns").innerText =
            data.dataset.columns;

        // =========================
        // QUALITY
        // =========================

        document.getElementById("missing").innerText =
            data.quality.missing;

        document.getElementById("duplicates").innerText =
            data.quality.duplicates;

        document.getElementById("valid").innerText =
            data.quality.valid;

        document.getElementById("score").innerText =
            data.quality.score;

        document.getElementById("classification").innerText =
            data.quality.classification;

        // =========================
        // STATISTICS
        // =========================

        document.getElementById("numeric-columns").innerText =
            data.statistics.numeric_columns;

        document.getElementById("categorical-columns").innerText =
            data.statistics.categorical_columns;

        // =========================
        // DATE
        // =========================

        document.getElementById("generated-at").innerText =
            data.generated_at;

        createCharts(data);

    }

    catch(error){

        console.error(error);

    }

}

// ======================================================
// CHARTS
// ======================================================

function createCharts(data){

    const ctx = document
        .getElementById("qualityChart")
        .getContext("2d");

    new Chart(ctx,{

        type:"doughnut",

        data:{

            labels:[
                "Missing",
                "Duplicates",
                "Valid"
            ],

            datasets:[{

                data:[
                    data.quality.missing,
                    data.quality.duplicates,
                    data.quality.valid
                ]

            }]

        }

    });

}

loadDashboard();
