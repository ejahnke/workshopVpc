FROM amazoncorretto:8
ENV MYDBURL=defaultUrl
ENV MYDBUSER=defaultUser
RUN yum -y install procps
RUN yum -y install httpd
RUN yum -y install postgresql
ADD script.sh /usr/local/bin
RUN chmod 755 /usr/local/bin/script.sh
ADD index.html /var/www/html/
EXPOSE 80
ENTRYPOINT ["/usr/local/bin/script.sh"]
