# Generated by Django 5.2 on 2025-04-05 01:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0024_alter_jogo_modo'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pessoa',
            name='animal_de_estimacao',
            field=models.JSONField(default=list),
        ),
    ]
