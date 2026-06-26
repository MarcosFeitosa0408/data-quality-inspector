import pandas as pd

def load_data(path: str):
    try:
        df = pd.read_csv(path)
        print(f"Arquivo carregado com sucesso: {df.shape}")
        return df
    except Exception as e:
        print(f"Erro ao carregar arquivo: {e}")
        return None
