'use strict';

describe('', function() {

  var module;
  var dependencies;
  dependencies = [];

  var hasModule = function(module) {
  return dependencies.indexOf(module) >= 0;
  };

  beforeEach(function() {

  // Get module
  module = angular.module('slpaVideoPlayer');
  dependencies = module.requires;
  });

  it('should load config module', function() {
    expect(hasModule('slpaVideoPlayer.config')).to.be.ok;
  });

  
  it('should load filters module', function() {
    expect(hasModule('slpaVideoPlayer.filters')).to.be.ok;
  });
  

  
  it('should load directives module', function() {
    expect(hasModule('slpaVideoPlayer.directives')).to.be.ok;
  });
  

  
  it('should load services module', function() {
    expect(hasModule('slpaVideoPlayer.services')).to.be.ok;
  });
  

});