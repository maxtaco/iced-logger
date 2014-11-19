// Generated by IcedCoffeeScript 1.7.1-c
(function() {
  var Env, Level, Package, bold_red, colors, default_levels, init, repeat, util, _package,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice;

  colors = require('colors');

  util = require('util');

  bold_red = function(x) {
    return colors.bold(colors.red(x));
  };

  Env = (function() {
    function Env(_arg) {
      this.use_color = _arg.use_color, this.level = _arg.level;
      this.make_lconsole = __bind(this.make_lconsole, this);
    }

    Env.prototype.set_level = function(l) {
      return this.level = l;
    };

    Env.prototype.set_use_color = function(c) {
      return this.use_color = c;
    };

    Env.prototype.get_level = function() {
      return this.level;
    };

    Env.prototype.make_lconsole = function(console) {
      return (function(_this) {
        return function() {
          var args, level, method;
          method = arguments[0], level = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
          if (_this.get_level() <= level) {
            return console[method].apply(console, args);
          }
        };
      })(this);
    };

    return Env;

  })();

  repeat = function(c, n) {
    return ((function() {
      var _i, _results;
      _results = [];
      for (_i = 0; 0 <= n ? _i < n : _i > n; 0 <= n ? _i++ : _i--) {
        _results.push(c);
      }
      return _results;
    })()).join('');
  };

  Level = (function() {
    function Level(_arg) {
      this.level = _arg.level, this.color_fn = _arg.color_fn, this.prefix = _arg.prefix;
      this._i = 0;
    }

    Level.prototype.log = function(env, msg) {
      var line, lines, _i, _len, _results;
      if (env.level <= this.level) {
        msg = msg == null ? "" : Buffer.isBuffer(msg) ? msg.toString('utf8') : util.isError(msg) ? msg.toString() : "" + msg;
        lines = msg.split("\n");
        _results = [];
        for (_i = 0, _len = lines.length; _i < _len; _i++) {
          line = lines[_i];
          if (line.match(/\S+/)) {
            _results.push(this._log_line(env, line));
          }
        }
        return _results;
      }
    };

    Level.prototype._handle_nesting = function(line) {
      var p, prefix;
      if (line.match(/^[+|-] /)) {
        prefix = (function() {
          switch (line[0]) {
            case '+':
              this._i++;
              return repeat('+', this._i);
            case '-':
              p = repeat('-', this._i);
              if (--this._i < 0) {
                this._i = 0;
              }
              return p;
            case '|':
              return repeat('|', this._i);
          }
        }).call(this);
        line = [prefix, line.slice(2)].join(' ');
      }
      return line;
    };

    Level.prototype._log_line = function(env, line) {
      line = this._handle_nesting(line);
      line = [this.prefix + ":", line].join(' ');
      if ((this.color_fn != null) && env.use_color) {
        line = this.color_fn(line);
      }
      return this.__log_line(line);
    };

    Level.prototype.__log_line = function(x) {
      return console.error(x);
    };

    return Level;

  })();

  default_levels = {
    debug: new Level({
      level: 0,
      color_fn: colors.blue,
      prefix: "debug"
    }),
    info: new Level({
      level: 1,
      color_fn: colors.green,
      prefix: "info"
    }),
    warn: new Level({
      level: 2,
      color_fn: colors.magenta,
      prefix: "warn"
    }),
    error: new Level({
      level: 3,
      color_fn: bold_red,
      prefix: "error"
    })
  };

  Package = (function() {
    function Package(_arg) {
      var config, console, env, key, val, _fn;
      env = _arg.env, config = _arg.config, console = _arg.console;
      this._env = env;
      this._config = config;
      this._console = console;
      _fn = (function(_this) {
        return function(k, v) {
          _this[k] = function(m) {
            return v.log(_this._env, m);
          };
          return _this[k.toUpperCase()] = v.level;
        };
      })(this);
      for (key in config) {
        val = config[key];
        _fn(key, val);
      }
    }

    Package.prototype.env = function() {
      return this._env;
    };

    Package.prototype.export_to = function(exports) {
      var k, v, _ref;
      _ref = this._config;
      for (k in _ref) {
        v = _ref[k];
        exports[k] = this[k];
      }
      exports["package"] = (function(_this) {
        return function() {
          return _this;
        };
      })(this);
      exports.console = this._console;
      return exports.lconsole = this._env.make_lconsole(this._console);
    };

    return Package;

  })();

  _package = null;

  exports.init = init = function(_arg) {
    var config, console, env;
    env = _arg.env, config = _arg.config, console = _arg.console;
    return (_package = new Package({
      env: env,
      config: config,
      console: console
    })).export_to(exports);
  };

  init({
    env: new Env({
      use_color: true,
      level: default_levels.info.level
    }),
    config: default_levels,
    console: console
  });

}).call(this);
