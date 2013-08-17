describe('Sonifizer', function() {

  beforeEach(function() {
    this.sonifizer = new Sonifizer();
  });

  it('should be defined on window', function() {
    expect(window.Sonifizer).toBeDefined();
    expect(typeof window.Sonifizer === 'function').toEqual(true);
  });

  it('should be initialized with defaults', function() {
    expect(this.sonifizer._data).toBeNull();
    expect(this.sonifizer._src).toBeNull();
    expect(this.sonifizer._type).toBeNull();
    expect(this.sonifizer._seconds).toEqual(1);
  });

  describe('when being initialized with data', function() {
    
    beforeEach(function() {
      this.stringSonifizer = new Sonifizer({
        data: 'test',
        seconds: 5
      });

      this.arraySonifizer = new Sonifizer({
        data: [1, 2, 3], 
        seconds: 10
      });
    });

    it('should set a data reference', function() {
      expect(this.stringSonifizer._data).toEqual('test');
      expect(Array.isArray(this.arraySonifizer._data)).toEqual(true);
    });

    it('should set a type', function() {
      expect(this.stringSonifizer._type).toEqual('string');
      expect(this.stringSonifizer._src).toBeNull();
      expect(this.arraySonifizer._type).toEqual('array');
      expect(this.arraySonifizer._src).toBeNull();
    });

    it('should set seconds duration', function() {
      expect(this.stringSonifizer._seconds).toEqual(5);
      expect(this.arraySonifizer._seconds).toEqual(10);
    });

    it('should throw a type error on invalid data', function() {
      expect(function() {
        new Sonifizer({
          data: 9000
        });
      }).toThrow(
        new TypeError('options.data must be of type array or string') 
      );

      expect(function() {
        new Sonifizer({
          data: {}
        });
      }).toThrow(
        new TypeError('options.data must be of type array or string') 
      );
    });

    it('should throw a type error on invalid seconds', function() {
      expect(function() {
        new Sonifizer({
          seconds: 'invalid seconds'
        });
      }).toThrow(
        new TypeError('seconds must be a valid integer')
      );

      expect(function() {
        new Sonifizer({
          seconds: [1, 2, 3]
        });
      }).toThrow(
        new TypeError('seconds must be a valid integer')
      );

      expect(function() {
        new Sonifizer({
          seconds: {}
        });
      }).toThrow(
        new TypeError('seconds must be a valid integer')
      );
    });
  });
  
  describe('when using the audio method', function() {

    beforeEach(function() {
      this.stringSonifizer = new Sonifizer({
        data: 'test',
        seconds: 5
      });

      this.arraySonifizer = new Sonifizer({
        data: [1, 2, 3], 
        seconds: 10
      });
    });

    it('should create an audio element with a source child', function() {
      expect(this.stringSonifizer.audio()).toBeDefined();
      expect(this.stringSonifizer.audio().tagName).toEqual('AUDIO');
      expect(this.stringSonifizer.audio().firstChild).toBeDefined();
      expect(this.stringSonifizer.audio().firstChild.tagName).toEqual('SOURCE');
    
      expect(this.arraySonifizer.audio()).toBeDefined();
      expect(this.arraySonifizer.audio().tagName).toEqual('AUDIO');
      expect(this.arraySonifizer.audio().firstChild).toBeDefined();
      expect(this.arraySonifizer.audio().firstChild.tagName).toEqual('SOURCE');
    });

    it('should have an empty source element src attribute if this._src is null', function() {
      expect(this.stringSonifizer.audio().firstChild.src).toEqual('');
      expect(this.arraySonifizer.audio().firstChild.src).toEqual('');
    });

    it('should have a source element src attribute if this._src is not null', function() {
      this.stringSonifizer._src = 'testing';
      this.arraySonifizer._src = 'testing';

      expect(this.stringSonifizer.audio().firstChild.src === '').toEqual(false);
      expect(this.arraySonifizer.audio().firstChild.src === '').toEqual(false);
    });

    it('should optionally accept a src', function() {
      expect(this.stringSonifizer.audio({ src:'testing' }).firstChild.src === '').toEqual(false);
      expect(this.arraySonifizer.audio({ src: 'testing' }).firstChild.src === '').toEqual(false);
    });

    it('should set arbitrary attributes on the audio element with options', function() {
      expect(this.stringSonifizer.audio({controls:true, autoplay:false}).controls).toEqual(true);
      expect(this.stringSonifizer.audio({controls:true, autoplay:false}).autoplay).toEqual(false);

      expect(this.arraySonifizer.audio({controls:true, autoplay:false}).controls).toEqual(true);
      expect(this.arraySonifizer.audio({controls:true, autoplay:false}).autoplay).toEqual(false);

      expect(this.stringSonifizer.audio({one:1, two: 2}).one).toEqual(1);
      expect(this.stringSonifizer.audio({one:1, two: 2}).two).toEqual(2);
      expect(this.arraySonifizer.audio({one:1, two: 2}).one).toEqual(1);
      expect(this.arraySonifizer.audio({one:1, two: 2}).two).toEqual(2);
    });
  });

  describe('when loading sonifizer', function() {
    
    beforeEach(function() {
      this.server = sinon.fakeServer.create();

      this.stringSonifizer = new Sonifizer({
        data: 'test',
        seconds: 5
      });

      this.arraySonifizer = new Sonifizer({
        data: [1, 2, 3], 
        seconds: 10
      });
    });

    afterEach(function() {
      this.server.restore();
    });

    it('should throw an error if data not specified', function() {
      expect(function() {
        (new Sonifizer()).load();
      }).toThrow(
        new Error('No data specified')
      );
    });

    it('should make an HTTP GET for string data', function() {
      spyOn(this.stringSonifizer, 'audio').andCallThrough();
      var successSpy = jasmine.createSpy();

      this.stringSonifizer.load({
        success: successSpy
      });
      
      this.server.requests[0].respond(
          200,
          { 'Content-Type': 'text/html' },
          'this will be a dataURL'
      );

      expect(this.server.requests[0].method).toEqual('GET');
      expect(this.server.requests[0].url).toEqual('http://sonifizer.com/api/string/test/json');
      expect(this.stringSonifizer._src).toEqual('this will be a dataURL');
      expect(successSpy).toHaveBeenCalled();
    });

    it('should make an HTTP POST for array data', function() {
      spyOn(this.arraySonifizer, 'audio').andCallThrough();
      var successSpy = jasmine.createSpy();

      this.arraySonifizer.load({
        success: successSpy
      });

      this.server.requests[0].respond(
          200,
          { 'Content-Type': 'text/html' },
          'this will be a dataURL'
      );
 
      expect(this.server.requests[0].method).toEqual('POST');
      expect(this.server.requests[0].url).toEqual('http://sonifizer.com/api/array');
      expect(this.server.requests[0].requestBody.data).toEqual(this.arraySonifizer._data);
      expect(this.server.requests[0].requestBody.seconds).toEqual(this.arraySonifizer._seconds);
      expect(this.arraySonifizer._src).toEqual('this will be a dataURL');
      expect(successSpy).toHaveBeenCalled();
    });

    it('should execute an error callback for GET if status is not 200', function() {
      spyOn(this.stringSonifizer, 'audio').andCallThrough();
      var successSpy = jasmine.createSpy(),
        errorSpy = jasmine.createSpy();

      this.stringSonifizer.load({
        success: successSpy,
        error: errorSpy 
      });
      
      this.server.requests[0].respond(
          300,
          { 'Content-Type': 'text/html' },
          'this will be a dataURL'
      );

      expect(successSpy).not.toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalledWith('An error occurred');
    });

    it('should execute an error callback for POST if status is not 200', function() {
      spyOn(this.arraySonifizer, 'audio').andCallThrough();
      var successSpy = jasmine.createSpy(),
        errorSpy = jasmine.createSpy();

      this.arraySonifizer.load({
        success: successSpy,
        error: errorSpy
      });
      
      this.server.requests[0].respond(
          300,
          { 'Content-Type': 'text/html' },
          'this will be a dataURL'
      );

      expect(successSpy).not.toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalledWith('An error occurred');
    });
  });

});