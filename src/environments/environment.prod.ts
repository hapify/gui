export const environment = {
  production: true,
  ace: {
    baseUri: '/assets/ace-builds/src-min',
    theme: 'xcode'
  },
  bitbucket: {
    baseUri: 'https://api.bitbucket.org/2.0',
    authorize: 'https://bitbucket.org/site/oauth2/authorize?client_id=qs5WQ6GMpaFMxUc5fe&response_type=token',
    proxyUrl: 'https://repositories.hapify.io/bitbucket/php/index.php',
    proxyToken: 'VVmufSBsHyJcNAehytJDn3WZXsVHBa767W5tsezAKVhLXefpBpsSc8Z8NjdJy9JAn6Z43cxQzqsabR27FbwfujTe74vDXGBH'
  },
  deployer: {
    apiUrl: 'https://deployer.hapify.io',
    session: {
      id: 'PUJFZFA5N6WY5AOGVL6ZLSV87C623NHY',
      key: 'Qg+j&V=TF$g2C#VumcJaaVjN#gz687jDkKU-Eh%Ka_SL7x9RadS@Q^TZ5*2jx9zZkdkpteM^FKC3avF+gSz8u?Bd2&qM5#Ht9_qE$RGh6?v7YzE5z^^e3+4c8HE2WnUq'
    },
    wsUrl: 'wss://deployer.hapify.io/websocket',
  },
  sync: false
};
