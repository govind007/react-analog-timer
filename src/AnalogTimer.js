import React, { Component } from 'react';
import PropTypes from 'prop-types'; // ES6
import './AnalogTimer.css';
import spacetime from 'spacetime'


class AnalogTimer extends Component {
  static propTypes = {
    timeZone: PropTypes.string,
    size: PropTypes.string,
    theme: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.object,
    border: PropTypes.string,
    className: PropTypes.string,
    background: PropTypes.string,
  }
  constructor(props) {
    super(props)
    const { timeZone, startTime } = props
    let date = spacetime.now();
    if (startTime) {
      date.time(startTime)
    }
    if (timeZone) {
      date = date.goto(timeZone)
    }
    const seconds = date.second();
    const minutes = date.minute();
    const hours = date.hour();
    this.state = {
      hoursAngle: null,
      minutesAngle: null,
      secondsAngle: null,
      startTime: date.epoch,
      isPaused: false
    }
    this.handsInitialAngle = this.getInitialTransform(hours, minutes, seconds)
    this.secondAngle = seconds * 6
    this.moveMinuteHands = this.moveMinuteHands.bind(this)
    this.moveSecondHands = this.moveSecondHands.bind(this)
    this.stopTimer = this.stopTimer.bind(this)
    this.startTimer = this.startTimer.bind(this)
    this.resetTimer = this.resetTimer.bind(this)
  }

  componentDidMount() {
    if (this.secondAngle > 0) {
      const delay = (((360 - this.secondAngle) / 6) + 0.1) * 1000;
      const $this = this
      setTimeout(function() {
        $this.setState({
          minutesAngle: 6
        })
        $this.moveMinuteHands();
      }, delay);
    } else {
      this.moveMinuteHands();
    }
    this.moveSecondHands();
  }

  getInitialTransform (hours, minutes, seconds) {
    return ({
      hours: {
        transform: `rotateZ(${(hours * 30) + (minutes / 2)}deg)`,
        WebkitTransform: `rotateZ(${(hours * 30) + (minutes / 2)}deg)`
      },
      minutes: {
        transform: `rotateZ(${minutes * 6}deg)`,
        WebkitTransform: `rotateZ(${minutes * 6}deg)`
      },
      seconds: {
        transform: `rotateZ(${seconds * 6}deg)`,
        WebkitTransform: `rotateZ(${seconds * 6}deg)`
      }
    })
  }

  getCurrentTime() {
    const { startTime, minutesAngle } = this.state
    const epochDiff = minutesAngle * 10000;
    const currentTime = spacetime(startTime + epochDiff).format('hh:mm a')
    return currentTime
  }
  moveMinuteHands() {
    const $this = this
    setInterval(function() {
      if (!$this.state.isPaused) {
        if (!$this.state.minutesAngle) {
          $this.setState({
            minutesAngle: 6
          })
        } else {
          $this.setState({
            minutesAngle: ($this.state.minutesAngle + 6)
          })
        }
      }
      const { endTime } = $this.props
      if (endTime && endTime.time && endTime.callBack) {
        const formattedEndTime = spacetime().time(endTime.time).format('hh:mm a')
        if ($this.getCurrentTime() === formattedEndTime) {
          endTime.callBack()
        }
      }
    }, 60000);
  }
  moveSecondHands() {
    const $this = this
    setInterval(function() {
      if (!$this.state.isPaused) {
        if (!$this.state.secondsAngle) {
          $this.setState({
            secondsAngle: 6
          })
        } else {
          $this.setState({
            secondsAngle: ($this.state.secondsAngle + 6)
          })
        }
      }
    }, 1000);
  }
  getSize (size) {
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
  getClassName (theme, className) {
    if (theme === 'ios') {
      return className + ' ios';
    }
    return className;
  }
  stopTimer() {
    this.setState({
      isPaused: true
    })
  }
  startTimer() {
    this.setState({
      isPaused: false
    })
  }
  resetTimer(time) {
    const { startTime } = this.props
    let newTime;
    if (time) {
      newTime = time;
    } else if (startTime) {
      newTime = startTime;
    } else {
      return false;
    }
    const resetTime = spacetime().time(newTime)
    const seconds = resetTime.second();
    const minutes = resetTime.minute();
    const hours = resetTime.hour();
    this.handsInitialAngle = this.getInitialTransform(hours, minutes, seconds)
    this.setState({
      hoursAngle: null,
      minutesAngle: null,
      secondsAngle: null,
    })
  }
  render() {
    const { hoursAngle, minutesAngle, secondsAngle } = this.state
    const { size, theme, border, className, background, backgroundImage } = this.props
    this.handsCurrentAngle = {
      hours: {
        transform: `rotateZ(${hoursAngle}deg)`,
        WebkitTransform: `rotateZ(${hoursAngle}deg)`
      },
      minutes: {
        transform: `rotateZ(${minutesAngle}deg)`,
        WebkitTransform: `rotateZ(${minutesAngle}deg)`
      },
      seconds: {
        transform: `rotateZ(${secondsAngle}deg)`,
        WebkitTransform: `rotateZ(${secondsAngle}deg)`
      }
    }
    return (
      <div className="wrapper" style={{ transform: `scale(${this.getSize(size)})`, border: `5px solid ${border || 'black'}`, background: `${background}`}}>
        <article className={`${this.getClassName(theme, `${className || ''} clock simple`)}`} style={{ backgroundColor: `${background}` }}>
          <div className="hours-container">
            <div className={`${this.getClassName(theme, 'hours')}`} style={this.handsInitialAngle.hours}></div>
          </div>
          <div className="minutes-container" style={this.handsCurrentAngle.minutes}>
            <div className={`${this.getClassName(theme, 'minutes')}`} style={this.handsInitialAngle.minutes}></div>
          </div>
          <div className="seconds-container" style={this.handsCurrentAngle.seconds}>
            <div className={`${this.getClassName(theme, 'seconds')}`} style={this.handsInitialAngle.seconds}></div>
          </div>
        </article>
      </div>
    );
  }
}

export default AnalogTimer;
