import csv
import json
import glob
from collections import defaultdict

try:
    split_data = defaultdict(list)
    # フォルダ内のすべてのCSVファイルを自動で探す
    csv_files = glob.glob('*.csv')

    if not csv_files:
        print("エラー: CSVファイルが一つも見つかりません。")
        exit()

    print(f"{len(csv_files)}個のCSVファイルを発見しました。一括変換を開始します...")

    for input_csv in csv_files:
        with open(input_csv, mode='r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            for row in reader:
                year = row.get('year', '').strip()
                if not year:
                    continue

                q_obj = {
                    "id": row.get('id', ''),
                    "year": year,
                    "session": row.get('session', ''),
                    "no": row.get('no', ''),
                    "category": row.get('category', ''),
                    "subcategory": row.get('subcategory', ''),
                    "question": row.get('question', ''),
                    "choices": {
                        "1": row.get('choice1', ''),
                        "2": row.get('choice2', ''),
                        "3": row.get('choice3', ''),
                        "4": row.get('choice4', '')
                    },
                    "answer": row.get('answer', ''),
                    "explanation_sho": row.get('explanation_sho', ''),
                    "explanation_ken": row.get('explanation_ken', ''),
                    "imageUrl": row.get('imageUrl', '')
                }
                split_data[year].append(q_obj)

    # 年度ごとにまとめてJSONとして出力する
    for year, q_list in split_data.items():
        output_filename = f"{year}.json"
        with open(output_filename, 'w', encoding='utf-8') as f:
            json.dump(q_list, f, ensure_ascii=False, indent=2)
        print(f"祝・完工！ {output_filename} を作成しました（収録数: {len(q_list)}問）")

    print("すべての変換が完了しました！")

except Exception as e:
    print(f"エラー発生: {e}")