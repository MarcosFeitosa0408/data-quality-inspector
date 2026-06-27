import pandas as pd
import json


# =========================
# LOAD DATA
# =========================
def load_data(path: str) -> pd.DataFrame:
    try:
        df = pd.read_csv(path)
        print(f"[INFO] Dataset carregado: {df.shape[0]} linhas | {df.shape[1]} colunas")
        return df
    except Exception as e:
        print(f"[ERROR] Falha ao carregar dados: {e}")
        return None


# =========================
# REPORT
# =========================
def data_quality_report(df: pd.DataFrame):
    print("\n📊 RELATÓRIO DE QUALIDADE\n")

    print("🔎 Valores nulos por coluna:")
    print(df.isnull().sum())

    print("\n🔁 Duplicados:")
    print(df.duplicated().sum())

    print("\n📈 Estatísticas:")
    print(df.describe(include="all"))


# =========================
# SCORE
# =========================
def data_quality_score(df: pd.DataFrame) -> float:

    total_cells = df.size
    missing_cells = df.isnull().sum().sum()
    duplicates = df.duplicated().sum()

    completeness = (1 - (missing_cells / total_cells)) * 100
    score = completeness - (duplicates * 2)

    print("\n📊 SCORE DE QUALIDADE")
    print(f"Score final: {score:.2f}")

    return round(score, 2)


# =========================
# EXPORT JSON (FRONTEND)
# =========================
def export_quality_summary(df: pd.DataFrame, file_path: str):

    total_cells = df.size
    missing_cells = df.isnull().sum().sum()
    duplicates = df.duplicated().sum()

    valid_cells = total_cells - missing_cells

    completeness = (1 - (missing_cells / total_cells)) * 100
    score = completeness - (duplicates * 2)

    result = {
        "missing": int(missing_cells),
        "duplicates": int(duplicates),
        "valid": int(valid_cells),
        "score": round(score, 2)
    }

    with open("data/quality_summary.json", "w") as f:
        json.dump(result, f)

    print("✅ JSON gerado com sucesso para o dashboard")
