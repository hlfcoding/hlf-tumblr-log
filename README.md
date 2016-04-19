# HLF Tumblr Log Theme

[![Package](https://img.shields.io/npm/v/hlf-tumblr-log.svg?style=flat)](https://www.npmjs.com/package/hlf-tumblr-log)
[![Code Climate](https://codeclimate.com/github/hlfcoding/hlf-tumblr-log/badges/gpa.svg)](https://codeclimate.com/github/hlfcoding/hlf-tumblr-log)
[![devDependency Status](https://david-dm.org/hlfcoding/hlf-tumblr-log/dev-status.svg)](https://david-dm.org/hlfcoding/hlf-tumblr-log#info=devDependencies)

> :scroll: A light Tumblr blog theme with quality UI.

     __         __       ___
    /\ \       /\ \     / __\
    \ \ \___   \ \ \   /\ \_/_
     \ \  __`\  \ \ \  \ \  __\
      \ \ \ \ \  \ \ \  \ \ \_/
       \ \_\ \_\  \ \_\  \ \_\
        \/_/ /_/   \/_/   \/_/

## Usage

Being not yet submitted to Tumblr, usage is done via:

- Setting up the static files in your bucket's location (defaults to `main/blog`):
  `banner-logo-sprite.png`, `favicon.ico`, `gradient.jpg`.

- Replacing the S3 bucket name (`pengxwang`) with your own throughout the source.
  - And updating the related `Theme Storage URL` theme variable.

- Exporting the `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` vars to your
  shell environment.

- Running `grunt release` to build and upload to your S3 bucket.

- Copy pasting `theme.html` into `tumblr.com/customize/<tumblog>`.

### Images

- Text posts can have banner images that can be `framed` (class) and
  `has-expandable` (parent class).
  - The `alt` attr for `framed` images will be displayed as an annotation.
  - If that image is shrunken to fit the post width, it will have a full-screen
    icon expand to tumblr-lightbox.
  - The `alt` attr can also contain a full-size url, but `data-width` and
    `data-height` attributes must be included for proper expansion.
  - Wrapping an `[]` around the alt text automatically adds `framed` to the
    image. Useful for Markdown.
  - Include the original source within an `()` at the end to show it during
    expansion. Useful for Markdown.

- Text posts have embedded galleries. When these galleries go past one row,
  Masonry is used for layout.
  - Images should store thumbnail urls in their `src`, and full-size urls in `alt`.
    `data-width` and `data-height` are also needed for tumblr-lightbox to work.

### Other

- Editing should happen in the Markdown-editor.
- Fancy blockquotes require a nested `span`.

## License

The MIT License (MIT)

    Copyright (c) 2013-present Peng Wang

    Permission is hereby granted, free of charge, to any person obtaining a
    copy of this software and associated documentation files (the "Software"),
    to deal in the Software without restriction, including without limitation
    the rights to use, copy, modify, merge, publish, distribute, sublicense,
    and/or sell copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
    DEALINGS IN THE SOFTWARE.
