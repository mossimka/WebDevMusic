# Generated by Django 5.1.7 on 2025-04-18 14:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_favorite'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='product',
            name='likes',
        ),
    ]
