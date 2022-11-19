#!/bin/bash

echo "Connecting to $MYDBURL with user $MYDBUSER using `psql --version`" >> /var/www/html/out.txt

/usr/sbin/httpd -DFOREGROUND

exit 0