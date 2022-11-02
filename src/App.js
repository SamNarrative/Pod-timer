import './styles.css';
import React from 'react';
import { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import 'moment-timezone';
import testSavePeriods from './cookiesdb';

const { ipcRenderer } = window.require('electron');
moment().format();

export default function App() {
  return (
    <div className="App">
      <ClockWrapper />
    </div>
  );
}

function ClockWrapper() {
  const [time, setTime] = useState(1500);
  const [timerActive, setTimerActive] = useState(false);
  const [sessionLengthTime, setSessionLengthTime] = useState(time);
  const [breakLengthTime, setBreakLengthTime] = useState(300);
  const [session, setSession] = useState(true);
  const [beep, setBeep] = useState('');
  const [finishEpoc, setFinishEpoc] = useState();
  const [mouseEntered, setMouseEntered] = useState(false);
  const clockWarpperRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timerActive && time > 0) {
        const newTime = Math.round((finishEpoc - Date.now()) / 1000);
        setTime(newTime);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  });

  function formatTime(time) {
    const newTime = time;
    const minutes = Math.floor(newTime / 60);
    const seconds = newTime - minutes * 60;
    return seconds < 10 ? minutes + ':0' + seconds : minutes + ':' + seconds;
  }

  function handleTimerClick() {
    setTimerActive(!timerActive);
    setFinishEpoc(Date.now() + time * 1000);
  }

  function handleResetClick() {
    session ? setTime(sessionLengthTime) : setTime(breakLengthTime);
    setTimerActive(false);
    testSavePeriods();
  }

  function handleMinimse() {
    ipcRenderer.send('minimize');
  }

  function handleLengthChange(increase, type) {
    if (type === 'session') {
      if (sessionLengthTime <= 60 && !increase) {
        return;
      }
      if (increase) {
        if (!timerActive && session) {
          setTime(sessionLengthTime + 60);
        }
        setSessionLengthTime(sessionLengthTime + 60);
      } else {
        if (!timerActive && session) {
          setTime(sessionLengthTime - 60);
        }
        setSessionLengthTime(sessionLengthTime - 60);
      }
    } else {
      if (breakLengthTime <= 60 && !increase) {
        return;
      }
      if (increase) {
        if (!timerActive && !session) {
          setTime(breakLengthTime + 60);
        }
        setBreakLengthTime(breakLengthTime + 60);
      } else {
        if (!timerActive && !session) {
          setTime(breakLengthTime - 60);
        }
        setBreakLengthTime(breakLengthTime - 60);
      }
    }
  }

  function handleSkipToNext() {
    setSession(!session);
    session ? setTime(breakLengthTime) : setTime(sessionLengthTime);
    session
      ? setFinishEpoc(Date.now() + breakLengthTime * 1000)
      : setFinishEpoc(Date.now() + sessionLengthTime * 1000);
  }

  useEffect(() => {
    setBeep(document.getElementById('beep'));
  }, []);

  if (time === 0) {
    setSession(!session);
    session ? setTime(breakLengthTime) : setTime(sessionLengthTime);
    session
      ? setFinishEpoc(Date.now() + breakLengthTime * 1000)
      : setFinishEpoc(Date.now() + sessionLengthTime * 1000);

    beep.play();
  }

  return (
    <div
      id="clockWrapper"
      onMouseEnter={() => setMouseEntered(true)}
      onMouseLeave={() => setMouseEntered(false)}
      ref={clockWarpperRef}
    >
      <Session
        formattedTime={formatTime(time)}
        handleTimerClick={handleTimerClick}
        handleResetClick={handleResetClick}
        timerActive={timerActive}
        session={session}
        finishEpoc={finishEpoc}
        time={time}
        mouseEntered={mouseEntered}
        handleMinimse={handleMinimse}
      />
      <SessionButtons
        handleTimerClick={handleTimerClick}
        handleResetClick={handleResetClick}
        handleSkipToNext={handleSkipToNext}
        timerActive={timerActive}
        mouseEntered={mouseEntered}
      />

      {/* <div id="lengthControls"> */}
      {/* <Control
          title="session length"
          id="session"
          time={sessionLengthTime}
          handleLengthChange={handleLengthChange}
          type="session"
        />
        <Control
          title="break length"
          id="break"
          time={breakLengthTime}
          handleLengthChange={handleLengthChange}
          type="break"
        /> */}
      <audio
        preload="auto"
        id="beep"
        src="file:///Users/samroberts/Code/Untitled/Pod timer/Pod-timer/src/audio.wav"
      ></audio>
      {/* </div> */}
    </div>
  );
}

