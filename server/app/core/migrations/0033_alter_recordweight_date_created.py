# Generated by Django 3.2.18 on 2023-03-26 22:37

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0032_alter_recordweight_date_created'),
    ]

    operations = [
        migrations.AlterField(
            model_name='recordweight',
            name='date_created',
            field=models.DateTimeField(default=datetime.datetime(2023, 3, 26, 22, 37, 15, 243306)),
        ),
    ]
