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
