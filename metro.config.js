const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Necessário a partir do Expo SDK 53+: o Metro passou a seguir estritamente
// o campo "exports" do package.json de cada pacote, o que quebra a
// importação `firebase/auth/react-native` usada pelo Firebase JS SDK.
// Desativando isso, o Metro volta a resolver esse caminho normalmente.
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
