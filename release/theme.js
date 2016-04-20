(function() {
  var $snips, rFramingInAttr, rOriginalInAttr;

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

  rOriginalInAttr = /\((https?:\/\/.*)\)$/;

  rFramingInAttr = /^\[(.*)\]$/;

  $.fn.expandableImages = function(extraOpts) {
    if (!$.isPlainObject(extraOpts)) {
      extraOpts = {};
    }
    return this.each(function() {
      var $img, altText, hasOriginal, highResSrc;
      $img = $(this);
      hasOriginal = $img.is('[alt^="http"]');
      altText = $img.attr('alt');
      if (hasOriginal) {
        highResSrc = altText;
      } else {
        hasOriginal = altText.match(rOriginalInAttr);
        if ((hasOriginal != null) && hasOriginal.length) {
          highResSrc = hasOriginal[1];
          altText = altText.replace(rOriginalInAttr, '');
          $img.attr('alt', altText).closest('[data-annotation]').attr('data-annotation', altText);
        } else {
          highResSrc = $img.attr('src');
        }
      }
      $img.parent().addClass('has-expandable').on('click', function() {
        Tumblr.Lightbox.init([
          $.extend({}, {
            height: $img.data('height'),
            high_res: highResSrc,
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
        $img.addClass('framed').attr('alt', $img.attr('alt').replace(rFramingInAttr, '$1'));
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
    var $image, numPerRow;
    $image = this.children().first();
    numPerRow = this.first().width() / $image.width();
    this.filter(function() {
      return $(this).children().length > numPerRow;
    }).each(function() {
      var $el, completeInit;
      $el = $(this);
      completeInit = function() {
        $el.removeClass('invisible').masonry({
          itemSelector: 'a, img',
          columnWidth: $image.outerWidth(),
          gutter: parseInt($image.css('margin-right'), 10)
        });
      };
      $el.addClass('invisible').imagesLoaded(completeInit);
    });
    return this.each(function() {
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
