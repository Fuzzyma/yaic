/*global describe before it should yaic*/

var imageToPromise = function (url) {
  return new Promise(function (resolve, reject) {
    var img = new window.Image()

    img.onload = function () {
      resolve(img)
    }
    img.onerror = function () {
      reject(img)
    }
    img.src = url
  })
}

var imageToCanvas = function (img) {
  var canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  canvas.getContext('2d').drawImage(img, 0, 0)
  return canvas
}

var hashCode = function (str) {
  var hash = 0
  var i
  var chr
  var len
  if (this.length === 0) return hash
  for (i = 0, len = this.length; i < len; i++) {
    chr = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + chr
    hash |= 0 // Convert to 32bit integer
  }
  return hash
}

var images = []

describe('yaic', function () {
  before(function () {
    this.timeout(5000)

    return Promise.all(
      [
        imageToPromise('images/dummy.jpg'),
        imageToPromise('images/1052x591_934x489+3+7to707x370+78+13_77deg_x_2.png'),
        imageToPromise('images/1185x666_915x479+7+-44to1834x960+75+80_99deg_x_1.png'),
        imageToPromise('images/456x256_266x179+11+11to394x265+32+48_67deg_x_1.3.png'),
        imageToPromise('images/567x318_459x254+18+-4to386x213+41+67_145deg_x_2.4.png'),
        imageToPromise('images/572x321_538x315+20+32to176x103+89+12_3deg_x_2.png'),
        imageToPromise('images/802x451_573x279+-3+-35to1315x640+98+45_142deg_x_2.2.png'),
        imageToPromise('images/892x501_476x284+5+9to1292x770+3+30_-171deg_x_1.6.png'),
        imageToPromise('images/904x508_862x343+36+-44to341x135+74+54_-156deg_x_1.5.png'),
        imageToPromise('images/988x555_629x300+-29+-19to1618x771+82+99_-67deg_x_1.9.png'),
        imageToPromise('images/746x419_413x369+42+-45to129x115+22+27_-58deg_x_0.5.png'),
        imageToPromise('images/910x511_856x344+21+32to753x302+25+50_-55deg_x_0.7.png')
      ]
    ).then(function (imgs) {
      images = imgs
    }).catch(function (err) {
      console.log(err)
      throw err
    })
  })

  it('returns canvas element', function () {
    should.equal(yaic(images[ 0 ], { width: 200, height: 200 }).tagName.toLowerCase(), 'canvas')
  })

  it('set correct canvas dimension', function () {
    var canvas = yaic(images[ 0 ], { width: 200, height: 200, targetWidth: 100, targetHeight: 100 })

    should.equal(canvas.width, 100)
    should.equal(canvas.height, 100)
  })

  it('creates transformed images correctly', function (done) {
    this.timeout(10000)
    var promises = []

    for (var i = 1; i < images.length; ++i) {
      var matches = images[ i ].src.match(/images\/(\d+?)x(\d+?)_(\d+?)x(\d+?)\+([+-]?\d+?)\+([+-]?\d+?)to(\d+?)x(\d+?)\+([+-]?\d+?)\+([+-]?\d+?)_(-?\d+?)deg_x_(\d+?\.?\d*?)\.png/)

      images[ 0 ].width = matches[ 1 ]
      images[ 0 ].height = matches[ 2 ]
      images[ 0 ].style.transform = 'scale(' + matches[ 12 ] + ') rotate(' + matches[ 11 ] + 'deg)'
      images[ 0 ].style.left = matches[ 5 ] + 'px'
      images[ 0 ].style.top = matches[ 6 ] + 'px'

      var canvas = yaic(
        images[ 0 ],
        {
          width: matches[ 3 ],
          height: matches[ 4 ],
          targetWidth: matches[ 7 ],
          targetHeight: matches[ 8 ],
          x: matches[ 9 ],
          y: matches[ 10 ]
        }
      )

      var img2 = imageToCanvas(images[ i ])

      promises.push(imageToPromise(canvas.toDataURL()).then((function (img2) {
        return function (img1) {
          should.equal(hashCode(imageToCanvas(img1).toDataURL()), hashCode(img2.toDataURL()))
        }
      })(img2)))
    }

    Promise.all(promises).then(function () {
      done()
    })
  })
})

