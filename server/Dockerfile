FROM node:22-alpine

RUN apk add --update --no-cache \
    python3 \
    python3-dev \
    py3-pip \
    build-base \
    openblas-dev \
    gfortran

RUN pip install --break-system-packages joblib scikit-learn numpy pandas

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]