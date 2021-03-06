const Asset = require('../parcelRequires').Asset;
const path = require('path');

class ImageAsset extends Asset {
  constructor(name, pkg, options) {
    super(name, pkg, options);
    this.encoding = null;
  }

  async packageImage(quality, location) {
    return imagemin([location]);
  }

  async transform() {
    if (this.options.minify) {
      let config = this.package.imagemin || (await this.getConfig(['imagemin.config.js']));
      let quality = config && config.quality ? config.quality : 100;

      let result = await this.packageImage(quality, path.resolve(this.name));
      if (result[0] && result[0].data) {
        this.outputData = result[0].data;
      }
    }
  }

  generate() {
    return {
      image: this.outputData || this.contents
    }
  }
}

module.exports = ImageAsset;