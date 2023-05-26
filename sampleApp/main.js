const firstAppId = "com.disney.disneyplus-prod";
// const firstAppId = "netflix";
const secondAppId = "com.cbs-all-access.webapp.prod";
// const secondAppId = "com.showtime.app.showtimeanytime";
const centerAppId = "com.showtime.app.showtime";
const storeAppId = "com.webos.app.discovery";

//Initialize function
var init = function () {
    // TODO:: Do your initialization job
    console.log('init() called');

    let focusBtn = 'center';
    focusBtnStyle(focusBtn);

    const btnLeft = document.querySelector('#btn-left');
    btnLeft.addEventListener('click', () => onClick('left'));
    btnLeft.textContent = `Try Disney`;
    const btnCenter = document.querySelector('#btn-center');
    btnCenter.addEventListener('click', () => onClick('center'));
    btnCenter.textContent = `Try Showtime`;
    const btnRight = document.querySelector('#btn-right');
    btnRight.addEventListener('click', () => onClick('right'));
    btnRight.textContent = `Try Paramount+`;    

    const appIdLeft = document.querySelector('#app-id-left');
    const appIdCenter = document.querySelector('#app-id-center');
    const appIdRight = document.querySelector('#app-id-right');

    appIdLeft.textContent = `App ID: ${firstAppId}`;
    appIdCenter.textContent = `App ID: ${centerAppId}`;
    appIdRight.textContent = `App ID: ${secondAppId}`;
    
    document.addEventListener('visibilitychange', function() {
        if(document.hidden){
            // Something you want to do when hide or exit.
        } else {
            // Something you want to do when resume.
        }
    });
 
    // add eventListener for keydown
    document.addEventListener('keydown', function(e) {
    	switch(e.keyCode){
    	case 37: //LEFT arrow
            console.log('LEFT arrow');
            focusBtn = changeFocus('left', focusBtn);
            focusBtnStyle(focusBtn);
    		break;
    	case 38: //UP arrow
            console.log('UP arrow');
            appInfo(focusBtn);
    		break;
    	case 39: //RIGHT arrow
            console.log('RIGHT arrow');
            focusBtn = changeFocus('right', focusBtn);
            focusBtnStyle(focusBtn);
    		break;
    	case 40: //DOWN arrow
            console.log('DOWN arrow');
            // listAllApps()
    		break;
    	case 13: //OK button
            onClick(focusBtn);
    		break;
    	case 10009: //RETURN button
		    // tizen.application.getCurrentApplication().exit();
    		break;
    	default:
    		console.log('Key code : ' + e.keyCode);
    		break;
    	}
    });
};
// window.onload can work without <body onload="">
window.onload = init;

function onClick(btn) {
    console.log(btn);
    let id = '';
    let side = 'center';
    switch(btn) {
        case 'left':
            id = firstAppId;
            side = 'left';
            break;
        case 'center':
            // id = storeAppId;
            id = centerAppId;
            side = 'center';
            break;
        case 'right':
            id = secondAppId;
            side = 'right';
            break;
    }
    const textOutput = document.querySelector(`#app-name-${side}`);
    textOutput.textContent = `App id: ${id}`;
    getAppLoadStatus(id);
    goToParamountWebos(id);
}

function appInfo(btn) {
  console.log(btn);
  let id = '';
  let side = 'center';
  switch(btn) {
      case 'left':
          id = firstAppId;
          side = 'left';
          break;
      case 'center':
          // id = storeAppId;
          id = centerAppId;
          side = 'center';
          break;
      case 'right':
          id = secondAppId;
          side = 'right';
          break;
  }
  const textOutput = document.querySelector(`#app-name-${side}`);
  textOutput.textContent = `App id: ${id}`;
  getAppLoadStatus(id);
}

function changeFocus(dir, currentFocus = 'center') {
    const focusRange = ['left', 'center', 'right'];
    let res = focusRange.indexOf(currentFocus);
    if (dir === 'left') {
        res = (res > 0) ? res - 1 : 0
    } else if (dir === 'right' ) {
        res = (res < focusRange.length - 1) ? res + 1 : focusRange.length - 1;
    }
    return focusRange[res];
}

function focusBtnStyle(btnId) {
    const focusRange = ['left', 'center', 'right'];
    focusRange.forEach(element => {
        document.querySelector(`#btn-${element}`).classList.remove("focused")
    })
    document.querySelector(`#btn-${btnId}`).classList.add("focused");
}

// WebOS One-time call
// Launching app without parameter
function launchLGApp(appId) {
  var request = webOS.service.request('luna://com.webos.applicationManager', {
    method: 'launch',
    parameters: { id: appId },
    onSuccess: function (inResponse) {
      console.log('The app is launched', id);
      // To-Do something
    },
    onFailure: function (inError) {
      console.log('Failed to launch the app');
      console.log('[' + inError.errorCode + ']: ' + inError.errorText);
      // To-Do something
      return;
    },
  });
}

// One-time call
// Checking app installation
function getAppLoadStatus(appId) {
  var request = webOS.service.request('luna://com.webos.applicationManager', {
    method: 'getAppLoadStatus',
    parameters: { appId },
    onSuccess: function (inResponse) {
      if (inResponse.exist) {
        console.log(`${appId} exists`, inResponse);
        // To-Do something
      } else {
        console.log(`${appId} does not exists`, inResponse);
        // To-Do something
      }
    },
    onFailure: function (inError) {
      console.log('Failed to check app installation');
      console.log('[' + inError.errorCode + ']: ' + inError.errorText);
      // To-Do something
      return;
    },
  });
}

            // WEBOS
function goToParamountWebos(appId) {
    var endpoint = "luna://com.webos.applicationManager", 
        // appId = "com.cbs-all-access.webapp.prod",
        storeId = "com.webos.app.discovery";

    var request = webOS.service.request(endpoint, {
        method: 'getAppLoadStatus',
        parameters: { appId },
        onSuccess: function (inResponse) {
            if (inResponse.exist) {
                console.log(`${appId} exists`, inResponse);
                launchWebosApp(appId);
            } else {
                console.log(`${appId} does not exists`, inResponse);
                launchContentStore(appId);
            }
        },
        onFailure: function (inError) {
            console.log('[' + inError.errorCode + ']: ' + inError.errorText);
            return;
        },
    });

    function launchWebosApp(appId) {
        // var appId = "com.cbs-all-access.webapp.prod";
        // var endpoint = "luna://com.webos.applicationManager";
        var request = webOS.service.request(endpoint, {
            method: 'launch',
            parameters: { id: appId },
            onSuccess: function (inResponse) {
                console.log('Paramount+ app launched');
            },
            onFailure: function (inError) {
                console.log('Failed to launch Paramount+ app', id);
                console.log('[' + inError.errorCode + ']: ' + inError.errorText);
                return;
            },
        });
    };

    function launchContentStore(appId) {
        // var storeId = "com.webos.app.discovery";
        var request = webOS.service.request(endpoint, {
            method: 'launch',
            parameters: { 
                id: storeId,
                params: {
                    "query": "category/GAME_APPS/" + appId,
                },
            },
            onSuccess: function (inResponse) {
                console.log('Content Store opened');
            },
            onFailure: function (inError) {
                console.log('Failed to open Content Store', appId);
                console.log('[' + inError.errorCode + ']: ' + inError.errorText);
                return;
            },
        });
    };
};
