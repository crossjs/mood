define(function (require, exports) {

  'use strict';

  var Mood = require('../src/mood');

  var mood1 = new Mood({
    container: $('<div/>').appendTo(document.body),
    channelId: '10009',
    webId: '2814902',
    kindId: '1',
    delegates: {
      'mouseover .ue-mood-item': function (e) {
        var el = e.currentTarget;
        $('.mood-list-' + ($(el).index() + 1)).show()
          .siblings(':visible').hide();
      }
    }
  });

  var mood2 = new Mood({
    container: $('<div/>').appendTo(document.body),
    channelId: '10009',
    webId: '2814902',
    kindId: '1',
    moods: 'NEWS',
    delegates: {
      'mouseover .ue-mood-item': function (e) {
        var el = e.currentTarget;
        $('.mood-list-' + ($(el).index() + 1)).show()
          .siblings(':visible').hide();
      }
    }
  });

});