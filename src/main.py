from src.analyzer import load_data

def main():
    print("🚀 Data Quality Inspector iniciado")

    file_path = "data/sample_data.csv"
    df = load_data(file_path)

    if df is not None:
        print("\n📊 Primeiras linhas do dataset:")
        print(df.head())

if __name__ == "__main__":
    main()
