import * as fs from 'readdirp';
import {access, mkdir, rename} from 'fs/promises';
import {Episode} from './model/Episode';
import {Season} from './model/Season';
import {fileMatchers} from './helpers/matchers';
import {MediaPreview} from './model/MediaPreview';
import {Prompt} from './model/Prompt';

(async () => {
  const path = process.cwd();
  const files = await fs.promise(path, {fileFilter: fileMatchers});

  const preview = new MediaPreview(path);
  files.map(file => {
    const episode = new Episode(file.path, path);
    preview.addEpisode(episode);
  });

  if (preview.isEmpty()) {
    console.log('No episodes to move.');
    return;
  }
  preview.getPreview();

  const newPreview = await new Prompt(preview).run();

  if (newPreview.proceed) {
    newPreview.seasons.map(async (season: Season) => {
      await mkdir(season.getDirectory(), {recursive: true});
      season.getEpisodes().map(async episode => {
        const original = episode.getOriginalFullName();
        const newFile = episode.getNewFullName();
        if (original !== newFile) {
          try {
            await access(newFile);
            console.log(newFile + ' already exists.');
          } catch {
            await rename(original, newFile);
          }
        }
      });
    });
  }
})();
