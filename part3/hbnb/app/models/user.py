#!/usr/bin/python3
'''User Class module
Defines a User class that inherits from BaseModel
including attributes for user information and validation'''


import re
from .basemodel import BaseModel
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()


class User(BaseModel):
    '''Represents a user with various attributes and restrictions'''

    def __init__(self, first_name, last_name, email, password, is_admin=False):
        '''Initialize a new User instance with validation'''
        super().__init__()
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.is_admin = is_admin
        self.password = password

    @property
    def first_name(self):
        return self._first_name

    @first_name.setter
    def first_name(self, value):
        if len(value) > 50 or not re.fullmatch(r'^[A-Za-zÀ-ÖØ-öø-ÿ -\']+$',
                                               value):
            raise ValueError(
                "First name must be present with a maximum of"
                " 50 characters and can only contain letters and "
                "spaces '-' and '\''."
            )
        if not isinstance(value, str):
            raise TypeError("First name must be a string of characters.")
        self._first_name = value

    @property
    def last_name(self):
        return self._last_name

    @last_name.setter
    def last_name(self, value):
        if len(value) > 50 or not re.fullmatch(r'^[A-Za-zÀ-ÖØ-öø-ÿ -\']+$',
                                               value):
            raise ValueError(
                "Last name must be present with a maximum of 50 "
                "characters and can only contain letters and spaces."
            )
        if not isinstance(value, str):
            raise TypeError("Last name must be a string of characters.")
        self._last_name = value

    @property
    def email(self):
        return self._email

    @email.setter
    def email(self, value):
        if not re.fullmatch(
            r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', value
        ):
            raise ValueError("The email format is invalid.")
        self._email = value

    @property
    def is_admin(self):
        return self._is_admin

    @is_admin.setter
    def is_admin(self, value):
        if not isinstance(value, bool):
            raise TypeError("Admin must be a boolean.")
        self._is_admin = value

    def hash_password(self, password):
        """Hashes the password before storing it."""
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def verify_password(self, password):
        """Verifies if the provided password matches the hashed password."""
        return bcrypt.check_password_hash(self.password, password)