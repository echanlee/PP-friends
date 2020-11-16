export function setCookie(cname,cvalue) {
    window.document.cookie = cname + "=" + cvalue + ";";
  }
  
export function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(window.document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  export function clearCookies() {
    window.document.cookie = "";
  }