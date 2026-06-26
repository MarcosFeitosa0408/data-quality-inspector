from src.analyzer import (
    load_data,
    data_quality_report,
    data_quality_score,
    export_quality_summary
)

from src.charts import plot_nulls


def main():
    print("🚀 Data Quality Inspector iniciado")

    file_path = "data/sample_data.csv"

    df = load_data(file_path)

    if df is not None:
        data_quality_report(df)
        data_quality_score(df)
        export_quality_summary(df)
        plot_nulls(df)

        print("✅ Análise concluída com sucesso!")
        print("📁 JSON atualizado em: data/quality_summary.json")


if __name__ == "__main__":
    main()
