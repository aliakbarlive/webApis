import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const EditorApp = ({ initialValue, onEditorChange }) => {
  const editorRef = useRef(null);

  return (
    <>
      <Editor
        apiKey="d3x2axgpsgwnta93guh3r6gcnhgbg05atksbv5ac0tdcw5fz"
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue={initialValue}
        onEditorChange={onEditorChange}
        init={{
          height: 500,
          visual: false,
          menubar: false,
          plugins: [
            'advlist',
            'autolink',
            'lists',
            'link',
            'image',
            'charmap',
            'print',
            'preview',
            'anchor',
            'searchreplace',
            'visualblocks',
            'code',
            'fullscreen',
            'insertdatetime',
            'media',
            'table',
            'paste',
            'code',
            'help',
            'wordcount',
          ],
          toolbar:
            'undo redo | formatselect | ' +
            'bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | link | bullist numlist outdent indent | ' +
            'removeformat | code | help',
          content_style:
            'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        }}
      />
    </>
  );
};

export default EditorApp;
