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

def data_quality_score(df):
    total_cells = df.size
    missing_cells = df.isnull().sum().sum()

    completeness = ((total_cells - missing_cells) / total_cells) * 100

    duplicates = df.duplicated().sum()

    score = completeness - (duplicates * 2)

    if score >= 90:
        level = "🟢 Excelente"
    elif score >= 70:
        level = "🟡 Bom"
    elif score >= 50:
        level = "🟠 Médio"
    else:
        level = "🔴 Ruim"

    print("\n📊 SCORE DE QUALIDADE")
    print(f"Completude: {completeness:.2f}%")
    print(f"Duplicados: {duplicates}")
    print(f"Score final: {score:.2f}")
    print(f"Classificação: {level}")

import json

def export_quality_summary(df):
    total_cells = df.size
    missing_cells = df.isnull().sum().sum()
    duplicates = df.duplicated().sum()

    valid_cells = total_cells - missing_cells

    result = {
        "missing": int(missing_cells),
        "duplicates": int(duplicates),
        "valid": int(valid_cells)
    }

    with open("data/quality_summary.json", "w") as f:
        json.dump(result, f)

    print("✅ JSON de qualidade gerado com sucesso")

import pandas as pd
import json

def load_data(path: str):
    ...

def data_quality_report(df: pd.DataFrame):
    ...

def data_quality_score(df):
    ...

def export_quality_summary(df):
    ...

def load_data(path: str) -> pd.DataFrame:

print("[INFO] Dataset carregado com sucesso")
print("[PROCESS] Calculando score de qualidade...")
score = (1 - (missing_cells / total_cells)) * 100

{
  "missing": 10,
  "duplicates": 2,
  "valid": 88,
  "score": 82.5,
  "timestamp": "2026-06-26"
}
