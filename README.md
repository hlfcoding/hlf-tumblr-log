# HLF Tumblr Log Theme

:scroll: A light Tumblr blog theme with quality UI.

## Usage

### Images

- The `alt` attr for `framed` images will be displayed as an annotation.
  - If that image is shrunken, it will have a full-screen icon expand to
    tumblr-lightbox.
  - Wrapping an `[]` around the alt text automatically adds `framed` to the
    image. Useful for Markdown.
  - Include the original source within an `()` at the end to show it during
    expansion. Useful for Markdown.
- Text posts, esp. legacy ones, have embedded galleries. When these galleries go
  past one row, Masonry is used for layout.

### Other

- Editing should happen in the Markdown-editor.
- Fancy blockquotes require a nested `span`.
- Embedded legacy images require the `alt` attribute to be the full-size src.
