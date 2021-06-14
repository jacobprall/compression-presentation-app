import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import useHover from '../hooks/use_hover';
import { useMutation, gql } from '@apollo/client';

const COMPRESS_CHUNK = gql`
mutation ($chunk: String!) {
  compress_chunk_named(args: {arg_1: $chunk}) {
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

function Card({
  chunk_name,
  before_compression_total_bytes,
  after_compression_total_bytes,
  range_start,
  range_end,
  screenDimensions,
  handleCardInfo,
}) {
  const [ref, hovered] = useHover();

  const [isCompressed, setIsCompressed] = useState(
    after_compression_total_bytes !== null
  );
  const [loadModal, setLoadModal] = useState(true);

  const [mutation] = useMutation(isCompressed ? DECOMPRESS_CHUNK : COMPRESS_CHUNK );

  const getScale = (before, after) => {
    const x = after / before;
    if (!isCompressed || !x) {
      return 1;
    }
    return x;
  };

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

  const circleClassNames = classNames(
    'ts-compression__inner__chunks__cards-wrapper__card',
    {
      'ts-compression__inner__chunks__cards-wrapper__card--compressed':
        isCompressed,
      'ts-compression__inner__chunks__cards-wrapper__card--decompressed':
        !isCompressed,
      // 'ts-compression__grid-item__circle': true,
      // [`ts-compression__grid-item__circle--compressed`]: isCompressed,
      // [`ts-compression__grid-item__circle--decompressed`]: !isCompressed,
      'ts-compression__inner__chunks__cards-wrapper__card--hovered': hovered,
    }
  );

  const screenPosition =
    typeof window !== 'undefined' &&
    document.getElementById(chunk_name)?.getBoundingClientRect();

  useEffect(() => {
    setLoadModal(false);
    setIsCompressed(after_compression_total_bytes !== null);
  }, [after_compression_total_bytes, before_compression_total_bytes]);

  useEffect(() => {
    if (hovered)
      return handleCardInfo({
        chunk_name,
        before_compression_total_bytes,
        after_compression_total_bytes,
        range_start,
        range_end,
        screenPosition,
      });
    return handleCardInfo({});
  }, [hovered]);

  const now = new Date().getTime();
  const cx = before_compression_total_bytes / 1024;
  const cy = (now - new Date(range_start).getTime()) / (60 * 60 * 24 * 365);
  const radioSize = 78;

  const mutationVariables = chunk_name ? { variables: {chunk: chunk_name} } : {variables: {}};

  const handleClick = () => {
    setLoadModal(true);
    mutation(mutationVariables);
  }

  return (
    <>
      <circle
        cx={cx}
        cy={cy}
        r={radioSize}
        strokeWidth="2"
        stroke="gray"
        fill="white"
        id={chunk_name}
        ref={ref}
        className={circleClassNames}
        onClick={handleClick}
      />
    </>
  );
}

export default Card;
