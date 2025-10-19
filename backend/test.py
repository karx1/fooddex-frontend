import requests

with open("./foods.csv", "r")


response = requests.post(
    "https://backend.brandonwees.workers.dev/api/foods",
    json={
       "rarity": "hi",
       "origin": "hi",
       "foodname": "hi",
       "description": "hi"
    }
)

print(response.text)