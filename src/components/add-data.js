import React, { useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';

// const COMPRESS_CHUNKS = gql`
//   mutation MyMutation {
//     compress_random_chunk {
//       compress_chunk
//     }
//   }
// `;

function AddDataButton() {
  // const [compressChunks] = useMutation(COMPRESS_CHUNKS);
  return (
    <button className="btn btn__add-data" onClick={() => console.log('Add data')}>
      Add Data
    </button>
  );
}

export default AddDataButton;
