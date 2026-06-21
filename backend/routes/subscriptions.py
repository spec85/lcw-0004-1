from flask import Blueprint, request, jsonify
from services.subscription_service import SubscriptionService

subscriptions_bp = Blueprint('subscriptions', __name__)


@subscriptions_bp.route('', methods=['GET'])
def get_subscriptions():
    category = request.args.get('category')
    status = request.args.get('status')
    search = request.args.get('search')
    
    subscriptions = SubscriptionService.get_all_subscriptions(
        category=category,
        status=status,
        search=search
    )
    
    return jsonify([sub.to_dict() for sub in subscriptions])


@subscriptions_bp.route('/<int:subscription_id>', methods=['GET'])
def get_subscription(subscription_id):
    subscription = SubscriptionService.get_subscription_by_id(subscription_id)
    if not subscription:
        return jsonify({'error': 'Subscription not found'}), 404
    
    return jsonify(subscription.to_dict())


@subscriptions_bp.route('', methods=['POST'])
def create_subscription():
    data = request.get_json()
    
    required_fields = ['name', 'amount', 'next_billing_date', 'category']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    try:
        subscription = SubscriptionService.create_subscription(data)
        return jsonify(subscription.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@subscriptions_bp.route('/<int:subscription_id>', methods=['PUT'])
def update_subscription(subscription_id):
    data = request.get_json()
    
    try:
        subscription = SubscriptionService.update_subscription(subscription_id, data)
        if not subscription:
            return jsonify({'error': 'Subscription not found'}), 404
        
        return jsonify(subscription.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@subscriptions_bp.route('/<int:subscription_id>', methods=['DELETE'])
def delete_subscription(subscription_id):
    success = SubscriptionService.delete_subscription(subscription_id)
    
    if not success:
        return jsonify({'error': 'Subscription not found'}), 404
    
    return jsonify({'success': True})


@subscriptions_bp.route('/upcoming', methods=['GET'])
def get_upcoming():
    days = request.args.get('days', 7, type=int)
    
    subscriptions = SubscriptionService.get_upcoming_subscriptions(days=days)
    
    return jsonify([sub.to_dict() for sub in subscriptions])
