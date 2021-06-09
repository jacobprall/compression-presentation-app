import React from 'react';
import { useMutation, gql } from '@apollo/client';
import './buttons.scss';

const COMPRESS_CHUNKS = gql`
  mutation MyMutation {
    compress_random_chunk {
      compress_chunk
    }
  }
`;

function CompressButton({ compressionComplete, setLoadModal }) {
  const [compressChunks] = useMutation(COMPRESS_CHUNKS);
  const handleClick = () => {
    setLoadModal(true);
    compressChunks();
  }
  return <button className={`btn btn__compress btn__compress${compressionComplete }`} onClick={() => handleClick()}>Compress</button>;
}

export default CompressButton;
