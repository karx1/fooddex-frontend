import requests
import csv
import time
import base64
import os



image_path = "image.png"
if os.path.exists(image_path):
	with open(image_path, "rb") as img_file:
		img_bytes = img_file.read()
		img_b64 = base64.b64encode(img_bytes).decode("utf-8")
	payload = {"image": img_b64}
	response = requests.post(
		"https://backend.brandonwees.workers.dev/api/recognizeFood",
		json=payload
	)
	print("Status:", response.status_code)
	print("Response:", response.json())
else:
	print(f"File {image_path} not found.")