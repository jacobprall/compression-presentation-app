import React from 'react';
import { useMutation, gql } from '@apollo/client';
import './buttons.scss';
import classNames from 'classnames';

const COMPRESS_CHUNK = gql`
  mutation ($chunk: String!) {
    compress_chunk_named(args: { arg_1: $chunk }) {
      compress_chunk
    }
  }
`;

const DECOMPRESS_CHUNK = gql`
  mutation ($chunk: String!) {
    decompress_chunk_named(args: { arg_1: $chunk }) {
      compress_chunk
    }
  }
`;

const mutationsMap = {
  compress: COMPRESS_CHUNK,
  decompress: DECOMPRESS_CHUNK,
};

function MutationTrigger({
  jobComplete,
  setLoadModal,
  chunkName,
  mutationType,
}) {
  const btnClassNames = classNames('btn', `btn__${mutationType}`, {
    [`btn__${mutationType}--disabled`]: jobComplete,
  });
  const [mutation] = useMutation(mutationsMap[mutationType]);
  const mutationVariables = chunkName
    ? { variables: { chunk: chunkName } }
    : { variables: {} };
  const label = mutationType.toUpperCase();

  const handleClick = () => {
    setLoadModal(true);
    mutation(mutationVariables);
  };

  return (
    <button className={btnClassNames} onClick={() => handleClick()}>
      {label}
    </button>
  );
}

export default MutationTrigger;
