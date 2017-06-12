import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/index.js',
  dest: 'build/index.js',
  plugins: [ babel() ],
  format: 'umd',
  moduleName: 'telldus-local',
  external: ['node-fetch', 'query-string']
};
