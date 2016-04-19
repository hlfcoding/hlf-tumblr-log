(function() {
  var $snips, r_framing_in_attr, r_original_in_attr;

  $('script[type="text/x-tpl-html"]').each(function() {
    var $tpl, html, name;
    $tpl = $(this);
    name = $tpl.attr('id');
    html = $(this).html();
    $("[data-tpl=" + name + "]").html(html);
  });

  $snips = $('.root-header .about p:not(:empty)');

  $snips.showRandom = function() {
    var rand;
    rand = parseInt(Math.random() * $snips.length, 10);
    $snips.hide().eq(rand - 1).show().end();
    setTimeout($snips.showRandom, 10 * 1000);
  };

  $snips.showRandom();

  r_original_in_attr = /\((https?:\/\/.*)\)$/;

  r_framing_in_attr = /^\[(.*)\]$/;

  $.fn.expandableImages = function(extraOpts) {
    if (!$.isPlainObject(extraOpts)) {
      extraOpts = {};
    }
    return this.each(function() {
      var $img, alt_text, has_original, hd_src;
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
      $img.parent().addClass('has-expandable').on('click', function() {
        Tumblr.Lightbox.init([
          $.extend({}, {
            height: $img.data('height'),
            high_res: hd_src,
            low_res: $img.attr('src'),
            width: $img.data('width')
          }, extraOpts)
        ], 1);
      });
    });
  };

  $.fn.conditionallyExpandableImages = function() {
    return this.each(function() {
      var $img;
      $img = $(this);
      if (!$img.hasClass('framed')) {
        $img.addClass('framed').attr('alt', $img.attr('alt').replace(r_framing_in_attr, '$1'));
      }
      $img.parent('p').attr('data-annotation', $img.attr('alt'));
      $('<img>').attr('src', $img.attr('src')).on('load', function() {
        var $el;
        $el = $(this);
        if ($el.prop('width') > $img.width()) {
          $img.expandableImages({
            width: $el.prop('width'),
            height: $el.prop('height')
          });
        }
      });
    });
  };

  $.fn.expandableGalleries = function() {
    var $image, num_per_row;
    $image = this.children().first();
    num_per_row = this.first().width() / $image.width();
    this.filter(function() {
      return $(this).children().length > num_per_row;
    }).each(function() {
      var $el, completeInit;
      $el = $(this);
      completeInit = function() {
        $el.removeClass('invisible').masonry({
          itemSelector: 'a, img',
          columnWidth: $image.outerWidth(),
          gutterWidth: parseInt($image.css('margin-right'), 10)
        });
      };
      $el.addClass('invisible').imagesLoaded(completeInit);
    });
    this.each(function() {
      var $el, images;
      $el = $(this);
      images = $el.find('img').map(function() {
        var $img;
        $img = $(this);
        return {
          height: $img.data('height'),
          high_res: $img.attr('alt') || $img.attr('src'),
          low_res: $img.attr('src'),
          width: $img.data('width')
        };
      }).get();
      $el.find('img').each(function(idx) {
        var $img;
        $img = $(this);
        $img.on('click', function(e) {
          var position;
          position = idx + 1;
          Tumblr.Lightbox.init(images, position);
          e.preventDefault();
        });
      });
    });
    return this;
  };

  $.fn.framedEmbeds = function() {
    return this.each(function() {
      var $el;
      $el = $(this);
      $el.prop('width', '100%').filter('object').height($el.prop('height'));
    });
  };

  $(function() {
    $('.text-post .body').find('img.framed[alt], img[alt^="["][alt$="]"]').filter(':not([alt^="http"])').conditionallyExpandableImages().end().filter('[alt^="http"]').expandableImages().end().end().find('object, embed').filter('[width]').framedEmbeds().end().end();
    $('.p_image_embed').expandableGalleries();
    $('.posts').find('blockquote:not(:has(span))').wrapInner('<span>').end();
  });

}).call(this);

//# sourceMappingURL=theme.js.map
