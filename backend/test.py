import requests
import time

with open("./foods.csv", "r") as fi:
    next(fi)
    for line in fi.readlines():
        csvdata = line.split(",")
        print(csvdata)
        response = requests.post(
            "https://backend.brandonwees.workers.dev/api/foods",
            json={
                "rarity": int(csvdata[2]),
                "origin": csvdata[1],
                "foodname": csvdata[0],
                "description": csvdata[3]
            }
        )
        print(response.json())
        time.sleep(1)

print(requests.get("https://backend.brandonwees.workers.dev/api/foods").json())