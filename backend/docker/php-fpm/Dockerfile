# Use the official PHP image as the base image
ARG LARADOCK_PHP_VERSION
ARG BASE_IMAGE_TAG_PREFIX=latest
ARG APP_ENV=local

FROM laradock/php-fpm:${BASE_IMAGE_TAG_PREFIX}-${LARADOCK_PHP_VERSION}

# Set working directory
WORKDIR /var/www

# Install basic dependencies
RUN set -xe; \
  apt-get update -yqq && \
  pecl channel-update pecl.php.net && \
  apt-get install -yqq \
  apt-utils \
  dnsutils \
  gnupg2 \
  git \
  libcurl4-openssl-dev \
  apt-transport-https \
  lsb-release \
  pkg-config \
  libzip-dev \
  zip \
  unzip \
  libfreetype6-dev \
  libjpeg62-turbo-dev \
  libpng-dev \
  zlib1g-dev \
  libicu-dev \
  g++ \
  # Image optimization tools for Laravel
  jpegoptim \
  optipng \
  pngquant \
  gifsicle \
  libavif-bin

# SVGO installation skipped as per user request

# Install PHP extensions (core ones needed for Laravel)
RUN docker-php-ext-configure zip && docker-php-ext-install zip
RUN docker-php-ext-configure gd --with-freetype --with-jpeg && docker-php-ext-install gd
RUN docker-php-ext-install pdo_pgsql
RUN docker-php-ext-install pgsql
RUN docker-php-ext-install mbstring
RUN docker-php-ext-install exif
RUN docker-php-ext-install pcntl
RUN docker-php-ext-install bcmath
RUN docker-php-ext-install sockets
RUN docker-php-ext-configure intl && docker-php-ext-install intl

# Install Redis extension
RUN pecl install -o -f redis && rm -rf /tmp/pear && docker-php-ext-enable redis

###########################################################################
# Opcache:
###########################################################################

ARG INSTALL_OPCACHE=false

RUN if [ ${INSTALL_OPCACHE} = true ]; then \
  docker-php-ext-install opcache \
  ;fi

# Copy opcache configration
COPY ./opcache.ini /usr/local/etc/php/conf.d/opcache.ini

###########################################################################
# xDebug: (for test coverage)
###########################################################################

ARG INSTALL_XDEBUG=false
ARG XDEBUG_PORT=9003

RUN if [ ${INSTALL_XDEBUG} = true ]; then \
  # Install the xdebug extension
  # https://xdebug.org/docs/compat
  if [ $(php -r "echo PHP_MAJOR_VERSION;") = "8" ] || { [ $(php -r "echo PHP_MAJOR_VERSION;") = "7" ] && { [ $(php -r "echo PHP_MINOR_VERSION;") = "4" ] || [ $(php -r "echo PHP_MINOR_VERSION;") = "3" ] ;} ;}; then \
  if [ $(php -r "echo PHP_MAJOR_VERSION;") = "8" ]; then \
  pecl install xdebug-3.3.0; \
  else \
  pecl install xdebug-3.1.6; \
  fi; \
  else \
  if [ $(php -r "echo PHP_MAJOR_VERSION;") = "5" ]; then \
  pecl install xdebug-2.5.5; \
  else \
  if [ $(php -r "echo PHP_MINOR_VERSION;") = "0" ]; then \
  pecl install xdebug-2.9.0; \
  else \
  pecl install xdebug-2.9.8; \
  fi \
  fi \
  fi && \
  docker-php-ext-enable xdebug \
  ;fi

# Copy xdebug configuration for remote debugging
COPY ./xdebug.ini /usr/local/etc/php/conf.d/xdebug.ini

RUN if [ $(php -r "echo PHP_MAJOR_VERSION;") = "8" ] || { [ $(php -r "echo PHP_MAJOR_VERSION;") = "7" ] && { [ $(php -r "echo PHP_MINOR_VERSION;") = "4" ] || [ $(php -r "echo PHP_MINOR_VERSION;") = "3" ] ;} ;}; then \
  sed -i "s/xdebug.remote_host=/xdebug.client_host=/" /usr/local/etc/php/conf.d/xdebug.ini && \
  sed -i "s/xdebug.remote_connect_back=0/xdebug.discover_client_host=false/" /usr/local/etc/php/conf.d/xdebug.ini && \
  sed -i "s/xdebug.remote_port=9000/xdebug.client_port=${XDEBUG_PORT}/" /usr/local/etc/php/conf.d/xdebug.ini && \
  sed -i "s/xdebug.profiler_enable=0/; xdebug.profiler_enable=0/" /usr/local/etc/php/conf.d/xdebug.ini && \
  sed -i "s/xdebug.profiler_output_dir=/xdebug.output_dir=/" /usr/local/etc/php/conf.d/xdebug.ini && \
  sed -i "s/xdebug.remote_mode=req/; xdebug.remote_mode=req/" /usr/local/etc/php/conf.d/xdebug.ini && \
  sed -i "s/xdebug.remote_autostart=0/xdebug.start_with_request=yes/" /usr/local/etc/php/conf.d/xdebug.ini && \
  sed -i "s/xdebug.remote_enable=0/xdebug.mode=debug/" /usr/local/etc/php/conf.d/xdebug.ini \
  ;else \
  sed -i "s/xdebug.remote_autostart=0/xdebug.remote_autostart=1/" /usr/local/etc/php/conf.d/xdebug.ini && \
  sed -i "s/xdebug.remote_enable=0/xdebug.remote_enable=1/" /usr/local/etc/php/conf.d/xdebug.ini \
  ;fi
RUN sed -i "s/xdebug.cli_color=0/xdebug.cli_color=1/" /usr/local/etc/php/conf.d/xdebug.ini

###########################################################################
# CLEAN UP:
###########################################################################

# Clean up
RUN apt-get clean && \
  rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* && \
  rm -f /var/log/lastlog /var/log/faillog

# Copy PHP configuration
COPY ./laravel.ini /usr/local/etc/php/conf.d/

# Install Composer
COPY --from=composer:2.8 /usr/bin/composer /usr/bin/composer

# Configure non-root user
ARG PUID=1000
ENV PUID ${PUID}
ARG PGID=1000
ENV PGID ${PGID}

RUN groupmod -o -g ${PGID} www-data && \
  usermod -o -u ${PUID} -g www-data www-data

# Install Node.js and NPM
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
  && apt-get install -y nodejs \
  && npm install -g npm@latest

# Change current user to www
USER www-data

# Expose port 9000 and start php-fpm server
EXPOSE 9000
CMD ["php-fpm"]
