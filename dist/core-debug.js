define("pandora/mood/1.0.0/core-debug", [ "$-debug", "pandora/widget/1.0.0/widget-debug", "pandora/class/1.0.0/class-debug", "pandora/events/1.0.0/events-debug", "pandora/widget/1.0.0/aspect-debug" ], function(require, exports, module) {
    /**
 * 表情投票
 * @module Mood
 */
    "use strict";
    var $ = require("$-debug"), Widget = require("pandora/widget/1.0.0/widget-debug");
    /**
 * 表情投票
 */
    var Core = Widget.extend({
        setup: function() {
            // 后端接口参数
            this.params = {
                channel: this.options.channelId,
                web_id: this.options.webId,
                // 拷贝自V2
                // TODO: 做一个从CMS kindId到hits系统kind的映射, 因为并不完全一一对应
                kind: this.options.kindId
            };
            // 初始化状态
            this.state(Core.STATE.NORMAL);
        },
        load: function() {
            var params = $.extend({
                action: "0"
            }, this.params);
            this.state(Core.STATE.RECEIVING);
            loadAPI.call(this, params, $.proxy(this.done, this), $.proxy(this.fail, this));
        },
        vote: function(index) {
            var params = $.extend({
                action: "1",
                mood: index + 1
            }, this.params);
            this.state(Core.STATE.SENDING);
            loadAPI.call(this, params, $.proxy(this.done, this), $.proxy(this.fail, this));
        },
        done: function(data, xhr) {
            this.state(Core.STATE.NORMAL);
            if ("console" in window) {
                console.log("MOOD AJAX DONE: %O ", data);
            }
        },
        fail: function(xhr, error) {
            this.state(Core.STATE.ERROR);
            if ("console" in window) {
                console.log("MOOD AJAX ERROR: %s ", error);
            }
        }
    });
    function loadAPI(params, done, fail) {
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
