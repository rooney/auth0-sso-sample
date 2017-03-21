$(document).ready(function () {

  // hide the page in case there is an SSO session (to avoid flickering)
  document.body.style.display = 'none';

  // Mimick going to app2 ssoCallback endpoint

  // instantiate Lock
 var lock = new Auth0Lock('3VRSUZtgCUl7QCB3r651noL4hrgY9cys', 'oc4.auth0.com', {
   auth: {
     params: {
       scope: 'openid name picture'
     }
   }
 });

 // instantiate Authentication object
 var authentication = new auth0.Authentication({
  domain:       'oc4.auth0.com',
  clientID:     '1eoEgcEjrUMzCIZ1h7keDnt8w9gga6DA',
});

// instantiate Authentication object
var webAuth = new auth0.WebAuth({
 domain:       'oc4.auth0.com',
 clientID:     '3VRSUZtgCUl7QCB3r651noL4hrgY9cys',
 callbackOnLocationHash: true
});

  // Handle authenticated event to store id_token in localStorage
  lock.on("authenticated", function (authResult) {
    isAuthCallback = true;

    webAuth.client.userInfo(authResult.accessToken, function(err, profile) {
    // Now you have the user's information

      localStorage.setItem('userToken', authResult.idToken);
      localStorage.setItem('accessToken', authResult.accessToken);
      localStorage.setItem('connection-name', getConnectionFromProfile(profile));

      goToHomepage(authResult.state, authResult.idToken);
      return;
    });
  });

  var isAuthCallback = false;

  // Get the user token if we've saved it in localStorage before
  var idToken = localStorage.getItem('userToken');
  if (idToken) {
    // This would go to a different route like
    // window.location.href = '#home';
    // But in this case, we just hide and show things
    goToHomepage(getQueryParameter('targetUrl'), idToken);
    return;
  } else {
    console.log('Get out of here !!!!')
  }

  // Showing Login
  $('.btn-login').click(function (e) {
    e.preventDefault();
    lock.show();
  });

  function goToHomepage(state, token) {
    // Instead of redirect, we just show boxes
    document.body.style.display = 'inline';
    $('.login-box').hide();
    $('.logged-in-box').show();
    var profile = jwt_decode(token);
    $('.name').text(profile.name);
    if (state) {
      $('.url').show();
      $('.url span').text(state);
    }

    var connectionName = localStorage.getItem('connection-name');
    if (connectionName !== null) {
      $('#app3-url').attr('href', $('#app3-url').attr('href') + '&connection=' + encodeURIComponent(connectionName));
    }
  }

  function getQueryParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&]*)"),
      results = regex.exec(location.search);
      results = results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
      console.log(results)
      return results
  }

  function getConnectionFromProfile(profile) {
    console.log('The profile is broken: ' + profile);
    /*
    var userIdSplits = profile.user_id.split('|');

    if (userIdSplits.length === 2) {
      var identity = profile.identities.find(function (identity) {
        return identity.provider === userIdSplits[0] && identity.user_id === userIdSplits[1];
      });

      if (identity !== 'undefined')
        return identity.connection;
    }*/

    return "";
  }
});
