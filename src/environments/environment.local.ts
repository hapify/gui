export const environment = {
  production: false,
  ace: {
    baseUri: '/assets/ace-builds/src-min',
    theme: 'xcode'
  },
  bitbucket: {
    baseUri: 'https://api.bitbucket.org/2.0',
    authorize: 'https://bitbucket.org/site/oauth2/authorize?client_id=c8npvNPyU7NmdKqvhW&response_type=token',
    proxyUrl: 'http://local.repositories.hapify.ca/bitbucket/php/index.php',
    proxyToken: 'VVmufSBsHyJcNAehytJDn3WZXsVHBa767W5tsezAKVhLXefpBpsSc8Z8NjdJy9JAn6Z43cxQzqsabR27FbwfujTe74vDXGBH'
  },
  deployer: {
    apiUrl: 'http://local.deployer.hapify.ca',
    session: {
      id: 'KCQX5RCAQ9BN89RAXNZKEGT77YYRZZB2',
      key: '2bFCJV@BUCRa=QFWaKQt&+WWL9WxR5fy9Zj7U?kwQn2*R*U-rbPH-h*yc$^6aTa7^PNczfTuz3nfB?BD?g@HAbZ4z%Cnt=UjvqsnVKU$qC3A9NFJ$5fZ#Kyn%-f%Jvev'
    },
    wsUrl: 'ws://local.deployer.hapify.ca/websocket',
  },
  sync: false
};
