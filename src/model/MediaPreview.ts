import {Season} from './Season';
import {Episode} from './Episode';
import {genCandidates, getBestGuessTitle} from '../helpers/helpers';
import {basename} from 'path';
import {stats} from '../helpers/types';

export class MediaPreview {
  path: string;
  title = '';
  seasons: Season[] = [];
  totalEpisodes = 0;
  titleCandidates: stats[] = [];
  proceed = false;

  constructor(path: string) {
    this.path = path;
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
    this.seasons = this.seasons.map(season => {
      season.episodes.map(episode => {
        episode.setTitle(title);
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
      console.log(season.getPreview());
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
