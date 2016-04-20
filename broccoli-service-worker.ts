const fse           = require('fs-extra');
const path          = require('path');
const BroccoliPlugin:BroccoliPluginConstructor        = require('broccoli-caching-writer');
const ngsw = require ('angular2-service-worker');
const MANIFEST_NAME = 'manifest.appcache';
const WORKER_NAME = 'worker.js';

interface BroccoliPluginConstructor {
    new(inputNodes:any[], options?:any): BroccoliPluginConstructor
    inputPaths: string[];
    outputPath: string;
}

class SourceResolver {
  constructor(public inputPaths:string[]) {}
  resolve(sources:string[]): Object {
    return Promise.resolve(sources.reduce((prev, curr) => {
      prev[`/${path.relative(this.inputPaths[0], curr)}`] = fse.readFileSync(curr, 'utf-8');
      return prev;
    }, {}));
  }
}

class ServiceWorkerPlugin extends BroccoliPlugin {
  constructor(inputNodes:any, options?:any) {
    super([inputNodes]);
  }

  build() {
    var sourceResolver = new SourceResolver(this.inputPaths);
    var manifestWriter = new ngsw.ManifestWriter(sourceResolver);
    // TODO(jeffbcross): plugin assumes single input path right now.
    return manifestWriter.generate({
      group: [{
        name: 'app',
        sources: this.inputPaths
          .map(p => recursiveReaddirSync(p))
          .reduce((prev, curr) => prev.concat(curr), [])
          .filter(p => {
            var relativePath = path.relative(this.inputPaths[0], p);
            return relativePath !== MANIFEST_NAME && relativePath !== WORKER_NAME;
          })
        }]
      })
      .then(manifest => {
        fse.writeFileSync(path.join(this.outputPath, MANIFEST_NAME), manifest);
      })
      .then(() => {
        fse.writeFileSync(path.resolve(this.outputPath, WORKER_NAME), fse.readFileSync(path.resolve(this.inputPaths[0], 'vendor/angular2-service-worker/dist/worker.js')));
      });
  }
}

module.exports = ServiceWorkerPlugin;

function recursiveReaddirSync(src) {
  var files = [];
  fse.readdirSync(src).forEach(function(res) {
    var child = path.join(src, res);
    var stat = fse.statSync(child);
    if (stat.isFile()) {
      files.push(child);
    } else if (stat.isDirectory()) {
      files = files.concat(recursiveReaddirSync(child));
    }
  })
  return files;
}
