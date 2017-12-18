const _output = {
  "name": "Project - Local",
  "values": [
    {
      "key": "apiUrl",
      "value": "http://dev.api.com",
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

exports = JSON.stringify(_output, null, 4);
