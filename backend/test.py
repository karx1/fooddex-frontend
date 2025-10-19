import requests
import base64

with open("image.jpg", "rb") as image_file:
    base64Image = base64.b64encode(image_file.read()).decode("utf-8")

json = {
    "image": base64Image,
    "mimetype": "image/jpeg"
}

response = requests.post(
    "https://backend.brandonwees.workers.dev/api/recognizeFood",
    json=json
)

print(response.text)