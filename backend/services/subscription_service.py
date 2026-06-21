from datetime import date, timedelta
from models import db, Subscription, Settings


class SubscriptionService:
    @staticmethod
    def get_all_subscriptions(category=None, status=None, search=None):
        query = Subscription.query
        
        if category:
            query = query.filter(Subscription.category == category)
        if status:
            query = query.filter(Subscription.status == status)
        if search:
            query = query.filter(Subscription.name.ilike(f'%{search}%'))
        
        return query.order_by(Subscription.next_billing_date.asc()).all()

    @staticmethod
    def get_subscription_by_id(subscription_id):
        return Subscription.query.get(subscription_id)

    @staticmethod
    def create_subscription(data):
        subscription = Subscription(
            name=data['name'],
            amount=data['amount'],
            billing_cycle=data.get('billing_cycle', 'monthly'),
            next_billing_date=date.fromisoformat(data['next_billing_date']),
            category=data['category'],
            status=data.get('status', 'active')
        )
        db.session.add(subscription)
        db.session.commit()
        return subscription

    @staticmethod
    def update_subscription(subscription_id, data):
        subscription = Subscription.query.get(subscription_id)
        if not subscription:
            return None
        
        if 'name' in data:
            subscription.name = data['name']
        if 'amount' in data:
            subscription.amount = data['amount']
        if 'billing_cycle' in data:
            subscription.billing_cycle = data['billing_cycle']
        if 'next_billing_date' in data:
            subscription.next_billing_date = date.fromisoformat(data['next_billing_date'])
        if 'category' in data:
            subscription.category = data['category']
        if 'status' in data:
            subscription.status = data['status']
        
        db.session.commit()
        return subscription

    @staticmethod
    def delete_subscription(subscription_id):
        subscription = Subscription.query.get(subscription_id)
        if not subscription:
            return False
        
        db.session.delete(subscription)
        db.session.commit()
        return True

    @staticmethod
    def get_upcoming_subscriptions(days=7):
        today = date.today()
        target_date = today + timedelta(days=days)
        
        return Subscription.query.filter(
            Subscription.status == 'active',
            Subscription.next_billing_date >= today,
            Subscription.next_billing_date <= target_date
        ).order_by(Subscription.next_billing_date.asc()).all()


class StatsService:
    @staticmethod
    def get_summary():
        active_subscriptions = Subscription.query.filter_by(status='active').all()
        
        monthly_total = 0.0
        for sub in active_subscriptions:
            amount = float(sub.amount)
            cycle = sub.billing_cycle
            
            if cycle == 'weekly':
                monthly_total += amount * 4.33
            elif cycle == 'monthly':
                monthly_total += amount
            elif cycle == 'quarterly':
                monthly_total += amount / 3
            elif cycle == 'yearly':
                monthly_total += amount / 12
        
        active_count = len(active_subscriptions)
        
        today = date.today()
        end_of_month = date(today.year, today.month + 1, 1) if today.month < 12 else date(today.year + 1, 1, 1)
        upcoming_count = Subscription.query.filter(
            Subscription.status == 'active',
            Subscription.next_billing_date >= today,
            Subscription.next_billing_date < end_of_month
        ).count()
        
        return {
            'total_monthly': round(monthly_total, 2),
            'active_count': active_count,
            'upcoming_count': upcoming_count
        }

    @staticmethod
    def get_by_category():
        active_subscriptions = Subscription.query.filter_by(status='active').all()
        
        category_totals = {}
        total = 0.0
        
        for sub in active_subscriptions:
            amount = float(sub.amount)
            cycle = sub.billing_cycle
            
            monthly_amount = amount
            if cycle == 'weekly':
                monthly_amount = amount * 4.33
            elif cycle == 'quarterly':
                monthly_amount = amount / 3
            elif cycle == 'yearly':
                monthly_amount = amount / 12
            
            if sub.category not in category_totals:
                category_totals[sub.category] = 0.0
            category_totals[sub.category] += monthly_amount
            total += monthly_amount
        
        result = []
        for category, amount in category_totals.items():
            percentage = (amount / total * 100) if total > 0 else 0
            result.append({
                'category': category,
                'amount': round(amount, 2),
                'percentage': round(percentage, 1)
            })
        
        return sorted(result, key=lambda x: x['amount'], reverse=True)

    @staticmethod
    def get_trend(months=6):
        today = date.today()
        result = []
        
        for i in range(months - 1, -1, -1):
            month_date = date(today.year, today.month - i, 1) if today.month > i else date(today.year - 1, 12 + today.month - i, 1)
            
            month_total = 0.0
            active_subscriptions = Subscription.query.filter_by(status='active').all()
            
            for sub in active_subscriptions:
                amount = float(sub.amount)
                cycle = sub.billing_cycle
                
                monthly_amount = amount
                if cycle == 'weekly':
                    monthly_amount = amount * 4.33
                elif cycle == 'quarterly':
                    monthly_amount = amount / 3
                elif cycle == 'yearly':
                    monthly_amount = amount / 12
                
                month_total += monthly_amount
            
            result.append({
                'month': month_date.strftime('%Y-%m'),
                'amount': round(month_total, 2)
            })
        
        return result


class SettingsService:
    @staticmethod
    def get_settings():
        settings = Settings.query.get(1)
        if not settings:
            settings = Settings(id=1, alert_days=7)
            db.session.add(settings)
            db.session.commit()
        return settings

    @staticmethod
    def update_settings(data):
        settings = Settings.query.get(1)
        if not settings:
            settings = Settings(id=1, alert_days=data.get('alert_days', 7))
            db.session.add(settings)
        else:
            if 'alert_days' in data:
                settings.alert_days = data['alert_days']
        
        db.session.commit()
        return settings