function Session({
  formattedTime,
  timerActive,
  session,
  finishEpoc,
  time,
  mouseEntered,
  handleMinimse,
}) {
  return (
    <div id="session" className={time > 5 ? 'default' : 'finishing'}>
      <div id="titleText">
        <p className="sessionTitle" id="title">
          {session ? 'session' : 'break'}
        </p>
        {mouseEntered ? (
          <div id="minimise" onClick={() => handleMinimse()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-5 -11 24 24"
              width="24"
              fill="currentColor"
            >
              <path d="M1 0h12a1 1 0 0 1 0 2H1a1 1 0 1 1 0-2z"></path>
            </svg>
          </div>
        ) : finishEpoc && timerActive ? (
          <p className="sessionTitle" id="finishingAt">
            {'finishing at: ' + moment.unix(Math.round(finishEpoc / 1000))
            .tz('Pacific/Auckland').format('h:mma')}
          </p>
        ) : (
          ''
        )}
      </div>
      <SessionTimer formattedTime={formattedTime} />
    </div>
  );
}

function SessionTimer({ formattedTime }) {
  return (
    <div id="sessionTimerText">
      <p>{formattedTime}</p>
    </div>
  );
}

function SessionButtons({
  handleTimerClick,
  handleResetClick,
  timerActive,
  mouseEntered,
  handleSkipToNext,
}) {
  return (
    <div id="sessionTimerButtons" className={mouseEntered ? 'show' : 'hide'}>
      <svg
        onClick={() => handleResetClick()}
        className="timerButton"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-2 -2 24 24"
        width="24"
        fill="currentColor"
      >
        <path d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-10a1 1 0 0 1 1 1v5a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1zm0-1a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"></path>
      </svg>
      <svg
        onClick={() => handleResetClick()}
        className="timerButton"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-1.5 -2.5 24 24"
        width="24"
        fill="currentColor"
      >
        <path d="M17.83 4.194l.42-1.377a1 1 0 1 1 1.913.585l-1.17 3.825a1 1 0 0 1-1.248.664l-3.825-1.17a1 1 0 1 1 .585-1.912l1.672.511A7.381 7.381 0 0 0 3.185 6.584l-.26.633a1 1 0 1 1-1.85-.758l.26-.633A9.381 9.381 0 0 1 17.83 4.194zM2.308 14.807l-.327 1.311a1 1 0 1 1-1.94-.484l.967-3.88a1 1 0 0 1 1.265-.716l3.828.954a1 1 0 0 1-.484 1.941l-1.786-.445a7.384 7.384 0 0 0 13.216-1.792 1 1 0 1 1 1.906.608 9.381 9.381 0 0 1-5.38 5.831 9.386 9.386 0 0 1-11.265-3.328z"></path>
      </svg>

      {timerActive ? (
        <svg
          onClick={() => handleTimerClick()}
          className="timerButton"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-4 -3 24 24"
          width="24"
          fill="currentColor"
        >
          <path d="M2 0h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm0 2v14h2V2H2zm10-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm0 2v14h2V2h-2z"></path>
        </svg>
      ) : (
        <svg
          onClick={() => handleTimerClick()}
          className="timerButton"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-2 -2 24 24"
          width="24"
          fill="currentColor"
        >
          <path d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm4.126-6.254l-4.055 2.898c-.905.646-2.13.389-2.737-.576A2.201 2.201 0 0 1 7 12.898V7.102C7 5.942 7.883 5 8.972 5c.391 0 .774.124 1.099.356l4.055 2.898c.905.647 1.146 1.952.54 2.917a2.042 2.042 0 0 1-.54.575zM8.972 7.102v5.796L13.027 10 8.972 7.102z"></path>
        </svg>
      )}

      <svg
        onClick={() => handleSkipToNext()}
        className="timerButton"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-2 -2 24 24"
        width="24"
        fill="currentColor"
      >
        <path d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1.586-7H6a1 1 0 0 1 0-2h5.586L9.05 6.464a1 1 0 1 1 1.414-1.414l4.243 4.243a.997.997 0 0 1 0 1.414l-4.243 4.243a1 1 0 1 1-1.414-1.414L11.586 11z"></path>
      </svg>
    </div>
  );
}

function Control({ title, time, handleLengthChange, type }) {
  function formatTime(time) {
    const newTime = time;
    const minutes = Math.floor(newTime / 60);
    const seconds = newTime - minutes * 60;
    return seconds < 10 ? minutes + ':0' + seconds : minutes + ':' + seconds;
  }

  return (
    <div className="control">
      {title}
      <div className="controlAspects">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-2 -2 24 24"
          width="24"
          fill="currentColor"
          onClick={() => handleLengthChange(false, type)}
        >
          <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0 2C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zM5 9h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2z"></path>
        </svg>
        <p>{formatTime(time)}</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-2 -2 24 24"
          width="24"
          fill="currentColor"
          onClick={() => handleLengthChange(true, type)}
        >
          <path d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-7v4a1 1 0 0 1-2 0v-4H5a1 1 0 0 1 0-2h4V5a1 1 0 1 1 2 0v4h4a1 1 0 0 1 0 2h-4z"></path>
        </svg>
      </div>
    </div>
  );
}
