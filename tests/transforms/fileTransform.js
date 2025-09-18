/**
 * File Transform for Jest
 * Handles file imports (images, markdown, etc.) in tests
 */

import path from 'path'

export default {
  process(src, filename) {
    const assetFilename = JSON.stringify(path.basename(filename))

    if (filename.match(/\.svg$/)) {
      return {
        code: `
          const React = require('react');
          module.exports = {
            __esModule: true,
            default: ${assetFilename},
            ReactComponent: React.forwardRef(function SvgMock(props, ref) {
              return React.createElement('svg', {
                ...props,
                ref,
                'data-testid': 'svg-mock'
              });
            })
          };
        `
      }
    }

    return {
      code: `module.exports = ${assetFilename};`
    }
  }
}