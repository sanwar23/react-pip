export function generateID (text, maxLength) { // string GenerateID(string text, int maxLength)
  text = text.replace(/[^A-Za-z0-9]/g, ' ')
  const words = text.split(' ')
  const wordLength = words[0].length < maxLength ? words[0].length : maxLength // First word
  let remainingLength = maxLength - wordLength // Length we have left after appending first word

  let id = upperCaseFirst(text.substr(0, wordLength))

  for (let i = 1; i < words.length; i++) {
    if (words[i] !== null && words[i] !== '') {
      const currLength = (words[i].length < remainingLength) ? words[i].length : remainingLength// if current word is longer than length left, cut it
      remainingLength = remainingLength - currLength // Length we have left if this word is appended
      if (id.length < maxLength) { // id.ToString().Length < maxLength
        id += upperCaseFirst(words[i].substr(0, currLength)) // id.Append(UppercaseFirst(words[i].Substring(0, curLength)));
      } else {
        break
      }
    }
  }
  return id
}

export function findUniqueID (id, appendCount, maxLength) {
  return new Promise((resolve, reject) => {
    try {
      const n = appendCount
      let chkID = id + n.toString()// append number after id from 1, 2, ...
      const newLength = chkID.length
      if (newLength > maxLength) {
        const surpass = newLength - maxLength
        chkID = id.substr(0, id.length - surpass) + n.toString() // Truncate id before appending the number if it reaches maximum length
      }
      return resolve(chkID)
    } catch (e) {
      return reject(e)
    }
  })
}

export function upperCaseFirst (s) { // UppercaseFirst(string s)
  if (!s || s === null || s === '') {
    return ''
  }
  return (s[0].toUpperCase() + s.substr(1)) // change s[0] to s.substring(0,1) for old browsers
}

export const generateRandomUniqueIdString = () => (Date.now() + Math.random()).toString()
