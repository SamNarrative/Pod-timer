import Cookies from 'universal-cookie';
import { v4 as uuidv4 } from 'uuid';
import Dexie from 'dexie';
import moment from 'moment';

function convertToCurrentDateTZ(epochDate) {
  const clientTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const currentDateTZ = moment
    .unix(Math.round(Date.now() / 1000))
    .tz(clientTZ)
    .format('YYYY-MM-DD');
  return currentDateTZ;
}

var db = new Dexie('PeriodDatabase');
db.version(2).stores({
  periods: `
  id,
  type,
  completed,
  inserted_at,
  updated_at,
  completed_at,
  runId,
  feelingScore`,
});

export function getSetRunId() {
  const cookies = new Cookies();
  const runIdCookie = cookies.get('runId');
  let runId = runIdCookie ? runIdCookie : uuidv4();
  cookies.set('runId', runId, {
    path: '/',
  });
  return runId;
}

export default function createNewPeriod(id, type, runId) {
  const newPeriod = {
    id: id,
    feelingScore: 0,
    type: type,
    completed: false,
    inserted_at: Date.now(),
    updated_at: Date.now(),
    completed_at: null,
    runId: runId,
  };

  db.periods.put(newPeriod);
}

export async function completePeriod(id, feeling) {
  console.log('feeling', feeling);
  await db.periods.update(id, {
    completed: true,
    updated_at: Date.now(),
    completed_at: Date.now(),
    feelingScore: feeling,
  });
}

export async function countRunsPeriod(periodRunId, periodType) {
  const currentDate = convertToCurrentDateTZ(Date.now());
  var x = db.periods.where('type').equals(periodType)
  .and(function(item) { return convertToCurrentDateTZ(item.inserted_at) === currentDate});

  const count = await x.count();
  return count;
}
