import { cp, readdir, readFile, rename, rm, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import CleanCSS from "clean-css";
import sharp from "sharp";
import { minify as minifyJavaScript } from "terser";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDirectory = path.resolve(projectRoot, process.env.SITE_SOURCE_DIR || "src");
const outputDirectory = path.join(projectRoot, ".pages-build");

try {
  const sourceStats = await stat(sourceDirectory);
  if (!sourceStats.isDirectory()) {
    throw new Error(`Site source path is not a directory: ${sourceDirectory}`);
  }
} catch (error) {
  throw new Error(`Cannot read site source directory "${sourceDirectory}".`, { cause: error });
}

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(entryPath) : [entryPath];
  }));
  return files.flat();
}

await rm(outputDirectory, { recursive: true, force: true });
await cp(sourceDirectory, outputDirectory, { recursive: true });
await writeFile(path.join(outputDirectory, ".nojekyll"), "");

const files = await listFiles(outputDirectory);
let originalImageBytes = 0;
let optimizedImageBytes = 0;
let optimizedImageCount = 0;
let originalCodeBytes = 0;
let optimizedCodeBytes = 0;

for (const filePath of files) {
  const extension = path.extname(filePath).toLowerCase();
  if (![".png", ".jpg", ".jpeg", ".webp"].includes(extension)) continue;

  const originalImage = await readFile(filePath);
  const originalSize = originalImage.length;
  const temporaryPath = `${filePath}.optimized.webp`;
  await sharp(originalImage)
    .webp({ quality: 88, effort: 6 })
    .toFile(temporaryPath);

  const outputPath = extension === ".webp"
    ? filePath
    : path.join(path.dirname(filePath), `${path.basename(filePath, extension)}.webp`);
  const optimizedSize = (await stat(temporaryPath)).size;

  await unlink(filePath);
  await rename(temporaryPath, outputPath);

  originalImageBytes += originalSize;
  optimizedImageBytes += optimizedSize;
  optimizedImageCount += 1;
}

for (const filePath of await listFiles(outputDirectory)) {
  const extension = path.extname(filePath).toLowerCase();
  if (![".css", ".js"].includes(extension)) continue;

  const content = await readFile(filePath, "utf8");
  const optimizedContent = content.replace(
    /((?:images|certificates)\/[^"'?#]+)\.(?:png|jpe?g)(?=[?#"')]|$)/gi,
    "$1.webp",
  );
  const minified = extension === ".css"
    ? new CleanCSS({ level: 2 }).minify(optimizedContent)
    : await minifyJavaScript(optimizedContent);
  if (minified.errors?.length) {
    throw new Error(`Failed to minify ${path.relative(outputDirectory, filePath)}: ${minified.errors.join("; ")}`);
  }
  const minifiedCode = extension === ".css" ? minified.styles : minified.code;
  if (minifiedCode === undefined) {
    throw new Error(`Minifier returned no output for ${path.relative(outputDirectory, filePath)}.`);
  }

  originalCodeBytes += Buffer.byteLength(content);
  optimizedCodeBytes += Buffer.byteLength(minifiedCode);
  await writeFile(filePath, minifiedCode);
}

const reduction = originalImageBytes === 0
  ? 0
  : Math.round((1 - optimizedImageBytes / originalImageBytes) * 100);
console.log(
  `Optimized ${optimizedImageCount} images: `
  + `${(originalImageBytes / 1024 / 1024).toFixed(2)} MB to `
  + `${(optimizedImageBytes / 1024 / 1024).toFixed(2)} MB (${reduction}% smaller).`,
);
const codeReduction = originalCodeBytes === 0
  ? 0
  : Math.round((1 - optimizedCodeBytes / originalCodeBytes) * 100);
console.log(
  `Minified CSS and JavaScript: `
  + `${(originalCodeBytes / 1024).toFixed(1)} KB to `
  + `${(optimizedCodeBytes / 1024).toFixed(1)} KB (${codeReduction}% smaller).`,
);
