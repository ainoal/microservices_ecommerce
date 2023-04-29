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

