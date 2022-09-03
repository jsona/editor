import Spinner from 'react-bootstrap/Spinner';
import { css } from '@emotion/react';

function Loading() {
  return (
    <div css={css`
      text-align: center;
      padding-top: 30vh;
    `}>
      <Spinner animation="border" />
    </div>
  )
}

export default Loading;