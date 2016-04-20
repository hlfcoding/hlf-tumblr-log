# Using Tumblr.Lightbox.
# Using $.fn.masonry.

# Templates that don't require interpolation.
$('script[type="text/x-tpl-html"]').each ->
  $tpl = $(@)
  name = $tpl.attr('id')
  html = $(@).html()
  $("[data-tpl=#{name}]").html(html)
  return

# Cycle through about text.
$snips = $('.root-header .about p:not(:empty)')
$snips.showRandom = ->
  rand = parseInt(Math.random() * $snips.length, 10)
  $snips
    .hide()
    .eq(rand - 1).show().end()
  setTimeout $snips.showRandom, 10 * 1000
  return
$snips.showRandom()

# Regexps.
rOriginalInAttr = /\((https?:\/\/.*)\)$/
rFramingInAttr = /^\[(.*)\]$/

# Expand as needed. Use default lightbox.
$.fn.expandableImages = (extraOpts) ->
  extraOpts = {} unless $.isPlainObject(extraOpts)
  @.each -> 
    $img = $(@)
    # Use original, high-res source if provided.
    hasOriginal = $img.is('[alt^="http"]')
    altText = $img.attr('alt')
    if hasOriginal
      highResSrc = altText
    else
      hasOriginal = altText.match rOriginalInAttr
      if hasOriginal? and hasOriginal.length
        # Handle compound alt text.
        highResSrc = hasOriginal[1]
        altText = altText.replace(rOriginalInAttr, '')
        $img
          .attr('alt', altText)
          .closest('[data-annotation]').attr('data-annotation', altText)
      else
        # Handle single-source images.
        highResSrc = $img.attr('src')
    # Setup.
    $img.parent()
      .addClass('has-expandable')
      .on 'click', ->
        Tumblr.Lightbox.init [
          $.extend {},
            height: $img.data('height')
            high_res: highResSrc
            low_res: $img.attr('src')
            width: $img.data('width')
          , extraOpts
        ], 1
        return
    return

$.fn.conditionallyExpandableImages = ->
  @.each ->
    $img = $(@)
    # Auto-framing, for markdown posts.
    unless $img.hasClass('framed')
      $img
        .addClass('framed')
        .attr('alt', $img.attr('alt').replace rFramingInAttr, '$1' )
    # Annotate certain images.
    $img.parent('p').attr('data-annotation', $img.attr 'alt' )
    # Expand those needing expansion, and with correct dimensions.
    $('<img>')
      .attr('src', $img.attr 'src' )
      .on 'load', ->
        $el = $(@)
        if $el.prop('width') > $img.width()
          $img.expandableImages
            width: $el.prop('width')
            height: $el.prop('height')
        return
    return

$.fn.expandableGalleries = ->
  $image = @children().first()
  numPerRow = @first().width() / $image.width()

  # Masonry support for big grids.
  @filter(-> $(@).children().length > numPerRow).each ->
    $el = $(@)
    completeInit = ->
      $el
        .removeClass('invisible')
        .masonry
          itemSelector: 'a, img'
          columnWidth: $image.outerWidth()
          gutter: parseInt($image.css('margin-right'), 10)
      return
    $el
      .addClass('invisible')
      .imagesLoaded(completeInit)
    return

  # Use default lightbox.
  @each ->
    $el = $(@)
    images = $el.find('img')
      .map ->
        $img = $(@)
        height: $img.data('height')
        high_res: $img.attr('alt') || $img.attr('src')
        low_res: $img.attr('src')
        width: $img.data('width')
      .get()
    $el.find('img').each (idx) ->
      $img = $(@)
      $img.on 'click', (e) ->
        position = idx + 1
        Tumblr.Lightbox.init(images, position)
        e.preventDefault()
        return
      return
    return

$.fn.framedEmbeds = ->
  @.each ->
    $el = $(@)
    $el
      .prop('width', '100%')
      .filter('object').height($el.prop 'height' )
    return

# Ready.
$ ->
  $('.text-post .body')
    # Handle full, 'rich' images.
    .find('img.framed[alt], img[alt^="["][alt$="]"]')
      .filter(':not([alt^="http"])').conditionallyExpandableImages().end()
      .filter('[alt^="http"]').expandableImages().end()
    .end()
    # Resize embeds, partly so frame style applies.
    .find('object, embed')
      .filter('[width]').framedEmbeds().end()
    .end()
  # Image galleries.
  $('.p_image_embed').expandableGalleries()

  # Fail-safe for requirement for ruled and ticked blockquotes.
  $('.posts')
    .find('blockquote:not(:has(span))')
      .wrapInner('<span>')
    .end()

  return
