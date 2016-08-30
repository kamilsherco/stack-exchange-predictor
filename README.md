# Introduction

stock-exchange-predictor

# Fast start

For Angular 2 development information and wiki, look here:
 - [Angular2-Seed-Express](https://github.com/vyakymenko/angular2-seed-express) Wow wow it's our parent :)


```bash
git clone --depth 1 https://github.com/vyakymenko/angular2-seed-express.git
cd angular2-seed-express
# install the project's dependencies
npm install
# watches your files and uses livereload by default
npm start
# api document for the app
# npm run build.docs

# dev build
npm run build.dev
# prod build
npm run build.prod

# run Redis
$ src/redis-server
# stop Redis
$ src/redis-cli
$ shutdown SAVE

# run Express server (keep in touch, only after `npm run build.prod` )
$ node app.server.prod.js
# or
$ node app.server.dev.js

# ren server in daemon mode
$ pm2 start app.server.prod.js
```

# Need to know

Before starting development. Run you development server:
```sh
# run dev server
$ node app.server.dev.js
```

# Express Server

Express server run for prod build.

```sh
# run Express server (keep in touch, only after `npm run build.prod` )
# keep in mind that prod build will be builded with prod env flag
$ node app.server.prod.js

# run Express server in dev moe
$ node app.server.dev.js
```

# Daemonize Server

For daemonize i propose to uze `PM2`.
```sh
# before daemonize server `npm run build.prod`
$ pm2 start app.server.prod.js

# restart daemon
$ pm2 restart all

# in cluster mode ( example 4 workers )
$ pm2 start app.server.prod.js -i 4

```
More details about [PM2](http://pm2.keymetrics.io/)

# How to configure my NginX

```
##
# Your Angular.io NginX .conf
##

http {
  log_format gzip '[$time_local] ' '"$request" $status $bytes_sent';
  access_log /dev/stdout;
  charset utf-8;

  default_type application/octet-stream;

  types {
    text/html               html;
    text/javascript         js;
    text/css                css;
    image/png               png;
    image/jpg               jpg;
    image/svg+xml           svg svgz;
    application/octet-steam eot;
    application/octet-steam ttf;
    application/octet-steam woff;
  }


  server {
    listen            3353;
    server_name       local.example.com;

    root app/;
    add_header "X-UA-Compatible" "IE=Edge,chrome=1";

    location ~ ^/(scripts|styles)/(.*)$ {
      root .tmp/;
      error_page 404 =200 @asset_pass;
      try_files $uri =404;
      break;
    }

    location @asset_pass {
      root app/;
      try_files $uri =404;
    }

    location / {
      expires -1;
      add_header Pragma "no-cache";
      add_header Cache-Control "no-store, no-cache, must-revalicate, post-check=0 pre-check=0";
      root app/;
      try_files $uri $uri/ /index.html =404;
      break;
    }
  }

  server {
    listen 3354;

    sendfile on;

    ##
    # Gzip Settings
    ##
    gzip on;
    gzip_http_version 1.1;
    gzip_disable      "MSIE [1-6]\.";
    gzip_min_length   1100;
    gzip_vary         on;
    gzip_proxied      expired no-cache no-store private auth;
    gzip_types        text/plain text/css application/json application/javascript application/x-javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_comp_level   9;


    root dist/;

    location ~ ^/(assets|bower_components|scripts|styles|views) {
      expires     31d;
      add_header  Cache-Control public;
    }

    ##
    # Main file index.html
    ##
    location / {
      try_files $uri $uri/ /index.html =404;
    }
  }
}
```

You can look in source file [here](https://github.com/vyakymenko/angular2-nginx-config-example/blob/master/ng2-application.conf).



# Express Configuration

`src/server/index.js`

```ts
var _clientDir = '../client'; // Dist prod folder.
```

`app.server.dev.js`
```js
// Configure server Port ( keep in mind that this important if you will use reverse-proxy)
// Dev mode will give you only middleware.
// WARNING! DEPEND ON YOUR Angular2 SEED PROJECT API CONFIG!
/**
 * @ng2 Server Runner `Development`.
 */
require('./server')(9001, 'dev');
```

`app.server.prod.js`
```js
// Configure server Port ( keep in mind that this important if you will use reverse-proxy)
// Prod mode give you middleware + static.
// WARNING! DEPEND ON YOUR Angular2 SEED PROJECT API CONFIG!
/**
 * @ng2 Server Runner `Production`.
 */
require('./server')(9000);
```

# Reverse Proxy NginX Config Example
```
server {
    listen 80;

    # App Web Adress Listener
    server_name www.example.com example.com;

    location / {
        # Port where we have our daemon `pm2 start app.server.js`
        proxy_pass http://example.com:9000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

# Redis Download/Install

 - About [Redis](http://redis.io/).
 - [Download](http://redis.io/download#download) and [install](http://redis.io/download#installation) latest stable version of Redis.
 - [Documentation](http://redis.io/documentation) about Redis.

# Redis Start

After installation we need to start our server:
```sh
# start server
$ src/redis-server
```

# License

MIT
