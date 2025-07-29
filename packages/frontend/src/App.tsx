import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { client } from '~/apollo';
import { routes } from '~/routes.tsx';

const App = () => {
  const router = createBrowserRouter([...routes]);

  return (
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
  );
};

export default App;
