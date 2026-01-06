FROM python:3.12

ENV PYTHONUNBUFFERED=1

WORKDIR /code

# Install uv
# Ref: https://docs.astral.sh/uv/guides/integration/docker/#installing-uv
COPY --from=ghcr.io/astral-sh/uv:0.5.11 /uv /uvx /bin/

# Place executables in the environment at the front of the path
# Ref: https://docs.astral.sh/uv/guides/integration/docker/#using-the-environment
ENV PATH="/code/.venv/bin:$PATH"

# Compile bytecode
# Ref: https://docs.astral.sh/uv/guides/integration/docker/#compiling-bytecode
ENV UV_COMPILE_BYTECODE=1

# uv Cache
# Ref: https://docs.astral.sh/uv/guides/integration/docker/#caching
ENV UV_LINK_MODE=copy

# Install dependencies
# Ref: https://docs.astral.sh/uv/guides/integration/docker/#intermediate-layers
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --frozen --no-install-project

COPY ./pyproject.toml /code/pyproject.toml
COPY ./uv.lock /code/uv.lock
COPY ./alembic.ini /code/alembic.ini
COPY ./entrypoint.sh /code/entrypoint.sh
COPY ./prestart.sh /code/prestart.sh

COPY ./src /code/src

RUN chmod +x /code/entrypoint.sh
RUN chmod +x /code/prestart.sh

RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync
 
# Install DebugPy to Debug:
RUN uv pip install debugpy

ENTRYPOINT ["sh", "entrypoint.sh"]
