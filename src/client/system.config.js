System.config({
  map: {
    angularfire2: 'vendor/angularfire2',
    firebase: 'vendor/firebase/lib',
    rxjs: 'vendor/rxjs',
    '@angular2-material': 'vendor/@angular2-material'
  },
  packages: {
    app: {
      format: 'register',
      defaultExtension: 'js'
    },
    angularfire2: {
      defaultExtension: 'js',
      format: 'cjs',
      main: 'angularfire2.js'
    },
    firebase: {
      defaultExtension: 'js',
      format: 'cjs',
      main: 'firebase-web.js'
    },
    rxjs: {
      defaultExtension: 'js',
      format: 'cjs',
      main: 'Rx.js'
    },
    '@angular2-material/core': {
      format: 'cjs',
      defaultExtension: 'js',
      main: 'core.js'
    },
    '@angular2-material/toolbar': {
      format: 'cjs',
      defaultExtension: 'js',
      main: 'toolbar.js'
    },
    '@angular2-material/sidenav': {
      format: 'cjs',
      defaultExtension: 'js',
      main: 'sidenav.js'
    },
    '@angular2-material/button': {
      format: 'cjs',
      defaultExtension: 'js',
      main: 'button.js'
    },
    '@angular2-material/card': {
      format: 'cjs',
      defaultExtension: 'js',
      main: 'card.js'
    },
    '@angular2-material/progress-circle': {
      format: 'cjs',
      defaultExtension: 'js',
      main: 'progress-circle.js'
    }
  }
});
