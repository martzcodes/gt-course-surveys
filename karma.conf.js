'use strict';

function karmaConfig(config) {
    config.set({
        autoWatch : false,
        frameworks: [
            'jasmine'
        ],
        browsers : [
            'PhantomJS'
        ],
        plugins : [
            'karma-phantomjs-launcher',
            'karma-jasmine'
        ]
    });
}

module.exports = karmaConfig;
