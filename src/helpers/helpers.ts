import {specialCharactersMatcher} from './matchers';
import {MatchResult, stats} from './types';

export const getBestGuessTitle = (titleCandidates: stats[]): string => {
  const {name} = titleCandidates.reduce(
    (old, current) => {
      if (old.count < current.count) {
        return current;
      } else {
        return old;
      }
    },
    {name: '', count: 0}
  );
  return name;
};
export const genCandidates = (
  items: stats[],
  results: stats[] = []
): stats[] => {
  items.map((item, number) => {
    const index = results.findIndex(result => result.name === item.name);
    const statsCount = items.length - number;
    if (index !== -1) {
      results[index]['count'] += statsCount;
    } else {
      results.push(item);
    }
  });
  return results;
};
export const getStats = (input: string): stats[] => {
  const names = input
    .replace(specialCharactersMatcher, '|')
    .split('|')
    .filter(v => v.length > 0 && isNaN(+v))
    .map(name => {
      return name.trim();
    })
    .slice(0, 3);
  return names.map(name => ({
    name,
    count: 1,
  }));
};
export const getResultByMatcher = (
  input: string,
  matchers: RegExp[]
): MatchResult | null => {
  for (const matcher of matchers) {
    const matches = input.match(matcher);
    if (matches && matches.length > 1 && matches[1]) {
      return {
        source: matches[0],
        value: +matches[1],
      };
    }
  }
  return null;
};
export const removeStringByMatcher = (input: string, matchers: RegExp[]) => {
  let result = input;
  for (const key in matchers) {
    result = result.replace(matchers[key], '|');
  }
  return result;
};

export const paddingLeft = (value: number, paddingValue: string): string => {
  return String(paddingValue + value).slice(-paddingValue.length);
};
