import json

f = open('list.json').read()
  
data = json.loads(f)

newList = []

for i in data:
    newDict = {'name': str(i["name"])}
    newList.append(newDict)
#print(newList)

y = json.dumps(newList)
print(y)
