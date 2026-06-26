from src.analyzer import load_data, data_quality_report
from src.charts import plot_nulls

def main():
    print("🚀 Data Quality Inspector iniciado")

    file_path = "data/sample_data.csv"
    df = load_data(file_path)

    if df is not None:
        data_quality_report(df)
        plot_nulls(df)

if __name__ == "__main__":
    main()

from src.analyzer import load_data, data_quality_report, data_quality_score
from src.charts import plot_nulls

def main():
    print("🚀 Data Quality Inspector iniciado")

    file_path = "data/sample_data.csv"
    df = load_data(file_path)

    if df is not None:
        data_quality_report(df)
        data_quality_score(df)
        plot_nulls(df)

if __name__ == "__main__":
    main()
