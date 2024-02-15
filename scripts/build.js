// little build script, will probably be more in the future
// gzips assets after vite build
import fs from "fs";
import { gzipSync } from "zlib";


async function gzip(path) {
  const files = await fs.promises.readdir(path);

  for (let f of files) {
    const fpath = `${path}/${f}`;

    if (fs.statSync(fpath).isFile()) {
      console.log("[gzip] "+f);

      const data = await fs.promises.readFile(fpath);
      await fs.promises.writeFile(fpath, gzipSync(data));
    }
  }
};

gzip(`${import.meta.dirname}/../dist/`);