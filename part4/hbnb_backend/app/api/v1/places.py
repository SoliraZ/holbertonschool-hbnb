from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services import facade
from flask import request

api = Namespace('places', description='Place operations')

# Define the place model for input validation and documentation
place_model = api.model('Place', {
    'title': fields.String(required=True, description='Title of the place'),
    'description': fields.String(description='Description of the place'),
    'price': fields.Float(required=True, description='Price per night'),
    'latitude': fields.Float(required=True,
                             description='Latitude of the place'),
    'longitude': fields.Float(required=True,
                              description='Longitude of the place')
})


@api.route('/')
class PlaceList(Resource):
    @api.expect(place_model)
    @api.response(201, 'Place successfully created')
    @api.response(400, 'Invalid input data')
    @api.doc(security="token")
    @jwt_required()
    def post(self):
        """Register a new place"""
        current_user = get_jwt_identity()
        data = api.payload
        data['owner_id'] = current_user['id']
        try:
            place = facade.create_place(data)
            return place.to_dict(), 201
        except ValueError as e:
            return {'error': str(e)}, 400

    @api.response(200, 'List of places retrieved successfully')
    @api.doc(security="token")
    def get(self):
        """Retrieve a list of all places"""
        try:
            # Check if Authorization header is present
            auth_header = request.headers.get('Authorization')
            if auth_header and auth_header.startswith('Bearer '):
                # Token is present, but we don't require it for this endpoint
                # We can use it for additional functionality if needed
                pass
                
            places = facade.get_all_places()
            return [place.to_dict() for place in places], 200
        except ValueError as e:
            return {'error': str(e)}, 400

    def options(self):
        """Handle OPTIONS request for CORS preflight"""
        return '', 200


@api.route('/<place_id>')
class PlaceResource(Resource):
    @api.response(200, 'Place details retrieved successfully')
    @api.response(404, 'Place not found')
    @jwt_required()
    def get(self, place_id):
        """Get place details by ID"""
        try:
            place_data = facade.get_place(place_id)
            return place_data.to_dict(), 200
        except ValueError as e:
            return {'error': str(e)}, 404

    @api.expect(place_model)
    @api.response(200, 'Place updated successfully')
    @api.response(404, 'Place not found')
    @api.response(400, 'Invalid input data')
    @api.doc(security="token")
    @jwt_required()
    def put(self, place_id):
        """Update a place"""
        current_user = get_jwt_identity()
        data = api.payload
        try:
            place = facade.update_place(place_id, data, current_user['id'])
            return place.to_dict(), 200
        except ValueError as e:
            return {'error': str(e)}, 404
        except PermissionError as e:
            return {'error': str(e)}, 403

    @api.response(200, 'Place deleted successfully')
    @api.response(404, 'Place not found')
    @api.doc(security="token")
    @jwt_required()
    def delete(self, place_id):
        """Delete a place"""
        current_user = get_jwt_identity()
        try:
            facade.delete_place(place_id, current_user['id'])
            return {'message': 'Place deleted successfully'}, 200
        except ValueError as e:
            return {'error': str(e)}, 404
        except PermissionError as e:
            return {'error': str(e)}, 403

    def options(self, place_id=None):
        """Handle OPTIONS request for CORS preflight"""
        return {}, 200


@api.route('/<place_id>/amenities/<amenity_id>')
class PlaceAmenity(Resource):
    @api.response(201, 'Amenity sucessfully added to place.')
    @api.response(400, 'Invalid input data')
    @api.doc(security='token')
    @jwt_required()
    def post(self, place_id, amenity_id):
        """Add an amenity to a place"""
        current_user = get_jwt_identity()
        try:
            facade.add_amenity_to_place(place_id, amenity_id, current_user['id'])
            return {'message': 'Amenity added to place successfully'}, 201
        except ValueError as e:
            return {'error': str(e)}, 400
        except PermissionError as e:
            return {'error': str(e)}, 403

    @api.response(200, 'Amenity successfully removed from place.')
    @api.response(400, 'Invalid input data')
    @api.response(403, 'Unauthorized action')
    @api.doc(security='token')
    @jwt_required()
    def delete(self, place_id, amenity_id):
        """Remove an amenity from a place"""
        current_user = get_jwt_identity()
        try:
            facade.remove_amenity_from_place(place_id, amenity_id, current_user['id'])
            return {'message': 'Amenity removed from place successfully'}, 200
        except ValueError as e:
            return {'error': str(e)}, 400
        except PermissionError as e:
            return {'error': str(e)}, 403

    def options(self):
        """Handle OPTIONS request for CORS preflight"""
        return '', 200


@api.route('/<place_id>/reviews')
class PlaceReviews(Resource):
    @api.response(200, 'Reviews retrieved successfully')
    @api.response(404, 'Place not found')
    @jwt_required()
    def get(self, place_id):
        """Get all reviews for a place"""
        try:
            reviews = facade.get_reviews_by_place(place_id)
            return [review.to_dict() for review in reviews], 200
        except ValueError as e:
            return {'error': str(e)}, 404

    def options(self, place_id=None):
        """Handle OPTIONS request for CORS preflight"""
        return {}, 200
