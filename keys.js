dojo.provide("dojox.keys._base");

  // summary: Listens for a sequence of keys and executes a callback on
  // successful completion of key sequence. Default sequence of keys is
  // the konami code.

dojo.mixin(dojox.keys, {

  konami: [38, 38, 40, 40, 37, 39, 37, 39, 66, 65],

  add: function(options) {
  // summary:
  //      Add key listening behavior to a particular node
  //
  // description:
  //      Returns a dojo.connect handle which is the listener for
  //      key events.
  //      A valid options object would look something like this:
  //      |   dojox.keys.add({ node: dojo.byId('myNode'), callback: function() {// execute when the konami code is keyed in by the user. } });
  //      You can also override the sequence of characters and the node parameter can be a css selector:
  //      |   dojox.keys.add({ node: 'ul li.selected', callback: function() {}, sequence: [38, 39, 40, 37]});
  //
    this._digestOptions(options);
    var fn = dojo.hitch(this, function(evt) {
      this._checkCode(evt, options)
    }), nodes = [];
    if (options.node.forEach) {
      options.node.forEach(function(n) {
        nodes.push(n);
      });
    } else {
      nodes.push(options.node);
    }
    dojo.forEach(nodes, function(n) {
      options.handles.push(dojo.connect(n, 'onkeyup', fn));
    });
    return options.handles.length > 1 ? options.handles : options.handles[0];
  },

  _digestOptions: function(options) {
    if (!options.callback || typeof options.callback !== 'function') {
      throw new Error('Callback parameter must be a function');
    }
    if (typeof options.node === 'string') {
      options.node = dojo.query(options.node);
    }
    options.node = options.node || dojo.doc;
    options.sequence = options.sequence || this.konami;
    options.position = 0;
    options.handles = [];
  },

  _checkCode: function(evt, options) {
    options.position = evt.keyCode === options.sequence[options.position] ? options.position + 1 : 0;
    if (options.position === options.sequence.length) {
      options.callback.call();
      options.step = 0;
    }
  }
});
