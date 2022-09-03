import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import { Suspense } from 'react';
import Layout from './components/Layout';
import Loading from './components/Loading';
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
                  <Suspense fallback={<Loading />}>
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