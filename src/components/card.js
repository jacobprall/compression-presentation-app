import React, { useState, useEffect } from 'react';
import Count from './count';
import classNames from 'classnames';
import MutationTrigger from './mutation-trigger';

function Card({
  chunk_name,
  before_compression_total_bytes,
  after_compression_total_bytes,
}) {
  const [isCompressed, setIsCompressed] = useState(
    after_compression_total_bytes !== null
  );
  const [loadModal, setLoadModal] = useState(true);

  const getScale = ({ before, after, isCompressed }) => {
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
    return parseFloat((before / after).toFixed(2));
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
    setIsCompressed(after_compression_total_bytes !== null);
  }, [after_compression_total_bytes]);

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
        <h4>{chunk_name}</h4>
        <div className="ts-compression__grid-item__circle-container">
          <div className="fixed-circle">
            <svg
              width="160"
              height="160"
              viewBox="0 0 160 160"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="80"
                cy="80"
                r="78"
                strokeWidth="2"
                stroke="gray"
                fill="white"
              />
            </svg>
          </div>
          <div className={circleClassNames}>
            <svg
              width="160"
              height="160"
              viewBox="0 0 160 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                transform: `scale(${getScale({
                  before: before_compression_total_bytes,
                  after: after_compression_total_bytes,
                  isCompressed,
                })})`,
              }}
            >
              <circle cx="80" cy="80" r="64" />
              <circle cx="80" cy="80" r="78" strokeWidth="2" />
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
        <MutationTrigger
          isCompressed={isCompressed}
          setLoadModal={setLoadModal}
          chunkName={chunk_name}
          mutationType={isCompressed ? 'decompress' : 'compress'}
        />
      </div>
    </div>
  );
}

export default Card;
