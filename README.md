Welcome to V1 of React Analog Timer. In this package I have focused on keeping it simple and light weight. In order to do that I have used spacetime (https://www.npmjs.com/package/spacetime) which is very small library compare to momentjs and has momentjs like APIs.  
## Table of Contents

- [Installation](#Installation)
- [Usage](#Usage)
- [Documentation](#Documentation)

## Installation

`yarn add react-analog-timer` or `npm install react-analog-timer --save`

## Usage

```js
import React, { Component } from 'react'
import AnalogTimer from 'react-analog-timer'

export default class MyApp extends Component {
  onTimerEnds () {
    console.log('timer ended')
  }
  render() {
    return (
      <AnalogTimer
        ref={ref => { this.analogTimer = ref }}
        timeZone={'Asia/Calcutta'}  //optional
        size={'md'}  //optional
        theme={'ios'}  //optional
        startTime={'10:45am'} //optional
        endTime={{
          time: '11:00pm',
          callBack: this.onTimerEnds
        }} //optional
        border={'green'} // optional, hex colour code also acceptable
        className={'myCustomClass'}  //optional
        background={'white'} // optional, hex colour code also acceptable
      />
    )
  }
}

```

## Documentation

### Props

* timeZone [String] Optional
* size [String] optional , possible values `xs`, `sm`, `md`, `lg`
* theme [String] optional, possible values `ios`
* startTime [String] optional, time format `hh:mm a`
* endTime [Object] optional, call the callback function at provided time. time format `hh:mm a`
* border [String]
* className [String]
* background [String]

### Methods

* startTimer() {Void} start the timer if it is paused
* stopTimer() {void} stop timer if it is running
* resetTimer(time) {void} reset the timer to the start time or the time provided in the argument
* getCurrentTime() {time} return the time in `hh:mm a` format
