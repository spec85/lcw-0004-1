from flask import Blueprint
from routes.subscriptions import subscriptions_bp
from routes.stats import stats_bp
from routes.settings import settings_bp

api_bp = Blueprint('api', __name__)

api_bp.register_blueprint(subscriptions_bp, url_prefix='/subscriptions')
api_bp.register_blueprint(stats_bp, url_prefix='/stats')
api_bp.register_blueprint(settings_bp, url_prefix='/settings')
