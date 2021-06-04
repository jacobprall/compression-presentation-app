import React from 'react';

function Card({ chunk_name, before_compression_total_bytes, after_compression_total_bytes }) {
  const getDenom = (x) => {
    if (!x) {
      return 0.2;
    } else if (x > 1) {
      return 1;
    } else {
      return x;
    }
  };

  function formatNumber(num) {
    if (!num) {
      return num;
    }
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }

  const getPercent = (after, before) => {
    if (!after) {
      return 0;
    }
    return ((after / before) * 100).toFixed(2);
  };
  return (
    <div className="ts-compression__grid-item">
      <h2>{chunk_name}</h2>
      <div className="ts-compression__grid-item__info">
        <div className="ts-compression__grid-item__info__inner">
          <div className="ts-compression__grid-item__before">
            <div className="ts-compression__grid-item__circle-container">
              <div className="ts-compression__grid-item__before__circle" />
            </div>
            <h4>Before Compression</h4>
            <p>
              {formatNumber(before_compression_total_bytes) ?? 0} bytes
            </p>
          </div>
          <div className="ts-compression__grid-item__after">
            <div className="ts-compression__grid-item__circle-container">
              <div
                className="ts-compression__grid-item__after__circle"
                style={{
                  transform: `scale(${getDenom(
                    after_compression_total_bytes /
                      before_compression_total_bytes
                  )})`,
                }}
              />
            </div>
            <h4>After Compression</h4>
            <p>{formatNumber(after_compression_total_bytes) ?? 0} bytes</p>
          </div>
        </div>
        <p>
          {getPercent(
            after_compression_total_bytes,
            before_compression_total_bytes
          )}
          % saved
        </p>
      </div>
    </div>
  );
}

export default Card;
