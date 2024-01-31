// crea un canvas con l'immagine e ne ritorno il context 2d
const draw = function (img) {
	let canvas = document.createElement('canvas')
	let c = canvas.getContext('2d')
	c.width = canvas.width = img.clientWidth
	c.height = canvas.height = img.clientHeight
	c.clearRect(0, 0, c.width, c.height)
	c.drawImage(img, 0, 0, img.clientWidth, img.clientHeight)
	return c
}

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   {number}  r       The red color value
 * @param   {number}  g       The green color value
 * @param   {number}  b       The blue color value
 * @return  {Array}           The HSL representation
 */
function rgbToHsl(r, g, b) {
	r /= 255
	g /= 255
	b /= 255
	var max = Math.max(r, g, b),
		min = Math.min(r, g, b)
	var h,
		s,
		l = (max + min) / 2

	if (max == min) {
		h = s = 0 // achromatic
	} else {
		var d = max - min
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0)
				break
			case g:
				h = (b - r) / d + 2
				break
			case b:
				h = (r - g) / d + 4
				break
			default:
				break
		}
		h /= 6
	}

	return { h, s, l }
}

function hexToHSL(hex) {
	// Converti il colore HEX in RGB
	let r = 0,
		g = 0,
		b = 0
	if (hex.length == 4) {
		r = parseInt(hex[1] + hex[1], 16)
		g = parseInt(hex[2] + hex[2], 16)
		b = parseInt(hex[3] + hex[3], 16)
	} else if (hex.length == 7) {
		r = parseInt(hex.substring(1, 3), 16)
		g = parseInt(hex.substring(3, 5), 16)
		b = parseInt(hex.substring(5, 7), 16)
	}

	// Converti il colore RGB da 0-255 a 0-1
	r /= 255
	g /= 255
	b /= 255

	// Trova il minimo e massimo valore tra R, G e B
	let cmin = Math.min(r, g, b)
	let cmax = Math.max(r, g, b)
	let delta = cmax - cmin
	let h = 0
	let s = 0
	let l = 0

	// Calcola il tono di colore (Hue)
	if (delta == 0) h = 0
	else if (cmax == r) h = ((g - b) / delta) % 6
	else if (cmax == g) h = (b - r) / delta + 2
	else h = (r - g) / delta + 4

	h = Math.round(h * 60)

	if (h < 0) h += 360

	// Calcola la saturazione (Saturation)
	l = (cmax + cmin) / 2
	s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))
	s = +(s * 100).toFixed(1)
	l = +(l * 100).toFixed(1)

	return { h, s, l }
}

function hslToHex(h, s, l) {
	l /= 100
	const a = (s * Math.min(l, 1 - l)) / 100
	const f = n => {
		const k = (n + h / 30) % 12
		const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
		return Math.round(255 * color)
			.toString(16)
			.padStart(2, '0') // convert to Hex and prefix "0" if needed
	}
	return `#${f(0)}${f(8)}${f(4)}`
}

// scompone pixel per pixel e ritorna un oggetto con una mappa della loro frequenza nell'immagine
const getColors = function (c) {
	if (!c || c.width === 0 || c.height === 0) return
	let color,
		colors = {}
	let pixels, r, g, b, a
	r = g = b = a = 0
	// let totalR = 0
	// let totalG = 0
	// let totalB = 0
	// let count = 0

	pixels = c.getImageData(0, 0, c.width, c.height)
	for (let i = 0, data = pixels.data; i < data.length; i += 4) {
		r = data[i]
		g = data[i + 1]
		b = data[i + 2]
		a = data[i + 3]
		if (a < 255 / 2) continue
		const hsl = rgbToHsl(r, g, b)
		if (hsl.l >= 0.22 && hsl.l <= 0.65 && hsl.s >= 0.35) {
			// totalR += r
			// totalG += g
			// totalB += b
			// count++
			color = rgbToHex(r, g, b)
			if (!colors[color]) {
				colors[color] = {}
				colors[color].count = 0
			}
			colors[color].count++
			colors[color].saturation = hsl.s
		}
	}
	// const data = pixels.data
	// console.log({
	// 	r: totalR / count,
	// 	g: totalG / count,
	// 	b: totalB / count,
	// })
	return colors
}

// converte un valore in rgb a un valore esadecimale
function rgbToHex(r, g, b) {
	// Converti ciascun componente RGB in una stringa HEX a due cifre
	const toHex = c => {
		const hex = c.toString(16)
		return hex.length == 1 ? '0' + hex : hex
	}

	return '#' + toHex(r) + toHex(g) + toHex(b)
}

// trova il colore più ricorrente data una mappa di frequenza dei colori
const findMostRecurrentColor = function (colorMap) {
	let highestValue = 0
	let highestValue2 = 0
	let mostRecurrent = null
	let mostSaturated = null
	for (const hexColor in colorMap) {
		const color = colorMap[hexColor]
		// const avg = color.saturation / color.count
		if (color.count > highestValue) {
			mostRecurrent = hexColor
			highestValue = color.count
		}
		if (color.saturation > highestValue2) {
			mostSaturated = hexColor
			highestValue2 = color.saturation
		}
	}

	if (Object.keys(colorMap).length / highestValue > 50) {
		const hsl = hexToHSL(mostRecurrent)
		if (hsl.s < 70) {
			return hslToHex(hsl.h, Math.min(hsl.s * 2, 100), Math.min(hsl.l * 1.1, 100))
		}
		return mostRecurrent
	}
	return mostSaturated
}

export const getMostRecurrentColor = function (imgReference) {
	// creo il context 2d dell'immagine selezionata
	let context = draw(imgReference)
	if (!context) return

	// creo la mappa dei colori più ricorrenti nell'immagine
	let allColors = getColors(context)
	if (!allColors) return

	// trovo il colore più ricorrente
	let mostRecurrentColor = findMostRecurrentColor(allColors)
	if (!mostRecurrentColor) return ''

	return mostRecurrentColor
}
