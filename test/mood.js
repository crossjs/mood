define(function (require, exports) {

  'use strict';

  var Mood = require('../src/mood');

  QUnit.start();

  module('Module Mood');
  test('Mood', function() {
    ok(true, '');
    // notEqual( new Mood(), new Mood(), '' );
  });

});