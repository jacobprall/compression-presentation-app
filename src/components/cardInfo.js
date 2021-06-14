import React from 'react';

import Count from './count';

const CardInfo = ({
  chunk_name,
  before_compression_total_bytes,
  after_compression_total_bytes,
  range_start,
  screenPosition,
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

  if (screenPosition) console.log('screenPosition: ', screenPosition);

  return (
    <div
      className="ts-compression__inner__info"
      style={{
        top: `${screenPosition?.top || 20}px`,
        left: `calc(${screenPosition?.left || 20}px - 200px)`,
        border: `thick solid purple`,
      }}
    >
      <div className="ts-compression__inner__chunks__cards-wrapper__card__info--wrapper">
        <h4>{chunk_name}</h4>
        <div className="ts-compression__inner__chunks__cards-wrapper__card__info">
          <div>
            <h4>Before Compression</h4>
            <Count
              suffix=" bytes"
              start={before_compression_total_bytes}
              end={before_compression_total_bytes || 0}
            />
          </div>
          <div>
            <h4>After Compression</h4>
            <Count
              suffix=" bytes"
              start={before_compression_total_bytes}
              end={after_compression_total_bytes || 0}
            />
          </div>
        </div>
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
