define(function (require, exports) {

  'use strict';

  var Base = require('../src/base');

  QUnit.start();

  module('Module Base');
  test('Base', function() {
    notEqual( new Base(), new Base(), '' );
  });

  module('Module Construct');
  test('Construct', function() {
    var BaseA = Base.extend({
      __construct: function (x) {
        this.x = x;
      }
    });
    equal( new BaseA(2).x, 2, '' );
  });

  module('Module Events');
  test('Events', function() {
    var instance = new Base({
      events:{
        test: function (e, t) {
          this.t = t;
          this.e = e;
        }
      }
    });
    instance.fire('test', '2');
    equal( instance.e, 'test', '' );
    equal( instance.t, '2', '' );
    instance.off('test', '2');
    instance.fire('test', '4');
    equal( instance.t, '2', '' );
  });
  test('Events', function() {
    var instance = new Base();
    instance.on('test', function (e, t) {
      this.t = t;
      this.e = e;
    });
    instance.fire('test', '2');
    equal( instance.e, 'test', '' );
    equal( instance.t, '2', '' );
    instance.off('test', '2');
    instance.fire('test', '4');
    equal( instance.t, '2', '' );
  });
  test('Events', function() {
    var instance = new Base();
    instance.on({
      test: function (e, t) {
        this.t = t;
        this.e = e;
      }
    });
    instance.fire('test', '2');
    equal( instance.e, 'test', '' );
    equal( instance.t, '2', '' );
    instance.off('test', '2');
    instance.fire('test', '4');
    equal( instance.t, '2', '' );
  });

});