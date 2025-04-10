import uuid

import pytest
from sqlmodel import Session, select

from src.flashcards.models import Card, Collection, PracticeCard, PracticeSession
from src.users.models import User
from src.users.schemas import UserCreate
from src.users.services import create_user


@pytest.fixture
def test_user(db: Session):
    """Create a test user for cascade tests."""
    email = f"test_cascade_{uuid.uuid4()}@example.com"
    password = "testpassword123"
    user_in = UserCreate(email=email, password=password)
    user = create_user(session=db, user_create=user_in)
    return user


@pytest.fixture
def test_collection(db: Session, test_user):
    """Create a test collection for cascade tests."""
    collection = Collection(name="Test Collection", user_id=test_user.id)
    db.add(collection)
    db.commit()
    db.refresh(collection)
    return collection


@pytest.fixture
def test_cards(db: Session, test_collection):
    """Create test cards for a collection."""
    card1 = Card(
        front="Card 1 Front", back="Card 1 Back", collection_id=test_collection.id
    )
    card2 = Card(
        front="Card 2 Front", back="Card 2 Back", collection_id=test_collection.id
    )
    db.add(card1)
    db.add(card2)
    db.commit()
    db.refresh(card1)
    db.refresh(card2)
    return [card1, card2]


@pytest.fixture
def test_practice_session(db: Session, test_user, test_collection):
    """Create a test practice session."""
    practice_session = PracticeSession(
        user_id=test_user.id,
        collection_id=test_collection.id,
        total_cards=2,
    )
    db.add(practice_session)
    db.commit()
    db.refresh(practice_session)
    return practice_session


@pytest.fixture
def test_practice_cards(db: Session, test_practice_session, test_cards):
    """Create test practice cards for a session."""
    practice_card1 = PracticeCard(
        session_id=test_practice_session.id, card_id=test_cards[0].id
    )
    practice_card2 = PracticeCard(
        session_id=test_practice_session.id, card_id=test_cards[1].id
    )
    db.add(practice_card1)
    db.add(practice_card2)
    db.commit()
    db.refresh(practice_card1)
    db.refresh(practice_card2)
    return [practice_card1, practice_card2]


@pytest.fixture
def multiple_collections(db: Session, test_user):
    """Create multiple collections for a user."""
    collection1 = Collection(name="Collection 1", user_id=test_user.id)
    collection2 = Collection(name="Collection 2", user_id=test_user.id)
    db.add(collection1)
    db.add(collection2)
    db.commit()
    db.refresh(collection1)
    db.refresh(collection2)

    card1 = Card(front="Card 1", back="Back 1", collection_id=collection1.id)
    card2 = Card(front="Card 2", back="Back 2", collection_id=collection2.id)
    db.add(card1)
    db.add(card2)
    db.commit()

    return {"collections": [collection1, collection2], "cards": [card1, card2]}


def verify_entity_deleted(db: Session, entity_class, entity_id):
    """Helper function to verify an entity was deleted."""
    entity = db.exec(select(entity_class).where(entity_class.id == entity_id)).first()
    return entity is None


def test_collection_cascade_delete_cards(db: Session, test_collection, test_cards):
    """Test that deleting a collection cascades to its cards."""
    collection_id = test_collection.id
    card_ids = [card.id for card in test_cards]

    db.delete(test_collection)
    db.commit()

    assert verify_entity_deleted(db, Collection, collection_id)
    for card_id in card_ids:
        assert verify_entity_deleted(db, Card, card_id)


def test_user_cascade_delete_collections(db: Session, test_user, multiple_collections):
    """Test that deleting a user cascades to their collections and cards."""

    user_id = test_user.id
    collection_ids = [
        collection.id for collection in multiple_collections["collections"]
    ]
    card_ids = [card.id for card in multiple_collections["cards"]]

    db.delete(test_user)
    db.commit()

    assert verify_entity_deleted(db, User, user_id)
    for collection_id in collection_ids:
        assert verify_entity_deleted(db, Collection, collection_id)
    for card_id in card_ids:
        assert verify_entity_deleted(db, Card, card_id)


def test_practice_session_cascade_delete(
    db: Session, test_practice_session, test_practice_cards, test_cards
):
    """Test that deleting a practice session cascades to practice cards but not actual cards."""

    session_id = test_practice_session.id
    practice_card_ids = [practice_card.id for practice_card in test_practice_cards]
    card_ids = [card.id for card in test_cards]

    db.delete(test_practice_session)
    db.commit()

    assert verify_entity_deleted(db, PracticeSession, session_id)
    for practice_card_id in practice_card_ids:
        assert verify_entity_deleted(db, PracticeCard, practice_card_id)

    for card_id in card_ids:
        assert not verify_entity_deleted(db, Card, card_id)


def test_collection_cascade_delete_practice_sessions(
    db: Session, test_collection, test_practice_session, test_practice_cards, test_cards
):
    """Test that deleting a collection cascades to practice sessions, practice cards, and cards."""

    collection_id = test_collection.id
    session_id = test_practice_session.id
    practice_card_ids = [practice_card.id for practice_card in test_practice_cards]
    card_ids = [card.id for card in test_cards]

    db.delete(test_collection)
    db.commit()

    assert verify_entity_deleted(db, Collection, collection_id)
    assert verify_entity_deleted(db, PracticeSession, session_id)
    for practice_card_id in practice_card_ids:
        assert verify_entity_deleted(db, PracticeCard, practice_card_id)
    for card_id in card_ids:
        assert verify_entity_deleted(db, Card, card_id)
