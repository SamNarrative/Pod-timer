import Cookies from 'universal-cookie';
import { v4 as uuidv4 } from 'uuid';
import Dexie from 'dexie';
import moment from 'moment';

const feelingScoreToString = {
  '1': 'Very Poor',
  '2': 'Poor',
  '3': 'Okay',
  '4': 'Good',
  '5': 'Very Good',
};

function convertToCurrentDateTZ(epochDate) {
  const clientTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const currentDateTZ = moment
    .unix(Math.round(epochDate / 1000))
    .tz(clientTZ)
    .format('YYYY-MM-DD');
  return currentDateTZ;
}

const groupBy = (items, key) =>
  items.reduce(
    (result, item) => ({
      ...result,
      [item[key]]: [...(result[item[key]] || []), item],
    }),
    {}
  );

const feelingScoreString = {
  '1': 'Very Poor Sessions',
  '2': 'Poor Sessions',
  '3': 'Okay Sessions',
  '4': 'Good Sessions',
  '5': 'Very Good Sessions',
};

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
  feelingScore,
  periodLength`,
});

export async function deleteDatabase() {
  await db.periods.delete().then(() => {
    console.log('deleted')
  }
  );
  
  
  
 
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

export default function createNewPeriod(id, type, runId, periodLength) {
  const newPeriod = {
    id: id,
    feelingScore: 0,
    type: type,
    completed: false,
    inserted_at: Date.now(),
    updated_at: Date.now(),
    completed_at: null,
    runId: runId,
    periodLength: periodLength,
  };

  db.periods.put(newPeriod);
}

export async function completePeriod(id, feeling) {
  await db.periods.update(id, {
    completed: true,
    updated_at: Date.now(),
    completed_at: Date.now(),
    feelingScore: feeling,
  });
}

export async function countRunsPeriod(periodType) {
  const currentDate = convertToCurrentDateTZ(Date.now());
  var x = db.periods
    .where('type')
    .equals(periodType)
    .and(function(item) {
      return convertToCurrentDateTZ(item.inserted_at) === currentDate;
    });

  const count = await x.count();
  return count;
}

export async function countRunsPeriodComplete(periodType) {
  const currentDate = convertToCurrentDateTZ(Date.now());
  var x = db.periods
    .where('type')
    .equals(periodType)
    .and(function(item) {
      return (
        convertToCurrentDateTZ(item.inserted_at) === currentDate &&
        item.completed
      );
    });
  const count = await x.count();
  return count;
}

export async function sessionsCompleteTodayObject() {
  const currentDate = convertToCurrentDateTZ(Date.now());
  const result = {};
  var x = await db.periods
    .orderBy('feelingScore')
    .filter(function(period) {
      return period.type === 'session';
    })

    .and(function(item) {
      return (
        convertToCurrentDateTZ(item.inserted_at) === currentDate &&
        item.completed
      );
    });
  await x.eachKey(feeling => {
    result[feeling] = (result[feeling] || 0) + 1;
  });

  const resultToArray = Object.entries(result);

  const formattedResult = resultToArray.map(result => ({
    name: feelingScoreString[result[0]],
    value: result[1],
  }));

  return formattedResult;
}

export async function sessionsCompletePastSeven() {
  const epochDate = Date.now();
  const epochWeekAgo = Date.now() - 604800000;

  var x = await db.periods
    .orderBy('inserted_at')
    .filter(function(period) {
      return period.type === 'session';
    })

    .and(function(item) {
      return (
        item.inserted_at >= epochWeekAgo &&
        item.completed &&
        item.inserted_at <= epochDate
      );
    });

  const resultToArray = await x.toArray();

  const resultToDay = await resultToArray.map(result => {
    return {
      day: convertToCurrentDateTZ(result.inserted_at),
      feelingScore: result.feelingScore,
      periodLength: result.periodLength,
    };
  });

  const groupedDaysArray = Object.entries(groupBy(resultToDay, 'day'));
  const feelingScoreArray = groupedDaysArray.map(day => {
    const groupedArray = Object.entries(groupBy(day[1], 'feelingScore'));
    const groupedArrayScoreSummarised = Object.fromEntries(
      groupedArray.map(feeling => {
        return [
          feelingScoreToString[feeling[0]],
          feeling[1].reduce(
            (previousValue, currentValue) =>
              previousValue + currentValue.periodLength / 60,
            0
          ),
        ];
      })
    );
    const resultObject = {
      name: day[0],
      ...groupedArrayScoreSummarised,
    };

    return resultObject;
  });

  const arrayOfDates = [];
  let rollingDay = epochWeekAgo + 86400000;
  while (rollingDay <= epochDate) {
    arrayOfDates.push(convertToCurrentDateTZ(rollingDay));
    rollingDay = rollingDay + 86400000;
  }
  for (let i = 0; i < arrayOfDates.length; i++) {
    const filteredArray = feelingScoreArray.filter(
      day => day.name === arrayOfDates[i]
    );
    if (filteredArray.length === 0) {
      feelingScoreArray.push({ name: arrayOfDates[i] });
    }
  }

  const sortedFeelingScoreArray = feelingScoreArray.sort(function(a, b) {
    return new Date(a.name) - new Date(b.name);
  });

  const formattedFeelingScoreArray = sortedFeelingScoreArray.map(entry => {
    entry.name = moment(entry.name).format('Do MMM');
    return entry;
  });

  return formattedFeelingScoreArray;
}

export async function productivityPercentageTodayObject() {
  const currentDate = convertToCurrentDateTZ(Date.now());
  const result = {};
  var x = await db.periods
    .orderBy('feelingScore')
    .filter(function(period) {
      return period.type === 'session';
    })

    .and(function(item) {
      return (
        convertToCurrentDateTZ(item.inserted_at) === currentDate &&
        item.completed
      );
    });
  await x.eachKey(feeling => {
    result[feeling] = (result[feeling] || 0) + 1;
  });

  const resultToArray = Object.entries(result);

  const resultsArrayToProductivityScoreTotal = resultToArray.reduce(
    (previousValue, currentValue) => previousValue + currentValue[1],
    0
  );

  const resultsArrayToProductivityScoreLow = resultToArray
    .filter(result => Number(result[0]) < 3)
    .reduce(
      (previousValue, currentValue) => previousValue + currentValue[1],
      0
    );
  const resultsArrayToProductivityScoreOkay = resultToArray
    .filter(result => Number(result[0]) === 3)
    .reduce(
      (previousValue, currentValue) => previousValue + currentValue[1],
      0
    );
  const resultsArrayToProductivityScoreGood = resultToArray
    .filter(result => Number(result[0]) > 3)
    .reduce(
      (previousValue, currentValue) => previousValue + currentValue[1],
      0
    );
  const productiveResultsArray = [
    {
      name: 'Low Productivity',
      value:
        resultsArrayToProductivityScoreLow /
        resultsArrayToProductivityScoreTotal,
    },
    {
      name: 'Medium Productivity',
      value:
        resultsArrayToProductivityScoreOkay /
        resultsArrayToProductivityScoreTotal,
    },
    {
      name: 'High Productivity',
      value:
        resultsArrayToProductivityScoreGood /
        resultsArrayToProductivityScoreTotal,
    },
  ];

  return productiveResultsArray;
}

export async function productivityPercentageTodayOutcome() {
  const currentDate = convertToCurrentDateTZ(Date.now());
  const result = {};
  var x = await db.periods
    .orderBy('feelingScore')
    .filter(function(period) {
      return period.type === 'session';
    })

    .and(function(item) {
      return (
        convertToCurrentDateTZ(item.inserted_at) === currentDate &&
        item.completed
      );
    });
  await x.eachKey(feeling => {
    result[feeling] = (result[feeling] || 0) + 1;
  });

  const resultToArray = Object.entries(result);

  const resultsArrayToProductivityScoreTotal = resultToArray.reduce(
    (previousValue, currentValue) => previousValue + currentValue[1],
    0
  );

  const resultsArrayToProductivityScoreOkay = resultToArray
    .filter(result => Number(result[0]) === 3)
    .reduce(
      (previousValue, currentValue) => previousValue + currentValue[1],
      0
    );
  const resultsArrayToProductivityScoreGood = resultToArray
    .filter(result => Number(result[0]) > 3)
    .reduce(
      (previousValue, currentValue) => previousValue + currentValue[1],
      0
    );

  if (resultsArrayToProductivityScoreTotal < 1) {
    return 0;
  }

  const productivePercentage =
    (resultsArrayToProductivityScoreOkay +
      resultsArrayToProductivityScoreGood) /
    resultsArrayToProductivityScoreTotal;

  return productivePercentage;
}
