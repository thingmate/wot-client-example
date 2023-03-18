import { aotPlugin } from '@lirx/dom-aot-plugin';

/**
 * @type {import('vite').UserConfig}
 */
const config = {
  build: {
    modulePreload: false,
    target: 'esnext',
    // minify: 'terser',
    polyfillModulePreload: false,
    terserOptions: {
      toplevel: true,
      ecma: 2020,
      compress: {
        pure_getters: true,
        passes: 5,
        ecma: 2020,
        // unsafe: true,
        unsafe_arrows: true,
        unsafe_comps: true,
        unsafe_Function: true,
        unsafe_math: true,
        unsafe_symbols: true,
        unsafe_methods: true,
        unsafe_proto: true,
        unsafe_undefined: true,
        unused: true,
      },
      mangle: {
        eval: true,
      }
    },
  },
  plugins: [
    aotPlugin({
      pathMatches: (path) => {
        return path.endsWith('.ts')
          || path.endsWith('.component.mjs');
      },
    }),
  ],
  server: {
    // https: true,
    // host: true,
  },
  // optimizeDeps: {
  //   include: [
  //     '@lifaon/math',
  //     '@lirx/utils',
  //     '@lirx/promise',
  //     '@lirx/core',
  //     '@lirx/store',
  //     '@lirx/dom',
  //     '@lirx/mdi',
  //     '@lirx/dom-material',
  //     '@thingmate/wot-scripting-api',
  //   ],
  // },
};

export default config;
