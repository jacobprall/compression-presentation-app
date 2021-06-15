import React from 'react';

import Count from './count';

const CardInfo = ({
  chunk_name,
  before_compression_total_bytes,
  after_compression_total_bytes,
  range_start,
  cardPosition,
  range_end,
}) => {
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

  const { top, bottom, left, right } = cardPosition || {};

  if (cardPosition) console.log('cardPosition: ', cardPosition);

  return (
    <div
      className="ts-compression__inner__info"
      style={{
        position: 'fixed',
        top: `calc(${top || 20}px - 400px)`,
        right: `calc(${right || 0}px - 60px)`,
        left: `calc(${left || 0}px - 60px)`,
        bottom: `calc(${bottom || 0}px - 400px)`,
      }}
    >
      <div className="ts-compression__inner__info--content">
        <h4>{chunk_name}</h4>
        <h4>Before Compression</h4>
        <Count
          suffix=" bytes"
          start={before_compression_total_bytes}
          end={before_compression_total_bytes || 0}
        />
        <h4>After Compression</h4>
        <Count
          suffix=" bytes"
          start={before_compression_total_bytes}
          end={after_compression_total_bytes || 0}
        />
        <Count
          prefix="Compression Ratio: "
          end={compressionRatio}
          decimals={2}
        />
      </div>
    </div>
  );
};

export default CardInfo;
