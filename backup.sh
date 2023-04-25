#!/bin/bash

# Define variables
CONTAINER_NAME=opabargroup_db_1
DB_NAME=devdb
S3_BUCKET=opabargroup
S3_KEY=database_backup_$(date +"%Y-%m-%d_%H-%M-%S").sql.gz

# Create backup directory inside container
sudo docker exec $CONTAINER_NAME sh -c "mkdir -p /backup"

# Run backup command inside container
sudo docker exec $CONTAINER_NAME sh -c "pg_dump -U devuser $DB_NAME | gzip > /backup/$S3_KEY"

# Copy backup file to local
sudo docker cp $CONTAINER_NAME:/backup/$S3_KEY /tmp


# Copy backup local file to S3 bucket
aws s3 cp /tmp/$S3_KEY s3://$S3_BUCKET/$S3_KEY

# Delete backup file from container and local
sudo docker exec $CONTAINER_NAME sh -c "rm /backup/$S3_KEY"
sudo rm /tmp/$S3_KEY