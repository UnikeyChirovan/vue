<template>
  <div class="ckeditor-wrapper">
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
  name: 'CKEditorComponent',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      isLayoutReady: false,
      content: this.modelValue || '',
      config: null,
      editor: DecoupledEditor,
    };
  },
  watch: {
    content(newVal) {
      this.$emit('update:modelValue', newVal);
    },
    modelValue(newVal) {
      if (newVal !== this.content) {
        this.content = newVal;
      }
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

<style scoped>
/* ========== CKEDITOR WRAPPER ========== */
.ckeditor-wrapper {
  width: 100%;
  padding: 20px;
  background: #f5f5f5;
}

html.dark-mode .ckeditor-wrapper {
  background: #0a0a0a;
}

.main-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* ========== EDITOR CONTAINER ========== */
.editor-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

html.dark-mode .editor-container {
  background: #1e1e1e;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

/* ========== MENU BAR ========== */
.editor-container__menu-bar {
  background: #f8f8f8;
  border-bottom: 1px solid #e0e0e0;
  padding: 8px 12px;
}

html.dark-mode .editor-container__menu-bar {
  background: #252525;
  border-bottom-color: #333;
}

/* ========== TOOLBAR ========== */
.editor-container__toolbar {
  background: #fafafa;
  border-bottom: 1px solid #e0e0e0;
  padding: 10px 12px;
}

html.dark-mode .editor-container__toolbar {
  background: #2a2a2a;
  border-bottom-color: #333;
}

/* ========== EDITOR WRAPPER ========== */
.editor-container__editor-wrapper {
  padding: 20px;
  min-height: 500px;
  background: white;
}

html.dark-mode .editor-container__editor-wrapper {
  background: #1a1a1a;
}

.editor-container__editor {
  min-height: 450px;
}

/* ========== CKEDITOR DARK MODE CSS VARIABLES ========== */
/* Giải pháp chính thức từ CKEditor: https://ckeditor.com/docs/ckeditor5/latest/framework/deep-dive/ui/theme-customization.html */

html.dark-mode {
  /* ✅ Content font color - QUAN TRỌNG NHẤT */
  --ck-content-font-color: #e0e0e0;

  /* Base colors */
  --ck-color-base-background: #1a1a1a;
  --ck-color-base-border: #333;

  /* Focus & selection */
  --ck-color-focus-border: #0f8a4a;
  --ck-color-text: #e0e0e0;
  --ck-color-shadow-drop: rgba(0, 0, 0, 0.4);
  --ck-color-shadow-inner: rgba(0, 0, 0, 0.3);

  /* Button colors */
  --ck-color-button-default-background: transparent;
  --ck-color-button-default-hover-background: #2a2a2a;
  --ck-color-button-default-active-background: #252525;
  --ck-color-button-on-background: #2a2a2a;
  --ck-color-button-on-hover-background: #333;

  /* Input colors */
  --ck-color-input-background: #2a2a2a;
  --ck-color-input-border: #3a3a3a;
  --ck-color-input-text: #e0e0e0;

  /* Toolbar colors */
  --ck-color-toolbar-background: #2a2a2a;
  --ck-color-toolbar-border: #333;

  /* Panel colors */
  --ck-color-panel-background: #2a2a2a;
  --ck-color-panel-border: #3a3a3a;

  /* Dropdown colors */
  --ck-color-dropdown-panel-background: #2a2a2a;
  --ck-color-dropdown-panel-border: #3a3a3a;

  /* List colors */
  --ck-color-list-background: transparent;
  --ck-color-list-button-hover-background: #333;
  --ck-color-list-button-on-background: #0f8a4a;
  --ck-color-list-button-on-text: #ffffff;

  /* Tooltip colors */
  --ck-color-tooltip-background: #3a3a3a;
  --ck-color-tooltip-text: #e0e0e0;

  /* Widget colors */
  --ck-color-widget-blurred-border: #3a3a3a;
  --ck-color-widget-hover-border: #0f8a4a;
  --ck-color-widget-editable-focus-background: #1a1a1a;

  /* Link colors */
  --ck-color-link-default: #0f8a4a;
}

/* ========== EDITOR CONTENT AREA ========== */
:deep(.ck-editor__editable) {
  min-height: 400px;
  border: 1px solid #e0e0e0 !important;
  border-radius: 8px !important;
  padding: 20px !important;
  font-size: 16px !important;
  line-height: 1.6 !important;
}

/* Light mode - chỉ apply khi KHÔNG có dark-mode class */
html:not(.dark-mode) :deep(.ck-editor__editable) {
  background: white !important;
  color: #333 !important;
}

html:not(.dark-mode) :deep(.ck-editor__editable:focus),
html:not(.dark-mode) :deep(.ck-editor__editable.ck-focused) {
  background: white !important;
  color: #333 !important;
  border-color: #0c713d !important;
  box-shadow: 0 0 0 2px rgba(12, 113, 61, 0.1) !important;
}

/* ✅ Dark mode cho editor - dùng CSS variables */
html.dark-mode :deep(.ck-editor__editable) {
  background: var(--ck-color-base-background) !important;
  color: var(--ck-content-font-color) !important;
  border-color: var(--ck-color-base-border) !important;
}

/* ✅ Focus state - GIỮ BACKGROUND TỐI KHI CLICK */
html.dark-mode :deep(.ck-editor__editable:focus),
html.dark-mode :deep(.ck-editor__editable.ck-focused) {
  background: var(--ck-color-base-background) !important;
  color: var(--ck-content-font-color) !important;
  border-color: var(--ck-color-focus-border) !important;
  box-shadow: 0 0 0 2px rgba(15, 138, 74, 0.2) !important;
}

/* Tất cả text trong editor */
html.dark-mode :deep(.ck-editor__editable *) {
  color: var(--ck-content-font-color) !important;
}

html.dark-mode :deep(.ck-editor__editable p),
html.dark-mode :deep(.ck-editor__editable span),
html.dark-mode :deep(.ck-editor__editable div),
html.dark-mode :deep(.ck-editor__editable h1),
html.dark-mode :deep(.ck-editor__editable h2),
html.dark-mode :deep(.ck-editor__editable h3),
html.dark-mode :deep(.ck-editor__editable h4),
html.dark-mode :deep(.ck-editor__editable h5),
html.dark-mode :deep(.ck-editor__editable h6),
html.dark-mode :deep(.ck-editor__editable li) {
  color: var(--ck-content-font-color) !important;
}

/* Placeholder */
:deep(.ck-placeholder::before) {
  color: #999 !important;
  font-style: italic !important;
}

html.dark-mode :deep(.ck-placeholder::before) {
  color: #666 !important;
}

/* ========== TOOLBAR STYLES ========== */
:deep(.ck-toolbar) {
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
  flex-wrap: wrap !important;
}

:deep(.ck-toolbar__items) {
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 4px !important;
  align-items: center !important;
}

:deep(.ck-toolbar__grouped-dropdown) {
  margin-left: auto !important;
}

:deep(.ck-toolbar__grouped-dropdown > .ck-dropdown__button) {
  padding: 6px 8px !important;
  min-width: auto !important;
}

/* Toolbar buttons */
:deep(.ck-button) {
  background: transparent !important;
  border: none !important;
  color: #666 !important;
  padding: 6px 8px !important;
  min-width: 32px !important;
  min-height: 32px !important;
  border-radius: 4px !important;
  transition: all 0.2s ease !important;
}

html.dark-mode :deep(.ck-button) {
  color: #b0b0b0 !important;
}

:deep(.ck-button:hover:not(.ck-disabled)) {
  background: rgba(12, 113, 61, 0.1) !important;
  color: #0c713d !important;
}

html.dark-mode :deep(.ck-button:hover:not(.ck-disabled)) {
  background: var(--ck-color-button-default-hover-background) !important;
  color: #0f8a4a !important;
}

:deep(.ck-button.ck-on) {
  background: rgba(12, 113, 61, 0.15) !important;
  color: #0c713d !important;
}

html.dark-mode :deep(.ck-button.ck-on) {
  background: var(--ck-color-button-on-background) !important;
  color: #0f8a4a !important;
}

/* Toolbar separators */
:deep(.ck-toolbar__separator) {
  align-self: stretch !important;
  width: 1px !important;
  background: #e0e0e0 !important;
  margin: 4px 6px !important;
}

html.dark-mode :deep(.ck-toolbar__separator) {
  background: #3a3a3a !important;
}

:deep(.ck-button__label) {
  font-size: 13px !important;
  line-height: 1.4 !important;
}

/* ========== DROPDOWN PANELS ========== */
:deep(.ck-dropdown__panel) {
  background: white !important;
  border: 1px solid #e0e0e0 !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  border-radius: 6px !important;
  max-height: 300px !important;
  overflow-y: auto !important;
}

html.dark-mode :deep(.ck-dropdown__panel) {
  background: var(--ck-color-dropdown-panel-background) !important;
  border-color: var(--ck-color-dropdown-panel-border) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
}

:deep(.ck-list__item) {
  background: transparent !important;
  color: #333 !important;
  padding: 8px 12px !important;
}

html.dark-mode :deep(.ck-list__item) {
  color: #e0e0e0 !important;
}

:deep(.ck-list__item:hover) {
  background: rgba(12, 113, 61, 0.1) !important;
}

html.dark-mode :deep(.ck-list__item:hover) {
  background: var(--ck-color-list-button-hover-background) !important;
}

/* ========== COLOR PICKER ========== */
:deep(.ck-color-grid__tile) {
  border: 1px solid #e0e0e0 !important;
  width: 24px !important;
  height: 24px !important;
}

html.dark-mode :deep(.ck-color-grid__tile) {
  border-color: #3a3a3a !important;
}

/* ========== MENU BAR ========== */
:deep(.ck-menu-bar) {
  background: transparent !important;
  border: none !important;
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 4px !important;
}

:deep(.ck-menu-bar__menu-button) {
  color: #666 !important;
  padding: 6px 12px !important;
  border-radius: 4px !important;
  font-size: 13px !important;
}

html.dark-mode :deep(.ck-menu-bar__menu-button) {
  color: #b0b0b0 !important;
}

:deep(.ck-menu-bar__menu-button:hover) {
  background: rgba(12, 113, 61, 0.1) !important;
  color: #0c713d !important;
}

html.dark-mode :deep(.ck-menu-bar__menu-button:hover) {
  background: var(--ck-color-button-default-hover-background) !important;
  color: #0f8a4a !important;
}

/* ========== TOOLTIPS ========== */
:deep(.ck-tooltip) {
  background: #333 !important;
  color: white !important;
  padding: 6px 10px !important;
  border-radius: 4px !important;
  font-size: 12px !important;
}

html.dark-mode :deep(.ck-tooltip) {
  background: var(--ck-color-tooltip-background) !important;
  color: var(--ck-color-tooltip-text) !important;
}

/* ========== TABLES ========== */
:deep(.ck-content table) {
  border: 1px solid #e0e0e0 !important;
  border-collapse: collapse !important;
  width: 100% !important;
}

html.dark-mode :deep(.ck-content table) {
  border-color: #3a3a3a !important;
}

:deep(.ck-content table td),
:deep(.ck-content table th) {
  border: 1px solid #e0e0e0 !important;
  background: white !important;
  padding: 8px !important;
}

html.dark-mode :deep(.ck-content table td),
html.dark-mode :deep(.ck-content table th) {
  border-color: #3a3a3a !important;
  background: #2a2a2a !important;
  color: #e0e0e0 !important;
}

/* ========== LINKS ========== */
:deep(.ck-content a) {
  color: #0c713d !important;
  text-decoration: underline !important;
}

html.dark-mode :deep(.ck-content a) {
  color: var(--ck-color-link-default) !important;
}

/* ========== IMAGES ========== */
:deep(.ck-content img) {
  border-radius: 4px;
  max-width: 100%;
  height: auto;
}

:deep(.ck-content figure.image) {
  margin: 1em 0;
}

/* ========== LISTS ========== */
:deep(.ck-content ul),
:deep(.ck-content ol) {
  padding-left: 2em !important;
  margin: 1em 0 !important;
}

:deep(.ck-content li) {
  margin: 0.5em 0 !important;
}

html.dark-mode :deep(.ck-content li) {
  color: #e0e0e0 !important;
}

/* ========== RESPONSIVE DESIGN ========== */

/* Large Desktop (1440px+) - Full features */
@media (min-width: 1441px) {
  .ckeditor-wrapper {
    padding: 25px;
  }

  :deep(.ck-editor__editable) {
    min-height: 450px;
    padding: 25px !important;
    font-size: 17px !important;
  }
}

/* Desktop (1280px - 1440px) */
@media (min-width: 1280px) and (max-width: 1440px) {
  .ckeditor-wrapper {
    padding: 20px;
  }

  :deep(.ck-editor__editable) {
    min-height: 400px;
    padding: 20px !important;
  }
}

/* Laptop (1024px - 1279px) */
@media (min-width: 1024px) and (max-width: 1279px) {
  .ckeditor-wrapper {
    padding: 18px;
  }

  .editor-container__editor-wrapper {
    padding: 18px;
    min-height: 450px;
  }

  :deep(.ck-editor__editable) {
    min-height: 380px;
    padding: 18px !important;
    font-size: 15px !important;
  }

  :deep(.ck-button) {
    padding: 5px 7px !important;
    min-width: 30px !important;
    min-height: 30px !important;
  }

  :deep(.ck-button__label) {
    font-size: 12px !important;
  }
}

/* Tablet (768px - 1023px) - Toolbar auto-groups */
@media (max-width: 1023px) {
  .ckeditor-wrapper {
    padding: 15px;
  }

  .editor-container {
    border-radius: 10px;
  }

  .editor-container__menu-bar {
    padding: 6px 10px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .editor-container__toolbar {
    padding: 8px 10px;
    overflow-x: visible;
  }

  .editor-container__editor-wrapper {
    padding: 15px;
    min-height: 400px;
  }

  :deep(.ck-editor__editable) {
    min-height: 350px;
    padding: 15px !important;
    font-size: 15px !important;
  }

  :deep(.ck-toolbar__items) {
    gap: 3px !important;
  }

  :deep(.ck-button) {
    padding: 5px 6px !important;
    min-width: 28px !important;
    min-height: 28px !important;
  }

  :deep(.ck-button__label) {
    font-size: 12px !important;
  }

  :deep(.ck-toolbar__separator) {
    margin: 3px 4px !important;
  }

  :deep(.ck-toolbar__grouped-dropdown) {
    display: flex !important;
    margin-left: 8px !important;
  }

  .editor-container__menu-bar::-webkit-scrollbar {
    height: 4px;
  }

  .editor-container__menu-bar::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 2px;
  }

  html.dark-mode .editor-container__menu-bar::-webkit-scrollbar-thumb {
    background: #555;
  }
}

/* Mobile (480px - 767px) - Very compact */
@media (min-width: 480px) and (max-width: 767px) {
  .ckeditor-wrapper {
    padding: 12px;
  }

  .editor-container {
    border-radius: 8px;
  }

  .editor-container__menu-bar,
  .editor-container__toolbar {
    padding: 6px 8px;
  }

  .editor-container__editor-wrapper {
    padding: 12px;
    min-height: 350px;
  }

  :deep(.ck-editor__editable) {
    min-height: 300px;
    padding: 12px !important;
    font-size: 14px !important;
  }

  :deep(.ck-button) {
    padding: 4px 5px !important;
    min-width: 26px !important;
    min-height: 26px !important;
  }

  :deep(.ck-button__label) {
    font-size: 11px !important;
  }

  :deep(.ck-toolbar__items) {
    gap: 2px !important;
  }

  :deep(.ck-toolbar__separator) {
    margin: 2px 3px !important;
  }

  :deep(.ck-dropdown__panel) {
    max-width: 90vw !important;
    max-height: 250px !important;
  }
}

/* Small Mobile (≤480px) - Minimal toolbar */
@media (max-width: 480px) {
  .ckeditor-wrapper {
    padding: 10px;
  }

  .editor-container {
    border-radius: 6px;
  }

  .editor-container__menu-bar,
  .editor-container__toolbar {
    padding: 5px 6px;
  }

  .editor-container__editor-wrapper {
    padding: 10px;
    min-height: 300px;
  }

  :deep(.ck-editor__editable) {
    min-height: 250px;
    padding: 10px !important;
    font-size: 14px !important;
    line-height: 1.5 !important;
  }

  :deep(.ck-button) {
    padding: 3px 4px !important;
    min-width: 24px !important;
    min-height: 24px !important;
  }

  :deep(.ck-button__label) {
    font-size: 10px !important;
  }

  :deep(.ck-toolbar__items) {
    gap: 1px !important;
  }

  :deep(.ck-toolbar__separator) {
    margin: 2px !important;
  }

  :deep(.ck-toolbar__separator:nth-child(n + 3)) {
    display: none !important;
  }

  :deep(.ck-toolbar__grouped-dropdown > .ck-dropdown__button) {
    padding: 5px 6px !important;
    background: rgba(12, 113, 61, 0.1) !important;
  }

  html.dark-mode :deep(.ck-toolbar__grouped-dropdown > .ck-dropdown__button) {
    background: rgba(15, 138, 74, 0.15) !important;
  }

  :deep(.ck-dropdown__panel) {
    max-width: 85vw !important;
    max-height: 200px !important;
  }

  :deep(.ck-list__item) {
    padding: 6px 10px !important;
    font-size: 12px !important;
  }

  :deep(.ck-color-grid__tile) {
    width: 20px !important;
    height: 20px !important;
  }
}

/* Extra Small Mobile (≤360px) - Ultra minimal */
@media (max-width: 360px) {
  .ckeditor-wrapper {
    padding: 8px;
  }

  .editor-container__editor-wrapper {
    padding: 8px;
    min-height: 280px;
  }

  :deep(.ck-editor__editable) {
    min-height: 220px;
    padding: 8px !important;
    font-size: 13px !important;
  }

  :deep(.ck-button) {
    padding: 2px 3px !important;
    min-width: 22px !important;
    min-height: 22px !important;
  }

  :deep(.ck-button__label) {
    font-size: 9px !important;
  }

  :deep(.ck-toolbar__items > .ck-button:nth-child(n + 6)) {
    display: none !important;
  }

  :deep(.ck-dropdown__panel) {
    max-width: 80vw !important;
    max-height: 180px !important;
  }
}

/* ========== TOUCH OPTIMIZATIONS ========== */
@media (hover: none) and (pointer: coarse) {
  :deep(.ck-button) {
    min-width: 36px !important;
    min-height: 36px !important;
    padding: 8px !important;
  }

  :deep(.ck-list__item) {
    padding: 10px 12px !important;
    min-height: 44px !important;
  }

  :deep(.ck-color-grid__tile) {
    width: 28px !important;
    height: 28px !important;
  }
}

/* ========== LANDSCAPE MOBILE ========== */
@media (max-height: 500px) and (orientation: landscape) {
  .editor-container__editor-wrapper {
    min-height: 250px;
  }

  :deep(.ck-editor__editable) {
    min-height: 200px;
  }

  :deep(.ck-dropdown__panel) {
    max-height: 150px !important;
  }
}
</style>
