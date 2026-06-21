from apscheduler.schedulers.background import BackgroundScheduler
from datetime import date, timedelta
from models import db, Subscription
from app import create_app

app = create_app()

def check_upcoming_bills():
    with app.app_context():
        from services.subscription_service import SettingsService
        
        settings = SettingsService.get_settings()
        alert_days = settings.alert_days
        
        today = date.today()
        target_date = today + timedelta(days=alert_days)
        
        upcoming = Subscription.query.filter(
            Subscription.status == 'active',
            Subscription.next_billing_date >= today,
            Subscription.next_billing_date <= target_date
        ).all()
        
        print(f'[预警检查] 发现 {len(upcoming)} 个订阅将在 {alert_days} 天内扣费')
        for sub in upcoming:
            days_until = (sub.next_billing_date - today).days
            print(f'  - {sub.name}: ¥{sub.amount} ({days_until}天后)')
        
        return upcoming

def start_scheduler():
    scheduler = BackgroundScheduler()
    
    scheduler.add_job(
        check_upcoming_bills,
        'cron',
        hour=9,
        minute=0,
        id='daily_alert_check',
        replace_existing=True
    )
    
    scheduler.start()
    print('定时任务已启动：每天 9:00 检查即将扣费的订阅')
    
    return scheduler

if __name__ == '__main__':
    check_upcoming_bills()
    
    try:
        scheduler = start_scheduler()
        app.run(debug=True, port=5000)
    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown()
