import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import App from './App';
import { WebSocketLink } from '@apollo/client/link/ws';

const createApolloClient = () => {
  return new ApolloClient({
    link: new WebSocketLink({
      uri: 'wss://fleet-bunny-18.hasura.app/v1/graphql',
      options: {
        reconnect: true,
        connectionParams: {
          headers: {
            'x-hasura-admin-secret':
              process.env.REACT_APP_X_HASURA_ADMIN_SECRET,
          },
        },
      },
    }),
    cache: new InMemoryCache(),
  });
};

function Subscription() {
  const client = createApolloClient();

  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
}

export default Subscription;
