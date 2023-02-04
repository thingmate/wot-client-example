import { ThingDescription } from 'wot-typescript-definitions';

export function fetchWebsocketTD(): ThingDescription {
  return {
    '@context': [
      'https://www.w3.org/2019/wot/td/v1',
      'https://www.w3.org/2022/wot/td/v1.1',
      {
        '@language': 'en',
      },
    ],
    '@type': 'Thing',
    'title': 'Test Thing',
    'securityDefinitions': {
      'nosec_sc': {
        'scheme': 'nosec',
      },
    },
    'security': [
      'nosec_sc',
    ],
    'properties': {
      'state': {
        'title': 'true/false',
        'type': 'boolean',
        'forms': [
          {
            'href': 'ws://192.168.1.18:8080/test-thing/properties/state',
            'contentType': 'application/json',
            'op': [
              'readproperty',
              'observeproperty',
              'unobserveproperty',
              'writeproperty',
            ],
          },
          {
            'href': 'ws://[fd1a:5158:cbcf:4f17:e042:6441:bedf:c91a]:8080/test-thing/properties/state',
            'contentType': 'application/json',
            'op': [
              'readproperty',
              'observeproperty',
              'unobserveproperty',
              'writeproperty',
            ],
          },
          {
            'href': 'ws://[fd1a:5158:cbcf:4f17:c8f9:246f:675:3c8]:8080/test-thing/properties/state',
            'contentType': 'application/json',
            'op': [
              'readproperty',
              'observeproperty',
              'unobserveproperty',
              'writeproperty',
            ],
          },
        ],
        'readOnly': false,
        'writeOnly': false,
        'observable': false,
      },
      'timestamp': {
        'title': 'timestamp',
        'type': 'integer',
        'readOnly': true,
        'observable': true,
        'forms': [
          {
            'href': 'ws://192.168.1.18:8080/test-thing/properties/timestamp',
            'contentType': 'application/json',
            'op': [
              'readproperty',
              'observeproperty',
              'unobserveproperty',
            ],
          },
          {
            'href': 'ws://[fd1a:5158:cbcf:4f17:e042:6441:bedf:c91a]:8080/test-thing/properties/timestamp',
            'contentType': 'application/json',
            'op': [
              'readproperty',
              'observeproperty',
              'unobserveproperty',
            ],
          },
          {
            'href': 'ws://[fd1a:5158:cbcf:4f17:c8f9:246f:675:3c8]:8080/test-thing/properties/timestamp',
            'contentType': 'application/json',
            'op': [
              'readproperty',
              'observeproperty',
              'unobserveproperty',
            ],
          },
        ],
        'writeOnly': false,
      },
    },
    'actions': {
      'toggle': {
        'title': 'toggle Action',
        'description': 'Action Toggle',
        'forms': [
          {
            'href': 'ws://192.168.1.18:8080/test-thing/actions/toggle',
            'contentType': 'application/json',
            'op': [
              'invokeaction',
            ],
          },
          {
            'href': 'ws://[fd1a:5158:cbcf:4f17:e042:6441:bedf:c91a]:8080/test-thing/actions/toggle',
            'contentType': 'application/json',
            'op': [
              'invokeaction',
            ],
          },
          {
            'href': 'ws://[fd1a:5158:cbcf:4f17:c8f9:246f:675:3c8]:8080/test-thing/actions/toggle',
            'contentType': 'application/json',
            'op': [
              'invokeaction',
            ],
          },
        ],
        'idempotent': false,
        'safe': false,
      },
    },
    'events': {
      'on-toggle': {
        'title': 'on-toggle Event',
        'description': 'Event toggle',
        'data': {
          'type': 'boolean',
        },
        'forms': [
          {
            'href': 'ws://192.168.1.18:8080/test-thing/events/on-toggle',
            'contentType': 'application/json',
            'op': 'subscribeevent',
          },
          {
            'href': 'ws://[fd1a:5158:cbcf:4f17:e042:6441:bedf:c91a]:8080/test-thing/events/on-toggle',
            'contentType': 'application/json',
            'op': 'subscribeevent',
          },
          {
            'href': 'ws://[fd1a:5158:cbcf:4f17:c8f9:246f:675:3c8]:8080/test-thing/events/on-toggle',
            'contentType': 'application/json',
            'op': 'subscribeevent',
          },
        ],
      },
      'timestamp-event': {
        'title': 'timestamp Event',
        'data': {
          'type': 'integer',
        },
        'forms': [
          {
            'href': 'ws://192.168.1.18:8080/test-thing/events/timestamp-event',
            'contentType': 'application/json',
            'op': 'subscribeevent',
          },
          {
            'href': 'ws://[fd1a:5158:cbcf:4f17:e042:6441:bedf:c91a]:8080/test-thing/events/timestamp-event',
            'contentType': 'application/json',
            'op': 'subscribeevent',
          },
          {
            'href': 'ws://[fd1a:5158:cbcf:4f17:c8f9:246f:675:3c8]:8080/test-thing/events/timestamp-event',
            'contentType': 'application/json',
            'op': 'subscribeevent',
          },
        ],
      },
    },
    'id': 'urn:uuid:a0ad15ce-8407-4969-9f92-db0c9941e400',
  };
}
