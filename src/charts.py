import matplotlib.pyplot as plt

def plot_nulls(df):
    null_counts = df.isnull().sum()

    plt.figure(figsize=(8, 4))
    null_counts[null_counts > 0].plot(kind="bar")

    plt.title("Valores nulos por coluna")
    plt.ylabel("Quantidade de nulos")
    plt.xlabel("Colunas")

    plt.tight_layout()
    plt.show()
