import React, { useCallback, useMemo, useState } from "react";
import isHotkey from "is-hotkey";
import { Editable, withReact, useSlate, Slate } from "slate-react";
import { Editor, Transforms, createEditor } from "slate";
import { withHistory } from "slate-history";

import ReactIcon from 'react-icons-kit';
import { bold } from 'react-icons-kit/feather/bold';
import { italic } from 'react-icons-kit/feather/italic';
import { code } from 'react-icons-kit/feather/code';
import { list } from 'react-icons-kit/feather/list';
import { underline } from 'react-icons-kit/feather/underline';
import {alignCenter} from 'react-icons-kit/feather/alignCenter'
import {alignLeft} from 'react-icons-kit/feather/alignLeft'
import {alignRight} from 'react-icons-kit/feather/alignRight'

const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code"
};

const LIST_TYPES = ["numbered-list", "bulleted-list"];

const RichText = ({handleChange, initial}) => {


  const [value, setValue] = useState(initialValue);
  
  const renderElement = useCallback(props => <Element {...props} />, []);
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  return (
    <Slate editor={editor} value={value} onChange={handleChange}>
      <div>
        <MarkButton format="bold" icon="format_bold" />
        <MarkButton format="italic" icon="format_italic" />
        <MarkButton format="underline" icon="format_underlined" />
        <MarkButton format="code" icon="code" />
        
        {/* <MarkButton format="alignleft" icon="alignleft" />
        <MarkButton format="aligncenter" icon="aligncenter" />
        <MarkButton format="alignright" icon="alignright" /> */}
        <BlockButton format="alignleft" icon="alignleft" />
        <BlockButton format="aligncenter" icon="aligncenter" />
        <BlockButton format="alignright" icon="alignright" />
        {/* <BlockButton format="block-quote" icon="format_quote" />
        <BlockButton format="numbered-list" icon="format_list_numbered" />
        <BlockButton format="bulleted-list" icon="format_list_bulleted" /> */}
      </div>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some rich text…"
        className="rich-text-editor"
        spellCheck
        autoFocus
        onKeyDown={event => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event)) {
              event.preventDefault();
              const mark = HOTKEYS[hotkey];
              toggleMark(editor, mark);
            }
          }
        }}
      />
    </Slate>
  );
};

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: n => LIST_TYPES.includes(n.type),
    split: true
  });

  Transforms.setNodes(editor, {
    type: isActive ? "paragraph" : isList ? "list-item" : format
  });

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: n => n.type === format
  });

  return !!match;
};

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case "block-quote":
      return <blockquote {...attributes}>{children}</blockquote>;
    case "bulleted-list":
      return <ul {...attributes}>{children}</ul>;
    case "heading-one":
      return <h1 {...attributes}>{children}</h1>;
    case "heading-two":
      return <h2 {...attributes}>{children}</h2>;
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "numbered-list":
      return <ol {...attributes}>{children}</ol>;
    case "aligncenter":
      return <p style={{textAlign: 'center'}} {...attributes}>{children}</p>;
    case "alignleft":
      return <p style={{textAlign: 'left'}} {...attributes}>{children}</p>;
    case "alignright":
      return <p style={{textAlign: 'right'}} {...attributes}>{children}</p>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }
  return <span {...attributes}>{children}</span>;
};

const BlockButton = ({ format, icon }) => {
  const editor = useSlate();

  let svg;

  if( format === 'bold'){
    svg = <ReactIcon icon={bold} ></ReactIcon>
  }
  else if( format === 'italic'){
    svg = <ReactIcon icon={italic} ></ReactIcon>
  }
  else if( format ==='code'){
    svg = <ReactIcon icon={code} ></ReactIcon>
  }
  else if( format === 'underline'){
    svg = <ReactIcon icon={underline} ></ReactIcon>
  }
  else if( format === 'aligncenter'){
    svg = <ReactIcon icon={alignCenter} ></ReactIcon>
  }
  else if( format === 'alignright'){
    svg = <ReactIcon icon={alignRight} ></ReactIcon>
  }
  else if( format === 'alignleft'){
    svg = <ReactIcon icon={alignLeft} ></ReactIcon>
  }
  else {
    svg = <ReactIcon icon={code} ></ReactIcon>
  }

  return (
    <button
      active={isBlockActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      {svg}
    </button>
  );
};

const MarkButton = ({ format, icon }) => {
  const editor = useSlate();

  let svg;

  if( format === 'bold'){
    svg = <ReactIcon icon={bold} ></ReactIcon>
  }
  else if( format === 'italic'){
    svg = <ReactIcon icon={italic} ></ReactIcon>
  }
  else if( format === 'code'){
    svg = <ReactIcon icon={code} ></ReactIcon>
  }
  else if( format === 'underline'){
    svg = <ReactIcon icon={underline} ></ReactIcon>
  }
  else if( format === 'aligncenter'){
    svg = <ReactIcon icon={alignCenter} ></ReactIcon>
  }
  else if( format === 'alignright'){
    svg = <ReactIcon icon={alignRight} ></ReactIcon>
  }
  else if( format === 'alignleft'){
    svg = <ReactIcon icon={alignLeft} ></ReactIcon>
  }
  else {
    svg = <ReactIcon icon={code} ></ReactIcon>
  }

  return (
    <button
      active={isMarkActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {svg}
    </button>
  );
};

const initialValue = [
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
];

export default RichText;
