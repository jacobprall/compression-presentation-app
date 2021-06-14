import React, { useState, useRef, useEffect } from 'react';
import Count from './count';
import classNames from 'classnames';
import Button from './button';
import useHover from '../hooks/use_hover';

function Card({
  chunk_name,
  before_compression_total_bytes,
  after_compression_total_bytes,
  range_start,
  range_end,
  screenDimensions
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

  const [ref, hovered] = useHover();

  useEffect(() => {
    setLoadModal(false);
    setIsCompressed(after_compression_total_bytes !== null)
  }, [after_compression_total_bytes, before_compression_total_bytes]);

  console.log(screenDimensions);

  const now = new Date().getTime();
  const cx = before_compression_total_bytes / 1024;
  const cy = (now - new Date(range_start).getTime()) / (60 * 60 * 24 * 365);
  const radioSize = 78;
  return (<>
  <circle cx={cx} cy={cy} r={radioSize}
    strokeWidth="2" stroke='gray' fill='white'
    className="ts-compression__inner__chunks__cards-wrapper__card"
    id={chunk_name}
    ref={ref} />
  {hovered && <div className="ts-compression__inner__chunks__cards-wrapper__card__info--wrapper">
        <h4>{chunk_name}</h4>
        <div className="ts-compression__inner__chunks__cards-wrapper__card__info">
          <div>
            <h4>Before Compression</h4>
            <Count
              suffix=" bytes"
              start={before_compression_total_bytes}
              end={before_compression_total_bytes || 0} />
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
        <Button isCompressed={isCompressed} setLoadModal={setLoadModal} chunkName={chunk_name}>
        </Button>
      </div>

 }
  </>);
}

export default Card;
