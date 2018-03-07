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
    baseUri: 'https://api.bitbucket.org/2.0',
    authorize: 'https://bitbucket.org/site/oauth2/authorize?client_id=xxx&response_type=token',
    proxyUrl: 'https://edouarddemotesmainard.com/hapify/bitbucket/php/',
    proxyToken: 'VVmufSBsHyJcNAehytJDn3WZXsVHBa767W5tsezAKVhLXefpBpsSc8Z8NjdJy9JAn6Z43cxQzqsabR27FbwfujTe74vDXGBH'
  }
};
