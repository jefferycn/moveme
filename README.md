# moveme

Rename your media files with proper format which Jellyfin can easily recognize.

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
