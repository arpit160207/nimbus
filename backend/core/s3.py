import boto3
from botocore.exceptions import NoCredentialsError, ClientError
from backend.core.config import settings
from fastapi import UploadFile, HTTPException
import mimetypes

class S3Service:
    def __init__(self):
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION
        )
        self.bucket = settings.AWS_BUCKET_NAME

    def upload_file(self, file: UploadFile, object_name: str):
        try:
            # Check content type
            content_type = file.content_type or mimetypes.guess_type(file.filename)[0] or 'application/octet-stream'
            
            self.s3_client.upload_fileobj(
                file.file,
                self.bucket,
                object_name,
                ExtraArgs={'ContentType': content_type}
            )
            return True
        except ClientError as e:
            print(f"S3 Upload Error: {e}")
            raise HTTPException(status_code=500, detail="Failed to upload file to S3")

    def delete_file(self, object_name: str):
        try:
            self.s3_client.delete_object(Bucket=self.bucket, Key=object_name)
            return True
        except ClientError as e:
            print(f"S3 Delete Error: {e}")
            raise HTTPException(status_code=500, detail="Failed to delete file from S3")

    def generate_presigned_url(self, object_name: str, expiration=3600):
        try:
            response = self.s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket, 'Key': object_name},
                ExpiresIn=expiration
            )
            return response
        except ClientError as e:
            print(f"S3 URL Generation Error: {e}")
            return None

    def list_files(self, prefix: str = ""):
        try:
            response = self.s3_client.list_objects_v2(Bucket=self.bucket, Prefix=prefix)
            files = []
            if 'Contents' in response:
                for obj in response['Contents']:
                    # Sketchy way to separate folders if needed, but flat listing for now
                    if obj['Size'] > 0: # Ignore folder markers if any
                        files.append({
                            "name": obj['Key'].split('/')[-1],
                            "size": obj['Size'],
                            "key": obj['Key']
                        })
            return files
        except ClientError as e:
            print(f"S3 List Error: {e}")
            return []

s3_service = S3Service()
