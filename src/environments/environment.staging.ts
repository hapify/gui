export const environment = {
  production: true,
  ace: {
    baseUri: '/assets/ace-builds/src-min',
    theme: 'xcode'
  },
  bitbucket: {
    baseUri: 'https://api.bitbucket.org/2.0',
    authorize: 'https://bitbucket.org/site/oauth2/authorize?client_id=xxx&response_type=token',
    proxyUrl: 'https://repositories.hapify.ca/bitbucket/php/index.php',
    proxyToken: 'VVmufSBsHyJcNAehytJDn3WZXsVHBa767W5tsezAKVhLXefpBpsSc8Z8NjdJy9JAn6Z43cxQzqsabR27FbwfujTe74vDXGBH'
  },
  deployer: {
    apiUrl: 'https://deployer.hapify.ca',
    session: {
      id: 'BP6OTDBIJT61TOYFAQ6FJ6UQBK4RATAS',
      key: 'QjP*dYTN_8dkp4yM#uJeFpr3PXUUyJmZ6QSY4gT+sv!X_7YQuWqdUv*NDu%=F#+c@vP&mY*WZX2%6JkDx36fyJG_#R7DFLT*8uY-72dV&@4Buc*Cx&sEqHmDCxpSkPv#'
    },
    wsUrl: 'wss://deployer.hapify.ca/websocket',
  },
  sync: false
};
