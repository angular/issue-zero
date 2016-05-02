System.config({
  map: {
    angularfire2: 'vendor/angularfire2',
    firebase: 'vendor/firebase/lib',
    '@angular2-material': 'vendor/@angular2-material',
    'hammerjs': 'vendor/hammerjs/hammer.js',
    '@ngrx': 'vendor/@ngrx'
  },
  packages: {
    '@ngrx/db': {
      format: 'cjs',
      main: 'index.js',
      defaultExtension: 'js'
    },
    '@ngrx/store': {
      format: 'cjs',
      main: 'dist/index.js',
      defaultExtension: 'js'
    },
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
    },
    '@angular2-material/list': {
      format: 'cjs',
      defaultExtension: 'js',
      main: 'list.js'
    },
    '@angular2-material/checkbox': {
      format: 'cjs',
      defaultExtension: 'js',
      main: 'checkbox.js'
    },
    '@angular2-material/input': {
      format: 'cjs',
      defaultExtension: 'js',
      main: 'input.js'
    }
  }
});
