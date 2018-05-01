# Auto-Sync

This server is started only in local development and reachable only through localhost.
It's purpose is to save the fresh compiled files to the bootstraps when working via the editor.
It does not copy all files exported by the channel.
On the first run, you need to sync the whole channel via the channel's edition panel.

To start the web-app with this sync server, run `npm run start-sync`.

## Config

This server runs on the port `9080`.

Before start this server you must copy the files `channels.example.json` to `channels.json`
and setup the actual paths to your bootstraps.

Only files under this paths can be written.
The files directories will be created if they do not exists.

## Authentication

This server is only available through `127.0.0.1`.
As this server write on local file it has a simple authentication with the header `X-Hapify-Token`.
The value of this header is defined in `auth.js`.

## API

It has only one endpoint: `POST /files`
This endpoint can save multiple files at once for a single channel.

Payload example:
```json
{
	"channel": "2824fcf3-cdc3-ac52-a66e-2df4e0cbdc0f",
	"files": [
		{
			"path": "sync-test/test-1.txt",
			"content": "content-1"
		},
		{
			"path": "sync-test/test-2.txt",
			"content": "content-2"
		}
	]
}
```
