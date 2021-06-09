import React, { useState, useEffect } from 'react';
import Count from './count';
import classNames from 'classnames';
import Button from './button';

function Card({
  chunk_name,
  before_compression_total_bytes,
  after_compression_total_bytes,
}) {
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

  const circleClassNames = classNames({
    'ts-compression__grid-item__circle': true,
    [`ts-compression__grid-item__circle--compressed`]: isCompressed,
    [`ts-compression__grid-item__circle--decompressed`]: !isCompressed,
  });

  useEffect(() => {
    setLoadModal(false);
    setIsCompressed(after_compression_total_bytes !== null)
  }, [after_compression_total_bytes, before_compression_total_bytes]);

  return (
    <div className="ts-compression__grid-item">
      <div
        className="ts-compression__loading-screen-single"
        style={loadModal ? { display: 'flex' } : { display: 'none' }}
      >
        <div className="ts-compression__loading-screen-single__inner">
          <div className="ts-compression__loading-screen-single__card">
            <svg viewBox="0 0 108 108">
              <circle cx="54" cy="54" r="51.5"></circle>
            </svg>
          </div>
        </div>
      </div>
      <div className="ts-compression__grid-item__inner">
        <div className="ts-compression__grid-item__circle-container">
          <div className={circleClassNames}>
            <svg
              width="160"
              height="160"
              viewBox="0 0 160 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                transform: `scale(${getScale(
                  before_compression_total_bytes,
                  after_compression_total_bytes
                )})`,
              }}
            >
              <circle cx="80" cy="80" r="64" />
              <circle cx="80" cy="80" r="78" stroke-width="2" />
            </svg>
          </div>
        </div>
        <div className="ts-compression__grid-item__info">
          <div>
            <h4>Before Compression</h4>
            <Count
              suffix=" bytes"
              start={before_compression_total_bytes}
              end={before_compression_total_bytes}
            />
          </div>
          <div>
            <h4>After Compression</h4>
            <Count
              suffix=" bytes"
              start={before_compression_total_bytes}
              end={after_compression_total_bytes}
            />
          </div>
        </div>
        <Count
          prefix="Compression Ratio: "
          end={compressionRatio}
          decimals={2}
        />
        <Button isCompressed={isCompressed} setLoadModal={setLoadModal} chunkName={chunk_name}>
          {isCompressed ? 'Decompress' : 'Compress'}
        </Button>
      </div>
    </div>
  );
}

export default Card;
