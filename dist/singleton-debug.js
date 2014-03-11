define("crossjs/class/0.1.0/singleton-debug", [ "$-debug", "./super-debug" ], function(require, exports, module) {
    /**
 * 类
 * @module Class
 */
    "use strict";
    var $ = require("$-debug"), Super = require("./super-debug");
    /**
 * 单例类
 * @class Singleton
 * @extends Super
 * @param {Function} [Brood] 将要继承的父类（只继承其原型方法）
 * @param {Object} [Proto] 将要扩展的实例方法集
 * @return {function}
 * @constructor
 */
    var Singleton = function() {
        var args = arguments, Dummy, Proto, Brood, classInstance, classPlugins = {};
        switch (args.length) {
          case 2:
            if (typeof args[0] === "function") {
                Brood = args[0];
            }
            if ($.isPlainObject(args[1])) {
                Proto = args[1];
            }
            break;

          case 1:
            if (typeof args[0] === "function") {
                Brood = args[0];
            } else if ($.isPlainObject(args[0])) {
                Proto = args[0];
            }
            break;
        }
        Dummy = function() {
            if (classInstance) {
                return classInstance;
            }
            classInstance = this;
            var args = Array.prototype.slice.call(arguments, 0), callparent = function(ctx, obj, prop) {
                if (obj && obj.hasOwnProperty(prop)) {
                    // 递归执行callparent
                    callparent(ctx, obj.constructor.uber, prop);
                    obj[prop].apply(ctx, args);
                }
            };
            // call parents' __construct
            // `Child's uber linked to Parent's prototype`
            callparent(this, Dummy.uber, "__construct");
            // call __construct
            if (Dummy.prototype.hasOwnProperty("__construct") && typeof this.__construct === "function") {
                this.__construct.apply(this, args);
            }
            // load __plugins
            $.each(classPlugins, $.proxy(function(n, func) {
                func.apply(this, args);
            }, this));
        };
        /**
   * 为当前类添加插件
   * @method addPlugins
   * @static
   * @param  {Object} plugins 插件
   * @return {Function} 当前类
   */
        Dummy.addPlugins = function(plugins) {
            $.extend(classPlugins, plugins);
            return Dummy;
        };
        // make sure Classes inherited from Super or Super's sub-classes
        if (typeof Brood !== "function") {
            Brood = Super;
        } else if (!$.isPlainObject(Brood.uber) || !Brood.uber.hasSuper) {
            Super.inherit(Brood, Super);
        }
        Super.inherit(Dummy, Brood);
        if ($.isPlainObject(Proto)) {
            $.extend(Dummy.prototype, Proto);
        }
        return Dummy;
    };
    return Singleton;
});
