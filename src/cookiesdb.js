import Cookies from 'universal-cookie';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

export function setPeriods() {
  const cookies = new Cookies();
  const periodCookie = cookies.get('currentPeriods');
  let currentPeriods = periodCookie ? periodCookie : [];

  return currentPeriods;
}

export function getSetRunId() {
  const cookies = new Cookies();
  const runIdCookie = cookies.get('runId');
  let runId = runIdCookie ? runIdCookie : uuidv4();
  cookies.set('runId', runId, {
    path: '/',
  });
  return runId;
}

function setPeriodsCookie(periods) {
  const cookies = new Cookies();
  cookies.set('currentPeriods', periods, {
    path: '/',
    expires: moment(Date.now())
      .add(30, 'y')
      .toDate(),
  });
}

export default function createNewPeriod(id, type, runId) {
  const newCurrentPeriods = setPeriods();

  if (newCurrentPeriods.length > 0) {
    if (newCurrentPeriods.filter(period => period.id === id).length > 0) {
      console.log('a session with that id already exists');
      return;
    }
  }
  const newPeriod = {
    id: id,
    type: type,
    completed: false,
    inserted_at: Date.now(),
    updated_at: Date.now(),
    completed_at: null,
    runId: runId,
  };
  newCurrentPeriods.push(newPeriod);

  setPeriodsCookie(newCurrentPeriods);
}

export function completePeriod(id) {
  const newCurrentPeriods = setPeriods();
  const completedPeriod = newCurrentPeriods.filter(
    period => period.id === id
  )[0];

  if (!completedPeriod) {
    console.log('Period ' + id + ' does not exist');
    return;
  }

  newCurrentPeriods.splice(newCurrentPeriods.indexOf(completedPeriod), 1);
  completedPeriod.completed = true;
  completedPeriod.updated_at = Date.now();
  completedPeriod.completed_at = Date.now();
  newCurrentPeriods.push(completedPeriod);

  setPeriodsCookie(newCurrentPeriods);
}

export function countRunsPeriod(runId, type) {
  const periods = setPeriods();
  const filteredPeriodsRunId = periods.filter(
    period => period.runId === runId && period.type == type
  );
  return filteredPeriodsRunId.length;
}
