import React from 'react';

export const EDITOR_HEIGHT = "88vh";

export const TITLE = 'JSONA Editor'

export const STORAGE_PREFIX = 'store_';

export const ROUTES = [
  {
    path: '/',
    title: 'Core',
    sourceFile: 'source.jsona',
    page: () => React.lazy(() => import('./pages/PageCore')),
  },
  {
    path: '/schema',
    title: 'Schema',
    sourceFile: 'source.jsona',
    page: () => React.lazy(() => import('./pages/PageSchema')),
  },
  {
    path: '/openapi',
    title: 'Openapi',
    sourceFile: 'source.openapi.jsona',
    page: () => React.lazy(() => import('./pages/PageOpenapi')),
  },
]
