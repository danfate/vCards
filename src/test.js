const fs = require('fs')
const chalk = require('chalk')
const glob = require("glob").sync
const readChunk = require('read-chunk')
const isPng = require('is-png')
const prettyBytes = require('pretty-bytes')

const check = (type, name) => {

  const pathname = `../data/${type}/${name}`

  if (!fs.existsSync(`${pathname}.png`)) {
    return chalk.red('(缺少对应 PNG 图像)')
  }

  const lstat = fs.lstatSync(`${pathname}.png`)
  if (!lstat.isFile()) {
    return chalk.red('(PNG 图像非标准文件)')
  }

  const buffer = readChunk.sync(`${pathname}.png`, 0, 8)
  if (!isPng(buffer)) {
    return chalk.red('(PNG 图像格式不合法)')
  }

  if (lstat.size > 1024 * 20) {
    return `${chalk.red(`(PNG 图像超出大小限制 ${prettyBytes(lstat.size)} > 20 kB)`)}`
  }

  return true
}

let files = glob('../data/*/*.yaml')
console.log(`\n当前目录下发现 ${chalk.green(files.length)} 个联系人信息\n`)

for (let [index, file] of files.entries()) {
  const type = file.split('/')[2]
  const name = file.split('/')[3].split('.')[0]
  const result = check(type, name)
  if (result !== true) {
    console.log(` ${index + 1}\t${type}-${name} ${result}`)
    console.log()
    process.exit(1)
  } else {
    console.log(` ${index + 1}\t${type}-${name}`)
  }
}

console.log()
