import json
from collections import defaultdict

# 元データを読み込む
input_file = 'H20-R7.json'

try:
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # 年度ごとに仕分ける
    split_data = defaultdict(list)
    for q in data:
        q_id = q.get('id', '')
        if q_id:
            # "H 20-AM-01" のハイフンの前を取り出し、スペースを消して "H20" にする
            year_part = q_id.split('-')[0].replace(' ', '')
        else:
            year_part = 'その他'
        split_data[year_part].append(q)

    # 年度ごとに別ファイルとして保存
    for year, q_list in split_data.items():
        output_filename = f"{year}.json"
        with open(output_filename, 'w', encoding='utf-8') as f:
            json.dump(q_list, f, ensure_ascii=False, indent=2)
        print(f"祝・完工！ {output_filename} を作成しました（収録数: {len(q_list)}問）")

except Exception as e:
    print(f"エラー発生: {e}")