import fs from "fs";
import path from "path";
import sharp from "sharp";

const MAX_DIMENSION = 2560;
const WEBP_QUALITY = 82;

/**
 * Resize, auto-orient, and compress an uploaded raster image.
 * Call only after EXIF has been read from the original file path.
 * @param {string} filePath - Absolute path to the file saved by multer
 * @returns {Promise<{ path: string, filename: string, width: number, height: number, size: number }>}
 */
export async function optimizePhotoUpload(filePath) {
  const dir = path.dirname(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const base = path.basename(filePath, ext);

  let meta;
  try {
    meta = await sharp(filePath, { failOn: "none" }).metadata();
  } catch (e) {
    console.warn(
      "optimizePhotoUpload: unreadable image, keeping original:",
      e.message,
    );
    const stat = fs.statSync(filePath);
    return {
      path: filePath,
      filename: path.basename(filePath),
      width: 0,
      height: 0,
      size: stat.size,
    };
  }

  const isAnimatedGif =
    meta.format === "gif" && (meta.pages ?? 1) > 1;

  const outFilename = isAnimatedGif ? `${base}.gif` : `${base}.webp`;
  const outPath = path.join(dir, outFilename);
  const inputResolved = path.resolve(filePath);
  const outputResolved = path.resolve(outPath);
  const samePath = inputResolved === outputResolved;

  const needsResize =
    meta.width &&
    meta.height &&
    (meta.width > MAX_DIMENSION || meta.height > MAX_DIMENSION);

  let chain = sharp(filePath, {
    failOn: "none",
    ...(isAnimatedGif ? { animated: true, limitInputPixels: false } : {}),
  }).rotate();

  if (needsResize) {
    chain = chain.resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  if (isAnimatedGif) {
    chain = chain.gif({ effort: 7 });
  } else {
    chain = chain.webp({ quality: WEBP_QUALITY, effort: 4 });
  }

  try {
    if (samePath) {
      const tmpPath = path.join(dir, `${base}.tmp-${process.pid}.img`);
      await chain.toFile(tmpPath);
      fs.unlinkSync(filePath);
      fs.renameSync(tmpPath, outPath);
    } else {
      await chain.toFile(outPath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    const outMeta = await sharp(outPath, { failOn: "none" }).metadata();
    const size = fs.statSync(outPath).size;

    return {
      path: outPath,
      filename: outFilename,
      width: outMeta.width ?? meta.width ?? 0,
      height: outMeta.height ?? meta.height ?? 0,
      size,
    };
  } catch (e) {
    console.error("optimizePhotoUpload failed:", e);
    if (!samePath && fs.existsSync(outPath)) {
      try {
        fs.unlinkSync(outPath);
      } catch {
        /* ignore */
      }
    }
    if (fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath);
      return {
        path: filePath,
        filename: path.basename(filePath),
        width: meta.width ?? 0,
        height: meta.height ?? 0,
        size: stat.size,
      };
    }
    throw e;
  }
}
