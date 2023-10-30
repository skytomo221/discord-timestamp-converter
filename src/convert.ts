import * as dayjs from 'dayjs';
import * as rules from './rules.json';

type Rule = {
  language: string;
  pattern: string;
  type: 'abusolute' | 'future' | 'now' | 'past';
};

const openBrakets = ['<', '〈', '＜'];
const closeBrakets = ['>', '〉', '＞'];

function toHenkaku(string: string): string {
  return string.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0));
}

function normalizeDiscordUnixtimeFormat(string: string): string {
  if (/[t]/.test(string)) return 't';
  if (/[T]/.test(string)) return 'T';
  if (/[d]/.test(string)) return 'd';
  if (/[D]/.test(string)) return 'D';
  if (/[f]/.test(string)) return 'f';
  if (/[F]/.test(string)) return 'F';
  if (/[R]/.test(string)) return 'R';
  return undefined;
}

function replace(text: string, rule: Rule) {
  const { type } = rule;
  return [
    ...text.matchAll(
      new RegExp(
        `[${openBrakets.join('')}](${rule.pattern})[${closeBrakets.join('')}]`,
        'g',
      ),
    ),
  ].reduce((previousText, match) => {
    let time = dayjs(new Date());
    const { groups } = match;
    if (!groups) {
      const unixtime = Math.floor(time.unix());
      return previousText.replace(match[0], `<t:${unixtime}>`);
    }
    const format = normalizeDiscordUnixtimeFormat(groups.format) || '';
    const {
      years, months, days, hours, minutes, seconds,
    } = groups;
    switch (type) {
      case 'abusolute':
        if (years) {
          time = time
            .set('year', parseInt(years, 10) || 0)
            .set('month', parseInt(months, 10) || 0)
            .set('day', parseInt(days, 10) || 0)
            .set('hour', parseInt(hours, 10) || 0)
            .set('minute', parseInt(minutes, 10) || 0)
            .set('second', parseInt(seconds, 10) || 0);
        } else if (months) {
          time = time
            .set('month', parseInt(months, 10) || 0)
            .set('day', parseInt(days, 10) || 0)
            .set('hour', parseInt(hours, 10) || 0)
            .set('minute', parseInt(minutes, 10) || 0)
            .set('second', parseInt(seconds, 10) || 0);
        } else if (days) {
          time = time
            .set('day', parseInt(days, 10) || 0)
            .set('hour', parseInt(hours, 10) || 0)
            .set('minute', parseInt(minutes, 10) || 0)
            .set('second', parseInt(seconds, 10) || 0);
        } else if (hours) {
          time = time
            .set('hour', parseInt(hours, 10) || 0)
            .set('minute', parseInt(minutes, 10) || 0)
            .set('second', parseInt(seconds, 10) || 0);
        } else if (minutes) {
          time = time
            .set('minute', parseInt(minutes, 10) || 0)
            .set('second', parseInt(seconds, 10) || 0);
        } else if (seconds) {
          time = time.set('second', parseInt(seconds, 10) || 0);
        }
        break;
      case 'future':
        if (years) {
          time = time
            .add(parseInt(years, 10) || 0, 'year')
            .add(parseInt(months, 10) || 0, 'month')
            .add(parseInt(days, 10) || 0, 'day')
            .add(parseInt(hours, 10) || 0, 'hour')
            .add(parseInt(minutes, 10) || 0, 'minute')
            .add(parseInt(seconds, 10) || 0, 'second');
        } else if (months) {
          time = time
            .add(parseInt(months, 10) || 0, 'month')
            .add(parseInt(days, 10) || 0, 'day')
            .add(parseInt(hours, 10) || 0, 'hour')
            .add(parseInt(minutes, 10) || 0, 'minute')
            .add(parseInt(seconds, 10) || 0, 'second');
        } else if (days) {
          time = time
            .add(parseInt(days, 10) || 0, 'day')
            .add(parseInt(hours, 10) || 0, 'hour')
            .add(parseInt(minutes, 10) || 0, 'minute')
            .add(parseInt(seconds, 10) || 0, 'second');
        } else if (hours) {
          time = time
            .add(parseInt(hours, 10) || 0, 'hour')
            .add(parseInt(minutes, 10) || 0, 'minute')
            .add(parseInt(seconds, 10) || 0, 'second');
        } else if (minutes) {
          time = time
            .add(parseInt(minutes, 10) || 0, 'minute')
            .add(parseInt(seconds, 10) || 0, 'second');
        } else if (seconds) {
          time = time.add(parseInt(seconds, 10) || 0, 'second');
        }
        break;
      case 'past':
        if (years) {
          time = time
            .subtract(parseInt(years, 10) || 0, 'year')
            .subtract(parseInt(months, 10) || 0, 'month')
            .subtract(parseInt(days, 10) || 0, 'day')
            .subtract(parseInt(hours, 10) || 0, 'hour')
            .subtract(parseInt(minutes, 10) || 0, 'minute')
            .subtract(parseInt(seconds, 10) || 0, 'second');
        } else if (months) {
          time = time
            .subtract(parseInt(months, 10) || 0, 'month')
            .subtract(parseInt(days, 10) || 0, 'day')
            .subtract(parseInt(hours, 10) || 0, 'hour')
            .subtract(parseInt(minutes, 10) || 0, 'minute')
            .subtract(parseInt(seconds, 10) || 0, 'second');
        } else if (days) {
          time = time
            .subtract(parseInt(days, 10) || 0, 'day')
            .subtract(parseInt(hours, 10) || 0, 'hour')
            .subtract(parseInt(minutes, 10) || 0, 'minute')
            .subtract(parseInt(seconds, 10) || 0, 'second');
        } else if (hours) {
          time = time
            .subtract(parseInt(hours, 10) || 0, 'hour')
            .subtract(parseInt(minutes, 10) || 0, 'minute')
            .subtract(parseInt(seconds, 10) || 0, 'second');
        } else if (minutes) {
          time = time
            .subtract(parseInt(minutes, 10) || 0, 'minute')
            .subtract(parseInt(seconds, 10) || 0, 'second');
        } else if (seconds) {
          time = time.subtract(parseInt(seconds, 10) || 0, 'second');
        }
        break;
      default:
    }
    const unixtime = Math.floor(time.unix());
    return previousText.replace(
      match[0],
      `<t:${[unixtime, format].join(':')}>`,
    );
  }, text);
}

export default function convert(input: string): string {
  // FIXME: JSON ファイルを直接読み込むと、以下の警告が出てしまうため、一度配列に展開しています。
  // export 'reduce' (imported as 'rules') was not found in './rules.json'
  // (possible exports: 0, 1, 10, 11, 12, 13, 14, 15, 2, 3, 4, 5, 6, 7, 8, 9)
  return [...rules].reduce(replace, toHenkaku(input));
}
