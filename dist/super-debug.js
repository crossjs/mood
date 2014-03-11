define("crossjs/class/0.1.0/super-debug", [ "$-debug" ], function(require, exports, module) {
    /**
 * 类
 * @module Class
 */
    "use strict";
    var $ = require("$-debug");
    /**
 * 超类
 * 实现了事件订阅与类继承
 * @class Super
 * @constructor
 */
    var Super = function() {}, // Bridge for inherit
    Bridge = function() {};
    Super.uber = Super.prototype = {
        hasSuper: true,
        /**
   * 构造函数
   * @method __construct
   */
        __construct: function() {
            this.__eventList = {};
        },
        /**
   * 绑定事件，暂不支持命名空间
   * @method on
   * @param {String} event 事件名
   * @param {Function} callback 绑定回调函数
   * @return {Object} 当前实例
   */
        on: function(event, callback) {
            var eventList = this.__eventList, eventObject = {};
            if ($.isPlainObject(event)) {
                eventObject = event;
            } else {
                eventObject[event] = callback;
            }
            $.each(eventObject, function(event, callback) {
                if (eventList[event]) {
                    eventList[event].push(callback);
                } else {
                    eventList[event] = [ callback ];
                }
            });
            return this;
        },
        /**
   * 解除绑定的事件
   * @method off
   * @param {String} event 事件名
   * @param {Function} callback 绑定回调函数
   * @return {Object} 当前实例
   */
        off: function(event, callback) {
            var eventList = this.__eventList;
            if (eventList[event]) {
                if (typeof callback === "function") {
                    $.each(eventList[event], function(i, n) {
                        if (n === callback) {
                            eventList[event].splice(i, 1);
                        }
                    });
                } else {
                    delete eventList[event];
                }
            }
            return this;
        },
        /**
   * 触发绑定的事件
   * @method fire
   * @param {String} event 事件名
   * @return {Object} 当前实例
   */
        fire: function(event) {
            var eventList = this.__eventList, ctx = this, args = arguments;
            if (eventList[event]) {
                $.each(eventList[event], function(i, callback) {
                    callback.apply(ctx, args);
                });
            }
            return this;
        },
        /**
   * 扩展实例方法/属性
   * @method extend
   * @param {Object} obj1 实例方法集
   * @param {Object} [objN] 实例方法集
   * @return {Object} 当前实例
   */
        extend: function() {
            Array.prototype.unshift.call(arguments, true, this);
            $.extend.apply(null, arguments);
            return this;
        }
    };
    /**
 * 类继承
 * @param {Function} Child 子类
 * @param {Function} Parent 父类
 * @method Super.inherit
 * @static
 */
    Super.inherit = function(Child, Parent) {
        // 不使用`new Parent()`，以避免引入非原型方法/属性
        Bridge.prototype = Parent.prototype;
        Child.prototype = new Bridge();
        Child.uber = Parent.prototype;
        Child.prototype.constructor = Child;
    };
    return Super;
});
