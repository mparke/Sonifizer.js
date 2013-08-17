### Sonifizer.js

A JavaScript module for accessing the [Sonifizer](http://sonifizer.com/) api

##### Instantiation
<pre>
  <code>
    // with a string
    var sonifizer = new Sonifizer({
      data: 'hello world'
      seconds: 5
    });
 
    // with an array of data
    var sonifizer = new Sonifizer({
      data: [1, 2, 3],
      seconds: 10
    });
  </code>
</pre>

##### Loading
<pre>
  <code>
    var sonifizer = new Sonifizer({
      data: 'hello world'
      seconds: 5
    });
    
    sonifizer.load({
      success: function(dataURL) {

      },
      error: function(errorMsg) {

      },
      context: this // optional
    });   
  </code>
</pre>

##### Audio Element
<pre>
  <code>
    var sonifizer = new Sonifizer({
      data: 'hello world'
      seconds: 5
    });

    sonifizer.load({
      success: function(dataURL) {
        // uses the dataURL returned as the source by default
        $('body').append(sonifizer.audio({
          controls: false,
          autoplay: true
        }));
      }
    });
  </code>
</pre>

#### API

- Sonifizer(options) // construct a new sonifizer
  - options.data: a string or array of data
  - options.seconds: the duration to generate
- seconds(number) // sets the duration to generate
- data(string or array) // sets the data to be used by load 
- load(options) // loads the sonifizer sound by sending data to the api
  - options.success: success callback
  - options.error: error callback
  - options.context: the scope at which to execute the given callbacks
- audio(options) // creates and returns a new audio element, typically used after load success
  - options: any attributes you want to attach to the audio element
