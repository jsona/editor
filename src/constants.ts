import React from 'react';

export const EDITOR_HEIGHT = "88vh";

export const TITLE = 'JSONA Editor'

export const STORAGE_PREFIX = 'store_';

export const ROUTES = [
  {
    path: '/',
    title: 'Core',
    sourceFile: 'source.jsona',
    page: () => loadable(() => import('./pages/PageCore')),
  },
  {
    path: '/schema',
    title: 'Schema',
    sourceFile: 'source.jsona',
    page: () => loadable(() => import('./pages/PageSchema')),
  },
  {
    path: '/openapi',
    title: 'Openapi',
    sourceFile: 'source.openapi.jsona',
    page: () => loadable(() => import('./pages/PageOpenapi')),
  },
]

function loadable(load) {
  return React.lazy(async () => {
    const ret = await load()
    if (ret.__tla) {
      await ret.__tla
    }
    return ret;
  })
}