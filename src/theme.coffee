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
r_original_in_attr = /\((https?:\/\/.*)\)$/
r_framing_in_attr = /^\[(.*)\]$/

# Expand as needed. Use default lightbox.
$.fn.expandableImages = (extraOpts) ->
  if not $.isPlainObject(extraOpts) then extraOpts = {}
  @.each -> 
    $img = $(@)
    # Use original src if provided.
    has_original = $img.is('[alt^="http"]')
    alt_text = $img.attr('alt')
    if has_original is yes
      hd_src = alt_text
    else
      has_original = alt_text.match r_original_in_attr
      if has_original? and has_original.length
        hd_src = has_original[1]
        alt_text = alt_text.replace(r_original_in_attr, '')
        $img
          .attr('alt', alt_text)
          .closest('[data-annotation]').attr('data-annotation', alt_text)
      else
        hd_src = $img.attr('src')
    # Setup.
    $img.parent()
      .addClass('has-expandable')
      .on 'click', ->
        Tumblr.Lightbox.init [
          $.extend {},
            height: $img.data('height')
            high_res: hd_src
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
    if not $img.hasClass('framed')
      $img
        .addClass('framed')
        .attr('alt', $img.attr('alt').replace r_framing_in_attr, '$1' )
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
  num_per_row = @first().width() / $image.width()

  # Masonry support for big grids.
  @filter(-> $(@).children().length > num_per_row).each ->
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
  @

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
