/**
 * 1、使用 concurrently 和 nodemon 来并行运行此文件
 * 2、此文件需要放在根目录下
 * 3、拷贝的目的地在此文件的同级目录下的 copyto.json 文件中
 */
/* copyto.json
[
  "example/element_ui",
  {
    "target": "example/element_plus",
    "node_modules": true,
    "project_name": true
  }
]
 */

const fs = require('fs')
const path = require('path')

/**
 * 判断指定路径的类型
 * @param {String} route 文件路径
 */
function type(route) {
  const stat = fs.statSync(route, { throwIfNoEntry: false })
  return {
    isFile: stat ? stat.isFile() : false,
    isFolder: stat ? stat.isDirectory() : false,
  }
}

/**
 * 需要被拷贝到的目的地
 * @returns {Array}
 */
function getTarget() {
  const name = 'copyto.json'
  const env = path.resolve(__dirname, name)
  if (!type(env).isFile) return []
  const envText = fs.readFileSync(env)

  return JSON.parse(envText)
}

/**
 * 需要被拷贝的文件集合和项目名
 * @returns {Object}
 */
function getConfig() {
  const project = __dirname.split(/(\/|\\)/).pop()

  const env = path.resolve(__dirname, 'package.json')
  if (!type(env).isFile) return { files: [], name: project }

  const envText = fs.readFileSync(env)
  const { files, name = project } = JSON.parse(envText)
  if (!files.includes('package.json')) {
    files.push('package.json')
  }
  return { files, name }
}

/**
 *
 * @param {Array} froms 需要被拷贝的文件或文件夹（以当前文件夹作为路径坐标起点）
 * @param {Array} tos 需要被拷贝到的路径（以当前文件夹作为路径坐标起点）
 */
async function copy(froms, tos, folder) {
  const files = []
  const folders = []

  for (let i = 0; i < froms.length; i++) {
    const from = path.resolve(__dirname, froms[i])
    const { isFile, isFolder } = type(from)
    if (isFile) {
      files.push([from, froms[i]])
    } else if (isFolder) {
      folders.push([from, froms[i]])
    }
  }

  for (let i = 0; i < tos.length; i++) {
    let to
    if (typeof tos[i] === 'string') {
      to = path.resolve(__dirname, tos[i])
    } else if (typeof tos[i] === 'object') {
      const { target, node_modules, project_name } = tos[i]
      to = path.resolve(__dirname, target, node_modules ? 'node_modules' : '', project_name ? folder : '')
    }
    if (!to) return

    const { isFolder } = type(to)
    // 先清除
    if (isFolder) {
      fs.rmSync(to, { force: true, recursive: true })
    }

    // 后创建
    fs.mkdirSync(to, { recursive: true })

    // 拷贝文件夹
    folders.forEach(([src, dest]) => {
      fs.cp(src, path.resolve(to, dest), { dereference: true, recursive: true }, () => {})
    })

    // 拷贝文件
    files.forEach(([src, dest]) => {
      debugger
      fs.copyFile(src, path.resolve(to, dest), () => {})
    })
  }
}

function exec() {
  const tos = getTarget()
  const { files, name } = getConfig()
  if (!tos.length || !files.length) return
  copy(files, tos, name)
}

exec()
