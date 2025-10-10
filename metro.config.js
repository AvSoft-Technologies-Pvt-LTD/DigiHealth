const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
    // Optional: Uncomment if using SVGs
    // babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    // Include source extensions from defaults and custom ones
    sourceExts: [...defaultConfig.resolver.sourceExts, 'jsx', 'ts', 'tsx', 'json', 'blob'],
    // Ensure asset extensions handle images and fonts
    assetExts: [...defaultConfig.resolver.assetExts, 'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'ttf', 'otf'],
    // Force Metro to resolve react-native correctly
    extraNodeModules: {
      'react-native': require.resolve('react-native'),
    },
  },
  // Watch project root for changes
  watchFolders: [__dirname],
};

// Merge custom config with defaults
module.exports = mergeConfig(defaultConfig, config);