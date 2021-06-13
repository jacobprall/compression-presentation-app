import { useMutation, gql, DocumentNode } from '@apollo/client';
import './buttons.scss';
import classNames from 'classnames';

// Mutations
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

// Types
interface MutationTriggerTypes {
  setLoadModal: (params: boolean) => void;
  chunkName: string;
  mutationType: string;
}

interface IMutationMap {
  [index: string]: DocumentNode;
}

const mutationsMap: IMutationMap = {
  compress: COMPRESS_CHUNK,
  decompress: DECOMPRESS_CHUNK,
};

function MutationTrigger({
  setLoadModal,
  chunkName,
  mutationType,
}: MutationTriggerTypes) {
  const btnClassNames = classNames('btn', `btn__${mutationType}`);
  const [mutation] = useMutation(mutationsMap[mutationType]);
  const mutationVariables = chunkName
    ? { variables: { chunk: chunkName } }
    : { variables: {} };
  const label = mutationType.toUpperCase();

  const handleClick = async () => {
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
