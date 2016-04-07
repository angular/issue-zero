var Builder = require('systemjs-builder');

export function bundleTask (src:string, dest:string, config:any) {
  return (done) => {
    let builder = new Builder();
    builder.config(config);
    builder.bundle(src, dest)
      .then(() => done());
  }
}