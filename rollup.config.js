import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import serve from "rollup-plugin-serve";
import html2 from "rollup-plugin-html2";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";

const isDevelopment = process.env.NODE_ENV === "development";


const plugins = [
  typescript(),
  commonjs({ include: "node_modules/**", extensions: [".js", ".ts"] }),
  resolve(),
  html2({
    template: "src/index.html",
    onlinePath: '.'
  }),
]


if (isDevelopment) {
  plugins.push(
    serve({
      contentBase: "./dist",
      open: false,
    }),
    livereload({ watch: "./dist" })
  );
} else {
  plugins.push(terser({ sourcemap: true }));
}

export default
  {
    input: './src/main.ts',
    output: {
      file: 'dist/bundle.js',
      format: 'cjs'
    },
    plugins
  }