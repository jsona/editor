import React from 'react';

export const TITLE = 'JSONA Editor'

export const ROUTES = [
  {
    path: '/',
    title: 'Core',
    sourceSuffix: '.jsona',
    page: () => React.lazy(() => import('./pages/PageCore')),
  },
  {
    path: '/schema',
    title: 'Schema',
    sourceSuffix: 'schema.jsona',
    page: () => React.lazy(() => import('./pages/PageSchema')),
  },
  {
    path: '/openapi',
    title: 'Openapi',
    sourceSuffix: 'openapi.jsona',
    page: () => React.lazy(() => import('./pages/PageOpenapi')),
  },
]
