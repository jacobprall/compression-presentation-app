import { useEffect, useState } from 'react';
import { useSubscription, gql } from '@apollo/client';
import Card from './components/Card';
import CardProps from './interfaces';

//Styles 
import { SiteWrapper, SiteWrapperInner, Grid, LoadingScreen, LoadingScreenInner, LoadingScreenCard } from './App.styles';
import './styles/app.scss';


const App = () => {
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
    if (!data) {
      setLoadModal(true);
    } else {
      setLoadModal(false);
    }
  }, [data]);

  return (
    <SiteWrapper>
      <LoadingScreen loadModal={loadModal}
      >
        <LoadingScreenInner className="ts-compression__loading-screen__inner">
          <LoadingScreenCard className="ts-compression__loading-screen__card">
            <h2>Loading...</h2>
            <svg viewBox="0 0 108 108">
              <circle cx="54" cy="54" r="51.5"></circle>
            </svg>
          </LoadingScreenCard>
        </LoadingScreenInner>
      </LoadingScreen>
      <SiteWrapperInner>
        <h2>Compression</h2>
        <p>Interactive visualization</p>
        <Grid>
          {data &&
            data.chunks_with_compression.map((chunk: CardProps) => <Card {...chunk} />)}
        </Grid>
      </SiteWrapperInner>
    </SiteWrapper>
  );
};

export default App;
