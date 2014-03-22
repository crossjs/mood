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

var defaults = {
  element: '<div class="ue-component ue-mood"/>',
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
};

/**
 * 表情投票
 */
var Mood = Core.extend({

  setup: function () {

    Mood.superclass.setup.call(this);

    $.extend(this.options, defaults, {
      data: {
        moods: Mood.PRESETS[this.options.moods || 'ZHUANQU'],
        total: 0,
        max: 0
      }
    });

    this.init();

    this.render();

    this.load();
  },

  init: function () {
    this.after('render', function (e) {
      var self = this;
      this.element
        .on('click', '.ue-mood-item', function () {
          self.vote($(this).index());
        })
        .on('mouseover', '.ue-mood-smiley', function () {
          this.originalSrc = this.src;
          this.src = this.attributes['data-mood-ani'].value;
        })
        .on('mouseout', '.ue-mood-smiley', function () {
          this.src = this.originalSrc;
        });
    });

    this.after('state', function (e, result, state) {
      switch (state) {
        case Core.STATE.ERROR:
          this.showInfo('请求失败');
          break;
        case Core.STATE.NORMAL:
          this.hideInfo();
          break;
        case Core.STATE.RECEIVING:
          this.showInfo('数据加载中……');
          break;
        case Core.STATE.SENDING:
          this.showInfo('数据发送中……');
          break;
      }
    });

    this.after('done', function (e, result, data) {
      switch (data.flag) {

        case '1':
          // 1: 成功
          parseData.call(this, data.data);
          this.refresh();
          break;

        case '2':
          // 2：失败
          break;

        case '3':
          // 3：参数不全
          break;

        case '9':
          this.showInfo('您的IP今天已经投过票了, 感谢您的参与');
          break;
      }
    });
  },

  refresh: function () {
    this.element.html(this.options.template(this.options.data, this.options.helpers));
  },

  showInfo: function (info) {
    if (this.element) {
      this.element.find('.ue-mood-msgbox').text(info).fadeIn();
    } else {
      this.options.data.msg = info;
    }
  },

  hideInfo: function () {
    if (this.element) {
      this.element.find('.ue-mood-msgbox').fadeOut();
    } else {
      this.options.data.msg = '';
    }
  }

});

function parseData (data) {
  /*jshint validthis: true*/
  // '1#3438,2#411,3#156,4#98,5#200,6#95,7#434,8#19,9#0,10#0'
  var options = this.options,
    arr = data.match(/\d+(?!#|\d)/g).slice(0, options.data.moods.length),
    total = 0;

  $.each(options.data.moods, $.proxy(function (i, n) {
    total += (n.value = +arr[i]);
  }, this));

  options.data.total = total;

  options.data.max = Math.max.apply(null, arr);
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

Mood.STATE = Core.STATE;

module.exports = Mood;

});
