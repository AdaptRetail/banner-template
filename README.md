# Banner template
> A great starting point for building product based display banners.

![Demo of banner template](assets/banner_preview.gif)

## Table of content
- [Install](#install)
- [Usage](#usage)
    - [Local development](#npm-run-watch)
    - [Prepare banner for production](#npm-run-prod)
    - [Files](#files)
- [Dependencies](#dependencies)
- [Extracted style](#extracted-style)
- [Publish to Adapt Retail](#publish)



<a name="install"></a>
## Install

```bash
# Clone repository
git clone https://github.com/AdaptRetail/banner-template

# Go to directory
cd banner-template

# Install dependencies
npm install 
```

<a name="usage"></a>
## Usage

<a name="npm-run-watch"></a>
### Build banners in local environment

```bash
# Open file in default browser (browser-sync) and
# auto refresh browser on file save
npm run watch
```
> You can also display your banners on other devices on your local network.
> Check your terminal for information after running `npm run watch`.

<a name="npm-run-prod"></a>
### Prepare banner for production

The `npm run prod` command is compiling and minifying the css and javascript.
All your files will be compiled to the `dist/` folder.

```bash
# Compile files to dist/ folder
npm run prod
```

<a name="files"></a>
### Files

<a name="dependencies"></a>
## Dependencies

This project is using different dependencies to make it easier to make display banners.

<a name="banner-style"></a>
### [Banner style](https://github.com/AdaptRetail/banner-style)

Micro frontend framework containing helpers like `grid` system using flex.

<a name="sass-asset-inline"></a>
### [sass-asset-inline](https://github.com/LasseHaslev/sass-asset-inliner)

Inline assets like `image` and `fonts` in your sass files with simple syntax.

```scss
@font-face {
    src: inline-font( 'path/to/your/font.ttf' ); // Include full font

    // Subset font by adding regex as second parameter
    // of each character you want to include
    src: inline-font( 'path/to/your/font.ttf', '[0-9]' );
}

body {
    // Inline image
    background-image: inline-image( 'path/to/your/image.png' );

    // Inline and resize image to width (Kepp aspect ratio)
    background-image: inline-image( 'path/to/your/image.png', "200" );

    // Resize image and ignoring aspect ratio
    background-image: inline-image( 'path/to/your/image.png', "200x400" );

    // Resize image to height and keep aspect ratio
    background-image: inline-image( 'path/to/your/image.png', "_x400" );

    // Underscore works also for height.
    // ("200x_" equals "200" as shown above)
}
```

### [Adapt Data](https://github.com/AdaptRetail/banner-data)

Communicate with Adapt Retail productions through our API.

### [laravel-mix](https://github.com/JeffreyWay/laravel-mix)

We are extending [laravel-mix](https://github.com/JeffreyWay/laravel-mix) with [Laravel mix extender](https://github.com/AdaptRetail/adapt-mix-extender) to include helpers like the [sass-asset-inline](#sass-asset-inline)

<a name="extracted-style"></a>
## Extracted style

Some of the style of this template has been extracted [to another git repository](https://github.com/AdaptRetail/priceco-style).
This is to reuse the elements and components in other productions.

This is a recommendation if you are creating multiple templates for [Adapt Retail](https://adaptretail.com).

<a name="publish"></a>
## Publishing to [Adapt Retail](https://adaptretail.com)

1. [Log in to your Adapt retail account](https://app.adaptretail.com/signup_login.php?task=login)
1. Click on template section in your left navigation bar
1. Create a new `Banner template`
1. Set your properties in `Details` tab
1. Select `Files` tab
1. Prepare files to [Adapt Retail](https://adaptretail.com) by running `npm run prod` in your terminal.
1. Drag `dist/ad.js` and `dist/ad.css` to the `dropzone (Drop files or click to upload)` in Adapt
1. **And you are done!**
