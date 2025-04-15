import React, { useEffect, useState } from "react";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { convertToHTML } from "draft-convert";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Box } from "@mui/material";

const TextEditor = ({
  convertedContent,
  setConvertedContent,
  data,
  onChange,
}) => {
  console.log("data*****************ggggg**************", data);

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const check = () => {
    console.log("editorState", convertToHTML(editorState.getCurrentContent()));
    setConvertedContent(convertToHTML(editorState.getCurrentContent()));
  };

  const loadDataFormHtml = (data) => {
    // const html = "<p>Hey this <strong>editor</strong> rocks 😀</p>";
    const html = data;
    const contentBlock = htmlToDraft(html);
    const contentState = ContentState.createFromBlockArray(
      contentBlock.contentBlocks
    );
    console.log(
      "EditorState.createWithContent(contentState)",
      EditorState.createWithContent(contentState)
    );
    setEditorState(EditorState.createWithContent(contentState));
  };
  useEffect(() => {
    let html = convertToHTML(editorState.getCurrentContent());
    setConvertedContent(html);

    if (onChange) {
      onChange(html); // Trigger parent change handler
    }
  }, [editorState]);
  useEffect(() => {
    console.log("aaaaaaaaaaaaaaaaaaaa data", data);
    if (data !== undefined) {
      loadDataFormHtml(data);
    }
  }, []);

  return (
    <Box
      sx={{ border: "1px solid #cccccc", borderRadius: "6px", py: 1, px: 1.5 }}
    >
      {/* <h2 onClick={check}>Check</h2>
      <h2 onClick={loadDataFormHtml}>load in editor from string html</h2>
      <div dangerouslySetInnerHTML={{ __html: convertedContent }}></div> */}

      <Editor
        placeholder="Description"
        editorState={editorState}
        onEditorStateChange={setEditorState}
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbarClassName="toolbar-class"
        toolbar={{
          options: [
            "inline",
            "blockType",
            "fontSize",
            "list",
            "textAlign",
            "history",
            "colorPicker",
          ],

          // image: {
          //   uploadCallback: uploadImageCallback,
          //   previewImage: true,
          //   alt: { present: true, mandatory: false },
          // },
          // inline: { inDropdown: true },
          // list: { inDropdown: true },
          // textAlign: { inDropdown: true },
          // link: { inDropdown: true },
          // history: { inDropdown: true },
        }}
      />
      {/* <div>{editorState}</div> */}
    </Box>
  );
};

export default TextEditor;
