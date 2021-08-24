import {basename, dirname, extname, resolve} from 'path';
import {MatchResult, stats} from '../helpers/types';
import {
  additionalInfoMatchers,
  episodeMatchers,
  seasonMatchers,
} from '../helpers/matchers';
import {
  genCandidates,
  getBestGuessTitle,
  getResultByMatcher,
  getStats,
  paddingLeft,
  removeStringByMatcher,
} from '../helpers/helpers';
import {SPECIAL_SEASON} from '../helpers/constants';

export class Episode {
  path = '';
  fileName: string;
  episode = 0;
  episodeDelta = 0;
  seasonNumber = 0;
  title = '';
  titleCandidates: stats[] = [];

  constructor(fileName: string, path: string) {
    this.fileName = fileName;
    this.path = path;
    this.init();
  }
  getEpisode = (input: string): MatchResult | null =>
    getResultByMatcher(input, episodeMatchers);

  getSeason = (input: string): MatchResult | null =>
    getResultByMatcher(input, seasonMatchers);

  init() {
    let fileName = removeStringByMatcher(this.fileName, additionalInfoMatchers);

    const seasonResult = this.getSeason(fileName);
    if (seasonResult) {
      this.seasonNumber = seasonResult.value;
      fileName = fileName.replace(seasonResult.source, '|');
    } else {
      const result = this.getSeason(this.getOriginalFullName());
      if (result) {
        this.seasonNumber = result.value;
      }
    }
    if (this.isFirstSeason()) {
      this.seasonNumber = 1;
    }

    const episodeResult = this.getEpisode(fileName);
    if (episodeResult) {
      if (episodeResult.source.match(/sp/i)) {
        this.seasonNumber = 0;
      }
      this.episode = episodeResult.value;
      fileName = fileName.replace(episodeResult.source, '|');
    }

    if (this.episode === 0) {
      this.seasonNumber = 0;
    }

    this.titleCandidates = genCandidates(getStats(fileName));

    this.title = getBestGuessTitle(this.titleCandidates);
  }

  private isFirstSeason() {
    return (
      this.seasonNumber === 0 &&
      !this.path.match(/season/i) &&
      !this.fileName.match(/special/i) &&
      !this.path.match(/special/i)
    );
  }

  isSame() {
    return this.getOriginalFullName() === this.getNewFullName();
  }

  getDirectory() {
    return dirname(this.getNewFullName());
  }

  setTitle(title: string) {
    this.title = title;
  }

  getSeasonPath() {
    if (this.path.match(/season/i)) {
      return '';
    }
    if (this.path.match(/specials/i)) {
      return '';
    }
    if (this.seasonNumber === 0) {
      return SPECIAL_SEASON;
    }
    return 'Season ' + paddingLeft(this.seasonNumber, '00');
  }

  getOriginalFullName() {
    return resolve(this.path, this.fileName);
  }

  getNewFullName() {
    return resolve(this.path, this.getSeasonPath(), this.getEpisodeFileName());
  }

  getEpisodeFileName() {
    const extName = this.getExtName();
    const episodeName = this.getEpisodeName();
    const seasonName = this.getSeasonName();

    return `${this.title} ${seasonName}${episodeName}${extName}`;
  }

  setEpisodeDelta(number: number) {
    this.episodeDelta = number;
  }

  private getExtName() {
    let extName = extname(this.fileName);
    if (extName === '.srt' || extName === '.ass' || extName === '.ssa') {
      const langCode = extname(basename(this.fileName, extName));
      if (langCode.length === 4 || langCode.length === 3) {
        extName = langCode + extName;
      }
    }
    return extName;
  }

  private getSeasonName() {
    return `S${paddingLeft(this.seasonNumber, '00')}`;
  }

  private getEpisodeName() {
    let ep: number;
    if (this.episodeDelta > 0 && this.episode >= this.episodeDelta) {
      ep = this.episode - this.episodeDelta + 1;
    } else {
      ep = this.episode;
    }

    const episodeLength = ('' + ep).length;
    const format = '0'.repeat(episodeLength > 2 ? episodeLength : 2);
    return `E${paddingLeft(ep, format)}`;
  }
}
