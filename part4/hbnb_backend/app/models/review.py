#!/usr/bin/python3
'''Review Class'''


from .basemodel import BaseModel
from app import db
from sqlalchemy.orm import validates, relationship


class Review(BaseModel):
    __tablename__ = 'reviews'

    text = db.Column(db.String(500), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'),
                        nullable=False)
    place_id = db.Column(db.String(36), db.ForeignKey('places.id'),
                         nullable=False)

    @validates('text')
    def validate_text(self, key, value):
        '''Validate the text attribute'''
        if not value or len(value) > 500:
            raise ValueError(
                "Text review must be present and with 500 characters maximum."
            )
        return value

    @validates('user_id')
    def validate_user_id(self, key, value):
        '''Validate the user_id attribute'''
        if not value or not isinstance(value, str):
            raise ValueError("User must be present and an instance of User.")
        return value

    @validates('place_id')
    def validate_place_id(self, key, value):
        '''Validate the place_id attribute'''
        if not value or not isinstance(value, str):
            raise ValueError("Place must be present and an instance of Place.")
        return value

    @validates('rating')
    def validate_rating(self, key, value):
        '''Validate the rating attribute'''
        if not (1 <= value <= 5):
            raise ValueError("Rating must be between 1 and 5.")
        if not isinstance(value, int):
            raise TypeError("Rating must be an integer.")
        return value

    def to_dict(self):
        """Convert the review to a dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'user_name': self.author.first_name if self.author else "Unknown Name",
            'place_id': self.place_id,
            'rating': self.rating,
            'text': self.text,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
