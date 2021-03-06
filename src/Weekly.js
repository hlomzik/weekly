import React from 'react';

import './Weekly.css';

const firstDayOfTheWeek = 1;
const DAY = 86400 * 1000;

const dayOfTheWeek = day => (day + 7 - firstDayOfTheWeek) % 7;

const datesOfTheWeek = (year, week) => {
  const jan1 = new Date(year, 0, 1);
  console.log('JAN 1', week, jan1);
  const base = 1 + week * 7 - dayOfTheWeek(jan1.getDay());
  const days = {};
  for (let i = 0; i < 7; i++) {
    const day = new Date(year, 0, base + i).toISOString().substr(0, 10);
    days[day] = null;
  }
  return days;
}

const formatDate = (date, locale) => date.toLocaleString(locale, {day:'numeric', month: 'numeric'});

const getMinMax = (values) => {
  if (!values || !values.length) return [-Infinity, Infinity];
  let min = values[0];
  let max = min;
  for (let v of values) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  return [min, max];
}

const MIN_OPACITY = 0.3;

const interpolate = (color, value, [min, max]) => {
  if (value === undefined || value === null) return '#eee';

  const opacity = (min === max)
    ? 1
    : MIN_OPACITY + (1 - MIN_OPACITY) * (value - min) / (max - min);

  if (color.startsWith('#')) {
    return color + parseInt((color.length === 4 ? 15 : 255) * opacity).toString(16);
  }
  if (color.startsWith('rgba')) {
    return color.replace(/[\d.]+\)/, a => (a * opacity).toFixed(1));
  }
  if (color.startsWith('rgb')) {
    return color.replace(')', opacity.toFixed(1));
  }
  return color;
}

const Week = ({ color = 'orange', minmax, week, withGap }) => {
  const days = Object.keys(week);
  return (
    <div className="weekly-week">
      {withGap && <div className="weekly-gap" />}
      {days.map(day => (
        <div
          className="weekly-day"
          style={{ backgroundColor: interpolate(color, week[day], minmax) }}
        >{week[day]}</div>
      ))}
      <div className="weekly-days">
        {formatDate(new Date(days[0]))}&nbsp;&ndash;&nbsp;{formatDate(new Date(days[6]))}
      </div>
    </div>
  );
}

export const Weekly = ({ color, data, locale }) => {
  const days = Object.keys(data).sort();
  const weeks = {};
  const first = new Date(days[0]);
  const year = first.getFullYear();
  const jan1 = new Date(year, 0, 1);
  const firstDateOfTheFirstWeek = jan1 - DAY * dayOfTheWeek(jan1.getDay());

  const [min, max] = getMinMax(Object.values(data));

  for (let day of days) {
    const week = Math.floor((new Date(day) - firstDateOfTheFirstWeek) / (DAY*7));
    if (!weeks[week]) {
      weeks[week] = datesOfTheWeek(year, week);
    }
    weeks[week][day] = data[day];
  }

  const week_numbers = Object.keys(weeks);

  return (
    <div>{week_numbers.map((week, i) => (
      <Week
        color={color}
        minmax={[min, max]}
        week={weeks[week]}
        withGap={!!i && (week - week_numbers[i - 1] > 1)}
      />
    ))}</div>
  )
}
