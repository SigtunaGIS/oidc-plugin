import Origo from 'Origo';

const Oidc = function Oidc(options = {}) {
  const { autoHide = 'never', closeIcon = '#ic_close_24px', menuIcon = '#fa-user' } = options;
  let { signOutFunction = defaultSignOut, oidc_user } = options;
  let viewer;
  let map;
  let target;
  let isExpanded = false;
  let headerComponent;
  let contentComponent;
  let closeButton;
  let oidcMenu;
  let oidcMenuEl;
  let userAvatarButton;
  let userAvatarButtonEl;
  let logoutButton;
  let logoutButtonEl;
  let userNameItem;
  let userNameItemEl;
  let signOut;
  let displayName;

  console.log('oidc_user', oidc_user);
  if (!oidc_user) {
    console.log('no user object, returning undefined');
    return;
  }
  console.log('did not return');

  function defaultSignOut() {
    console.log('signout default');
  }

  function readUser() {
    const user_string = window.sessionStorage.getItem('oidc_user');
    oidc_user = JSON.parse(user_string);
  }

  const toggleUserMenu = function toggleUserMenu() {
    oidcMenuEl.classList.toggle('faded');
    userAvatarButtonEl.classList.toggle('faded');
    isExpanded = !isExpanded;
  };

  const close = function close() {
    if (isExpanded) {
      toggleUserMenu();
    }
  };

  const onMapClick = function onMapClick() {
    // if (autoHide === 'always') {
    close();
    // } else if (autoHide === 'mobile') {
    //   const size = viewer.getSize();
    //   if (size === 'm' || size === 's' || size === 'xs') {
    //     close();
    //   }
    // }
  };

  const MenuItem = function MenuItem({ icon, click, title = '', useButton = true } = {}) {
    let button;
    if (useButton) {
      button = Origo.ui.Button({
        cls: 'icon-smaller compact no-grow',
        click,
        icon
      });
    }
    const titleCmp = Origo.ui.Element({ cls: 'grow padding-left', innerHTML: title });
    return Origo.ui.Component({
      close,
      onInit() {
        console.log('MENUITEMoninit');
        if (useButton) this.addComponent(button);
      },
      onAdd() {
        console.log('MENUITEMonadd');
        this.on('render', this.onRender);
      },
      onRender() {
        console.log('MENUITEMonrender');
        if (useButton) {
          document.getElementById(titleCmp.getId()).addEventListener('click', () => {
            button.dispatch('click');
          });
        }
      },
      render() {
        return `<li class="flex row align-center padding-x padding-y-smaller ${useButton ? 'hover pointer' : ''}">
                  ${useButton ? button.render() : ''}
                  ${titleCmp.render()}
                </li>`;
      }
    });
  };

  return Origo.ui.Component({
    name: 'oidc',
    close,
    onInit() {
      displayName = oidc_user.displayname
      console.log('init');
      const menuButtonCls = isExpanded ? ' faded' : '';
      userAvatarButton = Origo.ui.Button({
        icon: menuIcon,
        cls: `control icon-smaller medium round absolute light top-right${menuButtonCls}`,
        style: 'top: 4rem',
        tooltipText: 'User menu',
        tooltipPlacement: 'west',
        click() {
          toggleUserMenu();
        }
      });

      closeButton = Origo.ui.Button({
        cls: 'small round margin-top-small margin-right-small icon-smaller grey-lightest',
        ariaLabel: 'Stäng användare',
        icon: closeIcon,
        click() {
          toggleUserMenu();
        }
      });

      userNameItem = MenuItem({
        title: displayName, 
        useButton: false
      })

      logoutButton = MenuItem({
        icon: closeIcon,
        click() {
          signOutFunction();
        },
        title: 'Logga ut'
      });

      headerComponent = Origo.ui.Element({
        cls: 'flex row justify-end',
        style: { width: '100%' },
        components: [closeButton]
      });

      contentComponent = Origo.ui.Component({
        render() {
          return `<div class="relative width-12"><ul class="padding-y-small" id="${this.getId()}""></ul></div>`;
        },
        onRender() {
          console.log('contentcomponentOnRender');
        },
        components: [userNameItem],
        onAdd() {
          this.addComponent(logoutButton);
        }
      });

      oidcMenu = Origo.ui.Element({
        cls: 'absolute flex column top-right control box bg-white overflow-hidden z-index-top faded',
        collapseX: true,
        style: 'top: 4rem',
        onRender() {
          console.log('oidcMenu-render');
        },
        components: [headerComponent, contentComponent]
      });
    },
    onAdd(evt) {
      console.log('onAdd');
      viewer = evt.target;
      target = document.getElementById(viewer.getMain().getId());
      map = viewer.getMap();
      this.on('render', this.onRender);
      this.addComponents([userAvatarButton, oidcMenu]);
      this.render();
      viewer.getMap().on('click', onMapClick);
    },
    render() {
      console.log('======render');

      //Get menu as html and append as child of the viewer dom element.
      const menuEl = Origo.ui.dom.html(oidcMenu.render());
      target.appendChild(menuEl);

      // Get menu dom node that was just added so Its easily accessible (mostly for menu toggle)
      oidcMenuEl = document.getElementById(oidcMenu.getId());

      // get menu button (avatariconbutton) as html and append as child of viewer element
      const el = Origo.ui.dom.html(userAvatarButton.render());
      target.appendChild(el);

      //get dom node of menu button (avatariconbutton) so its easily accessible
      userAvatarButtonEl = document.getElementById(userAvatarButton.getId());

      //get the username list item as html and append as child of the content-component
      userNameItemEl = Origo.ui.dom.html(userNameItem.render());
      document.getElementById(contentComponent.getId()).appendChild(userNameItemEl);

      //get the login button menu item as html and append as child of the content-component
      logoutButtonEl = Origo.ui.dom.html(logoutButton.render());
      document.getElementById(contentComponent.getId()).appendChild(logoutButtonEl);

      // Dispatch render to the loginbutton so it attaches its eventhandler.
      logoutButton.dispatch('render');

      //Dispatch render on this. Not completely sure why yet but without it the avatar-button doesn't work.
      this.dispatch('render');
    }
  });
};

export default Oidc;
