FROM node:24-alpine

WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && chown -R appuser:appgroup /app

COPY --chown=appuser:appgroup package*.json ./

USER appuser

RUN npm install --ignore-scripts

COPY --chown=appuser:appgroup . .

EXPOSE 3000

CMD ["node", "src/index.js"]