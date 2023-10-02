import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import './style.scss';

type Rule = {
  language: string;
  pattern: string;
  type: 'abusolute' | 'future' | 'now' | 'past';
};

const openBrakets = ['<', '〈', '＜'];
const closeBrakets = ['>', '〉', '＞'];
const rules: Rule[] = [
  {
    language: 'en',
    pattern: '(?<days>\\d+) days ago(:|\\s)?(?<format>[tTdDfFR])?',
    type: 'past',
  },
  {
    language: 'en',
    pattern: '(?<hours>\\d+) hours ago(:|\\s)?(?<format>[tTdDfFR])?',
    type: 'past',
  },
  {
    language: 'en',
    pattern: '(?<minutes>\\d+) minutes ago(:|\\s)?(?<format>[tTdDfFR])?',
    type: 'past',
  },
  {
    language: 'en',
    pattern: '(?<seconds>\\d+) seconds ago(:|\\s)?(?<format>[tTdDfFR])?',
    type: 'past',
  },
  {
    language: 'ja',
    pattern: '(?<days>\\d+)日([:：]|\\s)?(?<format>[tTdDfFR])?',
    type: 'abusolute',
  },
  {
    language: 'ja',
    pattern: '(?<years>\\d+)年後([:：]|\\s)?(?<format>[tTdDfFR])?',
    type: 'future',
  },
  {
    language: 'ja',
    pattern: '(?<months>\\d+)[かカヵヶ]月後([:：]|\\s)?(?<format>[tTdDfFR])?',
    type: 'future',
  },
  {
    language: 'ja',
    pattern: '(?<days>\\d+)日後([:：]|\\s)?(?<format>[tTdDfFR])?',
    type: 'future',
  },
  {
    language: 'ja',
    pattern: '(?<hours>\\d+)時間後([:：]|\\s)?(?<format>[tTdDfFR])?',
    type: 'future',
  },
  {
    language: 'ja',
    pattern: '(?<minutes>\\d+)分後([:：]|\\s)?(?<format>[tTdDfFR])?',
    type: 'future',
  },
  {
    language: 'ja',
    pattern: '(?<seconds>\\d+)秒後([:：]|\\s)?(?<format>[tTdDfFR])?',
    type: 'future',
  },
  {
    language: 'ja',
    pattern: '今([:：]|\\s)?(?<format>[tTdDfFR])?',
    type: 'now',
  },
  {
    language: 'ja',
    pattern: '(?<days>\\d+)日前([:：]|\\s)?(?<format>[tTdDfFR])?',
    type: 'past',
  },
  {
    language: 'ja',
    pattern: '(?<hours>\\d+)時間前([:：]|\\s)?(?<format>[tTdDfFR])?',
    type: 'past',
  },
  {
    language: 'ja',
    pattern: '(?<minutes>\\d+)分前([:：]|\\s)?(?<format>[tTdDfFR])?',
    type: 'past',
  },
  {
    language: 'ja',
    pattern: '(?<seconds>\\d+)秒前([:：]|\\s)?(?<format>[tTdDfFR])?',
    type: 'past',
  },
];

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
    const time = new Date();
    const { groups } = match;
    if (!groups) {
      const unixtime = Math.floor(time.getTime() / 1000);
      return previousText.replace(match[0], `<t:${unixtime}>`);
    }
    const format = normalizeDiscordUnixtimeFormat(groups.format) || '';
    const {
      years, months, days, hours, minutes, seconds,
    } = groups;
    switch (type) {
      case 'abusolute':
        if (years) {
          time.setFullYear(parseInt(years, 10) || 0);
          time.setMonth(parseInt(months, 10) || 0);
          time.setDate(parseInt(days, 10) || 0);
          time.setHours(parseInt(hours, 10) || 0);
          time.setMinutes(parseInt(minutes, 10) || 0);
          time.setSeconds(parseInt(seconds, 10) || 0);
        } else if (months) {
          time.setMonth(parseInt(months, 10));
          time.setDate(parseInt(days, 10) || 0);
          time.setHours(parseInt(hours, 10) || 0);
          time.setMinutes(parseInt(minutes, 10) || 0);
          time.setSeconds(parseInt(seconds, 10) || 0);
        } else if (days) {
          time.setDate(parseInt(days, 10) || 0);
          time.setHours(parseInt(hours, 10) || 0);
          time.setMinutes(parseInt(minutes, 10) || 0);
          time.setSeconds(parseInt(seconds, 10) || 0);
        } else if (hours) {
          time.setHours(parseInt(hours, 10) || 0);
          time.setMinutes(parseInt(minutes, 10) || 0);
          time.setSeconds(parseInt(seconds, 10) || 0);
        } else if (minutes) {
          time.setMinutes(parseInt(minutes, 10) || 0);
          time.setSeconds(parseInt(seconds, 10) || 0);
        } else if (seconds) {
          time.setSeconds(parseInt(seconds, 10) || 0);
        }
        break;
      case 'future':
        if (years) {
          time.setFullYear(time.getFullYear() + parseInt(years, 10) || 0);
          time.setMonth(time.getMonth() + parseInt(months, 10) || 0);
          time.setDate(time.getDate() + parseInt(days, 10) || 0);
          time.setHours(time.getHours() + parseInt(hours, 10) || 0);
          time.setMinutes(time.getMinutes() + parseInt(minutes, 10) || 0);
          time.setSeconds(time.getSeconds() + parseInt(seconds, 10) || 0);
        } else if (months) {
          time.setMonth(time.getMonth() + parseInt(months, 10));
          time.setDate(time.getDate() + parseInt(days, 10) || 0);
          time.setHours(time.getHours() + parseInt(hours, 10) || 0);
          time.setMinutes(time.getMinutes() + parseInt(minutes, 10) || 0);
          time.setSeconds(time.getSeconds() + parseInt(seconds, 10) || 0);
        } else if (days) {
          time.setDate(time.getDate() + parseInt(days, 10) || 0);
          time.setHours(time.getHours() + parseInt(hours, 10) || 0);
          time.setMinutes(time.getMinutes() + parseInt(minutes, 10) || 0);
          time.setSeconds(time.getSeconds() + parseInt(seconds, 10) || 0);
        } else if (hours) {
          time.setHours(time.getHours() + parseInt(hours, 10) || 0);
          time.setMinutes(time.getMinutes() + parseInt(minutes, 10) || 0);
          time.setSeconds(time.getSeconds() + parseInt(seconds, 10) || 0);
        } else if (minutes) {
          time.setMinutes(time.getMinutes() + parseInt(minutes, 10) || 0);
          time.setSeconds(time.getSeconds() + parseInt(seconds, 10) || 0);
        } else if (seconds) {
          time.setSeconds(time.getSeconds() + parseInt(seconds, 10) || 0);
        }
        break;
      case 'past':
        if (years) {
          time.setFullYear(time.getFullYear() - parseInt(years, 10) || 0);
          time.setMonth(time.getMonth() - parseInt(months, 10) || 0);
          time.setDate(time.getDate() - parseInt(days, 10) || 0);
          time.setHours(time.getHours() - parseInt(hours, 10) || 0);
          time.setMinutes(time.getMinutes() - parseInt(minutes, 10) || 0);
          time.setSeconds(time.getSeconds() - parseInt(seconds, 10) || 0);
        } else if (months) {
          time.setMonth(time.getMonth() - parseInt(months, 10));
          time.setDate(time.getDate() - parseInt(days, 10) || 0);
          time.setHours(time.getHours() - parseInt(hours, 10) || 0);
          time.setMinutes(time.getMinutes() - parseInt(minutes, 10) || 0);
          time.setSeconds(time.getSeconds() - parseInt(seconds, 10) || 0);
        } else if (days) {
          time.setDate(time.getDate() - parseInt(days, 10) || 0);
          time.setHours(time.getHours() - parseInt(hours, 10) || 0);
          time.setMinutes(time.getMinutes() - parseInt(minutes, 10) || 0);
          time.setSeconds(time.getSeconds() - parseInt(seconds, 10) || 0);
        } else if (hours) {
          time.setHours(time.getHours() - parseInt(hours, 10) || 0);
          time.setMinutes(time.getMinutes() - parseInt(minutes, 10) || 0);
          time.setSeconds(time.getSeconds() - parseInt(seconds, 10) || 0);
        } else if (minutes) {
          time.setMinutes(time.getMinutes() - parseInt(minutes, 10) || 0);
          time.setSeconds(time.getSeconds() - parseInt(seconds, 10) || 0);
        } else if (seconds) {
          time.setSeconds(time.getSeconds() - parseInt(seconds, 10) || 0);
        }
        break;
      default:
    }
    console.log(match);
    const unixtime = Math.floor(time.getTime() / 1000);
    return previousText.replace(
      match[0],
      `<t:${[unixtime, format].join(':')}>`,
    );
  }, text);
}

function convert(input: string): string {
  return rules.reduce(replace, toHenkaku(input));
}

export default function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const copyToClipboard = async () => {
    await global.navigator.clipboard.writeText(output);
  };
  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#5865f2',
      },
      background: {
        default: '#2f3136',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box component="main" m={2}>
        <Box className="box">
          {output}
          <Tooltip title="Copy to Clipboard" placement="top" arrow>
            <IconButton
              color="primary"
              size="small"
              onClick={() => copyToClipboard()}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Box className="box">
          <TextField
            fullWidth
            label="メッセージを入力"
            multiline
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setInput(event.target.value);
              setOutput(convert(event.target.value));
            }}
            value={input}
            variant="outlined"
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
