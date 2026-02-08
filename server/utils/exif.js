import piexifjs from "piexifjs";
import fs from "fs";

/**
 * Extract EXIF data from an image file
 * @param {string} filePath - Path to the image file
 * @returns {Object} Extracted EXIF data
 */
export function extractExifData(filePath) {
  try {
    const data = fs.readFileSync(filePath);
    const exif = piexifjs.load(data);

    const metadata = {
      camera: {
        model: "Unknown",
        make: "Unknown",
      },
      lens: "Unknown",
      iso: 0,
      aperture: "N/A",
      shutterSpeed: "N/A",
      focalLength: "N/A",
      dateTaken: null,
    };

    // Extract camera make and model
    if (exif.Exif) {
      const exifData = exif.Exif;

      // Camera Make (tag 271)
      if (exifData[271]) {
        try {
          metadata.camera.make = piexifjs.Helper.getString(
            exifData[271],
          ).trim();
        } catch (e) {
          // Keep default
        }
      }

      // Camera Model (tag 272)
      if (exifData[272]) {
        try {
          metadata.camera.model = piexifjs.Helper.getString(
            exifData[272],
          ).trim();
        } catch (e) {
          // Keep default
        }
      }

      // Lens Model (tag 42082 / 0xA430)
      if (exifData[42082]) {
        try {
          metadata.lens = piexifjs.Helper.getString(exifData[42082]).trim();
        } catch (e) {
          // Keep default
        }
      }

      // ISO Speed (tag 34855 / 0x8827)
      if (exifData[34855]) {
        const isoValue = exifData[34855];
        metadata.iso = Array.isArray(isoValue) ? isoValue[0] : isoValue;
      }

      // Aperture / F-number (tag 33437 / 0x829D)
      if (exifData[33437]) {
        const fn = exifData[33437][0];
        metadata.aperture = `f/${(fn[0] / fn[1]).toFixed(1)}`;
      }

      // Shutter Speed / Exposure Time (tag 33434 / 0x829A)
      if (exifData[33434]) {
        const et = exifData[33434][0];
        const speed = et[1] / et[0];
        if (speed >= 1) {
          metadata.shutterSpeed = `${speed.toFixed(1)}s`;
        } else {
          metadata.shutterSpeed = `1/${Math.round(1 / speed)}`;
        }
      }

      // Focal Length (tag 37386 / 0x920E)
      if (exifData[37386]) {
        const fl = exifData[37386][0];
        metadata.focalLength = `${(fl[0] / fl[1]).toFixed(1)}mm`;
      }

      // Date Taken (tag 36867 / 0x9003 - DateTimeOriginal)
      if (exifData[36867]) {
        try {
          metadata.dateTaken = piexifjs.Helper.getString(exifData[36867]);
        } catch (e) {
          // Keep default
        }
      }
    }

    // Extract basic image info from IFD0
    if (exif["0th"]) {
      const ifd0 = exif["0th"];

      // Alternate camera make/model extraction
      if (ifd0[271] && metadata.camera.make === "Unknown") {
        try {
          metadata.camera.make = piexifjs.Helper.getString(ifd0[271]).trim();
        } catch (e) {
          // Keep default
        }
      }

      if (ifd0[272] && metadata.camera.model === "Unknown") {
        try {
          metadata.camera.model = piexifjs.Helper.getString(ifd0[272]).trim();
        } catch (e) {
          // Keep default
        }
      }

      // DateTime (tag 306 / 0x0132)
      if (ifd0[306] && !metadata.dateTaken) {
        try {
          metadata.dateTaken = piexifjs.Helper.getString(ifd0[306]);
        } catch (e) {
          // Keep default
        }
      }
    }

    return metadata;
  } catch (error) {
    console.error("Error extracting EXIF:", error.message);
    return {
      camera: { model: "Unknown", make: "Unknown" },
      lens: "Unknown",
      iso: 0,
      aperture: "N/A",
      shutterSpeed: "N/A",
      focalLength: "N/A",
      dateTaken: null,
    };
  }
}
