import json
import os
from datetime import datetime

import pandas as pd


# ==========================================================
# LOAD DATA
# ==========================================================

def load_data(path: str) -> pd.DataFrame:
    """
    Carrega um dataset CSV.

    Parameters
    ----------
    path : str
        Caminho do arquivo CSV.

    Returns
    -------
    pd.DataFrame
    """

    try:
        df = pd.read_csv(path)

        print(f"\n[INFO] Dataset carregado com sucesso.")
        print(f"[INFO] Linhas: {df.shape[0]}")
        print(f"[INFO] Colunas: {df.shape[1]}")

        return df

    except Exception as e:

        print(f"[ERRO] Não foi possível carregar o dataset.")
        print(e)

        return None


# ==========================================================
# DATA QUALITY REPORT
# ==========================================================

def data_quality_report(df: pd.DataFrame):

    print("\n==============================")
    print(" RELATÓRIO DE QUALIDADE")
    print("==============================")

    print("\nValores nulos por coluna:\n")
    print(df.isnull().sum())

    print("\nDuplicados:")
    print(df.duplicated().sum())

    print("\nEstatísticas:")
    print(df.describe(include="all"))


# ==========================================================
# SCORE
# ==========================================================

def data_quality_score(df: pd.DataFrame) -> float:

    total_cells = df.size

    missing_cells = df.isnull().sum().sum()

    duplicates = df.duplicated().sum()

    completeness = (1 - (missing_cells / total_cells)) * 100

    score = completeness - (duplicates * 2)

    score = max(score, 0)

    print("\n==============================")
    print(" SCORE DE QUALIDADE")
    print("==============================")

    print(f"Score: {score:.2f}")

    return round(score, 2)


# ==========================================================
# CLASSIFICATION
# ==========================================================

def classify_score(score: float):

    if score >= 90:
        return "Excelente"

    elif score >= 75:
        return "Bom"

    elif score >= 60:
        return "Regular"

    return "Ruim"


# ==========================================================
# EXPORT JSON
# ==========================================================

def export_quality_summary(
    df: pd.DataFrame,
    file_path: str
):

    total_cells = df.size

    missing_cells = df.isnull().sum().sum()

    duplicates = df.duplicated().sum()

    valid_cells = total_cells - missing_cells

    completeness = (1 - (missing_cells / total_cells)) * 100

    score = completeness - (duplicates * 2)

    score = round(max(score, 0), 2)

    classification = classify_score(score)

    dataset_name = os.path.basename(file_path)

    rows = int(df.shape[0])

    columns = int(df.shape[1])

    numeric_columns = len(
        df.select_dtypes(include="number").columns
    )

    categorical_columns = len(
        df.select_dtypes(exclude="number").columns
    )

    result = {

        "dataset": {

            "name": dataset_name,

            "rows": rows,

            "columns": columns

        },

        "quality": {

            "missing": int(missing_cells),

            "duplicates": int(duplicates),

            "valid": int(valid_cells),

            "score": score,

            "classification": classification

        },

        "statistics": {

            "numeric_columns": numeric_columns,

            "categorical_columns": categorical_columns

        },

        "generated_at": datetime.now().strftime(
            "%d/%m/%Y %H:%M:%S"
        )

    }

    with open(
        "data/quality_summary.json",
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            result,
            file,
            indent=4,
            ensure_ascii=False
        )

    print("\n[INFO] JSON atualizado com sucesso.")
