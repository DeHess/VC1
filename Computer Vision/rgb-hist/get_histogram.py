from PIL import Image
import matplotlib.pyplot as plt

image = Image.open('phoneImage.jpg')
r, g, b = image.split()

plt.figure(figsize=(10, 5))
plt.hist(r.getdata(), bins=256, color='red', alpha=0.5, label='Red')
plt.hist(g.getdata(), bins=256, color='green', alpha=0.5, label='Green')
plt.hist(b.getdata(), bins=256, color='blue', alpha=0.5, label='Blue')

plt.title('RGB Histogram')
plt.xlabel('Pixel Intensity')
plt.ylabel('Frequency')
plt.legend()
plt.show()
