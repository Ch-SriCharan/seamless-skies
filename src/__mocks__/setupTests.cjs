/**
 * Jest global setup — runs before each test file.
 * Polyfills TextEncoder/TextDecoder which react-router-dom v7 requires
 * but jsdom does not provide by default in older Node versions.
 */
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
