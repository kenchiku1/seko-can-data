import json
from collections import defaultdict

# 元データを読み込む
input_file = 'H20-R7.json'

try:
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # もし全体が {"questions": [...]} のような構造だった場合の対策
    if isinstance(data, dict) and 'questions' in data:
        data = data['questions']

    # 年度ごとに仕分ける
    split_data = defaultdict(list)
    for q in data:
        year_part = 'その他'
        
        # 1. まず 'year' という項目が直接あれば、それを最優先する（R7などの新データ対策）
        if 'year' in q and q['year']:
            year_part = str(q['year']).strip()
        # 2. なければ、従来の 'id' からハイフンの前を切り取る（H20〜H24の旧データ対策）
        elif 'id' in q and q['id']:
            year_part = q['id'].split('-')[0].replace(' ', '').strip()
        
        split_data[year_part].append(q)

    # 年度ごとに別ファイルとして保存
    for year, q_list in split_data.items():
        # 「その他.json」など、意図しないゴミファイルを作らないための安全策
        if year != 'その他':
            output_filename = f"{year}.json"
            with open(output_filename, 'w', encoding='utf-8') as f:
                json.dump(q_list, f, ensure_ascii=False, indent=2)
            print(f"祝・完工！ {output_filename} を作成しました（収録数: {len(q_list)}問）")
        else:
            print(f"※警告: 年度を判別できない問題が {len(q_list)} 問ありました。")

except Exception as e:
    print(f"エラー発生: {e}")