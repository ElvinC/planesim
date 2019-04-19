
export function mixColor(A, B, amount) {
    var newColor = []
    for (var i = 0; i < 3; i++) {
        var colorA = Math.pow(A[i], 2);
        var colorB = Math.pow(B[i], 2);
        newColor.push(Math.sqrt(amount * (colorB - colorA) + colorA)/255)
    }
    return newColor
}