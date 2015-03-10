# grunt-templater

Universal template compiler task for Grunt. It uses [Consolidate](https://github.com/visionmedia/consolidate.js) under the hood.

## Supported template engines

  - [atpl](https://github.com/soywiz/atpl.js)
  - [doT.js](https://github.com/olado/doT) [(website)](http://olado.github.io/doT/)
  - [dust (unmaintained)](https://github.com/akdubya/dustjs) [(website)](http://akdubya.github.com/dustjs/)
  - [dustjs-linkedin (maintained fork of dust)](https://github.com/linkedin/dustjs) [(website)](http://linkedin.github.io/dustjs/)
  - [eco](https://github.com/sstephenson/eco)
  - [ect](https://github.com/baryshev/ect) [(website)](http://ectjs.com/)
  - [ejs](https://github.com/visionmedia/ejs)
  - [haml](https://github.com/visionmedia/haml.js) [(website)](http://haml-lang.com/)
  - [haml-coffee](https://github.com/9elements/haml-coffee) [(website)](http://haml-lang.com/)
  - [hamlet](https://github.com/gregwebs/hamlet.js)
  - [handlebars](https://github.com/wycats/handlebars.js/) [(website)](http://handlebarsjs.com/)
  - [hogan](https://github.com/twitter/hogan.js) [(website)](http://twitter.github.com/hogan.js/)
  - [htmling](https://github.com/codemix/htmling)
  - [jade](https://github.com/visionmedia/jade) [(website)](http://jade-lang.com/)
  - [jazz](https://github.com/shinetech/jazz)
  - [jqtpl](https://github.com/kof/node-jqtpl) [(website)](http://api.jquery.com/category/plugins/templates/)
  - [JUST](https://github.com/baryshev/just)
  - [liquor](https://github.com/chjj/liquor)
  - [lodash](https://github.com/bestiejs/lodash) [(website)](http://lodash.com/)
  - [mote](https://github.com/satchmorun/mote) [(website)](http://satchmorun.github.io/mote/)
  - [mustache](https://github.com/janl/mustache.js)
  - [nunjucks](https://github.com/mozilla/nunjucks) [(website)](https://mozilla.github.io/nunjucks)
  - [QEJS](https://github.com/jepso/QEJS)
  - [ractive](https://github.com/Rich-Harris/Ractive)
  - [swig](https://github.com/paularmstrong/swig) [(website)](http://paularmstrong.github.com/swig/)
  - [templayed](http://archan937.github.com/templayed.js/)
  - [liquid](https://github.com/leizongmin/tinyliquid) [(website)](http://liquidmarkup.org/)
  - [toffee](https://github.com/malgorithms/toffee)
  - [underscore](https://github.com/documentcloud/underscore) [(website)](http://documentcloud.github.com/underscore/)
  - [walrus](https://github.com/jeremyruppel/walrus) [(website)](http://documentup.com/jeremyruppel/walrus/)
  - [whiskers](https://github.com/gsf/whiskers.js)
  - any future template engine supported by [Consolidate](https://github.com/visionmedia/consolidate.js) in future :-)

__NOTE__: you must still install the engines you wish to use, add them to your package.json dependencies.

## Getting Started

install via npm

    npm install grunt-templater

install the template engine you intend to use. For example, if using Jade:

    npm install jade

and in your grunt.js file:

    grunt.loadNpmTasks('grunt-templater');

## Usage

Create a `templater` task in your grunt config. Templater will guess the intended template engine based on the `src` filename. Pass the `engine` option to force a specific engine.

When using the [Grunt file format](http://gruntjs.com/configuring-tasks#files), `variables` is required:

    grunt.initConfig({
      templater: {
        all: {
          files: [{
            expand: true,
            cwd: 'source',
            src: [ '**/*.hbs' ],
            dest: 'build',
            ext: '.html'
          }],
          variables: {
            env: environment
          }
        }
      }
    });

To remain backwards compatible, `src`, `dest` can be used to define files aswell:

    grunt.initConfig({
      templater: {
        dev: {
          src: 'app/homepage.jade',
          dest: 'dev.html',
          variables: {
            css_url: 'app.css'
            title: 'Hello World'
            pretty: true
          }
        },
        dist: {
          src: 'app/homepage.jade',
          dest: 'dist/index.html',
          variables: {
            css_url: 'app.min.css'
            title: 'Hello Production'
          }
        },
        dynamicVariables: {
          src: 'app/homepage.jade',
          dest: 'dist/index.html',
          variables: function (src, dest) {
            return {
              css: grunt.file.read('app.min.css'),
              now: new Date()
            }
          }
        }
      },
      ...
    });

run with:

    grunt templater

or for a specific target:

    grunt templater:dev

Engine specific options can also be passed through the `variables` option. In the case of Jade, `pretty: true` adds pretty-indentation whitespace to its output.