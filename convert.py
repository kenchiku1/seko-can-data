import csv
import json
import glob
from collections import defaultdict

try:
    split_data = defaultdict(list)
    csv_files = glob.glob('*.csv')

    print(f"{len(csv_files)}個のCSVファイルを処理します...")

    for input_csv in csv_files:
        with open(input_csv, mode='r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            # 列名の前後の余分なスペースを掃除
            reader.fieldnames = [name.strip() for name in reader.fieldnames]
            
            for row in reader:
                year = row.get('year', '').strip()
                if not year: continue

                # 【修正ポイント】CSVの列名「shoken」「kenryu」に完全に合わせました
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
                    # ここでCSVの「shoken」「kenryu」をアプリ用の「sho」「ken」へ引き継ぎます
                    "explanation_sho": row.get('explanation_shoken', ''),
                    "explanation_ken": row.get('explanation_kenryu', ''),
                    "imageUrl": row.get('imageUrl', '')
                }
                split_data[year].append(q_obj)

    for year, q_list in split_data.items():
        output_filename = f"{year}.json"
        with open(output_filename, 'w', encoding='utf-8') as f:
            json.dump(q_list, f, ensure_ascii=False, indent=2)
        
        # 完工チェック（解説が正しく入った数を集計）
        count = sum(1 for q in q_list if q['explanation_sho'])
        print(f"祝・完工！ {output_filename} を作成（収録数: {len(q_list)}問 / 解説あり: {count}問）")

except Exception as e:
    print(f"エラー発生: {e}")