import pandas as pd
import json

sheet_url = "https://docs.google.com/spreadsheets/d/12EqLmqrUZNSIxqUSuWCHc8i2WhLB9wCAbNF5Lc74MPw/export?format=csv"
df = pd.read_csv(sheet_url)

def df_para_json(df, caminho_json):
    pessoas = []

    for idx, row in df.iterrows():
        pessoa = {
            "model": "core.pessoa",
            "pk": idx + 1,
            "fields": {
                "nome": row["nome"],
                "ano": int(row["ano"]) if pd.notna(row["ano"]) else 0,
                "oculos": [v.strip() for v in str(row["oculos"]).split(";") if v.strip()],
                "tatuagem": [v.strip() for v in str(row["tatuagem"]).split(";") if v.strip()],
                "altura": float(row["altura"]) if pd.notna(row["altura"]) else 0,
                "area_estudo": row.get("area_estudo", "não informado"),
                "time": row.get("time", "nenhum")
            }
        }
        pessoas.append(pessoa)

    with open(caminho_json, "w", encoding='utf-8') as jsonfile:
        json.dump(pessoas, jsonfile, ensure_ascii=False, indent=4)

# Exemplo de uso
df_para_json(df, "pessoas.json")
