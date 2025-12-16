<template>
  <div>
    <div class="main-container">
      <div
        class="editor-container editor-container_document-editor"
        ref="editorContainerElement"
      >
        <div
          class="editor-container__menu-bar"
          ref="editorMenuBarElement"
        ></div>
        <div class="editor-container__toolbar" ref="editorToolbarElement"></div>
        <div class="editor-container__editor-wrapper">
          <div class="editor-container__editor">
            <div ref="editorElement">
              <ckeditor
                v-if="isLayoutReady"
                :editor="editor"
                :config="config"
                @ready="onReady"
                v-model="content"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  DecoupledEditor,
  AccessibilityHelp,
  Alignment,
  Autoformat,
  AutoImage,
  AutoLink,
  Autosave,
  Bold,
  CloudServices,
  Essentials,
  FindAndReplace,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  ImageBlock,
  ImageInsert,
  ImageInsertViaUrl,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Italic,
  Link,
  List,
  PageBreak,
  Paragraph,
  SelectAll,
  SimpleUploadAdapter,
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersCurrency,
  SpecialCharactersEssentials,
  SpecialCharactersLatin,
  SpecialCharactersMathematical,
  SpecialCharactersText,
  Strikethrough,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextTransformation,
  TodoList,
  Underline,
  Undo,
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

export default {
  name: 'app',
  data() {
    return {
      isLayoutReady: false,
      content: '',
      config: null, // CKEditor needs the DOM tree before calculating the configuration.
      editor: DecoupledEditor,
    };
  },
  watch: {
    content(newVal) {
      this.$emit('update:modelValue', newVal); // Emit sự kiện để cập nhật giá trị lên parent
    },
  },
  mounted() {
    this.config = {
      toolbar: {
        items: [
          'undo',
          'redo',
          '|',
          'fontSize',
          'fontFamily',
          'fontColor',
          'fontBackgroundColor',
          '|',
          'bold',
          'italic',
          'underline',
          '|',
          'link',
          'insertImage',
          'insertTable',
          '|',
          'alignment',
          '|',
          'bulletedList',
          'numberedList',
          'todoList',
        ],
        shouldNotGroupWhenFull: false,
      },
      plugins: [
        AccessibilityHelp,
        Alignment,
        Autoformat,
        AutoImage,
        AutoLink,
        Autosave,
        Bold,
        CloudServices,
        Essentials,
        FindAndReplace,
        FontBackgroundColor,
        FontColor,
        FontFamily,
        FontSize,
        ImageBlock,
        ImageInsert,
        ImageInsertViaUrl,
        ImageStyle,
        ImageToolbar,
        ImageUpload,
        Italic,
        Link,
        List,
        PageBreak,
        Paragraph,
        SelectAll,
        SimpleUploadAdapter,
        SpecialCharacters,
        SpecialCharactersArrows,
        SpecialCharactersCurrency,
        SpecialCharactersEssentials,
        SpecialCharactersLatin,
        SpecialCharactersMathematical,
        SpecialCharactersText,
        Strikethrough,
        Table,
        TableCaption,
        TableCellProperties,
        TableColumnResize,
        TableProperties,
        TableToolbar,
        TextTransformation,
        TodoList,
        Underline,
        Undo,
      ],
      fontFamily: {
        supportAllValues: true,
      },
      fontSize: {
        options: [10, 12, 14, 'default', 18, 20, 22],
        supportAllValues: true,
      },
      image: {
        toolbar: [
          'imageTextAlternative',
          '|',
          'imageStyle:alignBlockLeft',
          'imageStyle:block',
          'imageStyle:alignBlockRight',
        ],
        styles: {
          options: ['alignBlockLeft', 'block', 'alignBlockRight'],
        },
      },
      initialData: '',
      link: {
        addTargetToExternalLinks: true,
        defaultProtocol: 'https://',
        decorators: {
          toggleDownloadable: {
            mode: 'manual',
            label: 'Downloadable',
            attributes: {
              download: 'file',
            },
          },
        },
      },
      menuBar: {
        isVisible: true,
      },
      placeholder: 'Mời bạn nhập!',
      table: {
        contentToolbar: [
          'tableColumn',
          'tableRow',
          'mergeTableCells',
          'tableProperties',
          'tableCellProperties',
        ],
      },
    };

    this.isLayoutReady = true;
  },
  methods: {
    onReady(editor) {
      Array.from(this.$refs.editorToolbarElement.children).forEach((child) =>
        child.remove()
      );
      Array.from(this.$refs.editorMenuBarElement.children).forEach((child) =>
        child.remove()
      );

      this.$refs.editorToolbarElement.appendChild(
        editor.ui.view.toolbar.element
      );
      this.$refs.editorMenuBarElement.appendChild(
        editor.ui.view.menuBarView.element
      );
    },
  },
};
</script>
