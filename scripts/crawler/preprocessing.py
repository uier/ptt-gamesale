import json

games = {
    "NS": [],
    "PS4": [],
    "PS5": [],
}

"""
Preprocessing For NS Games
"""

with open('./ns-games-2017-2023.json', 'r') as f:
    d = json.load(f)
d = [s.replace('"', '') for s in d]
d.append("歧路旅人2")
d = list(set(filter(lambda x: len(x) > 0, d)))
games['NS'] = d


"""
Preprocessing For PS4 Games
"""

with open('./ps4-games-1-258.json', 'r') as f:
    d = json.load(f)
d = [s.replace('"', '') for s in d]
d = list(set(filter(lambda x: len(x) > 0, d)))

if "Bloodborne™ PlayStation®Hits" in d:
    d[d.index("Bloodborne™ PlayStation®Hits")] = "血源詛咒 Bloodborne™ PlayStation®Hits"
if "Bloodborne™ The Old Hunters Edition" in d:
    d[d.index("Bloodborne™ The Old Hunters Edition")] = "血源詛咒：遠古獵人 Bloodborne™ The Old Hunters Edition"


games['PS4'] = d


"""
Preprocessing For PS5 Games
"""

with open('./ps5-games-1-75.json', 'r') as f:
    d = json.load(f)
d = [s.replace('"', '') for s in d]
d = list(set(filter(lambda x: len(x) > 0, d)))
games['PS5'] = d



with open('./games.json', 'w') as f:
    json.dump(games, f, ensure_ascii=False, indent=4)