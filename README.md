# what is it

Rename your TV series or Anime series media files with proper format, then they are more friendly with Jellyfin.

## how to use it

build
```
yarn build
```

go to your media folder and run the following command:

```shell
node /path/to/your/dist/app.js
```

you may also create a shell script for it:

```shell
echo "node /path/to/your/dist/app.js" > /usr/local/bin/moveme
chmod +x /usr/local/bin/moveme
```

then go to your media folders and run `moveme`.
