from django.db import migrations, connection

def alter_oculos_to_jsonb(apps, schema_editor):
    if connection.vendor == 'postgresql':
        schema_editor.execute("""
            ALTER TABLE core_pessoa
            ALTER COLUMN oculos DROP DEFAULT,
            ALTER COLUMN oculos DROP NOT NULL,
            ALTER COLUMN oculos TYPE text USING oculos::text;
        """)
        schema_editor.execute("""
            ALTER TABLE core_pessoa
            ALTER COLUMN oculos TYPE jsonb USING oculos::jsonb;
        """)

class Migration(migrations.Migration):

    dependencies = [
        ("core", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(alter_oculos_to_jsonb),
    ]
