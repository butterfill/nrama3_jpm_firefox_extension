var self = require('sdk/self');

var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");

var preferences = require("sdk/simple-prefs").prefs;


var button = buttons.ActionButton({
  id: "nrama-link",
  label: "Visit note-o-rama.com",
  icon: {
    "32": "./nrama_logo_32x32.png"
  },
  onClick: handleClick
});

function handleClick(state) {
  // tabs.open("http://www.note-o-rama.com/users/"+username);
  worker = tabs.activeTab.attach({
    contentScriptFile: [
      self.data.url("nrama.contentscript.ff-extension.bundle.js")
    ]
  });
  var username = preferences['username'];
  var password = preferences['password'];
  worker.port.emit("nrama_init", {username:username, password:password});
  worker.port.on("nrama_update_user", function(user_info){
    preferences['username'] = user_info.username;
    preferences['password'] = user_info.password;
  });
} 