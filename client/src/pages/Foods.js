import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import ResponsiveDrawer from '../components/ResponsiveDrawer';

function Foods() {
  const { loading, data, error } = useQuery(FETCH_FOODS);
  console.log(data);

  return <h1>Food Page</h1>;
}

const FETCH_FOODS = gql`
  query getFoods {
    getFoods {
      id
      name
    }
  }
`;

export default Foods;
