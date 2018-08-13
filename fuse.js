const { src, task, exec, context } = require('fuse-box/sparky')
const { FuseBox, WebIndexPlugin } = require('fuse-box')

context(class {
  getConfig() {
    return FuseBox.init({
      homeDir: 'src',
      output: 'dist/$name.js',
      useTypescriptCompiler: true,
      experimentalFeatures: true,
    })
  }
})

task('default', async context => {
  const fuse = context.getConfig()
  fuse.bundle('js/back')
                      .watch('back/**')
                      .instructions('> [back/index.ts]')
                      .completed(proc => proc.start())
  fuse.dev({port: 4444, httpServer: false})
  fuse.run()
})
