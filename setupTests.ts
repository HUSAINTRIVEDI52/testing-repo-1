// setupTests.ts
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
// Add the window.matchMedia mock here
window.matchMedia =
    window.matchMedia ||
    function () {
        return {
            matches: false,
            addListener: function () { },
            removeListener: function () { },
        };
    };
// Add the TextEncoder and TextDecoder polyfills here
global.TextEncoder = TextEncoder;
// global.TextDecoder = TextDecoder;