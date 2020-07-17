import React from 'react';
import { action } from '@storybook/addon-actions';
import { Weekly } from '../Weekly';

export default {
  title: 'Weekly',
  component: Weekly,
};

const data = {
  empty: {},
  one_day: {
    '2020-07-15': 13,
  },
  month: {
    '2020-07-11': 1,
    '2020-07-15': 65,
    '2020-07-03': 13,
    '2020-07-06': 12,
    '2020-07-18': 10,
  },
  sparse: {
    '2020-07-11': 1,
    '2020-07-03': 13,
    '2020-07-06': 12,
    '2020-07-29': 10,
  }
};

export const Simple = () => (
  <Weekly data={data.one_day} onClick={action('clicked')} />
);

export const Month = () => (
  <Weekly data={data.month} onClick={action('clicked')} />
);

export const Sparse = () => (
  <Weekly data={data.sparse} onClick={action('clicked')} />
);
