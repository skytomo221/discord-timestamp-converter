import * as dayjs from 'dayjs'
import convert from '../src/convert';

test('returns empty string', () => {
  expect(convert('')).toBe('');
});

describe("English", () => {
  test('returns 2 days ago', () => {
    const unixtime = dayjs().subtract(2, 'day').unix();
    expect(convert('<2 days ago>')).toBe(`<t:${unixtime}:d>`);
  });
});

describe("Japanese", () => {
  test('returns 1 seconds ago', () => {
    const unixtime = dayjs().subtract(1, 'second').unix();
    expect(convert('〈1秒前〉')).toBe(`<t:${unixtime}:d>`);
  });

  test('returns 2 minutes ago', () => {
    const unixtime = dayjs().subtract(2, 'minute').unix();
    expect(convert('〈2分前〉')).toBe(`<t:${unixtime}:d>`);
  });

  test('returns 3 hours ago', () => {
    const unixtime = dayjs().subtract(3, 'hour').unix();
    expect(convert('〈3時間前〉')).toBe(`<t:${unixtime}:d>`);
  });

  test('returns 4 days ago', () => {
    const unixtime = dayjs().subtract(2, 'day').unix();
    expect(convert('〈2日前〉')).toBe(`<t:${unixtime}:d>`);
  });

  test('returns 6 months ago', () => {
    const unixtime = dayjs().subtract(6, 'month').unix();
    expect(convert('〈6か月前〉')).toBe(`<t:${unixtime}:d>`);
  });

  test('returns 7 years ago', () => {
    const unixtime = dayjs().subtract(7, 'year').unix();
    expect(convert('〈7年前〉')).toBe(`<t:${unixtime}:d>`);
  });

  test('returns 2023-12-31 11:23:45', () => {
    const unixtime = dayjs('2023-12-31T11:23:45').unix();
    expect(convert('〈2023年12月31日11時23分45秒〉')).toBe(`<t:${unixtime}:d>`);
  });

  test('returns 1 seconds later', () => {
    const unixtime = dayjs().add(1, 'second').unix();
    expect(convert('〈1秒後〉')).toBe(`<t:${unixtime}:d>`);
  });

  test('returns 2 minutes later', () => {
    const unixtime = dayjs().add(2, 'minute').unix();
    expect(convert('〈2分後〉')).toBe(`<t:${unixtime}:d>`);
  });

  test('returns 3 hours later', () => {
    const unixtime = dayjs().add(3, 'hour').unix();
    expect(convert('〈3時間後〉')).toBe(`<t:${unixtime}:d>`);
  });

  test('returns 4 days later', () => {
    const unixtime = dayjs().add(4, 'day').unix();
    expect(convert('〈4日後〉')).toBe(`<t:${unixtime}:d>`);
  });

  test('returns 6 months later', () => {
    const unixtime = dayjs().add(6, 'month').unix();
    expect(convert('〈6か月後〉')).toBe(`<t:${unixtime}:d>`);
  });

  test('returns 7 years later', () => {
    const unixtime = dayjs().add(7, 'year').unix();
    expect(convert('〈7年後〉')).toBe(`<t:${unixtime}:d>`);
  });
});
