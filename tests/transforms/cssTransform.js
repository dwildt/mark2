/**
 * CSS Transform for Jest
 * Handles CSS imports in tests by returning empty object
 */

export default {
  process() {
    return {
      code: 'module.exports = {};'
    }
  }
}