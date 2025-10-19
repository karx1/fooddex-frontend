import requests
import base64

with open("image.jpg", "rb") as image_file:
    base64Image = base64.b64encode(image_file.read()).decode("utf-8")

json = {
    "image": base64Image,
    "mimetype": "image/jpeg"
}

# response = requests.post(
#     "http://localhost:8787/api/recognizeFood",
#     json=json
# )

response = requests.post(
    "https://backend.brandonwees.workers.dev/api/foods",
    json={
        
    }
)

print(response.text)