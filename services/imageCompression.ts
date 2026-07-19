/**
 * Client-side utility to compress images/screenshots of payment proofs
 * before encoding them to Base64, keeping them well under the Firestore 1MB limit.
 */
export function compressImage(
  file: File,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.7
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to create 2D canvas context.'));
          return;
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        try {
          // Export as compressed JPEG
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = (err) => {
        reject(new Error('Failed to load image for compression.'));
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = (err) => {
      reject(new Error('Failed to read payment proof file.'));
    };

    reader.readAsDataURL(file);
  });
}
