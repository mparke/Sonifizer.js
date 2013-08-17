//---------------------------------------------
// ************** Sonifizer.js **************
//---------------------------------------------
//     http://www.Sonifizer.com/Sonifizer.js 
//---------------------------------------------
//         Copyright Andrew Madden 2013
//---------------------------------------------
// 
(function(window){
  var base_url = 'http://sonifizer.com/api/';

  var Sonifizer = function(options) {
    options = options || {};
    this._data = null;
    this._src = null;
    this._type = null;
    this._seconds = 1;

    if(options.data) {
      this.data(options.data);
    }

    if(options.seconds) {
      this.seconds(options.seconds);
    }
  };

  Sonifizer.prototype = {
    
    seconds: function(seconds) {
      if(typeof seconds === 'number') {
        this._seconds = seconds;
      }else {
        throw new TypeError('seconds must be a valid integer');
      }
    },

    data: function(data) {
      if(Array.isArray(data)) {
          this._type = 'array';
      }else if (typeof data === 'string') {
          this._type = 'string';
      }else {
          throw new TypeError('options.data must be of type array or string');
      }

      this._data = data;
      this._src = null;
    },

    load: function(options) {
      var me = this,
        request, context, success, error, url;

      if(this._data) {
        request = new XMLHttpRequest();
        context = options.context || window;
        success = options.success || function(){}; //stub
        error = options.error || function(){}; // stub

        if(this._type === 'array') {
          url = base_url + this._type;
          request.open('POST', url);
        }else {
          url = base_url + this._type + '/' + this._data + '/json';
          request.open('GET', url);
        }
        
        request.onload = function() {
          if(request.status === 200) {
            me._src = request.responseText;
            options.success.call(context, me._src);
          }else {
            options.error.call(context, 'An error occurred');
          }
        };

        request.send({ data: this._data, seconds: this._seconds });
      }else {
        throw new Error('No data specified');
      }
    },

    audio: function(options) {
      options = options || {};

      var doc = document,
        audioEl = doc.createElement('audio'),
        sourceEl = doc.createElement('source'),
        src = options.src || this._src;

      sourceEl.src = src;
      audioEl.appendChild(sourceEl);
      
      for(var index in options) {
        audioEl[index] = options[index];
      }

      return audioEl;
    }
  };

  window.Sonifizer = Sonifizer;
})(window);







