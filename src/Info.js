import './styles.css';
import React, { PureComponent } from 'react';
import { useEffect, useState, useRef } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
} from 'recharts';

import moment from 'moment';
import 'moment-timezone';
import {
  countRunsPeriodComplete,
  sessionsCompleteTodayObject,
  productivityPercentageTodayObject,
  productivityPercentageTodayOutcome,
  sessionsCompletePastSeven,
} from './cookiesdb';

function Example() {
  const [data, setData] = useState(null);

  useEffect(() => {
    sessionsCompletePastSeven().then(result => {
      setData(result);
    });
  }, []);

  return (
    <ResponsiveContainer width="100%" height="80%" maxHeight="100%">
      <BarChart
        width={500}
        height={250}
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" angle={-70} textAnchor="end" interval={0} height={90}>
          <Label value="Date" offset={0} position="bottom" />
        </XAxis >
        <YAxis />
        <Tooltip position={{ x: -40, y: 90 }} />

        <Bar dataKey="Very Poor" stackId="a" fill="#EE6055" />
        <Bar dataKey="Poor" stackId="a" fill="#F1A373" />
        <Bar dataKey="Okay" stackId="a" fill="#FFD97D" />
        <Bar dataKey="Good" stackId="a" fill="#9ee2a0" />
        <Bar dataKey="Very Good" stackId="a" fill="#60D394" />
      </BarChart>
    </ResponsiveContainer>
  );
}


const COLORS = ['#EE6055', '#F1A373', '#FFD97D', '#9ee2a0', "#60D394" ];

function TodaySessionsPie() {
  const [data, setData] = useState(null);

  useEffect(() => {
    sessionsCompleteTodayObject().then(result => {
      setData(result);
    });
  }, []);
  return (
    <PieChart width={80} height={80}>
      <Pie
        data={data}
        cx={35}
        cy={35}
        innerRadius={10}
        outerRadius={40}
        fill="#8884d8"
        paddingAngle={2}
        dataKey="value"
      >
        {!data
          ? null
          : data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
      </Pie>
      <Tooltip position={{ x: -40, y: 90 }} />
    </PieChart>
  );
}

function TodayProductivityPie() {
  const [data, setData] = useState(null);

  const formatTooltip = value => (value * 100).toFixed(0) + '%';

  useEffect(() => {
    productivityPercentageTodayObject().then(result => {
      setData(result);
    });
  }, []);

  return (
    <PieChart width={80} height={80}>
      <Pie
        data={data}
        cx={35}
        cy={35}
        innerRadius={10}
        outerRadius={40}
        fill="#8884d8"
        paddingAngle={2}
        dataKey="value"
      >
        {!data
          ? null
          : data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
      </Pie>
      <Tooltip
        position={{ x: -70, y: 90 }}
        wrapperStyle={0}
        formatter={formatTooltip}
      />
    </PieChart>
  );
}

export default function Info() {
  const [openSection, setOpenSection] = useState('graph');

  return (
    <div className="Info">
      <div id="hiddenHeader"></div>
      <header>
        <Navbar openSection={openSection} setOpenSection={setOpenSection} />
      </header>
      <main id="infomain">
        {openSection === 'graph' ? <Dashboard /> : 'sd'}
      </main>
    </div>
  );
}

function Navbar({ openSection, setOpenSection }) {
  return (
    <nav>
      <ul>
        <li>
          <div
            className={
              openSection != 'graph' ? 'buttonOutline' : 'buttonOutlineSelected'
            }
            onClick={() => setOpenSection('graph')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-5 -4 24 24"
              width="24"
              fill="currentColor"
            >
              <path d="M1 0a1 1 0 0 1 1 1v14a1 1 0 0 1-2 0V1a1 1 0 0 1 1-1zm12 4a1 1 0 0 1 1 1v10a1 1 0 0 1-2 0V5a1 1 0 0 1 1-1zM7 8a1 1 0 0 1 1 1v6a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1z"></path>
            </svg>
          </div>
        </li>

        <li>
          <div
            className={
              openSection != 'settings'
                ? 'buttonOutline'
                : 'buttonOutlineSelected'
            }
            onClick={() => setOpenSection('settings')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-2 -2 24 24"
              width="24"
              fill="currentColor"
            >
              <path d="M20 8.163A2.106 2.106 0 0 0 18.926 10c0 .789.433 1.476 1.074 1.837l-.717 2.406a2.105 2.105 0 0 0-2.218 3.058l-2.062 1.602A2.104 2.104 0 0 0 11.633 20l-3.29-.008a2.104 2.104 0 0 0-3.362-1.094l-2.06-1.615A2.105 2.105 0 0 0 .715 14.24L0 11.825A2.106 2.106 0 0 0 1.051 10C1.051 9.22.63 8.54 0 8.175L.715 5.76a2.105 2.105 0 0 0 2.207-3.043L4.98 1.102A2.104 2.104 0 0 0 8.342.008L11.634 0a2.104 2.104 0 0 0 3.37 1.097L17.064 2.7a2.105 2.105 0 0 0 2.218 3.058L20 8.162zM10 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path>
            </svg>
          </div>
        </li>
      </ul>
    </nav>
  );
}

function Dashboard() {
  productivityPercentageTodayObject();
  return (
    <div id="dashboard">
      <section id="dashHeader">
        <h1>Dashboard</h1>
        <h4>WELCOME BACK</h4>
      </section>
      <DashboardToday />
      <OverallStats />
    </div>
  );
}

function DashboardToday() {
  return (
    <section className="dashBox" id="today">
      <div id="todayText">
        <h3>Today</h3>
        <p>
          {moment
            .unix(Math.round(Date.now() / 1000))
            .tz('Pacific/Auckland')
            .format('DD MMM YY')}
        </p>
      </div>
      <SessionsToday />
      <MinutesToday />
    </section>
  );
}

function SessionsToday() {
  const [sessionsTodayCount, setSessionsTodayCount] = useState('');

  useEffect(() => {
    countRunsPeriodComplete('session').then(result => {
      setSessionsTodayCount(result);
    });
  }, []);
  return (
    <div className="dashBox" id="sessionsToday">
      <div id="sessionsTodayInfo">
        {sessionsTodayCount < 1 ? (
          <>
            <p>No completed sessions yet today</p>
          </>
        ) : (
          <>
            <h4>{sessionsTodayCount}</h4>
            <p>Sessions</p>
          </>
        )}
      </div>
      <div className="chartWrapper">
        <div></div>
        <TodaySessionsPie />
      </div>
    </div>
  );
}

function MinutesToday() {
  const [productivePercentage, setProductivePercentageTodayCount] = useState(
    ''
  );

  sessionsCompletePastSeven();

  useEffect(() => {
    productivityPercentageTodayOutcome().then(result => {
      setProductivePercentageTodayCount(result);
    });
  });

  return (
    <div className="dashBox" id="minutesToday">
      <div id="minutesTodayInfo">
        {!productivePercentage ? (
          <>
            <p>No completed sessions yet today</p>
          </>
        ) : (
          <>
            <h4>{(productivePercentage * 100).toFixed(0) + '%'}</h4>
            <p>Productive</p>
          </>
        )}
      </div>
      <div className="chartWrapper">
        <div></div>
        <TodayProductivityPie />
      </div>
    </div>
  );
}

function OverallStats() {
  return (
    <div className="dashBox" id="overallStats">
      <h2>Past 7 Days</h2>
      <Example />
    </div>
  );
}
