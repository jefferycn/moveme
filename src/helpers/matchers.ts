export const fileMatchers = ['*.mkv', '*.mp4', '*.ass', '*.ssa', '*.srt'];
export const seasonMatchers = [/season ?(0?[1-9])/i];
export const episodeMatchers = [
  /(?:s0?[0-9])?(?:e|sp|ep)([.0-9]{1,4})/i,
  /第?[0-9]{1,2}集/,
  /\[([0-9]{2,3})]/,
  / ([0-9]{2,3})[ .]/,
];
export const additionalInfoMatchers = [
  /Season ?([0-9]{1,2})?/gi,
  /Specials/gi,
  /Bluray/gi,
  /zh|eng|chn/gi,
  /x26[45][^ ]*/gi,
  /.?(1080|720|480)[ip]/gi,
  /.mkv|.mp4|.ass|.srt|.ssa/gi,
];
export const specialCharactersMatcher = /[/[\]()_]/g;
