import { findUniqueID, upperCaseFirst } from './generateId'
import { UserDetail } from '../db/models'

export async function generateUserWalletId (text, maxLength = 8) {
  let isUnique = false
  let id = await generateUniqueWalletId(text, maxLength)
  let chkID = id
  let appendCount = 0
  const allWallets = await UserDetail.findAll({ attributes: ['wallet_address'], raw: true })
  while (!isUnique) {
    const current = allWallets.find(obj => obj.wallet_address !== null && obj.wallet_address.toLowerCase() === chkID.toLowerCase() + '.qbe')
    if (current === undefined || current === null) {
      // We have no existing wallet with same id
      id = chkID
      isUnique = true
    } else {
      // We have an existing wallet with same id
      /**
        Unique ID must only contain a-z in lowercase and numbers from 1-5
        We will increment the count in such a way that on converting appendCount into base(6)
        it will result a series like 1, 2, 3, 4, 5, 11, 12, 13, 14, 15, 21, 22 ...and so on
        the last two digit number of this series is 55 because it is the last two-digit number
        in base(6) number system. The next produced number would be 111, 112, 113 ...and so on
       **/

      appendCount += 1
      if (appendCount % 6 === 0) {
        let appendCountBase6 = Math.floor(getBaseLog(6, appendCount))
        while (appendCountBase6 > 0) {
          appendCount += Math.pow(6, appendCountBase6 - 1)
          appendCountBase6 -= 1
        }
      }
      chkID = await findUniqueID(id, parseInt(appendCount.toString(6)), maxLength)
    }
  }
  return id
}

function generateUniqueWalletId (text, maxLength = 8) { // string generateWalletID(string text, int maxLength)
  text = text.replace(/[^A-Za-z1-5]/g, ' ')
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

function getBaseLog (x, y) {
  return Math.log(y) / Math.log(x)
}
