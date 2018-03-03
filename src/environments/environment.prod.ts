export const environment = {
  production: true,
  demo: {
    baseUri: '/assets/demo',
    manifest: 'manifest.json',
  },
  ace: {
    baseUri: '/assets/ace-builds/src-min',
    theme: 'xcode'
  },
  bitbucket: {
    authorize: 'https://bitbucket.org/site/oauth2/authorize?client_id=xxx&response_type=code'
  }
};
