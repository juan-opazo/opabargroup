# Generated by Django 3.2.18 on 2023-03-19 16:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='recordweight',
            name='item',
            field=models.IntegerField(),
        ),
    ]
