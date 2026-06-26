from src.analyzer import load_data, data_quality_report

def main():
    print("🚀 Data Quality Inspector iniciado")

    file_path = "data/sample_data.csv"
    df = load_data(file_path)

    if df is not None:
        data_quality_report(df)

if __name__ == "__main__":
    main()
