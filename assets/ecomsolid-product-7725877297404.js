
  
/*
  You SHOULD NOT modify source code in this page because
  It is automatically generated from EcomSolid
  Try to edit page with the live editor.
  https://ecomsolid.com
*/

(function(jQuery, $) {
  
      try {
        const funcLib9 = function() {
          "use strict";

/* gtProductSwatches */
(function (jQuery) {
  var gtProductSwatches = function (element, options) {
    var defaults = {
      classCurrentValue: null,
      classItem: null,
      classInputIdHidden: null,
      classBtnSelect: null,
      classCurrentStatus: null,
    };

    this.settings = {};
    var $element = jQuery(element);
    var _this = this;
    var _productJson;

    this.init = function () {
      this.settings = jQuery.extend({}, defaults, options);
      var productJson = $element.closest("[keyword='product'], [data-keyword='product']").find(".ProductJson").text();

      try {
        if (productJson) {
          _productJson = JSON.parse(productJson);
        }
      } catch (e) {
        console.log(e);
      }

      _this.setInitVariant();
      _this.event();
      _this.listen();
    };

    this.setInitVariant = function () {
      if (_productJson) {
        var storeVariant = window.SOLID.store.getState("variant" + _productJson.id);

        if (storeVariant && storeVariant.variant_init) {
          window.store.update("variant" + _productJson.id, storeVariant);
          return;
        }

        var $productJson = $element.closest("[keyword='product'], [data-keyword='product']").find(".ProductJson");

        if ($productJson && $productJson.length) {
          var variantID = parseInt($productJson.attr("data-variant"));

          for (var i = 0; i < _productJson.variants.length; i++) {
            var currentVariant = _productJson.variants[i];

            if (currentVariant.id == variantID) {
              try {
                var newVariant = JSON.parse(JSON.stringify(currentVariant));

                // eslint-disable-next-line camelcase
                newVariant.variant_init = true;
                window.store.update("variant" + _productJson.id, newVariant);
              } catch (e) {
                console.log(e);
              }
              break;
            }
          }
        }
      }
    };

    this.event = function () {
      if (_productJson) {
        try {
          var variants = _productJson.variants;
          var $select = $element.find(_this.settings.classBtnSelect);

          $select.off("click.select").on("click.select", function () {
            var $el = jQuery(this);

            if (!$el.hasClass("gt_soldout")) {
              var name = $el.attr("data-name");
              // Update active
              var $selector = $element.find(_this.settings.classBtnSelect + '[data-name="' + name + '"]');

              if ($selector && $selector.length) {
                $selector.removeClass("gf_active");
                $selector.removeClass("gt_active");
              }
              $el.addClass("gf_active");
              $el.addClass("gt_active");
              var $actives = $element.find(_this.settings.classBtnSelect + ".gf_active," + _this.settings.classBtnSelect + ".gt_active");
              var values = [];
              var i;

              if ($actives && $actives.length) {
                for (i = 0; i < $actives.length; i++) {
                  var activeValue = jQuery($actives[i]).attr("data-value");

                  if (activeValue) {
                    values.push(activeValue);
                  }
                }
              }
              var currentVariant = {};

              if (values && values.length) {
                for (i = 0; i < variants.length; i++) {
                  var variant = variants[i];
                  var options = variant.options; // => []
                  // console.log(options, " vs ", values)

                  if (_this.compare(values, options)) {
                    currentVariant = variant;
                    break;
                  }
                }
              }
              // console.log("variants: ", variants);
              // console.log("$actives: ", $actives);
              // console.log("values: ", values);
              // console.log("currentVariant: ", currentVariant);
              if (!jQuery.isEmptyObject(currentVariant)) {
                window.store.update("variant" + _productJson.id, currentVariant);
              } else {
                // Sản phẩm không được định nghĩa
                window.store.update("variant" + _productJson.id, {
                  id: 0,
                  available: false,
                });
              }
            }
          });
        } catch (e) {
          console.log(e);
        }
      }
    };
    this.listen = function () {
      var store = window.store;

      if (_productJson) {
        var options = _productJson.options;

        store.change("variant" + _productJson.id, function (variant) {
          if (variant && variant.variant_init) {
            return;
          }
          var $product = $element.closest("[keyword='product'], [data-keyword='product']");
          var $currentStatus = $product.find(_this.settings.classCurrentStatus);

          if ($currentStatus && $currentStatus.length) {
            if (!variant.available) {
              $currentStatus.show();
              var labelSoldOut = $currentStatus.attr("data-sold-out") || "Sold Out";

              $currentStatus.addClass(_this.settings.classCurrentStatus.replace(".", "") + "--inner");
              $currentStatus.html(labelSoldOut);
            } else {
              $currentStatus.addClass(_this.settings.classCurrentStatus.replace(".", "") + "--inner");
              $currentStatus.hide();
            }
          }

          if (variant.options && variant.options.length) {
            for (var i = 0; i < variant.options.length; i++) {
              var option = variant["option" + (i + 1)];

              if (option) {
                var name;

                if (options[i]) {
                  name = options[i];
                }
                if (!name || jQuery.isPlainObject(name)) {
                  name = options[i].name;
                }
                var $item = $element.find(_this.settings.classItem + '[data-name="' + name + '"]');

                if ($item && $item.length) {
                  if (_this.settings.classCurrentValue) {
                    var $currentValue = $item.find(_this.settings.classCurrentValue);

                    if ($currentValue && $currentValue.length) {
                      $currentValue.html(option);
                    }
                  }
                  var $selectActive = $item.find(_this.settings.classBtnSelect + '[data-value="' + option.replace(/"/g, "'") + '"]');
                  var $select = $item.find(_this.settings.classBtnSelect);

                  if ($select && $select.length && $selectActive && $selectActive.length) {
                    $select.removeClass("gf_active");
                    $select.removeClass("gt_active");
                    $selectActive.addClass("gf_active");
                    $selectActive.addClass("gt_active");
                  }
                }
              }
            }
          }
          if (!jQuery.isEmptyObject(variant)) {
            if ($product && $product.length) {
              var $input = $product.find(_this.settings.classInputIdHidden);

              if ($input && $input.length) {
                $input.attr("value", variant.id).val(variant.id);
                var currentURL = window.location.href;
                var variantURL = _this.updateUrlParameter(currentURL, "variant", variant.id);

                window.history.replaceState({}, "", variantURL);
              }
            }
          }
        });
      }
    };

    this.compare = function (array, array2) {
      array.sort();
      array2.sort();
      for (var i = 0; i < array.length; i++) {
        for (var j = 0; j < array2.length; j++) {
          var val1 = array[j];
          var val2 = array2[j];

          val1 = val1.replace(/"/gm, "'");
          val2 = val2.replace(/"/gm, "'");
          if (val1 != val2) {
            return false;
          }
        }
      }
      return true;
    };

    this.updateUrlParameter = function (url, key, value) {
      var parser = document.createElement("a");

      parser.href = url;
      var newUrl = parser.protocol + "//" + parser.host + parser.pathname;
      // has parameters ?

      if (parser.search && parser.search.indexOf("?") !== -1) {
        // parameter already exists
        if (parser.search.indexOf(key + "=") !== -1) {
          // paramters to array
          var params = parser.search.replace("?", "");

          params = params.split("&");
          params.forEach(function (param, i) {
            if (param.indexOf(key + "=") !== -1) {
              if (value !== null) { params[i] = key + "=" + value; } else { delete params[i]; }
            }
          });
          if (params.length > 0) { newUrl += "?" + params.join("&"); }
        } else if (value !== null) {
          newUrl += parser.search + "&" + key + "=" + value;
        } else {
          newUrl += parser.search;
        } // skip the value (remove)
      } else if (value !== null) {
        newUrl += "?" + key + "=" + value;
      } // no parameters, create it
      newUrl += parser.hash;
      return newUrl;
    };
    this.init();
  };

  jQuery.fn.gtProductSwatches = function (options) {
    return this.each(function () {
      var plugin = new gtProductSwatches(this, options, jQuery);

      jQuery(this).data("gtproductswatches", plugin);
    });
  };
})(jQuery);

        }
        funcLib9();
      } catch(e) {
        console.error("Error lib id: 9" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcLib69 = function() {
          var __spreadArrays = (this && this.__spreadArrays) || function () {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
          r[k] = a[j];
  return r;
};
/* gtVariantsStyle */
(function (jQuery) {
  /**
   * GtVariantsStyle
   * 1, Tùy chọn variant title color thì merge array colors custom vào variants.
   * 2, Tùy chọn variant title image thì merge array images custom vào variants.
   * 3, Cho phép setting hiển thị có tooltips không
   * 4, Cho phép chọn một số style tooltips
   */
  var GtVariantsStyle = /** @class */ (function () {
      /**
       * constructor
       * @param element element
       * @param options options
       */
      function GtVariantsStyle(element, options) {
          this.settings = {
              colors: [],
              colorVariantTitle: "",
              colorVariantCircle: false,
              colorVariantRadius: "3px",
              colorVariantSize: "",
              images: [],
              imageVariantTitle: "",
              imageVariantCircle: false,
              imageVariantRadius: "3px",
              imageVariantSize: "",
              variantTooltip: false,
              hideSoldOutVariants: false,
              variantSaleTag: false,
              variantSaleTagTitle: "",
              variantSaleTagFormat: "[!Value!]% off",
              variantSaleTagTextColor: "#000",
              variantSaleTagBackgroundColor: "#FDAC2B",
              variantSaleTagBorderRadius: "5px",
          };
          this.variants = [];
          this.$el = jQuery(element);
          this.settings = jQuery.extend({}, this.settings, options);
          this.variants = this.getVariants();
          this.resetFeatures();
          this.supportVariantColor();
          this.supportVariantImage();
          this.supportHideSoldOutVariants();
          this.supportVariantSaleTag();
          this.listenChangeVariantUpdateSaleTag();
      }
      /**
       * Destroy
       */
      GtVariantsStyle.prototype.Destroy = function () {
          this.resetFeatures();
      };
      /**
       * resetFeatures
       */
      GtVariantsStyle.prototype.resetFeatures = function () {
          // Code run in editor
          var $selectors = this.$el.find(".gt_swatches--select[data-name][data-value]");
          if ($selectors === null || $selectors === void 0 ? void 0 : $selectors.length) {
              for (var i = 0; i < $selectors.length; i++) {
                  var $selector = jQuery($selectors[i]);
                  $selector.attr("style", "");
                  var $childs = $selector.find("*");
                  if ($childs === null || $childs === void 0 ? void 0 : $childs.length) {
                      $childs.each(function () {
                          var _a;
                          var $child = jQuery(this);
                          if (!((_a = $child.closest(".gt_variant__tooltip, .gt_swatches--select--soldout")) === null || _a === void 0 ? void 0 : _a.length)) {
                              $child.css({
                                  "visibility": "",
                              });
                          }
                      });
                  }
                  $selector.find(".gt_variant__tooltip, .gt_variant-style-sale-tag").remove();
              }
          }
          // Run in editor
          var $variantsSoldOut = this.$el.find(".gt_swatches--select.gt_soldout");
          if ($variantsSoldOut && $variantsSoldOut.length) {
              $variantsSoldOut.removeClass("gt_soldout");
              $variantsSoldOut.css({
                  "position": "",
                  "user-select": "",
                  "cursor": "",
                  "pointer-events": "",
              });
              $variantsSoldOut.find(".gt_swatches--select--soldout").remove();
          }
      };
      /**
       * supportHideSoldOutVariants
       */
      GtVariantsStyle.prototype.supportHideSoldOutVariants = function () {
          var _a;
          if (this.settings.hideSoldOutVariants) {
              var $products = this.$el.find("[keyword=product], [data-keyword=product]");
              if ($products === null || $products === void 0 ? void 0 : $products.length) {
                  var _loop_1 = function (i) {
                      var $product = jQuery($products[i]);
                      if ($product === null || $product === void 0 ? void 0 : $product.length) {
                          var productJsonObject = void 0;
                          var productJson = $product.find(".ProductJson").text();
                          try {
                              productJsonObject = JSON.parse(productJson);
                          }
                          catch (error) {
                              console.log("error ", error);
                          }
                          var availableVariants_1 = [];
                          if ((_a = productJsonObject === null || productJsonObject === void 0 ? void 0 : productJsonObject.variants) === null || _a === void 0 ? void 0 : _a.length) {
                              for (var j = 0; j < productJsonObject.variants.length; j++) {
                                  var variant = productJsonObject.variants[j];
                                  if (variant.available != undefined && variant.available) {
                                      availableVariants_1.push(variant);
                                  }
                                  else if (variant.inventory_quantity > 0 || variant.inventory_management != "shopify") {
                                      // available
                                      availableVariants_1.push(variant);
                                  }
                              }
                          }
                          var $swatches = $product.find(".gt_product-swatches");
                          $swatches.find(".gt_product-swatches--item").each(function (index) {
                              var $lineVariants = jQuery(this);
                              var $variants = $lineVariants.find(".gt_swatches--select").not("li");
                              $variants.each(function () {
                                  var $variant = jQuery(this);
                                  var value = $variant.attr("data-value");
                                  value = value.replace(/'/gm, "\"");
                                  if (availableVariants_1 === null || availableVariants_1 === void 0 ? void 0 : availableVariants_1.length) {
                                      var found = false;
                                      for (var j = 0; j < availableVariants_1.length; j++) {
                                          var varaint = availableVariants_1[j];
                                          if ((varaint === null || varaint === void 0 ? void 0 : varaint.options[index]) == value) {
                                              found = true;
                                              break;
                                          }
                                      }
                                      if (!found) {
                                          $variant.addClass("gt_soldout");
                                      }
                                  }
                              });
                          });
                          var $variantsSoldOut = $swatches.find(".gt_swatches--select.gt_soldout");
                          if ($variantsSoldOut === null || $variantsSoldOut === void 0 ? void 0 : $variantsSoldOut.length) {
                              $variantsSoldOut.each(function () {
                                  var $variantSoldOut = jQuery(this);
                                  $variantSoldOut.find(".gt_swatches--select--soldout").remove();
                                  $variantSoldOut.css({
                                      "position": "relative",
                                      "user-select": "none",
                                      "cursor": "default",
                                      "pointer-events": "none"
                                  });
                                  var bordeRadius = $variantSoldOut.css("border-radius");
                                  var _soldOutColor = "#000";
                                  var sizeStroke = 1;
                                  $variantSoldOut.append("<svg height=\"100\" width=\"100\" preserveAspectRatio=\"none\" class=\"gt_swatches--select--soldout\"><line x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\" style=\"stroke:" + _soldOutColor + ";stroke-width:" + sizeStroke + "\" /><line x1=\"0%\" y1=\"100%\" x2=\"100%\" y2=\"0%\" style=\"stroke:" + _soldOutColor + ";stroke-width:" + sizeStroke + "\" /></svg>");
                                  $variantSoldOut.find(".gt_swatches--select--soldout").css({
                                      "position": "absolute",
                                      "width": "100%",
                                      "height": "100%",
                                      "top": "0",
                                      "left": "0",
                                      "border-radius": bordeRadius,
                                  });
                              });
                          }
                      }
                  };
                  for (var i = 0; i < $products.length; i++) {
                      _loop_1(i);
                  }
              }
          }
          return;
      };
      /**
       * supportVariantColor
       */
      GtVariantsStyle.prototype.supportVariantColor = function () {
          // support variant color
          if (this.settings.colorVariantTitle) {
              var $selectors = this.$el.find(".gt_swatches--select[data-name=\"" + this.settings.colorVariantTitle + "\"][data-value]").not("li");
              if ($selectors === null || $selectors === void 0 ? void 0 : $selectors.length) {
                  for (var i = 0; i < $selectors.length; i++) {
                      var $selector = jQuery($selectors[i]);
                      var value = $selector.attr("data-value");
                      value = value.replace(/'/gm, "\"");
                      if (value) {
                          value = value.toLowerCase();
                          for (var j = 0; j < this.variants.length; j++) {
                              var varaint = this.variants[j];
                              var variantTitle = varaint.title;
                              var languages = varaint.languages;
                              if (variantTitle) {
                                  variantTitle = variantTitle.toLowerCase();
                                  if (value == variantTitle) {
                                      this.setColorToVariant($selector, varaint);
                                  }
                                  else if (languages === null || languages === void 0 ? void 0 : languages.length) {
                                      for (var k = 0; k < languages.length; k++) {
                                          var language = languages[k].toLowerCase();
                                          if (language == value.toLowerCase()) {
                                              this.setColorToVariant($selector, varaint);
                                          }
                                      }
                                  }
                              }
                          }
                      }
                  }
              }
          }
      };
      /**
       * setColorToVariant
       * @param $selector dom select variant
       * @param variant variant same default or custom
       */
      GtVariantsStyle.prototype.setColorToVariant = function ($selector, variant) {
          var color = variant.color;
          $selector.css({
              "background-color": color,
              "user-select": "none",
              "color": color,
              "position": "relative",
          });
          if (!this.settings.colorVariantSize) {
              $selector.css({
                  "min-width": "",
                  "width": "",
                  "min-height": "",
                  "height": "",
              });
              setTimeout(function () {
                  var height = $selector.outerHeight();
                  $selector.css({
                      "min-width": height + "px",
                      "width": height + "px",
                      "min-height": height + "px",
                      "height": height + "px",
                  });
              }, 0);
          }
          else {
              $selector.css({
                  "min-width": this.settings.colorVariantSize,
                  "width": this.settings.colorVariantSize,
                  "min-height": this.settings.colorVariantSize,
                  "height": this.settings.colorVariantSize,
              });
          }
          var $childs = $selector.find("*");
          $childs.each(function () {
              var _a;
              var $child = jQuery(this);
              if (!((_a = $child.closest(".gt_variant__tooltip, .gt_swatches--select--soldout")) === null || _a === void 0 ? void 0 : _a.length)) {
                  $child.css({
                      "visibility": "hidden",
                  });
              }
          });
          if (this.settings.colorVariantCircle) {
              $selector.css({
                  "border-radius": "100%",
              });
          }
          else {
              $selector.css({
                  "border-radius": this.settings.colorVariantRadius,
              });
          }
          this.supportTooltip($selector);
      };
      /**
       * supportVariantColor
       */
      GtVariantsStyle.prototype.supportVariantImage = function () {
          var _a, _b;
          // support variant color
          if (this.settings.imageVariantTitle) {
              var $selectors = this.$el.find(".gt_swatches--select[data-name=\"" + this.settings.imageVariantTitle + "\"][data-value]").not("li");
              if ($selectors === null || $selectors === void 0 ? void 0 : $selectors.length) {
                  for (var i = 0; i < $selectors.length; i++) {
                      var $selector = jQuery($selectors[i]);
                      var value = $selector.attr("data-value");
                      value = value.replace(/'/gm, "\"");
                      if (value) {
                          var imageUrl = void 0;
                          var $product = $selector.closest("[keyword=product], [data-keyword=product]");
                          if ($product === null || $product === void 0 ? void 0 : $product.length) {
                              var productJson = $product.find(".ProductJson").text();
                              try {
                                  var productJsonObject = JSON.parse(productJson);
                                  if (((_a = productJsonObject.variants) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                                      for (var i_1 = 0; i_1 < productJsonObject.variants.length; i_1++) {
                                          var variantProduct = productJsonObject.variants[i_1];
                                          if (variantProduct.options.includes(value) && ((_b = variantProduct.featured_image) === null || _b === void 0 ? void 0 : _b.src)) {
                                              imageUrl = variantProduct.featured_image.src;
                                              break;
                                          }
                                      }
                                  }
                              }
                              catch (error) {
                                  console.log("error ", error);
                              }
                          }
                          value = value.toLowerCase();
                          var found = false;
                          for (var j = 0; j < this.variants.length; j++) {
                              var variantTitle = this.variants[j].title;
                              var languages = this.variants[j].languages;
                              var image = this.variants[j].image;
                              if (variantTitle) {
                                  variantTitle = variantTitle.toLowerCase();
                                  if (value == variantTitle && image) {
                                      found = true;
                                      this.setImageToVariant($selector, image);
                                  }
                                  else if ((languages === null || languages === void 0 ? void 0 : languages.length) && image) {
                                      for (var k = 0; k < languages.length; k++) {
                                          var language = languages[k].toLowerCase();
                                          if (language == value.toLowerCase()) {
                                              found = true;
                                              this.setImageToVariant($selector, image);
                                          }
                                      }
                                  }
                              }
                          }
                          if (!found) {
                              this.setImageToVariant($selector, imageUrl);
                          }
                      }
                  }
              }
          }
      };
      /**
       * setImageToVariant
       * @param $selector dom select variant
       * @param imageUrl image url variant
       */
      GtVariantsStyle.prototype.setImageToVariant = function ($selector, imageUrl) {
          if (imageUrl) {
              $selector.css({
                  "position": "relative",
                  "user-select": "none",
                  "background-image": "url(\"" + imageUrl + "\")",
                  "background-repeat": "no-repeat",
                  "background-size": "contain",
                  "background-position": "center",
                  "background-color": "#fff",
              });
              var $childs = $selector.find("*");
              if ($childs === null || $childs === void 0 ? void 0 : $childs.length) {
                  $childs.each(function () {
                      var _a;
                      var $child = jQuery(this);
                      if (!((_a = $child.closest(".gt_variant__tooltip, .gt_swatches--select--soldout")) === null || _a === void 0 ? void 0 : _a.length)) {
                          $child.css({
                              "visibility": "hidden",
                          });
                      }
                  });
              }
              if (!this.settings.imageVariantSize) {
                  $selector.css({
                      "min-width": "",
                      "width": "",
                      "min-height": "",
                      "height": "",
                  });
                  setTimeout(function () {
                      var height = $selector.outerHeight();
                      $selector.css({
                          "min-width": height + "px",
                          "width": height + "px",
                          "min-height": height + "px",
                          "height": height + "px",
                      });
                  }, 0);
              }
              else {
                  $selector.css({
                      "min-width": this.settings.imageVariantSize,
                      "width": this.settings.imageVariantSize,
                      "min-height": this.settings.imageVariantSize,
                      "height": this.settings.imageVariantSize,
                  });
              }
              if (this.settings.imageVariantCircle) {
                  $selector.css({
                      "border-radius": "100%"
                  });
              }
              else {
                  $selector.css({
                      "border-radius": this.settings.imageVariantRadius,
                  });
              }
              this.supportTooltip($selector);
          }
      };
      /**
       * supportTooltip
       * @param $selector dom select variant
       */
      GtVariantsStyle.prototype.supportTooltip = function ($selector) {
          if (this.settings.variantTooltip) {
              var isCheckTooltip = $selector.find(".gt_variant__tooltip");
              if (!isCheckTooltip || !isCheckTooltip.length) {
                  var value = $selector.attr("data-value");
                  value = value.replace(/'/gm, "\"");
                  var $tooltip_1 = jQuery("<span class=\"gt_variant__tooltip\">" + value + "<span class=\"gt_variant__tooltip_arrow\"></span></span>");
                  $tooltip_1.css({
                      "position": "absolute",
                      "top": "0px",
                      "left": "50%",
                      "background": "rgba(0,0,0,0.76)",
                      "color": "#fff",
                      "transform": "translateX(-50%)",
                      "border-radius": "4px",
                      "padding": "0.4rem 0.75rem",
                      "white-space": "nowrap",
                      "transition": "visibility 0s, opacity 0.25s",
                      "visibility": "hidden",
                      "opacity": "0",
                  });
                  $tooltip_1.find(".gt_variant__tooltip_arrow").css({
                      "position": "absolute",
                      "top": "100%",
                      "left": "50%",
                      "color": "#fff",
                      "margin-left": "-6px",
                      "border-top": "solid 6px rgba(0,0,0,0.76)",
                      "border-bottom": "solid 6px transparent",
                      "border-left": "solid 6px transparent",
                      "border-right": "solid 6px transparent",
                  });
                  $selector.append($tooltip_1);
                  var height = $tooltip_1.outerHeight();
                  height = height + 10;
                  $tooltip_1.css({
                      top: "-" + height + "px"
                  });
                  $selector.off("mouseover.hoverVariant").on("mouseover.hoverVariant", function () {
                      $tooltip_1.css({
                          "visibility": "visible",
                          "opacity": "1",
                      });
                      $selector.off("mouseleave.hoverVariant").on("mouseleave.hoverVariant", function () {
                          $tooltip_1.css({
                              "visibility": "hidden",
                              "opacity": "0",
                          });
                          $selector.off("mouseleave.hoverVariant");
                      });
                  });
              }
          }
      };
      /**
       * support variant sale tag
       */
      GtVariantsStyle.prototype.supportVariantSaleTag = function () {
          var _this = this;
          // support variant color
          if (!this.settings.variantSaleTag) {
              return;
          }
          // find product
          var $products = this.$el.find("[keyword=product], [data-keyword=product]");
          if (!($products === null || $products === void 0 ? void 0 : $products.length)) {
              return;
          }
          // each product section
          $products.each(function (_, productElement) {
              var $selectors = $(productElement).find(".gt_swatches--select[data-name=\"" + _this.settings.variantSaleTagTitle + "\"][data-value]").not("li");
              if (!($selectors === null || $selectors === void 0 ? void 0 : $selectors.length)) {
                  return;
              }
              $selectors.css({
                  "position": "relative",
                  "min-width": "120px",
                  "min-height": "50px",
                  "display": "flex",
                  "align-items": "center",
                  "justify-content": "center",
                  "overflow": "visible"
              });
              $selectors.css({
                  "margin-top": "30px",
              });
              // get product json
              var productJson = $(productElement).find(".ProductJson").text();
              var productJsonObject = null;
              try {
                  productJsonObject = JSON.parse(productJson);
              }
              catch (e) {
                  console.log("error: ", e);
              }
              // get current state of other variant types
              var $otherVariantTypes = $(productElement).find(".gt_product-swatches--options").not(":has(> [data-name='" + _this.settings.variantSaleTagTitle + "'])");
              var currentOptionState = ($otherVariantTypes === null || $otherVariantTypes === void 0 ? void 0 : $otherVariantTypes.length) ? Array.from($otherVariantTypes.map(function (_, options) { return $(options).find(".gt_swatches--select.gt_active").attr("data-value"); })) : [];
              // each option in current variant type of current product
              $selectors.each(function (_, selectorElement) {
                  var $selector = $(selectorElement);
                  var value = $selector.attr("data-value").replace(/'/gm, "\"");
                  if (!value || $selector.hasClass("gt_soldout")) {
                      return;
                  }
                  // calculate sale value
                  var currentVariant = productJsonObject === null || productJsonObject === void 0 ? void 0 : productJsonObject.variants.find(function (variant) { return __spreadArrays(currentOptionState, [value]).every(function (option) { return variant.options.includes(option); }); });
                  if (!currentVariant) {
                      return;
                  }
                  var saleValue = Math.round((currentVariant.compare_at_price - currentVariant.price) / currentVariant.compare_at_price * 100);
                  if (saleValue <= 0) {
                      return;
                  }
                  // update value if sale tag has been exist
                  if ($selector.has(".gt_variant-style-sale-tag").length) {
                      $selector.find(".gt_variant-style-sale-tag").text(_this.settings.variantSaleTagFormat.replace("[!Value!]", saleValue.toString()));
                      return;
                  }
                  // create and show sale tag
                  var $saleTag = $("<div class='gt_variant-style-sale-tag'>" + _this.settings.variantSaleTagFormat.replace("[!Value!]", saleValue.toString()) + "</div>");
                  $saleTag.css({
                      "position": "absolute",
                      "top": "-20px",
                      "left": "50%",
                      "transform": "translateX(-50%)",
                      "min-width": "70px",
                      "height": "30px",
                      "background": _this.settings.variantSaleTagBackgroundColor,
                      "color": _this.settings.variantSaleTagTextColor,
                      "border-radius": _this.settings.variantSaleTagBorderRadius,
                      "display": "flex",
                      "align-items": "center",
                      "justify-content": "center",
                      "line-height": "1em",
                      "padding": "0 2px",
                  });
                  $selector.append($saleTag);
              });
          });
      };
      /**
       * listen change variant update sale tag
       */
      GtVariantsStyle.prototype.listenChangeVariantUpdateSaleTag = function () {
          var _this = this;
          var $products = this.$el.find("[keyword=product], [data-keyword=product]");
          if (!($products === null || $products === void 0 ? void 0 : $products.length)) {
              return;
          }
          $products.each(function (_, productElement) {
              var $productJson = $(productElement).find(".ProductJson");
              if (!($productJson === null || $productJson === void 0 ? void 0 : $productJson.length)) {
                  return;
              }
              window.store.change("variant" + $productJson.attr("data-id"), _this.supportVariantSaleTag.bind(_this));
          });
      };
      /**
       * getVariants
       * @returns variants
       */
      GtVariantsStyle.prototype.getVariants = function () {
          var defaultVariants = [{
                  title: "blue",
                  languages: ["xanh dương"],
                  color: "#0000FF",
                  image: ""
              },
              {
                  title: "yellow",
                  languages: ["vàng"],
                  color: "#FFFF00",
                  image: ""
              },
              {
                  title: "purple",
                  languages: ["tím"],
                  color: "#2C3544",
                  image: ""
              },
              {
                  title: "red",
                  languages: ["đỏ"],
                  color: "#f7272b",
                  image: ""
              },
              {
                  title: "silver",
                  languages: [],
                  color: "#C0C0C0",
                  image: ""
              },
              {
                  title: "gray",
                  languages: [],
                  color: "#808080",
                  image: ""
              },
              {
                  title: "black",
                  languages: [],
                  color: "#000000",
                  image: ""
              },
              {
                  title: "maroon",
                  languages: [],
                  color: "#800000",
                  image: ""
              },
              {
                  title: "olive",
                  languages: [],
                  color: "#808000",
                  image: ""
              },
              {
                  title: "lime",
                  languages: [],
                  color: "#00FF00",
                  image: ""
              },
              {
                  title: "green",
                  languages: [],
                  color: "#008000",
                  image: ""
              },
              {
                  title: "aqua",
                  languages: [],
                  color: "#00FFFF",
                  image: ""
              },
              {
                  title: "teal",
                  languages: [],
                  color: "#008080",
                  image: ""
              },
              {
                  title: "navy",
                  languages: [],
                  color: "#000080",
                  image: ""
              },
              {
                  title: "fuchsia",
                  languages: [],
                  color: "#FF00FF",
                  image: ""
              },
              {
                  title: "purple",
                  languages: [],
                  color: "#800080",
                  image: ""
              },
              {
                  title: "white",
                  languages: [],
                  color: "#ffffff",
                  image: ""
              },
          ];
          // Merge color
          var customColors = this.settings.colors;
          if (customColors === null || customColors === void 0 ? void 0 : customColors.length) {
              for (var i = 0; i < customColors.length; i++) {
                  var title = customColors[i].title;
                  var color = customColors[i].color;
                  if (title && color) {
                      title = title.toLowerCase();
                      var variant = {
                          title: title,
                          color: color,
                          languages: [],
                          image: ""
                      };
                      var found = false;
                      for (var j = 0; j < defaultVariants.length; j++) {
                          if (defaultVariants[j].title == title) {
                              found = true;
                              defaultVariants[j].color = variant.color; // replace color
                              break;
                          }
                      }
                      if (!found) {
                          defaultVariants.push(variant);
                      }
                  }
              }
          }
          // Merge image
          var customImages = this.settings.images;
          if (customImages === null || customImages === void 0 ? void 0 : customImages.length) {
              for (var i = 0; i < customImages.length; i++) {
                  var title = customImages[i].title;
                  var image = customImages[i].image;
                  if (title && image) {
                      title = title.toLowerCase();
                      var variant = {
                          title: title,
                          color: "",
                          languages: [],
                          image: image,
                      };
                      var found = false;
                      for (var j = 0; j < defaultVariants.length; j++) {
                          if (defaultVariants[j].title == title) {
                              found = true;
                              defaultVariants[j].image = variant.image; // replace image
                              break;
                          }
                      }
                      if (!found) {
                          defaultVariants.push(variant);
                      }
                  }
              }
          }
          return defaultVariants;
      };
      return GtVariantsStyle;
  }());
  /**
   * gtProductSwatchesColor
   * @param options settings
   */
  jQuery.fn.gtVariantsStyle = function (options) {
      this.each(function () {
          var plugin = new GtVariantsStyle(this, options);
          jQuery(this).data("gtvariantsstyle", plugin);
      });
  };
})(jQuery);
        }
        funcLib69();
      } catch(e) {
        console.error("Error lib id: 69" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcLib10 = function() {
          "use strict";

var gtAnimations = {
  loopSlideUp: function (attrCSS, val, duration, last, element, callback) {
    var deg = val / duration;

    deg = Math.round(deg * 1000) / 1000;
    var max = val;
    var run = setInterval(function () {
      max = max - deg;
      if (val >= 0) {
        if (max <= 0) {
          max = 0;
        }
      } else if (max >= 0) {
        max = 0;
      }
      element.style[attrCSS] = max + "px";
      if ((val >= 0 && max <= 0) || (val <= 0 && max >= 0)) {
        clearInterval(run);
        if (last) {
          setTimeout(function () {
            element.style.removeProperty("overflow");
            element.style.removeProperty("padding-top");
            element.style.removeProperty("padding-bottom");
            element.style.removeProperty("border-top");
            element.style.removeProperty("border-bottom");
            element.style.removeProperty("margin-top");
            element.style.removeProperty("margin-bottom");
            element.style.removeProperty("height");
          }, 0);

          if (callback) {
            return callback();
          }
        }
      }
    }, 1);
  },
  SlideUp: function (element, duration, callback) {
    if (!element) {
      if (callback) {
        return callback();
      }
      return;
    }
    if (!duration) { duration = 500; }
    var compStyles = window.getComputedStyle(element, null);
    var height = parseInt(compStyles.height) || 0;
    var marginTop = parseInt(compStyles.marginTop) || 0;
    var marginBottom = parseInt(compStyles.marginBottom) || 0;
    var borderTop = parseInt(compStyles.borderTop) || 0;
    var borderBottom = parseInt(compStyles.borderBottom) || 0;
    var paddingTop = parseInt(compStyles.paddingTop) || 0;
    var paddingBottom = parseInt(compStyles.paddingBottom) || 0;

    element.style.overflow = "hidden";
    element.style.height = height + "px";
    element.style.paddingTop = paddingTop + "px";
    element.style.paddingBottom = paddingBottom + "px";
    element.style.borderTop = borderTop + "px";
    element.style.borderBottom = borderBottom + "px";
    element.style.marginTop = marginTop + "px";
    element.style.marginBottom = marginBottom + "px";

    var attrs = [{
      attr: "paddingTop",
      val: paddingTop,
    },
    {
      attr: "paddingBottom",
      val: paddingBottom,
    },
    {
      attr: "borderTop",
      val: borderTop,
    },
    {
      attr: "borderBottom",
      val: borderBottom,
    },
    {
      attr: "marginTop",
      val: marginTop,
    },
    {
      attr: "marginBottom",
      val: marginBottom,
    },
    {
      attr: "height",
      val: height,
    },
    ];

    for (var i = 0; i < attrs.length; i++) {
      var item = attrs[i];
      var last = false;

      if (i == attrs.length - 1) {
        last = true;
      }
      this.loopSlideUp(item.attr, item.val, duration, last, element, callback);
    }
  },
  loopSlideDown: function (attrCSS, val, duration, last, element, callback) {
    var deg = val / duration;

    deg = Math.round(deg * 1000) / 1000;
    var min = 0;
    var run = setInterval(function () {
      min = min + deg;

      if (val >= 0) {
        if (min >= val) {
          min = val;
        }
      } else if (min <= val) {
        min = val;
      }
      element.style[attrCSS] = min + "px";
      if ((val >= 0 && min >= val) || (val <= 0 && min <= val)) {
        clearInterval(run);
        if (last) {
          setTimeout(function () {
            element.style.removeProperty("overflow");
            element.style.removeProperty("padding-top");
            element.style.removeProperty("padding-bottom");
            element.style.removeProperty("border-top");
            element.style.removeProperty("border-bottom");
            element.style.removeProperty("margin-top");
            element.style.removeProperty("margin-bottom");
            element.style.removeProperty("height");
          }, 0);
          if (callback) {
            return callback();
          }
        }
      }
    }, 1);
  },
  SlideDown: function (element, duration, callback) {
    if (!element) {
      if (callback) {
        return callback();
      }
      return;
    }
    if (!duration) { duration = 500; }
    var compStyles = window.getComputedStyle(element, null);
    var height = parseInt(compStyles.height) || 0;
    var marginTop = parseInt(compStyles.marginTop) || 0;
    var marginBottom = parseInt(compStyles.marginBottom) || 0;
    var borderTop = parseInt(compStyles.borderTop) || 0;
    var borderBottom = parseInt(compStyles.borderBottom) || 0;
    var paddingTop = parseInt(compStyles.paddingTop) || 0;
    var paddingBottom = parseInt(compStyles.paddingBottom) || 0;

    element.style.overflow = "hidden";
    element.style.height = 0;
    element.style.paddingTop = 0;
    element.style.paddingBottom = 0;
    element.style.borderTop = 0;
    element.style.borderBottom = 0;
    element.style.marginTop = 0;
    element.style.marginBottom = 0;
    var attrs = [{
      attr: "paddingTop",
      val: paddingTop,
    },
    {
      attr: "paddingBottom",
      val: paddingBottom,
    },
    {
      attr: "borderTop",
      val: borderTop,
    },
    {
      attr: "borderBottom",
      val: borderBottom,
    },
    {
      attr: "marginTop",
      val: marginTop,
    },
    {
      attr: "marginBottom",
      val: marginBottom,
    },
    {
      attr: "height",
      val: height,
    },
    ];

    for (var i = 0; i < attrs.length; i++) {
      var item = attrs[i];
      var last = false;

      if (i == attrs.length - 1) {
        last = true;
      }
      this.loopSlideDown(item.attr, item.val, duration, last, element, callback);
    }
  },
};

window.gtAnimations = gtAnimations;

        }
        funcLib10();
      } catch(e) {
        console.error("Error lib id: 10" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcLib11 = function() {
          "use strict";

/* gtProductSaved */
(function (jQuery) {
  var gtProductSaved = function (element, options) {
    var defaults = {
      classTextPercent: null,
      classTextNumber: null,
      dataFormat: "",
      dataFormatKey: "",
      customCurrencyFormat: null,
      roundPercent: 0,
      roundNoZeroes: false,
    };

    this.settings = {};

    var $element = jQuery(element);
    var _this = this;
    var _productJson;

    this.init = function () {
      this.settings = jQuery.extend({}, defaults, options);
      var productJson = $element.closest("[keyword='product'], [data-keyword='product']").find(".ProductJson").text();

      try {
        if (productJson) {
          _productJson = JSON.parse(productJson);
        }
      } catch (e) {
        console.log(e);
      }

      _this.Init();
      _this.listen();
    };

    this.Init = function () {
      if (_productJson) {
        var variant = window.store.get("variant" + _productJson.id);
        if (variant && variant.id) {
          _this.setPriceWithVariant(variant);
        }
      }
    };

    this.listen = function () {
      var store = window.store;

      if (_productJson) {
        store.change("variant" + _productJson.id, function (variant) {
          _this.setPriceWithVariant(variant);
        });

        store.change("quantity" + _productJson.id, function () {
          _this.Init();
        });
      }

      store.change("dataCurrency", function () {
        _this.Init();
      });
    };

    this.setPriceWithVariant = function (variant) {
      if (variant.compare_at_price && variant.price && variant.compare_at_price > variant.price) {
        $element.addClass("gf_active");
        $element.addClass("gt_active");

        // Giá giảm theo %
        if (_this.settings.classTextPercent) {
          var $number = $element.find(_this.settings.classTextPercent);
          var number = _this.getPercentDiscount(variant.price, variant.compare_at_price);

          $number.html(number);
        }

        // Giá giảm theo sổ tiền
        if (_this.settings.classTextNumber) {
          var $price = $element.find(_this.settings.classTextNumber);
          var diff = variant.compare_at_price - variant.price;

          diff = _this.formatMoneyPlugin(diff);
          $price.html(diff);
        }
      } else {
        $element.removeClass("gf_active");
        $element.removeClass("gt_active");
      }
    };

    // Get price with quantity
    this.getPriceWithQuantity = function (price) {
      if (_productJson) {
        var quantityProduct = window.store.get("quantity" + _productJson.id);

        quantityProduct = Number(quantityProduct);
        if (!quantityProduct || isNaN(quantityProduct)) {
          quantityProduct = 1;
        }
        price = Number(price) * quantityProduct;
      }
      return price;
    };

    // Format price
    this.formatMoneyPlugin = function (price) {
      price = _this.getPriceWithQuantity(price);
      var dataCurrency = window.store.get("dataCurrency");
      var format = __GemSettings.money;

      if (!dataCurrency) {
        // default shopify format
        price = Shopify.formatMoney(price, format);
      } else {
        // ES addon auto currency converter
        var notApplyRoundDecimal = true; // no apply round decimal for save money

        price = Shopify.gemFormatMoney(price, dataCurrency.currency, dataCurrency.data, _this.settings.customCurrencyFormating, notApplyRoundDecimal);
      }

      if (_this.settings.dataFormat && _this.settings.dataFormatKey) {
        price = _this.settings.dataFormat.replace(_this.settings.dataFormatKey, price);
      }

      return price;
    };

    // Lấy phần trăm giảm giá
    this.getPercentDiscount = function (price, comparePrice) {
      price = parseFloat(price);
      comparePrice = parseFloat(comparePrice);
      var diff = comparePrice - price;

      diff = diff / comparePrice;
      diff = diff * 100;
      if(_this.settings.roundNoZeroes) {
        diff = _this.roundTo(diff, _this.settings.roundPercent);
      } else {
        diff = diff.toFixed(_this.settings.roundPercent);
      }
      diff += "%";

      if (_this.settings.dataFormat && _this.settings.dataFormatKey) {
        diff = _this.settings.dataFormat.replace(_this.settings.dataFormatKey, diff);
      }

      return diff;
    };

    this.roundTo = function(n, digits) {
      if (digits === undefined) {
        digits = 0;
      }
    
      var multiplicator = Math.pow(10, digits);
      n = parseFloat((n * multiplicator).toFixed(11));
      var test =(Math.round(n) / multiplicator);
      return +(test.toFixed(digits));
    }

    this.init();
  };

  jQuery.fn.gtProductSaved = function (options) {
    return this.each(function () {
      var plugin = new gtProductSaved(this, options, jQuery);

      jQuery(this).data("gtproductsaved", plugin);
    });
  };
})(jQuery);

        }
        funcLib11();
      } catch(e) {
        console.error("Error lib id: 11" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcLib109 = function() {
          (function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["webpackNumbers"] = factory();
	else
		root["webpackNumbers"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */
/***/ (function(module, exports) {

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
/**
 * GtVariantsStyle
 * 1, Tùy chọn variant title color thì merge array colors custom vào variants.
 * 2, Tùy chọn variant title image thì merge array images custom vào variants.
 * 3, Cho phép setting hiển thị có tooltips không
 * 4, Cho phép chọn một số style tooltips
 */
var GtVariantsStyleV2 = /** @class */ (function () {
    /**
     * constructor
     * @param params params
     */
    function GtVariantsStyleV2(params) {
        var _this = this;
        this.settings = {
            colors: [],
            colorVariantTitle: "",
            colorVariantCircle: false,
            colorVariantRadius: "3px",
            colorVariantSize: "",
            colorVariantSizeSelect: "",
            images: [],
            imageVariantTitle: "",
            imageVariantCircle: false,
            imageVariantRadius: "3px",
            imageVariantSize: "",
            imageVariantSizeSelect: "",
            variantTooltip: false,
            hideSoldOutVariants: false,
            variantSaleTag: false,
            variantSaleTagTitle: "",
            variantSaleTagFormat: "[!Value!]% off",
            variantSaleTagTextColor: "#000",
            variantSaleTagBackgroundColor: "#FDAC2B",
            variantSaleTagBorderRadius: "5px",
            hideNoneExistVariant: false,
            mode: "production",
        };
        this.variants = [];
        this.cacheActiveVariants = {};
        this.$el = jQuery(params.$element);
        this.settings = __assign(__assign({}, this.settings), params.options);
        this.variants = this.getVariants();
        this.resetFeatures();
        if (this.settings.hideNoneExistVariant || this.settings.hideSoldOutVariants) {
            this.filterNoneExistOrSoldoutVariant(function () {
                _this.supportVariantColor();
                _this.supportVariantImage();
                _this.supportVariantSaleTag();
                _this.listenChangeVariantUpdateSaleTag();
            });
        }
        else {
            this.supportVariantColor();
            this.supportVariantImage();
            this.showVariantAtom();
            this.supportVariantSaleTag();
            this.listenChangeVariantUpdateSaleTag();
        }
    }
    /**
     * Destroy
     */
    GtVariantsStyleV2.prototype.Destroy = function () {
        this.resetFeatures();
    };
    /**
     * showVariantAtom sau khi load xong support color và image thì hiển thị atom lên do lúc đầu ản ở css của addon variant style
     */
    GtVariantsStyleV2.prototype.showVariantAtom = function () {
        // show variant atom
        var $products = this.$el.find("[keyword='product'], [data-keyword='product']");
        if ($products === null || $products === void 0 ? void 0 : $products.length) {
            for (var i = 0; i < $products.length; i++) {
                var $product = jQuery($products[i]);
                var $variantsWrapper = $product.find(".gt_product-variant");
                $variantsWrapper.addClass("gt_show_product-variant");
            }
        }
    };
    /**
     * resetFeatures
     */
    GtVariantsStyleV2.prototype.resetFeatures = function () {
        // Code run in editor
        var $selectors = this.$el.find(".gt_swatches--select[data-name][data-value]");
        // voi atom dang select
        var $activeSelector = this.$el.find(".gt_product-swatches-option-selected");
        if ($selectors === null || $selectors === void 0 ? void 0 : $selectors.length) {
            for (var i = 0; i < $selectors.length; i++) {
                var $selector = jQuery($selectors[i]);
                $selector.attr("style", "");
                var $childs = $selector.find("*");
                if ($childs === null || $childs === void 0 ? void 0 : $childs.length) {
                    $childs.each(function () {
                        var _a;
                        var $child = jQuery(this);
                        if (!((_a = $child.closest(".gt_variant__tooltip, .gt_swatches--select--soldout")) === null || _a === void 0 ? void 0 : _a.length)) {
                            $child.css({
                                visibility: "",
                                display: "",
                            });
                        }
                    });
                }
                $selector.find(".gt-variant-style_custom").remove();
                // remove for variant type segment:
                $selector.find(".gt_swatches-segment-variant-style").remove();
                // remove tool tip
                $selector.find(".gt_variant__tooltip, .gt_variant-style-sale-tag").remove();
            }
        }
        if ($activeSelector === null || $activeSelector === void 0 ? void 0 : $activeSelector.length) {
            $activeSelector.find(".gt-variant-style_custom").remove();
            var $childs = $activeSelector.find("*");
            if ($childs === null || $childs === void 0 ? void 0 : $childs.length) {
                $childs.each(function () {
                    var _a;
                    var $child = jQuery(this);
                    if (!((_a = $child.closest(".gt_variant__tooltip, .gt_swatches--select--soldout")) === null || _a === void 0 ? void 0 : _a.length)) {
                        $child.css({
                            visibility: "",
                            display: "",
                        });
                    }
                });
            }
        }
        // Run in editor
        var $variantsSoldOut = this.$el.find(".gt_swatches--select");
        if ($variantsSoldOut && $variantsSoldOut.length) {
            $variantsSoldOut.removeClass("gt_soldout gt_option_variant_none_existed gt_option_variant_soldout");
        }
    };
    /**
     * supportHideSoldOutVariants
     */
    /*
    private supportHideSoldOutVariants() {
      if (this.settings.hideSoldOutVariants) {
        const $products = this.$el.find("[keyword=product], [data-keyword='product']");
        if ($products?.length) {
          for (let i = 0; i < $products.length; i++) {
            const $product = jQuery($products[i]);
            if ($product?.length) {
              let productJsonObject: ProductShopify;
              const productJson = $product.find(".ProductJson").text();
              try {
                productJsonObject = JSON.parse(productJson);
              } catch (error) {
                console.log("error ", error);
              }
  
              const availableVariants: VariantShopify[] = [];
              if (productJsonObject?.variants?.length) {
                for (let j = 0; j < productJsonObject.variants.length; j++) {
                  const variant = productJsonObject.variants[j];
  
                  if (variant.available != undefined && variant.available) {
                    availableVariants.push(variant);
                  } else if (variant.inventory_quantity > 0 || variant.inventory_management != "shopify") {
                    // available
                    availableVariants.push(variant);
                  }
                }
              }
  
              const $swatches = $product.find(".gt_product-swatches");
              $swatches.find(".gt_product-swatches--item").each(function (index) {
                const $lineVariants = jQuery(this);
                const $variants = $lineVariants.find(".gt_swatches--select").not("li");
                $variants.each(function () {
                  const $variant = jQuery(this);
                  const value = $variant.attr("data-value");
                  // value = value.replace(/'/gm, "\"");
                  if (availableVariants?.length) {
                    let found = false;
                    for (let j = 0; j < availableVariants.length; j++) {
                      const varaint = availableVariants[j];
                      if (varaint?.options[index] == value) {
                        found = true;
                        break;
                      }
                    }
                    if (!found) {
                      $variant.addClass("gt_soldout");
                    }
                  } else {
                    $variant.addClass("gt_soldout");
                  }
                });
              });
  
              const $variantsSoldOut = $swatches.find(".gt_swatches--select.gt_soldout");
              if ($variantsSoldOut?.length) {
                const typeAtomVariant = this.getTypeOfProductVariantAtom($variantsSoldOut);
                const customTypeAtomVariant = this.getTypeOfCustomVariantAtom($variantsSoldOut);
                $variantsSoldOut.each(function () {
                  const $variantSoldOut = jQuery(this);
                  $variantSoldOut.find(".gt_swatches--select--soldout").remove();
                  $variantSoldOut.css({
                    position: "relative",
                    "user-select": "none",
                    cursor: "default",
                    "pointer-events": "none",
                  });
                  if ((typeAtomVariant === "segment" && customTypeAtomVariant !== "select") || (typeAtomVariant === "select" && customTypeAtomVariant === "segment")) {
                    const bordeRadius = $variantSoldOut.css("border-radius");
                    const _soldOutColor = "#000";
                    const sizeStroke = 1;
                    $variantSoldOut.append(
                      "<svg height=\"100\" width=\"100\" preserveAspectRatio=\"none\" class=\"gt_swatches--select--soldout\"><line x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\" style=\"stroke:" +
                        _soldOutColor +
                        ";stroke-width:" +
                        sizeStroke +
                        "\" /><line x1=\"0%\" y1=\"100%\" x2=\"100%\" y2=\"0%\" style=\"stroke:" +
                        _soldOutColor +
                        ";stroke-width:" +
                        sizeStroke +
                        "\" /></svg>"
                    );
                    $variantSoldOut.find(".gt_swatches--select--soldout").css({
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      top: "0",
                      left: "0",
                      "border-radius": bordeRadius,
                    });
                  } else {
                    $variantSoldOut.css("opacity", "0.5");
                  }
                });
              }
            }
          }
        }
      }
      return;
    }
    */
    /**
     * supportVariantColor
     */
    GtVariantsStyleV2.prototype.supportVariantColor = function () {
        var _this = this;
        // support variant color
        if (this.settings.colorVariantTitle) {
            var colorVariantTitleList = this.settings.colorVariantTitle.split(",");
            if (colorVariantTitleList && colorVariantTitleList.length) {
                colorVariantTitleList.forEach(function (title) {
                    var _a;
                    var titleTrim = title.trim();
                    var $selectors = _this.$el.find(".gt_swatches--select[data-name=\"" + titleTrim + "\"][data-value]").not("li");
                    var $selectActiveVariant = (_a = _this.$el
                        .find(".gt_product-swatches--item[data-name=\"" + titleTrim + "\"]")) === null || _a === void 0 ? void 0 : _a.find(".gt_product-swatches-option-selected .gt_product-variant-option--selected-text");
                    // support select active cua atom product variant select
                    if ($selectActiveVariant === null || $selectActiveVariant === void 0 ? void 0 : $selectActiveVariant.length) {
                        var valueSelect = $selectActiveVariant.attr("data-value");
                        for (var j = 0; j < _this.variants.length; j++) {
                            var varaint = _this.variants[j];
                            var variantTitle = varaint.title;
                            var languages = varaint.languages;
                            if (variantTitle) {
                                if (valueSelect.toLowerCase() == variantTitle.toLowerCase()) {
                                    _this.setColorToVariant($selectActiveVariant, varaint, valueSelect);
                                }
                                else if (languages === null || languages === void 0 ? void 0 : languages.length) {
                                    for (var k = 0; k < languages.length; k++) {
                                        var language = languages[k].toLowerCase();
                                        if (language == valueSelect.toLowerCase()) {
                                            _this.setColorToVariant($selectActiveVariant, varaint, valueSelect);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    // support variant color
                    if ($selectors === null || $selectors === void 0 ? void 0 : $selectors.length) {
                        var selectorSupportToolTip = [];
                        for (var i = 0; i < $selectors.length; i++) {
                            var $selector = jQuery($selectors[i]);
                            var value = $selector.attr("data-value");
                            // value = value.replace(/'/gm, "\"");
                            if (value) {
                                for (var j = 0; j < _this.variants.length; j++) {
                                    var varaint = _this.variants[j];
                                    var variantTitle = varaint.title;
                                    var languages = varaint.languages;
                                    if (variantTitle) {
                                        if (value.toLowerCase() == variantTitle.toLowerCase()) {
                                            _this.setColorToVariant($selector, varaint, value);
                                            selectorSupportToolTip.push($selector);
                                        }
                                        else if (languages === null || languages === void 0 ? void 0 : languages.length) {
                                            for (var k = 0; k < languages.length; k++) {
                                                var language = languages[k].toLowerCase();
                                                if (language == value.toLowerCase()) {
                                                    _this.setColorToVariant($selector, varaint, value);
                                                    selectorSupportToolTip.push($selector);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        selectorSupportToolTip.forEach(function ($selector) {
                            _this.supportTooltip($selector);
                        });
                    }
                });
            }
        }
    };
    /**
     * setColorToVariant
     * @param $selector dom select variant
     * @param variant variant same default or custom
     * @param value value cua variant option
     */
    GtVariantsStyleV2.prototype.setColorToVariant = function ($selector, variant, value) {
        var _a;
        var typeAtomVariant = this.getTypeOfProductVariantAtom($selector);
        var customAtomVariantType = this.getTypeOfCustomVariantAtom($selector);
        if ((typeAtomVariant === "select" && customAtomVariantType !== "segment") || (typeAtomVariant === "segment" && customAtomVariantType === "select")) {
            var color = variant.color;
            var $colorElement = $("<div></div>");
            $colorElement.css({
                "background-color": color,
                "user-select": "none",
                position: "relative",
            });
            if (!this.settings.colorVariantSizeSelect) {
                var height = 24;
                $colorElement.css({
                    "min-width": height + "px",
                    width: height + "px",
                    "min-height": height + "px",
                    height: height + "px",
                });
            }
            else {
                $colorElement.css({
                    "min-width": this.settings.colorVariantSizeSelect,
                    width: this.settings.colorVariantSizeSelect,
                    "min-height": this.settings.colorVariantSizeSelect,
                    height: this.settings.colorVariantSizeSelect,
                });
            }
            if (this.settings.colorVariantCircle) {
                $colorElement.css({
                    "border-radius": "100%",
                    border: "1px solid currentcolor",
                    "margin-right": "10px",
                });
            }
            else {
                $colorElement.css({
                    "border-radius": this.settings.colorVariantRadius,
                });
            }
            var $contentElement = $("<div></div>");
            $contentElement.addClass("gt-variant-style_custom-text");
            $contentElement.html(value);
            var $optionElement = $("<div></div>");
            $optionElement.append($colorElement);
            $optionElement.append($contentElement);
            $optionElement.addClass("gt-variant-style_custom");
            $optionElement.css({
                display: "flex",
                "align-items": "center",
            });
            (_a = $selector.find(".gt-variant-style_custom")) === null || _a === void 0 ? void 0 : _a.remove();
            $selector.find(".gt_variant__tooltip").remove();
            var $childs = $selector.find("*");
            $childs.each(function () {
                var _a;
                var $child = jQuery(this);
                if (!((_a = $child.closest(".gt_swatches--select--soldout")) === null || _a === void 0 ? void 0 : _a.length)) {
                    $child.css({
                        display: "none",
                    });
                }
            });
            $selector.append($optionElement);
        }
        else {
            if (!this.settings.colorVariantSize) {
                $selector.css({
                    "min-width": "",
                    width: "auto",
                    "min-height": "",
                    height: "auto",
                });
                var isNoneExistedOption = false;
                if (this.settings.hideNoneExistVariant && $selector.hasClass("gt_option_variant_none_existed")) {
                    isNoneExistedOption = true;
                    $selector.removeClass("gt_option_variant_none_existed");
                }
                var $variantsWrapper = $selector.closest(".gt_product-variant");
                if (this.settings.mode === "dev" && this.settings.hideNoneExistVariant && !$variantsWrapper.hasClass("gt_show_product-variant")) {
                    $variantsWrapper.addClass("gt_show_product-variant");
                }
                // open child to calculate height
                var $childs_1 = $selector.find("*");
                $childs_1.each(function () {
                    var _a;
                    var $child = jQuery(this);
                    if (!((_a = $child.closest(".gt_variant__tooltip, .gt_swatches--select--soldout, .gt_swatches-segment-variant-style")) === null || _a === void 0 ? void 0 : _a.length)) {
                        $child.css({
                            display: "",
                        });
                    }
                });
                // calculate height
                var height = $selector.outerHeight();
                $selector.attr("style", $selector.attr("style") + "padding: 0px !important;");
                $selector.css({
                    "min-width": height + "px",
                    width: height + "px",
                    "min-height": height + "px",
                    height: height + "px",
                });
                if (this.settings.hideNoneExistVariant && isNoneExistedOption) {
                    $selector.addClass("gt_option_variant_none_existed");
                }
                // remove child
                $childs_1.each(function () {
                    var _a;
                    var $child = jQuery(this);
                    if (!((_a = $child.closest(".gt_variant__tooltip, .gt_swatches--select--soldout, .gt_swatches-segment-variant-style")) === null || _a === void 0 ? void 0 : _a.length)) {
                        $child.css({
                            display: "none",
                        });
                    }
                });
            }
            else {
                $selector.css({
                    "min-width": this.settings.colorVariantSize,
                    width: this.settings.colorVariantSize,
                    "min-height": this.settings.colorVariantSize,
                    height: this.settings.colorVariantSize,
                    padding: "0px",
                });
            }
            // hidden children
            var $childs = $selector.find("*");
            $childs.each(function () {
                var _a;
                var $child = jQuery(this);
                if (!((_a = $child.closest(".gt_variant__tooltip, .gt_swatches--select--soldout")) === null || _a === void 0 ? void 0 : _a.length)) {
                    $child.css({
                        display: "none",
                    });
                }
            });
            // border radius
            if (this.settings.colorVariantCircle) {
                $selector.css({
                    "border-radius": "100%",
                });
            }
            else {
                $selector.css({
                    "border-radius": this.settings.colorVariantRadius,
                });
            }
            // set color
            var color = variant.color;
            $selector.css({
                "user-select": "none",
                position: "relative",
            });
            // custom color
            var $colorElement = $("<div class='gt_swatches-segment-variant-style'></div>");
            $colorElement.css({
                "background-color": color,
                color: color,
                width: "100%",
                height: "100%",
                "border-radius": this.settings.colorVariantCircle ? "100%" : "calc(" + this.settings.colorVariantRadius + " - 2px)",
            });
            $selector.append($colorElement);
        }
    };
    /**
     * supportVariantColor
     */
    GtVariantsStyleV2.prototype.supportVariantImage = function () {
        var _this = this;
        // support variant color
        if (this.settings.imageVariantTitle) {
            var imageVariantTitleList = this.settings.imageVariantTitle.split(",");
            if (imageVariantTitleList && imageVariantTitleList.length) {
                imageVariantTitleList.forEach(function (title) {
                    var _a;
                    var titleTrim = title.trim();
                    // support select active cua atom product variant select
                    var $selectActiveVariant = (_a = _this.$el
                        .find(".gt_product-swatches--item[data-name=\"" + titleTrim + "\"]")) === null || _a === void 0 ? void 0 : _a.find(".gt_product-swatches-option-selected .gt_product-variant-option--selected-text");
                    if ($selectActiveVariant === null || $selectActiveVariant === void 0 ? void 0 : $selectActiveVariant.length) {
                        _this.findVariantImageAndSetUrl($selectActiveVariant);
                    }
                    var $selectors = _this.$el.find(".gt_swatches--select[data-name=\"" + titleTrim + "\"][data-value]").not("li");
                    if ($selectors === null || $selectors === void 0 ? void 0 : $selectors.length) {
                        _this.findVariantImageAndSetUrl($selectors);
                    }
                });
            }
        }
    };
    /**
     * findVariantImageAndSetUrl
     * @param $selectors $selector
     */
    GtVariantsStyleV2.prototype.findVariantImageAndSetUrl = function ($selectors) {
        var _a, _b;
        for (var i = 0; i < $selectors.length; i++) {
            var $selector = jQuery($selectors[i]);
            var value = $selector.attr("data-value");
            // value = value.replace(/'/gm, "\"");
            if (value) {
                var imageUrl = void 0;
                var $product = $selector.closest("[keyword=product], [data-keyword='product']");
                if ($product === null || $product === void 0 ? void 0 : $product.length) {
                    var productJson = $product.find(".ProductJson").text();
                    try {
                        var productJsonObject = JSON.parse(productJson);
                        if (((_a = productJsonObject.variants) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                            for (var i_1 = 0; i_1 < productJsonObject.variants.length; i_1++) {
                                var variantProduct = productJsonObject.variants[i_1];
                                if (variantProduct.options.includes(value) && ((_b = variantProduct.featured_image) === null || _b === void 0 ? void 0 : _b.src)) {
                                    imageUrl = variantProduct.featured_image.src;
                                    break;
                                }
                            }
                        }
                    }
                    catch (error) {
                        console.log("error ", error);
                    }
                }
                value = value.toLowerCase();
                value = value.replace(/'/gm, "").replace(/"/gm, "");
                var found = false;
                for (var j = 0; j < this.variants.length; j++) {
                    var variantTitle = this.variants[j].title;
                    var languages = this.variants[j].languages;
                    var image = this.variants[j].image;
                    if (variantTitle) {
                        variantTitle = variantTitle.toLowerCase();
                        if (value == variantTitle && image) {
                            found = true;
                            this.setImageToVariant($selector, image);
                        }
                        else if ((languages === null || languages === void 0 ? void 0 : languages.length) && image) {
                            for (var k = 0; k < languages.length; k++) {
                                var language = languages[k].toLowerCase();
                                if (language == value.toLowerCase()) {
                                    found = true;
                                    this.setImageToVariant($selector, image);
                                }
                            }
                        }
                    }
                }
                if (!found) {
                    this.setImageToVariant($selector, imageUrl);
                }
            }
        }
        for (var i = 0; i < $selectors.length; i++) {
            var $selector = jQuery($selectors[i]);
            this.supportTooltip($selector);
        }
    };
    /**
     * setImageToVariant
     * @param $selector dom select variant
     * @param imageUrl image url variant
     */
    GtVariantsStyleV2.prototype.setImageToVariant = function ($selector, imageUrl) {
        var typeAtomVariant = this.getTypeOfProductVariantAtom($selector);
        var customAtomVariantType = this.getTypeOfCustomVariantAtom($selector);
        if ((typeAtomVariant === "select" && customAtomVariantType !== "segment") || (typeAtomVariant === "segment" && customAtomVariantType === "select")) {
            if (imageUrl) {
                var $imageElement_1 = $("<div></div>");
                $imageElement_1.css({
                    position: "relative",
                    "user-select": "none",
                    "background-image": "url(\"" + imageUrl + "\")",
                    "background-repeat": "no-repeat",
                    "background-size": "contain",
                    "background-position": "center",
                    "background-color": "#fff",
                    "margin-right": "10px",
                    border: "1px solid currentcolor",
                });
                var $childs = $selector.find("*");
                if ($childs === null || $childs === void 0 ? void 0 : $childs.length) {
                    $childs.each(function () {
                        var _a;
                        var $child = jQuery(this);
                        if (!((_a = $child.closest(".gt_swatches--select--soldout")) === null || _a === void 0 ? void 0 : _a.length)) {
                            $child.css({
                                display: "none",
                            });
                        }
                    });
                }
                if (!this.settings.imageVariantSizeSelect) {
                    $imageElement_1.css({
                        "min-width": "",
                        width: "",
                        "min-height": "",
                        height: "",
                    });
                    setTimeout(function () {
                        var height = 24;
                        $imageElement_1.css({
                            "min-width": height + "px",
                            width: height + "px",
                            "min-height": height + "px",
                            height: height + "px",
                        });
                    }, 0);
                }
                else {
                    $imageElement_1.css({
                        "min-width": this.settings.imageVariantSizeSelect,
                        width: this.settings.imageVariantSizeSelect,
                        "min-height": this.settings.imageVariantSizeSelect,
                        height: this.settings.imageVariantSizeSelect,
                    });
                }
                if (this.settings.imageVariantCircle) {
                    $imageElement_1.css({
                        "border-radius": "100%",
                    });
                }
                else {
                    $imageElement_1.css({
                        "border-radius": this.settings.imageVariantRadius,
                    });
                }
                var value = $selector.attr("data-value");
                var $contentElement = $("<div></div>");
                $contentElement.addClass("gt-variant-style_custom-text");
                $contentElement.html(value);
                var $optionElement = $("<div></div>");
                $optionElement.append($imageElement_1);
                $optionElement.append($contentElement);
                $optionElement.addClass("gt-variant-style_custom");
                $optionElement.css({
                    display: "flex",
                    "align-items": "center",
                });
                $selector.append($optionElement);
            }
        }
        else {
            if (imageUrl) {
                $selector.css({
                    position: "relative",
                    "user-select": "none",
                    "background-image": "url(\"" + imageUrl + "\")",
                    "background-repeat": "no-repeat",
                    "background-size": "contain",
                    "background-position": "center",
                    "background-color": "#fff",
                });
                var $childs = $selector.find("*");
                if ($childs === null || $childs === void 0 ? void 0 : $childs.length) {
                    $childs.each(function () {
                        var _a;
                        var $child = jQuery(this);
                        if (!((_a = $child.closest(".gt_variant__tooltip, .gt_swatches--select--soldout")) === null || _a === void 0 ? void 0 : _a.length)) {
                            $child.css({
                                visibility: "hidden",
                            });
                        }
                    });
                }
                if (!this.settings.imageVariantSize) {
                    $selector.css({
                        "min-width": "",
                        width: "",
                        "min-height": "",
                        height: "",
                    });
                    setTimeout(function () {
                        var height = $selector.outerHeight();
                        $selector.css({
                            "min-width": height + "px",
                            width: height + "px",
                            "min-height": height + "px",
                            height: height + "px",
                        });
                    }, 0);
                }
                else {
                    $selector.css({
                        "min-width": this.settings.imageVariantSize,
                        width: this.settings.imageVariantSize,
                        "min-height": this.settings.imageVariantSize,
                        height: this.settings.imageVariantSize,
                    });
                }
                if (this.settings.imageVariantCircle) {
                    $selector.css({
                        "border-radius": "100%",
                    });
                }
                else {
                    $selector.css({
                        "border-radius": this.settings.imageVariantRadius,
                    });
                }
            }
        }
    };
    /**
     * supportTooltip
     * @param $selector dom select variant
     */
    GtVariantsStyleV2.prototype.supportTooltip = function ($selector) {
        var _this = this;
        if (this.settings.variantTooltip) {
            var typeAtomVariant = this.getTypeOfProductVariantAtom($selector);
            var customAtomVariantType = this.getTypeOfCustomVariantAtom($selector);
            var isCheckTooltip = $selector.find(".gt_variant__tooltip");
            if ((!isCheckTooltip || !isCheckTooltip.length) &&
                ((typeAtomVariant === "select" && customAtomVariantType === "segment") || (typeAtomVariant === "segment" && customAtomVariantType !== "select"))) {
                var value = $selector.attr("data-value");
                // value = value.replace(/'/gm, "\"");
                var $tooltip_1 = jQuery("<span class=\"gt_variant__tooltip\">" + value + "<span class=\"gt_variant__tooltip_arrow\"></span></span>");
                $tooltip_1.css({
                    position: "absolute",
                    bottom: "calc(100% + 10px)",
                    left: "50%",
                    background: "rgba(0,0,0,0.76)",
                    color: "#fff",
                    transform: "translateX(-50%)",
                    "border-radius": "4px",
                    padding: "0.4rem 0.75rem",
                    "white-space": "nowrap",
                    transition: "visibility 0s, opacity 0.25s",
                    visibility: "hidden",
                    opacity: "0",
                });
                $tooltip_1.find(".gt_variant__tooltip_arrow").css({
                    position: "absolute",
                    top: "100%",
                    left: "50%",
                    color: "#fff",
                    "margin-left": "-6px",
                    "border-top": "solid 6px rgba(0,0,0,0.76)",
                    "border-bottom": "solid 6px transparent",
                    "border-left": "solid 6px transparent",
                    "border-right": "solid 6px transparent",
                });
                $selector.append($tooltip_1);
                this.checkTooltipPosition($tooltip_1, $selector);
                $selector.off("mouseover.hoverVariant").on("mouseover.hoverVariant", function () {
                    _this.checkTooltipPosition($tooltip_1, $selector);
                    $tooltip_1.css({
                        visibility: "visible",
                        opacity: "1",
                    });
                    $selector.off("mouseleave.hoverVariant").on("mouseleave.hoverVariant", function () {
                        $tooltip_1.css({
                            visibility: "hidden",
                            opacity: "0",
                        });
                        $selector.off("mouseleave.hoverVariant");
                    });
                });
            }
        }
    };
    /**
     * checkTooltopPosition check position tooltip get out of frame
     * @param $tooltip current check tooltip dom
     * @param $selector $selector contain $tooltip
     */
    GtVariantsStyleV2.prototype.checkTooltipPosition = function ($tooltip, $selector) {
        if ($tooltip.offset().left + $tooltip.outerWidth() > $(window).width()) {
            $tooltip.css({
                left: "initial",
                right: 0,
                transform: "translateX(0)",
            });
            $tooltip.find(".gt_variant__tooltip_arrow").css({
                left: "initial",
                right: $selector.outerWidth() / 2 + "px",
                "margin-right": "-6px",
                "margin-left": "0px",
            });
        }
        else if ($tooltip.offset().left < 0) {
            $tooltip.css({
                left: 0,
                transform: "translateX(0)",
            });
            $tooltip.find(".gt_variant__tooltip_arrow").css({
                left: $selector.outerWidth() / 2 + "px",
            });
        }
    };
    /**
     * support variant sale tag
     */
    GtVariantsStyleV2.prototype.supportVariantSaleTag = function () {
        var _this = this;
        // support variant color
        if (!this.settings.variantSaleTag) {
            return;
        }
        // find product
        var $products = this.$el.find("[keyword=product], [data-keyword='product']");
        if (!($products === null || $products === void 0 ? void 0 : $products.length)) {
            return;
        }
        // each product section
        $products.each(function (_, productElement) {
            var $selectors = $(productElement).find(".gt_swatches--select[data-name=\"" + _this.settings.variantSaleTagTitle + "\"][data-value]").not("li");
            if (!($selectors === null || $selectors === void 0 ? void 0 : $selectors.length)) {
                return;
            }
            $selectors.css({
                position: "relative",
                "min-width": "120px",
                "min-height": "50px",
                display: "flex",
                "align-items": "center",
                "justify-content": "center",
                overflow: "visible",
            });
            $selectors.css({
                "margin-top": "30px",
            });
            // get product json
            var productJson = $(productElement).find(".ProductJson").text();
            var productJsonObject = null;
            try {
                productJsonObject = JSON.parse(productJson);
            }
            catch (e) {
                console.log("error: ", e);
            }
            // get current state of other variant types
            var $otherVariantTypes = $(productElement)
                .find(".gt_product-swatches--options, .gt_product-variant--options")
                .not(":has(> [data-name='" + _this.settings.variantSaleTagTitle + "'])");
            var currentOptionState = ($otherVariantTypes === null || $otherVariantTypes === void 0 ? void 0 : $otherVariantTypes.length) ? Array.from($otherVariantTypes.map(function (_, options) { return $(options).find(".gt_swatches--select.gt_active").attr("data-value"); }))
                : [];
            // each option in current variant type of current product
            $selectors.each(function (_, selectorElement) {
                var $selector = $(selectorElement);
                var value = $selector.attr("data-value"); //.replace(/'/gm, "\"");
                if (!value || $selector.hasClass("gt_soldout")) {
                    if ($selector.has(".gt_variant-style-sale-tag").length) {
                        $selector.find(".gt_variant-style-sale-tag").remove();
                    }
                    return;
                }
                // calculate sale value
                var currentVariant = productJsonObject === null || productJsonObject === void 0 ? void 0 : productJsonObject.variants.find(function (variant) { return __spreadArrays(currentOptionState, [value]).every(function (option) { return variant.options.includes(option); }); });
                if (!currentVariant) {
                    if ($selector.has(".gt_variant-style-sale-tag").length) {
                        $selector.find(".gt_variant-style-sale-tag").remove();
                    }
                    return;
                }
                var saleValue = Math.round(((currentVariant.compare_at_price - currentVariant.price) / currentVariant.compare_at_price) * 100);
                // update value if sale tag has been exist
                if ($selector.has(".gt_variant-style-sale-tag").length) {
                    if (saleValue <= 0) {
                        $selector.find(".gt_variant-style-sale-tag").remove();
                    }
                    else {
                        $selector.find(".gt_variant-style-sale-tag").text(_this.settings.variantSaleTagFormat.replace("[!Value!]", saleValue.toString()));
                    }
                    return;
                }
                if (saleValue <= 0) {
                    return;
                }
                // create and show sale tag
                var $saleTag = $("<div class='gt_variant-style-sale-tag'>" + _this.settings.variantSaleTagFormat.replace("[!Value!]", saleValue.toString()) + "</div>");
                $saleTag.css({
                    position: "absolute",
                    top: "-20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    "min-width": "70px",
                    height: "30px",
                    background: _this.settings.variantSaleTagBackgroundColor,
                    color: _this.settings.variantSaleTagTextColor,
                    "border-radius": _this.settings.variantSaleTagBorderRadius,
                    display: "flex",
                    "align-items": "center",
                    "justify-content": "center",
                    "line-height": "1em",
                    padding: "0 2px",
                });
                $selector.append($saleTag);
            });
        });
    };
    /**
     * listen change variant update sale tag
     */
    GtVariantsStyleV2.prototype.listenChangeVariantUpdateSaleTag = function () {
        var _this = this;
        var $products = this.$el.find("[keyword='product'], [data-keyword='product']");
        if (!($products === null || $products === void 0 ? void 0 : $products.length)) {
            return;
        }
        $products.each(function (_, productElement) {
            var $productJson = $(productElement).find(".ProductJson");
            if (!($productJson === null || $productJson === void 0 ? void 0 : $productJson.length)) {
                return;
            }
            window.store.change("variant" + $productJson.attr("data-id"), _this.supportVariantSaleTag.bind(_this));
        });
    };
    /**
     * getTypeOfProductVariantAtom
     * @param $selector product variant item
     * @returns string type cua atom product variant
     */
    GtVariantsStyleV2.prototype.getTypeOfProductVariantAtom = function ($selector) {
        var _a;
        var $productSwatches = $selector.closest(".gt_product-swatches");
        return (_a = $productSwatches === null || $productSwatches === void 0 ? void 0 : $productSwatches.attr("data-type")) !== null && _a !== void 0 ? _a : "segment";
    };
    /**
     * getTypeOfCustomVariantAtom
     * @param $selector product variant item
     * @returns type cua custom type atom
     */
    GtVariantsStyleV2.prototype.getTypeOfCustomVariantAtom = function ($selector) {
        var $customSelectTypeWrapper = $selector.closest("*[data-type='custom-select-style']");
        if ($customSelectTypeWrapper && $customSelectTypeWrapper.length) {
            return "select";
        }
        var $customSegmentTypeWrapper = $selector.closest("*[data-type='custom-segment-style']");
        if ($customSegmentTypeWrapper && $customSegmentTypeWrapper.length) {
            return "segment";
        }
        return "";
    };
    /**
     * getVariants
     * @returns variants
     */
    GtVariantsStyleV2.prototype.getVariants = function () {
        var defaultVariants = [];
        // Merge color
        var customColors = this.settings.colors;
        if (customColors === null || customColors === void 0 ? void 0 : customColors.length) {
            for (var i = 0; i < customColors.length; i++) {
                var title = customColors[i].title;
                var color = customColors[i].color;
                if (title && color) {
                    title = title.toLowerCase();
                    var variant = {
                        title: title,
                        color: color,
                        languages: [],
                        image: "",
                    };
                    var found = false;
                    for (var j = 0; j < defaultVariants.length; j++) {
                        if (defaultVariants[j].title == title) {
                            found = true;
                            defaultVariants[j].color = variant.color; // replace color
                            break;
                        }
                    }
                    if (!found) {
                        defaultVariants.push(variant);
                    }
                }
            }
        }
        // Merge image
        var customImages = this.settings.images;
        if (customImages === null || customImages === void 0 ? void 0 : customImages.length) {
            for (var i = 0; i < customImages.length; i++) {
                var title = customImages[i].title;
                var image = customImages[i].image;
                if (title && image) {
                    title = title.toLowerCase();
                    var variant = {
                        title: title,
                        color: "",
                        languages: [],
                        image: image,
                    };
                    var found = false;
                    for (var j = 0; j < defaultVariants.length; j++) {
                        if (defaultVariants[j].title == title) {
                            found = true;
                            defaultVariants[j].image = variant.image; // replace image
                            break;
                        }
                    }
                    if (!found) {
                        defaultVariants.push(variant);
                    }
                }
            }
        }
        return defaultVariants;
    };
    /**
     * filterNoneExistOrSoldoutVariant ẩn các variant không tồn tại hoac soldout
     * @param callback callback khi ẩn xong các variant
     * @returns null
     */
    GtVariantsStyleV2.prototype.filterNoneExistOrSoldoutVariant = function (callback) {
        var _this = this;
        var $products = this.$el.find("[keyword='product'], [data-keyword='product']");
        if ($products === null || $products === void 0 ? void 0 : $products.length) {
            var _loop_1 = function (i) {
                var $product = jQuery($products[i]);
                if ($product === null || $product === void 0 ? void 0 : $product.length) {
                    var productJsonObject_1;
                    var productJson = $product.find(".ProductJson").text();
                    try {
                        productJsonObject_1 = JSON.parse(productJson);
                    }
                    catch (error) {
                        console.log("error ", error);
                    }
                    // if all sold out
                    if (productJsonObject_1 && productJsonObject_1.variants.length > 1 && (productJsonObject_1.options.length > 1 || this_1.settings.hideSoldOutVariants)) {
                        if (this_1.settings.mode === "dev") {
                            setTimeout(function () {
                                // cache current variant
                                _this.cacheActiveVariants["variant" + productJsonObject_1.id] = window.SOLID.store.getState("variant" + productJsonObject_1.id);
                                // hidden none exist variant init
                                _this.hideNoneExistOrSoldoutVariantInit($product, productJsonObject_1);
                                _this.listenChangeExistedVariant($product, productJsonObject_1);
                            }, 10);
                        }
                        else {
                            // cache current variant
                            this_1.cacheActiveVariants["variant" + productJsonObject_1.id] = window.SOLID.store.getState("variant" + productJsonObject_1.id);
                            // hidden none exist variant init
                            this_1.hideNoneExistOrSoldoutVariantInit($product, productJsonObject_1);
                            this_1.listenChangeExistedVariant($product, productJsonObject_1);
                        }
                    }
                    else {
                        // show variant atom
                        var $variantsWrapper = $product.find(".gt_product-variant");
                        $variantsWrapper.addClass("gt_show_product-variant");
                    }
                }
            };
            var this_1 = this;
            for (var i = 0; i < $products.length; i++) {
                _loop_1(i);
            }
        }
        callback();
    };
    /**
     * hideNoneExistOrSoldoutVariantInit: ẩn những option không tồn tại khi mới khởi tạo
     * @param $product $dom cua section product
     * @param productJson productJson
     */
    GtVariantsStyleV2.prototype.hideNoneExistOrSoldoutVariantInit = function ($product, productJson) {
        var currentVariant = window.SOLID.store.getState("variant" + productJson.id);
        this.checkDomToHiddenNoneExistOrSoldoutVariant($product, productJson, currentVariant);
        // show variant atom
        var $variantsWrapper = $product.find(".gt_product-variant");
        $variantsWrapper.addClass("gt_show_product-variant");
    };
    /**
     * checkDomToHiddenNoneExistOrSoldoutVariant check dom để ẩn những item không tồn tại
     * @param $product $dom của section product
     * @param productJson productJson
     * @param currentVariant variant hiện tại của section
     */
    GtVariantsStyleV2.prototype.checkDomToHiddenNoneExistOrSoldoutVariant = function ($product, productJson, currentVariant) {
        var $variants = $product.find(".gt_swatches--select[data-name][data-value]").not("li");
        var option1List = this.getListOptionsAvailable({ productJson: productJson, order: 1 });
        var option2List = this.getListOptionsAvailable({ productJson: productJson, order: 2, firstOption: currentVariant === null || currentVariant === void 0 ? void 0 : currentVariant.option1 });
        var option3List = this.getListOptionsAvailable({ productJson: productJson, order: 3, firstOption: currentVariant === null || currentVariant === void 0 ? void 0 : currentVariant.option1, secondOption: currentVariant === null || currentVariant === void 0 ? void 0 : currentVariant.option2 });
        // hide all variant
        $variants.addClass("gt_option_variant_none_existed");
        $variants.removeClass("gt_option_variant_existed");
        $variants.removeClass("gt_option_variant_soldout");
        option1List.forEach(function (option) {
            var $option = $product.find(".gt_swatches--select[data-name][data-value=\"" + option.name.replace(/"/g, "\\\"") + "\"]").not("li");
            $option.removeClass("gt_option_variant_none_existed");
            $option.addClass("gt_option_variant_existed");
            if (!option.available) {
                $option.addClass("gt_option_variant_soldout");
            }
        });
        option2List.forEach(function (option) {
            var $option = $product.find(".gt_swatches--select[data-name][data-value=\"" + option.name.replace(/"/g, "\\\"") + "\"]").not("li");
            $option.removeClass("gt_option_variant_none_existed");
            $option.addClass("gt_option_variant_existed");
            if (!option.available) {
                $option.addClass("gt_option_variant_soldout");
            }
        });
        option3List.forEach(function (option) {
            var $option = $product.find(".gt_swatches--select[data-name][data-value=\"" + option.name.replace(/"/g, "\\\"") + "\"]").not("li");
            $option.removeClass("gt_option_variant_none_existed");
            $option.addClass("gt_option_variant_existed");
            if (!option.available) {
                $option.addClass("gt_option_variant_soldout");
            }
        });
    };
    /**
     * getListOptionsAvailable lấy ra các option tồn tại
     * @param params params
     * @param params.productJson productJson
     * @param params.firstOption option1
     * @param params.secondOption option2
     * @param params.order thứ tự của option
     * @returns list option tồn tại
     */
    GtVariantsStyleV2.prototype.getListOptionsAvailable = function (params) {
        var optionList = [];
        params.productJson.variants.forEach(function (variant) {
            var _a, _b, _c, _d;
            if (params.order === 1) {
                if (!optionList.find(function (item) { return item.name === variant.option1; })) {
                    optionList.push({
                        name: variant.option1,
                        available: params.productJson.variants.find(function (item) { return item.option1 === variant.option1 && item.available; }) ? true : false,
                    });
                }
            }
            else if (params.order === 2 && ((_b = (_a = params.productJson) === null || _a === void 0 ? void 0 : _a.options) === null || _b === void 0 ? void 0 : _b.length) >= 2) {
                if (variant.option1 === params.firstOption) {
                    optionList.push({
                        name: variant.option2,
                        available: params.productJson.variants.find(function (item) { return item.option1 === variant.option1 && item.option2 === variant.option2 && item.available; }) ? true : false,
                    });
                }
            }
            else if (((_d = (_c = params.productJson) === null || _c === void 0 ? void 0 : _c.options) === null || _d === void 0 ? void 0 : _d.length) === 3) {
                if (variant.option1 === params.firstOption && variant.option2 == params.secondOption && variant.option3) {
                    optionList.push({
                        name: variant.option3,
                        available: variant.available,
                    });
                }
            }
        });
        return optionList;
    };
    /**
     * listenChangeExistedVariant: lắng nghe khi change variant và ẩn các none exist/soldout variant đi
     * @param $product $dom của section product
     * @param productJson productJson
     */
    GtVariantsStyleV2.prototype.listenChangeExistedVariant = function ($product, productJson) {
        var _this = this;
        window.SOLID.store.subscribe("variant" + productJson.id, function (variant) {
            var _a, _b;
            var cacheVariant = _this.cacheActiveVariants["variant" + productJson.id];
            // get active in dom trong các trường hợp variant id = 0
            var option1 = productJson.options[0];
            var option2 = productJson.options[1];
            if (_this.settings.mode === "dev") {
                option1 = (_a = productJson.options[0]) === null || _a === void 0 ? void 0 : _a.name;
                option2 = (_b = productJson.options[1]) === null || _b === void 0 ? void 0 : _b.name;
            }
            var $option1Active = $product
                .find(".gt_swatches--select[data-name=\"" + option1 + "\"][data-value].gt_active, .gt_swatches--select[data-name=\"" + option1 + "\"][data-value].gf_active")
                .not("li");
            var option1Active = $option1Active.attr("data-value");
            var $option2Active = $product
                .find(".gt_swatches--select[data-name=\"" + option2 + "\"][data-value].gt_active, .gt_swatches--select[data-name=\"" + option2 + "\"][data-value].gf_active")
                .not("li");
            var option2Active = $option2Active.attr("data-value");
            // check xem variant có tồn tại không. nếu không active tới 1 variant tồn tại
            // hoặc check xem variant có available không. nếu không active tới 1 variant available 
            if ((!_this.settings.hideSoldOutVariants && variant.id) || (_this.settings.hideSoldOutVariants && variant.available)) {
                _this.cacheActiveVariants["variant" + productJson.id] = variant;
                _this.checkDomToHiddenNoneExistOrSoldoutVariant($product, productJson, variant);
            }
            else {
                var currentCheckVariant_1;
                if ((cacheVariant === null || cacheVariant === void 0 ? void 0 : cacheVariant.option1) !== option1Active) {
                    if (option1Active && option2Active) {
                        _this.cacheActiveVariants["variant" + productJson.id] = __assign(__assign({}, variant), { option1: option1Active, option2: option2Active });
                    }
                    for (var i = 0; i < productJson.variants.length; i++) {
                        var checkVariant = productJson.variants[i];
                        if (checkVariant.option1 === option1Active && checkVariant.available) {
                            // cần set ngay để không bị nháy ở giao diện
                            window.SOLID.store.dispatch("variant" + productJson.id, checkVariant);
                            currentCheckVariant_1 = checkVariant;
                            break;
                        }
                    }
                    // nếu không phải hide sold out variant và ko tìm được variant nào available thì tìm variant tồn tại
                    if (!_this.settings.hideSoldOutVariants && !currentCheckVariant_1) {
                        for (var i = 0; i < productJson.variants.length; i++) {
                            var checkVariant = productJson.variants[i];
                            if (checkVariant.option1 === option1Active && checkVariant.id) {
                                // cần set ngay để không bị nháy ở giao diện
                                window.SOLID.store.dispatch("variant" + productJson.id, checkVariant);
                                currentCheckVariant_1 = checkVariant;
                                break;
                            }
                        }
                    }
                }
                else if ((cacheVariant === null || cacheVariant === void 0 ? void 0 : cacheVariant.option2) !== option2Active && productJson.options.length > 2) {
                    if (option1Active && option2Active) {
                        _this.cacheActiveVariants["variant" + productJson.id] = __assign(__assign({}, variant), { option1: option1Active, option2: option2Active });
                    }
                    for (var i = 0; i < productJson.variants.length; i++) {
                        var checkVariant = productJson.variants[i];
                        if (checkVariant.option1 === option1Active && checkVariant.option2 === option2Active && checkVariant.available) {
                            // cần set ngay để không bị nháy ở giao diện
                            window.SOLID.store.dispatch("variant" + productJson.id, checkVariant);
                            currentCheckVariant_1 = checkVariant;
                            break;
                        }
                    }
                    // nếu không phải hide sold out variant và ko tìm được variant nào available thì tìm variant tồn tại
                    if (!_this.settings.hideSoldOutVariants && !currentCheckVariant_1) {
                        for (var i = 0; i < productJson.variants.length; i++) {
                            var checkVariant = productJson.variants[i];
                            if (checkVariant.option1 === option1Active && checkVariant.option2 === option2Active && checkVariant.id) {
                                // cần set ngay để không bị nháy ở giao diện
                                window.SOLID.store.dispatch("variant" + productJson.id, checkVariant);
                                currentCheckVariant_1 = checkVariant;
                                break;
                            }
                        }
                    }
                }
                // trg hợp sự kiện set variant sold out có nhiều func => đảm bảo func này chạy cuối
                setTimeout(function () {
                    (currentCheckVariant_1 === null || currentCheckVariant_1 === void 0 ? void 0 : currentCheckVariant_1.available) && window.SOLID.store.dispatch("variant" + productJson.id, currentCheckVariant_1);
                }, 10);
            }
        });
    };
    return GtVariantsStyleV2;
}());
/**
 * gtProductSwatchesColor
 * @param params params
 * @returns instance
 */
window.SOLID.library.gtVariantsStyleV2 = function (params) {
    return new GtVariantsStyleV2(params);
};


/***/ })
/******/ ]);
});
        }
        funcLib109();
      } catch(e) {
        console.error("Error lib id: 109" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcLib4 = function() {
          "use strict";

/* gtProductImageFeature */
(function (jQuery) {
  var gtProductFeatureImage = function (element, options) {
    var defaults = {
      classFeatureImage: null,
      classImages: null,
      carousel: null,
      owlCarousel: null,
    };

    this.settings = {};

    var $element = jQuery(element);
    var _this = this;
    var _productJson;

    this.init = function () {
      this.settings = jQuery.extend({}, defaults, options);

      var productJson = $element.closest("[keyword='product'], [data-keyword='product']").find(".ProductJson").text();

      try {
        if (productJson) {
          _productJson = JSON.parse(productJson);
        }
      } catch (e) {
        console.log(e);
      }

      if ($element.find(_this.settings.carousel) && $element.find(_this.settings.carousel).length) {
        $element.find(_this.settings.carousel).owlCarousel(_this.settings.owlCarousel);
      }

      _this.event();
      _this.listen();
    };
    this.event = function () {

    };
    this.listen = function () {
      var store = window.store;

      if (_productJson) {
        store.change("variant" + _productJson.id, function (variant) {
          if (variant && variant.variant_init) {
            return;
          }
          if (variant.featured_image && variant.featured_image.src) {
            var src = variant.featured_image.src;

            if (_this.settings.classFeatureImage) {
              $element.find(_this.settings.classFeatureImage).attr("src", src);
            }
            if (_this.settings.carousel) {
              for (var i = 0; i < $element.find(_this.settings.classImages).length; i++) {
                var $img = $element.find(_this.settings.classImages).eq(i);
                var id = $img.attr("data-id");

                if (id == variant.featured_image.id) {
                  if (_this.settings.carousel) {
                    $element.find(_this.settings.carousel).trigger("to.owl.carousel", [i, 200, true]);
                  }
                  break;
                }
              }
            }
          }
        });
      }
    };

    this.init();
  };

  jQuery.fn.gtProductFeatureImage = function (options) {
    return this.each(function () {
      var plugin = new gtProductFeatureImage(this, options, jQuery);

      jQuery(this).data("gtproductfeatureimage", plugin);
    });
  };
})(jQuery);

        }
        funcLib4();
      } catch(e) {
        console.error("Error lib id: 4" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcLib7 = function() {
          "use strict";

/* gtProductPrice */
(function (jQuery) {
  var gtProductPrice = function (element, options) {
    var defaults = {
      classCurrentPrice: null,
      classComparePrice: null,
      syncQuantityPrice: true, // if syncQuantityPrice is true, change quantity trigger change price
      syncQuantityComparePrice: true,
      replacePriceForCurrentPrice: true,
      replacePriceForComparePrice: true,
    };

    this.settings = {};

    var $element = jQuery(element).parent();
    var _this = this;
    var _productJson;

    this.init = function () {
      this.settings = jQuery.extend({}, defaults, options);

      var productJson = $element.closest("[keyword='product'], [data-keyword='product']").find(".ProductJson").text();

      try {
        if (productJson) {
          _productJson = JSON.parse(productJson);
          _this.Init();
          _this.listen();
        }
      } catch (e) {
        console.log(e);
      }
    };

    this.Init = function () {
      var priceDefaults = $element.find(_this.settings.classCurrentPrice).attr("data-currentprice");
      if (_this.settings.classCurrentPrice && _this.settings.replacePriceForCurrentPrice) {
        var price = _this.formatMoneyForSpecificPriceType(priceDefaults, "price");
        $element.find(_this.settings.classCurrentPrice).html(price);
      }
      if (_this.settings.classComparePrice && _this.settings.replacePriceForComparePrice) {
        var $comparePrice = $element.find(_this.settings.classComparePrice);
        if ($comparePrice && $comparePrice.length) {
          var comparePriceDefaults = $comparePrice.attr("data-currentprice");
          var comparePrice = _this.formatMoneyForSpecificPriceType(comparePriceDefaults, "comparePrice");
          // so sanh comparePrice với price, chỉ hiển thị comparePrice khi comparePrice > price
          if (comparePrice && (!_this.settings.classCurrentPrice || parseFloat(comparePriceDefaults) > parseFloat(priceDefaults))) {
            $comparePrice.addClass("gf_active");
            $comparePrice.addClass("gt_active");
            $comparePrice.html(comparePrice);
          }
        }
      }
    };

    this.listen = function () {
      var store = window.store;
      if (_productJson) {
        store.change("variant" + _productJson.id, function (variant) {
          var price = variant.price;
          price = _this.formatMoneyForSpecificPriceType(price, "price");
          if (_this.settings.classCurrentPrice && _this.settings.replacePriceForCurrentPrice) {
            var $currentPrice = $element.find(_this.settings.classCurrentPrice);
            // Trong trường hợp khi code section/addon muốn thay đổi giá trị và ko muốn tự update lại giá theo store thì thêm class dontChangePrice vào classCurrentPrice
            // VD: Tính năng Price Display Logic = Only each trong Bundle Section 9169
            if ($currentPrice && $currentPrice.length && !$currentPrice.hasClass("dontChangePrice")) {
              $currentPrice.html(price);
              $currentPrice.attr("data-currentprice", variant.price);
            }
          }

          if (_this.settings.classComparePrice && _this.settings.replacePriceForComparePrice) {
            var $comparePrice = $element.find(_this.settings.classComparePrice);
            if ($comparePrice && $comparePrice.length) {
              if (variant.compare_at_price && variant.compare_at_price - variant.price > 0) {
                var comparePrice = variant.compare_at_price;
                comparePrice = _this.formatMoneyForSpecificPriceType(comparePrice, "comparePrice");
                $comparePrice.addClass("gf_active");
                $comparePrice.addClass("gt_active");
                $comparePrice.html(comparePrice);
                $comparePrice.attr("data-currentprice", variant.compare_at_price);
              } else {
                $comparePrice.removeClass("gf_active");
                $comparePrice.removeClass("gt_active");
              }
            }
          }
        });

        store.change("quantity" + _productJson.id, function () {
          _this.Init();
        });
      }

      store.change("dataCurrency", function () {
        _this.Init();
      });
    };

    // Get price with quantity
    this.getPriceWithQuantity = function (price) {
      if (_productJson) {
        var quantityProduct = window.store.get("quantity" + _productJson.id);
        quantityProduct = Number(quantityProduct);
        if (!quantityProduct || isNaN(quantityProduct)) {
          quantityProduct = 1;
        }
        price = Number(price) * quantityProduct;
      }
      return price;
    };

    // Format price
    this.formatMoneyForSpecificPriceType = function (price, type) {
      if ((type === "price" && _this.settings.syncQuantityPrice) || (type === "comparePrice" && _this.settings.syncQuantityComparePrice)) {
        price = _this.getPriceWithQuantity(price);
      } else {
        price = Number(price);
      }
      var dataCurrency = window.store.get("dataCurrency");
      var format = __GemSettings.money;
      if (dataCurrency) {
        price = Shopify.gemFormatMoney(price, dataCurrency.currency, dataCurrency.data);
      } else {
        price = Shopify.formatMoney(price, format);
      }
      return price;
    };
    this.init();
  };

  jQuery.fn.gtProductPrice = function (options) {
    return this.each(function () {
      var plugin = new gtProductPrice(this, options, jQuery);
      jQuery(this).data("gtproductprice", plugin);
    });
  };
})(jQuery);

        }
        funcLib7();
      } catch(e) {
        console.error("Error lib id: 7" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcLib17 = function() {
          "use strict";
/* gfProductZoomImage */
(function (jQuery) {
  var GfProductZoomImage = function (element, options, $) {
    var defaults = {
      classHoverItem: null,
      scale: 1.5,
      htmlZoom: '<div class="gt_product-zoom"></div>',
      classSection: null,
    };

    this.settings = {};

    var $element = jQuery(element);
    var _this = this;
    var _url;
    var _$html;

    this.init = function () {
      const checkDevice = _this.getDeviceType();
      if (checkDevice !== "desktop") {
        return;
      }
      this.settings = jQuery.extend({}, defaults, options);
      var $itemHover = $element.closest(_this.settings.classHoverItem);

      if ($itemHover && $itemHover.length > 0) {
        var classElement = $itemHover.attr("class");
        // gt_product-image--feature gt_product-image
        var res = classElement.split(" ");

        if (_this.settings.classSection != null) {
          var cssClassName = "css-" + _this.settings.classSection;
          var css = '<style type="text/css" class="' + cssClassName + '">';

          css += _this.settings.classSection + " ." + res.join(".") + "{position:relative;overflow:hidden}";
          css += _this.settings.classSection + " .gt_product-zoom{display: none;position:absolute;top:0;left:0;width:100%;height:100%;background-color: #fff;background-repeat:no-repeat;background-position:center;background-size:cover;transition:transform .5s ease-out}";
          css += "</style>";
          if (!jQuery(cssClassName) || jQuery(cssClassName).length == 0) {
            jQuery("body").append(css);
          }
        }

        var $html = jQuery(_this.settings.htmlZoom);

        _$html = $html;
        if (!$itemHover.find(".gt_product-zoom") || $itemHover.find(".gt_product-zoom").length == 0) {
          $itemHover.append(_$html);
        }

        _this.event();
      }
    };

    this.event = function () {
      $element.closest(_this.settings.classHoverItem)
        .on("mouseover", function () {
          if (_this.settings.scale !== 1) {
            _url = $element.attr("src");
            _$html.css({
              display: "block",
              "background-image": "url(" + _url + ")",
              transform: "scale(" + _this.settings.scale + ")",
            });
            $element.css("opacity", 0);
          }
        })
        .on("mouseout", function () {
          if (_this.settings.scale !== 1) {
            _$html.css({
              transform: "scale(1)",
              display: "none",
            });
            $element.css("opacity", 1);
          }
        })
        .on("mousemove", function (e) {
          if (_this.settings.scale !== 1) {
            var $this = $(this);

            _$html.css({
              "transform-origin": ((e.pageX - $this.offset().left) / $this.width()) * 100 + "% " + ((e.pageY - $this.offset().top) / $this.height()) * 100 + "%",
              display: "block",
            });
            $element.css("opacity", 0);
          }
        });
    };

    this.getDeviceType = function() {
      var userAgent = navigator.userAgent;
      if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
        return "tablet";
      }
      if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|OperaM(obi|ini)/.test(userAgent)) {
        return "mobile";
      }
      return "desktop";
    }

    this.init();
  };

  jQuery.fn.gfProductZoomImage = function (options) {
    return this.each(function () {
      if (undefined == jQuery(this).data("gfproductZoomImage")) {
        var plugin = new GfProductZoomImage(this, options, jQuery);

        jQuery(this).data("gfproductzoomimage", plugin);
      }
    });
  };
})(jQuery);

        }
        funcLib17();
      } catch(e) {
        console.error("Error lib id: 17" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcLib8 = function() {
          "use strict";

/* gtProductButton */
(function (jQuery) {
  jQuery.gtProductButton = function (element, options) {
    var defaults = {
      type: null, //  null or ajax
      classText: null,
      button: null,
      TextSuccessfully: null,
      classTextSuccessfully: null,
      mode: "production",
      // loadingType: "filled" // "outlined"
    };

    this.settings = {};

    var $element = jQuery(element);
    var _this = this;
    var _productJson;

    this.init = function () {
      this.settings = jQuery.extend({}, defaults, options);
      var productJson = $element
        .closest("[keyword='product'], [data-keyword='product']")
        .find(".ProductJson")
        .text();

      try {
        if (productJson) {
          _productJson = JSON.parse(productJson);
        }
      } catch (e) {
        console.log(e);
      }
      _this.event();
      _this.listen();
    };
    this.event = function () {
      if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        // touchend only for iOS
        $element
          .find(_this.settings.classButton)
          .off("touchend.addtocartios")
          .on("touchend.addtocartios", addToCartHandler);
      } else {
        $element
          .find(_this.settings.classButton)
          .off("click.addtocart")
          .on("click.addtocart", addToCartHandler);
      }

      function addToCartHandler(e) {
        var addons = window.SOLID.store.getState("addons");
        var cartDrawer;

        if (addons && addons.cart_drawer) {
          cartDrawer = addons.cart_drawer;
        }
        if (_this.settings.type == "ajax" || cartDrawer) {
          e.preventDefault();
          if (!$element.data("isBuying")) {
            var $product = $element.closest("[keyword='product'], [data-keyword='product']");
            var $buttonAddToCart = jQuery(this);
            var heightBtnAddToCart = $buttonAddToCart.outerHeight();

            $buttonAddToCart.css("position", "relative");
            $buttonAddToCart.css("height", heightBtnAddToCart + "px");
            var $loading = jQuery(
              '<div class="atom-button-loading-circle-loader"><div class="atom-button-loading-check-mark atom-button-loading-check-mark-draw"></div></div>'
            );
            var $styleLoading = jQuery("head").find("#gt_add-to-cart-animation--loading");

            if (!$styleLoading || !$styleLoading.length) {
              $styleLoading = jQuery(
                "<style type=\"text/css\" id=\"gt_add-to-cart-animation--loading\">\n" +
                ".atom-button-loading-circle-loader {\n" +
                "  position: absolute;\n" +
                "  left: calc(50% - 0.5em);\n" +
                "  top: calc(50% - 0.5em);\n" +
                "  border: 2px solid rgba(0, 0, 0, 0);\n" +
                "  border-left-color: currentColor;\n" +
                "  border-bottom-color: currentColor;\n" +
                "  animation: loader-spin 0.6s infinite linear;\n" +
                "  vertical-align: top;\n" +
                "  border-radius: 50%;\n" +
                "  width: 1em;\n" +
                "  height: 1em;\n" +
                "  border-width: calc(1em / 10);\n" +
                "}\n" +
                "\n" +
                ".load-complete {\n" +
                "  -webkit-animation: none;\n" +
                "  animation: none;\n" +
                "  border-color: currentColor;\n" +
                "  transition: border 500ms ease-out;\n" +
                "}\n" +
                "\n" +
                ".atom-button-loading-check-mark {\n" +
                "  display: none;\n" +
                "}\n" +
                "\n" +
                ".atom-button-loading-check-mark.atom-button-loading-check-mark-draw:after {\n" +
                "  animation-duration: 800ms;\n" +
                "  animation-timing-function: ease;\n" +
                "  animation-name: atom-button-loading-check-mark;\n" +
                "  transform: scaleX(-1) rotate(135deg);\n" +
                "}\n" +
                "\n" +
                ".atom-button-loading-check-mark:after {\n" +
                "  opacity: 1;\n" +
                "  transform-origin: left top;\n" +
                "  border-right: 2px solid #fff;\n" +
                "  border-top: 2px solid #fff;\n" +
                "  border-color: currentColor;\n" +
                "  content: '';\n" +
                "  position: absolute;\n" +
                "  border-width: calc(1em / 10);\n" +
                "  width: calc(1em / 4);\n" +
                "  height: calc(1em / 2);\n" +
                "  left: calc(1em / 4 - 1em / 10);\n" +
                "  top: calc(1em / 2 - 1em / 16);\n" +
                "}\n" +
                "\n" +
                "@keyframes loader-spin {\n" +
                "  0% {\n" +
                "    transform: rotate(0deg);\n" +
                "  }\n" +
                "\n" +
                "  100% {\n" +
                "    transform: rotate(360deg);\n" +
                "  }\n" +
                "}\n" +
                "\n" +
                "@keyframes atom-button-loading-check-mark {\n" +
                "  0% {\n" +
                "    height: 0px;\n" +
                "    width: 0px;\n" +
                "    opacity: 1;\n" +
                "  }\n" +
                "\n" +
                "  20% {\n" +
                "    height: 0px;\n" +
                "    width: calc(1em / 4);\n" +
                "    opacity: 1;\n" +
                "  }\n" +
                "\n" +
                "  40% {\n" +
                "    height: calc(1em / 2);\n" +
                "    width: calc(1em / 4);\n" +
                "    opacity: 1;\n" +
                "  }\n" +
                " \n" +
                "  100% {\n" +
                "    height: calc(1em / 2);\n" +
                "    width: calc(1em / 4);\n" +
                "    opacity: 1;\n" +
                "  }\n" +
                "}\n" +
                "</style>"
              );
              jQuery("head").append($styleLoading);
            }
            var $cacheButtonHtml = $buttonAddToCart.html();

            $buttonAddToCart.html($loading);
            $element.data("isBuying", true);
            var $form = $element.closest("form");

            window.gfTheme.addItemFromForm($form, function (item, form, error) {
              window.store.update("addToCart", item);
              if (error) {
                try {
                  var responseText = JSON.parse(error.responseText);

                  if (responseText && responseText.description) {
                    // eslint-disable-next-line no-alert
                    alert(responseText.description);
                  }
                } catch (e) {
                  console.log(e);
                }
                $buttonAddToCart.css("position", "");
                $buttonAddToCart.css("height", "");
                $buttonAddToCart.html($cacheButtonHtml);
                $element.data("isBuying", false);
              } else {
                if (
                  _this.settings.classTextSuccessfully &&
                  _this.settings.TextSuccessfully
                ) {
                  $product
                    .find(_this.settings.classTextSuccessfully)
                    .text(_this.settings.TextSuccessfully);
                } else {
                  var $loadingEl = $buttonAddToCart.find(
                    ".atom-button-loading-circle-loader"
                  );

                  clearTimeout(window.timeoutLoading);
                  /* display tick button */
                  $loadingEl.addClass("load-complete");
                  $loadingEl
                    .find(".atom-button-loading-check-mark")
                    .css("display", "block");
                  /* remove tick button and display text*/
                  window.timeoutLoading = setTimeout(function () {
                    $buttonAddToCart.css("position", "");
                    $buttonAddToCart.css("height", "");
                    $buttonAddToCart.html($cacheButtonHtml);
                    $element.data("isBuying", false);
                  }, 2000);
                }
                if (cartDrawer) {
                  // mo cart drawer thi cartPopup = "cart_drawer"
                  window.SOLID.store.dispatch("openCartPopup", "cart_drawer");
                }
              }
            }, true);
          }
          return false;
        }
      }
    };
    this.listen = function () {
      var store = window.store;

      if (_productJson) {
        var currentVariant = store.get("variant" + _productJson.id);

        if (!currentVariant.available) {
          $element.find(_this.settings.classButton).attr("disabled", true);
        } else {
          $element.find(_this.settings.classButton).attr("disabled", false);
        }

        store.change("variant" + _productJson.id, function (variant) {
          if (variant.available) {
            $element.removeClass("gf_soldout");
            $element.removeClass("gt_soldout");
            var textAddToCart = $element.attr("data-addtocart");

            if (_this.settings.classText) {
              $element.find(_this.settings.classText).html(textAddToCart);
            }

            if (_this.settings.classButton) {
              $element.find(_this.settings.classButton).attr("disabled", false);
            }
          } else {
            $element.addClass("gf_soldout");
            $element.addClass("gt_soldout");
            var text = $element.attr("data-soldout");

            if (_this.settings.classText) {
              $element.find(_this.settings.classText).html(text);
            }

            if (_this.settings.classButton && _this.settings.mode === "production") {
              $element.find(_this.settings.classButton).attr("disabled", true);
            }
          }
        });
      }
    };
    this.init();
  };

  jQuery.fn.gtProductButton = function (options) {
    return this.each(function () {
      var plugin = new jQuery.gtProductButton(this, options, jQuery);

      jQuery(this).data("gtproductbutton", plugin);
    });
  };
})(jQuery);

        }
        funcLib8();
      } catch(e) {
        console.error("Error lib id: 8" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcLib14 = function() {
          "use strict";

(function (jQuery) {
  var gtParallax = function (element, options) {
    // Khai bao cac tham so mac dinh trong biet *default*
    var defaults = {
      classBackgroundImage: null,
    };

    this.settings = {};
    var $element = jQuery(element);
    var _this = this;

    this.init = function () {
      this.settings = jQuery.extend({}, defaults, options);
      // Init parallax no transtion
      _this.refreshDrag();

      // Event scroll
      _this.parallaxIt();
    };
    this.parallaxIt = function () {
      var $fwindow = jQuery(window);
      var yPos = 0;
      var xPos = "50%";

      $fwindow.on("scroll.gtparallax resize.gtparallax", function () {
        _this.calcBackground(xPos, yPos);
      });
      jQuery("body").on("scroll.gtparallax resize.gtparallax", function () {
        _this.calcBackground(xPos, yPos);
      });
    };

    this.refreshDrag = function () {
      var yPos = 0;
      var xPos = "50%";
      _this.calcBackground(xPos, yPos);
    };

    this.calcBackground = function (xPos, yPos) {
      var $fwindow = jQuery(window);
      var $image = $element.find(_this.settings.classBackgroundImage);
      var speed = _this.settings.speed || 0.2;

      if ($fwindow.width() >= 992 && !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        if (speed == 1) {
          $image.css({
            backgroundPosition: xPos + " " + yPos + "vh",
            "background-attachment": "fixed",
            "-webkit-backface-visibility": "hidden",
            transition: "all 0.15s",
          });
        } else {
          $image.css({
            backgroundPosition: xPos + " " + yPos + "vh",
            "background-attachment": "fixed",
            "-webkit-backface-visibility": "hidden",
            transition: "all 0.15s",
          });
        }
      } else {
        $image.css({
          "backgroundPosition": "",
          "background-attachment": "",
          "-webkit-backface-visibility": "",
        });
      }
    };
    
    this.init();
  };

  jQuery.fn.gtParallax = function (options) {
    return this.each(function () {
      var plugin = new gtParallax(this, options);

      jQuery(this).data("gtparallax", plugin);
    });
  };
})(jQuery);

        }
        funcLib14();
      } catch(e) {
        console.error("Error lib id: 14" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcLib107 = function() {
          (function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["webpackNumbers"] = factory();
	else
		root["webpackNumbers"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ({

/***/ 5:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * GtProductImagesV2
 */
var GtProductImagesV2 = /** @class */ (function () {
    /**
     * constructor
     * @param params setting truyen vao thu vien
     */
    function GtProductImagesV2(params) {
        this.$element = $(params.$element);
        this.settings = __assign(__assign({}, this.settings), params.settings);
        this.init();
    }
    /**
     * init ham khoi tao thu vien
     */
    GtProductImagesV2.prototype.init = function () {
        var productJson = this.$element.closest("[keyword='product'], [data-keyword='product']").find(".ProductJson").text();
        try {
            if (productJson) {
                this._productJson = JSON.parse(productJson);
            }
        }
        catch (e) {
            console.log("error: ", e);
        }
        this.clearActiveImage();
        this.initSwiperSlide();
        this.setCurrentVariant();
        this.event();
        this.listen();
    };
    /**
     * Khởi tạo thư viện swiper slide
     */
    GtProductImagesV2.prototype.initSwiperSlide = function () {
        var _this_1 = this;
        var _a, _b;
        var carousel = this.$element.find(this.settings.classSwiperContainer);
        var productImagesSwiper;
        if (carousel && carousel.length) {
            this.$carousel = carousel[0];
            if (this.$carousel.swiper) {
                this.$carousel.swiper.destroy();
            }
            productImagesSwiper = new window.Swiper(this.$carousel, this.settings.swiperSetting);
        }
        var $featureCarousel = this.$element.find(this.settings.classFeatureSwiperContainer);
        if (this.settings.featureSwiperSetting && $featureCarousel && $featureCarousel.length) {
            if ($featureCarousel && $featureCarousel.length) {
                if (productImagesSwiper) {
                    this.settings.featureSwiperSetting.thumbs = {
                        swiper: productImagesSwiper,
                    };
                }
                var cacheEventImageReady_1 = (_b = (_a = this.settings.featureSwiperSetting) === null || _a === void 0 ? void 0 : _a.once) === null || _b === void 0 ? void 0 : _b.imagesReady;
                this.settings.featureSwiperSetting.once = {
                    imagesReady: function () {
                        if (cacheEventImageReady_1) {
                            cacheEventImageReady_1();
                        }
                        _this_1.activeProductImageByFeatureImage($featureCarousel);
                    },
                };
                this.$featureCarousel = $featureCarousel[0];
                // neu co roi thi destroy
                if (this.$featureCarousel.swiper) {
                    this.$featureCarousel.swiper.destroy();
                }
                // khoi tao swiper
                var featureSwiper = new window.Swiper(this.$featureCarousel, this.settings.featureSwiperSetting);
                // them su kien change slide cho product img swiper
                this.eventFeatureSwiper(featureSwiper, $featureCarousel);
            }
        }
        else {
            if (carousel && carousel.length) {
                var imageId = this.$element.find(this.settings.classFeatureImage).attr("data-id");
                this.activeImage(imageId);
            }
            // if(this.settings.initShowFeatureImage) {
            // }
        }
    };
    /**
     * onProductImageSlideChange: sự kiện thay đổi slide của swiper cho product imgs
     * @param swiper swiper can them su kien
     * @param $carousel carousel can them su kien
     */
    GtProductImagesV2.prototype.eventFeatureSwiper = function (swiper, $carousel) {
        var _this_1 = this;
        swiper.on("slideChangeTransitionEnd", function () {
            _this_1.activeProductImageByFeatureImage($carousel);
        });
    };
    /**
     * activeProductImageByFeatureImage: thay đổi slide active ở imageList theo feature image swiper
     * @param $carousel $featureCarousel
     */
    GtProductImagesV2.prototype.activeProductImageByFeatureImage = function ($carousel) {
        var $imageActive = $carousel.find(".swiper-slide.swiper-slide-active img");
        var imageId = $imageActive.attr("data-id");
        this.updateStoreVariantByImageID(imageId);
        this.activeImage(imageId);
    };
    /**
     * Lấy dữ liệu gtCurrentVariant ID đã được cache
     */
    GtProductImagesV2.prototype.setCurrentVariant = function () {
        var _this_1 = this;
        if (this._productJson) {
            var variantIDCache = this.getVariantIDCacheByDom();
            if (variantIDCache) {
                this._variantID = variantIDCache;
                var storeVariant = window.SOLID.store.getState("variant" + this._productJson.id);
                if (storeVariant && storeVariant.id == this._variantID && storeVariant.variant_init) {
                    return;
                }
                else {
                    var variantData = this._productJson.variants.find(function (item) {
                        return Number(item.id) === Number(_this_1._variantID);
                    });
                    if (variantData) {
                        try {
                            var newVariant = JSON.parse(JSON.stringify(variantData));
                            // eslint-disable-next-line camelcase
                            newVariant.variant_init = true;
                            window.SOLID.store.dispatch("variant" + this._productJson.id, newVariant);
                        }
                        catch (e) {
                            console.log(e);
                        }
                    }
                }
            }
        }
    };
    /**
     * event
     */
    GtProductImagesV2.prototype.event = function () {
        // Click to image item in slide image
        if (this.settings.classSwiperItemsImage) {
            var $carouseItemImages_1 = this.$element.find(this.settings.classSwiperItemsImage);
            var _this_2 = this;
            $carouseItemImages_1.off("click.selectImage").on("click.selectImage", function () {
                var $img = jQuery(this);
                var imageId = $img.attr("data-id");
                var imageUrl = $img.attr("src");
                $carouseItemImages_1.removeClass("gt_active");
                $img.addClass("gt_active");
                _this_2.updateFeatureImage(imageUrl, imageId);
                _this_2.updateStoreVariantByImageID(imageId);
            });
        }
        // Click to feature arrow
        if (this.settings.classFeatureArrow) {
            var $featureArrow = this.$element.find(this.settings.classFeatureArrow);
            var _this_3 = this;
            if ($featureArrow && $featureArrow.length) {
                $featureArrow.off("click.imageArrow").on("click.imageArrow", function () {
                    var isLeftArrow = $(this).hasClass("gt_product-img-nav--left");
                    var $currentActiveImage = $(_this_3.$carousel).find(".swiper-slide img.gt_active");
                    if (!$currentActiveImage || !$currentActiveImage.length) {
                        return;
                    }
                    var index = $currentActiveImage.closest(".swiper-slide").attr("aria-label").split(" / ");
                    var currentIndex = parseInt(index[0]);
                    var total = parseInt(index[1]);
                    if (isLeftArrow) {
                        currentIndex = currentIndex == 1 ? total : currentIndex - 1;
                    }
                    else {
                        currentIndex = currentIndex == total ? 1 : currentIndex + 1;
                    }
                    var newIndex = currentIndex + " / " + total;
                    var $newActiveImage = $(_this_3.$carousel).find(".swiper-slide[aria-label='" + newIndex + "'] img");
                    if ($newActiveImage && $newActiveImage.length) {
                        $newActiveImage.trigger("click");
                        _this_3.$carousel.swiper.slideTo(currentIndex - 1, 200, true);
                    }
                });
            }
        }
    };
    /**
     * listen
     */
    GtProductImagesV2.prototype.listen = function () {
        var _this_1 = this;
        var store = window.SOLID.store;
        if (this._productJson && this._productJson.id) {
            store.subscribe("variant" + this._productJson.id, function (variant) {
                if (variant && variant.variant_init &&
                    (_this_1.settings.initShowFeatureImage || _this_1.settings.initShow3DModel || _this_1.settings.initShowExVideo || _this_1.settings.initShowOtherVideo)) {
                    return;
                }
                _this_1.updateDataCacheAttr(variant.id);
                _this_1.updateImage(variant);
            });
        }
    };
    /**
     * getVariantIDCacheByDom
     * @returns current variant id
     */
    GtProductImagesV2.prototype.getVariantIDCacheByDom = function () {
        var variantID = this.$element.attr("data-variant-id") || "";
        return variantID;
    };
    /**
     * Cập nhật variant id trong attr của element khi giá trị store variant thay đổi
     * @param variantID current variant id
     */
    GtProductImagesV2.prototype.updateDataCacheAttr = function (variantID) {
        var dataCache = this.$element.attr("data-variant-id");
        if (dataCache && variantID) {
            this.$element.attr("data-variant-id", variantID);
        }
    };
    /**
     * Cập nhật new variant
     * @param imageId id của image đang được active
     */
    GtProductImagesV2.prototype.updateStoreVariantByImageID = function (imageId) {
        var variants = [];
        if (this._productJson) {
            try {
                variants = this._productJson.variants;
            }
            catch (e) {
                console.log(e);
            }
        }
        if (variants.length) {
            var beforeActiveVariant_1 = window.SOLID.store.getState("variant" + this._productJson.id);
            // check variant hiện tại có feature image là imageid cần check hay không
            var beforeVariantHasImageId = variants.find(function (item) { var _a, _b; return String(item.id) === String(beforeActiveVariant_1 === null || beforeActiveVariant_1 === void 0 ? void 0 : beforeActiveVariant_1.id) && (((_a = item === null || item === void 0 ? void 0 : item.featured_media) === null || _a === void 0 ? void 0 : _a.id) == imageId || ((_b = item === null || item === void 0 ? void 0 : item.featured_image) === null || _b === void 0 ? void 0 : _b.id) == imageId); });
            if (beforeVariantHasImageId) {
                return;
            }
            // find variant with image id
            var currentVariant = variants.find(function (item) { return item.featured_image && item.featured_image.id && item.featured_image.id == imageId; });
            if (!currentVariant) {
                // nếu không tìm thấy theo imageId thì tìm theo mediaId
                currentVariant = variants.find(function (item) { return item.featured_media && item.featured_media.id == imageId; });
            }
            if (String(currentVariant === null || currentVariant === void 0 ? void 0 : currentVariant.id) === String(beforeActiveVariant_1 === null || beforeActiveVariant_1 === void 0 ? void 0 : beforeActiveVariant_1.id)) {
                return;
            }
            if (currentVariant) {
                window.SOLID.store.dispatch("variant" + this._productJson.id, currentVariant);
            }
        }
    };
    /**
     * Cập nhật ảnh của feature image theo ảnh đang được active trong slider image
     * @param url link ảnh đang được active trong slide images
     * @param imageId id cua feature image active
     * @param mediaId id cua feature media active
     */
    GtProductImagesV2.prototype.updateFeatureImage = function (url, imageId, mediaId) {
        if (!this.settings.featureSwiperSetting) {
            url = this.replaceImageToSize(url, "");
            if (this.settings.classFeatureImage) {
                this.$element.find(this.settings.classFeatureImage).attr("src", url);
            }
        }
        else {
            var $carouselFeatureImages = this.$element.find(this.settings.classFeatureSwiperItemsImage);
            var $carouselFeatureImageActive = this.$element.find(this.settings.classFeatureSwiperItemsImage + "[data-id=\"" + imageId + "\"]");
            if ($carouselFeatureImages && $carouselFeatureImageActive && $carouselFeatureImages.length && $carouselFeatureImageActive.length) {
                var indexActive = $carouselFeatureImages.index($carouselFeatureImageActive);
                this.$featureCarousel.swiper.slideTo(indexActive, 200, true);
            }
            else {
                // nếu không tìm thấy imageId thì tìm theo mediaId
                var $carouselFeatureMediaActive = this.$element.find(this.settings.classFeatureSwiperItemsImage + "[data-id=\"" + mediaId + "\"]");
                if ($carouselFeatureImages && $carouselFeatureMediaActive && $carouselFeatureImages.length && $carouselFeatureMediaActive.length) {
                    var indexActive = $carouselFeatureImages.index($carouselFeatureMediaActive);
                    this.$featureCarousel.swiper.slideTo(indexActive, 200, true);
                }
            }
        }
    };
    /**
     * Cập nhật lại trạng thái active của slide và feature image với variant tương ứng
     * @param variant dữ liệu của variant đang select
     */
    GtProductImagesV2.prototype.updateImage = function (variant) {
        var _a, _b;
        if (!this._productJson)
            return;
        if (!variant)
            variant = window.SOLID.store.getState("variant" + this._productJson.id);
        if (!variant || !variant.featured_image || !variant.featured_image.src || !this.settings.classSwiperItemsImage) {
            return;
        }
        this.updateFeatureImage(variant.featured_image.src, variant.featured_image.id, (_a = variant.featured_media) === null || _a === void 0 ? void 0 : _a.id);
        this.activeImage(variant.featured_image.id, (_b = variant.featured_media) === null || _b === void 0 ? void 0 : _b.id);
    };
    /**
     * active and scroll to image active
     * @param imageId  featured_image id current variant selected
     * @param mediaId  featured_media id current variant selected
     */
    GtProductImagesV2.prototype.activeImage = function (imageId, mediaId) {
        var $carouselImages = this.$element.find(this.settings.classSwiperItemsImage);
        var _this = this;
        var isFindActiveImage = false;
        $carouselImages.each(function (index) {
            $(this).removeClass("gt_active");
            $(this).removeClass("gf_active");
            var id = $(this).attr("data-id");
            if (id == imageId && _this.settings.swiperSetting) {
                _this.$carousel.swiper.slideTo(index, 200, true);
                $(this).addClass("gt_active");
                $(this).addClass("gf_active");
                isFindActiveImage = true;
            }
        });
        // support với media nếu không tìm thấy imageId
        if (!isFindActiveImage) {
            $carouselImages.each(function (index) {
                $(this).removeClass("gt_active");
                $(this).removeClass("gf_active");
                var id = $(this).attr("data-id");
                if (id == mediaId && _this.settings.swiperSetting) {
                    _this.$carousel.swiper.slideTo(index, 200, true);
                    $(this).addClass("gt_active");
                    $(this).addClass("gf_active");
                }
            });
        }
    };
    /**
     * clearActiveImage
     */
    GtProductImagesV2.prototype.clearActiveImage = function () {
        var $carouselImages = this.$element.find(this.settings.classSwiperItemsImage);
        $carouselImages.each(function () {
            $(this).removeClass("gt_active");
            $(this).removeClass("gf_active");
        });
    };
    /**
     * Kiểm tra xem có phải link ảnh trên shopify app hay ko
     * @param url link ảnh
     * @returns true or false
     */
    GtProductImagesV2.prototype.hasImageShopify = function (url) {
        if (!url || url == "") {
            return false;
        }
        if (url.indexOf("cdn.shopify.com/s/files/") != -1) {
            return true;
        }
        else if (url.indexOf("apps.shopifycdn.com/") != -1) {
            return true;
        }
        return false;
    };
    /**
     * replaceImageToSize
     * @param url link image
     * @param expectImageSize expectImageSize
     * @returns string
     */
    GtProductImagesV2.prototype.replaceImageToSize = function (url, expectImageSize) {
        if (expectImageSize == undefined || expectImageSize == null) {
            return url;
        }
        if (this.hasImageShopify(url)) {
            var ignore = ["jfif"];
            var params = "";
            var splitParams = url.split("?");
            if (splitParams && splitParams.length && splitParams.length >= 2) {
                params = splitParams[1];
            }
            var arrImage = splitParams[0].split("/").pop();
            var slugName = arrImage.split(".");
            var strExtention = slugName.pop();
            if (ignore.indexOf(strExtention) !== -1) {
                return url;
            }
            var nameImage = slugName.join(".");
            var arrayNames = nameImage.split("_");
            if (arrayNames && arrayNames.length >= 2) {
                var sizeCurrent = arrayNames.pop();
                var reg = new RegExp(/(\d+)x(\d+)|(\d+)x|x(\d+)/, "gm");
                if (sizeCurrent && reg.test(sizeCurrent)) {
                    var trimReg = sizeCurrent.replace(reg, "");
                    if (trimReg == "") {
                        var nameImages = nameImage.split("_");
                        nameImages.pop();
                        nameImage = nameImages.join("_");
                    }
                }
            }
            var srcImageSplit = url.split("?")[0].split("/");
            var smallSrc = "";
            for (var j = 0; j < srcImageSplit.length - 1; j++) {
                smallSrc += srcImageSplit[j] + "/";
            }
            if (expectImageSize) {
                url = smallSrc + nameImage + "_" + expectImageSize + "." + strExtention;
            }
            else {
                url = smallSrc + nameImage + "." + strExtention;
            }
            if (params) {
                url = url + "?" + params;
            }
        }
        return url;
    };
    return GtProductImagesV2;
}());
/**
 * gtProductImagesV2
 * @param params setting lib product gtProductImagesV2
 * @returns gtProductImagesV2
 */
window.SOLID.library.gtProductImagesV2 = function (params) {
    return new GtProductImagesV2(params);
};
exports.default = {};


/***/ })

/******/ });
});

        }
        funcLib107();
      } catch(e) {
        console.error("Error lib id: 107" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcLib106 = function() {
          (function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["webpackNumbers"] = factory();
	else
		root["webpackNumbers"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ({

/***/ 4:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * GtProductQuantityV2
 */
var GtProductQuantityV2 = /** @class */ (function () {
    /**
     * constructor
     * @param params settings class and element
     */
    function GtProductQuantityV2(params) {
        this.$element = $(params.$element);
        this.classInput = params.settings.classInput;
        this.classPlus = params.settings.classPlus;
        this.classMinus = params.settings.classMinus;
        this.mode = params.settings.mode || "production";
        this.init();
    }
    /* private methods */
    /**
     * init: function khoi tao lib
     */
    GtProductQuantityV2.prototype.init = function () {
        var productJson = this.$element.closest("[keyword='product'], [data-keyword='product']").find(".ProductJson").text();
        try {
            if (productJson) {
                this._productJson = JSON.parse(productJson);
            }
        }
        catch (e) {
            console.log("error: ", e);
        }
        this.event();
        this.listen();
    };
    /**
     * event: thêm sự kiện click cho các variants
     */
    GtProductQuantityV2.prototype.event = function () {
        var _this = this;
        if (this._productJson) {
            if (this.classMinus) {
                this.$element
                    .find(this.classMinus)
                    .off("click.minus")
                    .on("click.minus", function () {
                    if (!_this.$element.hasClass("gt_soldout")) {
                        var value = _this.$element.find(_this.classInput).val();
                        value = parseInt(value) - 1;
                        if (value <= 1) {
                            value = 1;
                        }
                        _this.$element.find(_this.classInput).attr("value", value).val(value);
                        window.SOLID.store.dispatch("quantity" + _this._productJson.id, value);
                    }
                });
            }
            if (this.classPlus) {
                this.$element
                    .find(this.classPlus)
                    .off("click.plus")
                    .on("click.plus", function () {
                    if (!_this.$element.hasClass("gt_soldout")) {
                        var value = _this.$element.find(_this.classInput).val();
                        value = parseInt(value) + 1;
                        if (value <= 1) {
                            value = 1;
                        }
                        _this.$element.find(_this.classInput).attr("value", value).val(value);
                        window.SOLID.store.dispatch("quantity" + _this._productJson.id, value);
                    }
                });
            }
            if (this.classInput) {
                var $input = this.$element.find(this.classInput);
                if (this.mode !== "production") {
                    var quantityStore = window.SOLID.store.getState("quantity" + this._productJson.id) || 1;
                    $input.val(quantityStore);
                }
                $input.off("change.inputQuantity").on("change.inputQuantity", function (e) {
                    var $target = $(e.currentTarget);
                    var quantity = $target.val();
                    if (quantity == 0) {
                        $target.val(1);
                        quantity = 1;
                    }
                    window.SOLID.store.dispatch("quantity" + _this._productJson.id, quantity);
                });
            }
        }
    };
    /**
     * listen: lắng nghe khi có variant active thay đổi
     */
    GtProductQuantityV2.prototype.listen = function () {
        var _this = this;
        var store = window.SOLID.store;
        if (this._productJson) {
            store.subscribe("variant" + this._productJson.id, function (variant) {
                _this.updateDataCacheAttr(variant.id);
                if (variant.available) {
                    _this.$element.removeClass("gf_soldout");
                    _this.$element.removeClass("gt_soldout");
                    if (_this.classInput) {
                        _this.$element.find(_this.classInput).removeAttr("disabled");
                    }
                }
                else {
                    // Nếu là soldout update quantity về 1 và disable input thay đổi quantity
                    _this.$element.addClass("gf_soldout");
                    _this.$element.addClass("gt_soldout");
                    window.SOLID.store.dispatch("quantity" + _this._productJson.id, 1);
                    if (_this.classInput) {
                        jQuery(_this.classInput).attr("value", 1).val(1);
                        _this.$element.find(_this.classInput).attr("disabled", "disabled");
                    }
                }
            });
            store.subscribe("quantity" + this._productJson.id, function (quantity) {
                _this.$element.find(_this.classInput).attr("value", quantity).val(quantity);
            });
        }
    };
    /**
     * Cập nhật variant id trong attr của element khi giá trị store variant thay đổi
     * @param variantID current variant id
     */
    GtProductQuantityV2.prototype.updateDataCacheAttr = function (variantID) {
        var dataCache = this.$element.attr("data-variant-id");
        if (dataCache && variantID) {
            this.$element.attr("data-variant-id", variantID);
        }
    };
    return GtProductQuantityV2;
}());
/**
 * gtProductQuantity
 * @param params setting lib product quantity
 * @returns gtProductQuantity
 */
window.SOLID.library.gtProductQuantityV2 = function (params) {
    return new GtProductQuantityV2(params);
};
exports.default = {};


/***/ })

/******/ });
});
        }
        funcLib106();
      } catch(e) {
        console.error("Error lib id: 106" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcLib108 = function() {
          (function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["webpackNumbers"] = factory();
	else
		root["webpackNumbers"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ({

/***/ 10:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * GtProductSaveV2
 */
var GtProductSaveV2 = /** @class */ (function () {
    /**
     * constructor
     * @param params setting truyen vao thu vien
     */
    function GtProductSaveV2(params) {
        this.$element = $(params.$element);
        this.settings = {
            roundNoZeroes: false,
            roundPercent: 0,
            classTextPercent: "",
            classTextNumber: "",
            dataFormat: "",
            dataFormatKey: "",
            customCurrencyFormat: "",
        };
        this.settings = __assign(__assign({}, this.settings), params.settings);
        this.init();
    }
    /**
     * init ham khoi tao thu vien
     */
    GtProductSaveV2.prototype.init = function () {
        var productJson = this.$element
            .closest("[keyword='product'], [data-keyword='product']")
            .find(".ProductJson")
            .text();
        try {
            if (productJson) {
                this._productJson = JSON.parse(productJson);
            }
        }
        catch (e) {
            console.log("error: ", e);
        }
        this.setCurrentVariant();
        this.listen();
    };
    /**
     * Lấy dữ liệu gtCurrentVariant ID đã được cache
     */
    GtProductSaveV2.prototype.setCurrentVariant = function () {
        var _this = this;
        if (this._productJson) {
            var variantIDCache = this.getVariantIDCacheByDom();
            if (variantIDCache) {
                this._variantID = Number(variantIDCache);
                var storeVariant = window.SOLID.store.getState("variant" + this._productJson.id);
                if (storeVariant &&
                    storeVariant.id == this._variantID &&
                    storeVariant.variant_init) {
                    this.setPriceWithVariant(storeVariant);
                    return;
                }
                else {
                    var variantData = this._productJson.variants.find(function (item) { return item.id === _this._variantID; });
                    if (variantData) {
                        try {
                            var newVariant = JSON.parse(JSON.stringify(variantData));
                            this.setPriceWithVariant(newVariant);
                            // eslint-disable-next-line camelcase
                            newVariant.variant_init = true;
                            window.SOLID.store.dispatch("variant" + this._productJson.id, newVariant);
                        }
                        catch (e) {
                            console.log(e);
                        }
                    }
                }
            }
        }
    };
    /**
     * listen
     */
    GtProductSaveV2.prototype.listen = function () {
        var _this = this;
        var store = window.SOLID.store;
        if (this._productJson && this._productJson.id) {
            store.subscribe("variant" + this._productJson.id, function (variant) {
                if (variant && variant.variant_init) {
                    return;
                }
                _this.updateDataCacheAttr(variant.id);
                _this.setPriceWithVariant(variant);
            });
            store.subscribe("quantity" + this._productJson.id, function () {
                var variant = window.store.get("variant" + _this._productJson.id);
                if (variant && variant.id) {
                    _this.setPriceWithVariant(variant);
                }
            });
            store.subscribe("dataCurrency", function () {
                var variant = window.store.get("variant" + _this._productJson.id);
                if (variant && variant.id) {
                    _this.setPriceWithVariant(variant);
                }
            });
        }
    };
    /**
     * getVariantIDCacheByDom
     * @returns current variant id
     */
    GtProductSaveV2.prototype.getVariantIDCacheByDom = function () {
        var variantID = this.$element.attr("data-variant-id") || "";
        return variantID;
    };
    /**
     * Cập nhật variant id trong attr của element khi giá trị store variant thay đổi
     * @param variantID current variant id
     */
    GtProductSaveV2.prototype.updateDataCacheAttr = function (variantID) {
        var dataCache = this.$element.attr("data-variant-id");
        if (dataCache && variantID) {
            this.$element.attr("data-variant-id", variantID);
        }
    };
    /**
     * setPriceWithVariant
     * @param variant variant
     */
    GtProductSaveV2.prototype.setPriceWithVariant = function (variant) {
        if (variant.compare_at_price &&
            variant.price &&
            variant.compare_at_price > variant.price) {
            this.$element.addClass("gt_active");
            // Giá giảm theo %
            if (this.settings.classTextPercent) {
                var $number = this.$element.find(this.settings.classTextPercent);
                var number = this.getPercentDiscount(variant.price, variant.compare_at_price);
                $number.html(number);
            }
            // Giá giảm theo sổ tiền
            if (this.settings.classTextNumber) {
                var $price = this.$element.find(this.settings.classTextNumber);
                var diff = variant.compare_at_price - variant.price;
                var diffFormat = this.formatMoneyPlugin(diff);
                $price.html(diffFormat);
            }
        }
        else {
            this.$element.removeClass("gt_active");
        }
    };
    /**
     * Format Money
     * @param price price
     * @returns Format Money
     */
    GtProductSaveV2.prototype.formatMoneyPlugin = function (price) {
        price = this.getPriceWithQuantity(price);
        var dataCurrency = window.store.get("dataCurrency");
        var format = window.__GemSettings.money;
        var priceFormat = price.toString();
        if (!dataCurrency) {
            // default shopify format
            priceFormat = window.Shopify.formatMoney(price, format);
        }
        else {
            // ES addon auto currency converter
            var notApplyRoundDecimal = true; // no apply round decimal for save money
            priceFormat = window.Shopify.gemFormatMoney(price, dataCurrency.currency, dataCurrency.data, this.settings.customCurrencyFormat, notApplyRoundDecimal);
        }
        if (this.settings.dataFormat && this.settings.dataFormatKey) {
            priceFormat = this.settings.dataFormat.replace(this.settings.dataFormatKey, priceFormat);
        }
        return priceFormat;
    };
    /**
     * getPriceWithQuantity
     * @param price price
     * @returns price
     */
    GtProductSaveV2.prototype.getPriceWithQuantity = function (price) {
        if (this._productJson) {
            var quantityProduct = window.store.get("quantity" + this._productJson.id);
            quantityProduct = Number(quantityProduct);
            if (!quantityProduct || isNaN(quantityProduct)) {
                quantityProduct = 1;
            }
            price = Number(price) * quantityProduct;
        }
        return price;
    };
    /**
     * trả về phần trăm giảm giá
     * @param price giá bán
     * @param comparePrice giá gốc
     * @returns trăm giảm giá
     */
    GtProductSaveV2.prototype.getPercentDiscount = function (price, comparePrice) {
        var diff = comparePrice - price;
        diff = diff / comparePrice;
        diff = diff * 100;
        var diffString = diff.toString();
        if (this.settings.roundNoZeroes) {
            diffString = this.roundTo(diff, this.settings.roundPercent);
        }
        else {
            diffString = diff.toFixed(this.settings.roundPercent);
        }
        diffString += "%";
        if (this.settings.dataFormat && this.settings.dataFormatKey) {
            diffString = this.settings.dataFormat.replace(this.settings.dataFormatKey, diffString);
        }
        return diffString;
    };
    /**
     * Làm tròn số tới hàng thập phân thứ n bỏ O ở cuối string nếu có
     * @param n giá trị cần làm tròn
     * @param digits Làm tròn số tới hàng thập phân thứ
     * @returns string
     */
    GtProductSaveV2.prototype.roundTo = function (n, digits) {
        if (digits === undefined) {
            digits = 0;
        }
        var multiplicator = Math.pow(10, digits);
        n = parseFloat((n * multiplicator).toFixed(11));
        var test = Math.round(n) / multiplicator;
        return test.toFixed(digits);
    };
    return GtProductSaveV2;
}());
/**
 * gtProductSaveV2
 * @param params setting lib product gtProductSaveV2
 * @returns gtProductSaveV2
 */
window.SOLID.library.gtProductSaveV2 = function (params) {
    return new GtProductSaveV2(params);
};
exports.default = {};


/***/ })

/******/ });
});
        }
        funcLib108();
      } catch(e) {
        console.error("Error lib id: 108" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcLib105 = function() {
          (function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["webpackNumbers"] = factory();
	else
		root["webpackNumbers"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ({

/***/ 6:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * GtProductSwatchesV2
 */
var GtProductSwatchesV2 = /** @class */ (function () {
    /**
     * constructor
     * @param params settings class and element
     */
    function GtProductSwatchesV2(params) {
        this.$element = $(params.$element);
        this.classCurrentValue = params.settings.classCurrentValue;
        this.classItem = params.settings.classItem;
        this.classInputIdHidden = params.settings.classInputIdHidden;
        this.classBtnSelect = params.settings.classBtnSelect;
        this.classCurrentStatus = params.settings.classCurrentStatus;
        this.init();
    }
    /* private methods */
    /**
     * init: function khoi tao lib
     */
    GtProductSwatchesV2.prototype.init = function () {
        var productJson = this.$element.closest("[keyword='product'], [data-keyword='product']").find(".ProductJson").text();
        try {
            if (productJson) {
                this._productJson = JSON.parse(productJson);
            }
        }
        catch (e) {
            console.log("error: ", e);
        }
        this.setCurrentVariant();
        this.event();
        this.listen();
    };
    /**
     * setInitVariant: tim ra variant dang active
     */
    GtProductSwatchesV2.prototype.setCurrentVariant = function () {
        if (this._productJson) {
            var storeVariant = window.SOLID.store.getState("variant" + this._productJson.id);
            if (storeVariant && storeVariant.variant_init) {
                window.SOLID.store.dispatch("variant" + this._productJson.id, storeVariant);
                return;
            }
            // const $productJson = this.$element.closest("[keyword='product']").find(".ProductJson");
            // if ($productJson && $productJson.length) {
            // const variantID: number = parseInt($productJson.attr("data-variant"));
            var variantIDCache = this.getVariantIDCacheByDom();
            if (variantIDCache) {
                for (var i = 0; i < this._productJson.variants.length; i++) {
                    var currentVariant = this._productJson.variants[i];
                    if (currentVariant.id == variantIDCache) {
                        try {
                            var newVariant = JSON.parse(JSON.stringify(currentVariant));
                            // eslint-disable-next-line camelcase
                            newVariant.variant_init = true;
                            window.SOLID.store.dispatch("variant" + this._productJson.id, newVariant);
                        }
                        catch (e) {
                            console.log(e);
                        }
                        break;
                    }
                }
            }
            // }
        }
    };
    /**
     * event: thêm sự kiện click cho các variants
     */
    GtProductSwatchesV2.prototype.event = function () {
        if (this._productJson) {
            try {
                var variants_1 = this._productJson.variants;
                var $select = this.$element.find(this.classBtnSelect);
                var _this_1 = this;
                $select.off("click.select").on("click.select", function () {
                    var $el = jQuery(this);
                    if (!$el.hasClass("gt_soldout")) {
                        var name_1 = $el.attr("data-name");
                        // Update active
                        var $selector = _this_1.$element.find(_this_1.classBtnSelect + "[data-name=\"" + name_1 + "\"]");
                        if ($selector && $selector.length) {
                            $selector.removeClass("gf_active");
                            $selector.removeClass("gt_active");
                        }
                        $el.addClass("gf_active");
                        $el.addClass("gt_active");
                        var $actives = _this_1.$element.find(_this_1.classBtnSelect + ".gf_active," + _this_1.classBtnSelect + ".gt_active");
                        var values = [];
                        var i = void 0;
                        if ($actives && $actives.length) {
                            for (i = 0; i < $actives.length; i++) {
                                var activeValue = jQuery($actives[i]).attr("data-value");
                                if (activeValue) {
                                    values.push(activeValue);
                                }
                            }
                        }
                        var currentVariant = {};
                        if (values && values.length) {
                            for (i = 0; i < variants_1.length; i++) {
                                var variant = variants_1[i];
                                var options = variant.options; // => []
                                // console.log(options, " vs ", values)
                                if (_this_1.compare(values, options)) {
                                    currentVariant = variant;
                                    break;
                                }
                            }
                        }
                        if (!jQuery.isEmptyObject(currentVariant)) {
                            window.SOLID.store.dispatch("variant" + _this_1._productJson.id, currentVariant);
                        }
                        else {
                            // Sản phẩm không được định nghĩa
                            window.SOLID.store.dispatch("variant" + _this_1._productJson.id, {
                                id: 0,
                                available: false,
                            });
                        }
                    }
                });
            }
            catch (e) {
                console.log(e);
            }
        }
    };
    /**
     * listen: lắng nghe khi có variant active thay đổi
     */
    GtProductSwatchesV2.prototype.listen = function () {
        var _this_1 = this;
        var store = window.SOLID.store;
        if (this._productJson) {
            var options_1 = this._productJson.options;
            store.subscribe("variant" + this._productJson.id, function (variant) {
                if (variant && variant.variant_init) {
                    return;
                }
                _this_1.updateDataCacheAttr(variant.id);
                var $product = _this_1.$element.closest("[keyword='product'], [data-keyword='product']");
                var $currentStatus = $product.find(_this_1.classCurrentStatus);
                if ($currentStatus && $currentStatus.length) {
                    if (!variant.available) {
                        $currentStatus.show();
                        var labelSoldOut = $currentStatus.attr("data-sold-out") || "Sold Out";
                        $currentStatus.addClass(_this_1.classCurrentStatus.replace(".", "") + "--inner");
                        $currentStatus.html(labelSoldOut);
                    }
                    else {
                        $currentStatus.addClass(_this_1.classCurrentStatus.replace(".", "") + "--inner");
                        $currentStatus.hide();
                    }
                }
                if (variant.options && variant.options.length) {
                    for (var i = 0; i < variant.options.length; i++) {
                        var option = variant["option" + (i + 1)];
                        if (option) {
                            var name_2 = void 0;
                            if (options_1[i]) {
                                name_2 = options_1[i];
                            }
                            if (!name_2 || jQuery.isPlainObject(name_2)) {
                                name_2 = options_1[i].name;
                            }
                            var $item = _this_1.$element.find(_this_1.classItem + "[data-name=\"" + name_2 + "\"]");
                            if ($item && $item.length) {
                                var $select = $item.find(_this_1.classBtnSelect);
                                var $selectActive = $item.find(_this_1.classBtnSelect + "[data-value=\"" + option.replace(/"/g, "\\\"") + "\"]");
                                if (_this_1.classCurrentValue) {
                                    var $currentValue = $item.find(_this_1.classCurrentValue);
                                    if ($currentValue && $currentValue.length) {
                                        var $contentSelectActive = $selectActive.html();
                                        $currentValue.html($contentSelectActive);
                                        $currentValue.attr("data-value", option);
                                    }
                                }
                                if ($select && $select.length && $selectActive && $selectActive.length) {
                                    $select.removeClass("gf_active");
                                    $select.removeClass("gt_active");
                                    $selectActive.addClass("gf_active");
                                    $selectActive.addClass("gt_active");
                                }
                            }
                        }
                    }
                }
                if (!jQuery.isEmptyObject(variant)) {
                    if ($product && $product.length) {
                        var $input = $product.find(_this_1.classInputIdHidden);
                        if ($input && $input.length) {
                            $input.attr("value", variant.id).val(variant.id);
                            var currentURL = window.location.href;
                            var variantURL = _this_1.updateUrlParameter(currentURL, "variant", variant.id);
                            window.history.replaceState({}, "", variantURL);
                        }
                    }
                }
            });
        }
    };
    /**
     * getVariantIDCacheByDom
     * @returns current variant id
     */
    GtProductSwatchesV2.prototype.getVariantIDCacheByDom = function () {
        var variantID = this.$element.attr("data-variant-id") || "";
        return variantID;
    };
    /**
     * Cập nhật variant id trong attr của element khi giá trị store variant thay đổi
     * @param variantID current variant id
     */
    GtProductSwatchesV2.prototype.updateDataCacheAttr = function (variantID) {
        var dataCache = this.$element.attr("data-variant-id");
        if (dataCache && variantID) {
            this.$element.attr("data-variant-id", variantID);
        }
    };
    /**
     * compare: compare 2 array
     * @param array array1
     * @param array2 array 2
     * @returns boolean
     */
    GtProductSwatchesV2.prototype.compare = function (array, array2) {
        array.sort();
        array2.sort();
        for (var i = 0; i < array.length; i++) {
            for (var j = 0; j < array2.length; j++) {
                var val1 = array[j];
                var val2 = array2[j];
                val1 = val1.replace(/"/gm, "'");
                val2 = val2.replace(/"/gm, "'");
                if (val1 != val2) {
                    return false;
                }
            }
        }
        return true;
    };
    /**
     * updateUrlParameter: update params
     * @param url current url window.location.href
     * @param key "variant"
     * @param value variant id
     * @returns string
     */
    GtProductSwatchesV2.prototype.updateUrlParameter = function (url, key, value) {
        var parser = document.createElement("a");
        parser.href = url;
        var newUrl = parser.protocol + "//" + parser.host + parser.pathname;
        // has parameters ?
        if (parser.search && parser.search.indexOf("?") !== -1) {
            // parameter already exists
            if (parser.search.indexOf(key + "=") !== -1) {
                // paramters to array
                var params_1 = parser.search.replace("?", "");
                params_1 = params_1.split("&");
                params_1.forEach(function (param, i) {
                    if (param.indexOf(key + "=") !== -1) {
                        if (value !== null) {
                            params_1[i] = key + "=" + value;
                        }
                        else {
                            delete params_1[i];
                        }
                    }
                });
                if (params_1.length > 0) {
                    newUrl += "?" + params_1.join("&");
                }
            }
            else if (value !== null) {
                newUrl += parser.search + "&" + key + "=" + value;
            }
            else {
                newUrl += parser.search;
            } // skip the value (remove)
        }
        else if (value !== null) {
            newUrl += "?" + key + "=" + value;
        } // no parameters, create it
        newUrl += parser.hash;
        return newUrl;
    };
    return GtProductSwatchesV2;
}());
/**
 * gtProductSwatchesV2
 * @param params setting lib product swatches
 * @returns gtProductSwatchesV2
 */
window.SOLID.library.gtProductSwatchesV2 = function (params) {
    return new GtProductSwatchesV2(params);
};
exports.default = {};


/***/ })

/******/ });
});
        }
        funcLib105();
      } catch(e) {
        console.error("Error lib id: 105" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcLib65 = function() {
          "use strict";
(function () {
  window.SOLID = window.SOLID || {};
  var Countdown = function (options) {
    var _settings = {
      id: "",
      key: "",
      endDate: null,
      distance: 100,
      coutdown: true,
      outputFormat: "week|day|hour|minute|second",

      // The callback
      onStart: function () {},
      onStop: function () {},
      onInterval: function () {},
    };
    var fn = {};
    var _this = this;

    var decisecond = 100;
    var second = decisecond * 10;
    var minute = second * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var week = day * 7;
    var uniqueKey = "";

    var init = function () {
      _settings = _this.extend({}, _settings, options);
      uniqueKey = "_delayInterval" + _settings.id;
      clearInterval(window[uniqueKey]);


      if (_settings.coutdown && _settings.endDate) {
        _this.start();
      }
    };
    // Public function

    fn.start = function () {
      _settings.coutdown = true;
      if (_settings.endDate) {
        _this.start();
      }
    };
    fn.stop = function () {
      _settings.coutdown = false;
      _this.stop();
    };

    // Private function
    this.extend = function (out) {
      out = out || {};

      for (var i = 1; i < arguments.length; i++) {
        if (!arguments[i]) { continue; }

        for (var key in arguments[i]) {
          if (arguments[i].hasOwnProperty(key)) { out[key] = arguments[i][key]; }
        }
      }

      return out;
    };
    this.start = function () {
      _settings.onStart();
      _this.interval();
    };
    this.stop = function () {
      clearInterval(window[uniqueKey]);
      _settings.onStop();
    };
    this.interval = function () {
      var distance = _this.getRemainingTime(_settings.endDate);

      if (distance <= 0) {
        _this.stop();
        return;
      }

      clearInterval(window[uniqueKey]);
      window[uniqueKey] = setInterval(function () {
        var objectTime = _this.formatOutput(distance, _settings.outputFormat);

        _settings.onInterval(objectTime);
        distance = distance - _settings.distance;
        if (distance <= 0) {
          _this.stop();
          return;
        }
      }, _settings.distance);
    };

    /**
     * Calculates remaining time and returns a distance between the endDate and time now
     * @param {Number, Date} endDate
     */
    this.getRemainingTime = function (endDate) {
      var now = new Date().getTime();
      var endTime = new Date(endDate).getTime();
      var distance = endTime - now;

      return distance;
    };

    /**
     * Turn the remaining time into an object with information in the format
     * @param {Number} distance
     * @param {String} format 'week|day|hour|minute|second|decisecond'
     */
    this.formatOutput = function (distance, format) {
      var objectReturn = {
        weeks: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        deciseconds: 0,
      };

      distance = Math.ceil(distance);
      var formatItems = format.split("|");

      if (formatItems.indexOf("week") != -1) {
        objectReturn.weeks = Math.floor(distance / (week));
        distance = distance % week;
      }
      if (formatItems.indexOf("day") != -1) {
        objectReturn.days = Math.floor(distance / (day));
        distance = distance % day;
      }
      if (formatItems.indexOf("hour") != -1) {
        objectReturn.hours = Math.floor(distance / (hour));
        distance = distance % hour;
      }
      if (formatItems.indexOf("minute") != -1) {
        objectReturn.minutes = Math.floor(distance / (minute));
        distance = distance % minute;
      }
      if (formatItems.indexOf("second") != -1) {
        objectReturn.seconds = Math.floor(distance / (second));
        distance = distance % second;
      }
      if (formatItems.indexOf("decisecond") != -1) {
        objectReturn.deciseconds = Math.floor(distance / (decisecond));
        distance = distance % decisecond;
      }
      return objectReturn;
    };

    init();
    return fn;
  };

  window.SOLID.Countdown = function (options) {
    return new Countdown(options);
  };
})();

        }
        funcLib65();
      } catch(e) {
        console.error("Error lib id: 65" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESSectionQGS3nTOdREpZhcg = function() {
          var $section = $(".gt_section-QGS3nTOdREpZhcg");
if (!$section || !$section.length) {
  return;
}

/*link*/
store.change("optimal-QGS3nTOdREpZhcg-linkIcon", function({value, index}) {
  if (value.indexOf('https://') == -1) {
    value = "https://"+value;
    $section.find(".gt_social__icon[data-index='"+index+"']").attr("href", value);
  }
});

        }
        funcESSectionQGS3nTOdREpZhcg()
      } catch(e) {
        console.error("Error ESSection Id: QGS3nTOdREpZhcg" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomQGS3nTOdREpZhcg_newsletterMessage = function() {
          var $atoms = jQuery(".gt_atom-QGS3nTOdREpZhcg_newsletterMessage");
if (!$atoms || !$atoms.length) {
  return;
}

/* Variables */
var clientInteractionScrollIntoView = "";

window.SOLID.library.animation({
  $doms: $atoms,
  elementId: "QGS3nTOdREpZhcg_newsletterMessage",
  animationType: "text",
  interactionScrollIntoView: {
    value: clientInteractionScrollIntoView,
    previewAttr: "interactionScrollIntoView"
  },
  mode: "production"
});

        }
        funcESAtomQGS3nTOdREpZhcg_newsletterMessage()
      } catch(e) {
        console.error("Error ESAtom Id: QGS3nTOdREpZhcg_newsletterMessage" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomQGS3nTOdREpZhcg_notificationSuccess = function() {
          var $atoms = jQuery(".gt_atom-QGS3nTOdREpZhcg_notificationSuccess");
if (!$atoms || !$atoms.length) {
  return;
}

/* Variables */
var clientInteractionScrollIntoView = "";

window.SOLID.library.animation({
  $doms: $atoms,
  elementId: "QGS3nTOdREpZhcg_notificationSuccess",
  animationType: "text",
  interactionScrollIntoView: {
    value: clientInteractionScrollIntoView,
    previewAttr: "interactionScrollIntoView"
  },
  mode: "production"
});

        }
        funcESAtomQGS3nTOdREpZhcg_notificationSuccess()
      } catch(e) {
        console.error("Error ESAtom Id: QGS3nTOdREpZhcg_notificationSuccess" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomQGS3nTOdREpZhcg_contactInfo = function() {
          var $atoms = jQuery(".gt_atom-QGS3nTOdREpZhcg_contactInfo");
if (!$atoms || !$atoms.length) {
  return;
}

/* Variables */
var clientInteractionScrollIntoView = "";

window.SOLID.library.animation({
  $doms: $atoms,
  elementId: "QGS3nTOdREpZhcg_contactInfo",
  animationType: "text",
  interactionScrollIntoView: {
    value: clientInteractionScrollIntoView,
    previewAttr: "interactionScrollIntoView"
  },
  mode: "production"
});

        }
        funcESAtomQGS3nTOdREpZhcg_contactInfo()
      } catch(e) {
        console.error("Error ESAtom Id: QGS3nTOdREpZhcg_contactInfo" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomQGS3nTOdREpZhcg_logoText = function() {
          var $atoms = jQuery(".gt_atom-QGS3nTOdREpZhcg_logoText");
if (!$atoms || !$atoms.length) {
  return;
}

/* Variables */
var clientInteractionScrollIntoView = "";

window.SOLID.library.animation({
  $doms: $atoms,
  elementId: "QGS3nTOdREpZhcg_logoText",
  animationType: "text",
  interactionScrollIntoView: {
    value: clientInteractionScrollIntoView,
    previewAttr: "interactionScrollIntoView"
  },
  mode: "production"
});

        }
        funcESAtomQGS3nTOdREpZhcg_logoText()
      } catch(e) {
        console.error("Error ESAtom Id: QGS3nTOdREpZhcg_logoText" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESSectionCXlJLf8qMXa3yPE = function() {
          (function() {
  var elementClassName = ".gt_section-CXlJLf8qMXa3yPE";
  var id = "CXlJLf8qMXa3yPE";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    /* store get state block script */
    /* methods block script */
    function addClassSticky() {
      var windowWidth = $(window).width();
      var windowCheckSticky = "enable";
      if (windowWidth <= 992) {
        windowCheckSticky = "disable";
      } else {
        windowCheckSticky = "enable";
      }

      $(window).off("scroll.scrollTopBarCXlJLf8qMXa3yPE").on("scroll.scrollTopBarCXlJLf8qMXa3yPE", function() {
        var scrollTop = $(document).scrollTop();
        if (scrollTop > 1) {
          if (windowCheckSticky === "enable") {
            $element.addClass("gt_sticky--top");
          } else {
            $element.removeClass("gt_sticky--top");
          }
        } else {
          $element.removeClass("gt_sticky--top");
        }
      });
    }
    /* init block script */
    addClassSticky();
    var delay = 0;
    $(window).off("resize.checkSwitchScreensCXlJLf8qMXa3yPE").on("resize.checkSwitchScreensCXlJLf8qMXa3yPE", function() {
      clearTimeout(delay);
      delay = setTimeout(function() {
        addClassSticky();
      }, 100);
    });
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
    var $target = $($elements[indexEl]);
    script($target, indexEl);
  }
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESSectionCXlJLf8qMXa3yPE()
      } catch(e) {
        console.error("Error ESSection Id: CXlJLf8qMXa3yPE" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomCXlJLf8qMXa3yPE_boxContainer = function() {
          (function() {
  var elementClassName = ".gt_atom-CXlJLf8qMXa3yPE_boxContainer";
  var id = "CXlJLf8qMXa3yPE_boxContainer";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "CXlJLf8qMXa3yPE_boxContainer",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
    var $target = $($elements[indexEl]);
    script($target, indexEl);
  }
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomCXlJLf8qMXa3yPE_boxContainer()
      } catch(e) {
        console.error("Error ESAtom Id: CXlJLf8qMXa3yPE_boxContainer" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomCXlJLf8qMXa3yPE_contactInfo = function() {
          (function() {
  var elementClassName = ".gt_atom-CXlJLf8qMXa3yPE_contactInfo";
  var id = "CXlJLf8qMXa3yPE_contactInfo";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "CXlJLf8qMXa3yPE_contactInfo",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
    var $target = $($elements[indexEl]);
    script($target, indexEl);
  }
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomCXlJLf8qMXa3yPE_contactInfo()
      } catch(e) {
        console.error("Error ESAtom Id: CXlJLf8qMXa3yPE_contactInfo" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomCXlJLf8qMXa3yPE_contactInfo1 = function() {
          (function() {
  var elementClassName = ".gt_atom-CXlJLf8qMXa3yPE_contactInfo1";
  var id = "CXlJLf8qMXa3yPE_contactInfo1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function removeTextWrapperClass() {
      var $textWrapper = $element.find(".gt_box-desc");
      $textWrapper.unwrap();
    }

    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "CXlJLf8qMXa3yPE_contactInfo1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "CXlJLf8qMXa3yPE_contactInfo1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if ("production" === "production") {
      removeTextWrapperClass();
    }
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomCXlJLf8qMXa3yPE_contactInfo1()
      } catch(e) {
        console.error("Error ESAtom Id: CXlJLf8qMXa3yPE_contactInfo1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomCXlJLf8qMXa3yPE_contactInfo2 = function() {
          (function() {
  var elementClassName = ".gt_atom-CXlJLf8qMXa3yPE_contactInfo2";
  var id = "CXlJLf8qMXa3yPE_contactInfo2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function removeTextWrapperClass() {
      var $textWrapper = $element.find(".gt_box-desc");
      $textWrapper.unwrap();
    }

    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "CXlJLf8qMXa3yPE_contactInfo2",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "CXlJLf8qMXa3yPE_contactInfo2",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if ("production" === "production") {
      removeTextWrapperClass();
    }
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomCXlJLf8qMXa3yPE_contactInfo2()
      } catch(e) {
        console.error("Error ESAtom Id: CXlJLf8qMXa3yPE_contactInfo2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomCXlJLf8qMXa3yPE_iconSocial = function() {
          (function() {
  var elementClassName = ".gt_atom-CXlJLf8qMXa3yPE_iconSocial";
  var id = "CXlJLf8qMXa3yPE_iconSocial";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "CXlJLf8qMXa3yPE_iconSocial",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
    var $target = $($elements[indexEl]);
    script($target, indexEl);
  }
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomCXlJLf8qMXa3yPE_iconSocial()
      } catch(e) {
        console.error("Error ESAtom Id: CXlJLf8qMXa3yPE_iconSocial" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomCXlJLf8qMXa3yPE_iconSocialItem_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-CXlJLf8qMXa3yPE_iconSocialItem_0";
  var id = "CXlJLf8qMXa3yPE_iconSocialItem_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "CXlJLf8qMXa3yPE_iconSocialItem_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomCXlJLf8qMXa3yPE_iconSocialItem_0()
      } catch(e) {
        console.error("Error ESAtom Id: CXlJLf8qMXa3yPE_iconSocialItem_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomCXlJLf8qMXa3yPE_iconSocialItem_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-CXlJLf8qMXa3yPE_iconSocialItem_1";
  var id = "CXlJLf8qMXa3yPE_iconSocialItem_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "CXlJLf8qMXa3yPE_iconSocialItem_1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomCXlJLf8qMXa3yPE_iconSocialItem_1()
      } catch(e) {
        console.error("Error ESAtom Id: CXlJLf8qMXa3yPE_iconSocialItem_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomCXlJLf8qMXa3yPE_messageContent = function() {
          (function() {
  var elementClassName = ".gt_atom-CXlJLf8qMXa3yPE_messageContent";
  var id = "CXlJLf8qMXa3yPE_messageContent";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function removeTextWrapperClass() {
      var $textWrapper = $element.find(".gt_box-desc");
      $textWrapper.unwrap();
    }

    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "CXlJLf8qMXa3yPE_messageContent",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "CXlJLf8qMXa3yPE_messageContent",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if ("production" === "production") {
      removeTextWrapperClass();
    }
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomCXlJLf8qMXa3yPE_messageContent()
      } catch(e) {
        console.error("Error ESAtom Id: CXlJLf8qMXa3yPE_messageContent" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomCXlJLf8qMXa3yPE_boxCountdownTimer = function() {
          (function() {
  var elementClassName = ".gt_atom-CXlJLf8qMXa3yPE_boxCountdownTimer";
  var id = "CXlJLf8qMXa3yPE_boxCountdownTimer";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "CXlJLf8qMXa3yPE_boxCountdownTimer",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
    var $target = $($elements[indexEl]);
    script($target, indexEl);
  }
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomCXlJLf8qMXa3yPE_boxCountdownTimer()
      } catch(e) {
        console.error("Error ESAtom Id: CXlJLf8qMXa3yPE_boxCountdownTimer" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomCXlJLf8qMXa3yPE_iconCountdownTimer = function() {
          (function() {
  var elementClassName = ".gt_atom-CXlJLf8qMXa3yPE_iconCountdownTimer";
  var id = "CXlJLf8qMXa3yPE_iconCountdownTimer";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "CXlJLf8qMXa3yPE_iconCountdownTimer",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomCXlJLf8qMXa3yPE_iconCountdownTimer()
      } catch(e) {
        console.error("Error ESAtom Id: CXlJLf8qMXa3yPE_iconCountdownTimer" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomCXlJLf8qMXa3yPE_countdownTimer = function() {
          (function() {
  var elementClassName = ".gt_atom-CXlJLf8qMXa3yPE_countdownTimer";
  var id = "CXlJLf8qMXa3yPE_countdownTimer";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    var arrayFormat = ["minute", "second"];
    var outputFormat = "";
    var showDays = "true" === "true";
    var showHours = "true" === "true";
    var type = "repeat";
    var dateTimeAnyDate = "";
    var dateTimeAnyTime = "00:05:00";
    var isLoop = "true" === "true";
    var dateTimeAny = type === "scheduled" ? dateTimeAnyDate : dateTimeAnyTime;
    var endDate = 0;
    /* store get state block script */
    /* methods block script */
    function timeToSecond(timeString) {
      var times = timeString.split(":");
      var hour = parseInt(times[0]),
        min = parseInt(times[1]),
        sec = parseInt(times[2]);
      return hour * 3600 + min * 60 + sec;
    }

    function startTimer(key, endDate, $element, loop, isRepeat = false) {
      SOLID.Countdown({
        id,
        key: key,
        endDate: endDate,
        distance: 1000,
        outputFormat: outputFormat,
        onStop: function() {
          $element.addClass("gt_hidden");

          if (loop) {
            clearTimeout(window['_repeat_' + key]);
            window['_repeat_' + key] = setTimeout(() => {
              $element.removeClass("gt_hidden");
              var totalTime = timeToSecond(dateTimeAny);
              startTimer(key, new Date(Date.now() + totalTime * 1000), $element, loop, totalTime, true);
            }, 5000);
            return;
          }
        },
        onInterval: function(object) {
          var $days = $element.find(".gt_atom-days")
          var day1 = Math.floor(object.days / 10);
          var day2 = object.days % 10;
          $days.find(".gt_atom-num1").text(day1);
          $days.find(".gt_atom-num2").text(day2);


          var $hours = $element.find(".gt_atom-hours")
          var hr1 = Math.floor(object.hours / 10);
          var hr2 = object.hours % 10;
          $hours.find(".gt_atom-num1").text(hr1);
          $hours.find(".gt_atom-num2").text(hr2);


          var $minutes = $element.find(".gt_atom-minutes")
          var min1 = Math.floor(object.minutes / 10);
          var min2 = object.minutes % 10;
          $minutes.find(".gt_atom-num1").text(min1);
          $minutes.find(".gt_atom-num2").text(min2);


          var $seconds = $element.find(".gt_atom-seconds")
          var sec1 = Math.floor(object.seconds / 10);
          var sec2 = object.seconds % 10;
          $seconds.find(".gt_atom-num1").text(sec1);
          $seconds.find(".gt_atom-num2").text(sec2);

          if (isRepeat) {
            var time = hr1.toString() + hr2.toString() + ':' + min1.toString() + min2.toString() + ':' + sec1.toString() + sec2.toString();
            saveTimer(time);
          }
        }
      });
    }

    function saveTimer(time) {
      if (time == '00:00:01') {
        time = dateTimeAnyTime;
      }
      localStorage.setItem(id, time);
    }

    function createTimer() {
      if (type === 'repeat') {
        var totalTime = timeToSecond(dateTimeAny);
        if (localStorage.getItem(id)) {
          totalTime = timeToSecond(localStorage.getItem(id));
        }
        endDate = new Date(Date.now() + totalTime * 1000);
        $element.removeClass("gt_hidden");
        startTimer("repeatCXlJLf8qMXa3yPE_countdownTimer", endDate, $element, isLoop, true);
      } else { //scheduled
        endDate = new Date(dateTimeAny);
        $element.removeClass("gt_hidden");
        localStorage.removeItem(id);
        startTimer("repeatCXlJLf8qMXa3yPE_countdownTimer", endDate, $element);
      }
    }

    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "CXlJLf8qMXa3yPE_countdownTimer",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    if (!dateTimeAny) {
      return
    }
    if (showDays) {
      arrayFormat.push("day")
    }
    if (showHours) {
      arrayFormat.push("hour")
    }
    outputFormat = arrayFormat.join("|");
    createTimer();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomCXlJLf8qMXa3yPE_countdownTimer()
      } catch(e) {
        console.error("Error ESAtom Id: CXlJLf8qMXa3yPE_countdownTimer" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomCXlJLf8qMXa3yPE_buttonLink = function() {
          (function() {
  var elementClassName = ".gt_atom-CXlJLf8qMXa3yPE_buttonLink";
  var id = "CXlJLf8qMXa3yPE_buttonLink";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const isProduction = "production" === "production";
    let actions = `[]`
    const isCustomActions = "false" == "true"
    const openNewTab = "false" == "true"
    const linkButton = "";
    const activeButtonFixContent = "false" === "true";
    const buttonFixContent = "Buy [!quantity!] items"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "CXlJLf8qMXa3yPE_buttonLink",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }

    function addAction() {
      if (!isCustomActions) {
        if (linkButton != "") {
          actionsObj = [{
            "id": 1,
            "event": "click",
            "control": {
              "id": "1",
              "attribute": "1",
              "title": "Pick Link",
              "desc": "",
              "reference": "html",
              "type": "picklink",
              "value": linkButton,
              "newTab": openNewTab
            }
          }]
        } else {
          actionsObj = []
        }
        actions = JSON.stringify(actionsObj);
      }
      if (isProduction) {
        $element.customEvent(JSON.parse(actions), id + "_" + indexEl);
        /*Listenifisbuttonaddtocard*/

        window.SOLID.store.subscribe("loading-buy-now-CXlJLf8qMXa3yPE_buttonLink" + "_" + indexEl, function(isDisplay) {
          const $loadingEl = $element.find(".atom-button-loading-circle-loader");
          const $textEl = $element.find(".gt_button-content-text");
          if ($loadingEl && $loadingEl.length && $textEl && $textEl.length) {
            let timeout = undefined;
            if (isDisplay === true) {
              /*displayloadingbutton*/
              clearTimeout(timeout);
              $loadingEl.css("display", "inline-block");
              $textEl.css("visibility", "hidden");
            } else if (isDisplay === "stop") {
              /*stoploading*/
              $loadingEl.removeAttr("style");
              $textEl.removeAttr("style");
              window.SOLID.store.dispatch("loading-buy-now-CXlJLf8qMXa3yPE_buttonLink" + "_" + indexEl, "");
            } else if (isDisplay === false) {
              clearTimeout(timeout);
              /*displaytickbutton*/
              $loadingEl.addClass("load-complete");
              $loadingEl.find(".atom-button-loading-check-mark").css("display", "block");
              /*removetickbuttonanddisplaytext*/
              timeout = setTimeout(function() {
                $loadingEl.removeClass("load-complete");
                $loadingEl.find(".atom-button-loading-check-mark").removeAttr("style");
                $loadingEl.removeAttr("style");
                $textEl.removeAttr("style");
                window.SOLID.store.dispatch("loading-buy-now-CXlJLf8qMXa3yPE_buttonLink" + "_" + indexEl, "");
              }, 3000);
            }
          }
        });
      }
    }

    function initFixContent() {
      const splitContent = buttonFixContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_button-content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_button-content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    addAction();
    if (activeButtonFixContent) {
      initFixContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
    var $target = $($elements[indexEl]);
    script($target, indexEl);
  }
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomCXlJLf8qMXa3yPE_buttonLink()
      } catch(e) {
        console.error("Error ESAtom Id: CXlJLf8qMXa3yPE_buttonLink" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomCXlJLf8qMXa3yPE_accountTopBar = function() {
          (function() {
  var elementClassName = ".gt_atom-CXlJLf8qMXa3yPE_accountTopBar";
  var id = "CXlJLf8qMXa3yPE_accountTopBar";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "CXlJLf8qMXa3yPE_accountTopBar",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
    var $target = $($elements[indexEl]);
    script($target, indexEl);
  }
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtomCXlJLf8qMXa3yPE_accountTopBar()
      } catch(e) {
        console.error("Error ESAtom Id: CXlJLf8qMXa3yPE_accountTopBar" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESSectionqoZPDvPIyQ1sItl = function() {
          var $section = $(".gt_section-qoZPDvPIyQ1sItl");
if (!$section || !$section.length) {
  return;
}

var _searchTurnOn = "false";
var _cartCount = "false";
var _menuStyle = "style1";
var _subMenuStyle = "style1";
var transparentHeader = "disable";
var windowWidth;
var _stickyHeader;
var _spacingHeader;
var _headerOffsets;
setVariableWithWindowScreen();

var $siteHeader = $section.find(".gt_header");

$section.find(".gt_toggle-menus").removeClass("gt_toggle-menus-open");
removeOverflowBody();

resetHeaderState();
setHeightOffsetToHeader();

// Khi scroll thì thêm class sticky header cho menu desk/mobile
$(window).off("scroll.checkStickyHeaderqoZPDvPIyQ1sItl").on("scroll.checkStickyHeaderqoZPDvPIyQ1sItl", function () {
  var scrollTop = $(document).scrollTop();
  if (_stickyHeader == "enable" && scrollTop > $siteHeader.outerHeight()) {
    $siteHeader.addClass("gt_sticky-header gt_parent-sticky");
    $siteHeader.delay(10).fadeIn(400);
  } else if (_stickyHeader == "enable" && scrollTop <= $siteHeader.outerHeight()) {
    $siteHeader.removeClass("gt_sticky-header gt_parent-sticky");
  } else if (_stickyHeader == "disable") {
    $siteHeader.removeClass("gt_sticky-header gt_parent-sticky");
  }
  heightHeaderAdd();
  setHeightOffsetToHeader();
});

// Enable/Disable Transparent
/*  */
$section.find(".gt_header").removeClass("gt_transparen-header");
/*  */

// Search
if (_searchTurnOn) {
  $section.find(".gt_header--search").off("click.showMenuDesqoZPDvPIyQ1sItl").on("click.showMenuDesqoZPDvPIyQ1sItl", function () {
    $section.find(".gt_search--nav").slideToggle("show-menu-des");
  });
}

if (_subMenuStyle == "style1") {
  // Tính triangle submenu
  setTimeout(function () {
    calculatorWidthMenu();
  }, 200);
}

if (_menuStyle == "style2") {
  // Đóng menu Desktop
  var closeMenuDesktop = function () {
    $section.find(".gt_navbar-collapse").slideUp("gt_show-menu-dess");
    $section.find(".gt_toggle--menus-desktop").removeClass("gt_toggle-menus-open");
  };

  $section.find(".gt_show--menu-desktop").off("click.showMenuqoZPDvPIyQ1sItl").on("click.showMenuqoZPDvPIyQ1sItl", function () {
    if ($section.find(".gt_toggle--menus-desktop").hasClass("gt_toggle-menus-open")) {
      closeMenuDesktop();
    } else {
      $section.find(".gt_toggle--menus-desktop").addClass("gt_toggle-menus-open");
      $section.find(".gt_navbar-collapse").slideDown("gt_show-menu-des");
    }
    calculatorWidthSubMenu();
  });

  // Close menu mobile
  $(window).off("click.closeShowMenuqoZPDvPIyQ1sItl").on("click.closeShowMenuqoZPDvPIyQ1sItl", function (event) {
    var $targetDesktop = $(event.target);
    var $parentDesktop = $targetDesktop.closest(".gt_navbar-collapse");
    var $showDesktop = $targetDesktop.closest(".gt_show--menu-desktop");
    if ($parentDesktop.length == 0 && $showDesktop.length == 0) {
      closeMenuDesktop();
    }
  });

  calculatorWidthSubMenu();
}

if (_subMenuStyle == "style2") {
  // Sub Menu Desktop
  $section.find(".gt_submenu--bottom .gt_submenu--child .gt_icon--desktop").off("click.openCloseMenuDesktop").on("click.openCloseMenuDesktop", function (event) {
    var $itemThisDes = $(this);
    var $target = $(event.target);
    var $li = $(this).closest("li");
    var $subMenuDes = $li.children(".gt_submenu--small");

    if ($subMenuDes.length > 0) {
      var time = 40;
      var $iconCloseDes = $itemThisDes.find(".gt_icon--close");
      var $iconOpenDes = $itemThisDes.find(".gt_icon--open");
      if ($subMenuDes.hasClass("gt_active")) {
        var $parent = $target.closest(".gt_submenu--small");
        var $checkItem = $target.closest(".gt_submenu--bottom .gt_submenu--child .gt_icon--desktop");
        if ($parent.length == 0 && $checkItem.length) {
          window.gtAnimations.SlideUp($subMenuDes[0], time, function () {
            $subMenuDes.removeClass("gt_active");
            $itemThisDes.removeClass("gt_active");
            $iconCloseDes.show();
            $iconOpenDes.hide();
          });
        }
      } else {
        $itemThisDes.addClass("gt_active");
        $subMenuDes.addClass("gt_active");
        $iconCloseDes.hide();
        $iconOpenDes.show();

        window.gtAnimations.SlideDown($subMenuDes[0], time);
      }
    }
  });
}

// menu level 1
var flag = true; // Nếu là true thì menu được mở/đóng thành công
$section.find(".gt_dropdown--one .gt_icon--one").off("click.openMenuMobileqoZPDvPIyQ1sItl").on("click.openMenuMobileqoZPDvPIyQ1sItl", function () {
  if (flag) {
    flag = false;
    // event.preventDefault();
    var $li = $(this).closest("li");
    var $submenu = $li.children(".gt_submenu--mobile");
    var $a = $li.children("div");
    if ($submenu.hasClass("gt_active")) {
      $submenu.removeClass("gt_active");
      $a.removeClass("gt_dot-arrow");
    } else {
      $submenu.addClass("gt_active");
      $a.addClass("gt_dot-arrow");
    }

    setTimeout(function () {
      flag = true;
    }, 500);
  }
});

// Khi nhấn icon back trên submenu
$section.find(".gt_btn-back").off("click.backMenuqoZPDvPIyQ1sItl").on("click.backMenuqoZPDvPIyQ1sItl", function (event) {
  event.preventDefault();
  var $submenu = $(this).closest(".gt_submenu--mobile");
  var $li = $submenu.closest("li");
  var $a = $li.children("div");

  $submenu.removeClass("gt_active");
  $a.removeClass("gt_dot-arrow");
});

$section.find(".gt_show-menu").off("click.showMenuqoZPDvPIyQ1sItl").on("click.showMenuqoZPDvPIyQ1sItl", function () {
  if ($section.find(".gt_menu-mobile").hasClass("show-menu")) {
    closeMenu();
  } else {
    const bodyWidth = document.body.offsetWidth;
    window.document.body.style.width = bodyWidth + "px";
    window.document.body.style.overflow = "hidden";
    $section.find(".gt_menu-mobile").addClass("show-menu");
    $section.find(".gt_toggle-menus").addClass("gt_toggle-menus-open");
    // $("body").addClass("gt_hideBody");
  }
  setHeightOffsetToHeader();
});

function removeOverflowBody() {
  window.document.body.style.overflow = "";
  window.document.body.style.width = "";
}

// Menu level 2
$section.find(".gt_dropdown--two .gt_submenu--two .gt_icon--two").off("click.openCloseMenuLevel2").on("click.openCloseMenuLevel2", function (event) {
  var $itemThis = $(this);
  var $target = $(event.target);
  var $li = $(this).closest("li");
  var $subMenu = $li.children(".gt_sub-menu2");

  if ($subMenu.length > 0) {
    var time = 40;
    var $iconClose = $itemThis.find(".gt_icon--close");
    var $iconOpen = $itemThis.find(".gt_icon--open");
    if ($subMenu.hasClass("gt_active")) {
      var $parent = $target.closest(".gt_sub-menu2");
      var $checkItem = $target.closest(".gt_submenu--mobile.gt_active .gt_dropdown--two .gt_submenu--two .gt_icon--two");
      if ($parent.length == 0 && $checkItem.length) {
        window.gtAnimations.SlideUp($subMenu[0], time, function () {
          $subMenu.removeClass("gt_active");
          $itemThis.removeClass("gt_active");
          $iconClose.show();
          $iconOpen.hide();
        });
      }
    } else {
      var $subFaqOrther = $section.find(".gt_dropdown--two > .gt_sub-menu2.gt_active").not($subMenu);
      if ($subFaqOrther && $subFaqOrther.length) {
        for (var i = 0; i < $subFaqOrther.length; i++) {
          var $item = jQuery($subFaqOrther[i]);
          window.gtAnimations.SlideUp($item[0], time, function () {
            $item.removeClass("gt_active");
            $item.prev().children(".gt_icon--two").removeClass("gt_active");
            $section.find(".gt_dropdown--two .gt_submenu--two > .gt_icon--two > .gt_icon--open").not($iconOpen).hide();
            $section.find(".gt_dropdown--two .gt_submenu--two > .gt_icon--two > .gt_icon--close").not($iconClose).show();
          });
        }
      }

      $itemThis.addClass("gt_active");
      $subMenu.addClass("gt_active");

      $iconClose.hide();
      $iconOpen.show();

      window.gtAnimations.SlideDown($subMenu[0], time);
    }
  }
});

// Close menu mobile
$(window).off("click.closeMenuMobileqoZPDvPIyQ1sItl").on("click.closeMenuMobileqoZPDvPIyQ1sItl", function (event) {
  var $target = $(event.target);
  var $parent = $target.closest(".gt_menu-mobile");
  var $show = $target.closest(".gt_show-menu");
  var $back = $target.closest(".gt_nav-mobile");
  if ($parent.length == 0 && $show.length == 0 && $back.length == 0) {
    closeMenu();
  }
});

// Khi scroll close menu mobile
$(window).off("scroll.closeMenuMobile1qoZPDvPIyQ1sItl").on("scroll.closeMenuMobile1qoZPDvPIyQ1sItl", function () {
  closeMenu();
});

// Đóng menu mobile
var closeMenu = function () {
  var $menu = $section.find(".gt_menu-mobile");
  $menu.removeClass("show-menu");
  $section.find(".gt_toggle-menus").removeClass("gt_toggle-menus-open");
  removeOverflowBody();
};

function setVariableWithWindowScreen() {
  windowWidth = $(window).width();
  if (windowWidth <= 576 ) {
    _stickyHeader = "enable";
    _spacingHeader = "15px";
    _headerOffsets = "0px";
  } else if (windowWidth <= 992) {
    _stickyHeader = "enable";
    _spacingHeader = "15px";
    _headerOffsets = "0px";
  } else if (windowWidth <= 1200) {
    _stickyHeader = "enable";
    _spacingHeader = "5px";
    _headerOffsets = "0px";
  } else {
    _stickyHeader = "enable";
    _spacingHeader = "5px";
    _headerOffsets = "35px";
  }
}

// Gán khoảng cách top cho header mobile
function setHeightOffsetToHeader() {
  var $topSubMenu = $section.find(".gt_menu-mobile");
  var headerOffset = $section.offset();
  var headerTop = headerOffset.top;
  var heightTop = $siteHeader.height();
  var topStick = heightTop + parseInt(_headerOffsets) + (parseInt(_spacingHeader)*2) + "px"; 
  var topNoStick = heightTop + headerTop + (parseInt(_spacingHeader)*2) + "px";
  if ($siteHeader.hasClass("gt_sticky-header gt_parent-sticky")) {
    $topSubMenu.css({
      top: heightTop + parseInt(_headerOffsets) + (parseInt(_spacingHeader)*2) + "px",
      height: "calc(" + "100%" + " - " + topStick + ")"
    });
  } else if (!$siteHeader.hasClass("gt_sticky-header gt_parent-sticky")){
    $topSubMenu.css({ 
      top: heightTop + headerTop + (parseInt(_spacingHeader)*2) + "px",
      height: "calc(" + "100%" + " - " + topNoStick + ")"
    });
  }
}

// Window resize
var delay = 0;
$(window).off("resize.checkSwitchScreensqoZPDvPIyQ1sItl").on("resize.checkSwitchScreensqoZPDvPIyQ1sItl", function () {
  clearTimeout(delay);
  delay = setTimeout(function () {
    setVariableWithWindowScreen();
    setHeightOffsetToHeader();
    calculatorWidthMenu();
    calculatorWidthSubMenu();
    removeOverflowBody();
    heightHeaderAdd();
  }, 200);
});

// Change count total cart
if (_cartCount == "true") {
  window.store.change("cart.item_count", function (cartNumber) {
    if ($section.find("span.gt_cart-count")) {
      $section.find("span.gt_cart-count").html(cartNumber);
    }
  });
} else if (_cartCount == "false") {
  window.store.change("cart.item_count", function (cartNumber) {
    if ($section.find("span.gt_cart--noti") && cartNumber > 0) {
      $section.find("span.gt_cart--noti").css("display", "block");
    } else {
      $section.find("span.gt_cart--noti").css("display", "none");
    }
  });
}

// Đặt lại trạng thái header mỗi khi thay đổi setting
function resetHeaderState() {
  if (_stickyHeader == "enable") {
    var checkScroll = $(document).scrollTop();

    if (checkScroll > 1) {
      $section.find(".gt_header").addClass("gt_sticky-header gt_parent-sticky");
    }
  }
}

window.store.change("isScrollToSection", function(value) {
  if(value) {
    closeMenu();
    window.store.update("isScrollToSection", false);
  }
});

// open cart drawer
var $cartButton = $section.find(".gt_show-cart");
window.SOLID.store.subscribe("addons", function(addons) {
  if (addons.cart_drawer && addons.cart_drawer.autoOpenCartDrawer) {
    $cartButton.removeAttr("href");
    $cartButton.on("click", function() {
      window.SOLID.store.dispatch("openCartPopup", "cart_drawer");
    });
  }
});

var delayCalculatorWidthMenu = null;
function calculatorWidthSubMenu() {
  clearTimeout(delayCalculatorWidthMenu);
  delayCalculatorWidthMenu = setTimeout(function () {
    var $submenuStyle2 = $section.find(".gt_header ul.gt_menu--nav li.gt_level--one .gt_sub-menu");
    if ($submenuStyle2 && $submenuStyle2.length > 0) {
      windowWidth = jQuery(window).width();
      for (var i = 0; i < $submenuStyle2.length; i++) {
        var $itemSubMenuStyle2 = jQuery($submenuStyle2[i]);
        $itemSubMenuStyle2.css({
          "transform": "translateX(-50%)"
        });
        var offsetLeftStyle2 = $itemSubMenuStyle2.offset().left;
        var itemWidth = $itemSubMenuStyle2.outerWidth();
        var diff = offsetLeftStyle2 + itemWidth - windowWidth;
        if (offsetLeftStyle2 < 0) {
          let left = offsetLeftStyle2 - 35;
          $itemSubMenuStyle2.css({
            "transform": "translateX(calc(-50% - " + left + "px))"
          });
        } else if (diff > 0) {
          let left = diff + 35;
          $itemSubMenuStyle2.css({
            "transform": "translateX(calc(-50% - " + left + "px))"
          });
        }
      }
    }
  }, 100);
}

function calculatorWidthMenu() {
  var $submenu = $section.find(".gt_header ul.gt_menu--nav li.gt_level--one");
  var $headerDes = $section.find(".gt_header .gt_header--desktop");
  if ($submenu && $submenu.length > 0) {
    windowWidth = jQuery(window).width();
    for (var i = 0; i < $submenu.length; i++) {
      var $itemSubMenu = jQuery($submenu[i]);
      var $triangle = $itemSubMenu.find(".gt_sub-menu");
      var $titleLevel1 = $itemSubMenu.find(".gt_menu--title");
      var titleWidth = $titleLevel1.width()/2;
      var headerWidth = $headerDes.outerWidth();
      var widthMinus = (headerWidth - $triangle.outerWidth())/2;
      var diff = (windowWidth - headerWidth)/2;
      var offsetLeft = ($itemSubMenu.offset().left) - diff;
      $triangle.attr("style", `--myVar: ${offsetLeft - widthMinus + titleWidth}px`);
    }
  }
}

function heightHeaderAdd() {
  var heightHeader = $siteHeader.outerHeight();
  var scrollTop = $(document).scrollTop();
  if (transparentHeader == "disable" && scrollTop > $siteHeader.outerHeight()) {
    $section.css ({
      height: heightHeader + "px",
    });
  } else if (transparentHeader == "disable" && scrollTop <= $siteHeader.outerHeight()) {
    $section.css ({
      height: "auto",
    });
  } else if (transparentHeader == "enable") {
    $section.css ({
      height: "auto",
    });
  }
}

        }
        funcESSectionqoZPDvPIyQ1sItl()
      } catch(e) {
        console.error("Error ESSection Id: qoZPDvPIyQ1sItl" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtomqoZPDvPIyQ1sItl_ButtonText = function() {
          /* Init Actions */
var $atoms = jQuery(".gt_atom-qoZPDvPIyQ1sItl_ButtonText");
if (!$atoms || !$atoms.length) {
  return;
}
/* Variables */
const interactionHover = {"name":"none","duration":"1.5","delay":0,"iterationCount":1};
const interactionNormal = {"name":"none","duration":"1.5","delay":0,"iterationCount":"infinite"};
const interactionWhilePress = {"name":"none","duration":"1.5","delay":0,"iterationCount":1};
const interactionScrollIntoView = "";
// animation
window.SOLID.library.animation({
  elementId: "qoZPDvPIyQ1sItl_ButtonText",
  $doms: $atoms,
  interactionNormal: {
    value: interactionNormal,
    previewAttr: "interactionButton"
  },
  interactionHover: {
    value: interactionHover,
    previewAttr: "interactionButtonHover"
  },
  interactionWhilePress: {
    value: interactionWhilePress,
    previewAttr: "interactionButtonWhitePress"
  },
  interactionScrollIntoView: {
    value: interactionScrollIntoView,
    previewAttr: "interactionScrollIntoView"
  },
  animationType: "block",
  mode: "production",
})

for (let i = 0; i < $atoms.length; i++) {
  const $atom = $atoms[i];
  // function customEvent(actions, id, key)
  
    $($atom).customEvent([], "qoZPDvPIyQ1sItl_ButtonText" + "_" + i);
  

  /* Listen if is button add to card */

  window.SOLID.store.subscribe("loading-buy-now-qoZPDvPIyQ1sItl_ButtonText" + "_" + i, function (isDisplay) {
    const $loadingEl = $($atom).find(".atom-button-loading-circle-loader");
    const $textEl = $($atom).find(".gt_button-content-text");
    if ($loadingEl && $loadingEl.length && $textEl && $textEl.length) {
      let timeout = undefined;
      if (isDisplay === true) {
        /* display loading button */
        clearTimeout(timeout);
        $loadingEl.css("display", "inline-block");
        $textEl.css("visibility", "hidden");
      } else if (isDisplay === "stop") {
        /* stop loading */
        $loadingEl.removeAttr("style");
        $textEl.removeAttr("style");
        window.SOLID.store.dispatch("loading-buy-now-qoZPDvPIyQ1sItl_ButtonText", "");
        window.SOLID.store.dispatch("loading-buy-now-qoZPDvPIyQ1sItl_ButtonText" + "_" + i, "");
      } else if (isDisplay === false){
        clearTimeout(timeout);
        /* display tick button */
        $loadingEl.addClass("load-complete");
        $loadingEl.find(".atom-button-loading-check-mark").css("display", "block");
        /* remove tick button and display text*/
        timeout = setTimeout(function() {
          $loadingEl.removeClass("load-complete");
          $loadingEl.find(".atom-button-loading-check-mark").removeAttr("style");
          $loadingEl.removeAttr("style");
          $textEl.removeAttr("style");
          window.SOLID.store.dispatch("loading-buy-now-qoZPDvPIyQ1sItl_ButtonText", "");
          window.SOLID.store.dispatch("loading-buy-now-qoZPDvPIyQ1sItl_ButtonText" + "_" + i, "");
        }, 3000);
      }
    }
  });
}

        }
        funcESAtomqoZPDvPIyQ1sItl_ButtonText()
      } catch(e) {
        console.error("Error ESAtom Id: qoZPDvPIyQ1sItl_ButtonText" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESSection7lAroFCpukqOYdK = function() {
          (function() {
  var elementClassName = ".gt_section-7lAroFCpukqOYdK";
  var id = "7lAroFCpukqOYdK";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    var product;
    var gtCurrentVariant;
    /* store get state block script */
    /* methods block script */
    function setup() {
      getProduct();
      listenVariantChange();
      whenSubmitSoldOutSuccess();
    }

    function listenVariantChange() {
      if (!product || !product.id) {
        return;
      }
      window.SOLID.store.subscribe("variant" + product.id, function(variant) {
        setTimeout(() => {
          gtCurrentVariant = variant;
          renderSoldOutForm();
        });
      });
    }

    function getProduct() {
      var productJson = $element.find(".ProductJson");
      productJson = JSON.parse(productJson.html());
      product = productJson;
      if (!product) {
        return;
      }
      gtCurrentVariant =
        product.selected_or_first_available_variant ||
        (product.variants.length && product.variants[0]);
      renderSoldOutForm();
    }

    function renderSoldOutForm() {
      var $formSoldout = $element.find(".gt_box-sold-out");
      if (!$formSoldout.length) {
        revertNormalStatus();
        return;
      }
      var form = $element.find("form");
      form.attr("action", "/cart/add");
      form.attr("enctype", "multipart/form-data");
      var formType = form.find("input[name='form_type']");
      formType.val("product");

      var elementQuantity = $element.find(".gt_fq-quantity");
      var elementInventory = $element.find(".gt_box-inventory");
      var elementInventoryProgress = $element.find(".gt_inventory-progress");
      var elementProductButtonAddToCart = $element.find(".gt_button--product");

      elementQuantity.removeClass("gt_product--hided");
      elementInventory.removeClass("gt_product--hided");
      elementInventoryProgress.removeClass("gt_product--hided");
      elementProductButtonAddToCart.removeClass("gt_product--hided");

      var publicFuncSoldOutForm = publicFunctionSoldOutForm();
      if (publicFuncSoldOutForm) {
        publicFuncSoldOutForm.setReturnTo(window.location.pathname);
        publicFuncSoldOutForm.hideForm();
        publicFuncSoldOutForm.hideMessageSuccess();
        publicFuncSoldOutForm.setProductName(product.title);
        publicFuncSoldOutForm.setVariantName(gtCurrentVariant.title);
        publicFuncSoldOutForm.setProductUrl(
          window.location.origin +
          "/products/" +
          product.handle +
          "?variant=" +
          gtCurrentVariant.id
        );
      }

      if (!gtCurrentVariant || !gtCurrentVariant.available) {
        if (publicFuncSoldOutForm) {
          publicFuncSoldOutForm.showForm();
          var atomId = `7lAroFCpukqOYdK_` + "productSoldOutForm";
          publicFuncSoldOutForm.setReturnTo(
            window.location.pathname +
            `?posted_successfully=true&id=${atomId}&d_variant_id=${gtCurrentVariant.id}`
          );
        }
        elementQuantity.addClass("gt_product--hided");
        elementInventory.addClass("gt_product--hided");
        elementInventoryProgress.addClass("gt_product--hided");
        elementProductButtonAddToCart.addClass("gt_product--hided");

        form.attr("action", "/contact");
        form.removeAttr("enctype");
        formType.val("contact");

        var queryUrl = getQueryByUrl();
        if (queryUrl && queryUrl.has_message && publicFuncSoldOutForm) {
          publicFuncSoldOutForm.hideForm();
          publicFuncSoldOutForm.showMessageSuccess();
          elementQuantity.addClass("gt_product--hided");
          elementInventory.addClass("gt_product--hided");
          elementInventoryProgress.addClass("gt_product--hided");
          elementProductButtonAddToCart.addClass("gt_product--hided");
          removeQueryCurrentUrl("has_message");
        }
      }
    }

    function whenSubmitSoldOutSuccess() {
      window.onload = function() {
        var queryUrl = getQueryByUrl();
        if (queryUrl.status) {
          if (!queryUrl.variant_id || !product || !product.id) {
            return;
          }
          var currentVariant =
            product.variants &&
            product.variants.length &&
            product.variants.find(
              (variant) => variant.id == queryUrl.variant_id
            );
          if (!currentVariant) {
            return;
          }
          setTimeout(() => {
            window.SOLID.store.dispatch("variant" + product.id, currentVariant);
            gtCurrentVariant = currentVariant;
            removeQueryCurrentUrl("posted_successfully");
            removeQueryCurrentUrl("id");
            removeQueryCurrentUrl("d_variant_id");
            setQueryCurrentUrl("has_message", true);
          });
        }
      };
    }

    function publicFunctionSoldOutForm() {
      var atomId = `7lAroFCpukqOYdK_` + "productSoldOutForm";
      if (atomId) {
        var atomSoldOutPublicFunc =
          window.SOLID.public &&
          window.SOLID.public["atom" + "_" + atomId + "_" + 0];
        if (atomSoldOutPublicFunc) {
          return atomSoldOutPublicFunc;
        }
        return;
      }
      return;
    }

    function getQueryByUrl() {
      const urlParams = new URLSearchParams(window.location.search);
      const status = urlParams.get("posted_successfully");
      const currentVariantId = urlParams.get("d_variant_id");
      const hasMessage = urlParams.get("has_message");
      return {
        status: status,
        variant_id: currentVariantId,
        has_message: hasMessage,
      };
    }

    function removeQueryCurrentUrl(param) {
      //ConstructURLSearchParamsobjectinstancefromcurrentURLquerystring.
      var queryParams = new URLSearchParams(window.location.search);

      //Set new ormodifyexistingparametervalue.
      if (queryParams.has(param)) {
        queryParams.delete(param);
      }

      //Replacecurrentquerystringwiththe new one.
      history.replaceState(null, null, "?" + queryParams.toString());
    }

    function setQueryCurrentUrl(param, value) {
      //ConstructURLSearchParamsobjectinstancefromcurrentURLquerystring.
      var queryParams = new URLSearchParams(window.location.search);

      //Set new ormodifyexistingparametervalue.
      queryParams.set(param, value);

      //Replacecurrentquerystringwiththe new one.
      history.replaceState(null, null, "?" + queryParams.toString());
    }

    function subscribeBoxDestroy() {
      revertNormalStatus();
    }

    function revertNormalStatus() {
      var elementQuantity = $element.find(".gt_fq-quantity");
      var elementInventory = $element.find(".gt_box-inventory");
      var elementInventoryProgress = $element.find(".gt_inventory-progress");
      var elementProductButtonAddToCart = $element.find(".gt_button--product");

      elementQuantity.removeClass("gt_product--hided");
      elementInventory.removeClass("gt_product--hided");
      elementInventoryProgress.removeClass("gt_product--hided");
      elementProductButtonAddToCart.removeClass("gt_product--hided");
    }
    /* init block script */
    setup();
    /* store subscribe block script */
    store.subscribe("component-7lAroFCpukqOYdK_productSoldOutForm-destroy", subscribeBoxDestroy);

    function destroy() {
      store.unsubscribe("component-7lAroFCpukqOYdK_productSoldOutForm-destroy", subscribeBoxDestroy);
    }
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESSection7lAroFCpukqOYdK()
      } catch(e) {
        console.error("Error ESSection Id: 7lAroFCpukqOYdK" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom7lAroFCpukqOYdK_box = function() {
          (function() {
  var elementClassName = ".gt_atom-7lAroFCpukqOYdK_box";
  var id = "7lAroFCpukqOYdK_box";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "7lAroFCpukqOYdK_box",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }

    function checkRemoteDefaultInput() {
      if (isExistAtomVariant()) {
        var $inputVariantDefault = $element.find(".gt_variant-input--default");
        if ($inputVariantDefault && $inputVariantDefault.length) {
          $($inputVariantDefault[0]).remove()
        }
      }

      if (isExistAtomQuantity()) {
        var $inputQuantityDefault = $element.find(".gt_quantity-input--default");
        if ($inputQuantityDefault && $inputQuantityDefault.length) {
          $($inputQuantityDefault[0]).remove()
        }
      }
    }

    function isExistAtomVariant() {
      var $atomProduct = $element.find(".gt_variant--input")
      if ($atomProduct && $atomProduct.length) {
        return true
      }
      return false
    }

    function isExistAtomQuantity() {
      var $atomQuantity = $element.find(".gt_quantity--input")
      if ($atomQuantity && $atomQuantity.length) {
        return true
      }
      return false
    }
    /* init block script */
    addInteraction();
    checkRemoteDefaultInput();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
    var $target = $($elements[indexEl]);
    script($target, indexEl);
  }
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom7lAroFCpukqOYdK_box()
      } catch(e) {
        console.error("Error ESAtom Id: 7lAroFCpukqOYdK_box" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom7lAroFCpukqOYdK_boxImage = function() {
          (function() {
  var elementClassName = ".gt_atom-7lAroFCpukqOYdK_boxImage";
  var id = "7lAroFCpukqOYdK_boxImage";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "7lAroFCpukqOYdK_boxImage",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
    var $target = $($elements[indexEl]);
    script($target, indexEl);
  }
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom7lAroFCpukqOYdK_boxImage()
      } catch(e) {
        console.error("Error ESAtom Id: 7lAroFCpukqOYdK_boxImage" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom7lAroFCpukqOYdK_productImageList = function() {
          (function() {
  var elementClassName = ".gt_atom-7lAroFCpukqOYdK_productImageList";
  var id = "7lAroFCpukqOYdK_productImageList";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    var mode = "production";
    var checkWindowWidth = $(window).width();
    var widthSliderCurrent;
    var sizeIconDotsCurrent;
    var imageListPositionCurrent;
    var $imgSlide = $element.find(".gt_product-carousel-box");
    var $imgBox = $element.find(".gt_product-img-box");
    var $imgBoxInner = $element.find(".gt_product-img--inner");
    var $imgSlideItem = $element.find(".gt_product-carousel--item");
    var $productImgInner = $element.find(".gt_product-image--thumb");
    var $controlNext = $element.find(".gt_product--swiper .gt_control-next");
    var $controlPrev = $element.find(".gt_product--swiper .gt_control-prev");
    var dynamicDotsOnOff = "false" === "true";
    var slidesPerView_lg = "4.3";
    var slidesPerView_md = "4.3";
    var slidesPerView_sm = "5";
    var slidesPerView_xs = "5";
    var spaceBetween_lg = parseInt("32") || 1;
    var spaceBetween_md = parseInt("32") || 1;
    var spaceBetween_sm = parseInt("32") || 1;
    var spaceBetween_xs = parseInt("18") || 1;
    var widthActive = "false" === "true";
    var widthSlider = "100%";
    var widthSlider_lg = "100%";
    var widthSlider_md = "100%";
    var widthSlider_sm = "100%";
    var widthSlider_xs = "100%";
    var sizeIconDots_sm = "20px";
    var sizeIconDots_xs = "15px";
    var imageRadio = "square";
    var hideDisplayProductImageAdvanced = "false" === "true";
    let initShowFeatureImage = false;
    let initShow3DModel = false;
    let initShowExVideo = false;
    let initShowOtherVideo = false;
    if (hideDisplayProductImageAdvanced) {
      initShowFeatureImage = "featureImage" === "featureImage";
    } else {
      initShowFeatureImage = "featureImageAdvanced" === "featureImageAdvanced";
      initShow3DModel = "featureImageAdvanced" === "3DModel";
      initShowExVideo = "featureImageAdvanced" === "exVideo";
      initShowOtherVideo = "featureImageAdvanced" === "otherVideo";
    }
    var imageListPosition = "bottom";
    var imageListPosition_lg = "bottom";
    var imageListPosition_md = "bottom";
    var imageListPosition_sm = "bottom";
    var imageListPosition_xs = "bottom";
    var imageListActive = "false" === "true";
    var spaceBetween_sm = "32";
    var spaceBetween_xs = "18";
    var scaleZoomImageActive = "true" === "true";
    var mySwiper;
    var mySwiperFeature;
    var spacingSmall = "16px";
    var displayTypeThumb = "thumb" === "thumb";
    var displayTypeCenter = "thumb" === "center";
    var allowDragSlider = "false" === "true";
    /* store get state block script */
    /* methods block script */
    function listen() {
      let observer = new ResizeObserver(() => {
        if (mySwiper) {
          mySwiper.update()
        }
      })
      observer.observe($element[0]);
    }

    function autoRotateModel() {
      var model = $element.find(".gt_product-media--feature .gt_product-model");
      model.attr("auto-rotate", true);
    }

    function initSlider() {
      if (mySwiper) {
        mySwiper.destroy();
      }
      var $swiperContainer = $element.find(".gt_product--swiper-7lAroFCpukqOYdK_productImageList");
      if (!$swiperContainer || !$swiperContainer.length) {
        return;
      }

      if ($swiperContainer[0].swiper) {
        $swiperContainer[0].swiper.destroy();
      }

      if (mySwiperFeature) {
        mySwiperFeature.destroy();
      }

      if ($swiperContainer.find(".swiper-slide").length == 1) {
        $swiperContainer.addClass("gt_disabled");
      }

      var $swiperContainerFeature = $element.find(".gt_product-feature--swiper-7lAroFCpukqOYdK_productImageList");
      if (!$swiperContainerFeature || !$swiperContainerFeature.length) {
        return;
      }

      if ($swiperContainerFeature[0].swiper) {
        $swiperContainerFeature[0].swiper.destroy();
      }

      if ($swiperContainerFeature.find(".swiper-slide").length == 1) {
        $swiperContainerFeature.find(".swiper-wrapper").addClass("gt_disabled");
        $swiperContainerFeature.find(".gt_control-pagination").addClass("gt_disabled");
      }
      let gtProductImageParams = {
        $element: $element,
        settings: {
          classSwiperItems: ".gt_product--swiper-7lAroFCpukqOYdK_productImageList .gt_product-carousel--item",
          classSwiperItemsImage: ".gt_product--swiper-7lAroFCpukqOYdK_productImageList .gt_product-carousel--item img",
          classSwiperContainer: ".gt_product--swiper-7lAroFCpukqOYdK_productImageList",
          initShowFeatureImage: initShowFeatureImage,
          initShow3DModel: initShow3DModel,
          initShowExVideo: initShowExVideo,
          initShowOtherVideo: initShowOtherVideo,
          swiperSetting: getDataSwiperSettings(),
          //featureimageswiper
          featureSwiperSetting: getDataSwiperSettingsFeature(),
          classFeatureSwiperContainer: ".gt_product-feature--swiper-7lAroFCpukqOYdK_productImageList",
          classFeatureSwiperItemsImage: ".gt_product-feature--swiper-7lAroFCpukqOYdK_productImageList .gt_product-image--feature",
        }
      }

      window.SOLID.library.gtProductImagesV2(gtProductImageParams);

      mySwiper = $swiperContainer[0].swiper;
      mySwiperFeature = $swiperContainerFeature[0].swiper;
    }

    function listen() {
      let observer = new ResizeObserver(() => {
        if (mySwiper) {
          mySwiper.update()
        }
      })
      observer.observe($element[0]);
    }

    function getDataSwiperSettings() {
      let direction = 'horizontal';
      if (displayTypeThumb) {
        if (imageListPositionCurrent === "left" || imageListPositionCurrent === "right") {
          direction = "vertical";
        }
      }

      let loop = false;
      let centeredSlides = false;
      let freeMode = true;
      if (displayTypeCenter && checkWindowWidth > 992) {
        loop = true;
        centeredSlides = true;
        freeMode = false;
      }
      return {
        mousewheel: false,
        loop: loop,
        centeredSlides: centeredSlides,
        slidesPerView: 3,
        spaceBetween: 16,
        freeMode: freeMode,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        navigation: {
          nextEl: ".gt_product--swiper-7lAroFCpukqOYdK_productImageList .gt_control-next",
          prevEl: ".gt_product--swiper-7lAroFCpukqOYdK_productImageList .gt_control-prev",
        },
        breakpoints: {
          0: {
            slidesPerView: slidesPerView_xs,
            spaceBetween: spaceBetween_xs,
            direction: direction,
            mousewheel: false,
            pagination: {
              dynamicBullets: dynamicDotsOnOff,
              dynamicMainBullets: 1,
            },
          },
          577: {
            slidesPerView: slidesPerView_sm,
            spaceBetween: spaceBetween_sm,
            direction: direction,
            mousewheel: false,
            pagination: {
              dynamicBullets: dynamicDotsOnOff,
              dynamicMainBullets: 1,
            },
          },
          993: {
            slidesPerView: slidesPerView_md,
            spaceBetween: spaceBetween_md,
            direction: direction,
            mousewhel: true,
          },
          1201: {
            slidesPerView: slidesPerView_lg,
            spaceBetween: spaceBetween_lg,
            direction: direction,
            mousewhel: true,
          }
        },
        on: {
          init: function() {
            window.SOLID.store.dispatch("trigger-lazyload", true);
          },
          imagesReady: function() {
            if (displayTypeCenter && checkWindowWidth > 992) {
              setTimeout(() => {
                var $swiperWrapperHide = $element.find(".gt_swiper_wrapper-type-center");
                if ($swiperWrapperHide && $swiperWrapperHide.length) {
                  $swiperWrapperHide.removeClass("gt_swiper_wrapper-type-center");
                }
              }, 100)
            }
          }
        },
      }
    }

    function getDataSwiperSettingsFeature() {
      let allowTouchMove = false;
      var productImageFeature = $element.find(".gt_product-image--feature");
      if (allowDragSlider && !productImageFeature.hasClass("gt_product-media--model") || displayTypeCenter) {
        allowTouchMove = true;
      }
      return {
        allowTouchMove: allowTouchMove,
        slidesPerView: 1,
        spaceBetween: 16,
        navigation: {
          nextEl: ".gt_product-feature--swiper-7lAroFCpukqOYdK_productImageList .gt_product-img-nav--right",
          prevEl: ".gt_product-feature--swiper-7lAroFCpukqOYdK_productImageList .gt_product-img-nav--left",
        },
        pagination: {
          el: "#gt_control-pagination-7lAroFCpukqOYdK_productImageList",
          type: 'bullets',
          clickable: true,
          renderBullet: function(index, classname) {
            return `<div class="gt_control-pagination-item ` + classname + ` ">
            <span data-optimize-type="icon"  data-attribute="iconDots,"  data-section-id="7lAroFCpukqOYdK_productImageList"  class="gt_icon"><svg height="100%" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12.5 22C13.05 22 13.5 21.55 13.5 21V3C13.5 2.45 13.05 2 12.5 2C11.95 2 11.5 2.45 11.5 3V21C11.5 21.55 11.95 22 12.5 22ZM8.5 18C9.05 18 9.5 17.55 9.5 17V7C9.5 6.45 9.05 6 8.5 6C7.95 6 7.5 6.45 7.5 7V17C7.5 17.55 7.95 18 8.5 18ZM5.5 13C5.5 13.55 5.05 14 4.5 14C3.95 14 3.5 13.55 3.5 13V11C3.5 10.45 3.95 10 4.5 10C5.05 10 5.5 10.45 5.5 11V13ZM16.5 18C17.05 18 17.5 17.55 17.5 17V7C17.5 6.45 17.05 6 16.5 6C15.95 6 15.5 6.45 15.5 7V17C15.5 17.55 15.95 18 16.5 18ZM19.5 13V11C19.5 10.45 19.95 10 20.5 10C21.05 10 21.5 10.45 21.5 11V13C21.5 13.55 21.05 14 20.5 14C19.95 14 19.5 13.55 19.5 13Z" fill="currentColor"/> </svg></span>
          </div>`;
          }
        },
        breakpoints: {
          0: {
            pagination: {
              dynamicBullets: dynamicDotsOnOff,
              dynamicMainBullets: 1,
            },
          },
          577: {
            pagination: {
              dynamicBullets: dynamicDotsOnOff,
              dynamicMainBullets: 1,
            },
          }
        },
      }
    }

    function changeSliderActive(value) {
      if (value && value.sliderIndex !== NaN) {
        if (loop) {
          mySwiper.slideToLoop(value.sliderIndex, 500, true);
        } else {
          mySwiper.slideTo(value.sliderIndex, 500, true);
        }
      }
    }

    function isImgSliderBottom() {
      const $productImage = $element.find(".gt_product-image-list--bottom");
      if ($productImage && $productImage.length) {
        return true;
      }
      return false;
    }

    function checkImageListActive() {
      checkWindowWidth = $(window).width();
      if (checkWindowWidth <= 576) {
        if (imageListActive) {
          slidesPerView_xs = "5";
          spaceBetween_xs = "18";
        } else if (!imageListActive) {
          slidesPerView_xs = 1;
          spaceBetween_xs = 0;
        }
      } else if (checkWindowWidth <= 992) {
        if (imageListActive) {
          slidesPerView_sm = "5";
          spaceBetween_sm = "32"
        } else if (!imageListActive) {
          slidesPerView_sm = 1;
          spaceBetween_sm = 0;
        }
      }
    }

    function calculatorImageSlideHeight() {
      var delay = setTimeout(function() {
        checkWindowWidth = $(window).width();
        if (!isImgSliderBottom()) {
          $imgBox = $element.find(".gt_product-img-box");
          var imgBoxHeight = $imgBox && $imgBox.length && $imgBox[0].offsetHeight;
          $imgSlide.css("height", imgBoxHeight);
          mySwiper.update();
        } else {
          $imgSlide.css("height", "");
        }
      }, 500);
    }

    function optimizeSizeIconDots(value) {
      mySwiper.pagination.render();
      var $paginationItem = $element.find(".gt_control-pagination-item");
      var $paginationItemIcon = $element.find(".gt_control-pagination-item .gt_icon");
      checkWindowWidth = $(window).width();
      if (checkWindowWidth <= 576) {
        sizeIconDots_xs = value;
      } else if (checkWindowWidth <= 992) {
        sizeIconDots_sm = value;
      }
      $paginationItemIcon.css("cssText", "width: " + value + " !important; height: " + value + "!important;");
      $paginationItem.css("cssText", "width: calc(8px + " + value + ") !important; height: calc(8px + " + value + ") !important;");
      mySwiper.pagination.update();
    }

    function optimizeSlidePerView(value) {
      checkWindowWidth = $(window).width();
      if (checkWindowWidth <= 576) {
        slidesPerView_xs = value;
      } else if (checkWindowWidth <= 992) {
        slidesPerView_sm = value;
      } else if (checkWindowWidth <= 1200) {
        slidesPerView_md = value;
      } else {
        slidesPerView_lg = value;
      }
      initSlider();
    }

    function optimizeWidthSlider(value) {
      checkWindowWidth = $(window).width();
      if (checkWindowWidth <= 576) {
        widthSlider_xs = value;
      } else if (checkWindowWidth <= 992) {
        widthSlider_sm = value;
      } else if (checkWindowWidth <= 1200) {
        widthSlider_md = value;
      } else {
        widthSlider_lg = widthSlider = value;
      }
      $element.css("cssText", "width: " + value + " !important;");
      mySwiper.update();
      calculatorImageSlideHeight();
    }

    function optimizeWidthActive(value) {
      widthActive = value;
      if (!value) {
        $element.css("cssText", "width: null");
      } else {
        checkWindowWidth = $(window).width();
        widthSliderCurrent = 0;
        if (checkWindowWidth <= 576) {
          widthSliderCurrent = widthSlider_xs;
        } else if (checkWindowWidth <= 992) {
          widthSliderCurrent = widthSlider_sm;
        } else if (checkWindowWidth <= 1200) {
          widthSliderCurrent = widthSlider_md;
        } else {
          widthSliderCurrent = widthSlider;
        }
        $element.css("cssText", "width: " + widthSliderCurrent + " !important;");
        initSlider();
        mySwiper.update();
      }
    }

    function checkImageListPosition({
      isInit
    } = {}) {
      checkWindowWidth = $(window).width();
      if (checkWindowWidth <= 576) {
        imageListPositionCurrent = imageListPosition_xs;
        spacingSmall = "10px";
      } else if (checkWindowWidth <= 992) {
        imageListPositionCurrent = imageListPosition_sm;
        spacingSmall = "16px";
      } else if (checkWindowWidth <= 1200) {
        imageListPositionCurrent = imageListPosition_md;
        spacingSmall = "16px";
      } else {
        imageListPositionCurrent = imageListPosition;
        spacingSmall = "16px";
      }
      $element.find("#gt_product-image-list-id").attr("class", "gt_product-image-list--" + imageListPositionCurrent);
      //showimage
      var $swiperWrapperHide = $element.find(".gt-carousel--hide-default");
      if ($swiperWrapperHide && $swiperWrapperHide.length) {
        $swiperWrapperHide.removeClass("gt-carousel--hide-default");
      }
      if (imageListPositionCurrent !== "bottom") {
        var $productImageListWrapper = $element.find(".gt_product-carousel-box");
        var $productImageBox = $element.find(".gt_product-image--inner");
        $productImageListWrapper.css("height", $productImageBox.outerHeight());
      }
      //css
      if (imageListPositionCurrent === "left" || imageListPositionCurrent === "right") {
        $controlNext.css({
          "height": "auto",
          "width": "100%"
        });
        $controlPrev.css({
          "height": "auto",
          "width": "100%"
        });
      }
      if (imageListPositionCurrent === "left") {
        $productImgInner.css("flex-direction", "row-reverse");
        $imgSlide.css({
          "padding-left": "0",
          "padding-right": spacingSmall
        });
      } else if (imageListPositionCurrent === "right") {
        $productImgInner.css("flex-direction", "row");
        $imgSlide.css({
          "padding-right": "0",
          "padding-left": spacingSmall
        });
      } else {
        $productImgInner.css("flex-direction", "column");
        $imgSlide.css("padding", "");
        $controlNext.css({
          "height": "100%",
          "width": "auto"
        });
        $controlPrev.css({
          "height": "100%",
          "width": "auto"
        });
      }
      if (!isInit) {
        initSlider();
        mySwiper.update();
      }
    }

    function optimizeImageListPosition(value) {
      checkWindowWidth = $(window).width();
      if (checkWindowWidth <= 576) {
        imageListPosition_xs = imageListPositionCurrent = value;
      } else if (checkWindowWidth <= 992) {
        imageListPosition_sm = imageListPositionCurrent = value;
      } else if (checkWindowWidth <= 1200) {
        imageListPosition_md = imageListPositionCurrent = value;
      } else {
        imageListPosition_lg = imageListPositionCurrent = imageListPosition = value;
      }
      if (imageListPositionCurrent === "left" || imageListPositionCurrent === "right") {
        $controlNext.css({
          "height": "auto",
          "width": "100%"
        });
        $controlPrev.css({
          "height": "auto",
          "width": "100%"
        });
      }
      if (imageListPositionCurrent === "left") {
        $productImgInner.css("flex-direction", "row-reverse");
        $imgSlide.css({
          "padding-left": "0",
          "padding-right": spacingSmall
        });
      } else if (imageListPositionCurrent === "right") {
        $productImgInner.css("flex-direction", "row");
        $imgSlide.css({
          "padding-right": "0",
          "padding-left": spacingSmall
        });
      } else {
        $productImgInner.css("flex-direction", "column");
        $imgSlide.css("padding", "");
        $controlNext.css({
          "height": "100%",
          "width": "auto"
        });
        $controlPrev.css({
          "height": "100%",
          "width": "auto"
        });
      }
      $element.find("#gt_product-image-list-id").attr("class", "gt_product-image-list--" + value);
      initSlider();
      mySwiper.update();
      calculatorImageSlideHeight();
    }

    function optimizeImageRadio(imageRadio) {
      checkWindowWidth = $(window).width();
      imageRadio = value;
      if (imageRadio === "square") {
        $imgBoxInner.css("padding-top", "calc(100%)");
      } else if (imageRadio === "landscape") {
        $imgBoxInner.css("padding-top", "calc(100% * 3 / 4)");
      } else if (imageRadio === "portrait") {
        $imgBoxInner.css("padding-top", "calc(100% * 4 / 3)");
      }
      if (isImgSliderBottom() || checkWindowWidth < 992) {
        if (imageRadio === "square") {
          $imgSlideItem.css("padding-top", "calc(100%)");
        } else if (imageRadio === "landscape") {
          $imgSlideItem.css("padding-top", "calc(100% * 3 / 4)");
        } else if (imageRadio === "portrait") {
          $imgSlideItem.css("padding-top", "calc(100% * 4 / 3)");
        }
      }
      calculatorImageSlideHeight();
    }

    function optimizeImageRadioActive(value) {
      if (!value) {
        $imgBoxInner.css("padding-top", "");
        $imgSlideItem.css("padding-top", "");
      } else {
        optimizeImageRadio(imageRadio);
      }
      calculatorImageSlideHeight();
    }

    function optimizeDynamicDotsOnOff(value) {
      dynamicDotsOnOff = value;
      initSlider();
      var paginationEl = mySwiperFeature.pagination.el;
      if (value) {
        paginationEl.style.cssText = paginationEl.style.cssText + "margin: 0px auto; transform: translateX(0px); justify-content: unset;";
      } else {
        paginationEl.style.cssText = paginationEl.style.cssText + "justify-content: center;";
        paginationEl.classList.remove("swiper-pagination-bullets-dynamic");
      }
      mySwiperFeature.pagination.update();
      mySwiperFeature.update();
    }

    function getMySwiper() {
      return mySwiper;
    }

    function getMySwiperFeature() {
      return mySwiperFeature;
    }
    /* init block script */
    listen();
    if (scaleZoomImageActive) {
      var productImageFeature = $element.find(".gt_product-image--feature");
      if (productImageFeature && productImageFeature.length) {
        $element.find(".gt_product-image--scale").gfProductZoomImage({
          classHoverItem: ".gt_product-img-box",
          scale: "1.5",
          classSection: ".gt_atom-7lAroFCpukqOYdK_productImageList",
        });
      }
    }
    autoRotateModel();
    checkImageListPosition({
      isInit: true
    });
    checkImageListActive();
    initSlider();
    calculatorImageSlideHeight();

    var delayResize = 0;
    $(window).off("resize.checkSwitchScreens7lAroFCpukqOYdK_productImageList").on("resize.checkSwitchScreens7lAroFCpukqOYdK_productImageList", function() {
      clearTimeout(delayResize);
      delayResize = setTimeout(function() {
        const windowWidthCurrent = $(window).width();
        if (windowWidthCurrent !== checkWindowWidth) {
          checkWindowWidth = windowWidthCurrent;
          widthSliderCurrent = 0;
          sizeIconDotsCurrent = 0;
          if (checkWindowWidth <= 576) {
            widthSliderCurrent = widthSlider_xs;
            sizeIconDotsCurrent = sizeIconDots_xs;
          } else if (checkWindowWidth <= 992) {
            widthSliderCurrent = widthSlider_sm;
            sizeIconDotsCurrent = sizeIconDots_sm;
          } else if (checkWindowWidth <= 1200) {
            widthSliderCurrent = widthSlider_md;
          } else {
            widthSliderCurrent = widthSlider;
          }
          if (widthActive) {
            $element.css("cssText", "width: " + widthSliderCurrent + " !important;");
            mySwiper.update();
          }
          var $paginationItem = $element.find(".gt_control-pagination-item");
          var $paginationItemIcon = $element.find(".gt_control-pagination-item .gt_icon");
          $paginationItemIcon.css("cssText", "width: " + sizeIconDotsCurrent + " !important; height: " + sizeIconDotsCurrent + "!important;");
          $paginationItem.css("cssText", "width: calc(8px + " + sizeIconDotsCurrent + ") !important; height: calc(8px + " + sizeIconDotsCurrent + ") !important;");

          checkImageListPosition();
          calculatorImageSlideHeight();
          checkImageListActive();
          initSlider();
        }
      }, 100)
    });

    if ($element.find(".swiper-slide").length == 1) {
      $element.find('.swiper-wrapper').addClass("gt_disabled");
      $element.find('.gt_control-pagination').addClass("gt_disabled");
    }
    /* store subscribe block script */
    store.subscribe("optimize-7lAroFCpukqOYdK_productImageList-sizeIconDots", optimizeSizeIconDots);
    store.subscribe("optimal-7lAroFCpukqOYdK_productImageList-slidesPerView", optimizeSlidePerView);
    store.subscribe("optimal-7lAroFCpukqOYdK_productImageList-widthSlider", optimizeWidthSlider);
    store.subscribe("optimal-7lAroFCpukqOYdK_productImageList-widthActive", optimizeWidthActive);
    store.subscribe("optimal-7lAroFCpukqOYdK_productImageList-imageRadio", optimizeImageRadio);
    store.subscribe("optimal-7lAroFCpukqOYdK_productImageList-imageRadioActive", optimizeImageRadioActive);
    store.subscribe("optimal-7lAroFCpukqOYdK_productImageList-dynamicDotsOnOff", optimizeDynamicDotsOnOff);
    store.subscribe("optimal-7lAroFCpukqOYdK_productImageList-imageListPosition", optimizeImageListPosition);
    store.subscribe("trigger-slider-7lAroFCpukqOYdK_productImageList", changeSliderActive);

    function destroy() {
      store.unsubscribe("optimize-7lAroFCpukqOYdK_productImageList-sizeIconDots", optimizeSizeIconDots);
      store.unsubscribe("optimal-7lAroFCpukqOYdK_productImageList-slidesPerView", optimizeSlidePerView);
      store.unsubscribe("optimal-7lAroFCpukqOYdK_productImageList-widthSlider", optimizeWidthSlider);
      store.unsubscribe("optimal-7lAroFCpukqOYdK_productImageList-widthActive", optimizeWidthActive);
      store.unsubscribe("optimal-7lAroFCpukqOYdK_productImageList-imageRadio", optimizeImageRadio);
      store.unsubscribe("optimal-7lAroFCpukqOYdK_productImageList-imageRadioActive", optimizeImageRadioActive);
      store.unsubscribe("optimal-7lAroFCpukqOYdK_productImageList-dynamicDotsOnOff", optimizeDynamicDotsOnOff);
      store.unsubscribe("optimal-7lAroFCpukqOYdK_productImageList-imageListPosition", optimizeImageListPosition);
      store.unsubscribe("trigger-slider-7lAroFCpukqOYdK_productImageList", changeSliderActive);
    }
    /* events block script */
    /* destroy block script */
    
    /* public func block script */
    return {
      initSlider,
      getMySwiper,
      getMySwiperFeature,
      checkImageListPosition,
      calculatorImageSlideHeight,
      checkImageListActive
    };
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      var publicFunc = script($target, indexEl);
      window.SOLID.public = window.SOLID.public || {};
      window.SOLID.public["atom" + "_" + id + "_" + indexEl] = publicFunc;
      if (publicFunc) {
        store.dispatch("public_function_atom_" + id, publicFunc);
      }
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom7lAroFCpukqOYdK_productImageList()
      } catch(e) {
        console.error("Error ESAtom Id: 7lAroFCpukqOYdK_productImageList" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom7lAroFCpukqOYdK_productTagSale = function() {
          (function() {
  var elementClassName = ".gt_atom-7lAroFCpukqOYdK_productTagSale";
  var id = "7lAroFCpukqOYdK_productTagSale";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const roundPercent = Number("0");
    const removeZeros = "true" === "true";
    /* store get state block script */
    /* methods block script */
    /* init block script */
    window.SOLID.library.gtProductSaveV2({
      $element: $element,
      settings: {
        classTextPercent: ".gt_product-tag-sale--value--percent",
        classTextNumber: ".gt_product-tag-sale--value--number",
        dataFormat: "[!Profit!] off",
        dataFormatKey: "[!Profit!]",
        customCurrencyFormating: "shortPrefix",
        roundPercent: roundPercent,
        roundNoZeroes: removeZeros
      }
    });
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
    var $target = $($elements[indexEl]);
    script($target, indexEl);
  }
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom7lAroFCpukqOYdK_productTagSale()
      } catch(e) {
        console.error("Error ESAtom Id: 7lAroFCpukqOYdK_productTagSale" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom7lAroFCpukqOYdK_boxInfo = function() {
          (function() {
  var elementClassName = ".gt_atom-7lAroFCpukqOYdK_boxInfo";
  var id = "7lAroFCpukqOYdK_boxInfo";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "7lAroFCpukqOYdK_boxInfo",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
    var $target = $($elements[indexEl]);
    script($target, indexEl);
  }
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom7lAroFCpukqOYdK_boxInfo()
      } catch(e) {
        console.error("Error ESAtom Id: 7lAroFCpukqOYdK_boxInfo" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom7lAroFCpukqOYdK_productTitle = function() {
          (function() {
  var elementClassName = ".gt_atom-7lAroFCpukqOYdK_productTitle";
  var id = "7lAroFCpukqOYdK_productTitle";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "7lAroFCpukqOYdK_productTitle",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        };
        var settingsText = {
          elementId: "7lAroFCpukqOYdK_productTitle",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        };
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          };
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          };
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          };
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom7lAroFCpukqOYdK_productTitle()
      } catch(e) {
        console.error("Error ESAtom Id: 7lAroFCpukqOYdK_productTitle" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom7lAroFCpukqOYdK_productSKU = function() {
          (function() {
  var elementClassName = ".gt_atom-7lAroFCpukqOYdK_productSKU";
  var id = "7lAroFCpukqOYdK_productSKU";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const labelSKU = `SKU:`;
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    var $fakeDiv = document.createElement("div");
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "7lAroFCpukqOYdK_productSKU",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block",
        };
        var settingsText = {
          elementId: "7lAroFCpukqOYdK_productSKU",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text",
        };
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          };
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          };
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover",
          };
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function listenVariantChange() {
      window.store.change("variant" + _productJson.id, function(newVariant) {
        if (!newVariant || !newVariant.sku) {
          $element.find(".gt_variant-sku").empty().addClass("gt_hide");
          $element.find(".gt_label-sku").empty().addClass("gt_hide");
        } else {
          $element.find(".gt_variant-sku").text(newVariant.sku).removeClass("gt_hide");
          $element.find(".gt_label-sku").html(decodeEntities(labelSKU)).removeClass("gt_hide");
        }
      });
    }

    function decodeEntities(str) {
      if (str && typeof str === "string") {
        //stripscript/htmltags
        str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, "");
        str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, "");
        $fakeDiv.innerHTML = str;
        str = $fakeDiv.textContent;
        $fakeDiv.textContent = "";
      }

      return str;
    }
    /* init block script */
    addInteraction();

    /*variantchange*/
    if ("production" === "production") {
      var productJsonText = $element.closest("[keyword='product'], [data-keyword='product']").find(".ProductJson").text();
      var _productJson = null;
      try {
        if (productJsonText) {
          _productJson = JSON.parse(productJsonText);
          listenVariantChange();
        }
      } catch (e) {
        console.log(e);
      }
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
    var $target = $($elements[indexEl]);
    script($target, indexEl);
  }
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom7lAroFCpukqOYdK_productSKU()
      } catch(e) {
        console.error("Error ESAtom Id: 7lAroFCpukqOYdK_productSKU" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom7lAroFCpukqOYdK_productVendor = function() {
          (function() {
  var elementClassName = ".gt_atom-7lAroFCpukqOYdK_productVendor";
  var id = "7lAroFCpukqOYdK_productVendor";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "7lAroFCpukqOYdK_productVendor",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "7lAroFCpukqOYdK_productVendor",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
    var $target = $($elements[indexEl]);
    script($target, indexEl);
  }
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom7lAroFCpukqOYdK_productVendor()
      } catch(e) {
        console.error("Error ESAtom Id: 7lAroFCpukqOYdK_productVendor" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom7lAroFCpukqOYdK_boxPrice = function() {
          (function() {
  var elementClassName = ".gt_atom-7lAroFCpukqOYdK_boxPrice";
  var id = "7lAroFCpukqOYdK_boxPrice";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "7lAroFCpukqOYdK_boxPrice",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
    var $target = $($elements[indexEl]);
    script($target, indexEl);
  }
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom7lAroFCpukqOYdK_boxPrice()
      } catch(e) {
        console.error("Error ESAtom Id: 7lAroFCpukqOYdK_boxPrice" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom7lAroFCpukqOYdK_productPrice = function() {
          (function() {
  var elementClassName = ".gt_atom-7lAroFCpukqOYdK_productPrice";
  var id = "7lAroFCpukqOYdK_productPrice";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const syncQuantityandPrice = "true" == "true";
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!price!]"
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "7lAroFCpukqOYdK_productPrice",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        };
        var settingsText = {
          elementId: "7lAroFCpukqOYdK_productPrice",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        };
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          };
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          };
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          };
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-price-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-price-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if (activeTextFixed) {
      initFixedContent();
    };
    $element.gtProductPrice({
      classCurrentPrice: ".gt_product-price--number",
      syncQuantityPrice: syncQuantityandPrice,
    });
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom7lAroFCpukqOYdK_productPrice()
      } catch(e) {
        console.error("Error ESAtom Id: 7lAroFCpukqOYdK_productPrice" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom7lAroFCpukqOYdK_productComparePrice = function() {
          (function() {
  var elementClassName = ".gt_atom-7lAroFCpukqOYdK_productComparePrice";
  var id = "7lAroFCpukqOYdK_productComparePrice";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const syncQuantityandPrice = "true" == "true";
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "7lAroFCpukqOYdK_productComparePrice",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        };
        var settingsText = {
          elementId: "7lAroFCpukqOYdK_productComparePrice",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        };
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          };
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          };
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          };
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }
    /* init block script */
    addInteraction();
    $element.gtProductPrice({
      classComparePrice: ".gt_product-price--compare",
      classCurrentPrice: ".gt_product-price--number",
      syncQuantityComparePrice: syncQuantityandPrice,
      replacePriceForCurrentPrice: false,
    });
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom7lAroFCpukqOYdK_productComparePrice()
      } catch(e) {
        console.error("Error ESAtom Id: 7lAroFCpukqOYdK_productComparePrice" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom7lAroFCpukqOYdK_productIntro = function() {
          (function() {
  var elementClassName = ".gt_atom-7lAroFCpukqOYdK_productIntro";
  var id = "7lAroFCpukqOYdK_productIntro";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function removeTextWrapperClass() {
      var $textWrapper = $element.find(".gt_box-desc");
      $textWrapper.unwrap();
    }

    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "7lAroFCpukqOYdK_productIntro",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "7lAroFCpukqOYdK_productIntro",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if ("production" === "production") {
      removeTextWrapperClass();
    }
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom7lAroFCpukqOYdK_productIntro()
      } catch(e) {
        console.error("Error ESAtom Id: 7lAroFCpukqOYdK_productIntro" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom7lAroFCpukqOYdK_featureList = function() {
          (function() {
  var elementClassName = ".gt_atom-7lAroFCpukqOYdK_featureList";
  var id = "7lAroFCpukqOYdK_featureList";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "7lAroFCpukqOYdK_featureList",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
    var $target = $($elements[indexEl]);
    script($target, indexEl);
  }
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom7lAroFCpukqOYdK_featureList()
      } catch(e) {
        console.error("Error ESAtom Id: 7lAroFCpukqOYdK_featureList" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom7lAroFCpukqOYdK_featureListItem_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-7lAroFCpukqOYdK_featureListItem_0";
  var id = "7lAroFCpukqOYdK_featureListItem_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "7lAroFCpukqOYdK_featureListItem_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
    var $target = $($elements[indexEl]);
    script($target, indexEl);
  }
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom7lAroFCpukqOYdK_featureListItem_0()
      } catch(e) {
        console.error("Error ESAtom Id: 7lAroFCpukqOYdK_featureListItem_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom7lAroFCpukqOYdK_icon_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-7lAroFCpukqOYdK_icon_0";
  var id = "7lAroFCpukqOYdK_icon_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "7lAroFCpukqOYdK_icon_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom7lAroFCpukqOYdK_icon_0()
      } catch(e) {
        console.error("Error ESAtom Id: 7lAroFCpukqOYdK_icon_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom7lAroFCpukqOYdK_message_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-7lAroFCpukqOYdK_message_0";
  var id = "7lAroFCpukqOYdK_message_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function removeTextWrapperClass() {
      var $textWrapper = $element.find(".gt_box-desc");
      $textWrapper.unwrap();
    }

    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "7lAroFCpukqOYdK_message_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "7lAroFCpukqOYdK_message_0",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if ("production" === "production") {
      removeTextWrapperClass();
    }
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom7lAroFCpukqOYdK_message_0()
      } catch(e) {
        console.error("Error ESAtom Id: 7lAroFCpukqOYdK_message_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom7lAroFCpukqOYdK_featureListItem_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-7lAroFCpukqOYdK_featureListItem_1";
  var id = "7lAroFCpukqOYdK_featureListItem_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "7lAroFCpukqOYdK_featureListItem_1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
    var $target = $($elements[indexEl]);
    script($target, indexEl);
  }
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom7lAroFCpukqOYdK_featureListItem_1()
      } catch(e) {
        console.error("Error ESAtom Id: 7lAroFCpukqOYdK_featureListItem_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom7lAroFCpukqOYdK_icon_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-7lAroFCpukqOYdK_icon_1";
  var id = "7lAroFCpukqOYdK_icon_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "7lAroFCpukqOYdK_icon_1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom7lAroFCpukqOYdK_icon_1()
      } catch(e) {
        console.error("Error ESAtom Id: 7lAroFCpukqOYdK_icon_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom7lAroFCpukqOYdK_message_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-7lAroFCpukqOYdK_message_1";
  var id = "7lAroFCpukqOYdK_message_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function removeTextWrapperClass() {
      var $textWrapper = $element.find(".gt_box-desc");
      $textWrapper.unwrap();
    }

    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "7lAroFCpukqOYdK_message_1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "7lAroFCpukqOYdK_message_1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if ("production" === "production") {
      removeTextWrapperClass();
    }
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom7lAroFCpukqOYdK_message_1()
      } catch(e) {
        console.error("Error ESAtom Id: 7lAroFCpukqOYdK_message_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom7lAroFCpukqOYdK_featureListItem_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-7lAroFCpukqOYdK_featureListItem_2";
  var id = "7lAroFCpukqOYdK_featureListItem_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "7lAroFCpukqOYdK_featureListItem_2",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
    var $target = $($elements[indexEl]);
    script($target, indexEl);
  }
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom7lAroFCpukqOYdK_featureListItem_2()
      } catch(e) {
        console.error("Error ESAtom Id: 7lAroFCpukqOYdK_featureListItem_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom7lAroFCpukqOYdK_icon_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-7lAroFCpukqOYdK_icon_2";
  var id = "7lAroFCpukqOYdK_icon_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "7lAroFCpukqOYdK_icon_2",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom7lAroFCpukqOYdK_icon_2()
      } catch(e) {
        console.error("Error ESAtom Id: 7lAroFCpukqOYdK_icon_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom7lAroFCpukqOYdK_message_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-7lAroFCpukqOYdK_message_2";
  var id = "7lAroFCpukqOYdK_message_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function removeTextWrapperClass() {
      var $textWrapper = $element.find(".gt_box-desc");
      $textWrapper.unwrap();
    }

    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "7lAroFCpukqOYdK_message_2",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "7lAroFCpukqOYdK_message_2",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if ("production" === "production") {
      removeTextWrapperClass();
    }
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom7lAroFCpukqOYdK_message_2()
      } catch(e) {
        console.error("Error ESAtom Id: 7lAroFCpukqOYdK_message_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom7lAroFCpukqOYdK_line1 = function() {
          
        }
        funcESAtom7lAroFCpukqOYdK_line1()
      } catch(e) {
        console.error("Error ESAtom Id: 7lAroFCpukqOYdK_line1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom7lAroFCpukqOYdK_productVariant = function() {
          (function() {
  var elementClassName = ".gt_atom-7lAroFCpukqOYdK_productVariant";
  var id = "7lAroFCpukqOYdK_productVariant";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    var $variantChecked = $element.find(".gt_product-variant--checked");
    var $variantOptions = $element.find(".gt_product-variant-options");
    var mode = "production";
    var animationActive = 'false';
    var timeoutTooltip = null;
    /* store get state block script */
    /* methods block script */
    function animation() {
      if (animationActive === "true") {
        var interactionScrollIntoView =
          '""';
        window.SOLID.library.animation({
          elementId: id,
          $doms: $elements,
          interactionScrollIntoView: {
            value: JSON.parse(interactionScrollIntoView),
            previewAttr: "interactionScrollIntoView",
          },
          animationType: "block",
          mode: mode,
        });
      }
    }

    function initSwatches() {
      window.SOLID.library.gtProductSwatchesV2({
        $element: $element,
        settings: {
          classCurrentValue: ".gt_product-variant-option--selected .gt_product-variant-option--selected-text",
          classItem: ".gt_variant--select-item",
          classInputIdHidden: ".gt_variant--input",
          classBtnSelect: ".gt_product-variant--btn-select",
        }
      });
    }

    function openSelectDropdown() {
      $variantChecked.removeClass("gt_active");
      var $options = $(this).siblings(".gt_product-variant-options");
      if ($options.hasClass("gt_active")) {
        $options.css("top", "");
        $options.removeClass("gt_active");
        $(this).removeClass("gt_active");
        clearEventShowTooltip();
        $(document).off("mousedown.outsideClickVariantSelect");
      } else {
        $variantOptions.removeClass("gt_active");
        $options.addClass("gt_active");
        $(this).addClass("gt_active");
        var optionsOuterHeight = $options.outerHeight();
        var selectInputHeight = $variantChecked.outerHeight();
        var positionOptions = $options.offset().top - $(document).scrollTop() + optionsOuterHeight;
        var windowHeight = $(window).outerHeight();
        if (positionOptions > windowHeight) {
          const currentTopOptions = $options.css("top");
          const newTop = "calc( " + currentTopOptions + " - " + optionsOuterHeight + "px" + " - " + (Number(selectInputHeight) + 10) + "px" + " )";
          $options.css("top", newTop);
        }
        clearTimeout(timeoutTooltip);
        timeoutTooltip = setTimeout(() => {
          eventShowTooltipSelectType();
        }, 300)
        //addeventclickoutsidetoclose
        const $currentTargetOptions = $(this);
        $(document).off("mousedown.outsideClickVariantSelect").on("mousedown.outsideClickVariantSelect", function(event) {
          if ($options && $options.length && $currentTargetOptions && $currentTargetOptions.length) {
            const $optionsPure = $options[0];
            if ($optionsPure && !$optionsPure.contains(event.target) && !$currentTargetOptions[0].contains(event.target)) {
              $options.css("top", "");
              $options.removeClass("gt_active");
              $currentTargetOptions.removeClass("gt_active");
              clearEventShowTooltip();
              $(document).off("mousedown.outsideClickVariantSelect");
            }
          }
        });
      }
    }

    function onClickSelectDropDown() {
      $variantChecked.removeClass("gt_active");
      $variantOptions.removeClass("gt_active");
      var value = $(this).attr("data-value");
      var $variantCheckedCurrent = $(this).closest(
        ".gt_product-variant--select-box"
      );
      var $valueVariantChecked = $variantCheckedCurrent.find(
        ".gt_product-variant-option--selected .gt_product-variant-option--selected-text"
      );
      var $contentOptionSelect = $(this).html();
      $valueVariantChecked.attr("data-value", value);
      $valueVariantChecked.html($contentOptionSelect);
      //closetooltip
      const $tooltip = $element.find(".gt_product-variant-tooltip");
      $tooltip.css("display", "none");
      clearEventShowTooltip();
    }

    function hideAtomWhenNoVariant() {
      $element.css("display", "");
      var isHide = true;
      var $variantItems = $element.find(".gt_product-variant--item")
      for (var i = 0; i < $variantItems.length; i++) {
        var $item = $($variantItems[i]);
        var display = $item.css("display");
        if (display !== "none") {
          isHide = false;
          break;
        }
      }
      if (isHide) {
        $element.css("display", "none");
      }
    }

    function eventShowTooltipSelectType() {
      const $selectItems = $element.find(".gt_variant--select-item");
      for (var i = 0; i < $selectItems.length; i++) {
        const $selectItem = $($selectItems[i]);
        const $selectOptions = $selectItem.find(".gt_product-variant-option");
        const $tooltip = $selectItem.find(".gt_product-variant-tooltip");
        $selectOptions.off("mouseenter").on("mouseenter", function() {
          //checkoverflow
          const $contentValue = $(this).find(".gt_product-variant-option--txt");
          const cachedDisplayContentValue = $contentValue.css("display");
          $contentValue.css({
            display: "inline",
            overflow: "unset",
            whiteSpace: "nowrap"
          });
          const realWidth = $contentValue.outerWidth();
          $contentValue.css({
            display: cachedDisplayContentValue,
            overflow: "",
            whiteSpace: ""
          });
          //
          const selectOptionTop = this.getBoundingClientRect().top;
          const selectItemTop = $selectItem[0].getBoundingClientRect().top;
          const selectOptionHeight = $(this).outerHeight();
          const selectOptionWidth = $(this).outerWidth();
          const contentSelect = $contentValue.html();
          if (realWidth > selectOptionWidth) {
            $tooltip.find(".gt_product-variant-tooltip-name").html(contentSelect);
            $tooltip.css({
              display: "block",
              top: selectOptionTop - selectItemTop - selectOptionHeight,
              zIndex: 10
            });
            $tooltip.find(".gt_product-variant-tooltip-arrow").css({
              left: selectOptionWidth / 2 + "px",
            })
          }
        });
        $selectOptions.off("mouseleave").on("mouseleave", function() {
          $tooltip.css({
            display: "none"
          })
        });
      }
    }

    function clearEventShowTooltip() {
      const $selectitems = $element.find(".gt_variant--select-item");
      for (var i = 0; i < $selectitems.length; i++) {
        const $selectitem = $($selectitems[i]);
        const $selectoptions = $selectitem.find(".gt_product-variant-option");
        $selectoptions.off("mouseenter");
        $selectoptions.off("mouseleave");
      }
    }
    /* init block script */
    hideAtomWhenNoVariant();
    initSwatches();
    animation();
    /* store subscribe block script */
    /* events block script */
    var $elements_1 = $element.find(".gt_product-variant--checked");
    $elements_1.off("click.openSelect").on("click.openSelect", openSelectDropdown);
    var $elements_2 = $element.find(".gt_product-variant-option");
    $elements_2.off("click.selectItem").on("click.selectItem", onClickSelectDropDown);
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom7lAroFCpukqOYdK_productVariant()
      } catch(e) {
        console.error("Error ESAtom Id: 7lAroFCpukqOYdK_productVariant" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom7lAroFCpukqOYdK_productQuantity = function() {
          (function() {
  var elementClassName = ".gt_atom-7lAroFCpukqOYdK_productQuantity";
  var id = "7lAroFCpukqOYdK_productQuantity";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    var style = "vertical";
    var mode = "production";
    var interactionScrollIntoViewActive = "false";
    /* store get state block script */
    /* methods block script */
    function animation() {
      if (interactionScrollIntoViewActive === "true") {
        var interactionScrollIntoView =
          '""';
        var $container = $element.find(".gt_product-quantity");
        window.SOLID.library.animation({
          elementId: id,
          $doms: $container,
          interactionScrollIntoView: {
            value: JSON.parse(interactionScrollIntoView),
            previewAttr: "interactionScrollIntoView",
          },
          animationType: "block",
          mode: mode,
        });
      }
    }

    function initLibrary() {
      var params = {
        $element: $element,
        settings: {
          classInput: "input[name='quantity']",
          classPlus: ".gt_quantity_plus",
          classMinus: ".gt_quantity_minus",
          mode: mode,
        }
      };
      if (style === "horizontal") {
        params = {
          $element: $element,
          settings: {
            classInput: "input[name='quantity']",
            classPlus: ".gt_product-quantity--plus",
            classMinus: ".gt_product-quantity--minus",
            mode: mode,
          }
        };
      }
      window.SOLID.library.gtProductQuantityV2(params);
    }

    function validateInput() {
      var inputQuantity = $element.find("input[name='quantity']");
      inputQuantity.keyup(function() {
        var value = parseInt(this.value);
        if (isNaN(value)) {
          value = 1;
        }
        inputQuantity.attr("value", value).val(value);
      })
    }
    /* init block script */
    initLibrary();
    animation();
    validateInput();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
    var $target = $($elements[indexEl]);
    script($target, indexEl);
  }
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom7lAroFCpukqOYdK_productQuantity()
      } catch(e) {
        console.error("Error ESAtom Id: 7lAroFCpukqOYdK_productQuantity" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom7lAroFCpukqOYdK_line2 = function() {
          
        }
        funcESAtom7lAroFCpukqOYdK_line2()
      } catch(e) {
        console.error("Error ESAtom Id: 7lAroFCpukqOYdK_line2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom7lAroFCpukqOYdK_productButtonAddToCart = function() {
          (function() {
  var elementClassName = ".gt_atom-7lAroFCpukqOYdK_productButtonAddToCart";
  var id = "7lAroFCpukqOYdK_productButtonAddToCart";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    var scrollIntoViewActive = 'false' == 'true';
    var animationActive = 'false' == 'true';
    var animationHoverActive = 'false' == 'true';
    var scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    var animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    var animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    var mode = 'production';
    var previewSoldOut = 'false';
    var actions = '[{"control":{"attribute":"pickProductButton","id":"pickProductButton","isButtonAddToCard":true,"type":"pickproduct"},"event":"click","id":1},{"control":{"attribute":"pickLinkButton","id":"pickLinkButton","newTab":false,"reference":"html","title":"Pick Link","type":"picklink","value":"/cart"},"event":"click","id":2}]';
    
    var activeButtonFixContent = "false" === "true";
    var buttonFixContent = "Buy [!quantity!] items";
    var disableListenSoldOut = "false" === "true";
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "7lAroFCpukqOYdK_productButtonAddToCart",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        };
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          };
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          };
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover",
          };
        }
        window.SOLID.library.animation(settings);
      }
    }

    function eventChangeTextInIframe() {
      
    }

    function eventListenSoldOut() {
      if (mode !== "production") {
        if (previewSoldOut === "false") {
          window.SOLID.library.gtBuyProductListenSoldOut({
            $element: $($element)[0],
            options: {
              isButtonAddToCard: true,
              textAddToCard: "Add To Cart",
              textSoldOut: "Sold out",
            },
            mode: "dev"
          });
        }
      } else {
        window.SOLID.library.gtBuyProductListenSoldOut({
          $element: $($element)[0],
          options: {
            isButtonAddToCard: true,
            textAddToCard: "Add To Cart",
            textSoldOut: "Sold out",
          },
        });
      }
    }

    function addActionEvent() {
      // function customEvent(actions,id,key)
      if (mode === "production") {
        $($element).customEvent(
          JSON.parse(actions),
          '7lAroFCpukqOYdK_productButtonAddToCart' + '_' + indexEl
        );
      }
      /*Listenifisbuttonaddtocard*/
      store.subscribe(
        "loading-buy-now-7lAroFCpukqOYdK_productButtonAddToCart" + "_" + indexEl,
        function(isDisplay) {
          const $loadingEl = $($element).find(
            ".atom-button-loading-circle-loader"
          );
          const $textEl = $($element).find(".gt_button-content-text");
          if ($loadingEl && $loadingEl.length && $textEl && $textEl.length) {
            let timeout = undefined;
            if (isDisplay === true) {
              /*displayloadingbutton*/
              clearTimeout(timeout);
              $loadingEl.css("display", "inline-block");
              $textEl.css("visibility", "hidden");
            } else if (isDisplay === "stop") {
              /*stoploading*/
              $loadingEl.removeAttr("style");
              $textEl.removeAttr("style");
              store.dispatch("loading-buy-now-7lAroFCpukqOYdK_productButtonAddToCart", "");
              store.dispatch("loading-buy-now-7lAroFCpukqOYdK_productButtonAddToCart" + "_" + indexEl, "");
            } else if (isDisplay === false) {
              clearTimeout(timeout);
              /*displaytickbutton*/
              $loadingEl.addClass("load-complete");
              $loadingEl
                .find(".atom-button-loading-check-mark")
                .css("display", "block");
              /*removetickbuttonanddisplaytext*/
              timeout = setTimeout(function() {
                $loadingEl.removeClass("load-complete");
                $loadingEl
                  .find(".atom-button-loading-check-mark")
                  .removeAttr("style");
                $loadingEl.removeAttr("style");
                $textEl.removeAttr("style");
                store.dispatch("loading-buy-now-7lAroFCpukqOYdK_productButtonAddToCart", "");
                store.dispatch("loading-buy-now-7lAroFCpukqOYdK_productButtonAddToCart" + "_" + indexEl, "");
              }, 3000);
            }
          }
        }
      );
    }

    function initFixContent() {
      const splitContent = buttonFixContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_button-content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_button-content-text-after").html(afterWord);
    }
    /* init block script */
    if (activeButtonFixContent) {
      initFixContent();
    }
    addInteraction();
    addActionEvent();
    if (!disableListenSoldOut) {
      eventListenSoldOut();
    }
    eventChangeTextInIframe();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
    /* public func block script */
    return {
      eventListenSoldOut,
    };
  }
  /* run all script */
  for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
    var $target = $($elements[indexEl]);
    var public = script($target, indexEl);
    window.SOLID.public = window.SOLID.public || {};
    window.SOLID.public["atom" + "_" + id + "_" + indexEl] = public;
  }
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom7lAroFCpukqOYdK_productButtonAddToCart()
      } catch(e) {
        console.error("Error ESAtom Id: 7lAroFCpukqOYdK_productButtonAddToCart" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom7lAroFCpukqOYdK_productButtonBuyItNow = function() {
          (function() {
  var elementClassName = ".gt_atom-7lAroFCpukqOYdK_productButtonBuyItNow";
  var id = "7lAroFCpukqOYdK_productButtonBuyItNow";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    var scrollIntoViewActive = 'false' == 'true';
    var animationActive = 'false' == 'true';
    var animationHoverActive = 'false' == 'true';
    var scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    var animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    var animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    var mode = 'production';
    var previewSoldOut = 'false';
    var actions = '[{"control":{"attribute":"pickProductButton","id":"pickProductButton","isButtonAddToCard":true,"type":"pickproduct"},"event":"click","id":1},{"control":{"attribute":"pickLinkButton","id":"pickLinkButton","newTab":false,"reference":"html","title":"Pick Link","type":"picklink","value":"/checkout"},"event":"click","id":2}]';
    
    var activeButtonFixContent = "false" === "true";
    var buttonFixContent = "Buy [!quantity!] items";
    var disableListenSoldOut = "false" === "true";
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "7lAroFCpukqOYdK_productButtonBuyItNow",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        };
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          };
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          };
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover",
          };
        }
        window.SOLID.library.animation(settings);
      }
    }

    function eventChangeTextInIframe() {
      
    }

    function eventListenSoldOut() {
      if (mode !== "production") {
        if (previewSoldOut === "false") {
          window.SOLID.library.gtBuyProductListenSoldOut({
            $element: $($element)[0],
            options: {
              isButtonAddToCard: true,
              textAddToCard: "Buy It Now",
              textSoldOut: "Sold out",
            },
            mode: "dev"
          });
        }
      } else {
        window.SOLID.library.gtBuyProductListenSoldOut({
          $element: $($element)[0],
          options: {
            isButtonAddToCard: true,
            textAddToCard: "Buy It Now",
            textSoldOut: "Sold out",
          },
        });
      }
    }

    function addActionEvent() {
      // function customEvent(actions,id,key)
      if (mode === "production") {
        $($element).customEvent(
          JSON.parse(actions),
          '7lAroFCpukqOYdK_productButtonBuyItNow' + '_' + indexEl
        );
      }
      /*Listenifisbuttonaddtocard*/
      store.subscribe(
        "loading-buy-now-7lAroFCpukqOYdK_productButtonBuyItNow" + "_" + indexEl,
        function(isDisplay) {
          const $loadingEl = $($element).find(
            ".atom-button-loading-circle-loader"
          );
          const $textEl = $($element).find(".gt_button-content-text");
          if ($loadingEl && $loadingEl.length && $textEl && $textEl.length) {
            let timeout = undefined;
            if (isDisplay === true) {
              /*displayloadingbutton*/
              clearTimeout(timeout);
              $loadingEl.css("display", "inline-block");
              $textEl.css("visibility", "hidden");
            } else if (isDisplay === "stop") {
              /*stoploading*/
              $loadingEl.removeAttr("style");
              $textEl.removeAttr("style");
              store.dispatch("loading-buy-now-7lAroFCpukqOYdK_productButtonBuyItNow", "");
              store.dispatch("loading-buy-now-7lAroFCpukqOYdK_productButtonBuyItNow" + "_" + indexEl, "");
            } else if (isDisplay === false) {
              clearTimeout(timeout);
              /*displaytickbutton*/
              $loadingEl.addClass("load-complete");
              $loadingEl
                .find(".atom-button-loading-check-mark")
                .css("display", "block");
              /*removetickbuttonanddisplaytext*/
              timeout = setTimeout(function() {
                $loadingEl.removeClass("load-complete");
                $loadingEl
                  .find(".atom-button-loading-check-mark")
                  .removeAttr("style");
                $loadingEl.removeAttr("style");
                $textEl.removeAttr("style");
                store.dispatch("loading-buy-now-7lAroFCpukqOYdK_productButtonBuyItNow", "");
                store.dispatch("loading-buy-now-7lAroFCpukqOYdK_productButtonBuyItNow" + "_" + indexEl, "");
              }, 3000);
            }
          }
        }
      );
    }

    function initFixContent() {
      const splitContent = buttonFixContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_button-content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_button-content-text-after").html(afterWord);
    }
    /* init block script */
    if (activeButtonFixContent) {
      initFixContent();
    }
    addInteraction();
    addActionEvent();
    if (!disableListenSoldOut) {
      eventListenSoldOut();
    }
    eventChangeTextInIframe();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
    /* public func block script */
    return {
      eventListenSoldOut,
    };
  }
  /* run all script */
  for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
    var $target = $($elements[indexEl]);
    var public = script($target, indexEl);
    window.SOLID.public = window.SOLID.public || {};
    window.SOLID.public["atom" + "_" + id + "_" + indexEl] = public;
  }
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom7lAroFCpukqOYdK_productButtonBuyItNow()
      } catch(e) {
        console.error("Error ESAtom Id: 7lAroFCpukqOYdK_productButtonBuyItNow" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom7lAroFCpukqOYdK_productSoldOutForm = function() {
          (function() {
  var elementClassName = ".gt_atom-7lAroFCpukqOYdK_productSoldOutForm";
  var id = "7lAroFCpukqOYdK_productSoldOutForm";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    var isNotificationSuccessPreview = "false";
    var typeText = "Type";
    var productNameText = "Product Name";
    var variantNameText = "Variant Name";
    var productUrlText = "Product URL";
    /* store get state block script */
    /* methods block script */
    function checkSubmitFormSuccess() {
      //Scrollđếnatom
      var queryUrl = getQueryByUrl();
      if (queryUrl.status) {
        showMessageSuccess();
        hideForm();
        var currentElement = $(`.${queryUrl.id}`);
        if (currentElement && currentElement.length) {
          $("html, body").animate({
              scrollTop: currentElement.offset().top - 200
            },
            300
          );
        }
      }
    }

    function getQueryByUrl() {
      const urlParams = new URLSearchParams(window.location.search);
      const status = urlParams.get("posted_successfully");
      const currentId = urlParams.get("id");
      return {
        status: status,
        id: currentId,
      };
    }

    function checkPreviewMessageSuccess() {
      if ("production" !== "production") {
        if (
          isNotificationSuccessPreview &&
          isNotificationSuccessPreview === "true"
        ) {
          showMessageSuccess();
          hideForm();
        } else {
          hideMessageSuccess();
          showForm();
        }
      }
    }

    function showMessageSuccess() {
      var message = $element.find(".gt_message-success");
      message.show();
    }

    function hideMessageSuccess() {
      var message = $element.find(".gt_message-success");
      message.hide();
    }

    function setFormName() {
      formatTypeText = typeText.toLowerCase().replace(/[^\w\s]/gi, '');
      formatProductName = productNameText.toLowerCase().replace(/[^\w\s]/gi, '');
      formatVariantName = variantNameText.toLowerCase().replace(/[^\w\s]/gi, '');
      formatProductUrl = productUrlText.toLowerCase().replace(/[^\w\s]/gi, '');

      $element.find(".gt_form--type").attr("name", "contact[ " + formatTypeText + "]");
      $element.find(".gt_form--email").attr("required", "required");
      $element.find(".gt_form--email").attr("name", "contact[email]");
      $element.find(".gt_form-product--name").attr("name", "contact[ " + formatProductName + "]");
      $element.find(".gt_form-variant--name").attr("name", "contact[ " + formatVariantName + "]");
      $element.find(".gt_form-product--url").attr("name", "contact[ " + formatProductUrl + "]");
      $element.find(".gt_form--return-url").attr("name", "return_to");
    }

    function removeFormName() {
      $element.find(".gt_form--type").removeAttr("name");
      $element.find(".gt_form--email").removeAttr("required");
      $element.find(".gt_form--email").removeAttr("name");
      $element.find(".gt_form-product--name").removeAttr("name");
      $element.find(".gt_form-variant--name").removeAttr("name");
      $element.find(".gt_form-product--url").removeAttr("name");
      $element.find(".gt_form--return-url").removeAttr("name");
    }

    function showForm() {
      var form = $element.find(".gt_form");
      setFormName();
      form.show();
    }

    function hideForm() {
      var form = $element.find(".gt_form");
      $element.find(".gt_form--email").removeAttr("required");
      removeFormName();
      form.hide();
    }

    function setProductName(value) {
      var elProductName = $element.find(".gt_form-product--name");
      elProductName.val(value);
    }

    function setVariantName(value) {
      var elVariantName = $element.find(".gt_form-variant--name");
      elVariantName.val(value);
    }

    function setProductUrl(value) {
      var elProductUrl = $element.find(".gt_form-product--url");
      elProductUrl.val(value);
    }

    function setReturnTo(value) {
      var elReturnTo = $element.find(".gt_form--return-url");
      elReturnTo.val(value);
    }
    /* init block script */
    checkPreviewMessageSuccess();
    checkSubmitFormSuccess();
    setReturnTo(
      window.location.pathname + `?posted_successfully=true&id=7lAroFCpukqOYdK_productSoldOutForm`
    );
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
    /* public func block script */
    return {
      showMessageSuccess,
      hideMessageSuccess,
      showForm,
      hideForm,
      setProductName,
      setVariantName,
      setProductUrl,
      setReturnTo
    };
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      var publicFunc = script($target, indexEl);
      window.SOLID.public = window.SOLID.public || {};
      window.SOLID.public["atom" + "_" + id + "_" + indexEl] = publicFunc;
      if (publicFunc) {
        store.dispatch("public_function_atom_" + id, publicFunc);
      }
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom7lAroFCpukqOYdK_productSoldOutForm()
      } catch(e) {
        console.error("Error ESAtom Id: 7lAroFCpukqOYdK_productSoldOutForm" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom7lAroFCpukqOYdK_image = function() {
          (function() {
  var elementClassName = ".gt_atom-7lAroFCpukqOYdK_image";
  var id = "7lAroFCpukqOYdK_image";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "7lAroFCpukqOYdK_image",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom7lAroFCpukqOYdK_image()
      } catch(e) {
        console.error("Error ESAtom Id: 7lAroFCpukqOYdK_image" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom7lAroFCpukqOYdK_productDescription = function() {
          (function() {
  var elementClassName = ".gt_atom-7lAroFCpukqOYdK_productDescription";
  var id = "7lAroFCpukqOYdK_productDescription";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const turnOffDescription = "false" === "true";
    const heightSettingDes = "120px";
    /* store get state block script */
    /* methods block script */
    function initView() {
      //resetcss
      if (!turnOffDescription) {
        $element.find(".gt_description").css("height", "");
        $element.find(".gt_btn-view-more").css({
          padding: "",
          position: ""
        });
      }
      var heightCurrentBoxDes = 0;
      if ($element.hasClass("gt_product-desciption--tab")) {
        heightCurrentBoxDes = $element.parents(".gt_active-content").find(".gt_box-desc").height();
      } else {
        heightCurrentBoxDes = $element.find(".gt_box-desc").height();
      }
      $element.find(".gt_description").removeClass("open");
      if (heightCurrentBoxDes <= parseInt(heightSettingDes) && !turnOffDescription) {
        $element.find(".gt_btn-view-more").addClass("gt_hidden");
        $element.find(".gt_description").css("height", "auto");
      } else {
        $element.find(".gt_btn-view-more").removeClass("gt_hidden");
        $element.find(".gt_description").css("height", "");
      }
      //setheightwhenturnoffdescription
      if (turnOffDescription) {
        $element.find(".gt_description").css("height", "auto");
        $element.find(".gt_btn-view-more").css({
          padding: "0px",
          position: "relative"
        });
      }
    }

    function toggleDes() {
      $element.find(".gt_description").toggleClass("open");
    }
    
    function checkAtomExist() {	
      if ($element.find(".gt_description").length < 1) {	
        $element.hide();	
      }	
    }
    
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "7lAroFCpukqOYdK_productDescription",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        };
        var settingsText = {
          elementId: "7lAroFCpukqOYdK_productDescription",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        };
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          };
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          };
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          };
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }
    /* init block script */
    addInteraction();
    initView();
    /* store subscribe block script */
    /* events block script */
    var $elements_1 = $element.find("#toggleDes");
    $elements_1.off("click").on("click", toggleDes);
    /* destroy block script */
    
    /* public func block script */
    return {
      initView,
    };
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      var publicFunc = script($target, indexEl);
      window.SOLID.public = window.SOLID.public || {};
      window.SOLID.public["atom" + "_" + id + "_" + indexEl] = publicFunc;
      if (publicFunc) {
        store.dispatch("public_function_atom_" + id, publicFunc);
      }
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom7lAroFCpukqOYdK_productDescription()
      } catch(e) {
        console.error("Error ESAtom Id: 7lAroFCpukqOYdK_productDescription" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESSectione6y5OfPGESD2Gfh = function() {
          
        }
        funcESSectione6y5OfPGESD2Gfh()
      } catch(e) {
        console.error("Error ESSection Id: e6y5OfPGESD2Gfh" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESSection6AhamTkTt8lzrr1 = function() {
          
        }
        funcESSection6AhamTkTt8lzrr1()
      } catch(e) {
        console.error("Error ESSection Id: 6AhamTkTt8lzrr1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom6AhamTkTt8lzrr1_trustBadgeBox = function() {
          (function() {
  var elementClassName = ".gt_atom-6AhamTkTt8lzrr1_trustBadgeBox";
  var id = "6AhamTkTt8lzrr1_trustBadgeBox";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "6AhamTkTt8lzrr1_trustBadgeBox",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
    var $target = $($elements[indexEl]);
    script($target, indexEl);
  }
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom6AhamTkTt8lzrr1_trustBadgeBox()
      } catch(e) {
        console.error("Error ESAtom Id: 6AhamTkTt8lzrr1_trustBadgeBox" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom6AhamTkTt8lzrr1_uploadImage = function() {
          (function() {
  var elementClassName = ".gt_atom-6AhamTkTt8lzrr1_uploadImage";
  var id = "6AhamTkTt8lzrr1_uploadImage";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "6AhamTkTt8lzrr1_uploadImage",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom6AhamTkTt8lzrr1_uploadImage()
      } catch(e) {
        console.error("Error ESAtom Id: 6AhamTkTt8lzrr1_uploadImage" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom6AhamTkTt8lzrr1_headingText = function() {
          (function() {
  var elementClassName = ".gt_atom-6AhamTkTt8lzrr1_headingText";
  var id = "6AhamTkTt8lzrr1_headingText";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function removeTextWrapperClass() {
      var $textWrapper = $element.find(".gt_box-desc");
      $textWrapper.unwrap();
    }

    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "6AhamTkTt8lzrr1_headingText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "6AhamTkTt8lzrr1_headingText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if ("production" === "production") {
      removeTextWrapperClass();
    }
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom6AhamTkTt8lzrr1_headingText()
      } catch(e) {
        console.error("Error ESAtom Id: 6AhamTkTt8lzrr1_headingText" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom6AhamTkTt8lzrr1_messageText = function() {
          (function() {
  var elementClassName = ".gt_atom-6AhamTkTt8lzrr1_messageText";
  var id = "6AhamTkTt8lzrr1_messageText";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function removeTextWrapperClass() {
      var $textWrapper = $element.find(".gt_box-desc");
      $textWrapper.unwrap();
    }

    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "6AhamTkTt8lzrr1_messageText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "6AhamTkTt8lzrr1_messageText",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if ("production" === "production") {
      removeTextWrapperClass();
    }
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom6AhamTkTt8lzrr1_messageText()
      } catch(e) {
        console.error("Error ESAtom Id: 6AhamTkTt8lzrr1_messageText" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom6AhamTkTt8lzrr1_uploadImage1 = function() {
          (function() {
  var elementClassName = ".gt_atom-6AhamTkTt8lzrr1_uploadImage1";
  var id = "6AhamTkTt8lzrr1_uploadImage1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "6AhamTkTt8lzrr1_uploadImage1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom6AhamTkTt8lzrr1_uploadImage1()
      } catch(e) {
        console.error("Error ESAtom Id: 6AhamTkTt8lzrr1_uploadImage1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom6AhamTkTt8lzrr1_paymentList = function() {
          (function() {
  var elementClassName = ".gt_atom-6AhamTkTt8lzrr1_paymentList";
  var id = "6AhamTkTt8lzrr1_paymentList";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "6AhamTkTt8lzrr1_paymentList",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
    var $target = $($elements[indexEl]);
    script($target, indexEl);
  }
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom6AhamTkTt8lzrr1_paymentList()
      } catch(e) {
        console.error("Error ESAtom Id: 6AhamTkTt8lzrr1_paymentList" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom6AhamTkTt8lzrr1_sectionIcon_0 = function() {
          (function() {
  var elementClassName = ".gt_atom-6AhamTkTt8lzrr1_sectionIcon_0";
  var id = "6AhamTkTt8lzrr1_sectionIcon_0";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "6AhamTkTt8lzrr1_sectionIcon_0",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom6AhamTkTt8lzrr1_sectionIcon_0()
      } catch(e) {
        console.error("Error ESAtom Id: 6AhamTkTt8lzrr1_sectionIcon_0" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom6AhamTkTt8lzrr1_sectionIcon_1 = function() {
          (function() {
  var elementClassName = ".gt_atom-6AhamTkTt8lzrr1_sectionIcon_1";
  var id = "6AhamTkTt8lzrr1_sectionIcon_1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "6AhamTkTt8lzrr1_sectionIcon_1",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom6AhamTkTt8lzrr1_sectionIcon_1()
      } catch(e) {
        console.error("Error ESAtom Id: 6AhamTkTt8lzrr1_sectionIcon_1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom6AhamTkTt8lzrr1_sectionIcon_2 = function() {
          (function() {
  var elementClassName = ".gt_atom-6AhamTkTt8lzrr1_sectionIcon_2";
  var id = "6AhamTkTt8lzrr1_sectionIcon_2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "6AhamTkTt8lzrr1_sectionIcon_2",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom6AhamTkTt8lzrr1_sectionIcon_2()
      } catch(e) {
        console.error("Error ESAtom Id: 6AhamTkTt8lzrr1_sectionIcon_2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom6AhamTkTt8lzrr1_messageText1 = function() {
          (function() {
  var elementClassName = ".gt_atom-6AhamTkTt8lzrr1_messageText1";
  var id = "6AhamTkTt8lzrr1_messageText1";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function removeTextWrapperClass() {
      var $textWrapper = $element.find(".gt_box-desc");
      $textWrapper.unwrap();
    }

    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "6AhamTkTt8lzrr1_messageText1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "6AhamTkTt8lzrr1_messageText1",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if ("production" === "production") {
      removeTextWrapperClass();
    }
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom6AhamTkTt8lzrr1_messageText1()
      } catch(e) {
        console.error("Error ESAtom Id: 6AhamTkTt8lzrr1_messageText1" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom6AhamTkTt8lzrr1_uploadImage2 = function() {
          (function() {
  var elementClassName = ".gt_atom-6AhamTkTt8lzrr1_uploadImage2";
  var id = "6AhamTkTt8lzrr1_uploadImage2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    /* store get state block script */
    /* methods block script */
    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settings = {
          elementId: "6AhamTkTt8lzrr1_uploadImage2",
          $doms: $(elementClassName),
          animationType: "block",
          mode: "production",
        }
        if (scrollIntoViewActive) {
          settings.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView"
          }
        }
        if (animationActive) {
          settings.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation"
          }
        }
        if (animationHoverActive) {
          settings.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settings)
      }
    }
    /* init block script */
    addInteraction();
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom6AhamTkTt8lzrr1_uploadImage2()
      } catch(e) {
        console.error("Error ESAtom Id: 6AhamTkTt8lzrr1_uploadImage2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom6AhamTkTt8lzrr1_messageText2 = function() {
          (function() {
  var elementClassName = ".gt_atom-6AhamTkTt8lzrr1_messageText2";
  var id = "6AhamTkTt8lzrr1_messageText2";
  var $elements = document.querySelectorAll(elementClassName);
  var store = window.SOLID.store;

  function script($target, indexEl) {
    var $element = $target;
    /* data block script */
    const scrollIntoViewActive = "false" == "true";
    const animationActive = "false" == "true";
    const animationHoverActive = "false" == "true";
    const scrollIntoView = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animation = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const animationHover = '{"delay":0,"duration":"1.5","iterationCount":1,"name":"none"}';
    const activeTextFixed = "false" === "true";
    const textFixedContent = "[!discount!] OFF"
    /* store get state block script */
    /* methods block script */
    function removeTextWrapperClass() {
      var $textWrapper = $element.find(".gt_box-desc");
      $textWrapper.unwrap();
    }

    function addInteraction() {
      if (animationActive || scrollIntoViewActive || animationHoverActive) {
        var settingsBlock = {
          elementId: "6AhamTkTt8lzrr1_messageText2",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "block"
        }
        var settingsText = {
          elementId: "6AhamTkTt8lzrr1_messageText2",
          $doms: $(elementClassName),
          mode: "production",
          animationType: "text"
        }
        if (scrollIntoViewActive) {
          settingsText.interactionScrollIntoView = {
            value: JSON.parse(scrollIntoView),
            previewAttr: "scrollIntoView",
          }
        }
        if (animationActive) {
          settingsBlock.interactionNormal = {
            value: JSON.parse(animation),
            previewAttr: "animation",
          }
        }
        if (animationHoverActive) {
          settingsBlock.interactionHover = {
            value: JSON.parse(animationHover),
            previewAttr: "animationHover"
          }
        }
        window.SOLID.library.animation(settingsText);
        window.SOLID.library.animation(settingsBlock);
      }
    }

    function initFixedContent() {
      const splitContent = textFixedContent.match(/(.+|\B)(\[\!.+\!\])(.+|\B)/);
      if (splitContent.length < 4) {
        return;
      }
      const beforeWord = splitContent[1];
      $element.find(".gt_content-text-before").html(beforeWord);
      const afterWord = splitContent[3];
      $element.find(".gt_content-text-after").html(afterWord);
    }
    /* init block script */
    addInteraction();
    if ("production" === "production") {
      removeTextWrapperClass();
    }
    if (activeTextFixed) {
      initFixedContent();
    }
    /* store subscribe block script */
    /* events block script */
    /* destroy block script */
    
  }
  /* run all script */
  function main() {
    for (var indexEl = 0; indexEl < $elements.length; indexEl++) {
      var $target = $($elements[indexEl]);
      script($target, indexEl);
    }
  }
  main();
  /*===================== DEVELOPER AREA ======================*/
  /* BEGIN */

  /* END */
})();
        }
        funcESAtom6AhamTkTt8lzrr1_messageText2()
      } catch(e) {
        console.error("Error ESAtom Id: 6AhamTkTt8lzrr1_messageText2" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESElement78752 = function() {
          var $elementProduct = $(".gt_element-78752");

var $price = $elementProduct.find(".gt_product-price");
if ($price && $price.length > 0) {
  $price.gtProductPrice({
    classCurrentPrice: ".gt_product-price--current",
    classComparePrice: ".gt_product-price--compare"
  });
}

var $featureImage = $elementProduct.find(".gt_product-image");
if ($featureImage && $featureImage.length > 0) {
  $featureImage.gtProductFeatureImage({
    classFeatureImage: ".gt_product-image--front, .gt_product-image--back",
    classImages: null,
    carousel: null,
    owlCarousel: null,
  });
}

var $swatches = $elementProduct.find(".gt_product_variants");
if ($swatches && $swatches.length > 0) {
  $swatches.gtProductSwatches({
    classCurrentValue: ".gt_product-variant-option--selected span",
    classCurrentStatus: ".gt_product-sold-out-tag",
    classItem: ".gt_product-variant-option",
    classInputIdHidden: ".gt_swatches--input",
    classBtnSelect: ".gt_swatches--select",
  });
}

var $saved = $elementProduct.find(".gt_product-sale-tag");
if ($saved && $saved.length > 0) {
  $saved.gtProductSaved({
    classTextPercent: ".gt_product-sale-tag--value--percent",
    classTextNumber: ".gt_product-sale-tag--value--number",
    dataFormat: "[!Profit!] off",
    dataFormatKey: "[!Profit!]",
    customCurrencyFormating: "shortPrefix"
  });
}

var $variantChecked = $elementProduct.find(".gt_product-variant--checked");
var $variantOptions = $elementProduct.find(".gt_product-variant-options");
var $variantOption = $elementProduct.find(".gt_product-variant-option");

$variantChecked.off("click.selectItem78752").on("click.selectItem78752", function() {
  var $options = $(this).siblings(".gt_product-variant-options");
  if($options.hasClass("gt_active")) {
    $options.removeClass("gt_active");
    $(this).removeClass("gt_active");
  } else {
    $variantOptions.removeClass("gt_active");
    $options.addClass("gt_active");
    $(this).addClass("gt_active");
  }
});

$variantOption.off("click.selectItem78752").on("click.selectItem78752", function() {
  $variantChecked.removeClass('gt_active');
  $variantOptions.removeClass('gt_active');
  var value = $(this).attr("data-value");
  var $variantCheckedCurrent =  $(this).closest(".gt_product-variant-box");
  $variantCheckedCurrent.find(".gt_product-variant--checked .gt_product-variant-option--selected span").html(value);
});

        }
        funcESElement78752()
      } catch(e) {
        console.error("Error ESElement Id: 78752" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom78752_productTitle = function() {
          var $atoms = jQuery(".gt_atom-78752_productTitle");
if (!$atoms || !$atoms.length) {
  return;
}

/* Variables */
var clientInteractionScrollIntoView = "";

window.SOLID.library.animation({
  $doms: $atoms,
  elementId: "78752_productTitle",
  animationType: "text",
  interactionScrollIntoView: {
    value: clientInteractionScrollIntoView,
    previewAttr: "interactionScrollIntoView"
  },
  mode: "production"
});

        }
        funcESAtom78752_productTitle()
      } catch(e) {
        console.error("Error ESAtom Id: 78752_productTitle" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom78752_productVendor = function() {
          var $atoms = jQuery(".gt_atom-78752_productVendor");
if (!$atoms || !$atoms.length) {
  return;
}

/* Variables */
var clientInteractionScrollIntoView = "";

window.SOLID.library.animation({
  $doms: $atoms,
  elementId: "78752_productVendor",
  animationType: "text",
  interactionScrollIntoView: {
    value: clientInteractionScrollIntoView,
    previewAttr: "interactionScrollIntoView"
  },
  mode: "production"
});

        }
        funcESAtom78752_productVendor()
      } catch(e) {
        console.error("Error ESAtom Id: 78752_productVendor" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
      try {
        const funcESAtom78752_productButtonBuy = function() {
          /* Init Actions */
var $atoms = jQuery(".gt_atom-78752_productButtonBuy");
if (!$atoms || !$atoms.length) {
  return;
}
/* Variables */
const interactionHover = {"name":"none","duration":"1.5","delay":0,"iterationCount":1};
const interactionNormal = {"name":"none","duration":"1.5","delay":0,"iterationCount":"infinite"};
const interactionWhilePress = {"name":"none","duration":"1.5","delay":0,"iterationCount":1};
const interactionScrollIntoView = "";
// animation
window.SOLID.library.animation({
  elementId: "78752_productButtonBuy",
  $doms: $atoms,
  interactionNormal: {
    value: interactionNormal,
    previewAttr: "interactionButton"
  },
  interactionHover: {
    value: interactionHover,
    previewAttr: "interactionButtonHover"
  },
  interactionWhilePress: {
    value: interactionWhilePress,
    previewAttr: "interactionButtonWhitePress"
  },
  interactionScrollIntoView: {
    value: interactionScrollIntoView,
    previewAttr: "interactionScrollIntoView"
  },
  animationType: "block",
  mode: "production",
})

for (let i = 0; i < $atoms.length; i++) {
  const $atom = $atoms[i];
  // function customEvent(actions, id, key)
  
    $($atom).customEvent([{"control":{"attribute":"pickProductButton","id":"pickProductButton","type":"pickproduct","isButtonAddToCard":true},"event":"click","id":1},{"control":{"attribute":"pickLinkButton","id":"pickLinkButton","newTab":false,"reference":"html","title":"Pick Link","type":"picklink","value":"/cart"},"event":"click","id":2}], "78752_productButtonBuy" + "_" + i);
  

  /* Listen if is button add to card */

  window.SOLID.store.subscribe("loading-buy-now-78752_productButtonBuy" + "_" + i, function (isDisplay) {
    const $loadingEl = $($atom).find(".atom-button-loading-circle-loader");
    const $textEl = $($atom).find(".gt_button-content-text");
    if ($loadingEl && $loadingEl.length && $textEl && $textEl.length) {
      let timeout = undefined;
      if (isDisplay === true) {
        /* display loading button */
        clearTimeout(timeout);
        $loadingEl.css("display", "inline-block");
        $textEl.css("visibility", "hidden");
      } else if (isDisplay === "stop") {
        /* stop loading */
        $loadingEl.removeAttr("style");
        $textEl.removeAttr("style");
        window.SOLID.store.dispatch("loading-buy-now-78752_productButtonBuy", "");
        window.SOLID.store.dispatch("loading-buy-now-78752_productButtonBuy" + "_" + i, "");
      } else if (isDisplay === false){
        clearTimeout(timeout);
        /* display tick button */
        $loadingEl.addClass("load-complete");
        $loadingEl.find(".atom-button-loading-check-mark").css("display", "block");
        /* remove tick button and display text*/
        timeout = setTimeout(function() {
          $loadingEl.removeClass("load-complete");
          $loadingEl.find(".atom-button-loading-check-mark").removeAttr("style");
          $loadingEl.removeAttr("style");
          $textEl.removeAttr("style");
          window.SOLID.store.dispatch("loading-buy-now-78752_productButtonBuy", "");
          window.SOLID.store.dispatch("loading-buy-now-78752_productButtonBuy" + "_" + i, "");
        }, 3000);
      }
    }
  });
}
for (let i = 0; i < $atoms.length; i++) {
  const $atom = $atoms[i];
  
      window.SOLID.library.gtBuyProductListenSoldOut({
        $element: $atom,
        options: {
          isButtonAddToCard: true, 
          textAddToCard: "Add to cart", 
          textSoldOut: "Sold out"
        }
      })
  
  
}


        }
        funcESAtom78752_productButtonBuy()
      } catch(e) {
        console.error("Error ESAtom Id: 78752_productButtonBuy" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
})(window.esQuery || jQuery, window.esQuery || jQuery);

    
  
/*
  You SHOULD NOT modify source code in this page because
  It is automatically generated from EcomSolid
  Try to edit page with the live editor.
  https://ecomsolid.com
*/

    (function(jQuery, $) {
      
      try {
        const funcESWidgetmRnnFnI6RxfYs6c = function() {
          var gtVariantsStyleV2Instance;
var initVariantStyle = function() {
  var colorVariantTitle = "";
  var customColors = [];
  var colorVariantSize = "";
  var colorVariantSizeSelect = "";
  var colorVariantRadius = "3px";
  
  colorVariantTitle = "Color";

  // Format custom color snippet to variable
  

  // Add variable to local script
  
      var stringCustomColor = '[{"title":"Dark blue","color":"#0635c9"},{"title":"Light blue","color":"#1ae5be"}]';
      customColors = JSON.parse(stringCustomColor);
  
  

  // Design color
  
  
  

  var imageVariantTitle = ""
  var customImages = [];
  var imageVariantSize = "";
  var imageVariantSizeSelect = "";
  var imageVariantRadius = "3px";
  
  imageVariantTitle = "Material"

  // Format custom image snippet to variable
  

  // Add variable to local script
  
  
  // Design image
  
      imageVariantSize = "60px"
      imageVariantSizeSelect = "24px"
  
  
      imageVariantRadius = "3px"
  
  
  
  gtVariantsStyleV2Instance = window.SOLID.library.gtVariantsStyleV2({
    $element: $('body'),
    options: {
      colors: customColors,
      colorVariantTitle: colorVariantTitle,
      colorVariantCircle: true,
      colorVariantRadius: colorVariantRadius,
      colorVariantSize: colorVariantSize,
      colorVariantSizeSelect: colorVariantSizeSelect,
      images: customImages,
      imageVariantTitle: imageVariantTitle,
      imageVariantCircle: false,
      imageVariantSize: imageVariantSize,
      imageVariantSizeSelect: imageVariantSizeSelect,
      imageVariantRadius: imageVariantRadius,
      variantTooltip: true,
      hideSoldOutVariants: true,
      variantSaleTag: false,
      variantSaleTagTitle: "Packs",
      variantSaleTagFormat: "[!Value!]% off",
      variantSaleTagTextColor: "#1D1D1B",
      variantSaleTagBackgroundColor: "#1AE5BE",
      variantSaleTagBorderRadius: "20px",  
      hideNoneExistVariant: false,
      mode: "production",
    }
  });

}

initVariantStyle();


        }
        funcESWidgetmRnnFnI6RxfYs6c()
      } catch(e) {
        console.error("Error ESWidget Id: mRnnFnI6RxfYs6c" )
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    
    try {
      function triggerDToStore() {
        window.SOLID = window.SOLID || {};
        var discounts = window.SOLID.discounts || [];
        if (window.store && window.store.update) {
          window.store.update("discounts", discounts)
        }
      }
      triggerDToStore()
    } catch(e) {
      console.log("=============================== START ERROR =================================")
      console.log(e)
      console.log("===============================  END ERROR  =================================")
    }
  
    })(window.esQuery || jQuery, window.esQuery || jQuery);
  
    
  