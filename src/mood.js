define(function(require, exports, module) {

  /**
   * 表情投票
   * @module Mood
   */

  'use strict';

  var $ = require('$'),
    Tips = require('tips');

  var Core = require('./core');

  // 样式表
  var importStyle = require('./mood.css'),
    styleImported;

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
     * @property {object} defaults 默认参数
     * @type {object}
     */
    defaults: {
      classPrefix: 'ue-component ue-mood',
      container: null,
      // element: '<div class="ue-component ue-mood"/>',
      delegates: {
        'click [data-role=item]': function(e) {
          if (!this.disabled) {
            this.vote($(e.currentTarget).data('index'));
          }
        },
        'mouseover [data-role=item]': function(e) {
          var el = e.currentTarget;
          $(el).find('[data-role=smiley]')
            .attr('src',
              this.data('moods')[$(el).data('index')]['ani']);
        },
        'mouseout [data-role=item]': function(e) {
          var el = e.currentTarget;
          $(el).find('[data-role=smiley]')
            .attr('src',
              this.data('moods')[$(el).data('index')]['img']);
        }
      },
      importStyle: true,
      moods: 'ZHUANQU',
      template: require('./mood.handlebars')
    },

    setup: function() {
      // 调用 Core 的 setup
      Mood.superclass.setup.apply(this);

      if (this.option('importStyle') && !styleImported) {
        importStyle();
        styleImported = true;
      }

      // 设置默认数据
      this.data({
        moods: Mood.PRESETS[this.option('moods')],
        total: 0,
        max: 0,
        type: this.option('moods') === 'NEWS' ? '新闻' : '文章'
      });

      // this.on('load', function(e) {
      //   this.showTip('数据加载中……');
      // });

      this.on('vote', function(e) {
        this.showTip('数据发送中……');
      });

      this.on('done', function(e, type, data) {
        if (type === 'load') {
          // 数据加载成功
          // this.showTip('数据加载成功');
          this.parseData(data.data);
          this.render();
        } else if (type === 'vote') {
          // 数据发送成功
          switch (data.flag) {

            case '1': // 1: 成功
              this.showTip('投票成功，感谢你的参与');
              this.parseData(data.data);
              this.render();
              break;

            case '2': // 2：失败
              break;

            case '3': // 3：参数不全
              break;

            case '9':
              this.showTip('您的IP今天已经投过票了, 感谢您的参与');
              this.disabled = true;
              break;
          }
        }
      });

      this.on('fail', function(e, type, data) {
        if (type === 'load') {
          this.showTip('数据加载失败');
        } else if (type === 'vote') {
          this.showTip('数据发送失败');
        }
      });

      this.load();
    },

    // data: '1#3438,2#411,3#156,4#98,5#200,6#95,7#434,8#19,9#0,10#0'
    parseData: function(data) {
      var moods = this.data('moods'),
        n = moods.length,
        // 只取前 N 个
        arr = data.match(/\d+(?!#|\d)/g).slice(0, n),
        max = Math.max.apply(null, arr),
        total = 0;

      while (n--) {
        if (+arr[n] === max) {
          moods[n].isMax = true;
        }

        total += (moods[n].value = +arr[n]);
      }

      n = moods.length;

      // 取高度百分比
      while (n--) {
        moods[n].percent = moods[n].value / total * 100 + '%';
      }

      this.data({
        total: total,
        max: max
      });
    },

    showTip: function(info) {
      new Tips({
        baseElement: this.element,
        content: info,
        css: {
          position: 'absolute'
        },
        // 引入 dialog 样式
        importStyle: true
      });
    }

  });

  Mood.PRESETS = {
    ZHUANQU: [{
      name: '囧雷无比',
      img: 'http://ue1.17173.itc.cn/2009newsend/jiong_1.gif',
      ani: 'http://ue1.17173.itc.cn/2009newsend/jiong_2.gif'
    }, {
      name: '酱油路过',
      img: 'http://i3.17173.itc.cn/2011/news/2011/05/19/jy1.gif',
      ani: 'http://i3.17173.itc.cn/2011/news/2011/05/19/jy2.gif'
    }, {
      name: '保持关注',
      img: 'http://ue1.17173.itc.cn/2009newsend/guanzhu_1.gif',
      ani: 'http://ue1.17173.itc.cn/2009newsend/guanzhu_2.gif'
    }, {
      name: '十分精彩',
      img: 'http://ue1.17173.itc.cn/2009newsend/se_1.gif',
      ani: 'http://ue1.17173.itc.cn/2009newsend/se_2.gif'
    }, {
      name: '值得一看',
      img: 'http://ue1.17173.itc.cn/2009newsend/bucuo_1.gif',
      ani: 'http://ue1.17173.itc.cn/2009newsend/bucuo_2.gif'
    }, {
      name: '怒发冲冠',
      img: 'http://i3.17173.itc.cn/2011/www/fl00.gif',
      ani: 'http://i2.17173.itc.cn/2011/www/fl11.gif'
    }, {
      name: '不知所云',
      img: 'http://i3.17173.itc.cn/2011/www/yw00.gif',
      ani: 'http://i2.17173.itc.cn/2011/www/yw11.gif'
    }],

    NEWS: [{
      name: '蛋疼',
      img: 'http://ue1.17173.itc.cn/2009newsend/2012/danteng-1.gif',
      ani: 'http://ue1.17173.itc.cn/2009newsend/2012/danteng-2.gif'
    }, {
      name: '恶心',
      img: 'http://ue1.17173.itc.cn/2009newsend/tu_1.gif',
      ani: 'http://ue1.17173.itc.cn/2009newsend/tu_2.gif'
    }, {
      name: '期待',
      img: 'http://ue1.17173.itc.cn/2009newsend/se_1.gif',
      ani: 'http://ue1.17173.itc.cn/2009newsend/se_2.gif'
    }, {
      name: '难过',
      img: 'http://ue1.17173.itc.cn/2009newsend/ku_1.gif',
      ani: 'http://ue1.17173.itc.cn/2009newsend/ku_2.gif'
    }, {
      name: '碉堡',
      img: 'http://ue1.17173.itc.cn/2009newsend/2012/diaobao-1.gif',
      ani: 'http://ue1.17173.itc.cn/2009newsend/2012/diaobao-2.gif'
    }, {
      name: '关注',
      img: 'http://ue1.17173.itc.cn/2009newsend/guanzhu_1.gif',
      ani: 'http://ue1.17173.itc.cn/2009newsend/guanzhu_2.gif'
    }, {
      name: '酱油',
      img: 'http://i3.17173.itc.cn/2011/news/2011/05/19/jy1.gif',
      ani: 'http://i3.17173.itc.cn/2011/news/2011/05/19/jy2.gif'
    }, {
      name: '愤怒',
      img: 'http://ue1.17173.itc.cn/2009newsend/2012/fennu-1.gif',
      ani: 'http://ue1.17173.itc.cn/2009newsend/2012/fennu-2.gif'
    }]
  };

  Mood.Core = Core;

  module.exports = Mood;

});
