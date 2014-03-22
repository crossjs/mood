define(function (require, exports) {

  'use strict';

  var Mood = require('../src/mood');

  var mood = new Mood({
    container: $('<div/>').appendTo(document.body),
    channelId: '10009',
    webId: '2814902',
    kindId: '1',
    onmouseover: function(i) {
      $('.mood-list-' + previous).hide();
      $('.mood-list-' + (i+1)).show();
      previous = i+1;
    }
  });

  var mood = new Mood({
    container: $('<div/>').appendTo(document.body),
    channelId: '10009',
    webId: '2814902',
    kindId: '1',
    moods: 'NEWS',
    onmouseover: function(i) {
      $('.mood-list-' + previous).hide();
      $('.mood-list-' + (i+1)).show();
      previous = i+1;
    }
  });

  QUnit.start();

  module('Module Mood');
  test('Mood', function() {
    ok(true, '');
    // notEqual( new Mood(), new Mood(), '' );
  });

});