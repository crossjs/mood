define(function (require, exports, module) {

/**
 * 表情投票
 * @module Mood
 */

'use strict';

var $ = require('$'),
  Core = require('./core');

var Handlebars = require('handlebars');
var template = require('./template.handlebars');

require('./default.css');

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
      'click .ue-mood-item': function (e) {
        var el = e.currentTarget;
        this.vote($(el).index());
      },
      'mouseover .ue-mood-smiley': function (e) {
        var el = e.currentTarget;
        el.originalSrc = el.src;
        el.src = el.attributes['data-mood-ani'].value;
      },
      'mouseout .ue-mood-smiley': function (e) {
        var el = e.currentTarget;
        el.src = el.originalSrc;
      }
    },
    moods: 'ZHUANQU',
    template: template,
    helpers: {
      helpers: {
        'ratio': function (value, total) {
          return value/total * 100 + '%';
        },
        'equal': function (value, value2, options) {
          return value === value2 ? options.fn(this) : options.inverse(this);
        }
      }
    }
  },

  setup: function () {

    // 调用 Core 的 setup
    Mood.superclass.setup.call(this);

    // 设置默认数据
    this.data({
      moods: Mood.PRESETS[this.option('moods')],
      total: 0,
      max: 0
    });

    this.on('load', function (e) {
      this.showInfo('数据加载中……');
    });

    this.on('vote', function (e) {
      this.showInfo('数据发送中……');
    });

    this.on('done', function (e, type, data) {
      if (type === 'load') {
        // 数据加载成功
        this.showInfo('数据加载成功');
        parseData.call(this, data.data);
        this.refresh();
      } else if (type === 'vote') {
        // 数据发送成功
        switch (data.flag) {

          case '1': // 1: 成功
            this.showInfo('投票成功，感谢你的参与');
            parseData.call(this, data.data);
            this.refresh();
            break;

          case '2': // 2：失败
            break;

          case '3': // 3：参数不全
            break;

          case '9':
            this.showInfo('您的IP今天已经投过票了, 感谢您的参与');
            break;
        }
      }
    });

    this.on('fail', function (e, type, data) {
      if (type === 'load') {
        this.showInfo('数据加载失败');
      } else if (type === 'vote') {
        this.showInfo('数据发送失败');
      }
    });

    this.load();
  },

  refresh: function () {
    if (!this.rendered) {
      this.render();
    }

    this.element.html(this.option('template')(this.data(), this.option('helpers')));

    this.hideInfo();
  },

  showInfo: function (info) {
    if (this.element) {
      this.element.find('.ue-mood-msgbox').text(info).fadeIn();
    } else {
      this.data('msg', info);
    }
  },

  hideInfo: function () {
    if (this.element) {
      this.element.find('.ue-mood-msgbox').fadeOut();
    } else {
      this.data('msg', '');
    }
  }

});

//data: '1#3438,2#411,3#156,4#98,5#200,6#95,7#434,8#19,9#0,10#0'
function parseData (data) {
  /*jshint validthis: true*/
  var arr = data.match(/\d+(?!#|\d)/g).slice(0, this.data('moods').length),
    total = 0;

  $.each(this.data('moods'), $.proxy(function (i, n) {
    total += (n.value = +arr[i]);
  }, this));

  this.data({
    total: total,
    max: Math.max.apply(null, arr)
  });
}

Mood.PRESETS = {
  ZHUANQU: [
    { name: '囧雷无比', img: 'http://ue1.17173.itc.cn/2009newsend/jiong_1.gif',     ani: 'http://ue1.17173.itc.cn/2009newsend/jiong_2.gif'     },
    { name: '酱油路过', img: 'http://i3.17173.itc.cn/2011/news/2011/05/19/jy1.gif', ani: 'http://i3.17173.itc.cn/2011/news/2011/05/19/jy2.gif' },
    { name: '保持关注', img: 'http://ue1.17173.itc.cn/2009newsend/guanzhu_1.gif',   ani: 'http://ue1.17173.itc.cn/2009newsend/guanzhu_2.gif'   },
    { name: '十分精彩', img: 'http://ue1.17173.itc.cn/2009newsend/se_1.gif',        ani: 'http://ue1.17173.itc.cn/2009newsend/se_2.gif'        },
    { name: '值得一看', img: 'http://ue1.17173.itc.cn/2009newsend/bucuo_1.gif',     ani: 'http://ue1.17173.itc.cn/2009newsend/bucuo_2.gif'     },
    { name: '怒发冲冠', img: 'http://i3.17173.itc.cn/2011/www/fl00.gif',            ani: 'http://i2.17173.itc.cn/2011/www/fl11.gif'            },
    { name: '不知所云', img: 'http://i3.17173.itc.cn/2011/www/yw00.gif',            ani: 'http://i2.17173.itc.cn/2011/www/yw11.gif'            }
  ],

  NEWS: [
    { name: '蛋疼', img: 'http://ue1.17173.itc.cn/2009newsend/2012/danteng-1.gif', ani: 'http://ue1.17173.itc.cn/2009newsend/2012/danteng-2.gif' },
    { name: '恶心', img: 'http://ue1.17173.itc.cn/2009newsend/tu_1.gif',           ani: 'http://ue1.17173.itc.cn/2009newsend/tu_2.gif'           },
    { name: '期待', img: 'http://ue1.17173.itc.cn/2009newsend/se_1.gif',           ani: 'http://ue1.17173.itc.cn/2009newsend/se_2.gif'           },
    { name: '难过', img: 'http://ue1.17173.itc.cn/2009newsend/ku_1.gif',           ani: 'http://ue1.17173.itc.cn/2009newsend/ku_2.gif'           },
    { name: '碉堡', img: 'http://ue1.17173.itc.cn/2009newsend/2012/diaobao-1.gif', ani: 'http://ue1.17173.itc.cn/2009newsend/2012/diaobao-2.gif' },
    { name: '关注', img: 'http://ue1.17173.itc.cn/2009newsend/guanzhu_1.gif',      ani: 'http://ue1.17173.itc.cn/2009newsend/guanzhu_2.gif'      },
    { name: '酱油', img: 'http://i3.17173.itc.cn/2011/news/2011/05/19/jy1.gif',    ani: 'http://i3.17173.itc.cn/2011/news/2011/05/19/jy2.gif'    },
    { name: '愤怒', img: 'http://ue1.17173.itc.cn/2009newsend/2012/fennu-1.gif',   ani: 'http://ue1.17173.itc.cn/2009newsend/2012/fennu-2.gif'   }
  ]
};

Mood.Core = Core;

// Mood.STATE = Core.STATE;

module.exports = Mood;

});
