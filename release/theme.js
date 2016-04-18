(function() {
  var $snips, r_framing_in_attr, r_original_in_attr;

  $('script[type="text/x-tpl-html"]').each(function() {
    var $tpl, html, name;
    $tpl = $(this);
    name = $tpl.attr('id');
    html = $(this).html();
    return $("[data-tpl=" + name + "]").html(html);
  });

  $snips = $('.root-header .about p:not(:empty)');

  $snips.showRandom = function() {
    var rand;
    rand = parseInt(Math.random() * $snips.length, 10);
    $snips.hide().eq(rand - 1).show().end();
    return setTimeout($snips.showRandom, 10 * 1000);
  };

  $snips.showRandom();

  r_original_in_attr = /\((https?:\/\/.*)\)$/;

  r_framing_in_attr = /^\[(.*)\]$/;

  $(function() {
    var $galleries, $image, expandable, num_per_row;
    expandable = function(extraOpts) {
      var $img, alt_text, has_original, hd_src;
      if (!$.isPlainObject(extraOpts)) {
        extraOpts = {};
      }
      $img = $(this);
      has_original = $img.is('[alt^="http"]');
      alt_text = $img.attr('alt');
      if (has_original === true) {
        hd_src = alt_text;
      } else {
        has_original = alt_text.match(r_original_in_attr);
        if ((has_original != null) && has_original.length) {
          hd_src = has_original[1];
          alt_text = alt_text.replace(r_original_in_attr, '');
          $img.attr('alt', alt_text).closest('[data-annotation]').attr('data-annotation', alt_text);
        } else {
          hd_src = $img.attr('src');
        }
      }
      return $img.parent().addClass('has-expandable').on('click', function() {
        return Tumblr.Lightbox.init([
          $.extend({}, extraOpts, {
            high_res: hd_src,
            low_res: $img.attr('src')
          })
        ], 1);
      }).end();
    };
    $('.text-post .body').find('img.framed[alt], img[alt^="["][alt$="]"]').filter(':not([alt^="http"])').each(function() {
      var $img;
      $img = $(this);
      if (!$img.hasClass('framed')) {
        $img.addClass('framed').attr('alt', $img.attr('alt').replace(r_framing_in_attr, '$1'));
      }
      $img.parent('p').attr('data-annotation', $img.attr('alt'));
      return $('<img>').on('load', function() {
        var $el;
        $el = $(this);
        if ($el.prop('width') > $img.width()) {
          return expandable.apply($img, {
            width: $el.prop('width'),
            height: $el.prop('height')
          });
        }
      }).attr('src', $img.attr('src'));
    }).end().filter('[alt^="http"]').each(expandable).end().end().find('object, embed').filter('[width]').each(function() {
      var $el;
      $el = $(this);
      return $el.prop('width', '100%').filter('object').height($el.prop('height'));
    }).end();
    $('.posts').find('blockquote:not(:has(span))').wrapInner('<span>').end();
    $galleries = $('.p_image_embed');
    if ($galleries.length) {
      $image = $galleries.children().first();
      num_per_row = $galleries.first().width() / $image.width();
      $galleries.filter(function() {
        return $(this).children().length > num_per_row;
      }).each(function() {
        var $el;
        return $el = $(this).addClass('invisible').imagesLoaded(function() {
          return $el.removeClass('invisible').masonry({
            itemSelector: 'a, img',
            columnWidth: $image.outerWidth(),
            gutterWidth: parseInt($image.css('margin-right'), 10)
          });
        });
      }).end().each(function() {
        var $el, images;
        $el = $(this);
        images = $el.find('img').map(function() {
          var $img;
          $img = $(this);
          return {
            high_res: $img.attr('alt') || $img.attr('src'),
            low_res: $img.attr('src')
          };
        });
        return $el.find('img').each(function(idx) {
          var $img;
          $img = $(this);
          return $img.on('click', function(e) {
            var position;
            position = idx + 1;
            Tumblr.Lightbox.init(images, position);
            return e.preventDefault();
          });
        });
      });
    }
  });

}).call(this);

//# sourceMappingURL=theme.js.map
