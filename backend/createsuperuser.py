# comando Render: python manage.py makemigrations && python manage.py migrate && python createsuperuser.py && python manage.py loaddata core/fixtures/pessoas.json && gunicorn backend.wsgi:application --bind 0.0.0.0:10000 --log-file -
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

if not User.objects.filter(username="admin").exists():
    User.objects.create_superuser("sabrina", "admin@example.com", "eusoulegal")
    print("Superusuário criado.")
else:
    print("Superusuário já existe.")
