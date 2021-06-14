import { useEffect } from 'react';
import { useMutation, gql, DocumentNode } from '@apollo/client';
import './buttons.scss';
import styled from 'styled-components';

// Types
interface MutationTriggerTypes {
  setLoadModal: (params: boolean) => void;
  chunkName: string;
  mutationType: string;
  setFirstLoad: (params: boolean) => void;
}

interface IMutationMap {
  [index: string]: DocumentNode;
}

interface MutationTriggerWrapperProps {
  mutationType: string;
}

// Styles
const MutationTriggerWrapper = styled.button`
  padding: 12px;
  max-width: 160px;
  width: 100%;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  line-height: 24px;
  letter-spacing: -0.14px;
  font-weight: 700;
  text-transform: uppercase;
  border-radius: 4px;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props: MutationTriggerWrapperProps) =>
      props.mutationType === 'compress' ? '#feecc4' : '#c5ddfc'};
    cursor: pointer;
  }

  color: ${(props: MutationTriggerWrapperProps) =>
    props.mutationType === 'compress' ? '#141e35' : 'white'};
  background-color: ${(props: MutationTriggerWrapperProps) =>
    props.mutationType === 'compress' ? '#fdb515' : '#1472ec'};
  border: ${(props: MutationTriggerWrapperProps) =>
    props.mutationType === 'compress'
      ? '2px solid #fdb515'
      : '2px solid #1472ec'};
`;

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

const mutationsMap: IMutationMap = {
  compress: COMPRESS_CHUNK,
  decompress: DECOMPRESS_CHUNK,
};

function MutationTrigger({
  setLoadModal,
  chunkName,
  mutationType,
  setFirstLoad,
}: MutationTriggerTypes) {
  const [mutation] = useMutation(mutationsMap[mutationType]);
  const mutationVariables = chunkName
    ? { variables: { chunk: chunkName } }
    : { variables: {} };
  const label = mutationType.toUpperCase();

  const handleClick = async () => {
    setLoadModal(true);
    mutation(mutationVariables);
  };

  useEffect(() => {
    setFirstLoad(false);
  }, [label]);

  return (
    <MutationTriggerWrapper mutationType={mutationType} onClick={() => handleClick()}>
      {label}
    </MutationTriggerWrapper>
  );
}

export default MutationTrigger;
