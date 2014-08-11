define(function(require, exports, module) {

  /**
   * 表情投票
   *
   * @module Mood
   */

  'use strict';

  var $ = require('$'),
    Widget = require('widget');

  /**
   * 数据层类
   *
   * @class Core
   * @constructor
   */
  var Core = Widget.extend({

    setup: function() {
      // 设置后端接口参数
      this.data('params', {
        channel: this.option('channelId'),
        'web_id': this.option('webId'),
        kind: this.option('kindId')
      });

      // 初始化状态
      this.state(Core.STATE.NORMAL);
    },

    load: function() {
      var self = this,
        params = this.data('params');

      params.action = '0';

      this.fire('load');

      this.state(Core.STATE.RECEIVING);

      bridge.call(this, params,
        function(data, xhr) {
          self.fire('done', 'load', data);
        },
        function(xhr, error) {
          self.fire('fail', 'load', error);
        });
    },

    vote: function(index) {
      var self = this,
        params = this.data('params');

      params.action = '1';
      params.mood = index + 1;

      this.fire('vote');

      this.state(Core.STATE.SENDING);

      bridge(params,
        function(data, xhr) {
          self.fire('done', 'vote', data);
        },
        function(xhr, error) {
          self.fire('fail', 'vote', error);
        });
    }

  });

  function bridge(params, done, fail) {
    $.getJSON(Core.URL, params)
      .done(done)
      .fail(fail);
  }

  Core.STATE = {
    ERROR: -1,
    NORMAL: 0,
    RECEIVING: 1,
    SENDING: 2
  };

  Core.URL = 'http://hits.17173.com/mood/mood_opb.php?jsonp=?';

  module.exports = Core;

});
