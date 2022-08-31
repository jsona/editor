import { FC, useRef, useState, useEffect } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import styles from './Editor.module.css';

export const Editor: FC = () => {
	const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
	const monacoEl = useRef(null);

	useEffect(() => {
		if (monacoEl && !editor) {
			setEditor(
				monaco.editor.create(monacoEl.current!, {
					value: `{}`,
					language: 'json'
				})
			);
		}

		return () => editor?.dispose();
	}, [monacoEl.current]);

	return <div className={styles.Editor} ref={monacoEl}></div>;
};
