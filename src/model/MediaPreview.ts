import {Season} from './Season';
import {Episode} from './Episode';
import {genCandidates, getBestGuessTitle} from '../helpers/helpers';
import {basename} from 'path';
import {stats} from '../helpers/types';

export class MediaPreview {
  path: string;
  targetPath: string;
  title = '';
  seasons: Season[] = [];
  totalEpisodes = 0;
  titleCandidates: stats[] = [];
  proceed = false;

  constructor(path: string) {
    this.path = path;
    this.targetPath = path;
  }

  isEmpty() {
    return (
      this.seasons
        .map((v: Season) => v.getEpisodes().length)
        .reduce((prev, current) => {
          return prev + current;
        }, 0) === 0
    );
  }

  addEpisode(episode: Episode) {
    const seasonIndex = this.seasons.findIndex(
      (v: Season) => v.seasonNumber === episode.seasonNumber
    );
    let season: Season;
    if (seasonIndex !== -1) {
      season = this.seasons[seasonIndex];
      season.addEpisode(episode);
      this.seasons[seasonIndex] = season;
    } else {
      season = new Season(episode.seasonNumber);
      season.addEpisode(episode);
      this.seasons.push(season);
    }
    this.titleCandidates = genCandidates(
      episode.titleCandidates,
      this.titleCandidates
    );
    this.title = getBestGuessTitle(this.titleCandidates);
    this.totalEpisodes++;
  }

  setTitle(title: string) {
    this.title = title;
    this.setSeasonFieldData('setTitle', title);
  }

  setTargetPath(path: string) {
    this.targetPath = path;
    this.setSeasonFieldData('setTargetPath', path);
  }

  setSeasonNumber(number: string) {
    this.setSeasonFieldData('setSeasonNumber', number);
  }

  setSeasonFieldData(
    method: 'setTargetPath' | 'setTitle' | 'setSeasonNumber',
    value: string
  ) {
    this.seasons = this.seasons.map(season => {
      season.episodes.map((episode: Episode) => {
        if (method === 'setSeasonNumber') {
          episode.setSeasonNumber(+value);
        } else if (method === 'setTitle') {
          episode.setTitle(value);
        } else if (method === 'setTargetPath') {
          episode.setTargetPath(value);
        }
        return episode;
      });
      return season;
    });
  }

  getPreview() {
    this.seasons.map(season => {
      const episodes = season.getEpisodes().map(episode => {
        return `${basename(episode.getOriginalFullName())} => ${basename(
          episode.getNewFullName()
        )}`;
      });
      season.getPreview();
      if (episodes.length > 0) {
        console.log(episodes);
      } else {
        console.log('No episodes to move.');
      }
    });
    console.log('Title: ' + this.title);
  }

  setEpisodeDelta(number: number) {
    if (this.seasons.length !== 1) {
      return;
    }
    const season = this.seasons[0];
    season.episodes = season.episodes.map(episode => {
      episode.setEpisodeDelta(number);
      return episode;
    });
  }
}
