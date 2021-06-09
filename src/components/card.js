import React from 'react';
import Count from './count';
import { useMutation, gql } from '@apollo/client';

function Card({
  chunk_name,
  before_compression_total_bytes,
  after_compression_total_bytes,
}) {
  const getScale = (before, after) => {
    const x = after / before;
    if (!x) {
      return 0.1;
    } else if (x > 1) {
      return 1;
    } else {
      return x;
    }
  };

  function formatNumber(num) {
    if (!num) {
      return num;
    }
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }

  const getCompressionRatio = (before, after) => {
    if (!after) {
      return 0;
    }
    return (before / after).toFixed(2);
  };

  const compressionRatio = getCompressionRatio(
    before_compression_total_bytes,
    after_compression_total_bytes
  );

  const DECOMPRESS_CHUNK_NAME = gql`
    mutation MyMutation($chunk_name: String!) {
      decompress_chunk_named(args: {arg_1:  $chunk_name}) {
        decompress_chunk
      }
    }
  `;
  const COMPRESS_CHUNK_NAME = gql`
    mutation MyMutation($chunk_name: String!) {
      decompress_chunk_named(args: {arg_1: $chunk_name}) {
        compress_chunk
      }
    }
  `;

  const [compressChunk, decompressChunk] = useMutation(COMPRESS_CHUNK_NAME, DECOMPRESS_CHUNK_NAME);

  const compress = (name) => {
    console.log('compressing', name);
    compressChunk({variables: {chunk_name: name}})
  }
  const decompress = (name) => {
    console.log('decompressing', name);
    decompressChunk({variables: {chunk_name: name}})
  }

  return (
    <div className="ts-compression__grid-item__circle-container">
      <div className="ts-compression__grid-item__before__circle"
      />
      <div
        className="ts-compression__grid-item__after__circle"
        onClick={() => { (before_compression_total_bytes > 0 ? compress : decompress)(chunk_name) }}
        style={{
          transform: `scale(${getScale(
            before_compression_total_bytes,
            after_compression_total_bytes
          )})`,
        }}
      />
    </div>
  );
}

export default Card;
