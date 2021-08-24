import {Episode} from './Episode';
import {paddingLeft} from '../helpers/helpers';
import {SPECIAL_SEASON} from '../helpers/constants';

export class Season {
  year = 2021;
  seasonNumber: number;
  episodes: Episode[] = [];

  constructor(seasonNumber: number) {
    this.seasonNumber = seasonNumber;
  }

  addEpisode(episode: Episode) {
    this.episodes.push(episode);
  }

  setYear(year: number) {
    this.year = year;
  }

  getDirectory() {
    return this.episodes[0].getDirectory();
  }

  getEpisodes() {
    return this.episodes.filter((v: Episode) => !v.isSame());
  }

  getPreview() {
    if (this.seasonNumber === 0) {
      return SPECIAL_SEASON;
    }
    return 'Season ' + paddingLeft(this.seasonNumber, '00');
  }
}
