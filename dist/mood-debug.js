define("pandora/mood/1.0.0/mood-debug", [ "$-debug", "./core-debug", "pandora/widget/1.0.0/widget-debug", "pandora/class/1.0.0/class-debug", "pandora/events/1.0.0/events-debug", "pandora/widget/1.0.0/aspect-debug", "gallery/handlebars/1.0.2/runtime-debug", "./template-debug.handlebars", "./default-debug.css" ], function(require, exports, module) {
    /**
 * 表情投票
 * @module Mood
 */
    "use strict";
    var $ = require("$-debug"), Core = require("./core-debug");
    var Handlebars = require("gallery/handlebars/1.0.2/runtime-debug");
    var template = require("./template-debug.handlebars");
    require("./default-debug.css");
    /**
 * 表现层类
 *
 * @class Mood
 * @constructor
 *
 * @example
 * ```
 * var mood = new Mood({
 *   container: $('<div/>').appendTo('body'),
 *   channelId: '10009',
 *   webId: '2814902',
 *   kindId: '1',
 *   moods: 'NEWS'
 * });
 * ```
 */
    var Mood = Core.extend({
        /**
   * 默认参数
   *
   * @property {Object} defaults 默认参数
   * @type {Object}
   */
        defaults: {
            element: '<div class="ue-component ue-mood"/>',
            delegates: {
                "click .ue-mood-item": function(e) {
                    var el = e.currentTarget;
                    this.vote($(el).index());
                },
                "mouseover .ue-mood-smiley": function(e) {
                    var el = e.currentTarget;
                    el.originalSrc = el.src;
                    el.src = el.attributes["data-mood-ani"].value;
                },
                "mouseout .ue-mood-smiley": function(e) {
                    var el = e.currentTarget;
                    el.src = el.originalSrc;
                }
            },
            moods: "ZHUANQU",
            template: template,
            helpers: {
                helpers: {
                    ratio: function(value, total) {
                        return value / total * 100 + "%";
                    },
                    equal: function(value, value2, options) {
                        return value === value2 ? options.fn(this) : options.inverse(this);
                    }
                }
            }
        },
        setup: function() {
            // 调用 Core 的 setup
            Mood.superclass.setup.call(this);
            // 设置默认数据
            this.data({
                moods: Mood.PRESETS[this.option("moods")],
                total: 0,
                max: 0
            });
            this.on("load", function(e) {
                this.showInfo("数据加载中……");
            });
            this.on("vote", function(e) {
                this.showInfo("数据发送中……");
            });
            this.on("done", function(e, type, data) {
                if (type === "load") {
                    // 数据加载成功
                    this.showInfo("数据加载成功");
                    parseData.call(this, data.data);
                    this.refresh();
                } else if (type === "vote") {
                    // 数据发送成功
                    switch (data.flag) {
                      case "1":
                        // 1: 成功
                        this.showInfo("投票成功，感谢你的参与");
                        parseData.call(this, data.data);
                        this.refresh();
                        break;

                      case "2":
                        // 2：失败
                        break;

                      case "3":
                        // 3：参数不全
                        break;

                      case "9":
                        this.showInfo("您的IP今天已经投过票了, 感谢您的参与");
                        break;
                    }
                }
            });
            this.on("fail", function(e, type, data) {
                if (type === "load") {
                    this.showInfo("数据加载失败");
                } else if (type === "vote") {
                    this.showInfo("数据发送失败");
                }
            });
            this.load();
        },
        refresh: function() {
            if (!this.rendered) {
                this.render();
            }
            this.element.html(this.option("template")(this.data(), this.option("helpers")));
            this.hideInfo();
        },
        showInfo: function(info) {
            if (this.element) {
                this.element.find(".ue-mood-msgbox").text(info).fadeIn();
            } else {
                this.data("msg", info);
            }
        },
        hideInfo: function() {
            if (this.element) {
                this.element.find(".ue-mood-msgbox").fadeOut();
            } else {
                this.data("msg", "");
            }
        }
    });
    //data: '1#3438,2#411,3#156,4#98,5#200,6#95,7#434,8#19,9#0,10#0'
    function parseData(data) {
        /*jshint validthis: true*/
        var arr = data.match(/\d+(?!#|\d)/g).slice(0, this.data("moods").length), total = 0;
        $.each(this.data("moods"), $.proxy(function(i, n) {
            total += n.value = +arr[i];
        }, this));
        this.data({
            total: total,
            max: Math.max.apply(null, arr)
        });
    }
    Mood.PRESETS = {
        ZHUANQU: [ {
            name: "囧雷无比",
            img: "http://ue1.17173.itc.cn/2009newsend/jiong_1.gif",
            ani: "http://ue1.17173.itc.cn/2009newsend/jiong_2.gif"
        }, {
            name: "酱油路过",
            img: "http://i3.17173.itc.cn/2011/news/2011/05/19/jy1.gif",
            ani: "http://i3.17173.itc.cn/2011/news/2011/05/19/jy2.gif"
        }, {
            name: "保持关注",
            img: "http://ue1.17173.itc.cn/2009newsend/guanzhu_1.gif",
            ani: "http://ue1.17173.itc.cn/2009newsend/guanzhu_2.gif"
        }, {
            name: "十分精彩",
            img: "http://ue1.17173.itc.cn/2009newsend/se_1.gif",
            ani: "http://ue1.17173.itc.cn/2009newsend/se_2.gif"
        }, {
            name: "值得一看",
            img: "http://ue1.17173.itc.cn/2009newsend/bucuo_1.gif",
            ani: "http://ue1.17173.itc.cn/2009newsend/bucuo_2.gif"
        }, {
            name: "怒发冲冠",
            img: "http://i3.17173.itc.cn/2011/www/fl00.gif",
            ani: "http://i2.17173.itc.cn/2011/www/fl11.gif"
        }, {
            name: "不知所云",
            img: "http://i3.17173.itc.cn/2011/www/yw00.gif",
            ani: "http://i2.17173.itc.cn/2011/www/yw11.gif"
        } ],
        NEWS: [ {
            name: "蛋疼",
            img: "http://ue1.17173.itc.cn/2009newsend/2012/danteng-1.gif",
            ani: "http://ue1.17173.itc.cn/2009newsend/2012/danteng-2.gif"
        }, {
            name: "恶心",
            img: "http://ue1.17173.itc.cn/2009newsend/tu_1.gif",
            ani: "http://ue1.17173.itc.cn/2009newsend/tu_2.gif"
        }, {
            name: "期待",
            img: "http://ue1.17173.itc.cn/2009newsend/se_1.gif",
            ani: "http://ue1.17173.itc.cn/2009newsend/se_2.gif"
        }, {
            name: "难过",
            img: "http://ue1.17173.itc.cn/2009newsend/ku_1.gif",
            ani: "http://ue1.17173.itc.cn/2009newsend/ku_2.gif"
        }, {
            name: "碉堡",
            img: "http://ue1.17173.itc.cn/2009newsend/2012/diaobao-1.gif",
            ani: "http://ue1.17173.itc.cn/2009newsend/2012/diaobao-2.gif"
        }, {
            name: "关注",
            img: "http://ue1.17173.itc.cn/2009newsend/guanzhu_1.gif",
            ani: "http://ue1.17173.itc.cn/2009newsend/guanzhu_2.gif"
        }, {
            name: "酱油",
            img: "http://i3.17173.itc.cn/2011/news/2011/05/19/jy1.gif",
            ani: "http://i3.17173.itc.cn/2011/news/2011/05/19/jy2.gif"
        }, {
            name: "愤怒",
            img: "http://ue1.17173.itc.cn/2009newsend/2012/fennu-1.gif",
            ani: "http://ue1.17173.itc.cn/2009newsend/2012/fennu-2.gif"
        } ]
    };
    Mood.Core = Core;
    // Mood.STATE = Core.STATE;
    module.exports = Mood;
});

define("pandora/mood/1.0.0/core-debug", [ "$-debug", "pandora/widget/1.0.0/widget-debug", "pandora/class/1.0.0/class-debug", "pandora/events/1.0.0/events-debug", "pandora/widget/1.0.0/aspect-debug" ], function(require, exports, module) {
    /**
 * 表情投票
 *
 * @module Mood
 */
    "use strict";
    var $ = require("$-debug"), Widget = require("pandora/widget/1.0.0/widget-debug");
    /**
 * 数据层类
 *
 * @class Core
 * @constructor
 */
    var Core = Widget.extend({
        setup: function() {
            // 设置后端接口参数
            this.data("params", {
                channel: this.option("channelId"),
                web_id: this.option("webId"),
                // 拷贝自V2
                // TODO: 做一个从CMS kindId到hits系统kind的映射, 因为并不完全一一对应
                kind: this.option("kindId")
            });
            // 初始化状态
            this.state(Core.STATE.NORMAL);
        },
        load: function() {
            var self = this, params = $.extend({
                action: "0"
            }, this.data("params"));
            this.fire("load");
            this.state(Core.STATE.RECEIVING);
            bridge.call(this, params, function(data, xhr) {
                self.fire("done", "load", data);
            }, function(xhr, error) {
                self.fire("fail", "load", error);
            });
        },
        vote: function(index) {
            var self = this, params = $.extend({
                action: "1",
                mood: index + 1
            }, this.data("params"));
            this.fire("vote");
            this.state(Core.STATE.SENDING);
            bridge.call(this, params, function(data, xhr) {
                self.fire("done", "vote", data);
            }, function(xhr, error) {
                self.fire("fail", "vote", error);
            });
        }
    });
    function bridge(params, done, fail) {
        $.getJSON(Core.URL, params).done(done).fail(fail);
    }
    Core.STATE = {
        ERROR: -1,
        NORMAL: 0,
        RECEIVING: 1,
        SENDING: 2
    };
    Core.URL = "http://hits.17173.com/mood/mood_opb.php?jsonp=?";
    module.exports = Core;
});

define("pandora/mood/1.0.0/template-debug.handlebars", [ "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.0.2/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 3, ">= 1.0.0-rc.4" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var buffer = "", stack1, options, functionType = "function", escapeExpression = this.escapeExpression, helperMissing = helpers.helperMissing, self = this, blockHelperMissing = helpers.blockHelperMissing;
        function program1(depth0, data, depth1) {
            var buffer = "", stack1, stack2, options;
            buffer += '\r\n      <td class="ue-mood-item" align="center">\r\n        <span class="value">';
            if (stack1 = helpers.value) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.value;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '</span>\r\n        <div class="rect-wrapper">\r\n          <img class="rect" width="31" height="';
            options = {
                hash: {},
                data: data
            };
            buffer += escapeExpression((stack1 = helpers.ratio, stack1 ? stack1.call(depth0, depth0.value, depth1.total, options) : helperMissing.call(depth0, "ratio", depth0.value, depth1.total, options))) + '" src="http://ue2.17173.itc.cn/images/lib/v2/mood-1.0/default-rect-';
            options = {
                hash: {},
                inverse: self.program(4, program4, data),
                fn: self.program(2, program2, data),
                data: data
            };
            stack2 = (stack1 = helpers.equal, stack1 ? stack1.call(depth0, depth0.value, depth1.max, options) : helperMissing.call(depth0, "equal", depth0.value, depth1.max, options));
            if (stack2 || stack2 === 0) {
                buffer += stack2;
            }
            buffer += '.gif">\r\n        </div>\r\n        <img class="ue-mood-smiley" src="';
            if (stack2 = helpers.img) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.img;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '" data-mood-ani="';
            if (stack2 = helpers.ani) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.ani;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '">\r\n        <div>';
            if (stack2 = helpers.name) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.name;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + "</div>\r\n      </td>\r\n    ";
            return buffer;
        }
        function program2(depth0, data) {
            return "max";
        }
        function program4(depth0, data) {
            return "normal";
        }
        buffer += '<div class="mood-ui-default">\r\n  <div class="ue-mood-msgbox">';
        if (stack1 = helpers.msg) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.msg;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '</div>\r\n  <table>\r\n    <caption class="ue-mood-total">';
        if (stack1 = helpers.total) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.total;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + "</caption>\r\n    <tr>\r\n    ";
        options = {
            hash: {},
            inverse: self.noop,
            fn: self.programWithDepth(1, program1, data, depth0),
            data: data
        };
        if (stack1 = helpers.moods) {
            stack1 = stack1.call(depth0, options);
        } else {
            stack1 = depth0.moods;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        if (!helpers.moods) {
            stack1 = blockHelperMissing.call(depth0, stack1, options);
        }
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\r\n    </tr>\r\n  </table>\r\n</div>";
        return buffer;
    });
});

define("pandora/mood/1.0.0/default-debug.css", [], function() {
    seajs.importStyle('.mood-ui-default{font-size:14px;font-family:Arial,"宋体"}.mood-ui-default .total{color:red;font-weight:700}.mood-ui-default td{font-size:14px;color:#2b2b2b}.mood-ui-default .rect-wrapper{position:relative;height:70px;width:33px;overflow:hidden;border:1px solid #ccc;background-color:#f7f7f7}.mood-ui-default .rect{position:absolute;bottom:1px;left:1px}.mood-ui-default .ue-mood-smiley{cursor:pointer}.mood-ui-default .msgbox{font-size:12px;color:gray;width:220px;height:20px;padding:40px;text-align:center;line-height:20px;background-color:#fff;border:1px solid gray;position:absolute;z-index:100}');
});
