FROM node:14
WORKDIR /usr/src/backend/app
RUN chown -R node:node /usr/src/backend/app/
RUN wget https://fastdl.mongodb.org/tools/db/mongodb-database-tools-debian92-x86_64-100.3.1.deb && \
    apt install ./mongodb-database-tools-*.deb && \
    rm -f mongodb-database-tools-*.deb
EXPOSE 3000
USER node
CMD ["npm", "start"]
