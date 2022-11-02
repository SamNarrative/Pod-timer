import Cookies from 'universal-cookie';

function setPeriods() {
  const cookies = new Cookies();
  const periodCookie = cookies.get('currentPeriods');
  let currentPeriods = periodCookie ? periodCookie : [];

  console.log('Current Periods = ');
  console.log(currentPeriods);

  return currentPeriods;
}

function setPeriodsCookie(periods) {
  const cookies = new Cookies();
  cookies.set('currentPeriods', periods, { path: '/' });
}

function createNewPeriod(id, type) {
  const newCurrentPeriods = setPeriods();
  console.log(newCurrentPeriods.length);

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
  };

  console.log(newCurrentPeriods);
  newCurrentPeriods.push(newPeriod);

  setPeriodsCookie(newCurrentPeriods);
}

function completePeriod(id) {
  const newCurrentPeriods = setPeriods();
  const completedPeriod = newCurrentPeriods.filter(
    period => period.id === id
  )[0];

  if (!completedPeriod) {
    console.log('Period' + id + ' does not exist');
    return;
  }

  newCurrentPeriods.splice(newCurrentPeriods.indexOf(completedPeriod), 1);
  completedPeriod.completed = true;
  completedPeriod.updated_at = Date.now();
  completedPeriod.completed_at = Date.now();
  newCurrentPeriods.push(completedPeriod);

  setPeriodsCookie(newCurrentPeriods());
}

export default function testSavePeriods() {
  createNewPeriod('d5fba13b-8eae-438d-a64d-1b499000f858', 'session');
}
