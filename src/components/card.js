import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import useHover from '../hooks/use_hover';
import { useMutation, gql } from '@apollo/client';

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

function Card({
  after_compression_total_bytes,
  before_compression_total_bytes,
  biggestChunk,
  chunk_name,
  index,
  range_start,
  range_end,
  screenDimensions,
  handleCardInfo,
  handleBiggestChunk,
  totalChunks,
}) {
  const [ref, hovered] = useHover();

  const [isCompressed, setIsCompressed] = useState(
    after_compression_total_bytes !== null
  );

  const [, setLoadModal] = useState(true);

  const [radioSize, setRadioSize] = useState(24);

  const [cardPosition, setCardPosition] = useState({});

  const [mutation] = useMutation(
    isCompressed ? DECOMPRESS_CHUNK : COMPRESS_CHUNK
  );

  // const getScale = (before, after) => {
  //   const x = after / before;
  //   if (!isCompressed || !x) {
  //     return 1;
  //   }
  //   return x;
  // };

  // const getCompressionRatio = (before, after) => {
  //   if (!after) {
  //     return 0;
  //   }
  //   return (before / after).toFixed(2);
  // };

  // const compressionRatio = getCompressionRatio(
  //   before_compression_total_bytes,
  //   after_compression_total_bytes
  // );

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

  const handleRadioSize = (newSize) => setRadioSize(newSize);

  const screenPosition = () =>
    document.getElementById(chunk_name)?.getBoundingClientRect();

  // const now = new Date().getTime();
  // const cx = before_compression_total_bytes / 1024;
  // const cy = (now - new Date(range_start).getTime()) / (60 * 60 * 24 * 365);

  const Xfactor = Math.sqrt(totalChunks) + 1;
  const cx = ((index + 1) % Xfactor) * (1400 / Xfactor) || 100;
  const cy = ~~(((index + 1) / Xfactor) * (600 / Xfactor)) || 100;

  const mutationVariables = chunk_name
    ? { variables: { chunk: chunk_name } }
    : { variables: {} };

  const handleClick = () => {
    setLoadModal(true);
    mutation(mutationVariables);
  };

  useEffect(() => setCardPosition(screenPosition), []);

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
        cardPosition,
      });
    return handleCardInfo({});
  }, [hovered]);

  useEffect(() => {
    handleBiggestChunk({ chunk_name, before_compression_total_bytes });
  }, []);

  useEffect(() => {
    const calcRadioSize = () => {
      if (after_compression_total_bytes)
        return (
          (Object.keys(biggestChunk).length > 0 &&
            (after_compression_total_bytes /
              biggestChunk?.before_compression_total_bytes) *
              4 +
              16) ||
          30
        );
      return (
        (Object.keys(biggestChunk).length > 0 &&
          (before_compression_total_bytes /
            biggestChunk?.before_compression_total_bytes) *
            4 +
            16) ||
        30
      );
    };

    handleRadioSize(calcRadioSize || 5);
  }, [biggestChunk])

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
