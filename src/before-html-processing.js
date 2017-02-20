import option from './option'

const REGEX_SCRIPT = /(<head>[\s\S]*?)(<script\b[\s\S]*?<\/head>)/
const REGEX_HEAD = /<\/head>/
const REGEX_STYLE = /<head>/
const script = (originScreenWidth) => `
  <script>
  ;(function(){
     var metaEl = document.querySelector('meta[name="viewport"]');
      var dpr = window.devicePixelRatio || 1;
      var ua = window.navigator.userAgent
      var isAndroid = /android/gi.test(ua);
      var isIphone = /iphone/gi.test(ua)
      if(isAndroid){
        dpr = 1;
      }else if(isIphone){
        if (dpr > 2) {
            dpr = 2
        }
      }
      var scale = 1 / dpr;
      var contentWidth = window.screen.width * dpr;
      metaEl.setAttribute('content', 'width=' + contentWidth + ',initial-scale=' + scale + ',maximum-scale=' + scale +
          ', minimum-scale=' + scale + ',user-scalable=no')
      document.documentElement.setAttribute('data-dpr', dpr);
      addEventListener('DOMContentLoaded', function () {
          document.documentElement.style.fontSize = 100 * contentWidth / ${originScreenWidth} + 'px'
      })
  })();

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
