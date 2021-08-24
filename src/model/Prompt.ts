import {MediaPreview} from './MediaPreview';

const prompts = require('prompts');

export class Prompt {
  preview: MediaPreview;
  questions = [
    {
      type: 'select',
      name: 'action',
      message: 'Are you sure you want to move all files above?',
      choices: [
        {title: 'Proceed', value: 'proceed'},
        {title: 'Change title', value: 'change_title'},
        {title: 'Set Episode Delta', value: 'set_episode_delta'},
        {title: 'Quit', value: 'quit'},
      ],
      initial: 0,
    },
  ];
  constructor(preview: MediaPreview) {
    this.preview = preview;
  }

  askFor = async (message: string) => {
    const response = await prompts({
      type: 'text',
      name: 'value',
      message,
    });
    return response.value;
  };

  onSubmit = async (prompt: Prompt, answer: string) => {
    switch (answer) {
      case 'change_title':
        this.preview.setTitle(await this.askFor('Media Title'));
        break;
      // case 'change_year':
      //   preview.setYear(+(await askFor('Media Year')));
      //   break;
      case 'set_episode_delta':
        this.preview.setEpisodeDelta(
          +(await this.askFor('First episode number'))
        );
        break;
      case 'proceed':
        this.preview.proceed = true;
        return true;
      default:
        return true;
    }
    this.preview.getPreview();
    const subResponse = await prompts(this.questions, {
      onSubmit: this.onSubmit,
    });
    if (subResponse.action === 'proceed') {
      this.preview.proceed = true;
      return true;
    }
  };

  async run() {
    await prompts(this.questions, {onSubmit: this.onSubmit});
    return this.preview;
  }
}
