/**
 * This script is the core of the firefox extension.  It creates a button
 * and sets it up so that clicking it inserts the nrama contentscript into 
 * the current tab.
 *
 * TODO: use password manager to avoid storing password as plaintext.
 */

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


/**
 * attaches the nrama contentscript to the active tab
 * @param url is the url open in the tab to which the script will be attached
 */
function attach_nrama(){
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
  worker.port.on('nrama_already_loaded_in_this_tab', function(page_id){
    var username = preferences['username'];
    tabs.open("https://noteorama.iriscouch.com/nrama/_design/nrama/_rewrite/users/" +encodeURIComponent(username) + '/sources/' +encodeURIComponent(page_id));
  });
}


function handleClick(state) {
  // tabs.open("http://www.note-o-rama.com/users/"+username);
  
  var url = tabs.activeTab.url;
  
  console.log('active: ' + url);
  
  if( url === 'about:blank' || tabs.activeTab.url === 'about:newtab' ) {
    // open nrama website
    var username = preferences['username'];
    tabs.open("http://www.note-o-rama.com/users/"+username);
  } else {
    attach_nrama();
  }
  
  
} 