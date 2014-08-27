define(function(require, exports, module) {

  /**
   * 表情投票
   *
   * @module Mood
   */

  'use strict';

  var $ = require('$'),
    Widget = require('widget'),
    Tips = require('tips');

  var STATE = {
    ERROR: -1,
    NORMAL: 0,
    RECEIVING: 1,
    SENDING: 2,
    DISABLED: 3
  };

  /**
   * 数据及基础类
   *
   * @class Core
   * @constructor
   */
  var Core = Widget.extend({

    defaults: {
      url: 'http://hits.17173.com/mood/mood_opb.php?jsonp=?'
    },

    setup: function() {
      this.url = this.option('url');

      // 设置后端接口参数
      this.params = {
        channel: this.option('channel') || this.option('channelId'),
        'web_id': this.option('webId'),
        kind: this.option('kind') || this.option('kindId')
      };

      // 初始化状态
      this.state(STATE.NORMAL);
    },

    load: function() {
      var self = this;

      self.params.action = '0';

      /**
       * 通知加载投票数据
       *
       * @event load
       * @param {object} e Event.
       */
      self.fire('load');

      self.state(STATE.RECEIVING);

      // self.showTips('数据加载中……');

      self.getData(self.params, function(data, xhr) {
        self.done('load', data);
      }, function(xhr, status, error) {
        self.done('vote', status + ', ' + error);
      });
    },

    vote: function(index) {
      var self = this;

      self.params.action = '1';
      self.params.mood = index + 1;

      /**
       * 通知提交投票数据
       *
       * @event vote
       * @param {object} e Event.
       */
      self.fire('vote');

      self.state(STATE.SENDING);

      self.showTips('数据发送中……');

      self.getData(self.params, function(data, xhr) {
        self.done('vote', data);
      }, function(xhr, status, error) {
        self.done('vote', status + ', ' + error);
      });
    },

    /**
     * 处理请求成功数据
     * @param  {string}   type   请求类型
     * @param  {string}   data   成功数据
     * @private
     */
    done: function(type, data) {
      var self = this;

      if (type === 'load') {
        self.parseData(data.data);
        self.render();
        self.state(STATE.NORMAL);
      } else if (type === 'vote') {
        // 数据发送成功
        switch (data.flag) {

          case '1': // 1: 成功
            self.showTips('投票成功，感谢您的参与');
            self.parseData(data.data);
            self.render();
            self.state(STATE.NORMAL);
            break;

          case '2': // 2：失败
            self.state(STATE.ERROR);
            break;

          case '3': // 3：参数不全
            self.state(STATE.ERROR);
            break;

          case '9':
            self.showTips('您的IP今天已经投过票了, 感谢您的参与');
            self.state(STATE.DISABLED);
            break;

          default:
            break;
        }
      }
    },

    /**
     * 处理请求失败数据
     * @param  {string}   type   请求类型
     * @param  {string}   error  错误信息
     * @private
     */
    fail: function(type, error) {
      if (type === 'load') {
        this.showTips('数据加载失败');
      } else if (type === 'vote') {
        this.showTips('数据发送失败');
      }
    },

    /**
     * 提交/获取投票数据
     * @param  {object}   params 请求参数
     * @param  {function} done   成功回调
     * @param  {function} fail   失败回调
     * @private
     */
    getData: function(params, done, fail) {
      $.getJSON(this.url, params)
        .done(done)
        .fail(fail);
    },

    /**
     * 解析投票数据
     * @private
     */
    parseData: function() {},

    /**
     * 显示提示信息
     * @private
     */
    showTips: function(info) {
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

  Core.STATE = STATE;

  module.exports = Core;

});
