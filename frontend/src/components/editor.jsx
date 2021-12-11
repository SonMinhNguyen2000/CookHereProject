import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { stateFromHTML } from "draft-js-import-html";
const TextEditor = ({editorState, handleChange}) =>{
    return (
        <Editor
            editorState={editorState}
            onEditorStateChange={handleChange}
            wrapperClassName="border rounded p-0"
            toolbarClassName="w-100 bg-light rounded"
            editorClassName="p-2"
            toolbar={{
                options: ["blockType", "inline", "fontSize", "list", "link", "history"],
                blockType: {
                    options: ["Normal", "H1", "H2", "H3", "H4", "H5", "H6", "Blockquote"],
                    inDropdown: true,
                },
                inline: { options: ["bold", "italic", "underline"] , inDropdown: true},
                list: { inDropdown: true },
                history: { inDropdown: true },
            }}
        />
    );
}

//validate editor function
const validateEditor = (editorState) => {
    let content = editorState.getCurrentContent().getPlainText("\u0001");//convert editor content to text
    if (content===""||content===undefined) return false;
    return true
};

//convert editor content to html string function
const convertContentToHTML = (editorState) => {
    //get raw content
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    //convert to html string and return
    return draftToHtml(rawContentState);
};

//convert html string to editor content function
const convertHtmlToEditorObject = (html) => {
    let contentState = stateFromHTML(html);//convert html to editor content
    return EditorState.createWithContent(contentState)
}


export default TextEditor
export {validateEditor, convertContentToHTML, convertHtmlToEditorObject}