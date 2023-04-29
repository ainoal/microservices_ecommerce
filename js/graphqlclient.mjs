/*const GRAPHQL_URL = 'http://localhost:9000/';

async function fetchGreeting() {
	const response = await fetch(GRAPHQL_URL, {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			query: `
        query {
          greeting(str:"GraphQL World!")
        }
      `
		})
	});

	const { data } = await response.json();
	return data;
}

fetchGreeting().then(({ greeting }) => {
  const title = document.querySelector('h1');
  title.textContent = greeting;
});*/

/*import { SubscriptionClient } from 'subscriptions-transport-ws';
import gql from 'graphql-tag';

const GRAPHQL_WS_URL = 'ws://localhost:9000/graphql';

const client = new SubscriptionClient(GRAPHQL_WS_URL, {
  reconnect: true
});

client
  .request({
    query: gql`
      subscription {
        orderCreated {
          orderID
          status
          cart
        }
      }
    `
  })
  .subscribe({
    next(data) {
      console.log('Order created:', data.orderCreated);
    },
    error(error) {
      console.error('Subscription error:', error);
    }
  });*/

import axios from 'axios';
import gql from 'graphql-tag';

const GRAPHQL_URL = 'http://localhost:9000/graphql';

function subscribeToOrderCreated() {
  const query = gql`
    subscription {
      orderCreated {
        orderID
        status
        cart
      }
    }
  `;

  let lastEventId = null;

  const getNextEvent = async () => {
    try {
      const response = await axios.post(GRAPHQL_URL, {
        query: query.loc.source.body,
        variables: {},
        operationName: null,
        extensions: {
          http: {
            method: 'POST',
            url: GRAPHQL_URL,
            includeQuery: true,
            headers: {
              'content-type': 'application/json',
              ...(lastEventId && { 'Last-Event-ID': lastEventId }),
            },
          },
        },
      }, { timeout: 0 });

      const { data, headers } = response;
      lastEventId = headers['last-event-id'];
      if (data.orderCreated != null) {
        console.log('Order created:', data);
      }

      getNextEvent();
    } catch (error) {
      console.error('Subscription error:', error);
      setTimeout(getNextEvent, 1000);
    }
  };

  getNextEvent();
}

subscribeToOrderCreated();

