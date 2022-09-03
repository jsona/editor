import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import { Suspense } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { css } from '@emotion/react';
import Layout from './components/Layout';
import { ROUTES } from './constants';

function App() {
  return (
  <Router>
    <Routes>
        <Route path="/" element={<Layout />}>
          {
            ROUTES.map((item) => {
              const Page = item.page();
              return (
                <Route key={item.path} path={item.path} element={
                  <Suspense fallback={
                    <div css={css`
                      text-align: center;
                      padding-top: 30vh;
                    `}>
                      <Spinner animation="border" />
                    </div>
                  }>
                    <Page />
                  </Suspense>
                } />
              )
            })
          }
        </Route>
    </Routes>
  </Router>
  )
}

export default App;