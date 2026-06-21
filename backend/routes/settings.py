from flask import Blueprint, request, jsonify
from services.subscription_service import SettingsService

settings_bp = Blueprint('settings', __name__)


@settings_bp.route('', methods=['GET'])
def get_settings():
    settings = SettingsService.get_settings()
    return jsonify({'alert_days': settings.alert_days})


@settings_bp.route('', methods=['PUT'])
def update_settings():
    data = request.get_json()
    
    if 'alert_days' not in data:
        return jsonify({'error': 'Missing alert_days field'}), 400
    
    if not isinstance(data['alert_days'], int) or data['alert_days'] <= 0:
        return jsonify({'error': 'alert_days must be a positive integer'}), 400
    
    settings = SettingsService.update_settings(data)
    return jsonify({'alert_days': settings.alert_days})
