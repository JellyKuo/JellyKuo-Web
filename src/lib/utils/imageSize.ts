import { imageSizeFromFile } from "image-size/fromFile";
import fs from "fs";
import path from "path";

/**
 * Calculates the width and height of an image file on the local filesystem.
 * This function runs during the Astro build process (SSG).
 * * @param imagePath The path to the image relative to the project's public directory (e.g., "/assets/img.jpg").
 * @returns The size string "W-H" or undefined if the file is not found or dimensions are unavailable.
 */
export async function getOptimizedGalleryImages(imagePath: string): Promise<string | undefined> {
  // We assume images are consistently located inside the public folder for static assets.
  const absolutePath: string = path.join(process.cwd(), "public", imagePath);

  try {
    // Check if the file exists synchronously before attempting to read it
    if (fs.existsSync(absolutePath)) {
      // Read the image dimensions
      const dimensions = await imageSizeFromFile(absolutePath);
      
      // Ensure both width and height properties are available and return the required "W-H" format
      if (dimensions.width && dimensions.height) {
        return `${dimensions.width}-${dimensions.height}`;
      }
    }
  } catch (error) {
    // Log the error during the build process without stopping the entire build
    if (error instanceof Error) {
        console.error(`Error reading image dimensions for ${imagePath}:`, error.message);
    } else {
        console.error(`An unknown error occurred while processing ${imagePath}`);
    }
  }
  return undefined;
}