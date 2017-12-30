const _output = {
  "name": "Project - Local",
  "values": [
    {
      "key": "apiUrl",
      "value": "http://dev.api.app-bootstrap.com",
      "type": "text",
      "enabled": true
    },
    {
      "key": "apiVersion",
      "value": "v1",
      "type": "text",
      "enabled": true
    }
  ],
  "timestamp": Date.now(),
};

module.export = JSON.stringify(_output, null, 4);
