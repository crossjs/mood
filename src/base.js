define(function (require, exports, module) {

/**
 * 组件基础类
 * @module Base
 */

'use strict';

var /*$ = require('$'),*/
  Class = require('class'),
  Events = require('events');

/**
 * 组件基础类
 *
 * 实现自动事件订阅
 * @class Base
 * @constructor
 * @example
 * ```
 * var Widget = Base.extend({
 *   __construct: function (name, age) {
 *     this.name = name;
 *     this.age = age;
 *   }
 * });
 * var tom = new Student('Tom', 21, 'MIT');
 * // now:
 * // tom.name === 'Tom';
 * // tom.age === 21;
 * // tom.school === 'MIT';
 * ```
 */
var Base = Class.create(Events.prototype, {

  __construct: function (options) {
    console.log(options);
    this.options = options || {};

    this.initEvents();
  },

  render: function () {
    // this.element
  },

  setup: function () {
    this.UI = {
      'default': {}
    };
  },

  initEvents: function () {
    this.options.events && this.on(this.options.events);
  }

});

return Base;

});
