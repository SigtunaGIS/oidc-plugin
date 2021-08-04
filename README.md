# oidc-plugin
Plugin for OpenID Connect authorization with Origo.

Requires Origo 2.1.1 or later, Origo server with auth (not yet in the core) and an OpenID connect provider.

OpenID connect provider, client id and client secret are configured in Origo server.

#### Example usage of OIDC-plugin

**index.html:**
```html
    <head>
    	<meta charset="utf-8">
    	<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    	<meta http-equiv="X-UA-Compatible" content="IE=Edge;chrome=1">
    	<title>Origo exempel</title>
    	<link href="css/style.css" rel="stylesheet">
    </head>
    <body>
    <div id="app-wrapper">
    </div>
    <script src="js/origo.js"></script>
    <script src="plugins/oidc.min.js"></script>

    <script type="text/javascript">
    	//Init origo
      Oidc.createOidcAuth(
        {
          externalSessionUrl: 'url',
          updateSessionOnRefresh: true,
          sessionRefreshTimeout: 59,
          tokenEndpoint: '/origoserver/auth/access_token',
          authorizeEndpoint: '/origoserver/auth/authorize',
          signOutUrl: 'url'
        },
        client => {
          if (client.getUser().authenticated) {
            var origo = Origo('index.json');
            var oidcComponent = Oidc.OidcComponent(client);
            origo.on('load', function (viewer) {
              viewer.addComponent(oidcComponent);
            });
          } else {
            client.authorize();
          }
        }
      );
    </script>
```
## Settings
### Plugin component settings (in html file)
Option | Type | Description
---|---|---
`externalSessionUrl` | string | Initiates/updates external session if set. Access token is sent in the format `externalSessionUrl`?access_token=`access_token`
`updateSessionOnRefresh` | boolean | Updates external session on session refresh if set to `true` - Default is `false`
`sessionRefreshTimeout` | number | Time interval to refresh OpenID tokens - Required
`tokenEndpoint` | string | Path to origo server access token endpoint - Required
`authorizeEndpoint` | string | Path to origo server authorize endpoint - Required

