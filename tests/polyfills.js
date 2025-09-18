/**
 * Polyfills for Jest test environment
 */

// Polyfill for TextEncoder/TextDecoder in Node.js
import { TextEncoder, TextDecoder } from 'util'

// Set global polyfills before any modules are loaded
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Polyfill btoa/atob for older Node.js versions
if (typeof global.btoa === 'undefined') {
  global.btoa = (str) => Buffer.from(str, 'binary').toString('base64')
}

if (typeof global.atob === 'undefined') {
  global.atob = (str) => Buffer.from(str, 'base64').toString('binary')
}