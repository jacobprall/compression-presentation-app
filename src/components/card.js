import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import useHover from '../hooks/use_hover';

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

  const circleClassNames = classNames('ts-compression__inner__chunks__cards-wrapper__card', {
    // 'ts-compression__grid-item__circle': true,
    // [`ts-compression__grid-item__circle--compressed`]: isCompressed,
    // [`ts-compression__grid-item__circle--decompressed`]: !isCompressed,
    'ts-compression__inner__chunks__cards-wrapper__card--hovered': hovered,
  });


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
        screenDimensions,
      });
    return handleCardInfo({});
  }, [hovered]);

  const now = new Date().getTime();
  const cx = before_compression_total_bytes / 1024;
  const cy = (now - new Date(range_start).getTime()) / (60 * 60 * 24 * 365);
  const radioSize = 78;

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
      />
    </>
  );
}

export default Card;
