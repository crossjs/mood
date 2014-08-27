define(function(require, exports, module) {

  /**
   * 表情投票
   * @module Mood
   */

  'use strict';

  var $ = require('$');

  var Core = require('./core'),
    PRESETS = require('./presets');

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
   *   container: '#mood-news',
   *   channel: '10009',
   *   webId: '2814902',
   *   kind: '1',
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
      classPrefix: 'ue-mood',
      container: null,
      delegates: {
        'click [data-role=item]': function(e) {
          if (this.state() !== Core.STATE.DISABLED) {
            this.vote($(e.currentTarget).data('index'));
          }
        },
        'mouseenter [data-role=item]': function(e) {
          this.mouseenter($(e.currentTarget));
        },
        'mouseleave [data-role=item]': function(e) {
          this.mouseleave($(e.currentTarget));
        }
      },
      importStyle: true,
      moods: 'ZHUANQU',
      template: require('./mood.handlebars')
    },

    setup: function() {
      var self = this,
        moods;

      // 调用 Core 的 setup
      Mood.superclass.setup.apply(self);

      if (!self.url) {
        // 缺少URL
        return;
      }

      if (!self.params.channel ||
        !self.params['web_id'] ||
        !self.params.kind) {
        // 缺少参数
        return;
      }

      if (self.option('importStyle') && !styleImported) {
        importStyle();
        styleImported = true;
      }

      moods = self.option('moods');

      // 设置默认数据
      self.data({
        moods: PRESETS[moods],
        total: 0,
        max: 0
      });

      self.load();
    },

    /**
     * 解析服务端返回的数据
     * 1#3438,2#411,3#156,4#98,5#200,6#95,7#434,8#19,9#0,10#0
     *
     * @param {string} data 逗号分隔的字符串
     */
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

    mouseenter: function(item) {
      var index = item.data('index');

      // if (!this.is('.' + this.option('classDisabled'))) {
        item.find('[data-role=smiley]')
          .attr('src',
            this.data('moods')[index]['ani']);
      // }

      /**
       * 通知鼠标移入投票项
       *
       * @event enter
       * @param {object} e Event.
       * @param {number} index 投票项索引值
       */
      this.fire('enter', index);
    },

    mouseleave: function(item) {
      var index = item.data('index');

      // if (!this.is('.' + this.option('classDisabled'))) {
        item.find('[data-role=smiley]')
          .attr('src',
            this.data('moods')[index]['img']);
      // }

      /**
       * 通知鼠标移出投票项
       *
       * @event enter
       * @param {object} e Event.
       * @param {number} index 投票项索引值
       */
      this.fire('leave', index);
    }

  });

  Mood.PRESETS = PRESETS;

  module.exports = Mood;

});
