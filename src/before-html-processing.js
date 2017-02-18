import option from './option'

const REGEX_SCRIPT = /(<head>[\s\S]*?)(<script\b[\s\S]*?<\/head>)/
const REGEX_HEAD = /<\/head>/
const REGEX_STYLE = /<head>/
const script = (originScreenWidth) => `
  <script>
      if (document.readyState === 'complete') {
          document.documentElement.style.fontSize = 100 * innerWidth / 750 + 'px'
      } else {
          addEventListener('DOMContentLoaded', function () {
              console.log('in dom loaded')
              document.documentElement.style.fontSize = 100 * innerWidth / 750 + 'px'
          })
      }
  </script>
`
const style = `
  <style> body { font-size: .16rem; } </style>
`

const insertScript = (source, script) => {
  switch(true) {
    case REGEX_SCRIPT.test(source):
      return source.replace(REGEX_SCRIPT, (whole, before, after) => {
        return before + script + after
      })
    case REGEX_HEAD.test(source):
      return source.replace(REGEX_HEAD, script + '</head>')
    default:
      return script + source
  }
}

const insertStyle = (source, style) => {
  if(REGEX_STYLE.test(source)) {
    return source.replace(REGEX_STYLE, '<head>' + style)
  } else {
    return style + source
  }
}

export default (htmlPluginData, next) => {
  const {originScreenWidth} = option
  const html = insertScript(htmlPluginData.html, script(originScreenWidth))
  htmlPluginData.html = insertStyle(html, style)
  next();
}
