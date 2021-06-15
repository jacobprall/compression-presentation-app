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
  handleCardInfo,
  handleBiggestChunk,
  totalChunks,
  totalBytesUncompressed,
}) {
  const [ref, hovered] = useHover();

  const [isCompressed, setIsCompressed] = useState(
    after_compression_total_bytes !== null
  );

  const [, setLoadModal] = useState(true);

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
    console.log(mutationVariables);
    mutation(mutationVariables);
  };

  const screenPosition = () =>
    document.getElementById(chunk_name)?.getBoundingClientRect();

  const mutationVariables = chunk_name
    ? { variables: { chunk: chunk_name } }
    : { variables: {} };

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
        return after_compression_total_bytes * spreadFactor;
      return before_compression_total_bytes * spreadFactor;
    };
    handleRadioSize(calcRadioSize || 5);
    handleCirclePosition();
  }, [isCompressed, biggestChunk]);

  useEffect(() => {
    handleSpreadFactor();
  }, [totalBytesUncompressed]);

  useEffect(() => {
    handleCirclePosition();
    console.log('------------');
    console.log('Chunk name: ', chunk_name);
    console.log('Total Chunks: ', totalChunks);
    console.log('Before Compression: ', totalBytesUncompressed);
    console.log('Spread Factor', spreadFactor);
    console.log(
      `CX - index *
      spreadFactor *
      (after_compression_total_bytes ?? before_compression_total_bytes)) %
      widthRatio `,
      (((index *
        spreadFactor *
        (after_compression_total_bytes ?? before_compression_total_bytes)) %
        0.9) *
        window.innerWidth) /
        Math.sqrt(totalChunks)
    );
    console.log(
      `~~(
        (index * spreadFactor * after_compression_total_bytes ??
          before_compression_total_bytes) / heightRatio
      )`,
      ~~(
        ((index * spreadFactor * after_compression_total_bytes ??
          before_compression_total_bytes) /
          0.7) *
        window.innerHeight
      )
    );
    console.log('Inner Width: ', 0.9 * window.innerWidth);
    console.log('Inner Height', 0.7 * window.innerHeight);
    console.log('');
  }, []);

  return (
    <>
      <circle
        cx={circlePosition.cx}
        cy={circlePosition.cy}
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
