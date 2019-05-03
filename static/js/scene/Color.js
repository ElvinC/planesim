/**
 * Blend together two colors
 * @param {Number[]} A First color represented by an array with three values (0-255)
 * @param {Number[]} B Second color represented by an array with three values (0-255)
 * @param {Number} amount Blend ratio 0-1
 * @returns {Number[]} New blended color represented by array with three values (0-1)
 */
export function mixColor(A, B, amount) {
    var newColor = []
    for (var i = 0; i < 3; i++) {
        var colorA = Math.pow(A[i], 2);
        var colorB = Math.pow(B[i], 2);
        newColor.push(Math.sqrt(amount * (colorB - colorA) + colorA)/255)
    }
    return newColor
}