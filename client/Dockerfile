# Node.js 24 sobre Alpine Linux, distro minimalista
FROM node:24-alpine

# Directorio de trabajo del contenedor
WORKDIR /app

# Usuario sin privilegios
# addgroup -S appgroup
# * addgroup: Crea un grupo de usuarios en el sistema
# * -S: System group, sin directorio home, no es un usuario real
# * appgroup: Nombre del grupo
#
# adduser -S appuser -G appgroup:
# * adduser: Crea un usuario en el sistema
# * -S: Usuario del sistema, sin contraseña, shell o directorio home
# * appuser: Nombre del usuario
# * -G appgroup: Lo agrega al grupo appgroup
#
# chown -R appuser:appgroup /app
# * chown: Change owner, cambia el dueño de archivos o carpetas
# * -R: Recursivo, aplica a /app y todo lo que esté adentro
# * appuser:appgroup: Nuevo dueño = usuario appuser del grupo appgroup
# * /app: La carpeta de WORKDIR
RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && chown -R appuser:appgroup /app

# Copiar solo package*.json, se guarda en el cache de Docker.
# Si package.json no cambia, Docker reutiliza esta capa y salta el npm install.

COPY --chown=appuser:appgroup package*.json ./

USER appuser

# --ignore-scripts: Evita que dependencias vulneradas ejecuten código arbitrario al instalarse.
RUN npm install --ignore-scripts

# Copia todo lo que queda al directorio /app
COPY --chown=appuser:appgroup . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
