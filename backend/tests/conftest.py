from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import selectinload
from sqlmodel import Session, select

from src.core.config import settings
from src.core.db import engine, init_db
from src.main import app
from src.users.models import User
from tests.utils.user import authentication_token_from_email
from tests.utils.utils import get_superuser_token_headers


@pytest.fixture
def db() -> Generator[Session, None, None]:
    with Session(engine) as session:
        init_db(session)
        yield session
        try:
            statement = select(User).options(
                selectinload(User.collections), selectinload(User.practice_sessions)
            )
            users = session.exec(statement).all()
            for user in users:
                session.delete(user)
            session.commit()
        except Exception as e:
            print(f"Error during cleanup: {e}")
            session.rollback()


@pytest.fixture
def client() -> Generator[TestClient, None, None]:
    with TestClient(app) as c:
        yield c


@pytest.fixture
def superuser_token_headers(client: TestClient, db: Session) -> dict[str, str]:  # noqa: ARG001
    return get_superuser_token_headers(client)


@pytest.fixture
def normal_user_token_headers(client: TestClient, db: Session) -> dict[str, str]:
    return authentication_token_from_email(
        client=client, email=settings.EMAIL_TEST_USER, db=db
    )
