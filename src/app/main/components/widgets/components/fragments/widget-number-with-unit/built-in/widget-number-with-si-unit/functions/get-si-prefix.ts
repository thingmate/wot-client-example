export interface ISiPrefix {
  name: string;
  symbol: string;
  factor: number;
}

const SI_PREFIXES: ISiPrefix[] = [
  {
    name: 'quecto',
    symbol: 'q',
    factor: 1e-30,
  },
  {
    name: 'ronto',
    symbol: 'r',
    factor: 1e-27,
  },
  {
    name: 'yocto',
    symbol: 'y',
    factor: 1e-24,
  },
  {
    name: 'zepto',
    symbol: 'z',
    factor: 1e-21,
  },
  {
    name: 'atto',
    symbol: 'a',
    factor: 1e-18,
  },
  {
    name: 'femto',
    symbol: 'f',
    factor: 1e-15,
  },
  {
    name: 'pico',
    symbol: 'p',
    factor: 1e-12,
  },
  {
    name: 'nano',
    symbol: 'n',
    factor: 1e-9,
  },
  {
    name: 'micro',
    symbol: 'μ',
    factor: 1e-6,
  },
  {
    name: 'micro',
    symbol: 'μ',
    factor: 1e-6,
  },
  {
    name: 'milli',
    symbol: 'm',
    factor: 1e-3,
  },
  {
    name: '',
    symbol: '',
    factor: 1,
  },
  {
    name: 'kilo',
    symbol: 'k',
    factor: 1e+3,
  },
  {
    name: 'mega',
    symbol: 'M',
    factor: 1e+6,
  },
  {
    name: 'giga',
    symbol: 'G',
    factor: 1e+9,
  },
  {
    name: 'tera',
    symbol: 'T',
    factor: 1e+12,
  },
  {
    name: 'peta',
    symbol: 'P',
    factor: 1e+15,
  },
  {
    name: 'exa',
    symbol: 'E',
    factor: 1e+18,
  },
  {
    name: 'zetta',
    symbol: 'Z',
    factor: 1e+21,
  },
  {
    name: 'yotta',
    symbol: 'Y',
    factor: 1e+24,
  },
  {
    name: 'ronna',
    symbol: 'R',
    factor: 1e+27,
  },
  {
    name: 'quetta',
    symbol: 'Q',
    factor: 1e+30,
  },
];

const SI_PREFIX_FACTOR_ONE_INDEX = Math.floor(SI_PREFIXES.length / 2);

export function getSiPower(
  value: number,
): number {
  return Math.floor(Math.log(Math.abs(value)) / Math.log(1e3));
}

export function getSiPrefix(
  value: number,
): ISiPrefix {
  if (value === 0) {
    return SI_PREFIXES[SI_PREFIX_FACTOR_ONE_INDEX];
  } else {
    const index: number = Math.max(0, Math.min(SI_PREFIXES.length - 1, getSiPower(value) + SI_PREFIX_FACTOR_ONE_INDEX));
    return SI_PREFIXES[index];
  }
}

export type IValueAndSiPrefix = [
  value: string,
  prefix: string,
];

export function formatSi(
  value: number,
  precision: number,
): IValueAndSiPrefix {
  const siPrefix: ISiPrefix = getSiPrefix(value);
  return [
    (value / siPrefix.factor).toPrecision(precision).replace(/\.0*$/, ''),
    siPrefix.symbol,
  ];
}

export type IValueAndSiUnit = [
  value: string,
  unit: string,
];

export function formatValueAndSiUnit(
  value: number,
  unit: string,
  precision: number,
): IValueAndSiUnit {
  const [_value, prefix]: IValueAndSiPrefix = formatSi(value, precision);
  return [
    _value,
    `${prefix}${unit}`,
  ];
}
