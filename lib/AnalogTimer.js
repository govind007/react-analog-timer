'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

require('./AnalogTimer.css');

var _spacetime = require('spacetime');

var _spacetime2 = _interopRequireDefault(_spacetime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // ES6


var AnalogTimer = function (_Component) {
  _inherits(AnalogTimer, _Component);

  function AnalogTimer(props) {
    _classCallCheck(this, AnalogTimer);

    var _this = _possibleConstructorReturn(this, (AnalogTimer.__proto__ || Object.getPrototypeOf(AnalogTimer)).call(this, props));

    var timeZone = props.timeZone,
        startTime = props.startTime;

    var date = _spacetime2.default.now();
    if (startTime) {
      date.time(startTime);
    }
    if (timeZone) {
      date = date.goto(timeZone);
    }
    var seconds = date.second();
    var minutes = date.minute();
    var hours = date.hour();
    _this.state = {
      hoursAngle: null,
      minutesAngle: null,
      secondsAngle: null,
      startTime: date.epoch,
      isPaused: false
    };
    _this.handsInitialAngle = _this.getInitialTransform(hours, minutes, seconds);
    _this.secondAngle = seconds * 6;
    _this.moveMinuteHands = _this.moveMinuteHands.bind(_this);
    _this.moveSecondHands = _this.moveSecondHands.bind(_this);
    _this.stopTimer = _this.stopTimer.bind(_this);
    _this.startTimer = _this.startTimer.bind(_this);
    _this.resetTimer = _this.resetTimer.bind(_this);
    return _this;
  }

  _createClass(AnalogTimer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.secondAngle > 0) {
        var delay = ((360 - this.secondAngle) / 6 + 0.1) * 1000;
        var $this = this;
        setTimeout(function () {
          $this.setState({
            minutesAngle: 6
          });
          $this.moveMinuteHands();
        }, delay);
      } else {
        this.moveMinuteHands();
      }
      this.moveSecondHands();
    }
  }, {
    key: 'getInitialTransform',
    value: function getInitialTransform(hours, minutes, seconds) {
      return {
        hours: {
          transform: 'rotateZ(' + (hours * 30 + minutes / 2) + 'deg)',
          WebkitTransform: 'rotateZ(' + (hours * 30 + minutes / 2) + 'deg)'
        },
        minutes: {
          transform: 'rotateZ(' + minutes * 6 + 'deg)',
          WebkitTransform: 'rotateZ(' + minutes * 6 + 'deg)'
        },
        seconds: {
          transform: 'rotateZ(' + seconds * 6 + 'deg)',
          WebkitTransform: 'rotateZ(' + seconds * 6 + 'deg)'
        }
      };
    }
  }, {
    key: 'getCurrentTime',
    value: function getCurrentTime() {
      var _state = this.state,
          startTime = _state.startTime,
          minutesAngle = _state.minutesAngle;

      var epochDiff = minutesAngle * 10000;
      var currentTime = (0, _spacetime2.default)(startTime + epochDiff).format('hh:mm a');
      return currentTime;
    }
  }, {
    key: 'moveMinuteHands',
    value: function moveMinuteHands() {
      var $this = this;
      setInterval(function () {
        if (!$this.state.isPaused) {
          if (!$this.state.minutesAngle) {
            $this.setState({
              minutesAngle: 6
            });
          } else {
            $this.setState({
              minutesAngle: $this.state.minutesAngle + 6
            });
          }
        }
        var endTime = $this.props.endTime;

        if (endTime && endTime.time && endTime.callBack) {
          var formattedEndTime = (0, _spacetime2.default)().time(endTime.time).format('hh:mm a');
          if ($this.getCurrentTime() === formattedEndTime) {
            endTime.callBack();
          }
        }
      }, 60000);
    }
  }, {
    key: 'moveSecondHands',
    value: function moveSecondHands() {
      var $this = this;
      setInterval(function () {
        if (!$this.state.isPaused) {
          if (!$this.state.secondsAngle) {
            $this.setState({
              secondsAngle: 6
            });
          } else {
            $this.setState({
              secondsAngle: $this.state.secondsAngle + 6
            });
          }
        }
      }, 1000);
    }
  }, {
    key: 'getSize',
    value: function getSize(size) {
      switch (size) {
        case 'xs':
          return 0.2;
        case 'sm':
          return 0.4;
        case 'md':
          return 0.8;
        case 'lg':
          return 1;
        default:
          return 0.6;
      }
    }
  }, {
    key: 'getClassName',
    value: function getClassName(theme, className) {
      if (theme === 'ios') {
        return className + ' ios';
      }
      return className;
    }
  }, {
    key: 'stopTimer',
    value: function stopTimer() {
      this.setState({
        isPaused: true
      });
    }
  }, {
    key: 'startTimer',
    value: function startTimer() {
      this.setState({
        isPaused: false
      });
    }
  }, {
    key: 'resetTimer',
    value: function resetTimer(time) {
      var startTime = this.props.startTime;

      var newTime = void 0;
      if (time) {
        newTime = time;
      } else if (startTime) {
        newTime = startTime;
      } else {
        return false;
      }
      var resetTime = (0, _spacetime2.default)().time(newTime);
      var seconds = resetTime.second();
      var minutes = resetTime.minute();
      var hours = resetTime.hour();
      this.handsInitialAngle = this.getInitialTransform(hours, minutes, seconds);
      this.setState({
        hoursAngle: null,
        minutesAngle: null,
        secondsAngle: null
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _state2 = this.state,
          hoursAngle = _state2.hoursAngle,
          minutesAngle = _state2.minutesAngle,
          secondsAngle = _state2.secondsAngle;
      var _props = this.props,
          size = _props.size,
          theme = _props.theme,
          border = _props.border,
          className = _props.className,
          background = _props.background,
          backgroundImage = _props.backgroundImage;

      this.handsCurrentAngle = {
        hours: {
          transform: 'rotateZ(' + hoursAngle + 'deg)',
          WebkitTransform: 'rotateZ(' + hoursAngle + 'deg)'
        },
        minutes: {
          transform: 'rotateZ(' + minutesAngle + 'deg)',
          WebkitTransform: 'rotateZ(' + minutesAngle + 'deg)'
        },
        seconds: {
          transform: 'rotateZ(' + secondsAngle + 'deg)',
          WebkitTransform: 'rotateZ(' + secondsAngle + 'deg)'
        }
      };
      return _react2.default.createElement(
        'div',
        { className: 'wrapper', style: { transform: 'scale(' + this.getSize(size) + ')', border: '5px solid ' + (border || 'black'), background: '' + background } },
        _react2.default.createElement(
          'article',
          { className: '' + this.getClassName(theme, (className || '') + ' clock simple'), style: { backgroundColor: '' + background } },
          _react2.default.createElement(
            'div',
            { className: 'hours-container' },
            _react2.default.createElement('div', { className: '' + this.getClassName(theme, 'hours'), style: this.handsInitialAngle.hours })
          ),
          _react2.default.createElement(
            'div',
            { className: 'minutes-container', style: this.handsCurrentAngle.minutes },
            _react2.default.createElement('div', { className: '' + this.getClassName(theme, 'minutes'), style: this.handsInitialAngle.minutes })
          ),
          _react2.default.createElement(
            'div',
            { className: 'seconds-container', style: this.handsCurrentAngle.seconds },
            _react2.default.createElement('div', { className: '' + this.getClassName(theme, 'seconds'), style: this.handsInitialAngle.seconds })
          )
        )
      );
    }
  }]);

  return AnalogTimer;
}(_react.Component);

AnalogTimer.propTypes = {
  timeZone: _propTypes2.default.string,
  size: _propTypes2.default.string,
  theme: _propTypes2.default.string,
  startTime: _propTypes2.default.string,
  endTime: _propTypes2.default.object,
  border: _propTypes2.default.string,
  className: _propTypes2.default.string,
  background: _propTypes2.default.string
};
exports.default = AnalogTimer;