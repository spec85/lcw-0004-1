from datetime import date, timedelta
from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from models import db, Subscription, Settings

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    CORS(app)
    
    db.init_app(app)
    
    from routes import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')
    
    with app.app_context():
        db.create_all()
        seed_data()
    
    @app.route('/api/health')
    def health():
        return jsonify({'status': 'ok'})
    
    return app

def seed_data():
    if Subscription.query.count() > 0:
        return
    
    today = date.today()
    
    sample_subscriptions = [
        Subscription(name='Netflix', amount=68.00, billing_cycle='monthly', 
                     next_billing_date=today + timedelta(days=3), category='娱乐', status='active'),
        Subscription(name='Spotify', amount=15.00, billing_cycle='monthly',
                     next_billing_date=today + timedelta(days=10), category='音乐', status='active'),
        Subscription(name='Adobe Creative Cloud', amount=888.00, billing_cycle='yearly',
                     next_billing_date=today + timedelta(days=45), category='工具', status='active'),
        Subscription(name='iCloud+', amount=21.00, billing_cycle='monthly',
                     next_billing_date=today + timedelta(days=5), category='工具', status='active'),
        Subscription(name='哔哩哔哩', amount=148.00, billing_cycle='yearly',
                     next_billing_date=today + timedelta(days=60), category='娱乐', status='active'),
        Subscription(name='Notion', amount=96.00, billing_cycle='yearly',
                     next_billing_date=today + timedelta(days=20), category='效率', status='active'),
        Subscription(name='GitHub Pro', amount=40.00, billing_cycle='monthly',
                     next_billing_date=today + timedelta(days=2), category='工具', status='active'),
        Subscription(name='微信读书', amount=19.00, billing_cycle='monthly',
                     next_billing_date=today + timedelta(days=15), category='阅读', status='active'),
        Subscription(name='京东 Plus', amount=99.00, billing_cycle='yearly',
                     next_billing_date=today + timedelta(days=90), category='购物', status='paused'),
        Subscription(name='ChatGPT Plus', amount=140.00, billing_cycle='monthly',
                     next_billing_date=today + timedelta(days=7), category='工具', status='active'),
    ]
    
    for sub in sample_subscriptions:
        db.session.add(sub)
    
    settings = Settings(id=1, alert_days=7)
    db.session.add(settings)
    
    db.session.commit()

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
