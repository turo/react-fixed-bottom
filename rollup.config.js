import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';
import {terser} from 'rollup-plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

// eslint-disable-next-line import/no-default-export
export default {
  input: 'src/index.ts',
  output: [
    {dir: 'dist', entryFileNames: '[name].js', format: 'cjs', sourcemap: true},
    {dir: 'dist', entryFileNames: '[name].esm.js', format: 'es', sourcemap: true},
  ],
  plugins: [
    commonjs({
      include: /node_modules/,
    }),
    peerDepsExternal(),

    resolve(),
    sourceMaps(),
    typescript({
      clean: true,
      tsconfig: 'tsconfig.build.json',
    }),
    terser(),
  ],
  treeshake: true,
};
