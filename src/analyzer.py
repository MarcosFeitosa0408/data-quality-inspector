import pandas as pd

def load_data(path: str):
    try:
        df = pd.read_csv(path)
        print(f"✅ Dataset carregado: {df.shape[0]} linhas | {df.shape[1]} colunas")
        return df
    except Exception as e:
        print(f"❌ Erro ao carregar dados: {e}")
        return None


def data_quality_report(df: pd.DataFrame):
    print("\n📊 RELATÓRIO DE QUALIDADE DE DADOS\n")

    # valores nulos
    nulls = df.isnull().sum()
    print("🔎 Valores nulos por coluna:")
    print(nulls)

    # duplicados
    duplicates = df.duplicated().sum()
    print(f"\n🔁 Registros duplicados: {duplicates}")

    # estatísticas básicas
    print("\n📈 Estatísticas descritivas:")
    print(df.describe(include="all"))
