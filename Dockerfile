ARG NODE_VERSION=20.11.0

FROM node:${NODE_VERSION}-alpine3.19 as base

# PNPM enviroments
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# This is important for run pnpm
RUN corepack enable

COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build


FROM base

COPY --from=build /app/.output /app/.output

ENV PORT=3000
EXPOSE 3000

# NODE_ENV to production
ENV NODE_ENV=production

ENV BACKEND_REST_API_URL=http://localhost:8080

CMD [ "node", ".output/server/index.mjs" ]
