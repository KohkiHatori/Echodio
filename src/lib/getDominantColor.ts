// lib/getRepresentativeColor.ts
import { kmeans } from 'ml-kmeans';

export type RGB = [number, number, number];

export const getAverageColorFromImageURL = (url: string): Promise<RGB> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const proxiedUrl = `/api/proxy-image?url=${encodeURIComponent(url)}`;
    img.crossOrigin = 'anonymous';
    img.src = proxiedUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("No canvas context");

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

      let r = 0, g = 0, b = 0;
      const pixelCount = data.length / 4;

      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
      }

      resolve([r / pixelCount, g / pixelCount, b / pixelCount]);
    };

    img.onerror = (err) => reject(err);
  });
};

/**
 * Extracts the dominant color of an image using K-means clustering.
 * @param imageUrl A publicly accessible image URL or proxied image path.
 * @returns Promise resolving to RGB tuple.
 */
export const getDominantColorKMeans = (imageUrl: string): Promise<RGB> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const proxiedUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
    img.crossOrigin = "anonymous";
    img.src = proxiedUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scaleFactor = 0.1; // Downscale to ~150x50 for performance
      canvas.width = img.width * scaleFactor;
      canvas.height = img.height * scaleFactor;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Failed to get canvas context"));

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

      const pixels: number[][] = [];
      for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const a = imageData[i + 3];
        // Ignore fully transparent pixels
        if (a > 0) {
          pixels.push([r, g, b]);
        }
      }

      if (pixels.length === 0) return reject(new Error("No valid pixels found"));

      const k = 5;
      const { clusters, centroids } = kmeans(pixels, k, {});

      // Count frequency of each cluster
      const counts = Array(k).fill(0);
      clusters.forEach(i => counts[i]++);
      const dominantIndex = counts.indexOf(Math.max(...counts));
      const dominantColor = centroids[dominantIndex];

      resolve(dominantColor as RGB);
    };

    img.onerror = (e) => reject(new Error("Failed to load image"));
  });
};

export const rgbToCss = (rgb: RGB): string =>
  `rgb(${rgb.map((v) => Math.round(v)).join(",")})`;