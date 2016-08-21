/*!
* yaic - Takes a (css transformed) image and clips it to to a given area
* @version 1.0.0
*
* @copyright Ulrich-Matthias Schäfer
* @license MIT
*
* BUILT: Mon Aug 22 2016 00:40:36 GMT+0200 (Mitteleuropäische Sommerzeit)
*/;
(function (w) {
  var yaic = w.yaic = function (img, area) {
    area.x = area.x || 0
    area.y = area.y || 0

    var parameters = calculateTransformationParameters(img, area, yaic.getTranslation(img), yaic.getScaling(img))
    return clip(img, parameters.translation, parameters.scaling, yaic.getRotation(img), parameters.width, parameters.height)
  }

  yaic.getTranslation = function (img) {
    return {
      x: parseFloat(img.style.left || 0),
      y: parseFloat(img.style.top || 0)
    }
  }

  yaic.getScaling = function (img) {
    return ((img.style.transform || '').match(/scale\((.+?)\)/) || [])[ 1 ] || 1
  }

  yaic.getRotation = function (img) {
    return ((img.style.transform || '').match(/rotate\((.+?)deg\)/) || [])[ 1 ] || 0
  }

  var calculateTransformationParameters = function (img, area, translation, scaling) {
    var imageScale = img.width / img.naturalWidth

    var areaScale = 1
    var scale = 1
    var areaRatio = area.width / area.height

    var imageDiff = {
      x: (img.naturalWidth * imageScale - img.naturalWidth) / 2,
      y: (img.naturalHeight * imageScale - img.naturalHeight) / 2
    }

    var canvasSize = {
      width: area.targetWidth,
      height: area.targetHeight
    }

    if (!area.targetWidth) {
      areaScale = scaling * imageScale

      // set width and height of area
      canvasSize.width = area.width / areaScale
      canvasSize.height = area.width / areaScale / areaRatio
    } else {
      areaScale = area.width / area.targetWidth
      scale = scaling * imageScale / areaScale
    }

    var areaDiff = {
      x: (img.naturalWidth / areaScale - img.naturalWidth) / 2,
      y: (img.naturalHeight / areaScale - img.naturalHeight) / 2
    }

    var translate = {
      x: (translation.x - area.x + imageDiff.x + areaDiff.x * areaScale) / areaScale,
      y: (translation.y - area.y + imageDiff.y + areaDiff.y * areaScale) / areaScale
    }

    return {
      translation: translate,
      scaling: scale,
      width: canvasSize.width,
      height: canvasSize.height
    }
  }

  var clip = function (img, translation, scaling, rotation, width, height) {
    var canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    var ctx = canvas.getContext('2d')
    ctx.save()
    ctx.translate(img.naturalWidth / 2, img.naturalHeight / 2)
    ctx.translate(translation.x, translation.y)
    ctx.scale(scaling, scaling)
    ctx.rotate(rotation * Math.PI / 180)
    ctx.translate(-img.naturalWidth / 2, -img.naturalHeight / 2)
    ctx.drawImage(img, 0, 0)
    ctx.restore()

    return canvas
  }

  if (w.jQuery) {
    w.jQuery.fn.yaic = function (area) {
      return this.map(function () {
        return yaic(this, area)
      })
    }
  }
})(window)
