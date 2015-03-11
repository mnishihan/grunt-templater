/**
 * Task: template
 * Description: copies a home page html file for the project dist directory
 * Dependencies: grunt, fs
 */

module.exports = function(grunt) {
  'use strict';

  var Promise = require('es6-promise').Promise;
  var consolidate = require('consolidate'),
      fs = require('fs'), path = require('path');

  // TODO: ditch this when grunt v0.4 is released
  grunt.util = grunt.util || grunt.utils;

  var _ = grunt.util._;

  var extensions = { 
    hbt: 'handlebars',
    hb: 'handlebars',
    handlebar: 'handlebars',
    hbs: 'handlebars',
    jt: 'jade',
    us: 'underscore',
    lqd: 'liquid',
    dst: 'dust',
    swg: 'swig',
    lqr: 'liquor',
    jqt: 'jqtpl',
    wskr: 'whiskers',
    hmlc: 'haml-coffee',
    hgn: 'hogan',
    tpld: 'templayed',
    ldsh: 'lodash',
    qejs: 'qejs',
    walr: 'walrus',
    mst: 'mustache',
    jst: 'just',
    ract: 'ractive'
  };

  var nonEngineMethods = ['clearCache'];

  var engines = _.chain(consolidate).methods();
  engines = engines.without.apply(engines, nonEngineMethods).value();
  _.extend(extensions,_.object(engines, engines));

  function getEngineOf(fileName) {
    var extension = _(fileName.match(/[^.]*$/)).last();
    return  _( _(extensions).keys() ).include(extension) ? extensions[extension] : false;
  }

  grunt.registerMultiTask('templater', 'Generates html files from vast range of templates identified by file extensions', function(){
    var config = this;
    var data = this.data;
    var options = this.options();

    var done = this.async();

    var hasFiles = !!this.data.files.length;
    var requiredAttributes = (hasFiles ? [] : [ 'src', 'dest' ]);

    requiredAttributes.forEach(function(attribute) {
      config.requiresConfig([ config.name, config.target, attribute].join('.'));
    });

    var vars = data.variables || options.variables || {};

    if (typeof vars === 'function' && vars.length == 0) {
        vars = vars();
    }

    var getTemplateVars = function(src){
      var templateVars = vars;
      // If the variables are dynamic, grab them
      if (typeof vars === 'function') {
        templateVars = vars(src);
      }

      if(options.partialPath){
        templateVars["renderPartial"] = getRenderFunction;  
      }
      return templateVars;
    }

    var getRenderFunction = function(src){
      var engine = data.engine || getEngineOf(src);
      if(options.partialPath){
        src = path.join(options.partialPath, src);
      }
      return consolidate[engine](src, getTemplateVars(src), function(err, html) {
        if (err) {
          grunt.log.error(err);
        }
      });
    }

    var compile = function compile(src, dest, vars) {
      var engine = data.engine || getEngineOf(src);
    
      return new Promise(function(resolve, reject) {
        if (!engine) {
          grunt.log.writeln("No compatable engine available");
          reject();
        }

        consolidate[engine](src, getTemplateVars(src), function(err, html) {
          if (err) {
            grunt.log.error(err);
            reject();
          }
          grunt.file.write(dest, html);
          grunt.log.ok("Compiled '" + src + "' to '"+ dest +"'");
          resolve();
        });

      });
    };


    var asyncCompiles;

    if (hasFiles) {
      asyncCompiles = this.files.map(function(file) {
        var src = file.src.filter(function(filepath) {
          // Warn on and remove invalid source files (if nonull was set).
          if (!grunt.file.exists(filepath)) {
            grunt.log.warn('Source file "' + filepath + '" not found.');
            return false;
          } else {
            return true;
          }
        })[0];
        return compile(src, file.dest, vars);
      });
    } else {
      asyncCompiles = [ compile(data.src, data.dest, vars) ];
    }

    Promise.all(asyncCompiles).then(function() {
      done(true);
    }).catch(function() {
      done(false);
    });

  });
};