import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import useHover from '../hooks/useOnHover';
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
  handleCardInfo,
  handleBiggestChunk,
  handleCompressingModal,
  screenDimensions,
  totalChunks,
  totalBytesUncompressed,
}) {
  const [ref, hovered] = useHover();

  const [isCompressed, setIsCompressed] = useState(
    after_compression_total_bytes !== null
  );

  const [loadModal, setLoadModal] = useState(true);

  const [radioSize, setRadioSize] = useState(24);

  const [cardPosition, setCardPosition] = useState({});

  const [spreadFactor, setSpreadFactor] = useState(
    typeof window !== undefined &&
      Math.sqrt(
        (0.9 * window.innerWidth * (0.7 * window.innerHeight)) /
          totalBytesUncompressed
      ) / totalChunks
  );

  const [circlePosition, setCirclePosition] = useState({
    cx: 700,
    cy: 300,
  });

  const [mutation] = useMutation(
    isCompressed ? DECOMPRESS_CHUNK : COMPRESS_CHUNK
  );

  const circleClassNames = classNames(
    'ts-compression__inner__chunks__cards-wrapper__card',
    {
      'ts-compression__inner__chunks__cards-wrapper__card--compressed':
        isCompressed,
      'ts-compression__inner__chunks__cards-wrapper__card--decompressed':
        !isCompressed,
      'ts-compression__inner__chunks__cards-wrapper__card--hovered': hovered,
    }
  );

  const handleCirclePosition = () => {
    const squaredTotalChunks = Math.sqrt(totalChunks);

    const circlePosition = document.getElementById('chunks').getBoundingClientRect();

    const compensationRatio =  circlePosition.width  / circlePosition.height  * 0.8;
    const widthRatio = circlePosition.width / squaredTotalChunks;
    const heightRatio = compensationRatio * (circlePosition.height / squaredTotalChunks);

    const paddingX = 10;
    const paddingY = 10;
    const cx = paddingX + (widthRatio * ((index+1) % squaredTotalChunks));
    const cy = paddingY + (heightRatio * ((index+1) / squaredTotalChunks));

    setCirclePosition({ cx, cy});
  };

  const handleSpreadFactor = () =>
    setSpreadFactor(
      typeof window !== undefined &&
        Math.sqrt(
          (0.9 * window.innerWidth * (0.7 * window.innerHeight)) /
            totalBytesUncompressed
        ) / totalChunks
    );

  const handleRadioSize = (newSize) => setRadioSize(newSize);

  const handleClick = () => {
    setLoadModal(true);
    handleCompressingModal(true);
    mutation(mutationVariables);
  };

  const getCardPosition = () => document.getElementById(chunk_name).getBoundingClientRect();

  const mutationVariables = chunk_name
    ? { variables: { chunk: chunk_name } }
    : { variables: {} };

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
        return after_compression_total_bytes * spreadFactor;
      return before_compression_total_bytes * spreadFactor;
    };
    handleRadioSize(calcRadioSize || 5);
    handleCirclePosition();
    setCardPosition(getCardPosition());
  }, [isCompressed, biggestChunk]);

  useEffect(() => {
    handleSpreadFactor();
  }, [totalBytesUncompressed]);

  useEffect(() => {
    setCardPosition(getCardPosition());
    handleCirclePosition();
  }, []);

  return (
    <>
      <circle
        cx={circlePosition.cx}
        cy={circlePosition.cy}
        r={radioSize}
        strokeWidth="2"
        id={chunk_name}
        ref={ref}
        className={circleClassNames}
        onClick={handleClick}
      />
    </>
  );
}

export default Card;
