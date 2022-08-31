import React from 'react';
import ReactDOM from 'react-dom';
import { Editor } from './components/Editor';
import './editorWorker';

ReactDOM.render(
	<React.StrictMode>
		<Editor />
	</React.StrictMode>,
	document.getElementById('root')
);
