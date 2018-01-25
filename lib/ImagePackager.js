const RawPackager = require('parcel-bundler/src/packagers/RawPackager');
const path = require('path');
const url = require('url');
const fs = require('fs');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminSvgo = require('imagemin-svgo');

class ImagePackager extends RawPackager {
  async addAsset(asset) {
    let name = this.bundle.name;
    if (asset !== this.bundle.entryAsset) {
      name = url.resolve(
        path.join(path.dirname(this.bundle.name), asset.generateBundleName()),
        ''
      );
    }

    let contents = asset.generated[asset.type];
    let config = await asset.getConfig(['imagemin.config.js']);
    let quality = config.quality;
    if (!contents || (contents && contents.path)) {
      let location = contents ? contents.path : asset.name;
      let result = await imagemin([location], {
        plugins: [
          imageminMozjpeg({ quality }),
          imageminPngquant({ quality }),
          imageminGifsicle({ optimizationLevel: 2 }),
          imageminSvgo()
        ]
      });
      if (result[0] && result[0].data) {
        contents = result[0].data;
      }
    }

    await new Promise((resolve, reject) => {
      fs.writeFile(name, contents, (err) => {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  }
}

module.exports = ImagePackager;