import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'index.js',
  output: [
    {
      file: 'dist/latexmarkdown.min.js',
      format: 'umd',
      name: 'latexmarkdown',
      plugins: [terser()],
    },
  ],
  plugins: [nodeResolve(), commonjs(), json()],
};
