from flask import Blueprint, request, jsonify
from services.subscription_service import StatsService

stats_bp = Blueprint('stats', __name__)


@stats_bp.route('/summary', methods=['GET'])
def get_summary():
    summary = StatsService.get_summary()
    return jsonify(summary)


@stats_bp.route('/by-category', methods=['GET'])
def get_by_category():
    data = StatsService.get_by_category()
    return jsonify(data)


@stats_bp.route('/trend', methods=['GET'])
def get_trend():
    months = request.args.get('months', 6, type=int)
    data = StatsService.get_trend(months=months)
    return jsonify(data)
