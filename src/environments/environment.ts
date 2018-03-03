// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  demo: {
    baseUri: '/assets/demo',
    manifest: 'manifest.json',
  },
  ace: {
    baseUri: '/assets/ace-builds/src-min',
    theme: 'xcode'
  },
  bitbucket: {
    authorize: 'https://bitbucket.org/site/oauth2/authorize?client_id=GXGSpAgZTeP6sH3Zxr&response_type=code'
  }
};
