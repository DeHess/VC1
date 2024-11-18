import cv2
from PIL import Image
import numpy as np
import matplotlib.pyplot as plt
from math import sqrt, exp

def plot_figure(images: list, titles: list, rows: int, columns: int, fig_width=15, fig_height=7):
    fig = plt.figure(figsize=(fig_width, fig_height))
    count = 1
    for image, title in zip(images, titles):
        fig.add_subplot(rows, columns, count)
        count += 1
        plt.imshow(image, 'gray')
        plt.axis('off')
        plt.title(title)
 

def distance(point1, point2):
    return sqrt((point1[0] - point2[0]) ** 2 + (point1[1] - point2[1]) ** 2)

def gaussianLP(D0, imgShape):
    base = np.zeros(imgShape[:2])
    rows, cols = imgShape[:2]
    center = (rows/2, cols/2)
    for i in range(rows):
        for j in range(cols):
            base[i, j] = np.exp(-distance((i, j), center)**2 / (2 * D0**2))
    return base


def gaussianHP(D0, imgShape):
    base = np.zeros(imgShape[:2])
    rows, cols = imgShape[:2]
    center = (rows/2, cols/2)
    for i in range(rows):
        for j in range(cols):
            base[i, j] = 1 - np.exp(-distance((i, j), center)**2 / (2 * D0**2))
    return base


def hybrid_images(image1, image2, D0 = 50):
    original1 = np.fft.fft2(image1)                          #Get the fourier of image1
    center1 = np.fft.fftshift(original1)                     #Apply Centre shifting
    LowPassCenter = center1 * gaussianLP(D0, image1.shape)   #Extract low frequency component
    LowPass = np.fft.ifftshift(LowPassCenter)                 
    inv_LowPass = np.fft.ifft2(LowPass)                         #Get image using Inverse FFT

    original2 = np.fft.fft2(image2)
    center2 = np.fft.fftshift(original2)
    HighPassCenter = center2 * gaussianHP(D0, image2.shape)  #Extract high frequency component
    HighPass = np.fft.ifftshift(HighPassCenter)
    inv_HighPass = np.fft.ifft2(HighPass)
    hybrid = np.abs(inv_LowPass) + np.abs(inv_HighPass)      #Generate the hybrid image
    return hybrid


A = cv2.imread('/cat.png',cv2.IMREAD_COLOR) # high picture
B = cv2.imread('panda.png',cv2.IMREAD_COLOR) # low picture

# Convert both images to Grayscale to avoid any Color Channel Issue
A_grayscale = cv2.cvtColor(A, cv2.COLOR_BGR2GRAY)
B_grayscale = cv2.cvtColor(B, cv2.COLOR_BGR2GRAY)

# Resize both images to 128x128 to avoid different image size issue
A_resized = cv2.resize(A_grayscale, (128, 128))
B_resized = cv2.resize(B_grayscale, (128, 128))

result = hybrid_images(A_resized,B_resized,1)

plot_figure([A,B,result], ['A','B','Hybrid Image'],1,3)