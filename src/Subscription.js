import React, { useEffect, useState } from 'react';
import { useSubscription, gql } from '@apollo/client';
import Card from './components/card';

import './styles/subscription.scss';

const Subscription = () => {
  const { data } = useSubscription(
    gql`
      subscription Chunks {
        chunks_with_compression {
          hypertable_name
          chunk_name
          range_start
          range_end
          before_compression_total_bytes
          after_compression_total_bytes
        }
      }
    `
  );

  const [loadModal, setLoadModal] = useState(false);

  useEffect(() => {
    // start up loading screen
    if (data === undefined) {
      setLoadModal(true);
    } else {
      setLoadModal(false);
    }
  }, [data]);

  return (
    <div className="ts-compression">
      <div
        className="ts-compression__loading-screen"
        style={loadModal ? { display: 'block' } : { display: 'none' }}
      >
        <div className="ts-compression__loading-screen__inner">
          <div className="ts-compression__loading-screen__card">
            <h2>Loading...</h2>
            <svg viewBox="0 0 108 108">
              <circle cx="54" cy="54" r="51.5"></circle>
            </svg>
          </div>
        </div>
      </div>
      <div className="ts-compression__inner">
        <h2>Compression</h2>
        <p>Interactive visualization</p>
        <div className="ts-compression__grid">
          {data &&
            data.chunks_with_compression.map((chunk) => <Card {...chunk} />)}
        </div>
      </div>
    </div>
  );
};

export default Subscription;
